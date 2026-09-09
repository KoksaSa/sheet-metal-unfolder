// ═══════════════════════════════════════════════════════════════
// CANVAS / VIEW3D-THREE — WebGL-рендер 3D-просмотра детали (v5.3)
// ═══════════════════════════════════════════════════════════════
// 3D-превью детали (миниатюра справа + полноэкранная модалка) теперь
// рисуется в WebGL: three.js r128 — тот же вендореный скрипт, что и у
// 3D-симуляции, подгружается лениво через ОБЩИЙ загрузчик
// threeScriptEnsure (sim3d-three.js). Пока скрипт не загрузился или
// WebGL недоступен — прежний canvas-рендер (painter's algorithm)
// в view3d.js работает без изменений.
//
// Что даёт WebGL (v5.3 — «улучшение 3D-просмотра детали»):
//  • PBR-металл (metalness/roughness), свет как в 3D-симуляции:
//    полусфера + key с МЯГКИМИ ТЕНЯМИ + заполняющий; ACES-тонмаппинг;
//  • РАДИУСЫ ГИБОВ: острые углы нарисованного профиля заменяются
//    касательными дугами нейтрального радиуса Rn = bendRadius +
//    kFactor·T (таблица металла) — та же геометрия, что в 2D/3D
//    симуляции (v5.0): дуга вписана в угол, касательна к полкам;
//  • КАЙМА — плавная «капля»: полутруба r = T/2 + обратная нога
//    (закрытая кайма), согласована с симуляцией (v4.9);
//  • перспективная камера (fov 35°), z-буфер, antialias + retina;
//    мягкая контактная тень на невидимом «полу» (без сетки);
//  • линии гибов — пунктир на лицевой поверхности дуги (с корректным
//    перекрытием по глубине), номера гибов — оверлеем на 2D-канвасе
//    (стиль прежний: янтарный пунктир + номер над линией).
//
// Один renderer: GL-канвас переносится между контейнером миниатюры
// (#view3d-container) и модалки (#view3d-modal-container) — второй
// WebGL-контекст не создаётся. Камера управляется ТЕМИ ЖЕ
// переменными, что и canvas-рендер (view3dRotX/RotY/view3dZoom;
// модалка временно подменяет их, см. draw3DPreviewFull) — вращение
// ЛКМ и зум колесом/пинчем не менялись. На плоскости цели масштаб
// 1:1 со старой ортопроекцией (базисы — та же матрица Rx·Ry, что и
// project3D в view3d.js).
// ═══════════════════════════════════════════════════════════════

const view3D = {
  loading: false, failed: false, pending: [],
  renderer: null, scene: null, camera: null,
  hemi: null, key: null, fill: null, ground: null,
  sheetFront: null, sheetBack: null, sheetCaps: null, sheetEdges: null,
  bendLines: null, bendLineMat: null, mats: null,
  geoSig: null, profile: null,
  placedFull: false, lastW: -1, lastH: -1,
  worldR: 100, lastShadowR: 0, curW: 0, curH: 0,
  bendScreen: []
};

let view3DLoadStarted = false;

function view3DIsActive() {
  return !!(view3D.renderer && view3D.scene && view3D.camera && window.THREE);
}

// Ленивая загрузка three.js (общий загрузчик из sim3d-three.js) +
// инициализация рендерера 3D-просмотра. cb(ok) вызывается всегда.
function view3DEnsure(cb) {
  if (typeof cb !== 'function') cb = function () {};
  if (view3D.failed) { cb(false); return; }
  if (view3DIsActive()) { cb(true); return; }
  view3D.pending.push(cb);
  if (view3D.loading) return;
  view3D.loading = true;
  if (typeof threeScriptEnsure !== 'function') {
    view3D.failed = true; view3D.loading = false; view3DFlush(false); return;
  }
  threeScriptEnsure(function (ok) {
    view3D.loading = false;
    if (ok && view3DInit()) view3DFlush(true);
    else { view3D.failed = true; view3DFlush(false); }
  });
}
function view3DFlush(ok) {
  const list = view3D.pending.splice(0);
  setTimeout(function () { for (const cb of list) { try { cb(ok); } catch (e) {} } }, 0);
}

