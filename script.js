(() => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const glow = document.querySelector('.cursor-glow');
  window.addEventListener('pointermove', e => {
    if (!glow) return;
    glow.animate({left:`${e.clientX}px`, top:`${e.clientY}px`},{duration:650,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  }, {passive:true});

  const hero = document.getElementById('heroReference');
  window.addEventListener('scroll', () => {
    if (!hero) return;
    const y = Math.min(window.scrollY, window.innerHeight);
    hero.style.transform = `scale(${1.001 + y/180000}) translateY(${y/220}px)`;
  }, {passive:true});

  const scenes = [...document.querySelectorAll('.stage-scene')];
  const steps = [...document.querySelectorAll('.story-step')];
  const index = document.getElementById('stageIndex');
  function setScene(name, label){
    scenes.forEach(s => s.classList.toggle('active', s.dataset.scene === name));
    steps.forEach(s => s.classList.toggle('active', s.dataset.step === name));
    if(index) index.textContent = label;
  }
  if (steps.length) {
    const io = new IntersectionObserver(entries => {
      const active = entries.filter(e => e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(active) setScene(active.target.dataset.step, active.target.dataset.index);
    }, {rootMargin:'-32% 0px -32% 0px', threshold:[.2,.4,.6]});
    steps.forEach(s => io.observe(s));
  }
})();
