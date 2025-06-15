// Global state
let currentTab = 'inference';
let loadedTabs = new Set(['inference']); // Start with inference loaded

// File structure based on actual directory structure
const fileStructure = {
    inference: {
        'images-000-027-commons-Arco_dei_Gavi_(Verona)-0-pictures': ['0', '1', '3'],
        'images-000-033-commons-Porte_de_Paris_(Lille)-0-pictures': ['0', '1', '2'],
        'images-000-034-commons-Events_at_Monumento_a_la_Revolución_(México)-0-pictures': ['0'],
        'images-000-034-commons-Monumento_a_la_Revolución_(México)_(cara_oriente)-0-pictures': ['0', '1'],
        'images-000-034-commons-Tapete_floral_en_el_Monumento_a_la_Revolución-0-pictures': ['0'],
        'images-000-123-commons-Monumental_Arch_of_Palmyra-0-pictures': ['0', '1'],
        'images-014-126-commons-Pont_de_la_Caille-0-pictures': ['0'],
        'images-014-161-commons-South_Stack_Lighthouse-0-pictures': ['0'],
        'images-017-511-commons-Barnard_Castle_Bridge-0-pictures': ['0'],
        'images-024-960-commons-Organ_of_the_Pécs_Cathedral-0-pictures': ['0'],
        'images-024-978-commons-Duomo_(Modena)_-_Interior-0-pictures': ['0'],
        'images-025-096-commons-North_portal_of_San_Nicola_(Bari)-0-pictures': ['0'],
        'images-025-118-commons-Wawel_Cathedral_-_southern_facade-0-pictures': ['0'],
        'images-025-118-commons-Wawel_Cathedral_-_western_facade-0-pictures': ['0', '1']
    },
    appearance: [0, 1, 2, 3, 4, 5],
    interpolation: [1, 2, 3, 4, 5]
};

function showTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from all tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected tab content
    document.getElementById(tabName).classList.add('active');

    // Add active class to clicked tab
    event.target.classList.add('active');
    currentTab = tabName;

    // Load content if not already loaded
    if (!loadedTabs.has(tabName)) {
        loadTabContent(tabName);
        loadedTabs.add(tabName);
    }
}

function loadTabContent(tabName) {
    switch (tabName) {
        case 'inference':
            loadInferenceResults();
            break;
        case 'appearance':
            loadAppearanceResults();
            break;
        case 'interpolation':
            loadInterpolationResults();
            break;
    }
}

function loadInferenceResults() {
    const container = document.getElementById('inference-results');
    const countElement = document.getElementById('inference-count');
    const scenes = Object.keys(fileStructure.inference);

    countElement.textContent = scenes.length;

    scenes.forEach((sceneName) => {
        const viewIndices = fileStructure.inference[sceneName];
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';

        // Clean up scene name for display
        const displayName = sceneName
            .replace(/images-\d+-\d+-commons-/, '')
            .replace(/-\d+-pictures$/, '')
            .replace(/[_()]/g, ' ')
            .replace(/Ã\u0081/g, 'á')
            .replace(/Ã\u0089/g, 'é');

        let mediaHtml = '';
        viewIndices.forEach(index => {
            mediaHtml += `
        <div class="media-item">
          <div class="media-label">Input View ${index}</div>
          <div class="media-content" onclick="openFullscreen('inference/${sceneName}/gt${index}.png', 'image')">
            <div class="loading-placeholder">Loading...</div>
            <img class="lazy-load" data-src="inference/${sceneName}/gt${index}.png" alt="Input View ${index}">
          </div>
        </div>
        <div class="media-item">
          <div class="media-label">Generated Novel Views ${index}</div>
          <div class="media-content" onclick="openFullscreen('inference/${sceneName}/gen${index}.gif', 'gif')">
            <div class="loading-placeholder">Loading...</div>
            <img class="lazy-load" data-src="inference/${sceneName}/gen${index}.gif" alt="Generated Novel Views ${index}">
          </div>
        </div>
      `;
        });

        resultItem.innerHTML = `
      <div class="result-title">Scene: ${displayName}</div>
      <div class="media-container">
        ${mediaHtml}
      </div>
    `;

        container.appendChild(resultItem);
    });

    // Lazy load images when they come into view
    observeImages();
}

