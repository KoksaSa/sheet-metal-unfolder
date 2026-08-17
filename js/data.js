// ==================== METAL TYPES & PRESETS ====================
const METAL_TYPES = [
  {
    nameRu: 'Сталь', nameEn: 'Steel', kFactor: 0.38,
    defaultThickness: 1.5,
    densities: { 0.5: 7.85e-6, 1: 7.85e-6, 1.5: 7.85e-6, 2: 7.85e-6, 3: 7.85e-6 }
  },
  {
    nameRu: 'Нержавеющая сталь', nameEn: 'Stainless Steel', kFactor: 0.42,
    defaultThickness: 1,
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