// ═══════════════════════════════════════════════════════════════
// CANVAS / SIM3D-THREE — WebGL-рендер 3D-симуляции гибки (v5.2)
// ═══════════════════════════════════════════════════════════════
// Three.js r128 — вендорен локально (js/vendor/three.r128.min.js),
// подгружается ЛЕНИВО при первом открытии 3D-модалки (600 КБ не
// едут со старта страницы). Если WebGL недоступен или скрипт не
// загрузился — автоматический откат на прежний canvas-рендер
// (алгоритм художника); логика шагов/анимации не меняется.
//
// Что даёт WebGL (v5.2 — «улучшение графики 3D», без смены
// архитектуры: тот же статический офлайн-проект без сборки):
//  • перспективная камера + настоящее освещение (полусфера + key
//    с МЯГКИМИ ТЕНЯМИ + заполняющий свет), PBR-материалы
//    (metalness/roughness) — металл выглядит металлом;
//  • корректная глубина (z-буфер) вместо сортировки граней — нет
//    артефактов painter's algorithm на сложных профилях;
//  • сглаживание (antialias) + retina (devicePixelRatio ≤ 2),
//    ACES-тонмаппинг;
//  • дуги гибов/кайм — цилиндрические поверхности (хорды с
//    flat-нормалями читаются как гладкая труба);
//  • «пол» с приёмом теней (мягкая тень под заготовкой), рёбра граней
//    как в CAD (v5.3: CAD-сетка пола убрана по запросу — чище вид).
//
// Камера управляется ТЕМИ ЖЕ переменными, что и старый рендер
// (sim3dRotX/sim3dRotY/sim3dZoom/sim3dPanX/sim3dPanY): вращение
// ЛКМ, панорама ПКМ, зум колесом/пинчем — поведение не менялось.
// На плоскости цели масштаб совпадает со старой ортопроекцией
// 1:1 (в глубину — перспектива): базисы выводятся из той же
// матрицы Rx·Ry, что и project3DSim.
// ═══════════════════════════════════════════════════════════════

const three3D = {
  loading: false, ready: false, failed: false, pending: [],
  renderer: null, scene: null, camera: null, wrap: null,
  hemi: null, key: null, fill: null,
  ground: null, groundY: -52,
  sheetFront: null, sheetBack: null, sheetCaps: null, sheetEdges: null,
  toolGroup: null, punchGroup: null, punchBoxH: null, punchIsBox: true,
  stopperMesh: null, dieGroup: null,
  mats: null, toolsSig: null, worldR: 260, lastShadowR: 0,
  overlay: { labelWorld: null, labelText: '', faceSide: 'up', flipX: false, flipY: false }
};

// ── Общий ленивый загрузчик three.js (v5.3) ──
// Один экземпляр скрипта js/vendor/three.r128.min.js на всё приложение:
// им пользуются и 3D-симуляция (three3DEnsure), и 3D-просмотр детали
// (canvas/view3d-three.js). Проверяет доступность WebGL, инжектит
// <script> один раз, кэширует результат.
const threeScriptState = { loading: false, ok: false, failed: false, pending: [] };
function threeScriptFlush(ok) {
  const list = threeScriptState.pending.splice(0);
  setTimeout(function () { for (const cb of list) { try { cb(ok); } catch (e) {} } }, 0);
}
function threeScriptEnsure(cb) {
  if (typeof cb !== 'function') cb = function () {};
  if (threeScriptState.ok) { cb(true); return; }
  if (threeScriptState.failed) { cb(false); return; }
  threeScriptState.pending.push(cb);
  if (threeScriptState.loading) return;
  // WebGL вообще доступен в этом браузере?
  try {
    const tc = document.createElement('canvas');
    const gl = tc.getContext('webgl') || tc.getContext('experimental-webgl');
    if (!gl) { threeScriptState.failed = true; threeScriptFlush(false); return; }
  } catch (e) { threeScriptState.failed = true; threeScriptFlush(false); return; }
  threeScriptState.loading = true;
  const s = document.createElement('script');
  s.src = 'js/vendor/three.r128.min.js';
  s.onload = function () {
    threeScriptState.loading = false;
    threeScriptState.ok = !!window.THREE;
    if (!threeScriptState.ok) threeScriptState.failed = true;
    threeScriptFlush(threeScriptState.ok);
  };
  s.onerror = function () {
    threeScriptState.loading = false;
    threeScriptState.failed = true;
    threeScriptFlush(false);
  };
  document.head.appendChild(s);
}

