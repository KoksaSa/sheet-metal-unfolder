// ═══════════════════════════════════════════════════════════════
// UI / ARC-DIALOG (v5.9) — РАДИУСНЫЕ ГИБЫ
// Пользователь рисует дугу заданного радиуса (инструмент «Дуга»,
// клавиша A): клик — старт (привязка к концу цепи или свободная
// точка), второй клик — конец дуги, затем диалог параметров.
//
// Дуга делится на N сегментов (N задаёт пользователь); точки дуги
// вставляются в профиль как обычные вершины с меткой _radiusArc.
// Угол между соседними сегментами (= охват/N) считается
// АВТОМАТИЧЕСКИ движком развёртки по углам сегментов — после
// выполнения всех гибов-сегментов получается нужный радиус.
//
// Рендер: соседние точки с одинаковой меткой _radiusArc рисуются
// ГЛАДКОЙ дугой (canvas/draw.js — pathProfile); в симуляции каждый
// стык сегментов — обычный гиб со своим припуском (bend allowance).
// ═══════════════════════════════════════════════════════════════

// Геометрия черновика дуги: центр, охват, N+1 точек на окружности
// (включая старт), метаданные для вставки. side — куда ВЫГНУТА дуга
// относительно направления старт→конец ('left' | 'right').
function arcDraftGeometry(draft) {
  if (!draft || !draft.startPt || !draft.endPt) return null;
  const A = draft.startPt, B = draft.endPt;
  const dx = B.x - A.x, dy = B.y - A.y;
  const L = Math.hypot(dx, dy);
  if (L < 1e-6) return null;
  const R = Number(draft.radius);
  if (!Number.isFinite(R) || R < L / 2) return { tooSmallRadius: true, L: L };
  const sweep = 2 * Math.asin(Math.min(1, L / (2 * R))); // охват дуги (0..π]
  const N = Math.max(2, Math.min(60, Math.round(draft.segCount || 6)));
  const half = L / 2;
  const h = Math.sqrt(Math.max(0, R * R - half * half)); // центр от хорды
  const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2;
  // Перпендикуляр СЛЕВА от направления A→B (мир Y вверх)
  const px = -dy / L, py = dx / L;
  // Дуга выгнута влево ⇒ центр СПРАВА от хорды (малая дуга — дальше от центра)
  const sgn = (draft.side === 'left') ? -1 : 1;
  const cx = mx + px * h * sgn, cy = my + py * h * sgn;
  const a0 = Math.atan2(A.y - cy, A.x - cx);
  const a1 = Math.atan2(B.y - cy, B.x - cx);
  let d = normAngle(a1 - a0);
  if (Math.abs(d) < 1e-9) d = sweep; // вырожденный случай
  const pts = [];
  for (let k = 0; k <= N; k++) {
    const a = a0 + d * k / N;
    pts.push({ x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R });
  }
  return {
    L: L, R: R, N: N, cx: cx, cy: cy, r: R,
    sweep: sweep, perSeg: sweep / N, d: d, pts: pts,
    meta: {
      id: 'arc' + Date.now() + Math.floor(Math.random() * 1e4),
      cx: cx, cy: cy, r: R, sweep: d, segCount: N
    }
  };
}

// ==================== ДИАЛОГ ПАРАМЕТРОВ ДУГИ ====================