// Однократный запуск ленивой загрузки (из draw3DProfile3D) — после
// готовности перерисовываем миниатюру и (если открыта) модалку.
function view3DRequestLoad(cb) {
  if (view3DLoadStarted) return;
  view3DLoadStarted = true;
  view3DEnsure(function (ok) { try { if (cb) cb(ok); } catch (e) {} });
}

function view3DInit() {
  try {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.06;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const c = renderer.domElement;
    c.style.display = 'none'; // покажем первым кадром
    c.style.position = 'absolute';
    c.style.top = '0';
    c.style.left = '0';
    c.style.pointerEvents = 'none'; // события достаются 2D-оверлею

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 1, 5000);

    // ── Свет: та же схема, что в 3D-симуляции ──
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

    // ── Материалы (согласованы с 3D-симуляцией) ──
    const mats = {
      front: new THREE.MeshStandardMaterial({ color: 0x3f86dd, metalness: 0.5, roughness: 0.33, side: THREE.DoubleSide }),
      back: new THREE.MeshStandardMaterial({ color: 0x9aa4af, metalness: 0.92, roughness: 0.36, side: THREE.DoubleSide }),
      caps: new THREE.MeshStandardMaterial({ color: 0x828c97, metalness: 0.85, roughness: 0.45, side: THREE.DoubleSide }),
      shadow: new THREE.ShadowMaterial({ opacity: 0.3 }),
      edges: new THREE.LineBasicMaterial({ color: 0x333b44, transparent: true, opacity: 0.85 })
    };
    const bendLineMat = new THREE.LineDashedMaterial({ color: 0xf59e0b, dashSize: 3, gapSize: 2.2, transparent: true, opacity: 0.95 });

    // ── Лист: лицевая (синяя) / изнанка / торцы + рёбра + линии гибов ──
    const sheetFront = new THREE.Mesh(new THREE.BufferGeometry(), mats.front);
    const sheetBack = new THREE.Mesh(new THREE.BufferGeometry(), mats.back);
    const sheetCaps = new THREE.Mesh(new THREE.BufferGeometry(), mats.caps);
    const sheetEdges = new THREE.LineSegments(new THREE.BufferGeometry(), mats.edges);
    const bendLines = new THREE.LineSegments(new THREE.BufferGeometry(), bendLineMat);
    [sheetFront, sheetBack, sheetCaps].forEach(function (m) {
      m.castShadow = true; m.receiveShadow = true;
      scene.add(m);
    });
    scene.add(sheetEdges);
    scene.add(bendLines);

    // ── Пол — только приём мягкой тени (сам невидим) ──
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(1600, 1600), mats.shadow);
    ground.geometry.rotateX(-Math.PI / 2);
    ground.receiveShadow = true;
    scene.add(ground);

    view3D.renderer = renderer; view3D.scene = scene; view3D.camera = camera;
    view3D.hemi = hemi; view3D.key = key; view3D.fill = fill; view3D.ground = ground;
    view3D.mats = mats; view3D.bendLineMat = bendLineMat;
    view3D.sheetFront = sheetFront; view3D.sheetBack = sheetBack;
    view3D.sheetCaps = sheetCaps; view3D.sheetEdges = sheetEdges;
    view3D.bendLines = bendLines;
    return true;
  } catch (e) {
    return false;
  }
}

// Скрыть GL-канвас (пустой профиль — чтобы не показывал старый кадр)
function view3DHideGL() {
  if (view3D.renderer) view3D.renderer.domElement.style.display = 'none';
}

// ── Перенос GL-канваса миниатюра ↔ модалка (один renderer) ──
function view3DPlaceGL(useFull) {
  const dest = useFull
    ? document.getElementById('view3d-modal-container')
    : document.getElementById('view3d-container');
  if (!dest || !view3D.renderer) return;
  const c = view3D.renderer.domElement;
  if (c.parentNode !== dest) {
    if (dest.firstChild) dest.insertBefore(c, dest.firstChild);
    else dest.appendChild(c);
    view3D.lastW = -1; view3D.lastH = -1; // форсируем resize
  }
  view3D.placedFull = !!useFull;
}