function loadAppearanceResults() {
    const container = document.getElementById('appearance-results');
    const countElement = document.getElementById('appearance-count');
    const indices = fileStructure.appearance;

    countElement.textContent = indices.length;

    indices.forEach(i => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';

        resultItem.innerHTML = `
      <div class="result-title">Appearance-Controlled Generation ${i}</div>
      <div class="media-container">
        <div class="media-item">
          <div class="media-label">Input View</div>
          <div class="media-content" onclick="openFullscreen('applications/appearance_conditioned_gen/${i}_gt.png', 'image')">
            <div class="loading-placeholder">Loading...</div>
            <img class="lazy-load" data-src="applications/appearance_conditioned_gen/${i}_gt.png" alt="Input View ${i}">
          </div>
        </div>
        <div class="media-item">
          <div class="media-label">Appearance Condition</div>
          <div class="media-content" onclick="openFullscreen('applications/appearance_conditioned_gen/${i}_appearance.png', 'image')">
            <div class="loading-placeholder">Loading...</div>
            <img class="lazy-load" data-src="applications/appearance_conditioned_gen/${i}_appearance.png" alt="Appearance ${i}">
          </div>
        </div>
        <div class="media-item">
          <div class="media-label">Generated Novel Views </div>
          <div class="media-content" onclick="openFullscreen('applications/appearance_conditioned_gen/${i}_gen.gif', 'gif')">
            <div class="loading-placeholder">Loading...</div>
            <img class="lazy-load" data-src="applications/appearance_conditioned_gen/${i}_gen.gif" alt="Generated Novel Views ${i}">
          </div>
        </div>
      </div>
    `;

        container.appendChild(resultItem);
    });

    observeImages();
}

function loadInterpolationResults() {
    const container = document.getElementById('interpolation-results');
    const countElement = document.getElementById('interpolation-count');
    const sequences = fileStructure.interpolation;

    countElement.textContent = sequences.length;

    sequences.forEach(seqNum => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';

        resultItem.innerHTML = `
      <div class="result-title">Interpolation Sequence ${seqNum}</div>
      <div class="media-container">
        <div class="media-item">
          <div class="media-label">Start View</div>
          <div class="media-content" onclick="openFullscreen('applications/interpolation/${seqNum}_start.png', 'image')">
            <div class="loading-placeholder">Loading...</div>
            <img class="lazy-load" data-src="applications/interpolation/${seqNum}_start.png" alt="Start ${seqNum}">
          </div>
        </div>
        <div class="media-item">
          <div class="media-label">Interpolation (Start Appearance)</div>
          <div class="media-content" onclick="openFullscreen('applications/interpolation/${seqNum}_interp.gif', 'gif')">
            <div class="loading-placeholder">Loading...</div>
            <img class="lazy-load" data-src="applications/interpolation/${seqNum}_interp.gif" alt="Interpolation ${seqNum}">
          </div>
        </div>
        <div class="media-item">
          <div class="media-label">Interpolation (End Appearance)</div>
          <div class="media-content" onclick="openFullscreen('applications/interpolation/${seqNum}_interp_.gif', 'gif')">
            <div class="loading-placeholder">Loading...</div>
            <img class="lazy-load" data-src="applications/interpolation/${seqNum}_interp_.gif" alt="Interpolation End ${seqNum}">
          </div>
        </div>
        <div class="media-item">
          <div class="media-label">End View</div>
          <div class="media-content" onclick="openFullscreen('applications/interpolation/${seqNum}_end.png', 'image')">
            <div class="loading-placeholder">Loading...</div>
            <img class="lazy-load" data-src="applications/interpolation/${seqNum}_end.png" alt="End ${seqNum}">
          </div>
        </div>
      </div>
    `;

        container.appendChild(resultItem);
    });

    observeImages();
}

function observeImages() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const placeholder = img.previousElementSibling;
                img.src = img.dataset.src;
                img.onload = () => {
                    img.classList.add('loaded');
                    if (placeholder) {
                        placeholder.style.display = 'none';
                    }
                };
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('.lazy-load').forEach(img => {
        imageObserver.observe(img);
    });
}

function openFullscreen(src, type) {
    const overlay = document.getElementById('fullscreen-overlay');
    const mediaContainer = document.getElementById('fullscreen-media');

    let mediaElement;
    if (type === 'gif' || type === 'image') {
        mediaElement = document.createElement('img');
        mediaElement.src = src;
        mediaElement.style.maxWidth = '100%';
        mediaElement.style.maxHeight = '100%';
    }

    mediaContainer.innerHTML = '';
    mediaContainer.appendChild(mediaElement);
    overlay.style.display = 'flex';
}

function closeFullscreen() {
    document.getElementById('fullscreen-overlay').style.display = 'none';
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
    loadInferenceResults();
});

// Handle escape key for fullscreen
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeFullscreen();
    }
});