function three3DIsActive() {
  return !!(three3D.ready && three3D.renderer && window.THREE);
}

function three3DGetOverlay() { return three3D.overlay; }

// Ленивая загрузка three.js (общий загрузчик, см. threeScriptEnsure)
// + инициализация рендерера 3D-симуляции. cb(ok) вызывается всегда
// (true = WebGL-путь готов).
function three3DEnsure(cb) {
  if (typeof cb !== 'function') cb = function () {};
  if (three3D.failed) { cb(false); return; }
  if (three3DIsActive()) { cb(true); return; }
  three3D.pending.push(cb);
  if (three3D.loading) return;
  three3D.loading = true;
  threeScriptEnsure(function (ok) {
    three3D.loading = false;
    if (ok && three3DInit()) three3DFlush(true);
    else { three3D.failed = true; three3DFlush(false); }
  });
}
function three3DFlush(ok) {
  const list = three3D.pending.splice(0);
  setTimeout(function () { for (const cb of list) { try { cb(ok); } catch (e) {} } }, 0);
}

function three3DInit() {
  try {
    const wrap = document.getElementById('sim3d-gl-wrap');
    if (!wrap) return false;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.06;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    wrap.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 1, 5000);

    // ── Свет: полусфера + key с мягкими тенями + заполняющий ──
    const hemi = new THREE.HemisphereLight(0xeaf2ff, 0x545b64, 0.92);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffffff, 1.15);
    key.position.set(180, 420, 240);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 10;
    key.shadow.camera.far = 2200;
    key.shadow.bias = -0.00015;
    key.shadow.normalBias = 0.6;
    scene.add(key);
    scene.add(key.target);
    const fill = new THREE.DirectionalLight(0xbfd3ff, 0.38);
    fill.position.set(-220, 120, -170);
    scene.add(fill);

    // ── Материалы (постоянные, переиспользуются) ──
    const mats = {
      front: new THREE.MeshStandardMaterial({ color: 0x3f86dd, metalness: 0.5, roughness: 0.33, side: THREE.DoubleSide }),
      back: new THREE.MeshStandardMaterial({ color: 0x9aa4af, metalness: 0.92, roughness: 0.36, side: THREE.DoubleSide }),
      caps: new THREE.MeshStandardMaterial({ color: 0x828c97, metalness: 0.85, roughness: 0.45, side: THREE.DoubleSide }),
      die: new THREE.MeshStandardMaterial({ color: 0x59626d, metalness: 0.75, roughness: 0.52, side: THREE.DoubleSide }),
      punch: new THREE.MeshStandardMaterial({ color: 0x6d7681, metalness: 0.8, roughness: 0.42, side: THREE.DoubleSide }),
      stopper: new THREE.MeshStandardMaterial({ color: 0x8f98a3, metalness: 0.7, roughness: 0.5, side: THREE.DoubleSide }),
      shadow: new THREE.ShadowMaterial({ opacity: 0.3 }),
      edges: new THREE.LineBasicMaterial({ color: 0x333b44, transparent: true, opacity: 0.85 }),
      edgesTool: new THREE.LineBasicMaterial({ color: 0x2c333b, transparent: true, opacity: 0.9 })
    };

    // ── Лист: лицевая (синяя) / изнанка / торцы + рёбра ──
    const sheetFront = new THREE.Mesh(new THREE.BufferGeometry(), mats.front);
    const sheetBack = new THREE.Mesh(new THREE.BufferGeometry(), mats.back);
    const sheetCaps = new THREE.Mesh(new THREE.BufferGeometry(), mats.caps);
    const sheetEdges = new THREE.LineSegments(new THREE.BufferGeometry(), mats.edges);
    [sheetFront, sheetBack, sheetCaps].forEach(function (m) {
      m.castShadow = true; m.receiveShadow = true;
      scene.add(m);
    });
    scene.add(sheetEdges);

    three3D.renderer = renderer; three3D.scene = scene; three3D.camera = camera;
    three3D.wrap = wrap; three3D.hemi = hemi; three3D.key = key; three3D.fill = fill;
    three3D.mats = mats;
    three3D.sheetFront = sheetFront; three3D.sheetBack = sheetBack;
    three3D.sheetCaps = sheetCaps; three3D.sheetEdges = sheetEdges;
    three3D.ready = true;
    return true;
  } catch (e) {
    three3D.ready = false;
    return false;
  }
}