// Нарисует ли WebGL в этот контейнер сейчас? (для решения: заливать
// фон 2D-канваса или делать его прозрачным оверлеем)
function view3DWillDraw(useFull) {
  if (!view3DIsActive()) return false;
  if (useFull) return true;
  return !(view3D.placedFull && typeof view3dModalOpen !== 'undefined' && view3dModalOpen);
}

// ── Геометрия из квадов (как three3DGeomFromQuads в симуляции) ──
function view3DGeomFromQuads(quads) {
  const geom = new THREE.BufferGeometry();
  if (!quads || quads.length === 0) {
    geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(0), 3));
    return geom;
  }
  const pos = new Float32Array(quads.length * 18);
  let k = 0;
  const order = [0, 1, 2, 0, 2, 3];
  for (let q = 0; q < quads.length; q++) {
    const qu = quads[q];
    for (let j = 0; j < 6; j++) {
      const v = qu[order[j]];
      pos[k++] = v[0]; pos[k++] = v[1]; pos[k++] = v[2];
    }
  }
  geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geom.computeVertexNormals();
  return geom;
}

// ═══════════════════════════════════════════════════════════════
// ПРОФИЛЬ ДЕТАЛИ С ДУГАМИ: S.points (нарисованный контур) →
// полилиния средней линии листа с касательными дугами гибов
// (Rn = bendRadius + kFactor·T) и плавными «каплями» каймы.
// ═══════════════════════════════════════════════════════════════
function view3DBuildProfile() {
  const T = S.metal.thickness || 1;
  const W = S.metal.width || 100;
  const hw = W / 2;
  const R = Number.isFinite(S.metal.bendRadius) ? S.metal.bendRadius : 1;
  const kF = Number.isFinite(S.metal.kFactor) ? S.metal.kFactor : 0.35;
  const Rn = Math.max(0.05, R + kF * T);
  // Плоская длина каймы (как calcHem в engine/unfold.js и profile.js)
  function calcHemFlat(height) {
    return Math.max(0, height - R - 2 * T + (Math.PI / 2) * (R + kF * T));
  }

  const src = S.points;
  const n = src.length;
  const numSegs = n - 1;
  const NHEM = 16; // хорд на полуокружность каймы (гладче симуляции: деталь
                   // в 3D-просмотре крупнее, фасетки 11.25° незаметны)

  // Каймы по вершинам (clamp — как computeAccumulatedProfile)
  const hemByVert = new Map();
  (S.hems || []).forEach(function (h) {
    let si = h.segIndex;
    if (!Number.isFinite(si)) return;
    if (si < 0) si = 0;
    if (si >= numSegs - 1) si = numSegs; // последний сегмент → край
    if (si >= 0 && si <= numSegs && h.height > 0) hemByVert.set(si, h);
  });

  function unitV(a, b) {
    const dx = b.x - a.x, dy = b.y - a.y, l = Math.hypot(dx, dy);
    return l < 1e-9 ? null : { x: dx / l, y: dy / l };
  }
  function rotCCW(u) { return { x: -u.y, y: u.x }; }
  function rotCW(u) { return { x: u.y, y: -u.x }; }

  const out = [];      // итоговая полилиния (средняя линия)
  const origIdx = [];  // origIdx[i] — позиция src[i] в out

  // ── Кайма в начале (вершина 0): «шапка» против хода материала ──
  // край → обратная нога (над первым сегментом) → дуга-полутруба →
  // линия гиба (= src[0]). Сторона — как у крючка drawHemHooks3D.
  const hem0 = hemByVert.get(0);
  if (hem0 && n >= 2) {
    const mFlow = unitV(src[0], src[1]);
    if (mFlow) {
      const isRight = hem0.side === 'right';
      const nrm = isRight ? rotCCW(mFlow) : rotCW(mFlow);
      const hemLen = calcHemFlat(hem0.height);
      let r = T / 2;
      if (hemLen < Math.PI * r) r = Math.max(0.01, hemLen / Math.PI);
      const legLen = Math.max(0, hemLen - Math.PI * r);
      // край материала = конец обратной ноги (над первым сегментом)
      out.push({ x: src[0].x + nrm.x * 2 * r + mFlow.x * legLen, y: src[0].y + nrm.y * 2 * r + mFlow.y * legLen, _hemArc: true });
      out.push({ x: src[0].x + nrm.x * 2 * r, y: src[0].y + nrm.y * 2 * r, _hemArc: true });
      // дуга: от верха ноги через бугор (против хода) к линии гиба
      const C = { x: src[0].x + nrm.x * r, y: src[0].y + nrm.y * r };
      const a0 = Math.atan2(nrm.y, nrm.x);
      const sweep = isRight ? Math.PI : -Math.PI;
      for (let k = 1; k < NHEM; k++) {
        const a = a0 + sweep * k / NHEM;
        out.push({ x: C.x + r * Math.cos(a), y: C.y + r * Math.sin(a), _hemArc: true });
      }
      // k = NHEM — сама вершина src[0]: добавит основной цикл
    }
  }

  // ── Основная полилиния + каймы внутренних/концевых вершин ──
  for (let i = 0; i < n; i++) {
    out.push({ x: src[i].x, y: src[i].y });
    origIdx[i] = out.length - 1;

    const hem = hemByVert.get(i);
    if (!hem || i === 0) continue; // стартовая уже добавлена до вершины
    if (i < 1) continue;

    // Направление «вперёд» = продолжение входящего сегмента
    const m = unitV(src[i - 1], src[i]);
    if (!m) continue;
    const isEnd = (i >= n - 1);
    // Сторона каймы — в согласии с drawHemHooks2D/3D:
    // концевая right → CW(m), внутренняя right → CCW(m)
    const nrm = (hem.side === 'right')
      ? (isEnd ? rotCW(m) : rotCCW(m))
      : (isEnd ? rotCCW(m) : rotCW(m));
    const hemLen = calcHemFlat(hem.height);
    let r = T / 2;
    if (hemLen < Math.PI * r) r = Math.max(0.01, hemLen / Math.PI);
    const legLen = Math.max(0, hemLen - Math.PI * r);
    // дуга от вершины через бугор (вперёд) к верху ноги
    const C = { x: src[i].x + nrm.x * r, y: src[i].y + nrm.y * r };
    const aV = Math.atan2(-nrm.y, -nrm.x);
    const sweep = (isEnd ? (hem.side === 'right' ? -Math.PI : Math.PI)
                         : (hem.side === 'right' ? Math.PI : -Math.PI));
    for (let k = 1; k < NHEM; k++) {
      const a = aV + sweep * k / NHEM;
      out.push({ x: C.x + r * Math.cos(a), y: C.y + r * Math.sin(a), _hemArc: true });
    }
    // верх ноги (k = NHEM) и обратная нога (параллельно основе)
    out.push({ x: src[i].x + nrm.x * 2 * r, y: src[i].y + nrm.y * 2 * r, _hemArc: true });
    out.push({ x: src[i].x + nrm.x * 2 * r - m.x * legLen, y: src[i].y + nrm.y * 2 * r - m.y * legLen, _hemArc: true });
  }

  // ── Радиусные дуги в местах гибов (геометрия v5.0, финальное
  //    состояние: r = Rn). Обход СВЕРХУ ВНИЗ — индексы ниже не
  //    сдвигаются. Параллельно собираем линии гибов для пунктира. ──
  const faceSign = ((S.simFaceSide || 'up') === 'up') ? 1 : -1;
  const bends3D = []; // { mx, my, ox, oy, num } — середина дуги + единичный вектор лицевого смещения
  const bendNumMap = {};
  if (S.unfoldResult && S.unfoldResult.bendInfos) {
    S.unfoldResult.bendInfos.forEach(function (b, idx) { bendNumMap[b.vertexIndex] = idx + 1; });
  }
  // Линия гиба на вершине (дуга не построена — кайма/короткая полка):
  // лицевое смещение — биссектриса нормалей соседних сегментов
  function pushVertexBend(V, uIn, uOut, num) {
    const nIn = rotCCW(uIn), nOut = rotCCW(uOut);
    let ox = nIn.x + nOut.x, oy = nIn.y + nOut.y;
    const ol = Math.hypot(ox, oy);
    if (ol < 1e-6) { ox = nIn.x; oy = nIn.y; }
    else { ox /= ol; oy /= ol; }
    bends3D.push({ mx: V.x, my: V.y, ox: ox * faceSign, oy: oy * faceSign, num: num });
  }

  for (let i = n - 2; i >= 1; i--) {
    if (typeof isBendAtPoint === 'function' && !isBendAtPoint(i)) continue;
    const num = bendNumMap[i] || i;
    const vi = origIdx[i];
    if (vi <= 0 || vi >= out.length - 1) continue;
    const V = out[vi], prev = out[vi - 1], next = out[vi + 1];
    const uIn = unitV(prev, V), uOut = unitV(V, next);
    if (!uIn || !uOut) continue;
    const crossIO = uIn.x * uOut.y - uIn.y * uOut.x;
    const dotIO = uIn.x * uOut.x + uIn.y * uOut.y;
    const phi = Math.atan2(Math.abs(crossIO), dotIO); // поворот 0..π
    if (phi < 0.035) continue;

    // Кайма на вершине — геометрию заменяет «капля»: только линия
    if (hemByVert.has(i)) { pushVertexBend(V, uIn, uOut, num); continue; }

    const lenIn = Math.hypot(V.x - prev.x, V.y - prev.y);
    const lenOut = Math.hypot(next.x - V.x, next.y - V.y);
    let r = Rn;
    const halfTan = Math.tan(phi / 2);
    if (halfTan > 1e-6) {
      const rMax = Math.min(lenIn, lenOut) / halfTan;
      if (r > rMax) r = rMax; // дуга не должна съедать соседние участки
    }
    if (!(r >= 0.05) || !Number.isFinite(r)) { pushVertexBend(V, uIn, uOut, num); continue; }

    const t = r * halfTan;
    const sweep = crossIO >= 0 ? 1 : -1;
    // Биссектриса УГЛА: между направлениями НА полки (−uIn и +uOut)
    let bx = uOut.x - uIn.x, by = uOut.y - uIn.y;
    const bl = Math.hypot(bx, by);
    if (bl < 1e-6) { pushVertexBend(V, uIn, uOut, num); continue; }
    bx /= bl; by /= bl;
    const dCV = r / Math.cos(phi / 2);
    const Cx = V.x + bx * dCV, Cy = V.y + by * dCV;
    const A = { x: V.x - uIn.x * t, y: V.y - uIn.y * t, _bendArc: true };
    const B = { x: V.x + uOut.x * t, y: V.y + uOut.y * t, _bendArc: true };
    const BA = r * phi;
    // Хорды: и по длине дуги (мм), и по углу (~9° на хорду — фасетки
    // не видны на крупном плане), минимум 8, максимум 28
    const NCH = Math.max(8, Math.min(28, Math.round(Math.max(BA, (phi / Math.PI) * 20))));
    const aA = Math.atan2(A.y - Cy, A.x - Cx);
    const arc = [];
    for (let k = 1; k < NCH; k++) {
      const a = aA + sweep * phi * k / NCH;
      arc.push({ x: Cx + r * Math.cos(a), y: Cy + r * Math.sin(a), _bendArc: true });
    }
    arc.push(B);
    out.splice(vi, 1, A);
    for (let k = 0; k < arc.length; k++) out.splice(vi + 1 + k, 0, arc[k]);

    // Середина дуги + лицевое смещение (лицо = CCW-сторона материала):
    // на дуге лицевая нормаль = u_mid·(−sweep·faceSign)
    const aMid = aA + sweep * phi / 2;
    const mx = Cx + r * Math.cos(aMid), my = Cy + r * Math.sin(aMid);
    const offSign = -sweep * faceSign;
    bends3D.push({ mx: mx, my: my, ox: Math.cos(aMid) * offSign, oy: Math.sin(aMid) * offSign, num: num });
  }

  // ── Габариты (для пола/света/теней) ──
  let mnX = Infinity, mxX = -Infinity, mnY = Infinity, mxY = -Infinity;
  out.forEach(function (p) {
    if (p.x < mnX) mnX = p.x; if (p.x > mxX) mxX = p.x;
    if (p.y < mnY) mnY = p.y; if (p.y > mxY) mxY = p.y;
  });
  if (!isFinite(mnX)) { mnX = -50; mxX = 50; mnY = -25; mxY = 25; }

  return { pts: out, bends: bends3D, T: T, hw: hw, faceSign: faceSign, bbox: { mnX: mnX, mxX: mxX, mnY: mnY, mxY: mxY } };
}

