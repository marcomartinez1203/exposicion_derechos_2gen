/**
 * Presentation Controller — Enhanced
 * Slides, particles, animations, keyboard, touch, overview
 */
(function () {
  'use strict';

  const slides = Array.from(document.querySelectorAll('.slide'));
  const progressFill = document.getElementById('progressFill');
  const slideCounter = document.getElementById('slideCounter');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const indicatorsContainer = document.getElementById('slideIndicators');
  const keyboardHint = document.getElementById('keyboardHint');
  const hintClose = document.getElementById('hintClose');
  const slideOverview = document.getElementById('slideOverview');
  const overviewBackdrop = document.getElementById('overviewBackdrop');
  const overviewGrid = document.getElementById('overviewGrid');
  const particlesContainer = document.getElementById('particles');

  const TOTAL = slides.length;
  let current = 0;
  let transitioning = false;
  let touchStartX = 0;

  const titles = [
    'Portada',
    '¿Qué son los DESC?',
    'Origen Histórico',
    'Papel del Estado',
    'Progresividad',
    'Fundamentos Filosóficos',
    'Tratados Internacionales',
    'Derechos (Parte I)',
    'Derechos (Parte II)',
    'Interdependencia',
    '¡Gracias!'
  ];

  // =============== INIT ===============
  function init() {
    createIndicators();
    createOverviewItems();
    createParticles();
    createFloatingShapes();
    updateUI();
    bindEvents();
    showKeyboardHint();
  }

  // =============== INDICATORS ===============
  function createIndicators() {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('indicator');
      dot.setAttribute('aria-label', `Ir a diapositiva ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      indicatorsContainer.appendChild(dot);
    });
  }

  // =============== OVERVIEW ===============
  function createOverviewItems() {
    slides.forEach((_, i) => {
      const item = document.createElement('div');
      item.classList.add('overview-item');
      item.innerHTML = `
        <span class="overview-num">${String(i + 1).padStart(2, '0')}</span>
        <span class="overview-label">${titles[i]}</span>
      `;
      item.addEventListener('click', () => {
        goToSlide(i);
        toggleOverview(false);
      });
      overviewGrid.appendChild(item);
    });
  }

  // =============== PARTICLES — MORE DYNAMIC ===============
  function createParticles() {
    const colors = [
      'hsla(0, 85%, 55%, 0.25)',
      'hsla(0, 80%, 62%, 0.2)',
      'hsla(145, 80%, 42%, 0.2)',
      'hsla(145, 85%, 55%, 0.15)',
      'hsla(355, 90%, 55%, 0.12)'
    ];

    for (let i = 0; i < 35; i++) {
      const p = document.createElement('div');
      p.classList.add('particle');
      const size = Math.random() * 5 + 2;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.left = Math.random() * 100 + '%';
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.animationDuration = (Math.random() * 25 + 15) + 's';
      p.style.animationDelay = (Math.random() * 20) + 's';
      if (size > 5) {
        p.style.boxShadow = `0 0 ${size * 2}px ${p.style.background}`;
      }
      particlesContainer.appendChild(p);
    }
  }

  // =============== FLOATING GEOMETRIC SHAPES ===============
  function createFloatingShapes() {
    const shapes = ['◆', '▲', '◯', '▪'];
    const container = particlesContainer;

    for (let i = 0; i < 8; i++) {
      const el = document.createElement('div');
      el.textContent = shapes[Math.floor(Math.random() * shapes.length)];
      el.style.cssText = `
        position: absolute;
        font-size: ${Math.random() * 14 + 8}px;
        color: hsla(0, 85%, 55%, ${Math.random() * 0.06 + 0.02});
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        pointer-events: none;
        animation: shapeFloat ${Math.random() * 20 + 25}s ease-in-out infinite alternate;
        animation-delay: ${Math.random() * 10}s;
      `;
      container.appendChild(el);
    }

    // Add the keyframe dynamically
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shapeFloat {
        0% { transform: translate(0, 0) rotate(0deg); opacity: 0.5; }
        25% { transform: translate(30px, -20px) rotate(45deg); opacity: 1; }
        50% { transform: translate(-10px, 30px) rotate(90deg); opacity: 0.6; }
        75% { transform: translate(20px, -10px) rotate(180deg); opacity: 0.9; }
        100% { transform: translate(-20px, 20px) rotate(360deg); opacity: 0.5; }
      }
    `;
    document.head.appendChild(style);
  }

  // =============== NAVIGATION ===============
  function goToSlide(index, direction = null) {
    if (transitioning || index === current || index < 0 || index >= TOTAL) return;
    transitioning = true;

    const dir = direction || (index > current ? 'next' : 'prev');
    const curr = slides[current];
    const next = slides[index];

    // Exit current
    curr.classList.remove('slide-active');
    curr.classList.add(dir === 'next' ? 'slide-exit-left' : 'slide-exit-right');

    // Prepare next
    next.style.transition = 'none';
    next.classList.remove('slide-exit-left', 'slide-exit-right');
    next.style.transform = dir === 'next' ? 'translateX(50px) scale(0.98)' : 'translateX(-50px) scale(0.98)';
    next.style.opacity = '0';
    next.style.visibility = 'visible';

    void next.offsetHeight; // force reflow

    next.style.transition = '';
    next.style.transform = '';
    next.style.opacity = '';
    next.classList.add('slide-active');

    current = index;
    updateUI();

    setTimeout(() => {
      curr.classList.remove('slide-exit-left', 'slide-exit-right');
      transitioning = false;
    }, 620);
  }

  function nextSlide() { if (current < TOTAL - 1) goToSlide(current + 1, 'next'); }
  function prevSlide() { if (current > 0) goToSlide(current - 1, 'prev'); }

  // =============== UI UPDATE ===============
  function updateUI() {
    const pct = (current / (TOTAL - 1)) * 100;
    progressFill.style.width = pct + '%';
    slideCounter.textContent = `${current + 1} / ${TOTAL}`;

    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === TOTAL - 1;

    indicatorsContainer.querySelectorAll('.indicator').forEach((d, i) =>
      d.classList.toggle('active', i === current)
    );

    overviewGrid.querySelectorAll('.overview-item').forEach((item, i) =>
      item.classList.toggle('current', i === current)
    );
  }

  // =============== OVERVIEW TOGGLE ===============
  function toggleOverview(show) {
    if (show === undefined) show = !slideOverview.classList.contains('visible');
    slideOverview.classList.toggle('visible', show);
  }

  // =============== KEYBOARD HINT ===============
  function showKeyboardHint() {
    if (sessionStorage.getItem('hintShown')) return;
    setTimeout(() => keyboardHint.classList.add('visible'), 1500);
  }

  function hideKeyboardHint() {
    keyboardHint.classList.remove('visible');
    sessionStorage.setItem('hintShown', 'true');
  }

  // =============== EVENTS ===============
  function bindEvents() {
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    document.addEventListener('keydown', (e) => {
      if (keyboardHint.classList.contains('visible')) { hideKeyboardHint(); return; }

      if (slideOverview.classList.contains('visible')) {
        if (e.key === 'Escape') toggleOverview(false);
        return;
      }

      switch (e.key) {
        case 'ArrowRight': case 'ArrowDown': case ' ': case 'PageDown':
          e.preventDefault(); nextSlide(); break;
        case 'ArrowLeft': case 'ArrowUp': case 'PageUp':
          e.preventDefault(); prevSlide(); break;
        case 'Home': e.preventDefault(); goToSlide(0); break;
        case 'End': e.preventDefault(); goToSlide(TOTAL - 1); break;
        case 'Escape': e.preventDefault(); toggleOverview(); break;
        case 'f': case 'F': e.preventDefault(); toggleFullscreen(); break;
      }
    });

    // Touch
    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 60) diff > 0 ? nextSlide() : prevSlide();
    }, { passive: true });

    // Hint
    hintClose.addEventListener('click', hideKeyboardHint);
    keyboardHint.addEventListener('click', (e) => { if (e.target === keyboardHint) hideKeyboardHint(); });

    // Overview
    overviewBackdrop.addEventListener('click', () => toggleOverview(false));

    // Wheel navigation disabled
  }

  // =============== FULLSCREEN ===============
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  // =============== GO ===============
  document.addEventListener('DOMContentLoaded', init);
})();
