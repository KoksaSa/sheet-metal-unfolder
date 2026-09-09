// ==================== METAL TYPES & PRESETS ====================
const METAL_TYPES = [
  {
    nameRu: 'Сталь', nameEn: 'Steel', kFactor: 0.38, tensile: 400,
    defaultThickness: 1.5,
    densities: { 0.5: 7.85e-6, 1: 7.85e-6, 1.5: 7.85e-6, 2: 7.85e-6, 3: 7.85e-6 }
  },
  {
    nameRu: 'Нержавеющая сталь', nameEn: 'Stainless Steel', kFactor: 0.5, tensile: 600,
    defaultThickness: 0.8,
    densities: { 0.5: 7.93e-6, 1: 7.93e-6, 1.5: 7.93e-6, 2: 7.93e-6 }
  },
  {
    nameRu: 'Алюминий', nameEn: 'Aluminum', kFactor: 0.33, tensile: 200,
    defaultThickness: 1.5,
    densities: { 0.5: 2.7e-6, 1: 2.7e-6, 1.5: 2.7e-6, 2: 2.7e-6, 3: 2.7e-6 }
  },
  {
    nameRu: 'Медь', nameEn: 'Copper', kFactor: 0.35, tensile: 250,
    defaultThickness: 1,
    densities: { 0.5: 8.96e-6, 1: 8.96e-6, 1.5: 8.96e-6, 2: 8.96e-6 }
  },
  {
    nameRu: 'Латунь', nameEn: 'Brass', kFactor: 0.35, tensile: 350,
    defaultThickness: 1,
    densities: { 0.5: 8.5e-6, 1: 8.5e-6, 1.5: 8.5e-6, 2: 8.5e-6 }
  },
  {
    nameRu: 'Оцинкованная сталь', nameEn: 'Galvanized Steel', kFactor: 0.40, tensile: 400,
    defaultThickness: 0.8,
    densities: { 0.5: 7.85e-6, 0.8: 7.85e-6, 1: 7.85e-6, 1.2: 7.85e-6, 1.5: 7.85e-6 }
  },
  {
    nameRu: 'Пользовательский', nameEn: 'Custom', kFactor: 0.38, tensile: 400,
    defaultThickness: 1.5,
    densities: { 0.5: 7.85e-6, 1: 7.85e-6, 1.5: 7.85e-6, 2: 7.85e-6, 3: 7.85e-6 }
  }
];

const THICKNESS_OPTIONS = [0.3, 0.5, 0.8, 1, 1.2, 1.5, 2, 2.5, 3, 4, 5];

// ==================== BENDING TOOLS (MATRITSY I PUNSONY) ====================
// V-матрицы (die): vWidth — ширина канавки V, height — толщина матрицы, maxAngle — макс. угол
const DIES = [
  { id: 'V8',  nameRu: 'V8',  nameEn: 'V8',  vWidth: 8,  height: 30,  maxAngle: 140 },
  { id: 'V10', nameRu: 'V10', nameEn: 'V10', vWidth: 10, height: 35,  maxAngle: 140 },
  { id: 'V12', nameRu: 'V12', nameEn: 'V12', vWidth: 12, height: 40,  maxAngle: 140 },
  { id: 'V16', nameRu: 'V16', nameEn: 'V16', vWidth: 16, height: 50,  maxAngle: 140 },
  { id: 'V20', nameRu: 'V20', nameEn: 'V20', vWidth: 20, height: 60,  maxAngle: 140 },
  { id: 'V25', nameRu: 'V25', nameEn: 'V25', vWidth: 25, height: 70,  maxAngle: 140 },
  { id: 'V32', nameRu: 'V32', nameEn: 'V32', vWidth: 32, height: 80,  maxAngle: 140 },
  { id: 'V40', nameRu: 'V40', nameEn: 'V40', vWidth: 40, height: 100, maxAngle: 140 },
  { id: 'V50', nameRu: 'V50', nameEn: 'V50', vWidth: 50, height: 120, maxAngle: 140 },
  { id: 'V63', nameRu: 'V63', nameEn: 'V63', vWidth: 63, height: 140, maxAngle: 140 },
  { id: 'V80', nameRu: 'V80', nameEn: 'V80', vWidth: 80, height: 160, maxAngle: 140 }
];

