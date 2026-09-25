const CONTACT_EMAIL = 'hello@qixton.com';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile navigation
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
if (menuToggle && mobileMenu) {
  const closeMenu = () => {
    menuToggle.classList.remove('open');
    mobileMenu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.classList.toggle('open');
    mobileMenu.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
}

// Cursor glow
const cursor = document.querySelector('.cursor-glow');
if (cursor && !reduceMotion && matchMedia('(pointer:fine)').matches) {
  window.addEventListener('pointermove', e => {
    cursor.animate({left:`${e.clientX}px`, top:`${e.clientY}px`}, {duration:700, fill:'forwards', easing:'cubic-bezier(.2,.8,.2,1)'});
  }, {passive:true});
}

// Reveal on scroll
const reveals = document.querySelectorAll('.reveal-up');
if (reduceMotion) {
  reveals.forEach(el => el.classList.add('is-visible'));
} else {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, {threshold:.11, rootMargin:'0px 0px -6% 0px'});
  reveals.forEach(el => io.observe(el));
}

// Email enquiry form
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const subject = `Qixton enquiry — ${data.get('business') || data.get('name') || 'New project'}`;
    const body = [
      `Name: ${data.get('name') || ''}`,
      `Business: ${data.get('business') || ''}`,
      `Email: ${data.get('email') || ''}`,
      `Website / social URL: ${data.get('url') || ''}`,
      `Service: ${data.get('service') || ''}`,
      '',
      'Goal / message:',
      data.get('message') || ''
    ].join('\n');
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

