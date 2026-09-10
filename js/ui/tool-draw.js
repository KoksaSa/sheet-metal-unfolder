// ═══════════════════════════════════════════════════════════════
// UI / TOOL-DRAW (v5.7) — рисование СВОЕГО пуансона или матрицы на
// холсте, как рисуется профиль гибки: клики ЛКМ ставят точки контура,
// клик по первой точке / Enter / двойной клик — завершить, ПКМ или
// Backspace — убрать последнюю точку, Esc — отмена.
//
// После завершения контур нормализуется в профиль инструмента:
//   • ПУАНСОН — нижняя кромка (minY) → 0: вершина/нос опирается на
//     ось гиба; tipX = средний X нижней кромки (для несимметричных
//     пуансонов нос встаёт на ось). Рисуйте пуансон носом ВНИЗ.
//   • МАТРИЦА — координаты как нарисованы: отрисовка сама ставит
//     верхнюю грань (maxY) на уровень оси, центр V-ручья вычисляется
//     по зазору на верхней кромке (findDieGrooveCenter). Рисуйте
//     матрицу ручьём (V-канавкой) ВВЕРХ.
//
// Новый инструмент появляется на холсте в координатах (0,0) ДО его
// установки (см. switchToolIndex / onToolSelectChange) — потом его
// можно перетащить мышью или стрелками ←→↑↓. Установленное место
// запоминается по инструменту (v5.8) и восстанавливается при возврате.
// ═══════════════════════════════════════════════════════════════

// ==================== СМЕНА РЕЖИМА (с очисткой черновика) ====================
// Единая точка смены S.toolMode: при выходе из рисования инструмента
// черновик сбрасывается (иначе «зависшие» точки появлялись бы при
// возврате в режим). Используется плитками инструментов и клавишами.
function setToolMode(mode) {
  if (S.toolMode === 'tooldraw' && mode !== 'tooldraw') {
    S.toolDraw = null;
  }
  S.toolMode = mode;
  S.drawFromIdx = null;
  renderAll();
}
window.setToolMode = setToolMode;

// ==================== ВХОД В РЕЖИМ РИСОВАНИЯ ИНСТРУМЕНТА ====================
function startToolDraw(type) {
  if (type !== 'die' && type !== 'punch') type = 'punch';
  S.toolDraw = { type: type, points: [] };
  S.toolMode = 'tooldraw';
  S.drawFromIdx = null;
  renderAll();
}
window.startToolDraw = startToolDraw;

function cancelToolDraw() {
  if (S.toolMode !== 'tooldraw' || !S.toolDraw) return false;
  S.toolDraw = null;
  S.toolMode = 'draw';
  if (typeof toast === 'function') toast(t('toolDrawCancelled'));
  renderAll();
  return true;
}

// ==================== ТОЧКИ ЧЕРНОВИКА ====================
function addToolDrawPoint(p) {
  if (!S.toolDraw) return;
  S.toolDraw.points = [...S.toolDraw.points, { x: p.x, y: p.y }];
  if (typeof drawDrawCanvas === 'function') drawDrawCanvas();
}

function undoToolDrawPoint() {
  if (!S.toolDraw || !S.toolDraw.points.length) return;
  S.toolDraw.points = S.toolDraw.points.slice(0, -1);
  if (typeof drawDrawCanvas === 'function') drawDrawCanvas();
}

// Привязка точки черновика: сетка + угловая привязка ОТНОСИТЕЛЬНО
// последней точки ЧЕРНОВИКА (snapPoint считает от точек профиля —
// для инструмента это неправильный якорь).
function snapToolDrawPoint(w) {
  if (!S.snapToGrid) return { x: w.x, y: w.y };
  const gs = S.gridSize;
  const pts = (S.toolDraw && S.toolDraw.points) || [];
  if (S.angleSnap === 'none' || !pts.length) {
    return { x: Math.round(w.x / gs) * gs, y: Math.round(w.y / gs) * gs };
  }
  const last = pts[pts.length - 1];
  const dx = w.x - last.x, dy = w.y - last.y;
  const rawA = Math.atan2(dy, dx);
  const snapRad = Number(S.angleSnap) * Math.PI / 180;
  const snappedA = Math.round(rawA / snapRad) * snapRad;
  const d = Math.max(gs, Math.round(Math.sqrt(dx * dx + dy * dy) / gs) * gs);
  return {
    x: Math.round((last.x + Math.cos(snappedA) * d) / gs) * gs,
    y: Math.round((last.y + Math.sin(snappedA) * d) / gs) * gs
  };
}