function three3DResize(w, h) {
  if (!three3DIsActive()) return;
  three3D.renderer.setSize(Math.max(2, Math.floor(w)), Math.max(2, Math.floor(h)));
}

function three3DUpdateBackground(isDark) {
  const wrap = three3D.wrap || document.getElementById('sim3d-gl-wrap');
  if (!wrap) return;
  wrap.style.background = isDark
    ? 'radial-gradient(circle at 50% 32%, #23233c 0%, #17172a 62%, #0f0f1c 100%)'
    : 'radial-gradient(circle at 50% 32%, #ffffff 0%, #eef1f5 55%, #dfe3ea 100%)';
}

// ── Геометрия из квадов (world-координаты, DoubleSide ⇒ winding не важен) ──
function three3DGeomFromQuads(quads) {
  const geom = new THREE.BufferGeometry();
  if (!quads || quads.length === 0) {
    geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(0), 3));
    return geom;
  }
  const pos = new Float32Array(quads.length * 18);
  let k = 0;
  for (let q = 0; q < quads.length; q++) {
    const qu = quads[q];
    const order = [0, 1, 2, 0, 2, 3];
    for (let j = 0; j < 6; j++) {
      const v = qu[order[j]];
      pos[k++] = v[0]; pos[k++] = v[1]; pos[k++] = v[2];
    }
  }
  geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geom.computeVertexNormals();
  return geom;
}

function three3DDisposeObject(obj) {
  if (!obj) return;
  obj.traverse(function (o) {
    if (o.geometry && o.geometry.dispose) { try { o.geometry.dispose(); } catch (e) {} }
    if (o.material && o.material.dispose && o.material !== three3D.mats.edges &&
        o.material !== three3D.mats.edgesTool && o.material !== three3D.mats.shadow) {
      try { if (Array.isArray(o.material)) o.material.forEach(function (m) { m.dispose(); }); else o.material.dispose(); } catch (e) {}
    }
  });
  if (three3D.scene) three3D.scene.remove(obj);
}

// ── Лист: та же математика, что в canvas-рендере (нормаль ±T/2·faceSign) ──
// Торцы: 2 квада на сегмент (закрывают «клинья» на гибах и дугах —
// та же схема, что в canvas-рендере; для коллинеарных сегментов
// они вырождаются и невидимы).
function three3DRebuildSheet(prof, T, hw, faceSignSim) {
  const pts = (prof && prof.pts) ? prof.pts : [];
  const quadsFront = [], quadsBack = [], quadsCaps = [], quadsAll = [];
  const n = pts.length;
  for (let i = 0; i < n - 1; i++) {
    const dx = pts[i + 1].x - pts[i].x, dy = pts[i + 1].y - pts[i].y;
    const len = Math.hypot(dx, dy);
    if (len <= 1e-9) continue;
    const nx = -dy / len * faceSignSim * (T / 2);
    const ny = dx / len * faceSignSim * (T / 2);
    // v4.9: на дуге каймы лицевая грань вырождается — не строим (как в canvas)
    const hemArcSeg = !!(pts[i]._hemArc || pts[i + 1]._hemArc);
    const ax = pts[i].x - nx, ay = pts[i].y - ny;
    const bx = pts[i + 1].x - nx, by = pts[i + 1].y - ny;
    const fx0 = pts[i].x + nx, fy0 = pts[i].y + ny;
    const fx1 = pts[i + 1].x + nx, fy1 = pts[i + 1].y + ny;
    const qBack = [[ax, ay, -hw], [ax, ay, hw], [bx, by, hw], [bx, by, -hw]];
    const qCap0 = [[ax, ay, -hw], [ax, ay, hw], [fx0, fy0, hw], [fx0, fy0, -hw]];
    const qCap1 = [[bx, by, -hw], [bx, by, hw], [fx1, fy1, hw], [fx1, fy1, -hw]];
    quadsBack.push(qBack);
    quadsCaps.push(qCap0, qCap1);
    quadsAll.push(qBack, qCap0, qCap1);
    if (!hemArcSeg) {
      const qFront = [[fx0, fy0, -hw], [fx0, fy0, hw], [fx1, fy1, hw], [fx1, fy1, -hw]];
      quadsFront.push(qFront);
      quadsAll.push(qFront);
    }
  }
  three3D.sheetFront.geometry.dispose();
  three3D.sheetBack.geometry.dispose();
  three3D.sheetCaps.geometry.dispose();
  three3D.sheetEdges.geometry.dispose();
  three3D.sheetFront.geometry = three3DGeomFromQuads(quadsFront);
  three3D.sheetBack.geometry = three3DGeomFromQuads(quadsBack);
  three3D.sheetCaps.geometry = three3DGeomFromQuads(quadsCaps);
  try {
    const merged = three3DGeomFromQuads(quadsAll);
    three3D.sheetEdges.geometry = new THREE.EdgesGeometry(merged, 25);
    merged.dispose();
  } catch (e) {
    three3D.sheetEdges.geometry = new THREE.BufferGeometry();
  }
}

