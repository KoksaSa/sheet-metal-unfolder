// ═══════════════════════════════════════════════════════════════
// SIMULATION / PUNCH-CONTACT (v5.9) — предупреждение «контур
// профиля касается контура пуансона» ПОСЛЕ ВЫПОЛНЕНИЯ ГИБА.
//
// Проверка запускается по завершении анимации гиба (animation.js →
// simAnimOnDone) и оценивает ДВА положения пуансона:
//   • КОНЕЦ ХОДА — пуансон прижат к внутренней поверхности дуги гиба
//     (activeBendArcInnerY), как в последнем кадре анимации гибки;
//   • ПОКОЙ — пуансон поднят над листом (T/2 + SIM_PUNCH_LIFT), как
//     на экране после выполнения гиба.
//
// Геометрия касания: средняя линия профиля (полоса металла рисуется
// вокруг неё) × контур пуансона в мировых координатах (то же
// преобразование, что в drawPressBrakeTooling). Касание = пресечение
// отрезка средней линии с ребром пуансона ИЛИ вершина средней линии
// строго внутри контура пуансона.
//
// Почему НЕ срабатывает легитимное касание носиком: вершина пуансона
// останавливается на ВНУТРЕННЕЙ поверхности дуги — на T/2 ОТ средней
// линии, поэтому правильный гиб (радиус из таблицы металла, носик
// пуансона ≤ внутреннего радиуса) пересечений не даёт. Пересечение
// появляется при реальном вмешательстве: полка предыдущего гиба
// упирается в корпус, острый гиб на широком пуансоне, пуансон сдвинут
// вручную, нос шире V-складки и т.п.
// ═══════════════════════════════════════════════════════════════

// ==================== ГЕОМЕТРИЯ ====================

// Пересечение отрезков p1-p2 × p3-p4 (точка или null).
// Включает касание концами и коллинеарное перекрытие.
function _segSegIntersect(p1, p2, p3, p4) {
  const d1x = p2.x - p1.x, d1y = p2.y - p1.y;
  const d2x = p4.x - p3.x, d2y = p4.y - p3.y;
  const ex = p3.x - p1.x, ey = p3.y - p1.y;
  const denom = d1x * d2y - d1y * d2x;
  const EPS = 1e-9;
  if (Math.abs(denom) > 1e-12) {
    const t = (ex * d2y - ey * d2x) / denom;
    const u = (ex * d1y - ey * d1x) / denom;
    if (t >= -EPS && t <= 1 + EPS && u >= -EPS && u <= 1 + EPS) {
      return { x: p1.x + t * d1x, y: p1.y + t * d1y };
    }
    return null;
  }
  // Параллельные отрезки: коллинеарны и перекрываются?
  const cross0 = ex * d1y - ey * d1x;
  const e2x = p4.x - p1.x, e2y = p4.y - p1.y;
  const cross1 = e2x * d1y - e2y * d1x;
  if (Math.abs(cross0) > 1e-9 || Math.abs(cross1) > 1e-9) return null;
  const L1 = Math.hypot(d1x, d1y);
  if (L1 < 1e-9) {
    return (Math.hypot(p1.x - p3.x, p1.y - p3.y) < 1e-6) ? { x: p1.x, y: p1.y } : null;
  }
  const t3 = (ex * d1x + ey * d1y) / (L1 * L1);
  const t4 = (e2x * d1x + e2y * d1y) / (L1 * L1);
  const lo = Math.min(t3, t4), hi = Math.max(t3, t4);
  if (hi < -EPS || lo > 1 + EPS) return null;
  const tc = Math.max(0, Math.min(1, (lo + hi) / 2));
  return { x: p1.x + tc * d1x, y: p1.y + tc * d1y };
}