// ── Лист из полилинии (та же схема, что three3DRebuildSheet):
// лицевая/изнанка = средняя линия ± T/2·CCW-нормаль·faceSign,
// торцы — 2 квада на сегмент, рёбра — EdgesGeometry(25°).
// v5.6 FIX («у каймы нет одной плоскости»): на дуге/ноге каймы
// вырождается грань со стороны ЦЕНТРА дуги (r − T/2 ≤ 0), а НЕ
// «лицевая» безусловно (раньше — как в симуляции v4.9, из-за чего
// при зеркальных конфигурациях кайма была «полой"). Сторона
// вырождения — геометрически (hemDegenerateSide). ──
function view3DRebuildSheet(prof) {
  const pts = prof.pts, T = prof.T, hw = prof.hw, faceSign = prof.faceSign;
  const quadsFront = [], quadsBack = [], quadsCaps = [], quadsAll = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const dx = pts[i + 1].x - pts[i].x, dy = pts[i + 1].y - pts[i].y;
    const len = Math.hypot(dx, dy);
    if (len <= 1e-9) continue;
    const nx = -dy / len * faceSign * (T / 2);
    const ny = dx / len * faceSign * (T / 2);
    const hemArcSeg = !!(pts[i]._hemArc || pts[i + 1]._hemArc);
    let hemSkipFront = false, hemSkipBack = false;
    if (hemArcSeg) {
      const degSide = (typeof hemDegenerateSide === 'function') ? hemDegenerateSide(pts, i) : null;
      if (degSide) {
        hemSkipFront = (degSide === (faceSign > 0 ? 'left' : 'right'));
        hemSkipBack = !hemSkipFront;
      }
    }
    const ax = pts[i].x - nx, ay = pts[i].y - ny;
    const bx = pts[i + 1].x - nx, by = pts[i + 1].y - ny;
    const fx0 = pts[i].x + nx, fy0 = pts[i].y + ny;
    const fx1 = pts[i + 1].x + nx, fy1 = pts[i + 1].y + ny;
    const qBack = [[ax, ay, -hw], [ax, ay, hw], [bx, by, hw], [bx, by, -hw]];
    const qCap0 = [[ax, ay, -hw], [ax, ay, hw], [fx0, fy0, hw], [fx0, fy0, -hw]];
    const qCap1 = [[bx, by, -hw], [bx, by, hw], [fx1, fy1, hw], [fx1, fy1, -hw]];
    quadsCaps.push(qCap0, qCap1);
    quadsAll.push(qCap0, qCap1);
    if (!hemSkipBack) { quadsBack.push(qBack); quadsAll.push(qBack); }
    if (!hemSkipFront) {
      const qFront = [[fx0, fy0, -hw], [fx0, fy0, hw], [fx1, fy1, hw], [fx1, fy1, -hw]];
      quadsFront.push(qFront);
      quadsAll.push(qFront);
    }
  }
  view3D.sheetFront.geometry.dispose();
  view3D.sheetBack.geometry.dispose();
  view3D.sheetCaps.geometry.dispose();
  view3D.sheetEdges.geometry.dispose();
  view3D.bendLines.geometry.dispose();
  view3D.sheetFront.geometry = view3DGeomFromQuads(quadsFront);
  view3D.sheetBack.geometry = view3DGeomFromQuads(quadsBack);
  view3D.sheetCaps.geometry = view3DGeomFromQuads(quadsCaps);
  try {
    const merged = view3DGeomFromQuads(quadsAll);
    view3D.sheetEdges.geometry = new THREE.EdgesGeometry(merged, 25);
    merged.dispose();
  } catch (e) {
    view3D.sheetEdges.geometry = new THREE.BufferGeometry();
  }

  // ── Линии гибов (пунктир) на лицевой поверхности дуг ──
  const linePts = [];
  const off = T / 2 + Math.max(0.4, T * 0.15);
  (prof.bends || []).forEach(function (b) {
    const px = b.mx + b.ox * off, py = b.my + b.oy * off;
    linePts.push(new THREE.Vector3(px, py, -hw), new THREE.Vector3(px, py, hw));
  });
  view3D.bendLines.geometry = new THREE.BufferGeometry().setFromPoints(linePts);
  try { view3D.bendLines.computeLineDistances(); } catch (e) {}
  view3D.bendLines.visible = linePts.length > 0;

  // ── Пол/свет/тени по габаритам детали ──
  const bb = prof.bbox;
  const cx = (bb.mnX + bb.mxX) / 2, cy = (bb.mnY + bb.mxY) / 2;
  const R = Math.max(bb.mxX - bb.mnX, bb.mxY - bb.mnY, 2 * hw) / 2;
  view3D.worldR = Math.max(60, R * 0.75 + 40);
  const gap = Math.max(10, (bb.mxY - bb.mnY) * 0.12 + 6);
  view3D.ground.position.set(cx, bb.mnY - gap, 0);
  view3D.key.position.set(cx + 180, cy + 420, 240);
  view3D.key.target.position.set(cx, cy, 0);
  view3D.key.target.updateMatrixWorld();
  if (Math.abs(view3D.worldR - view3D.lastShadowR) > 10) {
    const sc = view3D.key.shadow.camera;
    const b = view3D.worldR + 80;
    sc.left = -b; sc.right = b; sc.top = b; sc.bottom = -b;
    sc.updateProjectionMatrix();
    view3D.lastShadowR = view3D.worldR;
  }
}

