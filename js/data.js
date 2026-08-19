// ==================== METAL TYPES & PRESETS ====================
const METAL_TYPES = [
  {
    nameRu: 'Сталь', nameEn: 'Steel', kFactor: 0.38,
    defaultThickness: 1.5,
    densities: { 0.5: 7.85e-6, 1: 7.85e-6, 1.5: 7.85e-6, 2: 7.85e-6, 3: 7.85e-6 }
  },
  {
    nameRu: 'Нержавеющая сталь', nameEn: 'Stainless Steel', kFactor: 0.5,
    defaultThickness: 0.8,
    densities: { 0.5: 7.93e-6, 1: 7.93e-6, 1.5: 7.93e-6, 2: 7.93e-6 }
  },
  {
    nameRu: 'Алюминий', nameEn: 'Aluminum', kFactor: 0.33,
    defaultThickness: 1.5,
    densities: { 0.5: 2.7e-6, 1: 2.7e-6, 1.5: 2.7e-6, 2: 2.7e-6, 3: 2.7e-6 }
  },
  {
    nameRu: 'Медь', nameEn: 'Copper', kFactor: 0.35,
    defaultThickness: 1,
    densities: { 0.5: 8.96e-6, 1: 8.96e-6, 1.5: 8.96e-6, 2: 8.96e-6 }
  },
  {
    nameRu: 'Латунь', nameEn: 'Brass', kFactor: 0.35,
    defaultThickness: 1,
    densities: { 0.5: 8.5e-6, 1: 8.5e-6, 1.5: 8.5e-6, 2: 8.5e-6 }
  },
  {
    nameRu: 'Оцинкованная сталь', nameEn: 'Galvanized Steel', kFactor: 0.40,
    defaultThickness: 0.8,
    densities: { 0.5: 7.85e-6, 0.8: 7.85e-6, 1: 7.85e-6, 1.2: 7.85e-6, 1.5: 7.85e-6 }
  },
  {
    nameRu: 'Пользовательский', nameEn: 'Custom', kFactor: 0.38,
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

// Пуансоны (punch): радиус вершины, максимальный угол гиба
const PUNCHES = [
  { id: 'R0.5', nameRu: 'R0.5', nameEn: 'R0.5', radius: 0.5, maxAngle: 90 },
  { id: 'R1', nameRu: 'R1', nameEn: 'R1', radius: 1, maxAngle: 90 },
  { id: 'R1.5', nameRu: 'R1.5', nameEn: 'R1.5', radius: 1.5, maxAngle: 90 },
  { id: 'R2', nameRu: 'R2', nameEn: 'R2', radius: 2, maxAngle: 90 },
  { id: 'R3', nameRu: 'R3', nameEn: 'R3', radius: 3, maxAngle: 90 },
  { id: 'R5', nameRu: 'R5', nameEn: 'R5', radius: 5, maxAngle: 90 },
  { id: 'R8', nameRu: 'R8', nameEn: 'R8', radius: 8, maxAngle: 90 },
  { id: 'R10', nameRu: 'R10', nameEn: 'R10', radius: 10, maxAngle: 90 }
];

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