// Пуансоны (punch): РЕАЛЬНЫЕ промышленные профили (European/Promecam style,
// самые распространённые типы прессового инструмента):
//   корпус 30 мм, хвостовик (tang) 13×30 мм, полная высота 75–110 мм.
// Система координат профиля: вершина (нос) — в (0,0), ось Y — вверх,
// X — поперёк машины. profile.tipX — X вершины внутри профиля
// (несимметричные: гусиная шея, Z-ступенчатый).
const PUNCH_BODY_W = 30;  // ширина корпуса, мм (European style)
const PUNCH_TANG_W = 13;  // хвостовик European: 13×30 мм
const PUNCH_TANG_H = 30;

// Дуга полилинией: от угла a0 к a1 (радианы, против часовой), n сегментов
function punchArcPts(cx, cy, r, a0, a1, n) {
  const pts = [];
  n = Math.max(3, Math.round(n));
  for (let i = 0; i <= n; i++) {
    const a = a0 + (a1 - a0) * i / n;
    pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
  }
  return pts;
}

// Финализация профиля: bbox + нормализация minY → 0 (вершина = низ профиля)
function punchFinishProfile(pts, tipX) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  pts.forEach(p => {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  });
  if (minY !== 0) {
    for (let i = 0; i < pts.length; i++) pts[i] = { x: pts[i].x, y: pts[i].y - minY };
    maxY -= minY; minY = 0;
  }
  return {
    chains: [pts],
    minX: minX, maxX: maxX, minY: minY, maxY: maxY,
    width: maxX - minX, height: maxY - minY,
    tipX: (tipX !== undefined ? tipX : (minX + maxX) / 2)
  };
}

// Ось X вершины пуансона в координатах профиля (для позиционирования
// на оси гиба). Симметричные — центр bbox; несимметричные — profile.tipX.
function punchProfileAxisX(profile) {
  if (!profile) return 0;
  if (profile.tipX !== undefined && profile.tipX !== null) return profile.tipX;
  return (profile.minX || 0) + (profile.width || 0) / 2;
}

// Симметричный пуансон-«крыша» (стандарт 88°, острый 30°…):
// r — радиус вершины; angle — угол между гранями (°); body — корпус; H — высота.
function punchSymProfile(r, angle, body, H) {
  const A = (angle / 2) * Math.PI / 180;      // полуугол от вертикали
  const half = body / 2;
  const d = r / Math.sin(A);                  // центр дуги вершины
  const t = Math.sqrt(d * d - r * r);         // касательная от апекса
  const pRx = Math.sin(A) * t, pRy = Math.cos(A) * t;
  const yF = pRy + (half - pRx) * Math.cos(A) / Math.sin(A); // грань → корпус
  const yBT = H - PUNCH_TANG_H - 3;           // верх корпуса (низ фаски)
  const tw = PUNCH_TANG_W / 2;
  const pts = [];
  pts.push.apply(pts, punchArcPts(0, d, r, Math.PI + A, 2 * Math.PI - A, Math.max(5, Math.round(r * 2) + 5)));
  pts.push({ x: half, y: yF });        // правая грань
  pts.push({ x: half, y: yBT });       // правый корпус
  pts.push({ x: tw, y: H - PUNCH_TANG_H }); // фаска хвостовика
  pts.push({ x: tw, y: H });           // хвостовик
  pts.push({ x: -tw, y: H });
  pts.push({ x: -tw, y: H - PUNCH_TANG_H });
  pts.push({ x: -half, y: yBT });      // левый корпус
  pts.push({ x: -half, y: yF });       // левая грань (замыкание → дуга)
  return punchFinishProfile(pts, 0);
}

