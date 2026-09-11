// ═══════════════════════════════════════════════════════════════
// ИМПОРТ ПРОФИЛЯ ИНСТРУМЕНТА (МАТРИЦА / ПУАНСОН) ИЗ DXF
// Минимальный самодостаточный парсер: LINE, LWPOLYLINE, POLYLINE, ARC, CIRCLE
// ═══════════════════════════════════════════════════════════════

/**
 * Разбирает DXF-текст на примитивы.
 * @param {string} text - содержимое .dxf файла
 * @returns {Array} массив примитивов {type, ...}
 */
function parseDXFEntities(text) {
  const ls = String(text || '').replace(/^\uFEFF/, '').split(/\r?\n/);
  const entities = [];
  let i = 0;

  while (i < ls.length - 1) {
    let code = parseInt(ls[i], 10);
    const value = (ls[i + 1] === undefined ? '' : String(ls[i + 1])).trim();
    if (code !== 0) { i += 2; continue; }

    const type = value.toUpperCase();
    i += 2;

    if (type === 'LINE') {
      const e = { type: 'LINE', x1: 0, y1: 0, x2: 0, y2: 0 };
      while (i < ls.length - 1) {
        code = parseInt(ls[i], 10);
        if (code === 0) break;
        const v = parseFloat(ls[i + 1]);
        if (code === 10) e.x1 = v;
        else if (code === 20) e.y1 = v;
        else if (code === 11) e.x2 = v;
        else if (code === 21) e.y2 = v;
        i += 2;
      }
      entities.push(e);
    } else if (type === 'ARC' || type === 'CIRCLE') {
      const e = { type: 'ARC', cx: 0, cy: 0, r: 0, a1: 0, a2: type === 'ARC' ? 180 : 360 };
      while (i < ls.length - 1) {
        code = parseInt(ls[i], 10);
        if (code === 0) break;
        const v = parseFloat(ls[i + 1]);
        if (code === 10) e.cx = v;
        else if (code === 20) e.cy = v;
        else if (code === 40) e.r = v;
        else if (code === 50) e.a1 = v;
        else if (code === 51) e.a2 = v;
        i += 2;
      }
      if (e.r > 0) entities.push(e);
    } else if (type === 'LWPOLYLINE') {
      const pts = [];
      let closed = false;
      while (i < ls.length - 1) {
        code = parseInt(ls[i], 10);
        if (code === 0) break;
        const raw = (ls[i + 1] || '').trim();
        if (code === 70) closed = (parseInt(raw, 10) & 1) === 1;
        else if (code === 10) {
          const x = parseFloat(raw);
          let y = 0;
          if (i + 2 < ls.length - 1 && parseInt(ls[i + 2], 10) === 20) {
            y = parseFloat(ls[i + 3]);
            i += 2;
          }
          pts.push({ x, y });
        }
        i += 2;
      }
      if (pts.length >= 2) entities.push({ type: 'POLYLINE', points: pts, closed });
    } else if (type === 'POLYLINE') {
      // Ищем следующие VERTEX до ENDSEQ
      const pts = [];
      let closed = false;
      // пропускаем заголовочные поля полилинии
      while (i < ls.length - 1) {
        code = parseInt(ls[i], 10);
        if (code === 0) break;
        if (code === 70) closed = (parseInt(ls[i + 1], 10) & 1) === 1;
        i += 2;
      }
      // читаем VERTEX'ы
      while (i < ls.length - 1 && parseInt(ls[i], 10) === 0) {
        const subType = (ls[i + 1] || '').trim().toUpperCase();
        i += 2;
        if (subType === 'VERTEX') {
          let x = 0, y = 0;
          while (i < ls.length - 1) {
            code = parseInt(ls[i], 10);
            if (code === 0) break;
            const v = parseFloat(ls[i + 1]);
            if (code === 10) x = v;
            else if (code === 20) y = v;
            i += 2;
          }
          pts.push({ x, y });
        } else if (subType === 'SEQEND') {
          while (i < ls.length - 1 && parseInt(ls[i], 10) !== 0) i += 2;
          break;
        } else {
          while (i < ls.length - 1 && parseInt(ls[i], 10) !== 0) i += 2;
        }
      }
      // не выходим за границы: возвращаемся на entity boundary позже
      if (pts.length >= 2) entities.push({ type: 'POLYLINE', points: pts, closed });
    } else {
      // Пропускаем нерелевантные сущности (TEXT, HATCH, INSERT и т.д.)
      while (i < ls.length - 1) {
        if (parseInt(ls[i], 10) === 0) break;
        i += 2;
      }
    }
  }
  return entities;
}

