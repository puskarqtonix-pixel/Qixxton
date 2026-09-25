(() => {
  const root = document.documentElement;
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Theme: remember visitor choice
  const savedTheme = localStorage.getItem('qixton-theme');
  const preferredDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (preferredDark ? 'dark' : 'light');
  root.dataset.theme = initialTheme;

  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const updateThemeMeta = () => {
    if (themeMeta) themeMeta.setAttribute('content', root.dataset.theme === 'dark' ? '#090811' : '#f8f7ff');
  };
  updateThemeMeta();

  document.querySelectorAll('#themeToggle, .theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('qixton-theme', root.dataset.theme);
      updateThemeMeta();
    });
  });

  // Cursor glow
  const glow = document.querySelector('.cursor-glow');
  window.addEventListener('pointermove', e => {
    if (!glow) return;
    glow.animate(
      {left:`${e.clientX}px`, top:`${e.clientY}px`},
      {duration:650,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'}
    );
  }, {passive:true});

  // Real navigation
  const siteNav = document.getElementById('siteNav');
  window.addEventListener('scroll', () => {
    if (siteNav) siteNav.classList.toggle('scrolled', window.scrollY > 25);
  }, {passive:true});

  const mobileBtn = document.getElementById('navMobileBtn');
  const mobileMenu = document.getElementById('navMenuV2');
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  }

  document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', e => {
      if (window.innerWidth <= 1000) {
        e.preventDefault();
        const parent = toggle.closest('.nav-dropdown');
        document.querySelectorAll('.nav-dropdown.open').forEach(d => {
          if (d !== parent) d.classList.remove('open');
        });
        parent?.classList.toggle('open');
      }
    });
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.nav-dropdown') && window.innerWidth <= 1000) {
      document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
    }
  });

  // Gentle hero movement
  const hero = document.getElementById('heroReference');
  window.addEventListener('scroll', () => {
    if (!hero) return;
    const y = Math.min(window.scrollY, window.innerHeight);
    hero.style.transform = `scale(${1.001 + y/190000}) translateY(${y/240}px)`;
  }, {passive:true});

  // Interactive scroll showcase
  const steps = [...document.querySelectorAll('.story-step')];
  const cards = [...document.querySelectorAll('.stage-service-card')];
  const stageIndex = document.getElementById('stageIndex');
  const stageEyebrow = document.getElementById('stageEyebrow');
  const stageTitle = document.getElementById('stageTitle');
  const stageBody = document.getElementById('stageBody');
  const stageLink = document.getElementById('stageLink');

  const serviceData = {
    web: {
      index:'01 / 05',
      eyebrow:'WEB DESIGN',
      title:'A premium digital first impression.',
      body:'Custom-built websites designed around trust, clarity, speed and conversion.',
      link:'web-design.html',
      linkText:'Open Web Design Pricing →'
    },
    seo: {
      index:'02 / 05',
      eyebrow:'SEO',
      title:'Search visibility built around intent.',
      body:'Technical, local and content-led SEO that helps customers discover your business.',
      link:'seo.html',
      linkText:'Open SEO Pricing →'
    },
    social: {
      index:'03 / 05',
      eyebrow:'SOCIAL MEDIA',
      title:'Turn attention into brand trust.',
      body:'Content, reels and social systems designed to move people toward inquiry and action.',
      link:'social-media.html',
      linkText:'Open Social Pricing →'
    },
    ads: {
      index:'04 / 05',
      eyebrow:'PAID ADS',
      title:'Make paid attention measurable.',
      body:'Google and Meta campaigns connected to targeting, creative and stronger conversion paths.',
      link:'paid-ads.html',
      linkText:'Open Ads Pricing →'
    },
    ai: {
      index:'05 / 05',
      eyebrow:'AI SEARCH',
      title:'Make the brand easier for AI to understand.',
      body:'AEO, GEO, schema and entity clarity for AI-assisted discovery and answer engines.',
      link:'ai-search.html',
      linkText:'Open AI Search Pricing →'
    }
  };

  function setService(name) {
    const data = serviceData[name];
    if (!data) return;
    steps.forEach(s => s.classList.toggle('active', s.dataset.step === name));
    cards.forEach(c => c.classList.toggle('active', c.dataset.serviceCard === name));
    if (stageIndex) stageIndex.textContent = data.index;
    if (stageEyebrow) stageEyebrow.textContent = data.eyebrow;
    if (stageTitle) stageTitle.textContent = data.title;
    if (stageBody) stageBody.textContent = data.body;
    if (stageLink) {
      stageLink.href = data.link;
      stageLink.textContent = data.linkText;
    }
  }

  if (steps.length) {
    const io = new IntersectionObserver(entries => {
      const active = entries
        .filter(e => e.isIntersecting)
        .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (active) setService(active.target.dataset.step);
    }, {rootMargin:'-32% 0px -32% 0px', threshold:[.2,.4,.6]});
    steps.forEach(s => io.observe(s));
  }

  // Reuse theme + nav behavior on inner/service pages
  const innerMenuBtn = document.getElementById('innerMenuBtn');
  const innerNavLinks = document.getElementById('innerNavLinks');
  if (innerMenuBtn && innerNavLinks) {
    innerMenuBtn.addEventListener('click', () => innerNavLinks.classList.toggle('open'));
  }
})();

// Prefill the package enquiry page from Add Package buttons.
(() => {
  const serviceSelect = document.getElementById('serviceSelect');
  const packageInput = document.getElementById('packageInput');
  const selectedPrice = document.getElementById('selectedPrice');
  if (!serviceSelect || !packageInput) return;
  const params = new URLSearchParams(window.location.search);
  const service = params.get('service') || '';
  const pkg = params.get('package') || '';
  const price = params.get('price') || '';
  if (service) serviceSelect.value = service;
  if (pkg) packageInput.value = pkg;
  if (selectedPrice) selectedPrice.value = price;
  const summaryService = document.getElementById('summaryService');
  const summaryPackage = document.getElementById('summaryPackage');
  const refreshSummary = () => {
    if (summaryService) summaryService.textContent = serviceSelect.value || 'Qixton Service';
    if (summaryPackage) summaryPackage.textContent = [packageInput.value, selectedPrice?.value].filter(Boolean).join(' · ') || 'Choose a package in the form';
  };
  serviceSelect.addEventListener('change', refreshSummary);
  packageInput.addEventListener('input', refreshSummary);
  refreshSummary();
})();