// ==================== ЗАВЕРШЕНИЕ: НОРМАЛИЗАЦИЯ ПРОФИЛЯ ====================
function _toolBBox(pts) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  pts.forEach(p => {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  });
  return { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY };
}

// Пуансон: нижняя кромка → y=0; tipX — средний X нижней кромки.
// (Клин: нижняя точка одна — нос; плоский: нижнее ребро — середина.)
function normalizeDrawnPunchProfile(pts) {
  const bb = _toolBBox(pts);
  const shifted = pts.map(p => ({ x: p.x, y: p.y - bb.minY }));
  const EPS = 1e-6;
  const tipPts = shifted.filter(p => Math.abs(p.y) < EPS);
  const tipX = tipPts.length
    ? tipPts.reduce((s, p) => s + p.x, 0) / tipPts.length
    : (bb.minX + bb.maxX) / 2;
  return {
    chains: [shifted],
    minX: bb.minX, maxX: bb.maxX, minY: 0, maxY: bb.maxY - bb.minY,
    width: bb.width, height: bb.height,
    tipX: tipX
  };
}

// Матрица: как нарисовано (отрисовка ставит maxY на ось, V-ручей —
// по зазору верхней кромки, см. tooling-2d.js drawToolsOnCanvas).
function normalizeDrawnDieProfile(pts) {
  const bb = _toolBBox(pts);
  return {
    chains: [pts.map(p => ({ x: p.x, y: p.y }))],
    minX: bb.minX, maxX: bb.maxX, minY: bb.minY, maxY: bb.maxY,
    width: bb.width, height: bb.height
  };
}

// Завершить рисование: контур ≥3 точек → нормализация → диалог
// сохранения (превью + параметры). Профиль профиля детали не трогаем.
function finishToolDraw() {
  if (S.toolMode !== 'tooldraw' || !S.toolDraw) return;
  const pts = S.toolDraw.points.slice();
  if (pts.length < 3) {
    if (typeof toast === 'function') toast(t('toolDrawNeedPoints'), 'error');
    return;
  }
  // Замыкание кликом по первой точке могло добавить дубль — убираем
  const d0 = Math.hypot(pts[0].x - pts[pts.length - 1].x, pts[0].y - pts[pts.length - 1].y);
  if (d0 < 1e-6) pts.pop();
  if (pts.length < 3) {
    if (typeof toast === 'function') toast(t('toolDrawNeedPoints'), 'error');
    return;
  }
  const type = S.toolDraw.type;
  const profile = (type === 'die') ? normalizeDrawnDieProfile(pts) : normalizeDrawnPunchProfile(pts);
  S.toolDraw = null;
  S.toolMode = 'select';
  S.drawFromIdx = null;
  // Диалог сохранения (общий с DXF-импортом): превью нарисованного
  // контура + автозаполнение параметров по габаритам
  if (typeof showToolImportDialog === 'function') {
    showToolImportDialog(type, profile);
  }
  // v5.8: полный ре-рендер — кнопка «Нарисать пуансон/матрицу» снимает
  // подсветку сразу по завершении рисования (не только после диалога)
  if (typeof renderAll === 'function') renderAll();
  else if (typeof drawDrawCanvas === 'function') drawDrawCanvas();
}

// ==================== ПОЗИЦИИ ПО ИНСТРУМЕНТАМ (v5.8) ====================
// v5.8: место установки ЗАПОМИНАЕТСЯ ПО ИНСТРУМЕНТУ. Каждый пуансон/
// матрица хранит своё смещение в карте S.punchPositions/S.diePositions
// ({ id инструмента: {x, y} }). При переключении на другой инструмент и
// ВОЗВРАТЕ обратно позиция ВОССТАНАВЛИВАЕТСЯ; инструмент, который ещё
// никогда не ставился (нет записи), появляется в (0,0) — как в v5.7.
// Ключ карты — уникальный id (есть и у встроенных, и у нарисованных/
// DXF): индексы непригодны — удаление своего инструмента сдвигает список.