/**
 * Собирает цепочки точек из примитивов.
 * @param {Array} entities примитивы из parseDXFEntities
 * @returns {Array<Array<{x,y}>>} массив цепочек (ломаных)
 */
function buildChainsFromDXF(entities) {
  // 1. Разбиваем все сущности на рёбра
  const segs = [];
  entities.forEach(e => {
    if (!e) return;
    if (e.type === 'LINE') {
      segs.push([{ x: e.x1, y: e.y1 }, { x: e.x2, y: e.y2 }]);
    } else if (e.type === 'POLYLINE') {
      const pts = e.points.slice();
      if (e.closed && pts.length > 1) pts.push({ ...pts[0] });
      for (let k = 0; k < pts.length - 1; k++) segs.push([pts[k], pts[k + 1]]);
    } else if (e.type === 'ARC') {
      const from = Math.min(e.a1, e.a2) * Math.PI / 180;
      const to = Math.max(e.a1, e.a2) * Math.PI / 180;
      const sweep = Math.max(0.0001, to - from);
      const steps = Math.max(8, Math.ceil(sweep / (Math.PI / 18)));
      let prev = null;
      for (let k = 0; k <= steps; k++) {
        const a = from + sweep * k / steps;
        const pt = { x: e.cx + Math.cos(a) * e.r, y: e.cy + Math.sin(a) * e.r };
        if (prev) segs.push([prev, pt]);
        prev = pt;
      }
    }
  });
  if (segs.length === 0) return [];

  // 2) Сшиваем рёбра в цепочки по совпадению концов
  const eps = 1e-4;
  const keyOf = p => Math.round(p.x / eps) + '_' + Math.round(p.y / eps);
  const adj = new Map();
  segs.forEach((s, idx) => {
    const k0 = keyOf(s[0]), k1 = keyOf(s[1]);
    if (!adj.has(k0)) adj.set(k0, []);
    if (!adj.has(k1)) adj.set(k1, []);
    adj.get(k0).push({ idx, end: 0 }); // конец 0 (s[0]) находится в точке k0
    adj.get(k1).push({ idx, end: 1 }); // конец 1 (s[1]) находится в точке k1
  });

  const used = new Array(segs.length).fill(false);
  const chains = [];

  const pointAt = (s, end) => s[end];

  const seekPt = (key, curIdx, point) => {
    const list = adj.get(key) || [];
    for (const cand of list) {
      if (cand.idx === curIdx || used[cand.idx]) continue;
      const d0 = pointAt(segs[cand.idx], cand.end);
      if (Math.abs(d0.x - point.x) < eps && Math.abs(d0.y - point.y) < eps) {
        return { idx: cand.idx, nextPoint: pointAt(segs[cand.idx], cand.end === 1 ? 0 : 1) };
      }
    }
    return null;
  };

  for (let s0 = 0; s0 < segs.length; s0++) {
    if (used[s0]) continue;
    // начинаем новую цепочку
    used[s0] = true;
    const chain = [segs[s0][0], segs[s0][1]];
    // продлеваем вперёд
    let curIdx = s0;
    let curPt = segs[s0][1];
    for (;;) {
      const next = seekPt(keyOf(curPt), curIdx, curPt);
      if (!next) break;
      used[next.idx] = true;
      chain.push(next.nextPoint);
      curIdx = next.idx;
      curPt = next.nextPoint;
    }
    // назад
    curPt = segs[s0][0];
    let backIdx = s0;
    for (;;) {
      const list = adj.get(keyOf(curPt)) || [];
      let found = false;
      for (const cand of list) {
        if (cand.idx === backIdx || used[cand.idx]) continue;
        const d0 = pointAt(segs[cand.idx], cand.end);
        if (Math.abs(d0.x - curPt.x) < eps && Math.abs(d0.y - curPt.y) < eps) {
          const other = pointAt(segs[cand.idx], cand.end === 1 ? 0 : 1);
          chain.unshift(other);
          used[cand.idx] = true;
          backIdx = cand.idx;
          curPt = other;
          found = true;
          break;
        }
      }
      if (!found) break;
    }
    chains.push(chain);
  }
  // сортируем: самая длинная цепочка первая (это, скорее всего, контур инструмента)
  chains.sort((a, b) => b.length - a.length);
  return chains;
}

