// ═══════════════════════════════════════════════════════════════
// UI / ИМПОРТ ПРОФИЛЯ ДЕТАЛИ ИЗ DXF — загружает контур из линий/
// полилиний на канвас как альтернативу рисованию мышкой и пресетам.
// НЕ путать с dxf-tool-import.js (импорт ИНСТРУМЕНТОВ — матриц и
// пуансонов): здесь переиспользуется его парсер parseDXFEntities.
// ═══════════════════════════════════════════════════════════════

// Допуски и пороги (мм / градусы)
const DXF_PROFILE_TOL = 0.01;          // допуск слияния концов/точек, мм
const DXF_PROFILE_MIN_LEN = 1;         // минимальная суммарная длина профиля, мм
const DXF_PROFILE_COLLINEAR_DEG = 0.5; // порог «прямой» вершины (коллинеарность)

// ==================== ВЫБОР ФАЙЛА ====================

// Открыть системный диалог выбора .dxf (клик по скрытому инпуту
// #file-dxf-profile из index.html)
function triggerProfileDXFImport() {
  const input = document.getElementById('file-dxf-profile');
  if (!input) return;
  input.value = '';
  input.click();
}

// Обработчик onchange скрытого инпута
function importProfileDXF(event) {
  const target = event && event.target;
  const file = target && target.files && target.files[0];
  if (target) target.value = ''; // сброс: тот же файл можно выбрать повторно
  if (!file) return;
  if (file.size > 10 * 1024 * 1024) { // > 10 МБ
    toast(t('dxfProfileBadFile'), 'error');
    return;
  }
  const reader = new FileReader();
  reader.onload = () => importProfileDXFText(String(reader.result || ''));
  reader.onerror = () => toast(t('dxfProfileBadFile'), 'error');
  reader.readAsText(file);
}

// ==================== ОСНОВНАЯ ЛОГИКА ====================
// Отделена от чтения файла для тестируемости (см. e2e-прогоны).
// @param {string} text — содержимое DXF-файла
// @returns {boolean} true, если профиль загружен в проект
function importProfileDXFText(text) {
  try {
    const src = String(text || '');
    if (!src.trim()) { toast(t('dxfProfileBadFile'), 'error'); return false; }

    // 1) Единицы из заголовка $INSUNITS (parseDXFEntities заголовок не
    //    парсит — ищем пару «9/$INSUNITS» → «70/значение» сами).
    let mult = 1; // 0 / не найдено / прочие → считаем мм
    const insUnits = dxfProfileDetectUnits(src);
    if (insUnits === 1) { mult = 25.4; toast(t('dxfProfileUnitsIn'), 'info'); }
    else if (insUnits === 2) mult = 304.8;   // футы
    else if (insUnits === 4) mult = 1;       // мм
    else if (insUnits === 5) mult = 10;      // см
    else if (insUnits === 6) mult = 1000;    // м

    // 2) Примитивы (LINE / LWPOLYLINE / POLYLINE; дуги игнорируем —
    //    профиль должен быть из линий)
    const entities = parseDXFEntities(src);
    const arcCount = entities.reduce((n, e) => n + (e && e.type === 'ARC' ? 1 : 0), 0);
    if (arcCount > 0) toast(t('dxfProfileArcsSkipped'), 'info');

    // 3) Цепочки точек: POLYLINE-примитивы уже цепочки; LINE сшиваем в цепочки
    const chains = [];
    entities.forEach(e => {
      if (e && e.type === 'POLYLINE' && Array.isArray(e.points) && e.points.length >= 2) {
        chains.push(e.points.map(p => ({ x: (p.x || 0) * mult, y: (p.y || 0) * mult })));
      }
    });
    dxfProfileChainsFromLines(entities.filter(e => e && e.type === 'LINE').map(e => ({
      x1: (e.x1 || 0) * mult, y1: (e.y1 || 0) * mult,
      x2: (e.x2 || 0) * mult, y2: (e.y2 || 0) * mult
    }))).forEach(c => chains.push(c));

    if (chains.length === 0) { toast(t('dxfProfileNoLines'), 'error'); return false; }

    // 4) Несколько контуров → импортируем самый длинный
    const chainLen = c => {
      let s = 0;
      for (let i = 0; i < c.length - 1; i++) s += Math.hypot(c[i + 1].x - c[i].x, c[i + 1].y - c[i].y);
      return s;
    };
    let best = 0;
    for (let i = 1; i < chains.length; i++) if (chainLen(chains[i]) > chainLen(chains[best])) best = i;
    if (chains.some((c, i) => i !== best && chainLen(c) > DXF_PROFILE_MIN_LEN)) {
      toast(t('dxfProfileMultiple'), 'info');
    }

    // 5) Очистка выбранной цепочки: склейка дублей → раскрытие замыкания →
    //    объединение коллинеарных точек
    const cleaned = dxfProfileCleanChain(chains[best]);
    let pts = cleaned.points;
    if (cleaned.collinearMerged && chains[best].length > pts.length) {
      toast(t('dxfProfileCollinear'), 'info');
    }

    // 6) Нормализация: min X / min Y → (0,0), как у встроенных пресетов.
    //    Оси DXF совпадают с миром приложения (X вправо, Y вверх) — НЕ инвертируем Y.
    let minX = Infinity, minY = Infinity;
    pts.forEach(p => { if (p.x < minX) minX = p.x; if (p.y < minY) minY = p.y; });
    pts = pts.map(p => ({
      x: Math.round((p.x - minX) * 1e4) / 1e4,
      y: Math.round((p.y - minY) * 1e4) / 1e4
    }));

    // 7) Итог валиден: ≥ 2 точек и суммарная длина > 1 мм
    if (pts.length < 2 || chainLen(pts) <= DXF_PROFILE_MIN_LEN) {
      toast(t('dxfProfileNoLines'), 'error');
      return false;
    }

    // 8) Загрузка в проект (по образцу loadPreset)
    S.undoHistory = [...S.undoHistory, cloneState()];
    if (S.undoHistory.length > 50) S.undoHistory.shift();
    S.points = pts.map(p => ({ x: p.x, y: p.y }));
    S.hems = [];
    S.redoHistory = [];
    S.unfoldResult = null;
    // Новый профиль — старая последовательность гибов бессмысленна
    if (typeof resetSimulationState === 'function') resetSimulationState();
    if (S.autoUnfold) maybeAutoUnfold();
    ufManualZoom = null;
    view3dUserZoomed = false;
    renderAll();
    toast(t('dxfProfileOk') + ': ' + S.points.length + ' ' + pointWord(S.points.length), 'success');
    return true;
  } catch (err) {
    console.error('DXF profile import failed:', err);
    toast(t('dxfProfileBadFile'), 'error');
    return false;
  }
}