function showArcDialog() {
  const d = S.arcDraft;
  if (!d || !d.endPt) return;
  const L = Math.hypot(d.endPt.x - d.startPt.x, d.endPt.y - d.startPt.y);
  // Радиус по умолчанию: охват ~90° (R = L/√2), кратно 5
  if (!Number.isFinite(d.radius)) d.radius = Math.max(5, Math.round(L / Math.SQRT2 / 5) * 5);
  if (!Number.isFinite(d.segCount)) d.segCount = 6;
  if (!d.side) d.side = 'left';

  let h = '<h3 class="text-sm font-semibold flex items-center gap-2 mb-2"><i data-lucide="spline" class="h-4 w-4 text-teal-600"></i>' + t('arcDialogTitle') + '</h3>';
  h += '<div class="text-[10px] font-mono text-gray-500 mb-2">' + t('arcChordLabel') + ': ' + L.toFixed(1) + ' mm</div>';
  h += '<div class="grid grid-cols-2 gap-2">';
  h += '<div><label class="text-xs font-medium">' + t('arcRadiusLabel') + '</label>' +
    '<input type="number" id="arc-radius" min="0.1" step="0.5" value="' + d.radius + '" oninput="onArcDialogInput()" class="w-full h-8 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 mt-1"></div>';
  h += '<div><label class="text-xs font-medium">' + t('arcSegmentsLabel') + '</label>' +
    '<input type="number" id="arc-segments" min="2" max="60" step="1" value="' + d.segCount + '" oninput="onArcDialogInput()" class="w-full h-8 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 mt-1"></div>';
  h += '</div>';
  // Сторона выпуклости (живой предпросмотр на холсте)
  h += '<div class="mt-2"><label class="text-xs font-medium">' + t('arcSideLabel') + '</label><div class="grid grid-cols-2 gap-2 mt-1">';
  h += '<button id="arc-side-left" onclick="setArcSide(\'left\')" class="h-8 text-xs rounded-md border transition-all">' + '\u2312 ' + t('arcSideLeft') + '</button>';
  h += '<button id="arc-side-right" onclick="setArcSide(\'right\')" class="h-8 text-xs rounded-md border transition-all">' + t('arcSideRight') + ' \u2312</button>';
  h += '</div></div>';
  // Живая статистика: охват, угол между сегментами
  h += '<div id="arc-info" class="mt-2 text-[11px] font-mono text-gray-600 dark:text-gray-300 min-h-[34px]"></div>';
  h += '<div class="flex justify-end gap-2 mt-3">';
  h += '<button onclick="cancelArcDraft()" class="text-xs h-8 px-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">' + t('cancel') + '</button>';
  h += '<button onclick="applyArcDraft()" class="text-xs h-8 px-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold">' + t('add') + '</button>';
  h += '</div>';
  showDialog(h);
  refreshIcons();
  updateArcSideButtons();
  updateArcInfo();
  setTimeout(function () { const el = document.getElementById('arc-radius'); if (el) el.focus(); }, 100);
}

// Ввод радиуса/сегментов — обновить черновик и предпросмотр на холсте
function onArcDialogInput() {
  const d = S.arcDraft;
  if (!d) return;
  const rEl = document.getElementById('arc-radius');
  const nEl = document.getElementById('arc-segments');
  const r = parseFloat(rEl && rEl.value);
  const n = parseInt(nEl && nEl.value, 10);
  if (Number.isFinite(r) && r > 0) d.radius = r;
  if (Number.isFinite(n) && n >= 2 && n <= 60) d.segCount = n;
  updateArcInfo();
  if (typeof drawDrawCanvas === 'function') drawDrawCanvas();
}

function setArcSide(side) {
  if (S.arcDraft) S.arcDraft.side = (side === 'right') ? 'right' : 'left';
  updateArcSideButtons();
  updateArcInfo();
  if (typeof drawDrawCanvas === 'function') drawDrawCanvas();
}

function updateArcSideButtons() {
  const d = S.arcDraft;
  if (!d) return;
  const onCls = 'bg-teal-600 text-white border-teal-600 hover:bg-teal-700';
  const offCls = 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-teal-950/30';
  const bl = document.getElementById('arc-side-left');
  const br = document.getElementById('arc-side-right');
  if (bl) bl.className = 'h-8 text-xs rounded-md border transition-all ' + (d.side === 'left' ? onCls : offCls);
  if (br) br.className = 'h-8 text-xs rounded-md border transition-all ' + (d.side === 'right' ? onCls : offCls);
}

function updateArcInfo() {
  const el = document.getElementById('arc-info');
  if (!el || !S.arcDraft) return;
  const geo = arcDraftGeometry(S.arcDraft);
  if (!geo || geo.tooSmallRadius) {
    el.innerHTML = '<span class="text-red-600">' + t('arcTooSmallRadius') + ' \u2265 ' +
      (Math.hypot(S.arcDraft.endPt.x - S.arcDraft.startPt.x, S.arcDraft.endPt.y - S.arcDraft.startPt.y) / 2).toFixed(1) + ' mm</span>';
    return;
  }
  const sweepDeg = (geo.sweep * 180 / Math.PI).toFixed(1);
  const perDeg = (geo.perSeg * 180 / Math.PI).toFixed(2);
  const bad = geo.perSeg < 5 * Math.PI / 180;
  let html = t('arcSweepLabel') + ': <b>' + sweepDeg + '\u00b0</b> \u00b7 ' +
    t('arcPerSegLabel') + ': <b class="' + (bad ? 'text-red-600' : 'text-green-600') + '">' + perDeg + '\u00b0</b>';
  if (bad) {
    html += '<div class="text-red-600 text-[10px] mt-0.5">' + t('arcWarnSmallAngle') + '</div>';
  }
  el.innerHTML = html;
}