// Гусиная шея (gooseneck): горло для высоких полок/U-профилей, корпус
// смещён вправо на throat мм. Вершина — в (0,0), шейка изгибается вправо-вверх.
function punchGooseProfile(r, angle, body, H, throat) {
  const A = (angle / 2) * Math.PI / 180;
  const d = r / Math.sin(A);
  const half = body / 2;
  const bx = throat, bxR = throat + body;      // корпус: [bx, bxR]
  const yBT = H - PUNCH_TANG_H - 3;
  const tw = PUNCH_TANG_W / 2;
  const pts = [];
  pts.push.apply(pts, punchArcPts(0, d, r, Math.PI + A, 2 * Math.PI - A, 6));
  pts.push({ x: Math.sin(A) * (Math.sqrt(d*d - r*r)) + 1.7, y: Math.cos(A) * (Math.sqrt(d*d - r*r)) + 1.7 }); // короткая правая грань
  // нижняя кромка шейки (свисает над листом с зазором)
  [[7, 3.4], [13, 5], [19, 7], [25, 9.5], [30, 12], [34, 14.3], [37, 15.7]].forEach(p => {
    pts.push({ x: p[0] * (throat / 40), y: p[1] });
  });
  pts.push({ x: bx, y: 16.5 });               // левый нижний угол корпуса
  pts.push({ x: bxR, y: 16.5 });              // нижняя грань корпуса
  pts.push({ x: bxR, y: yBT });               // правый корпус
  pts.push({ x: bx + half + tw, y: H - PUNCH_TANG_H }); // фаска
  pts.push({ x: bx + half + tw, y: H });      // хвостовик
  pts.push({ x: bx + half - tw, y: H });
  pts.push({ x: bx + half - tw, y: H - PUNCH_TANG_H });
  pts.push({ x: bx, y: yBT });                // левый корпус (верх)
  pts.push({ x: bx, y: 52 });                 // начало горла
  // горло: вогнутая кривая гусиной шеи (полка детали проходит под ней)
  [[36, 48], [31, 43], [25.5, 37.5], [20, 32], [15, 26.5], [10.5, 21], [7, 15.5], [4.2, 10.5], [2.4, 6.5], [1.3, 3], [0.6, 1.6]].forEach(p => {
    pts.push({ x: p[0] * (throat / 40), y: p[1] });
  });
  return punchFinishProfile(pts, 0);          // замыкание → левая грань вершины
}

// Плоский закатной (hemming): широкая плоская подошва flatW со скосами
// edgeR→30° — для подгибки/закатки каймы.
function punchFlatProfile(flatW, edgeR, body, H) {
  const half = body / 2, tw = PUNCH_TANG_W / 2;
  const fx = flatW / 2;
  const yBT = H - PUNCH_TANG_H - 3;
  const yB = 2 + (half - fx) / Math.tan(Math.PI / 6); // скос 30° от вертикали
  const pts = [];
  pts.push({ x: -fx + edgeR, y: 0 });                          // плоская подошва (лево)
  pts.push.apply(pts, punchArcPts(-fx + edgeR, edgeR, edgeR, -Math.PI / 2, Math.PI, 5));
  pts.push({ x: -half, y: yB });                               // скос
  pts.push({ x: -half, y: yBT });
  pts.push({ x: -tw, y: H - PUNCH_TANG_H });
  pts.push({ x: -tw, y: H });
  pts.push({ x: tw, y: H });
  pts.push({ x: tw, y: H - PUNCH_TANG_H });
  pts.push({ x: half, y: yBT });
  pts.push({ x: half, y: yB });                                // скос (право)
  pts.push.apply(pts, punchArcPts(fx - edgeR, edgeR, edgeR, 0, -Math.PI / 2, 5));
  pts.push({ x: fx - edgeR, y: 0 });                           // подошва (право) → замк.
  return punchFinishProfile(pts, 0);
}

