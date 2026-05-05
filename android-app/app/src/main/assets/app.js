(function () {
  'use strict';

  const TOTAL_CHAPTERS = 20;
  const STORAGE_KEY = 'ri-reader';

  // State
  let state = {
    currentChapter: null,
    sortAsc: true,
    readChapters: new Set(),
    settings: {
      imgWidth: 100,
      imgGap: 0,
      bgColor: '#0a0a0a'
    }
  };

  // Load saved state
  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved) {
        state.sortAsc = saved.sortAsc ?? true;
        state.readChapters = new Set(saved.readChapters || []);
        if (saved.settings) {
          state.settings = { ...state.settings, ...saved.settings };
        }
      }
    } catch (e) { /* ignore */ }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        sortAsc: state.sortAsc,
        readChapters: Array.from(state.readChapters),
        settings: state.settings
      }));
    } catch (e) { /* ignore */ }
  }

  // DOM Elements
  const homeScreen = document.getElementById('home-screen');
  const readerScreen = document.getElementById('reader-screen');
  const chapterList = document.getElementById('chapter-list');
  const readerImages = document.getElementById('reader-images');
  const readerTitle = document.getElementById('reader-chapter-title');
  const topBar = document.getElementById('reader-topbar');
  const bottomBar = document.getElementById('reader-bottombar');
  const progressBar = document.getElementById('progress-bar');
  const progressFill = document.getElementById('progress-fill');
  const pageIndicator = document.getElementById('page-indicator');
  const prevBtn = document.getElementById('prev-chapter-btn');
  const nextBtn = document.getElementById('next-chapter-btn');
  const backBtn = document.getElementById('back-btn');
  const sortBtn = document.getElementById('sort-btn');
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  const settingsBtn = document.getElementById('settings-btn');
  const settingsPanel = document.getElementById('settings-panel');
  const settingsClose = document.getElementById('settings-close');
  const chapterSelector = document.getElementById('chapter-selector');
  const selectorClose = document.getElementById('selector-close');
  const selectorList = document.getElementById('selector-list');
  const imgWidthSlider = document.getElementById('img-width-slider');
  const imgWidthValue = document.getElementById('img-width-value');
  const imgGapSlider = document.getElementById('img-gap-slider');
  const imgGapValue = document.getElementById('img-gap-value');

  // Build chapter list on home screen
  function renderChapterList() {
    chapterList.innerHTML = '';
    const chapters = [];
    for (let i = 1; i <= TOTAL_CHAPTERS; i++) chapters.push(i);
    if (!state.sortAsc) chapters.reverse();

    chapters.forEach(num => {
      const card = document.createElement('div');
      card.className = 'chapter-card' + (state.readChapters.has(num) ? ' read' : '');
      card.innerHTML = '<span class="ch-num">Ch. ' + num + '</span>';
      card.addEventListener('click', () => openChapter(num));
      chapterList.appendChild(card);
    });
  }

  // Open a chapter
  function openChapter(num) {
    if (!CHAPTERS_DATA[num]) return;
    state.currentChapter = num;
    state.readChapters.add(num);
    saveState();

    homeScreen.classList.remove('active');
    readerScreen.classList.add('active');
    readerTitle.textContent = 'Chapter ' + num;

    // Update navigation buttons
    prevBtn.disabled = num <= 1;
    nextBtn.disabled = num >= TOTAL_CHAPTERS;

    // Render images
    renderReaderImages(num);

    // Scroll to top
    window.scrollTo(0, 0);

    // Show bars initially
    showBars();

    // Update URL hash
    if (window.location.hash === '#chapter-' + num) {
      history.replaceState({ chapter: num }, '', '#chapter-' + num);
    } else {
      history.pushState({ chapter: num }, '', '#chapter-' + num);
    }
  }

  // Render images in reader
  function renderReaderImages(num) {
    const images = CHAPTERS_DATA[num];
    readerImages.innerHTML = '';

    // Apply settings
    applyReaderSettings();

    images.forEach((url, i) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'img-wrapper';
      wrapper.dataset.index = i;

      const img = document.createElement('img');
      img.dataset.src = url;
      img.alt = 'Chapter ' + num + ' - Page ' + (i + 1);
      img.loading = 'lazy';
      img.decoding = 'async';

      // Placeholder
      const placeholder = document.createElement('div');
      placeholder.className = 'img-placeholder';
      placeholder.innerHTML = '<div class="spinner"></div>';

      wrapper.appendChild(placeholder);
      wrapper.appendChild(img);

      // Load image
      img.onload = function () {
        placeholder.style.display = 'none';
        img.style.opacity = '1';
      };
      img.onerror = function () {
        placeholder.innerHTML = 'Failed to load image ' + (i + 1);
      };
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.3s';

      readerImages.appendChild(wrapper);
    });

    // Start lazy loading with IntersectionObserver
    observeImages();

    // Add end card
    addEndCard(num);

    // Update page count
    pageIndicator.textContent = '1 / ' + images.length;
  }

  // Lazy load with IntersectionObserver
  function observeImages() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            delete img.dataset.src;
          }
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '500px 0px' });

    readerImages.querySelectorAll('img[data-src]').forEach(img => {
      observer.observe(img);
    });
  }

  // Add end-of-chapter card
  function addEndCard(num) {
    const endCard = document.createElement('div');
    endCard.className = 'chapter-end';

    let html = '<h3>End of Chapter ' + num + '</h3>';
    html += '<p>Thanks for reading!</p>';
    html += '<div class="chapter-end-buttons">';

    if (num < TOTAL_CHAPTERS) {
      html += '<button class="btn-primary" id="end-next-btn">Next Chapter &rarr;</button>';
    }
    html += '<button class="btn-secondary" id="end-home-btn">Chapter List</button>';
    html += '</div>';

    endCard.innerHTML = html;
    readerImages.appendChild(endCard);

    const endNext = document.getElementById('end-next-btn');
    if (endNext) {
      endNext.addEventListener('click', () => openChapter(num + 1));
    }
    document.getElementById('end-home-btn').addEventListener('click', goHome);
  }

  // Go back to home
  function goHome() {
    readerScreen.classList.remove('active');
    homeScreen.classList.add('active');
    state.currentChapter = null;
    readerImages.innerHTML = '';
    renderChapterList();
    history.pushState(null, '', '#');
  }

  // Toggle bars visibility
  let barsVisible = true;
  let barsTimeout = null;

  function showBars() {
    barsVisible = true;
    topBar.classList.add('visible');
    bottomBar.classList.add('visible');
    progressBar.classList.add('visible');
    resetBarsTimeout();
  }

  function resetBarsTimeout() {
    clearTimeout(barsTimeout);
    barsTimeout = setTimeout(hideBars, 4000);
  }

  function hideBars() {
    barsVisible = false;
    topBar.classList.remove('visible');
    bottomBar.classList.remove('visible');
    progressBar.classList.remove('visible');
  }

  function toggleBars() {
    if (barsVisible) {
      hideBars();
    } else {
      showBars();
    }
  }

  // Scroll tracking
  let scrollTicking = false;
  function onScroll() {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        updateProgress();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }

  function updateProgress() {
    if (!state.currentChapter) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressFill.style.width = progress + '%';

    // Update page indicator
    const images = readerImages.querySelectorAll('.img-wrapper');
    let currentPage = 1;
    const viewportMiddle = scrollTop + window.innerHeight / 2;
    images.forEach((wrapper, i) => {
      if (wrapper.offsetTop < viewportMiddle) {
        currentPage = i + 1;
      }
    });
    const total = CHAPTERS_DATA[state.currentChapter]?.length || 0;
    pageIndicator.textContent = currentPage + ' / ' + total;

    // Show/hide scroll-to-top button
    if (scrollTop > 800) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }

  // Apply reader settings
  function applyReaderSettings() {
    readerImages.style.setProperty('--reader-width', state.settings.imgWidth + '%');
    readerImages.style.setProperty('--reader-gap', state.settings.imgGap + 'px');
    document.getElementById('reader-screen').style.backgroundColor = state.settings.bgColor;
  }

  // Settings handlers
  function initSettings() {
    imgWidthSlider.value = state.settings.imgWidth;
    imgWidthValue.textContent = state.settings.imgWidth + '%';
    imgGapSlider.value = state.settings.imgGap;
    imgGapValue.textContent = state.settings.imgGap + 'px';

    // Mark active bg
    document.querySelectorAll('.bg-option').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.bg === state.settings.bgColor);
    });

    imgWidthSlider.addEventListener('input', function () {
      state.settings.imgWidth = parseInt(this.value);
      imgWidthValue.textContent = this.value + '%';
      applyReaderSettings();
      saveState();
    });

    imgGapSlider.addEventListener('input', function () {
      state.settings.imgGap = parseInt(this.value);
      imgGapValue.textContent = this.value + 'px';
      applyReaderSettings();
      saveState();
    });

    document.querySelectorAll('.bg-option').forEach(btn => {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.bg-option').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        state.settings.bgColor = this.dataset.bg;
        applyReaderSettings();
        saveState();
      });
    });
  }

  // Chapter selector
  function openChapterSelector() {
    selectorList.innerHTML = '';
    for (let i = 1; i <= TOTAL_CHAPTERS; i++) {
      const item = document.createElement('div');
      item.className = 'selector-item' + (i === state.currentChapter ? ' current' : '');
      item.textContent = 'Chapter ' + i;
      item.addEventListener('click', () => {
        closeChapterSelector();
        openChapter(i);
      });
      selectorList.appendChild(item);
    }
    chapterSelector.classList.add('active');
  }

  function closeChapterSelector() {
    chapterSelector.classList.remove('active');
  }

  // Event listeners
  function initEventListeners() {
    // Back button
    backBtn.addEventListener('click', goHome);

    // Sort
    sortBtn.addEventListener('click', () => {
      state.sortAsc = !state.sortAsc;
      saveState();
      renderChapterList();
    });

    // Chapter navigation
    prevBtn.addEventListener('click', () => {
      if (state.currentChapter > 1) openChapter(state.currentChapter - 1);
    });
    nextBtn.addEventListener('click', () => {
      if (state.currentChapter < TOTAL_CHAPTERS) openChapter(state.currentChapter + 1);
    });

    // Tap to toggle bars
    readerImages.addEventListener('click', (e) => {
      if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'A') {
        toggleBars();
      }
    });

    // Scroll
    window.addEventListener('scroll', onScroll, { passive: true });

    // Scroll to top
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Keep bars visible when interacting with topbar/bottombar
    topBar.addEventListener('click', (e) => {
      e.stopPropagation();
      resetBarsTimeout();
    });
    bottomBar.addEventListener('click', (e) => {
      e.stopPropagation();
      resetBarsTimeout();
    });

    // Settings
    settingsBtn.addEventListener('click', () => {
      settingsPanel.classList.add('active');
    });
    settingsClose.addEventListener('click', () => {
      settingsPanel.classList.remove('active');
    });
    settingsPanel.addEventListener('click', (e) => {
      if (e.target === settingsPanel) settingsPanel.classList.remove('active');
    });

    // Chapter title click -> selector
    readerTitle.addEventListener('click', (e) => {
      e.stopPropagation();
      openChapterSelector();
    });
    selectorClose.addEventListener('click', closeChapterSelector);
    chapterSelector.addEventListener('click', (e) => {
      if (e.target === chapterSelector) closeChapterSelector();
    });

    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
      if (e.state && e.state.chapter) {
        openChapter(e.state.chapter);
      } else {
        const hash = window.location.hash;
        const match = hash.match(/^#chapter-(\d+)$/);
        if (match) {
          const num = parseInt(match[1]);
          if (num >= 1 && num <= TOTAL_CHAPTERS) {
            openChapter(num);
            return;
          }
        }
        if (state.currentChapter) goHome();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!state.currentChapter) return;
      if (e.key === 'ArrowLeft' && state.currentChapter > 1) {
        openChapter(state.currentChapter - 1);
      } else if (e.key === 'ArrowRight' && state.currentChapter < TOTAL_CHAPTERS) {
        openChapter(state.currentChapter + 1);
      } else if (e.key === 'Escape') {
        if (settingsPanel.classList.contains('active')) {
          settingsPanel.classList.remove('active');
        } else if (chapterSelector.classList.contains('active')) {
          closeChapterSelector();
        } else {
          goHome();
        }
      }
    });

    // Swipe detection for chapter navigation
    let touchStartX = 0;
    let touchStartY = 0;
    readerImages.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    readerImages.addEventListener('touchend', (e) => {
      const deltaX = e.changedTouches[0].screenX - touchStartX;
      const deltaY = e.changedTouches[0].screenY - touchStartY;
      if (Math.abs(deltaX) > 100 && Math.abs(deltaX) > Math.abs(deltaY) * 2) {
        if (deltaX > 0 && state.currentChapter > 1) {
          openChapter(state.currentChapter - 1);
        } else if (deltaX < 0 && state.currentChapter < TOTAL_CHAPTERS) {
          openChapter(state.currentChapter + 1);
        }
      }
    }, { passive: true });
  }

  // Handle initial URL hash and hash changes
  function handleHash() {
    const hash = window.location.hash;
    const match = hash.match(/^#chapter-(\d+)$/);
    if (match) {
      const num = parseInt(match[1]);
      if (num >= 1 && num <= TOTAL_CHAPTERS) {
        openChapter(num);
        return;
      }
    }
  }

  function handleHashChange() {
    const hash = window.location.hash;
    const match = hash.match(/^#chapter-(\d+)$/);
    if (match) {
      const num = parseInt(match[1]);
      if (num >= 1 && num <= TOTAL_CHAPTERS && num !== state.currentChapter) {
        openChapter(num);
      }
    } else if (hash === '' || hash === '#') {
      if (state.currentChapter) goHome();
    }
  }

  // Service Worker registration
  function registerSW() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  }

  // Init
  function init() {
    loadState();
    renderChapterList();
    initSettings();
    initEventListeners();
    handleHash();
    registerSW();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
