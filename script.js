(() => {
  const $ = (s, c=document) => c.querySelector(s);
  const $$ = (s, c=document) => [...c.querySelectorAll(s)];
  const header = $('.site-header');
  const progress = $('.scroll-progress span');
  const glow = $('.cursor-glow');
  const scenes = $$('.visual-scene');
  const steps = $$('.story-step');
  const counter = $('#sceneCount');
  $('#year').textContent = new Date().getFullYear();

  const setScene = (name, index) => {
    scenes.forEach(s => s.classList.toggle('active', s.dataset.scene === name));
    steps.forEach(s => s.classList.toggle('active', s.dataset.step === name));
    if (counter) counter.textContent = index || '01 / 05';
  };

  addEventListener('scroll', () => {
    header.classList.toggle('scrolled', scrollY > 28);
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
  }, {passive:true});

  addEventListener('pointermove', (e) => {
    if (glow) glow.animate({left:`${e.clientX}px`, top:`${e.clientY}px`},{duration:850,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  }, {passive:true});

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to('.reveal-up', {opacity:1,y:0,duration:1.05,stagger:.105,ease:'power3.out',delay:.08});
    gsap.to('.reveal-scale', {opacity:1,scale:1,duration:1.35,ease:'power3.out',delay:.28});

    gsap.to('.ring-one',{rotation:360,duration:26,repeat:-1,ease:'none'});
    gsap.to('.ring-two',{rotation:-360,duration:34,repeat:-1,ease:'none'});
    gsap.to('.ring-three',{rotation:360,duration:42,repeat:-1,ease:'none'});
    gsap.to('.energy-core',{y:-8,duration:2.9,yoyo:true,repeat:-1,ease:'sine.inOut'});
    $$('.node').forEach((n,i)=>gsap.to(n,{y:i%2?13:-13,x:i%2?-4:5,duration:2.6+i*.28,yoyo:true,repeat:-1,ease:'sine.inOut'}));

    gsap.to('.hero-machine',{yPercent:9,rotation:2,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
    gsap.to('.hero-grid',{y:90,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});

    steps.forEach(step => {
      ScrollTrigger.create({
        trigger: step,
        start: 'top 56%',
        end: 'bottom 44%',
        onEnter: () => setScene(step.dataset.step, step.dataset.index),
        onEnterBack: () => setScene(step.dataset.step, step.dataset.index)
      });
    });

    gsap.to('.browser-main',{rotateY:-2,rotateX:1,y:-10,duration:3,yoyo:true,repeat:-1,ease:'sine.inOut'});
    gsap.to('.browser-back',{y:15,x:8,duration:4,yoyo:true,repeat:-1,ease:'sine.inOut'});
    gsap.to('.mobile-device',{y:-12,rotation:4,duration:2.8,yoyo:true,repeat:-1,ease:'sine.inOut'});
    gsap.to('.rank-orbit',{rotation:360,duration:35,repeat:-1,ease:'none'});
    gsap.to('.content-card',{y:'random(-13,13)',rotation:'random(-12,12)',duration:3.2,stagger:.22,yoyo:true,repeat:-1,ease:'sine.inOut'});
    gsap.to('.ai-node',{scale:1.8,opacity:.45,duration:1.7,stagger:{each:.22,repeat:-1,yoyo:true},ease:'sine.inOut'});

    gsap.from('.service-card',{y:70,opacity:0,duration:.9,stagger:.08,ease:'power3.out',scrollTrigger:{trigger:'.service-grid',start:'top 78%'}});
    gsap.to('.io1',{rotation:360,duration:36,repeat:-1,ease:'none'});
    gsap.to('.io2',{rotation:-360,duration:42,repeat:-1,ease:'none'});
    gsap.to('.io3',{rotation:360,duration:50,repeat:-1,ease:'none'});
    gsap.to('.impact-center',{y:-10,duration:3,yoyo:true,repeat:-1,ease:'sine.inOut'});
    $$('.impact-card').forEach((c,i)=>gsap.to(c,{y:i%2?12:-12,duration:3+i*.35,yoyo:true,repeat:-1,ease:'sine.inOut'}));

    gsap.to('.process-progress span',{width:'100%',ease:'none',scrollTrigger:{trigger:'.process-rail',start:'top 75%',end:'bottom 48%',scrub:true}});
    $$('.process-rail article').forEach(a => ScrollTrigger.create({trigger:a,start:'top 74%',onEnter:()=>a.classList.add('active'),onLeaveBack:()=>a.classList.remove('active')}));

    gsap.from('.contact-panel',{y:80,scale:.96,opacity:0,duration:1.05,ease:'power3.out',scrollTrigger:{trigger:'.contact-panel',start:'top 83%'}});
    gsap.to('.contact-orbit',{rotation:160,y:-35,ease:'none',scrollTrigger:{trigger:'.contact-panel',start:'top bottom',end:'bottom top',scrub:1}});
  } else {
    $$('.reveal-up,.reveal-scale').forEach(el => { el.style.opacity=1; el.style.transform='none'; });
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) setScene(entry.target.dataset.step, entry.target.dataset.index);
    }), {rootMargin:'-35% 0px -35% 0px'});
    steps.forEach(s => io.observe(s));
  }

  $$('.tilt-card').forEach(card => {
    card.addEventListener('pointermove', e => {
      if (innerWidth < 900) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `perspective(850px) rotateX(${y*-5}deg) rotateY(${x*7}deg) translateY(-4px)`;
    });
    card.addEventListener('pointerleave', () => card.style.transform = '');
  });

  $$('.magnetic').forEach(btn => {
    btn.addEventListener('pointermove', e => {
      if (innerWidth < 900) return;
      const r = btn.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width/2);
      const y = e.clientY - (r.top + r.height/2);
      btn.style.transform = `translate(${x*.08}px,${y*.08}px)`;
    });
    btn.addEventListener('pointerleave', () => btn.style.transform = '');
  });
})();
