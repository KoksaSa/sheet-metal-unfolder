// ═══════════════════════════════════════════════════════════════
// CANVAS / HEM-2D — визуальные «крючки» каймы на холсте рисования
// и лицевая сторона профиля в режиме рисования
// ═══════════════════════════════════════════════════════════════

// ==================== HEM HOOKS (2D) ====================
function drawHemHooks2D() {
  if (S.points.length < 2 || !S.hems || S.hems.length === 0) return;
  S.hems.forEach(hem => {
    const si = hem.segIndex;
    const numSegs = S.points.length - 1;
    if (si < 0 || si > numSegs) return;
    let pt, neighbor;
    if (si >= numSegs - 1) {
      // Hem at the end point of the last segment (edge of contour)
      pt = S.points[S.points.length - 1];
      neighbor = S.points[S.points.length - 2];
    } else {
      pt = S.points[si];
      neighbor = S.points[si + 1];
    }
    const isLeft = hem.side !== 'right';
    drawSingleHemHook(pt, neighbor, hem.height, isLeft);
  });
}

function drawSingleHemHook(pt, neighbor, hemHeight, isLeft) {
  const segAngle = Math.atan2(neighbor.y - pt.y, neighbor.x - pt.x);
  // Перпендикуляр вниз (внутрь материала)
  const perpAngle = isLeft ? (segAngle - Math.PI / 2) : (segAngle + Math.PI / 2);

  const br = S.metal.bendRadius;

  // Геометрия каймы:
  // pt → h1: перпендикуляр вниз на радиус гиба
  // h1 → h2: параллельно ребру (вперёд) на указанную длину
  const h1w = {
    x: pt.x + Math.cos(perpAngle) * br,
    y: pt.y + Math.sin(perpAngle) * br
  };
  const h2w = {
    x: h1w.x + Math.cos(segAngle) * hemHeight,
    y: h1w.y + Math.sin(segAngle) * hemHeight
  };

  const c0 = w2c(pt.x, pt.y);
  const c1 = w2c(h1w.x, h1w.y);
  const c2 = w2c(h2w.x, h2w.y);

  const color = isLeft ? '#3b82f6' : '#8b5cf6';

  drawCtx.save();

  // L-образный контур каймы
  drawCtx.strokeStyle = color;
  drawCtx.lineWidth = 1.5;
  drawCtx.lineCap = 'round';
  drawCtx.lineJoin = 'round';
  drawCtx.beginPath();
  drawCtx.moveTo(c0.cx, c0.cy);
  drawCtx.lineTo(c1.cx, c1.cy);
  drawCtx.lineTo(c2.cx, c2.cy);
  drawCtx.stroke();

  // Точка гиба
  drawCtx.beginPath();
  drawCtx.arc(c1.cx, c1.cy, 3, 0, Math.PI * 2);
  drawCtx.fillStyle = color;
  drawCtx.fill();

  // Подпись — вдоль параллельной части (h1→h2)
  drawCtx.font = 'bold 8px sans-serif';
  drawCtx.textAlign = 'center';
  drawCtx.textBaseline = 'middle';
  const label = 'H' + hemHeight.toFixed(0);
  const lx = (c1.cx + c2.cx) / 2;
  const ly = (c1.cy + c2.cy) / 2;
  // Смещение подписи от линии
  const offset = isLeft ? -12 : 12;
  const segPerpX = -Math.sin(segAngle) * offset;
  const segPerpY = Math.cos(segAngle) * offset;
  drawCtx.fillStyle = color;
  drawCtx.fillText(label, lx + segPerpX, ly + segPerpY);

  drawCtx.restore();
}

// ==================== ЛИЦЕВАЯ СТОРОНА (режим рисования) ====================
/**
 * Голубая полоска вдоль профиля на ИСХОДНОЙ «верхней» грани.
 * Смещение = левая нормаль к направлению сегмента × (faceUp ? +1 : -1).
 * На вершинах — miter-join (усреднение нормалей соседних сегментов).
 */
function drawFaceSideDrawing(pts, ctx) {
  if (!pts || pts.length < 2) return;
  const T = S.metal.thickness || 1;
  const faceUp = (S.simFaceSide || 'up') === 'up';
  const sign = faceUp ? 1 : -1; // +1 = left normal, -1 = right normal
  const offset = (T / 2) * sign;

  // Нормали сегментов (left normal = поворот направления на +90° CCW в world coords)
  const segNormals = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const dx = pts[i + 1].x - pts[i].x;
    const dy = pts[i + 1].y - pts[i].y;
    const len = Math.hypot(dx, dy);
    if (len < 1e-6) {
      segNormals.push({ x: 0, y: 0 });
    } else {
      segNormals.push({ x: -dy / len, y: dx / len });
    }
  }

  // Смещённые точки (miter-join на вершинах)
  const facePts = [];
  for (let i = 0; i < pts.length; i++) {
    let nx, ny;
    if (i === 0) {
      nx = segNormals[0].x; ny = segNormals[0].y;
    } else if (i === pts.length - 1) {
      nx = segNormals[pts.length - 2].x;
      ny = segNormals[pts.length - 2].y;
    } else {
      const n1 = segNormals[i - 1], n2 = segNormals[i];
      nx = (n1.x + n2.x) / 2;
      ny = (n1.y + n2.y) / 2;
      const len = Math.hypot(nx, ny);
      if (len > 1e-6) { nx /= len; ny /= len; }
      else { nx = n1.x; ny = n1.y; }
    }
    facePts.push({ x: pts[i].x + nx * offset, y: pts[i].y + ny * offset });
  }

  // Голубая линия
  ctx.save();
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  const first = w2c(facePts[0].x, facePts[0].y);
  ctx.moveTo(first.cx, first.cy);
  for (let i = 1; i < facePts.length; i++) {
    const c = w2c(facePts[i].x, facePts[i].y);
    ctx.lineTo(c.cx, c.cy);
  }
  ctx.stroke();
  ctx.restore();
}
