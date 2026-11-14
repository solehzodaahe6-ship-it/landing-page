/* =====================================================
   scene.js: ҲАМАИ 3D (Three.js)
   Ду саҳна: (1) пасзаминаи hero, (2) лабораторияи 3D бо идоракунӣ
   ===================================================== */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const mobile = matchMedia('(max-width: 800px)').matches;

/* ===== КУМАКӢ: сохтани renderer (кашандаи 3D) =====
   Барои чӣ: pixelRatio-ро маҳдуд мекунем, то телефон суст нашавад */
function makeRenderer(canvas) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  r.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  return r;
}

/* ===== КУМАКӢ: андозаи canvas ва камераро ба қуттӣ мутобиқ мекунад ===== */
function fit(renderer, camera, host) {
  const w = host.clientWidth, h = host.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

/* ===== КУМАКӢ: ҳалқаи кашидан танҳо вақте кор мекунад, ки саҳна намоён аст ===== */
function loopWhenVisible(host, frame) {
  let visible = false, running = false;
  function tick() {
    if (!visible) { running = false; return; }
    frame();
    requestAnimationFrame(tick);
  }
  new IntersectionObserver(en => {
    visible = en[0].isIntersecting;
    if (visible && !running) { running = true; tick(); }
  }).observe(host);
}

/* =====================================================
   1 · ПАСЗАМИНАИ HERO: гиреҳи 3D, зарраҳо, посух ба муш ва скролл
   ===================================================== */
try {
  const canvas = document.getElementById('heroCanvas');
  const host = canvas.parentElement;
  const renderer = makeRenderer(canvas);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 6;

  // Гиреҳи асосӣ (ҷисми қаттӣ + тори тунуки болояш)
  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.25, 0.38, 220, 36),
    new THREE.MeshStandardMaterial({ color: 0x7c5cff, metalness: 0.7, roughness: 0.25 })
  );
  const wire = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.28, 0.41, 120, 18),
    new THREE.MeshBasicMaterial({ color: 0x00e5c3, wireframe: true, transparent: true, opacity: 0.18 })
  );
  const group = new THREE.Group();
  group.add(knot, wire);
  group.position.x = mobile ? 0 : 2.2;      // дар компютер ба тарафи рост, дар телефон дар марказ
  scene.add(group);

  // Зарраҳо (нуқтаҳо дар кура)
  const N = mobile ? 300 : 700;
  const pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const r = 4 + Math.random() * 6, a = Math.random() * Math.PI * 2, b = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(b) * Math.cos(a);
    pos[i * 3 + 1] = r * Math.sin(b) * Math.sin(a);
    pos[i * 3 + 2] = r * Math.cos(b);
  }
  const pg = new THREE.BufferGeometry();
  pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const points = new THREE.Points(pg, new THREE.PointsMaterial({ size: 0.035, color: 0xffffff, transparent: true, opacity: 0.7 }));
  scene.add(points);

  // Нур
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const l1 = new THREE.PointLight(0x00e5c3, 60, 20); l1.position.set(4, 3, 5);
  const l2 = new THREE.PointLight(0xff5c9d, 50, 20); l2.position.set(-4, -2, 4);
  scene.add(l1, l2);

  // Муш: ҷойгиршавии мушро аз -0.5 то 0.5 нигоҳ медорем
  const mouse = { x: 0, y: 0 };
  addEventListener('pointermove', e => { mouse.x = e.clientX / innerWidth - 0.5; mouse.y = e.clientY / innerHeight - 0.5; });

  fit(renderer, camera, host);
  addEventListener('resize', () => fit(renderer, camera, host));

  const clock = new THREE.Clock();
  loopWhenVisible(host, () => {
    const t = clock.getElapsedTime();
    const sy = Math.min(scrollY / innerHeight, 1.5);     // скролл (0 то 1.5 экран)
    group.rotation.x = t * 0.15 + mouse.y * 0.6;
    group.rotation.y = t * 0.2 + mouse.x * 0.9 + sy * 1.2;
    group.position.y = Math.sin(t) * 0.15 - sy * 0.8;
    points.rotation.y = t * 0.03;
    renderer.render(scene, camera);
  });
} catch (err) {
  console.warn('Hero 3D кор накард:', err);
  const c = document.getElementById('heroCanvas');
  if (c) c.style.display = 'none';
}

/* =====================================================
   2 · ЛАБОРАТОРИЯИ 3D: бо муш/ангушт гардонед, шакл, намуд ва рангро иваз кунед
   ===================================================== */
try {
  const canvas = document.getElementById('labCanvas');
  const host = canvas.parentElement;
  const renderer = makeRenderer(canvas);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 4.4);

  // Нур
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const l1 = new THREE.PointLight(0xffffff, 55, 20); l1.position.set(3, 3, 4);
  const l2 = new THREE.PointLight(0x00e5c3, 40, 20); l2.position.set(-4, -2, 3);
  scene.add(l1, l2);

  // Шаклҳо
  const shapes = {
    ico: () => new THREE.IcosahedronGeometry(1.35, 1),
    torus: () => new THREE.TorusGeometry(1.1, 0.45, 32, 100),
    knot: () => new THREE.TorusKnotGeometry(0.95, 0.32, 160, 24)
  };
  const state = { shape: 'ico', mode: 'solid', color: '#7c5cff' };
  let obj = null;

  // Сохтани ашё аз рӯи ҳолат (state)
  function build() {
    if (obj) { scene.remove(obj); obj.geometry.dispose(); obj.material.dispose(); }
    const geo = shapes[state.shape]();
    if (state.mode === 'points') {
      obj = new THREE.Points(geo, new THREE.PointsMaterial({ color: state.color, size: 0.045 }));
    } else {
      obj = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
        color: state.color, metalness: 0.5, roughness: 0.3,
        flatShading: state.shape === 'ico', wireframe: state.mode === 'wire'
      }));
    }
    scene.add(obj);
  }
  build();

  // Идоракунӣ бо муш/ангушт (зум хомӯш, то скроли саҳифа халал нанашавад)
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.6;
  canvas.style.touchAction = 'pan-y';       // дар телефон скроли амудӣ кор мекунад

  // Тугмаҳо: data-shape, data-mode, data-color
  function wire(attr, key) {
    const btns = [...document.querySelectorAll('[' + attr + ']')];
    btns.forEach(b => b.addEventListener('click', () => {
      state[key] = b.getAttribute(attr);
      btns.forEach(x => x.classList.toggle('on', x === b));
      build();
    }));
  }
  wire('data-shape', 'shape');
  wire('data-mode', 'mode');
  wire('data-color', 'color');

  fit(renderer, camera, host);
  addEventListener('resize', () => fit(renderer, camera, host));

  loopWhenVisible(host, () => {
    controls.update();
    renderer.render(scene, camera);
  });
} catch (err) {
  console.warn('Lab 3D кор накард:', err);
  const c = document.getElementById('labCanvas');
  if (c) c.style.display = 'none';
}