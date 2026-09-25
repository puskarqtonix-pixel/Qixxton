(() => {
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.scroll-progress span');
  const glow = document.querySelector('.cursor-glow');
  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();
  addEventListener('scroll', () => {
    if (header) header.classList.toggle('scrolled', scrollY > 28);
    if (progress) { const max = document.documentElement.scrollHeight - innerHeight; progress.style.width = `${max > 0 ? scrollY/max*100 : 0}%`; }
  }, {passive:true});
  addEventListener('pointermove', e => { if (glow) glow.animate({left:`${e.clientX}px`,top:`${e.clientY}px`},{duration:850,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'}); }, {passive:true});
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('pointermove', e => { if (innerWidth<900) return; const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5; card.style.transform=`perspective(850px) rotateX(${y*-4}deg) rotateY(${x*6}deg) translateY(-4px)`; });
    card.addEventListener('pointerleave',()=>card.style.transform='');
  });
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('pointermove',e=>{if(innerWidth<900)return;const r=btn.getBoundingClientRect(),x=e.clientX-(r.left+r.width/2),y=e.clientY-(r.top+r.height/2);btn.style.transform=`translate(${x*.08}px,${y*.08}px)`});
    btn.addEventListener('pointerleave',()=>btn.style.transform='');
  });
})();