// ==================== ПРИМЕНЕНИЕ: ВСТАВКА ТОЧЕК ДУГИ ====================

function applyArcDraft() {
  const draft = S.arcDraft;
  if (!draft || !draft.startPt || !draft.endPt) return;
  const L = Math.hypot(draft.endPt.x - draft.startPt.x, draft.endPt.y - draft.startPt.y);
  const R = Number(draft.radius);
  if (!Number.isFinite(R) || R < L / 2 - 1e-9) {
    toast(t('arcTooSmallRadius') + ' \u2265 ' + (L / 2).toFixed(1) + ' mm', 'error');
    return;
  }
  // Авто-ограничение числа сегментов: угол между сегментами \u2265 5\u00b0,
  // иначе движок развёртки не распознает стык как гиб (порог 5\u00b0)
  const sweep = 2 * Math.asin(Math.min(1, L / (2 * R)));
  let N = Math.max(2, Math.min(60, Math.round(draft.segCount || 6)));
  const minAng = 5 * Math.PI / 180;
  if (sweep / N < minAng) {
    N = Math.max(2, Math.floor(sweep / minAng));
    draft.segCount = N;
    toast(t('arcSegClamped') + ' ' + N);
  }
  const geo = arcDraftGeometry(draft);
  if (!geo || geo.tooSmallRadius || !geo.pts || geo.pts.length < 3) {
    toast(t('arcErrGeom'), 'error');
    return;
  }

  // Вставка — ОДНО действие undo на всю дугу
  S.undoHistory = [...S.undoHistory, cloneState()];
  if (S.undoHistory.length > 50) S.undoHistory.shift();
  S.redoHistory = [];

  const meta = geo.meta;
  const arcPts = geo.pts.map(function (p) { return { x: p.x, y: p.y, _radiusArc: meta }; });
  // Направление роста цепочки: prepend — рисуем «назад» от первой точки
  const prepend = (draft.attachIdx === 0) ||
    (draft.attachIdx === null && S.drawFromIdx === 0 && S.points.length > 0);

  if (prepend) {
    // [конец, seg(N-1), ..., seg(1, старт-порядок обратный), первая точка]
    const add = arcPts.slice(1).reverse(); // без старта, от конца к 1-му
    if (draft.attachIdx === 0 && S.points.length > 0) {
      // Пометить существующую первую точку как принадлежащую дуге
      S.points = S.points.map(function (p, i) {
        return i === 0 ? { x: p.x, y: p.y, _radiusArc: meta } : p;
      });
      S.points = [...add, ...S.points];
    } else {
      // Старт — новая первая точка, дуга продолжает «назад»
      S.points = [...add, arcPts[0], ...S.points];
    }
    S.drawFromIdx = 0;
  } else {
    // [..., старт(существует|новая), seg(1), ..., seg(N)=конец]
    const add = arcPts.slice(1);
    const at = draft.attachIdx;
    if (at !== null && at === S.points.length - 1 && S.points.length > 0) {
      S.points = S.points.map(function (p, i) {
        return i === at ? { x: p.x, y: p.y, _radiusArc: meta } : p;
      });
      S.points = [...S.points, ...add];
    } else {
      S.points = [...S.points, arcPts[0], ...add];
    }
    S.drawFromIdx = null;
  }

  S.arcDraft = null;
  closeDialog();
  maybeAutoUnfold();
  renderAll();
  const perDeg = (geo.perSeg * 180 / Math.PI).toFixed(1);
  toast(t('arcApplied') + ' ' + geo.N + ' \u00d7 ' + perDeg + '\u00b0');
}

function cancelArcDraft() {
  S.arcDraft = null;
  closeDialog();
  if (typeof drawDrawCanvas === 'function') drawDrawCanvas();
}

// Экспорт в глобальную область (inline-обработчики диалога)
window.showArcDialog = showArcDialog;
window.onArcDialogInput = onArcDialogInput;
window.setArcSide = setArcSide;
window.applyArcDraft = applyArcDraft;
window.cancelArcDraft = cancelArcDraft;
