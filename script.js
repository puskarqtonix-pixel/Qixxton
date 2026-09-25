const year = document.getElementById('year');
if(year) year.textContent = new Date().getFullYear();

const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');
if(mobileToggle && navMenu){
  mobileToggle.addEventListener('click', ()=> navMenu.classList.toggle('open'));
}

const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) entry.target.classList.add('visible');
  });
},{threshold:0.12});
reveals.forEach(el => io.observe(el));

const cursorGlow = document.querySelector('.cursor-glow');
window.addEventListener('pointermove', (e) => {
  if(!cursorGlow) return;
  cursorGlow.style.left = `${e.clientX}px`;
  cursorGlow.style.top = `${e.clientY}px`;
}, {passive:true});

const orbWrap = document.getElementById('orbWrap');
const heroCenter = document.getElementById('heroCenter');
if(orbWrap && heroCenter){
  heroCenter.addEventListener('mousemove', (e) => {
    const rect = heroCenter.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    orbWrap.style.transform = `rotateX(${y}deg) rotateY(${x}deg)`;
  });
  heroCenter.addEventListener('mouseleave', ()=> {
    orbWrap.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
}
