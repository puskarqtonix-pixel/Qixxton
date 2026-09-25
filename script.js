const cursor = document.querySelector('.cursor-glow');
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

window.addEventListener('pointermove', e => {
  if (!cursor) return;
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
}, {passive:true});

// reveal on scroll
const reveals = document.querySelectorAll('.reveal, .reveal-up');
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, {threshold: .12});
reveals.forEach(el => io.observe(el));

// orb tilt / parallax
const heroPanel = document.querySelector('.hero-panel');
const orb = document.getElementById('orbVisual');
const sideCards = document.querySelectorAll('.hero-side .glass-panel, .floating-label, .planet');
if (heroPanel && orb) {
  heroPanel.addEventListener('mousemove', e => {
    const rect = heroPanel.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    orb.style.transform = `rotateX(${(-py*10).toFixed(2)}deg) rotateY(${(px*13).toFixed(2)}deg) translateZ(0)`;
    sideCards.forEach((card, index) => {
      const factor = (index % 3 + 1) * 5;
      card.style.transform += ` translate(${px*factor}px, ${py*factor}px)`;
    });
  });
  heroPanel.addEventListener('mouseleave', () => {
    orb.style.transform = 'rotateX(0deg) rotateY(0deg)';
    sideCards.forEach(card => {
      card.style.transform = '';
    });
  });
}

// subtle floating randomization
const floats = document.querySelectorAll('.planet, .floating-label');
floats.forEach((el, i) => {
  el.style.animationDuration = `${5 + (i % 4)}s`;
  el.style.animationDelay = `${i * .18}s`;
});
