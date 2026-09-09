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

// Пуансон (punch): реальный промышленный профиль (European/Promecam
// style): корпус 30 мм, хвостовик (tang) 13×30 мм, полная высота 75 мм.
// v5.5: в списке один инструмент — Стандарт 88° R1 (самый ходовой).
// Система координат профиля: вершина (нос) — в (0,0), ось Y — вверх,
// X — поперёк машины. profile.tipX — X вершины внутри профиля
// (для несимметричных DXF-пуансонов).
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

// v5.5: по просьбе пользователя в списке оставлен ОДИН стандартный
// пуансон 88° (R1) — самый ходовой инструмент европейского типа.
// Удалены: R0.5/R2/R4-варианты, радиусный R8, острый 30°, гусиная
// шея, закатной и Z-ступенчатый (профили из v5.4).
const PUNCHES = [
  { id: 'STD88-R1', nameRu: 'Стандарт 88° R1', nameEn: 'Standard 88° R1', type: 'standard', angle: 88, radius: 1, swidth: PUNCH_BODY_W, height: 75, maxAngle: 90, profile: punchSymProfile(1, 88, PUNCH_BODY_W, 75) }
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
  if (!all.length) return null;
  // v5.5: список встроенных пуансонов сокращён — старые сохранённые
  // индексы (гусиная шея и др. из v5.4) мягко уводим на стандартный.
  if (idx < 0 || idx > all.length - 1) idx = 0;
  return all[idx] || null;
}

// v5.5: нормализация индекса пуансона в S.metal после загрузки старого
// проекта (индекс мог указывать на удалённую позицию). Вызывается из
// init/importJSON/loadProject — чтобы и селект, и отрисовка совпадали.
function normalizePunchIndex() {
  const all = getAllPunches();
  let i = S.metal.punchIndex;
  if (i === undefined || i === null || isNaN(i) || i < 0 || i > all.length - 1) i = 0;
  S.metal.punchIndex = i;
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