// ==================== ПОМОЩНИКИ ====================

// $INSUNITS из заголовка DXF: формат пар «9\n$INSUNITS» затем «70\nзначение».
// @returns {number|null} код единиц или null, если не найден
function dxfProfileDetectUnits(text) {
  const ls = String(text || '').replace(/^\uFEFF/, '').split(/\r?\n/);
  for (let i = 0; i < ls.length - 1; i++) {
    if (ls[i].trim().toUpperCase() === '$INSUNITS') {
      for (let j = i + 1; j < Math.min(ls.length - 1, i + 8); j++) {
        if (parseInt(ls[j], 10) === 70) {
          const v = parseInt(ls[j + 1], 10);
          if (!isNaN(v)) return v;
        }
      }
    }
  }
  return null;
}

// Сшивает LINE-примитивы в цепочки точек (граф связей концов,
// допуск DXF_PROFILE_TOL). Открытые цепи растут в обе стороны от
// любого ребра; замкнутые циклы (все вершины степени 2) обходятся
// с произвольного ребра и возвращаются с первой==последней точкой
// (дубликат снимается позже в dxfProfileCleanChain).
// @param {Array<{x1,y1,x2,y2}>} lines — отрезки (уже в мм)
// @returns {Array<Array<{x,y}>>} цепочки
function dxfProfileChainsFromLines(lines) {
  if (!lines.length) return [];

  // Кластеризация концов: пространственный хэш по сетке допуска
  const pts = [];
  const cells = new Map();
  const findOrAdd = (x, y) => {
    const cx = Math.round(x / DXF_PROFILE_TOL), cy = Math.round(y / DXF_PROFILE_TOL);
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const arr = cells.get((cx + dx) + '_' + (cy + dy));
        if (arr) {
          for (let k = 0; k < arr.length; k++) {
            const p = pts[arr[k]];
            if (Math.abs(p.x - x) <= DXF_PROFILE_TOL && Math.abs(p.y - y) <= DXF_PROFILE_TOL) return arr[k];
          }
        }
      }
    }
    const idx = pts.length;
    pts.push({ x, y });
    const key = cx + '_' + cy;
    if (!cells.has(key)) cells.set(key, []);
    cells.get(key).push(idx);
    return idx;
  };

  const edges = [];
  lines.forEach(l => {
    const a = findOrAdd(l.x1, l.y1);
    const b = findOrAdd(l.x2, l.y2);
    if (a !== b) edges.push([a, b]); // вырожденные (нулевые) отрезки пропускаем
  });
  if (!edges.length) return [];

  // Список смежности: вершина → [{edge, other}]
  const adj = new Map();
  edges.forEach((e, ei) => {
    for (let k = 0; k < 2; k++) {
      if (!adj.has(e[k])) adj.set(e[k], []);
      adj.get(e[k]).push({ edge: ei, other: e[1 - k] });
    }
  });

  const used = new Array(edges.length).fill(false);
  const nextEdgeAt = v => {
    const list = adj.get(v) || [];
    for (let k = 0; k < list.length; k++) if (!used[list[k].edge]) return list[k];
    return null;
  };

  const chains = [];
  for (let ei = 0; ei < edges.length; ei++) {
    if (used[ei]) continue;
    used[ei] = true;
    const chain = [edges[ei][0], edges[ei][1]];
    // продлеваем вперёд от второго конца
    let cur = edges[ei][1];
    for (;;) {
      const nx = nextEdgeAt(cur);
      if (!nx) break;
      used[nx.edge] = true;
      chain.push(nx.other);
      cur = nx.other;
    }
    // продлеваем назад от первого конца
    cur = edges[ei][0];
    for (;;) {
      const pv = nextEdgeAt(cur);
      if (!pv) break;
      used[pv.edge] = true;
      chain.unshift(pv.other);
      cur = pv.other;
    }
    chains.push(chain.map(v => ({ x: pts[v].x, y: pts[v].y })));
  }
  return chains;
}