/**
 * Строит профиль инструмента из DXF.
 * @returns {{chains:Array, width:number, height:number}|null}
 */
function profileFromDXF(dxfText) {
  const entities = parseDXFEntities(dxfText);
  const chains = buildChainsFromDXF(entities);
  if (chains.length === 0) return null;

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  chains.forEach(chain => chain.forEach(p => {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }));
  if (!isFinite(minX) || !isFinite(maxX)) return null;

  // Нормируем координаты в систему с Y вверх (как в DXF)
  return {
    chains,
    width: maxX - minX,
    height: maxY - minY,
    minX, maxX, minY, maxY
  };
}

/**
 * Оценка ширины ручья V-матрицы по профилю.
 * Ищет наибольший разрыв между точками на верхней границе контура —
 * это и есть "рот" V-канавки (расстояние между верхними концами скосов).
 * @param {{chains:Array, minX:number, maxX:number, maxY:number, width:number}} profile
 * @returns {number|null} ширина ручья в мм или null, если определить нельзя
 */
function estimateDieVWidth(profile) {
  if (!profile || !profile.chains) return null;
  const EPS = 1e-6;
  const maxY = profile.maxY;
  // Точки на верхней границе контура (должны быть верхние грани матрицы)
  const xs = [];
  profile.chains.forEach(chain => {
    chain.forEach(p => {
      if (Math.abs(p.y - maxY) < EPS) xs.push(p.x);
    });
  });
  if (xs.length < 2) return null;
  xs.sort((a, b) => a - b);
  // v5.7 FIX: ручей — только ВНУТРЕННИЙ зазор (между точками НЕ на
  // краях контура), как в findDieGrooveCenter. Раньше брался просто
  // НАИБОЛЬШИЙ зазор — для типовой матрицы (плечи шире ручья) он
  // приходился на плечо, и V-ширина завышалась.
  const minX = xs[0], maxX = xs[xs.length - 1];
  let gap = 0;
  for (let i = 0; i < xs.length - 1; i++) {
    if (xs[i] <= minX + EPS) continue;          // точка на левом краю
    if (xs[i + 1] >= maxX - EPS) continue;      // точка на правом краю
    const g = xs[i + 1] - xs[i];
    if (g > gap) gap = g;
  }
  if (gap <= EPS) return null;
  // Зазор должен быть заметной частью ширины (но не всей шириной — иначе контур разорван)
  if (gap < profile.width * 0.02 || gap > profile.width * 0.95) return null;
  return gap;
}
// ═══════════════════════════════════════════════════════════════
// v5.9: ЭКСПОРТ ИНСТРУМЕНТА В DXF
// Из списков «Ваши пуансоны» / «Ваши матрицы» (диалоги своих
// инструментов) каждый инструмент можно выгрузить в DXF (R12):
// контур профиля — LINE-сегментами на слое OUTLINE. Для матриц без
// профиля (стандартные V) контур генерируется из параметров V/S/H.
// ═══════════════════════════════════════════════════════════════

// Контур стандартной V-матрицы (как рисуется на холсте: ручьём вверх,
// верхняя грань на y=0, тело вниз). vWidth — ручей, height — толщина,
// swidth — ширина (по умолчанию 2×V).
function _stdDiePolygon(die) {
  const vW = die.vWidth || 10;
  const dH = die.height || 40;
  const sw = die.swidth || vW * 2;
  const halfV = vW / 2, halfS = sw / 2;
  const vDepth = dH * 0.5;
  return [
    { x: -halfS, y: 0 }, { x: -halfV, y: 0 }, { x: 0, y: -vDepth },
    { x: halfV, y: 0 }, { x: halfS, y: 0 }, { x: halfS, y: -dH }, { x: -halfS, y: -dH }
  ];
}