// True WebGL hero: glass sphere + 3D Q + orbit rings
(function initThreeHero(){
  const canvas = document.getElementById('hero3d');
  const wrap = document.getElementById('hero3dWrap');
  if (!canvas || !wrap || !window.THREE) return;

  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.15, 8.2);

    const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true, powerPreference:'high-performance'});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    const root = new THREE.Group();
    scene.add(root);

    // Lighting
    scene.add(new THREE.AmbientLight(0x30183e, 2.1));
    const key = new THREE.PointLight(0xff4fca, 55, 16, 2); key.position.set(-3, 3.2, 5); scene.add(key);
    const cyan = new THREE.PointLight(0x4ed8ff, 42, 15, 2); cyan.position.set(3.3, -1.2, 4.2); scene.add(cyan);
    const violet = new THREE.PointLight(0x8154ff, 35, 15, 2); violet.position.set(0, 2.8, -1); scene.add(violet);

    // Transparent glass globe
    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(2.35, 96, 96),
      new THREE.MeshPhysicalMaterial({
        color:0x7e155f, transparent:true, opacity:.16,
        roughness:.05, metalness:.06, transmission:.82,
        thickness:1.2, ior:1.35, clearcoat:1, clearcoatRoughness:.08,
        side:THREE.DoubleSide
      })
    );
    root.add(globe);

    // Inner atmospheric glow
    const inner = new THREE.Mesh(
      new THREE.SphereGeometry(2.18, 64, 64),
      new THREE.MeshBasicMaterial({color:0x7410a8, transparent:true, opacity:.11, side:THREE.BackSide})
    );
    root.add(inner);

    // 3D Q — torus + tail
    const qGroup = new THREE.Group();
    const qMat = new THREE.MeshPhysicalMaterial({color:0xf7e5ff, emissive:0x7c1d8f, emissiveIntensity:1.25, roughness:.12, metalness:.22, clearcoat:1, clearcoatRoughness:.05});
    const qRing = new THREE.Mesh(new THREE.TorusGeometry(1.12, .26, 32, 96), qMat);
    qRing.rotation.x = Math.PI / 2;
    qGroup.add(qRing);
    const tail = new THREE.Mesh(new THREE.BoxGeometry(.38, 1.15, .34, 3, 8, 3), qMat);
    tail.position.set(.72, -.77, .02);
    tail.rotation.z = -.72;
    qGroup.add(tail);
    qGroup.scale.set(1.18,1.18,1.18);
    qGroup.rotation.x = .06;
    root.add(qGroup);

    // Orbit rings
    const orbitGroup = new THREE.Group();
    root.add(orbitGroup);
    const ringMatA = new THREE.MeshBasicMaterial({color:0xff55d0, transparent:true, opacity:.72});
    const ringMatB = new THREE.MeshBasicMaterial({color:0x67d9ff, transparent:true, opacity:.52});
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(3.02,.018,8,180), ringMatA); ring1.scale.y=.42; ring1.rotation.set(1.15,.2,.12); orbitGroup.add(ring1);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.8,.014,8,180), ringMatB); ring2.scale.y=.58; ring2.rotation.set(.63,-.34,-.32); orbitGroup.add(ring2);
    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(3.12,.01,8,180), new THREE.MeshBasicMaterial({color:0xb775ff,transparent:true,opacity:.35})); ring3.scale.y=.31; ring3.rotation.set(1.52,.1,-.42); orbitGroup.add(ring3);

    // Orbiting beads
    const beadMat = new THREE.MeshPhysicalMaterial({color:0xff5ad1, emissive:0x811c6c, emissiveIntensity:1.4, roughness:.08, metalness:.2, clearcoat:1});
    const beadMat2 = new THREE.MeshPhysicalMaterial({color:0x66dbff, emissive:0x164a88, emissiveIntensity:1.6, roughness:.08, clearcoat:1});
    const beads = [];
    [[2.65,.2,beadMat],[2.9,2.2,beadMat2],[2.55,4.0,beadMat],[2.85,5.25,beadMat2]].forEach(([r,a,m],i)=>{
      const bead = new THREE.Mesh(new THREE.SphereGeometry(.12 + (i%2)*.04,24,24),m);
      bead.userData = {r,a,speed:.28 + i*.05,yamp:.65 + i*.08};
      root.add(bead); beads.push(bead);
    });

    // Pedestal rings
    const base = new THREE.Group(); base.position.y=-2.65; root.add(base);
    for(let i=0;i<4;i++){
      const r = 1.25+i*.32;
      const mesh = new THREE.Mesh(new THREE.TorusGeometry(r,.026,8,128), new THREE.MeshBasicMaterial({color:i%2?0x6b60ff:0xff4fc9,transparent:true,opacity:.48-i*.06}));
      mesh.rotation.x=Math.PI/2; mesh.scale.y=.43; base.add(mesh);
    }

    // Sparse particles
    const particleCount=170;
    const positions=new Float32Array(particleCount*3);
    for(let i=0;i<particleCount;i++){
      const rr=3.3+Math.random()*2.8, th=Math.random()*Math.PI*2, ph=(Math.random()-.5)*1.8;
      positions[i*3]=Math.cos(th)*rr; positions[i*3+1]=Math.sin(ph)*2.3; positions[i*3+2]=Math.sin(th)*rr;
    }
    const pgeo=new THREE.BufferGeometry(); pgeo.setAttribute('position',new THREE.BufferAttribute(positions,3));
    const points=new THREE.Points(pgeo,new THREE.PointsMaterial({color:0xff8ee0,size:.035,transparent:true,opacity:.55})); scene.add(points);

    let targetX=0,targetY=0,scrollRot=0;
    const onPointer = e => {
      const rect=wrap.getBoundingClientRect();
      targetY=((e.clientX-rect.left)/rect.width-.5)*.55;
      targetX=((e.clientY-rect.top)/rect.height-.5)*.35;
    };
    if(!reduceMotion && matchMedia('(pointer:fine)').matches){
      wrap.addEventListener('pointermove',onPointer,{passive:true});
      wrap.addEventListener('pointerleave',()=>{targetX=0;targetY=0;},{passive:true});
    }
    window.addEventListener('scroll',()=>{scrollRot=window.scrollY*.00055;},{passive:true});

    function resize(){
      const rect=wrap.getBoundingClientRect();
      renderer.setSize(Math.max(1,rect.width),Math.max(1,rect.height),false);
      camera.aspect=rect.width/Math.max(1,rect.height); camera.updateProjectionMatrix();
    }
    const ro=new ResizeObserver(resize); ro.observe(wrap); resize();

    let rx=0,ry=0;
    function render(t=0){
      const time=t*.001;
      rx += (targetX-rx)*.045; ry += (targetY-ry)*.045;
      root.rotation.x=rx + Math.sin(time*.45)*.035;
      root.rotation.y=ry + scrollRot + time*.07;
      qGroup.rotation.z=Math.sin(time*.55)*.045;
      globe.rotation.y=-time*.025;
      orbitGroup.rotation.z=time*.055;
      ring1.rotation.z=time*.11;
      ring2.rotation.y=-time*.09;
      ring3.rotation.z=-time*.065;
      base.rotation.z=-time*.045;
      points.rotation.y=time*.012;
      beads.forEach((b,i)=>{
        const u=b.userData.a + time*b.userData.speed;
        b.position.set(Math.cos(u)*b.userData.r, Math.sin(u*1.7)*b.userData.yamp, Math.sin(u)*b.userData.r*.66);
      });
      renderer.render(scene,camera);
      if(!reduceMotion) requestAnimationFrame(render);
    }
    wrap.classList.add('webgl-ready');
    render();
  } catch(err) {
    console.warn('3D hero fallback active:',err);
  }
})();