// Ключ инструмента в карте позиций
function _toolPosKey(kind, idx) {
  let tool = null;
  try {
    tool = (kind === 'die') ? getDieByIndex(idx) : getPunchByIndex(idx);
  } catch (e) { tool = null; }
  return (tool && tool.id) ? String(tool.id) : (kind + ':' + idx);
}

// Запомнить ТЕКУЩЕЕ смещение инструмента kind (индекс idx) в карте
function _syncToolPosToMap(kind, idx) {
  try {
    const key = _toolPosKey(kind, idx);
    const map = (kind === 'die') ? S.diePositions : S.punchPositions;
    if (!map) return;
    map[key] = {
      x: (kind === 'die') ? (S.dieOffsetX || 0) : (S.punchOffsetX || 0),
      y: (kind === 'die') ? (S.dieOffsetY || 0) : (S.punchOffsetY || 0)
    };
  } catch (e) { /* карта не критична для отрисовки */ }
}

// Применить сохранённое положение инструмента kind (индекс idx):
// есть запись — восстановить, нет (инструмент новый) — (0,0)
function _applyToolPosFromMap(kind, idx) {
  const key = _toolPosKey(kind, idx);
  const map = (kind === 'die') ? S.diePositions : S.punchPositions;
  const pos = (map && key) ? map[key] : null;
  if (kind === 'die') {
    S.dieOffsetX = pos ? (pos.x || 0) : 0;
    S.dieOffsetY = pos ? (pos.y || 0) : 0;
  } else {
    S.punchOffsetX = pos ? (pos.x || 0) : 0;
    S.punchOffsetY = pos ? (pos.y || 0) : 0;
  }
}

// Публичное API: запомнить позиции ТЕКУЩИХ пуансона и матрицы.
// Вызывается перед любой сменой punchIndex/dieIndex (undo/redo металла,
// импорт проекта) и при автосейве — позиции всегда актуальны в карте.
function syncToolPositionsToMap() {
  _syncToolPosToMap('punch', S.metal.punchIndex);
  _syncToolPosToMap('die', S.metal.dieIndex);
}
window.syncToolPositionsToMap = syncToolPositionsToMap;

// Публичное API: применить сохранённые позиции ТЕКУЩИХ инструментов
// (после смены индексов извне: undo/redo металла, импорт проекта)
function applyToolPositionsFromMap() {
  _applyToolPosFromMap('punch', S.metal.punchIndex);
  _applyToolPosFromMap('die', S.metal.dieIndex);
}
window.applyToolPositionsFromMap = applyToolPositionsFromMap;

// Единая точка смены индекса инструмента: прежний инструмент ЗАПОМИНАЕТ
// своё место, выбранный ВОССТАНАВЛИВАЕТ своё (новый — появляется в (0,0)).
// Используется селектами (onToolSelectChange) и добавлением своих
// инструментов (applyCustomTool: нарисованные и DXF).
// prevIdx: индекс ПРЕЖНЕГО инструмента — обязателен, когда индекс в
// S.metal УЖЕ сменён извне (onToolSelectChange вызывает setMetalWithUndo
// до переключения — для корректного снимка истории undo); без аргумента
// берётся текущий (applyCustomTool меняет индекс только здесь).
function switchToolIndex(kind, newIdx, prevIdx) {
  if (prevIdx === undefined || prevIdx === null || isNaN(prevIdx)) {
    prevIdx = (kind === 'die') ? S.metal.dieIndex : S.metal.punchIndex;
  }
  _syncToolPosToMap(kind, prevIdx);
  if (kind === 'die') S.metal.dieIndex = newIdx;
  else S.metal.punchIndex = newIdx;
  _applyToolPosFromMap(kind, newIdx);
  if (typeof saveToolPositions === 'function') saveToolPositions();
}
window.switchToolIndex = switchToolIndex;