// Z-ступенчатый (offset): две вершины 88° на разных высотах (stepH),
// между ними вертикальная стенка. Ось гиба — под стенкой (tipX=0).
function punchOffsetProfile(r, angle, stepH, dx, body, H) {
  const A = (angle / 2) * Math.PI / 180;
  const half = body / 2, tw = PUNCH_TANG_W / 2;
  const d = r / Math.sin(A);
  const t = Math.sqrt(d * d - r * r);
  const pLy = Math.cos(A) * t;                 // Y касательных дуг носов
  const k = Math.cos(A) / Math.sin(A);         // котангенс полуугла
  const yBT = H - PUNCH_TANG_H - 3;
  const wall0 = pLy + (dx - Math.sin(A) * t) * k;        // грань нижнего носа → ось
  const wall1 = wall0 + stepH;                           // верх стенки
  const yFL = pLy + (half - dx - Math.sin(A) * t) * k;   // левая грань нижнего носа
  const yFU = stepH + pLy + (half - dx - Math.sin(A) * t) * k; // правая грань верхнего
  const pts = [];
  pts.push.apply(pts, punchArcPts(-dx, d, r, Math.PI + A, 2 * Math.PI - A, 6)); // нижний нос
  pts.push({ x: 0, y: wall0 });                        // грань → стенка
  pts.push({ x: 0, y: wall1 });                        // стенка
  pts.push({ x: dx - Math.sin(A) * t, y: stepH + pLy }); // левая грань верхнего носа
  pts.push.apply(pts, punchArcPts(dx, d + stepH, r, Math.PI + A, 2 * Math.PI - A, 6)); // верхний нос
  pts.push({ x: half, y: yFU });
  pts.push({ x: half, y: yBT });
  pts.push({ x: tw, y: H - PUNCH_TANG_H });
  pts.push({ x: tw, y: H });
  pts.push({ x: -tw, y: H });
  pts.push({ x: -tw, y: H - PUNCH_TANG_H });
  pts.push({ x: -half, y: yBT });
  pts.push({ x: -half, y: yFL });
  return punchFinishProfile(pts, 0);
}

const PUNCHES = [
  { id: 'STD88-R0.5', nameRu: 'Стандарт 88° R0.5', nameEn: 'Standard 88° R0.5', type: 'standard', angle: 88, radius: 0.5, swidth: PUNCH_BODY_W, height: 75, maxAngle: 90, profile: punchSymProfile(0.5, 88, PUNCH_BODY_W, 75) },
  { id: 'STD88-R1',   nameRu: 'Стандарт 88° R1',   nameEn: 'Standard 88° R1',   type: 'standard', angle: 88, radius: 1,   swidth: PUNCH_BODY_W, height: 75, maxAngle: 90, profile: punchSymProfile(1, 88, PUNCH_BODY_W, 75) },
  { id: 'STD88-R2',   nameRu: 'Стандарт 88° R2',   nameEn: 'Standard 88° R2',   type: 'standard', angle: 88, radius: 2,   swidth: PUNCH_BODY_W, height: 75, maxAngle: 90, profile: punchSymProfile(2, 88, PUNCH_BODY_W, 75) },
  { id: 'STD88-R4',   nameRu: 'Стандарт 88° R4',   nameEn: 'Standard 88° R4',   type: 'standard', angle: 88, radius: 4,   swidth: PUNCH_BODY_W, height: 75, maxAngle: 90, profile: punchSymProfile(4, 88, PUNCH_BODY_W, 75) },
  { id: 'RAD88-R8',   nameRu: 'Радиусный 88° R8',  nameEn: 'Radius 88° R8',     type: 'radius',   angle: 88, radius: 8,   swidth: PUNCH_BODY_W, height: 75, maxAngle: 90, profile: punchSymProfile(8, 88, PUNCH_BODY_W, 75) },
  { id: 'ACUTE30-R1', nameRu: 'Острый 30° R1',     nameEn: 'Acute 30° R1',      type: 'acute',    angle: 30, radius: 1,   swidth: PUNCH_BODY_W, height: 110, maxAngle: 90, profile: punchSymProfile(1, 30, PUNCH_BODY_W, 110) },
  { id: 'GOOSE-88',   nameRu: 'Гусиная шея 88°',   nameEn: 'Gooseneck 88°',     type: 'gooseneck', angle: 88, radius: 1, swidth: PUNCH_BODY_W, height: 100, maxAngle: 88, profile: punchGooseProfile(1, 88, PUNCH_BODY_W, 100, 40) },
  { id: 'FLAT-HEM',   nameRu: 'Закатной плоский',  nameEn: 'Flat hemming',      type: 'hemming',  angle: 176, radius: 2,  swidth: PUNCH_BODY_W, height: 75, maxAngle: 175, profile: punchFlatProfile(12, 2, PUNCH_BODY_W, 75) },
  { id: 'OFFSET-Z',   nameRu: 'Z-ступенчатый 88°', nameEn: 'Offset (Z) 88°',    type: 'offset',   angle: 88, radius: 1,   swidth: PUNCH_BODY_W, height: 75, maxAngle: 88, profile: punchOffsetProfile(1, 88, 8, 9, PUNCH_BODY_W, 75) }
];