// Очистка цепочки:
//   a) склейка подряд идущих точек ближе DXF_PROFILE_TOL;
//   b) замкнутая цепочка (первая≈последняя) → снимаем дубликат в конце
//      (приложение работает с открытыми полилиниями-профилями);
//   c) объединение коллинеарных точек (угол между соседними сегментами
//      < DXF_PROFILE_COLLINEAR_DEG) — длинная грань из нескольких LINE
//      не должна давать ложных «гибов».
// @param {Array<{x,y}>} points
// @returns {{points: Array<{x,y}>, collinearMerged: boolean}}
function dxfProfileCleanChain(points) {
  let pts = points.map(p => ({ x: p.x, y: p.y }));

  // a) подряд идущие дубликаты
  const deduped = [];
  for (let i = 0; i < pts.length; i++) {
    const last = deduped[deduped.length - 1];
    if (last && Math.abs(last.x - pts[i].x) <= DXF_PROFILE_TOL && Math.abs(last.y - pts[i].y) <= DXF_PROFILE_TOL) continue;
    deduped.push({ x: pts[i].x, y: pts[i].y });
  }
  pts = deduped;

  // b) замыкание: последняя точка-дубликат первой
  if (pts.length > 2 &&
      Math.abs(pts[0].x - pts[pts.length - 1].x) <= DXF_PROFILE_TOL &&
      Math.abs(pts[0].y - pts[pts.length - 1].y) <= DXF_PROFILE_TOL) {
    pts = pts.slice(0, -1);
  }

  // c) коллинеарные вершины (несколько проходов — на всякий случай)
  let collinearMerged = false;
  for (let pass = 0; pass < 8; pass++) {
    let changed = false;
    const res = [];
    for (let i = 0; i < pts.length; i++) {
      const n = res.length;
      if (n >= 2) {
        const a = res[n - 2], b = res[n - 1], c = pts[i];
        const v1x = b.x - a.x, v1y = b.y - a.y;
        const v2x = c.x - b.x, v2y = c.y - b.y;
        const l1 = Math.hypot(v1x, v1y), l2 = Math.hypot(v2x, v2y);
        if (l1 > 0 && l2 > 0) {
          const cosA = (v1x * v2x + v1y * v2y) / (l1 * l2);
          if (cosA >= Math.cos(DXF_PROFILE_COLLINEAR_DEG * Math.PI / 180)) {
            res[n - 1] = { x: c.x, y: c.y }; // вершина b лежит на прямой a-c → убираем b
            changed = true;
            collinearMerged = true;
            continue;
          }
        }
      }
      res.push({ x: pts[i].x, y: pts[i].y });
    }
    pts = res;
    if (!changed) break;
  }

  return { points: pts, collinearMerged };
}
