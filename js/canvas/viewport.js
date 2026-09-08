// ═══════════════════════════════════════════════════════════════
// CANVAS / VIEWPORT — холст рисования (draw-canvas): размеры,
// преобразование мир↔экран, поиск ближайшего сегмента
// ═══════════════════════════════════════════════════════════════

// Массив кликабельных областей для сегментов и точек
S._hitAreas = [];

// ==================== DRAWING CANVAS ====================
const drawCanvas = document.getElementById('draw-canvas');
const drawCtx = drawCanvas ? drawCanvas.getContext('2d') : null;
let canvasW = 400, canvasH = 300;
let isPanning = false, panStart = null, dragPtIdx = null;
let dragPunch = false;
let dragDie = false;
let measureStart = null, measureEnd = null, measureStep = 0;
let animFrame = 0;

// Мир → экран (Y инвертирован: мировой +Y вверх)
function w2c(wx, wy) {
  return { cx: wx * S.viewport.scale + S.viewport.offsetX, cy: -wy * S.viewport.scale + S.viewport.offsetY };
}
// Экран → мир
function c2w(cx, cy) {
  return { x: (cx - S.viewport.offsetX) / S.viewport.scale, y: -(cy - S.viewport.offsetY) / S.viewport.scale };
}

function resizeDrawCanvas() {
  const cont = document.getElementById('canvas-container');
  if (!cont) return;
  const r = cont.getBoundingClientRect();
  canvasW = Math.floor(r.width);
  canvasH = Math.floor(r.height);
  const dpr = window.devicePixelRatio || 1;
  drawCanvas.width = canvasW * dpr;
  drawCanvas.height = canvasH * dpr;
  drawCanvas.style.width = canvasW + 'px';
  drawCanvas.style.height = canvasH + 'px';
}

// ==================== АВТО-ПОДГОНКА ВЬЮПОРТА (v5.1) ====================
// Подогнать масштаб/центр холста рисования под текущий профиль:
// профиль целиком попадает в видимую область (с полями). Нужно, чтобы
// после импорта DXF (или «Открыть на холсте») деталь СРАЗУ была видна —
// вьюпорт не привязан к размерам импортированного контура, и без
// подгонки профиль может оказаться за пределами экрана.
// @returns {boolean} true, если вьюпорт подогнан
function fitProfileToView() {
  if (!S.points || S.points.length < 2) return false;
  const w = Math.max(60, canvasW || 400);
  const h = Math.max(60, canvasH || 300);
  // Габариты профиля в мировых координатах
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  S.points.forEach(p => {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  });
  const spanX = Math.max(1e-6, maxX - minX);
  const spanY = Math.max(1e-6, maxY - minY);
  const pad = 70; // px свободного поля вокруг профиля
  const scale = Math.max(0.1, Math.min(50, Math.min(
    (w - pad * 2) / spanX,
    (h - pad * 2) / spanY
  )));
  // Центр профиля → центр холста (w2c: cy = -wy*scale + offsetY)
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  S.viewport.scale = scale;
  S.viewport.offsetX = w / 2 - cx * scale;
  S.viewport.offsetY = h / 2 + cy * scale;
  return true;
}

// Поиск сегмента рядом с курсором (для каймы/контекстного меню)
function findNearSegment(cx, cy, threshold) {
  const thresh = threshold || 10;
  let bestDist = Infinity, bestIdx = -1;
  for (let i = 0; i < S.points.length - 1; i++) {
    const a = w2c(S.points[i].x, S.points[i].y);
    const b = w2c(S.points[i + 1].x, S.points[i + 1].y);
    const dx = b.cx - a.cx, dy = b.cy - a.cy;
    const len2 = dx * dx + dy * dy;
    if (len2 === 0) continue;
    let t = ((cx - a.cx) * dx + (cy - a.cy) * dy) / len2;
    t = Math.max(0, Math.min(1, t));
    const px = a.cx + t * dx, py = a.cy + t * dy;
    const d = Math.sqrt((cx - px) ** 2 + (cy - py) ** 2);
    if (d < bestDist && d < thresh) {
      bestDist = d; bestIdx = i;
    }
  }
  return bestIdx;
}