// ── Инструменты (матрица/пуансон/упор/пол/сетка) — по сигнатуре ──
function three3DToolsSig(die, punch, hw, isDark) {
  const d = die || {}, p = punch || {};
  return [
    !!(d.profile && d.profile.chains), d.vWidth, d.swidth, d.height,
    S.dieOffsetX || 0, S.dieOffsetY || 0,
    !!(p.profile && p.profile.chains), p.swidth, p.height,
    S.punchOffsetX || 0, S.punchOffsetY || 0,
    hw, isDark
  ].join('|');
}

function three3DExtrudeGroup(chains, mapPt, mats, edgeMat) {
  const g = new THREE.Group();
  for (let c = 0; c < chains.length; c++) {
    const chain = chains[c];
    if (!chain || chain.length < 2) continue;
    const shape = new THREE.Shape();
    for (let i = 0; i < chain.length; i++) {
      const p = mapPt(chain[i]);
      if (i === 0) shape.moveTo(p[0], p[1]); else shape.lineTo(p[0], p[1]);
    }
    shape.closePath();
    const geom = new THREE.ExtrudeGeometry(shape, { depth: 2 * (three3D._extrudeHw || 10), bevelEnabled: false });
    const mesh = new THREE.Mesh(geom, mats);
    mesh.castShadow = true; mesh.receiveShadow = true;
    g.add(mesh);
    try {
      const eg = new THREE.EdgesGeometry(geom, 25);
      g.add(new THREE.LineSegments(eg, edgeMat));
    } catch (e) {}
  }
  return g;
}