// ==================== CUSTOM TOOLS (USER DEFINED) ====================
function loadCustomTools() {
  try {
    const raw = localStorage.getItem('custom-tools');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { customDies: [], customPunches: [] };
}

function saveCustomTools(tools) {
  localStorage.setItem('custom-tools', JSON.stringify(tools));
}

function addCustomDie(die) {
  const tools = loadCustomTools();
  die.id = 'CUST-D-' + Date.now();
  die.isCustom = true;
  tools.customDies.push(die);
  saveCustomTools(tools);
}

function addCustomPunch(punch) {
  const tools = loadCustomTools();
  punch.id = 'CUST-P-' + Date.now();
  punch.isCustom = true;
  tools.customPunches.push(punch);
  saveCustomTools(tools);
}

function deleteCustomDie(id) {
  const tools = loadCustomTools();
  tools.customDies = tools.customDies.filter(d => d.id !== id);
  saveCustomTools(tools);
}

function deleteCustomPunch(id) {
  const tools = loadCustomTools();
  tools.customPunches = tools.customPunches.filter(p => p.id !== id);
  saveCustomTools(tools);
}

// ═══════════════════════════════════════════════════════════════
// ЕДИНЫЙ РЕЕСТР ИНСТРУМЕНТОВ (встроенные пресеты + свои)
// Индексация: [0 .. N-1] — встроенные DIES/PUNCHES,
//             [N .. ] — пользовательские (customDies/customPunches).
// ═══════════════════════════════════════════════════════════════
function getAllDies() {
  const tools = loadCustomTools();
  return DIES.concat(tools.customDies || []);
}

function getAllPunches() {
  const tools = loadCustomTools();
  return PUNCHES.concat(tools.customPunches || []);
}

function getDieByIndex(idx) {
  if (idx === undefined || idx === null || isNaN(idx)) idx = 0;
  const all = getAllDies();
  return all[idx] || null;
}

function getPunchByIndex(idx) {
  if (idx === undefined || idx === null || isNaN(idx)) idx = 0;
  const all = getAllPunches();
  return all[idx] || null;
}

const PRESET_SHAPES = [
  { nameRu: 'L-образный', nameEn: 'L-shape', icon: 'L', points: [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: -60 }] },
  { nameRu: 'U-образный', nameEn: 'U-shape', icon: 'U', points: [{ x: 0, y: 0 }, { x: 120, y: 0 }, { x: 120, y: -80 }, { x: 0, y: -80 }] },
  { nameRu: 'Z-образный', nameEn: 'Z-shape', icon: 'Z', points: [{ x: 0, y: 0 }, { x: 80, y: 0 }, { x: 80, y: -50 }, { x: 160, y: -50 }] },
  { nameRu: 'Коробка', nameEn: 'Box', icon: '⎓', points: [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: -80 }, { x: 0, y: -80 }] },
  { nameRu: 'Шляпа', nameEn: 'Hat', icon: '⌶', points: [{ x: 0, y: 0 }, { x: 40, y: 0 }, { x: 40, y: -60 }, { x: 120, y: -60 }, { x: 120, y: 0 }, { x: 160, y: 0 }] },
  { nameRu: 'Загиб', nameEn: 'Hem', icon: '⌟', points: [{ x: 0, y: 0 }, { x: 80, y: 0 }, { x: 80, y: -20 }] },
  { nameRu: 'Ступень', nameEn: 'Step', icon: 'Π', points: [{ x: 0, y: 0 }, { x: 60, y: 0 }, { x: 60, y: -40 }, { x: 140, y: -40 }, { x: 140, y: -80 }, { x: 200, y: -80 }] },
  { nameRu: 'Канал', nameEn: 'Channel', icon: '⊂', points: [{ x: 0, y: -40 }, { x: 0, y: 0 }, { x: 40, y: 0 }, { x: 40, y: -40 }, { x: 80, y: -40 }, { x: 80, y: 0 }, { x: 120, y: 0 }, { x: 120, y: -40 }] },
  { nameRu: 'Зигзаг', nameEn: 'Zigzag', icon: '⌟', points: [{ x: 0, y: 0 }, { x: 50, y: 0 }, { x: 50, y: -30 }, { x: 100, y: -30 }, { x: 100, y: 0 }, { x: 150, y: 0 }, { x: 150, y: -30 }, { x: 200, y: -30 }] },
  { nameRu: 'Скоба', nameEn: 'Bracket', icon: '{', points: [{ x: 0, y: 0 }, { x: 150, y: 0 }, { x: 150, y: -30 }, { x: 30, y: -30 }, { x: 30, y: -60 }, { x: 0, y: -60 }] },
  { nameRu: 'Жалюзи', nameEn: 'Louver', icon: '≡', points: [{ x: 0, y: 0 }, { x: 30, y: 0 }, { x: 30, y: -15 }, { x: 60, y: -15 }, { x: 60, y: 0 }, { x: 90, y: 0 }, { x: 90, y: -15 }, { x: 120, y: -15 }, { x: 120, y: 0 }, { x: 150, y: 0 }] },
  { nameRu: 'Трапеция', nameEn: 'Trapezoid', icon: '△', points: [{ x: 0, y: 0 }, { x: 20, y: 0 }, { x: 80, y: -40 }, { x: 120, y: -40 }, { x: 100, y: 0 }, { x: 140, y: 0 }] },
  { nameRu: 'Рёбро', nameEn: 'Stiffener', icon: '⊕', points: [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: -5 }, { x: 60, y: -5 }, { x: 60, y: -20 }, { x: 0, y: -20 }] },
  { nameRu: 'Замок', nameEn: 'Lock Seam', icon: '⊝', points: [{ x: 0, y: 0 }, { x: 80, y: 0 }, { x: 80, y: -10 }, { x: 90, y: -10 }, { x: 90, y: -30 }, { x: 80, y: -30 }, { x: 80, y: -40 }, { x: 0, y: -40 }] },
  { nameRu: 'Полка', nameEn: 'Shelf', icon: '⊣', points: [{ x: 0, y: 0 }, { x: 120, y: 0 }, { x: 120, y: -80 }, { x: 0, y: -80 }] }
];

