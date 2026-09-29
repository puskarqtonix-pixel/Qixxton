/* Qixton interactive scenes. Local Three.js, no build step or external 3D service. */
(() => {
  'use strict';
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let chosen = null;
  try { chosen = localStorage.getItem('qixton-motion'); } catch (_) {}
  let paused = chosen ? chosen === 'off' : reduce.matches;
  const motionButton = document.getElementById('motionToggle');
  function reflectMotion() {
    root.dataset.motion = paused ? 'off' : 'on';
    if (motionButton) {
      motionButton.textContent = paused ? 'Resume motion' : 'Pause motion';
      motionButton.setAttribute('aria-pressed', String(paused));
    }
    window.dispatchEvent(new CustomEvent('qixton:motion', {detail:paused}));
  }
  motionButton?.addEventListener('click', () => {
    paused = !paused; chosen = paused ? 'off' : 'on';
    try { localStorage.setItem('qixton-motion', chosen); } catch (_) {}
    reflectMotion();
  });
  reduce.addEventListener('change', () => { if (!chosen) { paused=reduce.matches; reflectMotion(); } });
  reflectMotion();

  // Small pointer effects use CSS transforms and one frame per input event.
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const cards = document.querySelectorAll('.qx-depth,.industry-grid article,.price-card,.inner-card-light');
  cards.forEach((card, i) => {
    card.classList.add('qx-tilt'); card.style.setProperty('--i', i);
    let frame=0;
    card.addEventListener('pointermove', e => {
      if (paused || !fine.matches || frame) return;
      frame=requestAnimationFrame(() => {
        frame=0; const b=card.getBoundingClientRect();
        const x=(e.clientX-b.left)/b.width, y=(e.clientY-b.top)/b.height;
        card.style.setProperty('--rx', (-(y-.5)*8)+'deg');
        card.style.setProperty('--ry', ((x-.5)*10)+'deg');
        card.style.setProperty('--mx', x*100+'%');card.style.setProperty('--my', y*100+'%');
      });
    });
    const reset=()=>{card.style.setProperty('--rx','0deg');card.style.setProperty('--ry','0deg');};
    card.addEventListener('pointerleave', reset);window.addEventListener('qixton:motion',reset);
  });
  const hero=document.querySelector('.qx-hero');
  let pointerFrame=0;
  hero?.addEventListener('pointermove', e => {
    if (paused || !fine.matches || pointerFrame) return;
    pointerFrame=requestAnimationFrame(() => {
      pointerFrame=0;const b=hero.getBoundingClientRect();
      hero.style.setProperty('--city-x', ((e.clientX-b.left)/b.width-.5)*-13+'px');
      hero.style.setProperty('--city-y', ((e.clientY-b.top)/b.height-.5)*-8+'px');
    });
  });
  hero?.addEventListener('pointerleave',()=>{hero.style.setProperty('--city-x','0px');hero.style.setProperty('--city-y','0px');});
  window.addEventListener('qixton:motion',()=>{if(paused){hero?.style.setProperty('--city-x','0px');hero?.style.setProperty('--city-y','0px');}});

  const menu=document.getElementById('navMenuV2'), menuButton=document.getElementById('navMobileBtn');
  function closeMenu(){menu?.classList.remove('open');menuButton?.setAttribute('aria-expanded','false');menuButton?.setAttribute('aria-label','Open menu');}
  menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();document.querySelectorAll('.nav-dropdown.open').forEach(d=>{d.classList.remove('open');d.querySelector('button')?.setAttribute('aria-expanded','false');});}});
  document.querySelectorAll('.dropdown-toggle').forEach(b=>b.setAttribute('aria-expanded','false'));

  // Baseline content and CSS globe stay available if graphics are unavailable.
  if (!window.THREE) return;
  const T=window.THREE;
  const scenes=[];
  const mobile=matchMedia('(max-width:760px)');
  const palette={purple:0x9252ee,pink:0xe63ed7,blue:0x4b95f2,cyan:0x47d4e4,ink:0x313969};
  function metal(color,extra={}) {return new T.MeshPhysicalMaterial({color,metalness:.65,roughness:.2,clearcoat:1,clearcoatRoughness:.1,...extra});}
  function neon(color) {return new T.MeshStandardMaterial({color,emissive:color,emissiveIntensity:1.6,metalness:.3,roughness:.3});}
  function mesh(g,m,parent,x=0,y=0,z=0){const o=new T.Mesh(g,m);o.position.set(x,y,z);parent.add(o);return o;}
  function box(parent,w,h,d,mat,x=0,y=0,z=0){return mesh(new T.BoxGeometry(w,h,d),mat,parent,x,y,z);}
  function torus(parent,r,tube,mat,x=0,y=0,z=0){return mesh(new T.TorusGeometry(r,tube,12,72),mat,parent,x,y,z);}
  function ball(parent,r,mat,x=0,y=0,z=0){return mesh(new T.SphereGeometry(r,32,24),mat,parent,x,y,z);}
  function cylinder(parent,r1,r2,h,mat,x=0,y=0,z=0){return mesh(new T.CylinderGeometry(r1,r2,h,64),mat,parent,x,y,z);}
  function roundedShape(w,h,r) {
    const s=new T.Shape(), x=-w/2,y=-h/2;
    s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);
    s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
    s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);
    s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;
  }
  function roundedPanel(parent,w,h,d,mat,x=0,y=0,z=0) {
    const g=new T.ExtrudeGeometry(roundedShape(w,h,.10),{depth:d,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.035,bevelThickness:.035,curveSegments:12});
    g.translate(0,0,-d/2);return mesh(g,mat,parent,x,y,z);
  }
  function environment(renderer) {
    const e=new T.Scene();e.background=new T.Color(0xcdd7f6);
    const walls=[[-3,3,2,0xffffff],[3,1,1,0xff99e9],[0,5,-2,0xffffff],[-3,-1,-3,0x8dc5ff]];
    walls.forEach(([x,y,z,c])=>{const p=mesh(new T.PlaneGeometry(5,5),new T.MeshBasicMaterial({color:c}),e,x,y,z);p.lookAt(0,0,0);});
    const pmrem=new T.PMREMGenerator(renderer);const env=pmrem.fromScene(e,.06).texture;
    pmrem.dispose();e.traverse(o=>{o.geometry?.dispose();if(o.material)o.material.dispose();});return env;
  }
  function createScene(canvasId, type) {
    const canvas=document.getElementById(canvasId);if(!canvas) return null;
    const renderer=new T.WebGLRenderer({canvas,alpha:true,antialias:!mobile.matches,powerPreference:'low-power'});
    renderer.setPixelRatio(Math.min(devicePixelRatio,mobile.matches?1.25:1.7));
    renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.14;
    const scene=new T.Scene();scene.environment=environment(renderer);
    const camera=new T.PerspectiveCamera(type==='hero'?37:36,1,.1,40);
    camera.position.set(0,type==='hero'?.38:.15,type==='hero'?7.5:6.6);camera.lookAt(0,type==='hero'?-.2:0,0);
    scene.add(new T.HemisphereLight(0xffffff,0x5e528f,2.1));
    const light=new T.DirectionalLight(0xffeafa,3.6);light.position.set(-3,5,5);scene.add(light);
    const blue=new T.DirectionalLight(0x75bdff,3.1);blue.position.set(3,0,2);scene.add(blue);
    const pink=new T.PointLight(0xf560ec,9,12);pink.position.set(-2,1,2);scene.add(pink);
    const group=new T.Group();scene.add(group);
    const state={canvas,renderer,scene,camera,group,type,visible:true,x:0,y:0,tx:0,ty:0,time:0,last:0,dirty:true,animators:[],models:[],active:'web'};
    const resize=()=>{const b=canvas.parentElement.getBoundingClientRect();if(!b.width||!b.height)return;renderer.setSize(b.width,b.height,false);camera.aspect=b.width/b.height;camera.updateProjectionMatrix();state.dirty=true;};
    new ResizeObserver(resize).observe(canvas.parentElement);resize();
    new IntersectionObserver(entries=>{state.visible=entries[0].isIntersecting;if(state.visible)state.dirty=true;},{rootMargin:'120px'}).observe(canvas);
    canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();state.lost=true;canvas.parentElement.classList.remove('is-rendered');});
    canvas.addEventListener('webglcontextrestored',()=>{state.lost=false;state.dirty=true;canvas.parentElement.classList.add('is-rendered');});
    canvas.parentElement.addEventListener('pointermove',e=>{if(paused||!fine.matches)return;const b=canvas.getBoundingClientRect();state.tx=((e.clientX-b.left)/b.width-.5)*.36;state.ty=((e.clientY-b.top)/b.height-.5)*.16;});
    canvas.parentElement.addEventListener('pointerleave',()=>{state.tx=0;state.ty=0;});
    canvas.parentElement.classList.add('is-rendered');scenes.push(state);return state;
  }
  function buildHero(s) {
    const {group}=s;
    const glass=new T.MeshPhysicalMaterial({color:0xb9d5ff,metalness:.1,roughness:.06,transparent:true,opacity:.19,clearcoat:1,envMapIntensity:1.3,side:T.FrontSide,depthWrite:false});
    const globe=new T.Group();globe.position.y=.15;group.add(globe);
    const sphere=ball(globe,1.4,glass);sphere.renderOrder=3;
    // Rim gives a glass edge without costly post-processing or video textures.
    const rim=new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{color:{value:new T.Color(0xbed5ff)}},vertexShader:'varying vec3 vNormal; varying vec3 vView; void main(){vec4 p=modelViewMatrix*vec4(position,1.0);vNormal=normalize(normalMatrix*normal);vView=normalize(-p.xyz);gl_Position=projectionMatrix*p;}',fragmentShader:'uniform vec3 color; varying vec3 vNormal; varying vec3 vView; void main(){float f=pow(1.0-max(dot(normalize(vNormal),normalize(vView)),0.0),3.2);gl_FragColor=vec4(mix(color,vec3(1.0),f),f*.73);}' });
    const edge=ball(globe,1.412,rim);edge.renderOrder=4;
    const city=new T.Group();globe.add(city);
    const ground=cylinder(city,1.02,1.08,.06,metal(0xb9c8ef),0,-.55,0);
    const buildings=[[-.75,.22,-.2,.14],[-.51,.55,-.45,.17],[-.28,.88,-.47,.16],[.0,1.18,-.48,.17],[.28,.72,-.49,.18],[.58,.44,-.33,.16],[.77,.33,-.1,.13],[-.65,.43,.03,.15],[-.4,.65,-.12,.16],[.36,.45,-.09,.18],[.6,.25,.17,.14]];
    buildings.forEach(([x,h,z,w],i)=>{
      const material=metal(i%2?0x6086bc:0x344b84,{roughness:.23});box(city,w,h,w*.75,material,x,-.52+h/2,z);
      for(let j=1;j<Math.floor(h/.07);j++) box(city,w*.87,.008,.008,neon(i%2?0xffbbf0:0x9eeaff),x,-.52+j*.07,z+w*.39);
      if(i%3===0)cylinder(city,.006,.013,.18,metal(0x75bcff),x,-.43+h,z);
    });
    const q=new T.Group();q.position.set(0,-.08,.81);globe.add(q);
    torus(q,.56,.125,metal(0xb720ed,{emissive:0x6b0ca9,emissiveIntensity:.52}));
    torus(q,.56,.016,neon(0xf554eb),0,0,.133);
    const tail=box(q,.18,.55,.21,metal(0xe448ed,{emissive:0x8a1dca,emissiveIntensity:.45}),.43,-.46,.02);tail.rotation.z=.73;
    const tailLight=box(q,.024,.55,.016,neon(0xff84fd),.48,-.44,.133);tailLight.rotation.z=.73;
    for(let i=0;i<26;i++){const a=i/26*Math.PI*2;const bar=box(q,.025,.06,.012,neon(i%2?0xc679ff:0xfe98ff),Math.cos(a)*.70,Math.sin(a)*.70,.02);bar.rotation.z=a-Math.PI/2;}
    const ringMaterials=[neon(0xeaa0fa),neon(0x93ccff),neon(0xe1bdff)];
    const rings=[];
    for(let i=0;i<3;i++){
      const orbit=new T.Group();orbit.rotation.set(1.05+i*.30,.25+i*.55,-.25+i*.4);globe.add(orbit);
      torus(orbit,1.57+i*.035,.012,ringMaterials[i]);
      const spark=ball(orbit,.043,new T.MeshBasicMaterial({color:0xffffff}),1.57+i*.035,0,0);rings.push({orbit,spark,r:1.57+i*.035});
    }
    const base=new T.Group();base.position.y=-1.55;group.add(base);
    cylinder(base,1.57,1.57,.13,metal(0x9cadd3),0,-.04,0);
    cylinder(base,1.32,1.38,.15,metal(0xd9d5f2),0,.09,0);
    cylinder(base,1.02,1.07,.12,metal(0x899ec5),0,.21,0);
    [1.50,1.28,.99].forEach((r,i)=>{const ring=torus(base,r,.013,neon(i===1?0xcc5efa:0x8cceff),0,i*.13+.03,0);ring.rotation.x=Math.PI/2;});
    const particles=new T.Group();group.add(particles);
    for(let i=0;i<13;i++){const a=i*2.399;ball(particles,.013+(i%3)*.008,new T.MeshBasicMaterial({color:i%2?0xffffff:0xe4a0f4}),Math.cos(a)*(1.65+(i%3)*.14),Math.sin(a)*1.7,.2-(i%3)*.2);}
    s.animators.push(t=>{globe.position.y=.15+Math.sin(t*.55)*.055;globe.rotation.y=Math.sin(t*.22)*.10;particles.rotation.y=t*.035;rings.forEach((o,i)=>{const a=t*(.36+i*.1)+i*2;o.spark.position.set(Math.cos(a)*o.r,Math.sin(a)*o.r,0);o.orbit.rotation.z=(-.25+i*.4)+Math.sin(t*.28+i)*.1;});});
  }
  function createWeb() {
    const g=new T.Group();const frame=metal(0xb1a1e5), white=metal(0xecefff,{metalness:.05,roughness:.38});
    roundedPanel(g,2.65,1.70,.17,frame,0,.14,0);roundedPanel(g,2.42,1.44,.035,white,0,.16,.115);
    box(g,2.30,.12,.025,metal(0xcac7ec,{metalness:.1}),0,.75,.153);
    [0,1,2].forEach(i=>ball(g,.028,neon([0xf678cb,0xc0a2ee,0x8abdef][i]),-1.01+i*.11,.75,.18));
    roundedPanel(g,.75,.70,.04,metal(0xac66e5),-.65,.1,.155);
    [0,1,2].forEach(i=>box(g,.86-i*.13,.045,.018,metal(0x869cd0),.38,.33-i*.14,.161));
    roundedPanel(g,.52,.16,.04,metal(0xd65fdf),.22,-.22,.17);
    cylinder(g,.09,.14,.38,frame,0,-.92,0);box(g,.9,.07,.48,frame,0,-1.10,0);
    const float=new T.Group();g.add(float);roundedPanel(float,.66,.82,.1,metal(0xe8a4eb),1.12,-.46,.5);torus(float,.15,.029,neon(0xffffff),1.12,-.43,.58);
    return g;
  }
  function createSEO() {
    const g=new T.Group(), blue=metal(0x75b9f1), pink=metal(0xbf77e5);
    const lens=torus(g,.67,.125,blue,-.24,.30,.1);ball(g,.55,new T.MeshPhysicalMaterial({color:0xaddcff,transparent:true,opacity:.25,metalness:.15,roughness:.08,depthWrite:false}),-.24,.30,.1);
    const handle=box(g,.23,.94,.23,blue,.43,-.46,.1);handle.rotation.z=.7;
    [-.86,-.5,-.14,.22].forEach((x,i)=>box(g,.24,.25+i*.19,.27,i%2?pink:blue,x,-.86+(.25+i*.19)/2,-.42));
    torus(g,1.12,.015,neon(0xb78fe8),-.08,0,-.4).rotation.x=.55;return g;
  }
  function createSocial() {
    const g=new T.Group();roundedPanel(g,1.15,2.04,.17,metal(0xc391eb));roundedPanel(g,1.0,1.78,.025,metal(0xf0e9fb,{metalness:.03}),0,0,.123);
    box(g,.28,.05,.02,metal(0x645677),0,.77,.15);roundedPanel(g,.79,.62,.035,metal(0xb7baf4),0,.2,.15);
    [.0,.15,.3].forEach((v,i)=>box(g,.66-v,.035,.02,metal(0xbfb4d3),-.02,-.27-i*.13,.16));
    const heart=new T.Shape();heart.moveTo(0,-.31);heart.bezierCurveTo(-.72,.15,-.37,.57,0,.28);heart.bezierCurveTo(.37,.57,.72,.15,0,-.31);
    const hg=new T.ExtrudeGeometry(heart,{depth:.13,bevelEnabled:true,bevelSegments:3,bevelSize:.035,bevelThickness:.035,steps:1});mesh(hg,metal(0xe85bcb),g,.74,.38,.28);
    roundedPanel(g,.65,.38,.1,metal(0x7dbdec),-.78,-.48,.25);[0,1,2].forEach(i=>ball(g,.028,neon(0xffffff),-.95+i*.15,-.48,.34));return g;
  }
  function createAds() {
    const g=new T.Group();const horn=cylinder(g,.61,.27,1.05,metal(0x9f87e5),-.07,.27,.1);horn.rotation.z=-Math.PI/2;
    const mouth=torus(g,.61,.045,neon(0xde9aff),.46,.27,.1);mouth.rotation.y=Math.PI/2;
    const handle=box(g,.24,.72,.29,metal(0x698dcc),-.31,-.35,.1);handle.rotation.z=-.17;
    [0,1,2].forEach(i=>{const signal=torus(g,.42+i*.19,.018,neon(0x86c7ff),.81+i*.25,.27,.1);signal.rotation.y=Math.PI/2;signal.scale.x=.65;});
    const line=torus(g,1.15,.012,neon(0xc79de8),0,0,-.4);line.rotation.x=.8;return g;
  }
  function createAI() {
    const g=new T.Group();roundedPanel(g,1.26,1.26,.26,metal(0x727fcd));roundedPanel(g,1.06,1.06,.04,metal(0xa6e3ed),0,0,.18);
    const core=new T.IcosahedronGeometry(.33,0);mesh(core,metal(0xb977e9,{emissive:0x763bad,emissiveIntensity:.35}),g,0,0,.33);
    for(let i=0;i<4;i++){const p=-.42+i*.28;box(g,.07,.25,.10,metal(0xadbff0),p,.74,0);box(g,.07,.25,.10,metal(0xadbff0),p,-.74,0);box(g,.25,.07,.10,metal(0xadbff0),.74,p,0);box(g,.25,.07,.10,metal(0xadbff0),-.74,p,0);}
    for(let i=0;i<6;i++){const a=i/6*Math.PI*2;ball(g,.095,metal(i%2?0x73cfe4:0xb79ae9),Math.cos(a)*1.33,Math.sin(a)*1.15,.13);}
    torus(g,1.3,.013,neon(0x99cdeb),0,0,-.02);return g;
  }
  function buildServices(s) {
    s.models=[['web',createWeb()],['seo',createSEO()],['social',createSocial()],['ads',createAds()],['ai',createAI()]];
    s.models.forEach(([key,m])=>{m.visible=key==='web';m.rotation.y=-.2;m.rotation.x=.04;s.group.add(m);});
    s.animators.push(t=>{const current=s.models.find(([k])=>k===s.active)?.[1];if(current){current.position.y=Math.sin(t*.75)*.075;current.rotation.y=-.20+Math.sin(t*.3)*.12;}});
    const change=name=>{s.active=name;s.models.forEach(([key,m])=>{m.visible=key===name;});s.dirty=true;};
    window.addEventListener('qixton:service',e=>change(e.detail));change(document.querySelector('.qx-stage')?.dataset.service||'web');
  }
  try { const h=createScene('heroCanvas','hero');if(h)buildHero(h); } catch(e){console.warn('Qixton: using the lightweight globe fallback.',e);document.querySelector('.qx-hero-scene')?.classList.remove('is-rendered');}
  try { const s=createScene('serviceCanvas','service');if(s)buildServices(s); } catch(e){console.warn('Qixton: using the service icon fallback.',e);document.querySelector('.qx-stage-visual')?.classList.remove('is-rendered');}
  window.addEventListener('qixton:motion',()=>{scenes.forEach(s=>{s.tx=0;s.ty=0;s.x=0;s.y=0;s.dirty=true;});});
  let last=0;
  function frame(now) {
    requestAnimationFrame(frame);
    if(document.hidden)return;
    const interval=mobile.matches?1000/30:1000/45;
    if(now-last<interval)return;
    const delta=Math.min((now-last)/1000,.05);last=now;
    scenes.forEach(s=>{
      if(!s.visible||s.lost||paused&&!s.dirty)return;
      if(!paused)s.time+=delta;
      s.x+=(s.tx-s.x)*.09;s.y+=(s.ty-s.y)*.09;
      s.group.rotation.y=s.x;s.group.rotation.x=s.y;
      s.animators.forEach(fn=>fn(s.time));
      s.renderer.render(s.scene,s.camera);s.dirty=false;
    });
  }
  requestAnimationFrame(frame);
})();