// ── Камера из view3dRotX/RotY/view3dZoom (та же матрица Rx·Ry, что и
// project3D; на плоскости цели масштаб 1:1 со старым орто-рендером) ──
const _v3dV = { right: null, up: null, zc: null, target: null };
function view3DUpdateCamera(w, h) {
  const cam = view3D.camera;
  if (!cam || !window.THREE) return;
  const scale = Math.max(1e-4, view3dZoom * 0.5);
  const fovDeg = 35;
  const fov = fovDeg * Math.PI / 180;
  const dist = (h / 2) / (scale * Math.tan(fov / 2));
  const cy = Math.cos(view3dRotY), sy = Math.sin(view3dRotY);
  const cx = Math.cos(view3dRotX), sx = Math.sin(view3dRotX);
  if (!_v3dV.right) {
    _v3dV.right = new THREE.Vector3();
    _v3dV.up = new THREE.Vector3();
    _v3dV.zc = new THREE.Vector3();
    _v3dV.target = new THREE.Vector3();
  }
  // базисы world→camera (строки Rx·Ry — как project3D)
  _v3dV.right.set(cy, 0, -sy);
  _v3dV.up.set(-sx * sy, cx, -sx * cy);
  _v3dV.zc.set(sy * cx, sx, cy * cx);
  // цель — центр модели (его же использует project3D)
  _v3dV.target.set(view3dCenterX, view3dCenterY, 0);
  cam.position.copy(_v3dV.target).addScaledVector(_v3dV.zc, dist);
  cam.up.copy(_v3dV.up);
  cam.lookAt(_v3dV.target);
  cam.aspect = w / h;
  cam.fov = fovDeg;
  cam.near = Math.max(1, dist - view3D.worldR * 2 - 900);
  cam.far = dist + view3D.worldR * 2 + 2600;
  cam.updateProjectionMatrix();
}