// SVG path points for preset thumbnails
const PRESET_SVG_PTS = {
  'L-образный': '2,14 10,14 10,2',
  'U-образный': '2,14 2,2 10,2 10,14',
  'Z-образный': '2,14 7,14 7,8 12,8',
  'Коробка': '2,14 2,2 10,2 10,14',
  'Шляпа': '2,14 4,14 4,6 8,6 8,14 10,14',
  'Загиб': '2,14 10,14 10,10',
  'Ступень': '2,14 5,14 5,8 9,8 9,2 12,2',
  'Канал': '2,8 2,14 5,14 5,8 7,8 7,14 10,14 10,8',
  'Зигзаг': '2,14 4,14 4,10 7,10 7,14 9,14 9,10 12,10',
  'Скоба': '2,14 10,14 10,11 3,11 3,8 2,8',
  'Жалюзи': '2,14 4,14 4,12 6,12 6,14 7,14 7,12 9,12 9,14 10,14',
  'Трапеция': '2,14 3,14 7,8 9,8 8,14 11,14',
  'Рёбро': '2,14 10,14 10,13 7,13 7,10 2,10',
  'Замок': '2,14 7,14 7,12 8,12 8,7 7,7 7,5 2,5',
  'Полка': '2,14 10,14 10,2 2,2'
};