function three3DRebuildTools(die, punch, hw, isDark) {
  if (three3D.dieGroup) { three3DDisposeObject(three3D.dieGroup); three3D.dieGroup = null; }
  if (three3D.punchGroup) { three3DDisposeObject(three3D.punchGroup); three3D.punchGroup = null; }
  if (three3D.stopperMesh) { three3DDisposeObject(three3D.stopperMesh); three3D.stopperMesh = null; }
  if (three3D.ground) { three3DDisposeObject(three3D.ground); three3D.ground = null; }
  const scene = three3D.scene, mats = three3D.mats;
  three3D._extrudeHw = hw;

  // ── Матрица ──
  let dieH = 40;
  if (die) {
    const dOX = S.dieOffsetX || 0, dOY = S.dieOffsetY || 0;
    if (die.profile && die.profile.chains && die.profile.chains.length > 0) {
      const vCenter = (typeof findDieGrooveCenter === 'function') ? findDieGrooveCenter(die.profile) : 0;
      const offX0 = -vCenter, offY0 = -(die.profile.minY + die.profile.height);
      dieH = Math.max(die.height || 40, die.profile.height || 40);
      const g = three3DExtrudeGroup(die.profile.chains, function (p) {
        return [p.x + offX0, p.y + offY0];
      }, mats.die, mats.edgesTool);
      g.position.set(dOX, dOY, -hw);
      scene.add(g);
      three3D.dieGroup = g;
    } else {
      const vW = die.vWidth || 10, sw = die.swidth || vW * 2;
      const halfV = vW / 2, halfS = sw / 2, dH = die.height || 40;
      const vDepth = dH * 0.5;
      dieH = dH;
      const outline = [
        [-halfS, 0], [-halfV, 0], [0, -vDepth], [halfV, 0], [halfS, 0],
        [halfS, -dH], [-halfS, -dH]
      ];
      const shape = new THREE.Shape();
      outline.forEach(function (p, i) { if (i === 0) shape.moveTo(p[0], p[1]); else shape.lineTo(p[0], p[1]); });
      shape.closePath();
      const geom = new THREE.ExtrudeGeometry(shape, { depth: 2 * hw, bevelEnabled: false });
      const mesh = new THREE.Mesh(geom, mats.die);
      mesh.castShadow = true; mesh.receiveShadow = true;
      const g = new THREE.Group();
      g.add(mesh);
      try { g.add(new THREE.LineSegments(new THREE.EdgesGeometry(geom, 25), mats.edgesTool)); } catch (e) {}
      g.position.set(dOX, dOY, -hw);
      scene.add(g);
      three3D.dieGroup = g;
    }
  }

  // ── Пуансон (геометрия статична, позиция — каждый кадр) ──
  if (punch) {
    if (punch.profile && punch.profile.chains && punch.profile.chains.length > 0) {
      const offX0 = -(punch.profile.minX + punch.profile.width / 2);
      const offY0 = -punch.profile.minY;
      three3D.punchIsBox = false;
      const g = three3DExtrudeGroup(punch.profile.chains, function (p) {
        return [p.x + offX0, p.y + offY0];
      }, mats.punch, mats.edgesTool);
      scene.add(g);
      three3D.punchGroup = g;
    } else {
      const pH = punch.height || 50, pS = punch.swidth || 20;
      three3D.punchIsBox = true;
      three3D.punchBoxH = pH;
      const geom = new THREE.BoxGeometry(pS, pH, 2 * hw);
      const mesh = new THREE.Mesh(geom, mats.punch);
      mesh.castShadow = true; mesh.receiveShadow = true;
      scene.add(mesh);
      three3D.punchGroup = mesh; // единый Mesh
    }
  }

  // ── Упор (бокс, позиция — каждый кадр) ──
  {
    const sw = 20, sh = 8;
    const geom = new THREE.BoxGeometry(sw, sh, 2 * hw);
    const mesh = new THREE.Mesh(geom, mats.stopper);
    mesh.castShadow = true; mesh.receiveShadow = true;
    scene.add(mesh);
    three3D.stopperMesh = mesh;
  }

  // ── Пол (приём теней). v5.3: CAD-сетка пола УДАЛЕНА по запросу —
  // остаётся только мягкая тень под заготовкой/инструментами (пол
  // невидим сам по себе: ShadowMaterial). ──
  const groundY = -(dieH + 10);
  three3D.groundY = groundY;
  {
    const pg = new THREE.PlaneGeometry(1600, 1600);
    pg.rotateX(-Math.PI / 2);
    const gm = new THREE.Mesh(pg, mats.shadow);
    gm.position.y = groundY;
    gm.receiveShadow = true;
    scene.add(gm);
    three3D.ground = gm;
  }
}

// ── Камера из sim3dRotX/rotY/zoom/pan (та же матрица Rx·Ry, что и
// project3DSim; на плоскости цели масштаб 1:1 со старым рендером) ──
const _t3dV = { right: null, up: null, zc: null, target: null };
function three3DUpdateCamera() {
  const cam = three3D.camera;
  if (!cam || !window.THREE) return;
  const W = sim3dW, H = sim3dH;
  if (W < 10 || H < 10) return;
  if (!_t3dV.right) {
    _t3dV.right = new THREE.Vector3();
    _t3dV.up = new THREE.Vector3();
    _t3dV.zc = new THREE.Vector3();
    _t3dV.target = new THREE.Vector3();
  }
  const scale = sim3dZoom * 0.5;
  const fovDeg = 35;
  const fov = fovDeg * Math.PI / 180;
  const dist = (H / 2) / (scale * Math.tan(fov / 2));
  const cy = Math.cos(sim3dRotY), sy = Math.sin(sim3dRotY);
  const cx = Math.cos(sim3dRotX), sx = Math.sin(sim3dRotX);
  // базисы world→camera (строки Rx·Ry):
  _t3dV.right.set(cy, 0, -sy);
  _t3dV.up.set(-sx * sy, cx, -sx * cy);
  _t3dV.zc.set(sy * cx, sx, cy * cx);
  _t3dV.target.set(0, 0, 0)
    .addScaledVector(_t3dV.right, -sim3dPanX / scale)
    .addScaledVector(_t3dV.up, sim3dPanY / scale);
  cam.position.copy(_t3dV.target).addScaledVector(_t3dV.zc, dist);
  cam.up.copy(_t3dV.up);
  cam.lookAt(_t3dV.target);
  cam.aspect = W / H;
  cam.fov = fovDeg;
  cam.near = Math.max(1, dist - three3D.worldR * 2 - 900);
  cam.far = dist + three3D.worldR * 2 + 2600;
  cam.updateProjectionMatrix();
}