// Точка мира → экранные пиксели (для номеров гибов на 2D-оверлее)
function view3DProjectToScreen(x, y, z) {
  if (!view3DIsActive() || !window.THREE) return null;
  const v = new THREE.Vector3(x, y, z).project(view3D.camera);
  return { x: (v.x + 1) / 2 * view3D.curW, y: (1 - v.y) / 2 * view3D.curH };
}

// Подпись профиля (кэш геометрии: перестраиваем только при изменениях)
function view3DProfileSig() {
  const pts = S.points.map(function (p) {
    return Math.round(p.x * 10) + ',' + Math.round(p.y * 10);
  }).join(';');
  const hems = (S.hems || []).map(function (h) {
    return h.segIndex + ':' + (h.height || 0) + ':' + (h.side || '');
  }).join(';');
  return [pts, S.metal.thickness, S.metal.width, S.metal.bendRadius,
    S.metal.kFactor, (S.simFaceSide || 'up'), hems].join('|');
}

// ── Полный кадр: геометрия по подписи + камера + render ──
function view3DRender(useFull) {
  if (!view3DIsActive()) return false;
  const w = useFull ? view3dFullW : view3dW;
  const h = useFull ? view3dFullH : view3dH;
  if (w < 10 || h < 10 || S.points.length < 2) return false;
  view3DPlaceGL(useFull);
  if (view3D.lastW !== w || view3D.lastH !== h) {
    view3D.renderer.setSize(w, h);
    view3D.lastW = w; view3D.lastH = h;
  }
  view3D.curW = w; view3D.curH = h;
  const c = view3D.renderer.domElement;
  c.style.display = 'block';
  c.style.background = S.isDark
    ? 'radial-gradient(circle at 50% 32%, #23233c 0%, #17172a 62%, #0f0f1c 100%)'
    : 'radial-gradient(circle at 50% 32%, #ffffff 0%, #eef1f5 55%, #dfe3ea 100%)';
  // линии гибов: янтарный по теме (как в 2D)
  view3D.bendLineMat.color.setHex(S.isDark ? 0xfbbf24 : 0xf59e0b);

  // геометрия — по подписи (вращение/зум её не меняют)
  const sig = view3DProfileSig();
  if (sig !== view3D.geoSig || !view3D.profile) {
    view3D.profile = view3DBuildProfile();
    view3DRebuildSheet(view3D.profile);
    view3D.geoSig = sig;
  }

  view3DUpdateCamera(w, h);
  view3D.renderer.render(view3D.scene, view3D.camera);

  // экранные позиции номеров гибов (для 2D-оверлея)
  view3D.bendScreen = [];
  const prof = view3D.profile;
  const off = prof.T / 2 + Math.max(0.4, prof.T * 0.15);
  (prof.bends || []).forEach(function (b) {
    const scr = view3DProjectToScreen(b.mx + b.ox * off, b.my + b.oy * off, 0);
    if (scr && scr.x > 10 && scr.x < w - 10 && scr.y > 10 && scr.y < h - 10) {
      view3D.bendScreen.push({ x: scr.x, y: scr.y - 9, num: b.num });
    }
  });
  return true;
}

// Публичное API для view3d.js: попробовать отрисовать WebGL.
// false → вызывающий код рисует прежний canvas-рендер.
function view3DTryRender(useFull) {
  if (!view3DIsActive()) return false;
  if (useFull) return view3DRender(true);
  // миниатюра: не отбираем GL-канвас у ОТКРЫТОЙ модалки
  if (view3D.placedFull && typeof view3dModalOpen !== 'undefined' && view3dModalOpen) return false;
  return view3DRender(false);
}

// Данные для оверлея (номера гибов) — после view3DTryRender
function view3DGetBendsScreen() {
  return view3D.bendScreen;
}