// ==================== СМЕЩЕНИЯ: НОВЫЙ ИНСТРУМЕНТ → (0,0) ====================
// v5.7: при появлении на холсте НОВОГО инструмента (нарисованного,
// импортированного) до его установки он появляется в (0,0).
// v5.8: сброс — только для НОВЫХ инструментов; установленный инструмент
// запоминает своё место (switchToolIndex выше), при возврате к нему
// позиция восстанавливается.
function resetToolOffsets(kind) {
  if (kind === 'die') {
    S.dieOffsetX = 0;
    S.dieOffsetY = 0;
  } else {
    S.punchOffsetX = 0;
    S.punchOffsetY = 0;
  }
  if (typeof saveToolPositions === 'function') saveToolPositions();
}
window.resetToolOffsets = resetToolOffsets;

// Обработчик смены инструмента в селекте (params.js). v5.8: позиция
// запоминается ПО ИНСТРУМЕНТУ — прежний сохраняет своё место, выбранный
// восстанавливает СВОЁ (никогда не ставившийся — встаёт в (0,0)).
// ВАЖНО: setMetalWithUndo ДО switchToolIndex — снимок истории undo
// должен зафиксировать ПРЕЖНИЙ индекс (иначе смена инструмента
// перестанет отменяться).
function onToolSelectChange(kind, value) {
  if (isNaN(value)) return;
  const prevIdx = (kind === 'die') ? S.metal.dieIndex : S.metal.punchIndex;
  setMetalWithUndo(kind === 'die' ? { dieIndex: value } : { punchIndex: value });
  // prevIdx передаётся ЯВНО: setMetalWithUndo уже присвоил новый индекс,
  // а позиции должны уйти ПРЕЖНЕМУ инструменту
  if (value !== prevIdx) switchToolIndex(kind, value, prevIdx);
  // Выбор инструмента сохраняем сразу (не ждём 2-секундный автосейв) —
  // иначе быстрая перезагрузка откатит селект к прежнему инструменту
  try {
    if (S.points.length > 0) localStorage.setItem('sheet-metal-project', JSON.stringify({ points: S.points, metal: S.metal, hems: S.hems }));
  } catch (e) { /* ошибка сохранения не критична */ }
  doUnfold();
  renderAll();
}
window.onToolSelectChange = onToolSelectChange;