// Строго ли точка внутри простого многоугольника (луч-кастинг).
function _pointInPoly(pt, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x, yi = poly[i].y;
    const xj = poly[j].x, yj = poly[j].y;
    if (((yi > pt.y) !== (yj > pt.y)) &&
        (pt.x < (xj - xi) * (pt.y - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  return inside;
}

// Контур пуансона в мировых координатах при заданном Y вершины.
// Преобразование — ровно как в drawPressBrakeTooling: ось гиба через
// вершину профиля (tipX), низ профиля на уровне tipY + punchOffsetY.
function _punchPolysWorld(tipY) {
  const punch = (typeof getPunchByIndex === 'function') ? getPunchByIndex(S.metal.punchIndex) : null;
  if (!punch) return null;
  const pOX = S.punchOffsetX || 0;
  const pOY = S.punchOffsetY || 0;
  if (punch.profile && punch.profile.chains && punch.profile.chains.length) {
    const offX = -punchProfileAxisX(punch.profile) + pOX;
    const offY = -(punch.profile.minY || 0) + pOY + tipY;
    const polys = [];
    punch.profile.chains.forEach(chain => {
      if (!chain || chain.length < 2) return;
      polys.push(chain.map(p => ({ x: p.x + offX, y: p.y + offY })));
    });
    return polys.length ? polys : null;
  }
  // Упрощённая геометрия (как рисуется fallback): носик дугой радиуса R
  // куполом вверх от (±R,0), заплечики ±S/2, корпус высотой H.
  const r = punch.radius || 1;
  const halfS = (punch.swidth || 20) / 2;
  const H = punch.height || 50;
  const pts = [];
  const N = 8;
  for (let i = 0; i <= N; i++) {
    const a = Math.PI - Math.PI * i / N;
    pts.push({ x: Math.cos(a) * r, y: Math.sin(a) * r });
  }
  pts.push({ x: halfS, y: H });
  pts.push({ x: -halfS, y: H });
  return [pts.map(p => ({ x: p.x + pOX, y: p.y + pOY + tipY }))];
}

// Точки касания: пересечения рёбер пуансона со средней линией профиля
// + вершины средней линии строго внутри контура пуансона.
function _sheetContactsPunch(pts, polys) {
  const contacts = [];
  const n = pts.length;
  for (let pi = 0; pi < polys.length; pi++) {
    const poly = polys[pi];
    const m = poly.length;
    for (let i = 0; i < m; i++) {
      const a = poly[i], b = poly[(i + 1) % m];
      for (let k = 0; k < n - 1; k++) {
        const ip = _segSegIntersect(a, b, pts[k], pts[k + 1]);
        if (ip) contacts.push(ip);
      }
    }
    for (let k = 0; k < n; k++) {
      if (_pointInPoly(pts[k], poly)) contacts.push({ x: pts[k].x, y: pts[k].y });
    }
  }
  return contacts;
}

// Убрать дубли рядом стоящих точек (порог 0.75 мм), не больше 12 штук
function _dedupeContacts(list) {
  const out = [];
  list.forEach(p => {
    if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) return;
    if (!out.some(q => Math.hypot(q.x - p.x, q.y - p.y) < 0.75)) out.push(p);
  });
  return out.slice(0, 12);
}

// Снимок состояния: изменились гибы/инструмент/положения/металл —
// предупреждение больше не актуально и снимается с холста.
function _punchContactSnap() {
  return [
    (S.simBentMarkers || []).join(','),
    S.metal.punchIndex,
    (S.punchOffsetX || 0).toFixed(3), (S.punchOffsetY || 0).toFixed(3),
    S.metal.dieIndex,
    S.metal.thickness, S.metal.bendRadius, S.metal.kFactor, S.metal.metalTypeIndex,
    S.simFlipX ? 1 : 0, S.simFlipY ? 1 : 0
  ].join('|');
}

// ==================== ПРОВЕРКА ПОСЛЕ ГИБА ====================

/**
 * Предупреждение: контур профиля касается контура пуансона.
 * Вызывается по завершении гиба (bend добавлен в simBentMarkers).
 * Результат хранится в S.punchContactWarning и рисуется на холсте
 * (drawPunchContactWarning), пока состояние не изменится.
 */
function checkPunchProfileContact(bendIdx) {
  if (!S.unfoldResult || !S.unfoldResult.bendInfos) return;
  if (!S.points || S.points.length < 2) return;
  const punch = (typeof getPunchByIndex === 'function') ? getPunchByIndex(S.metal.punchIndex) : null;
  if (!punch) return;
  const T = S.metal.thickness || 1;

  // Профиль ПОСЛЕ выполнения гиба — как отображается на экране
  // (позиционирован по только что согнутому гибу).
  const savedSel = S.selectedBendIndex;
  S.selectedBendIndex = bendIdx;
  const prof = computeAccumulatedProfile({ bendIdx: bendIdx, progress: 1, animating: false });
  S.selectedBendIndex = savedSel;
  if (!prof || !prof.pts || prof.pts.length < 2) return;
  const pts = prof.pts;

  // Y вершины пуансона: конец хода (прижат к дуге гиба) и покой (поднят).
  // Совпадает с punchTipWorldY при progress=1 и в покое соответственно.
  let pressedTipY = -T / 2;
  if (typeof activeBendArcInnerY === 'function') {
    const iy = activeBendArcInnerY(bendIdx, 1);
    if (iy !== null && Number.isFinite(iy)) pressedTipY = iy;
  }
  const restTipY = T / 2 + SIM_PUNCH_LIFT;

  const pressedPolys = _punchPolysWorld(pressedTipY);
  const restPolys = _punchPolysWorld(restTipY);
  const strokeContacts = pressedPolys ? _dedupeContacts(_sheetContactsPunch(pts, pressedPolys)) : [];
  const restContacts = restPolys ? _dedupeContacts(_sheetContactsPunch(pts, restPolys)) : [];
  const atStroke = strokeContacts.length > 0;
  const atRest = restContacts.length > 0;

  S.punchContactWarning = (atStroke || atRest)
    ? { bendIdx: bendIdx, atStroke: atStroke, atRest: atRest,
        strokeContacts: strokeContacts, restContacts: restContacts,
        snap: _punchContactSnap() }
    : null;

  if (S.punchContactWarning && typeof toast === 'function') {
    const parts = [];
    if (atStroke) parts.push(t('punchTouchAtStroke'));
    if (atRest) parts.push(t('punchTouchAtRest'));
    toast('⚠ ' + t('punchTouchTitle') + ' — ' + parts.join(', ') + '. ' + t('punchTouchHint'),
      'warning', 7000);
  }
}
window.checkPunchProfileContact = checkPunchProfileContact;

// ==================== ОТРИСОВКА ПРЕДУПРЕЖДЕНИЯ ====================

// Маркеры-кружки «⚠» в точках касания + плашка под статусной строкой
// симуляции. Сплошные кружки — касание при поднятом пуансоне (что на
// экране), пунктирные — в конце хода пуансона (во время гибки).
function drawPunchContactWarning(isDark) {
  const w = S.punchContactWarning;
  if (!w) return;
  // Актуальность: состояние изменилось (разгиб, сдвиг инструмента,
  // смена пуансона/параметров) — тихо снимаем предупреждение.
  if (_punchContactSnap() !== w.snap) { S.punchContactWarning = null; return; }
  // Переходное состояние анимации — не показываем.
  const animInfo = (typeof getAnimInfo === 'function') ? getAnimInfo() : null;
  if (animInfo && animInfo.animating) return;

  const ctx = drawCtx;
  ctx.save();

  const drawCircles = function (list, dashed) {
    list.forEach(p => {
      const c = w2c(p.x, p.y);
      if (dashed) ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.arc(c.cx, c.cy, 7, 0, Math.PI * 2);
      ctx.strokeStyle = isDark ? '#f87171' : '#dc2626';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = isDark ? '#f87171' : '#dc2626';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText('⚠', c.cx, c.cy - 8);
    });
  };
  if (w.atStroke) drawCircles(w.strokeContacts, true);
  if (w.atRest) drawCircles(w.restContacts, false);

  // Плашка (под статусной строкой симуляции: строки на 10 и 26 px)
  const parts = [];
  if (w.atStroke) parts.push(t('punchTouchAtStroke'));
  if (w.atRest) parts.push(t('punchTouchAtRest'));
  const line1 = '⚠ ' + t('punchTouchTitle');
  const line2 = parts.join(', ');
  ctx.font = 'bold 11px sans-serif';
  const w1 = ctx.measureText(line1).width;
  ctx.font = '10px sans-serif';
  const w2 = ctx.measureText(line2).width;
  const wMax = Math.max(w1, w2);
  const x0 = 10, y0 = 42;
  ctx.fillStyle = isDark ? 'rgba(66,32,6,0.92)' : 'rgba(255,247,237,0.96)';
  ctx.strokeStyle = isDark ? '#f59e0b' : '#d97706';
  ctx.lineWidth = 1;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x0, y0, wMax + 16, 36, 6);
  else ctx.rect(x0, y0, wMax + 16, 36);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = isDark ? '#fbbf24' : '#b45309';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(line1, x0 + 8, y0 + 5);
  ctx.fillStyle = isDark ? '#fcd34d' : '#92400e';
  ctx.font = '10px sans-serif';
  ctx.fillText(line2, x0 + 8, y0 + 21);

  ctx.restore();
}
window.drawPunchContactWarning = drawPunchContactWarning;
