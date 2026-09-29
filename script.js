(() => {
  const root = document.documentElement;
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Light theme only
  root.removeAttribute('data-theme');

  // Real navigation
  const siteNav = document.getElementById('siteNav');
  window.addEventListener('scroll', () => {
    if (siteNav) siteNav.classList.toggle('scrolled', window.scrollY > 25);
  }, {passive:true});

  const mobileBtn = document.getElementById('navMobileBtn');
  const mobileMenu = document.getElementById('navMenuV2');
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => { const open=mobileMenu.classList.toggle('open'); mobileBtn.setAttribute('aria-expanded', String(open)); mobileBtn.setAttribute('aria-label', open ? 'Close menu':'Open menu'); });
  }

  document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', e => {
      if (true) {
        e.preventDefault();
        const parent = toggle.closest('.nav-dropdown');
        document.querySelectorAll('.nav-dropdown.open').forEach(d => {
          if (d !== parent) { d.classList.remove('open'); d.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded','false'); }
        });
        const open=parent?.classList.toggle('open'); toggle.setAttribute('aria-expanded',String(open));
      }
    });
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.nav-dropdown')) {
      document.querySelectorAll('.nav-dropdown.open').forEach(d => { d.classList.remove('open'); d.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded','false'); });
    }
  });

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
    document.querySelector('.qx-stage')?.setAttribute('data-service', name);
    document.querySelectorAll('.qx-stage-tab').forEach(t => t.setAttribute('aria-pressed', String(t.dataset.scene === name)));
    const progress = document.querySelector('.qx-stage');
    if (progress) progress.style.setProperty('--scene-progress', ((['web','seo','social','ads','ai'].indexOf(name)+1)*20)+'%');
    const fallback = document.querySelector('.qx-service-fallback');
    const activeTab = document.querySelector('.qx-stage-tab[data-scene="'+name+'"] svg');
    if (fallback && activeTab) fallback.replaceChildren(activeTab.cloneNode(true));
    window.dispatchEvent(new CustomEvent('qixton:service', {detail:name}));
    if (stageLink) {
      stageLink.href = data.link;
      stageLink.textContent = data.linkText;
    }
  }

  let lastService = 'web';
  let scrollFrame = 0;
  const updateService = () => {
    scrollFrame = 0;
    if (!steps.length) return;
    const aim = window.innerHeight * .5;
    const closest = steps.reduce((best, step) => {
      const box = step.getBoundingClientRect();
      const distance = Math.abs(box.top + box.height / 2 - aim);
      return distance < best.distance ? {step, distance} : best;
    }, {step:steps[0],distance:Infinity}).step.dataset.step;
    if (closest !== lastService) { lastService=closest; setService(closest); }
  };
  window.addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame=requestAnimationFrame(updateService);
  }, {passive:true});
  document.querySelectorAll('.qx-stage-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const name=tab.dataset.scene;
      lastService=name; setService(name);
      if (window.innerWidth>1000) {
        const step=steps.find(s=>s.dataset.step===name);
        if (step) step.scrollIntoView({behavior:root.dataset.motion==='off'?'instant':'smooth',block:'center'});
      }
    });
  });
  updateService();

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