// ==================== ОТРИСОВКА ЧЕРНОВИКА НА ХОЛСТЕ ====================
// Рисуется поверх всего: линия контура в цвете инструмента, точки,
// резинка к курсору (с привязкой), подсветка замыкания у первой
// точки, живые габариты и подсказка. Также маркер (0,0) — куда
// встанет новый инструмент после сохранения.
function drawToolDraft(isDark) {
  const td = S.toolDraw;
  if (!td) return;
  const pts = td.points || [];
  const isPunch = td.type === 'punch';
  const col = isPunch ? (isDark ? '#f87171' : '#dc2626') : (isDark ? '#60a5fa' : '#2563eb');
  const ctx = drawCtx;

  // Живые габариты черновика
  let bb = null;
  if (pts.length >= 2) bb = _toolBBox(pts);

  ctx.save();

  // Полупрозрачная заливка контура (если есть хотя бы 3 точки)
  if (pts.length >= 3) {
    ctx.beginPath();
    const f = w2c(pts[0].x, pts[0].y);
    ctx.moveTo(f.cx, f.cy);
    for (let i = 1; i < pts.length; i++) {
      const p = w2c(pts[i].x, pts[i].y);
      ctx.lineTo(p.cx, p.cy);
    }
    ctx.closePath();
    ctx.fillStyle = isPunch ? 'rgba(239,68,68,0.10)' : 'rgba(59,130,246,0.10)';
    ctx.fill();
  }

  // Контур
  if (pts.length >= 2) {
    ctx.strokeStyle = col;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    const f = w2c(pts[0].x, pts[0].y);
    ctx.moveTo(f.cx, f.cy);
    for (let i = 1; i < pts.length; i++) {
      const p = w2c(pts[i].x, pts[i].y);
      ctx.lineTo(p.cx, p.cy);
    }
    ctx.stroke();
  }

  // Резинка к курсору (с привязкой сетки/угла от последней точки)
  if (pts.length > 0 && S.mouseWorld) {
    const lp = pts[pts.length - 1];
    const from = w2c(lp.x, lp.y);
    const tw = snapToolDrawPoint(S.mouseWorld);
    const to = w2c(tw.x, tw.y);
    ctx.strokeStyle = col;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(from.cx, from.cy);
    ctx.lineTo(to.cx, to.cy);
    ctx.stroke();
    ctx.setLineDash([]);
    // Длина текущего сегмента
    const len = Math.hypot(tw.x - lp.x, tw.y - lp.y);
    ctx.fillStyle = col;
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(len.toFixed(1) + ' mm', (from.cx + to.cx) / 2, (from.cy + to.cy) / 2 - 6);
  }

  // Точки черновика
  pts.forEach((p, i) => {
    const c = w2c(p.x, p.y);
    const isFirst = i === 0;
    ctx.beginPath();
    ctx.arc(c.cx, c.cy, isFirst ? 7 : 5, 0, Math.PI * 2);
    ctx.fillStyle = isFirst ? '#22c55e' : col;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(c.cx, c.cy, isFirst ? 3 : 2.2, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? '#0a0a0a' : '#fff';
    ctx.fill();
  });

  // Подсветка замыкания: курсор рядом с первой точкой (≥3 точек)
  if (pts.length >= 3 && S.mouseWorld) {
    const f = w2c(pts[0].x, pts[0].y);
    const m = w2c(S.mouseWorld.x, S.mouseWorld.y);
    const dd = Math.hypot(f.cx - m.cx, f.cy - m.cy);
    if (dd < 18) {
      const alpha = 0.55 + 0.3 * Math.sin(Date.now() / 200);
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(f.cx, f.cy, 13, 0, Math.PI * 2);
      ctx.stroke();
      // Пунктир от последней точки к первой — будущая замыкающая
      ctx.globalAlpha = 0.8;
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      const l = w2c(pts[pts.length - 1].x, pts[pts.length - 1].y);
      ctx.moveTo(l.cx, l.cy);
      ctx.lineTo(f.cx, f.cy);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
    }
  }

  // Маркер (0,0): куда встанет инструмент после сохранения
  const o = w2c(0, 0);
  ctx.strokeStyle = isDark ? '#fbbf24' : '#d97706';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.arc(o.cx, o.cy, 9, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.font = 'bold 9px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  ctx.fillStyle = isDark ? '#fbbf24' : '#d97706';
  ctx.fillText('(0,0)', o.cx + 12, o.cy - 6);

  // Плашка-подсказка (верхний левый угол) + габариты
  const hint = t(isPunch ? 'toolDrawHintPunch' : 'toolDrawHintDie');
  const title = t(isPunch ? 'toolDrawTitlePunch' : 'toolDrawTitleDie');
  const dims = bb ? '  ·  ' + t('widthShort') + ' ' + bb.width.toFixed(1) + ' × ' + t('heightShort') + ' ' + bb.height.toFixed(1) + ' ' + t('mm') : '';
  ctx.font = 'bold 11px sans-serif';
  const line1 = title + dims;
  ctx.font = '9.5px sans-serif';
  const wMax = Math.max(ctx.measureText(hint).width, (function () { ctx.font = 'bold 11px sans-serif'; return ctx.measureText(line1).width; })());
  const x0 = 10, y0 = 10;
  ctx.fillStyle = isDark ? 'rgba(26,26,46,0.88)' : 'rgba(255,255,255,0.92)';
  ctx.strokeStyle = col;
  ctx.lineWidth = 1;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x0, y0, wMax + 16, 46, 6);
  else ctx.rect(x0, y0, wMax + 16, 46);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = col;
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(line1, x0 + 8, y0 + 6);
  ctx.fillStyle = isDark ? '#d1d5db' : '#4b5563';
  ctx.font = '9.5px sans-serif';
  ctx.fillText(hint, x0 + 8, y0 + 25);

  ctx.restore();
}
window.drawToolDraft = drawToolDraft;