// Точка мира → экранные пиксели (для метки упора поверх WebGL).
function three3DProjectToScreen(p) {
  if (!three3DIsActive() || !p || !window.THREE) return null;
  const v = new THREE.Vector3(p.x, p.y, p.z).project(three3D.camera);
  return { x: (v.x + 1) / 2 * sim3dW, y: (1 - v.y) / 2 * sim3dH };
}

// ── Полный кадр: лист + позиции инструментов + камера + render ──
function renderThree3DSim(opts) {
  if (!three3DIsActive()) return false;
  const prof = opts.prof, T = opts.T, hw = opts.hw;
  const die = opts.die, punch = opts.punch, punchTipY = opts.punchTipY;
  const faceSignSim = opts.faceSignSim, stopperInfo = opts.stopperInfo;
  const isDark = !!opts.isDark;

  three3DUpdateBackground(isDark);

  // инструменты — по сигнатуре
  const sig = three3DToolsSig(die, punch, hw, isDark);
  if (sig !== three3D.toolsSig) {
    three3DRebuildTools(die, punch, hw, isDark);
    three3D.toolsSig = sig;
  }

  // радиус сцены (тени/near-far)
  let wMnX = Infinity, wMxX = -Infinity, wMnY = Infinity, wMxY = -Infinity;
  if (prof && prof.pts) {
    for (const p of prof.pts) {
      if (p.x < wMnX) wMnX = p.x; if (p.x > wMxX) wMxX = p.x;
      if (p.y < wMnY) wMnY = p.y; if (p.y > wMxY) wMxY = p.y;
    }
  }
  if (die) {
    const dH = die.height || 40;
    const dW = (die.swidth || (die.vWidth || 10) * 2) / 2;
    if (-dH < wMnY) wMnY = -dH;
    if (-dW < wMnX) wMnX = -dW;
    if (dW > wMxX) wMxX = dW;
  }
  if (punch) {
    const pH = punch.height || 50;
    if (pH > wMxY) wMxY = pH;
  }
  if (!isFinite(wMnX)) { wMnX = -100; wMxX = 100; wMnY = -100; wMxY = 100; }
  const R = Math.max(wMxX - wMnX, wMxY - wMnY, 2 * hw) / 2;
  three3D.worldR = Math.max(90, R * 0.75 + 60);
  if (Math.abs(three3D.worldR - three3D.lastShadowR) > 15) {
    const sc = three3D.key.shadow.camera;
    const b = three3D.worldR + 80;
    sc.left = -b; sc.right = b; sc.top = b; sc.bottom = -b;
    sc.updateProjectionMatrix();
    three3D.lastShadowR = three3D.worldR;
  }

  // позиция пуансона (погружение при анимации)
  if (three3D.punchGroup) {
    const pOX = S.punchOffsetX || 0, pOY = S.punchOffsetY || 0;
    if (three3D.punchIsBox) {
      three3D.punchGroup.position.set(pOX, pOY + punchTipY + (three3D.punchBoxH || 50) / 2, 0);
    } else {
      three3D.punchGroup.position.set(pOX, pOY + punchTipY, -hw);
    }
  }
  // позиция упора
  if (three3D.stopperMesh && stopperInfo) {
    three3D.stopperMesh.position.set(stopperInfo.centerX, 0, 0);
    three3D.stopperMesh.visible = true;
  } else if (three3D.stopperMesh) {
    three3D.stopperMesh.visible = !!stopperInfo;
  }

  // лист
  three3DRebuildSheet(prof, T, hw, faceSignSim);

  // состояние для оверлея (метка упора/HUD при перерисовке камеры)
  three3D.overlay.labelWorld = stopperInfo ? stopperInfo.labelWorld : null;
  three3D.overlay.labelText = stopperInfo ? stopperInfo.text : '';
  three3D.overlay.faceSide = opts.usedFaceSide || 'up';
  three3D.overlay.flipX = !!opts.usedFlipX;
  three3D.overlay.flipY = !!opts.usedFlipY;

  three3DUpdateCamera();
  three3D.renderer.render(three3D.scene, three3D.camera);
  return true;
}

// Только камера (вращение/пан/зум) — без пересчёта профиля.
function three3DRenderFrame() {
  if (!three3DIsActive()) return false;
  three3DUpdateCamera();
  three3D.renderer.render(three3D.scene, three3D.camera);
  return true;
}
