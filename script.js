(() => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const topbar = document.querySelector(".topbar");
  window.addEventListener("scroll", () => {
    if (topbar) topbar.classList.toggle("scrolled", window.scrollY > 18);
  }, {passive:true});

  const glow = document.querySelector(".cursor-glow");
  window.addEventListener("pointermove", (e) => {
    if (!glow) return;
    glow.animate({left:`${e.clientX}px`, top:`${e.clientY}px`},{
      duration:700, fill:"forwards", easing:"cubic-bezier(.2,.8,.2,1)"
    });
  }, {passive:true});

  const menuBtn = document.getElementById("menuBtn");
  const navlinks = document.getElementById("navlinks");
  if (menuBtn && navlinks) {
    menuBtn.addEventListener("click", () => navlinks.classList.toggle("open"));
    navlinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navlinks.classList.remove("open")));
  }

  const scenes = [...document.querySelectorAll(".scene")];
  const steps = [...document.querySelectorAll(".story-step")];
  const sceneIndex = document.getElementById("sceneIndex");

  function activateScene(name, indexLabel) {
    scenes.forEach(scene => scene.classList.toggle("active", scene.dataset.scene === name));
    steps.forEach(step => step.classList.toggle("active", step.dataset.step === name));
    if (sceneIndex) sceneIndex.textContent = indexLabel || "01 / 05";
  }

  if (steps.length) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) activateScene(visible.target.dataset.step, visible.target.dataset.index);
    }, {rootMargin:"-32% 0px -32% 0px", threshold:[.25,.45,.65]});
    steps.forEach(step => observer.observe(step));
  }

  const modeData = {
    web: {
      eyebrow:"WEBSITE DESIGN",
      title:"Premium websites that feel custom.",
      body:"Mobile-first, conversion-focused and designed around how your customers make decisions."
    },
    seo: {
      eyebrow:"SEO",
      title:"Search systems built around intent.",
      body:"Technical SEO, local search, content structure and authority signals that help people discover your business."
    },
    social: {
      eyebrow:"SOCIAL MEDIA",
      title:"Content that moves beyond likes.",
      body:"Reels, posts and creative systems built to create attention, trust and measurable customer actions."
    },
    ads: {
      eyebrow:"PAID ADS",
      title:"Campaigns designed for conversion.",
      body:"Google and Meta campaigns connected to focused landing experiences, targeting and ongoing optimization."
    },
    ai: {
      eyebrow:"AEO / GEO",
      title:"Make your brand easier for AI to understand.",
      body:"Structured content, schema, entity clarity and authority signals for answer engines and AI-assisted discovery."
    }
  };

  const modeTabs = [...document.querySelectorAll(".mode-tab")];
  const modeEyebrow = document.getElementById("modeEyebrow");
  const modeTitle = document.getElementById("modeTitle");
  const modeBody = document.getElementById("modeBody");
  const modeVisual = document.getElementById("modeVisual");
  modeTabs.forEach((tab, idx) => {
    tab.addEventListener("click", () => {
      modeTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const data = modeData[tab.dataset.mode];
      if (!data) return;
      modeEyebrow.textContent = data.eyebrow;
      modeTitle.textContent = data.title;
      modeBody.textContent = data.body;
      if (modeVisual) {
        modeVisual.animate(
          [{opacity:.5,transform:"scale(.985)"},{opacity:1,transform:"scale(1)"}],
          {duration:420,easing:"cubic-bezier(.2,.8,.2,1)"}
        );
      }
    });
  });
})();