// DXF R12 с контуром инструмента: замкнутые цепочки профиля → LINE
// (включая замыкающее ребро — контуры инструментов замкнуты, как
// рисуются на холсте через closePath).
function generateToolDXF(tool, kind) {
  if (!tool) return null;
  let chains = null;
  if (tool.profile && Array.isArray(tool.profile.chains) && tool.profile.chains.length) {
    chains = tool.profile.chains;
  } else if (Array.isArray(tool.profile) && tool.profile.length) {
    chains = [tool.profile];
  } else if (kind === 'die') {
    // Стандартная V-матрица — генерируем контур из параметров
    chains = [_stdDiePolygon(tool)];
  }
  if (!chains || !chains.length) return null;

  function n(v) {
    return parseFloat(Number(v).toFixed(6)).toString();
  }

  const dxf = [];
  // ══ HEADER ══
  dxf.push('0', 'SECTION', '2', 'HEADER');
  dxf.push('9', '$ACADVER', '1', 'AC1009');
  dxf.push('9', '$INSUNITS', '70', '4');
  dxf.push('9', '$HANDSEED', '5', 'FFFF');
  dxf.push('0', 'ENDSEC');
  // ══ TABLES ══
  dxf.push('0', 'SECTION', '2', 'TABLES');
  dxf.push('0', 'TABLE', '2', 'LTYPE', '70', '1');
  dxf.push('0', 'LTYPE', '2', 'CONTINUOUS', '70', '0', '3', 'Solid line', '72', '65', '73', '0', '40', '0');
  dxf.push('0', 'ENDTAB');
  dxf.push('0', 'TABLE', '2', 'LAYER', '70', '1');
  // Слой OUTLINE; цвет: матрица — синий (5), пуансон — красный (1)
  dxf.push('0', 'LAYER', '2', 'OUTLINE', '70', '0', '62', kind === 'die' ? '5' : '1', '6', 'CONTINUOUS');
  dxf.push('0', 'ENDTAB');
  dxf.push('0', 'ENDSEC');
  // ══ ENTITIES ══
  dxf.push('0', 'SECTION', '2', 'ENTITIES');
  chains.forEach(function (chain) {
    if (!chain || chain.length < 2) return;
    for (let i = 0; i < chain.length; i++) {
      const a = chain[i], b = chain[(i + 1) % chain.length]; // замкнуто
      if (!a || !b) continue;
      if (i === chain.length - 1 && Math.hypot(a.x - b.x, a.y - b.y) < 1e-9) continue; // уже замкнут
      dxf.push('0', 'LINE', '8', 'OUTLINE',
        '10', n(a.x), '20', n(a.y), '30', '0',
        '11', n(b.x), '21', n(b.y), '31', '0');
    }
  });
  dxf.push('0', 'ENDSEC', '0', 'EOF');
  return dxf.join('\n');
}

// Выгрузить свой инструмент в DXF (кнопка в списке «Ваши пуансоны»/
// «Ваши матрицы»). kind: 'punch' | 'die'.
function exportToolDXF(id, kind) {
  const tools = loadCustomTools();
  const list = (kind === 'die') ? tools.customDies : tools.customPunches;
  const tool = list.find(function (x) { return x.id === id; });
  if (!tool) return;
  const dxf = generateToolDXF(tool, kind);
  if (!dxf) {
    toast(t('toolDxfNoGeometry'), 'error');
    return;
  }
  const base = (tool.nameRu || tool.nameEn || (kind === 'die' ? 'die' : 'punch'))
    .replace(/[\\/:*?"<>|]+/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 48) || (kind === 'die' ? 'die' : 'punch');
  downloadBlob(dxf, 'application/dxf', (kind === 'die' ? 'die-' : 'punch-') + base + '.dxf');
  toast(t('toolDxfExported'));
}
window.exportToolDXF = exportToolDXF;
