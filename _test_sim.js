// Тест симуляции гибки
const fs = require('fs');
const path = 'c:/Рабочая резервная/Сайты/razvertki po risunku/';
const code = [
  fs.readFileSync(path + 'js/data.js', 'utf8'),
  fs.readFileSync(path + 'js/engine.js', 'utf8')
].join('\n');
eval(code);

// Мини-состояние
global.S = {
  points: [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: -60 }],
  metal: { metalTypeIndex: 0, thickness: 1.5, bendRadius: 2, kFactor: 0.38 },
  hems: [],
  simBends: []
};

// Функция computeSimPoints, скопированная из canvas.js
function computeSimPointsTest() {
  const res = unfoldProfile(S.points, S.metal.bendRadius, S.metal.kFactor, S.metal.thickness, 100);
  const elements = res.elements || [];
  const bends = res.bendInfos || [];
  const active = S.simBends;
  const pts = [{ x: 0, y: 0 }];
  const bendMarkers = [];
  let angle = 0;
  let bendIdx = 0;
  for (const el of elements) {
    if (el.type === 'bend') {
      const cur = pts[pts.length - 1];
      bendMarkers.push({ x: cur.x, y: cur.y, index: bendIdx, angle: el.angle });
      if (active.includes(bendIdx)) {
        const b = bends.find(bb => bb.vertexIndex === el.bendNumber);
        if (b) angle += b.deflection;
        else angle += el.angle * (el.direction || 1);
      }
      const dx = Math.cos(angle) * el.length;
      const dy = Math.sin(angle) * el.length;
      pts.push({ x: cur.x + dx, y: cur.y + dy });
      bendIdx++;
    } else {
      const cur = pts[pts.length - 1];
      const dx = Math.cos(angle) * el.length;
      const dy = Math.sin(angle) * el.length;
      pts.push({ x: cur.x + dx, y: cur.y + dy });
    }
  }
  return { pts, bendMarkers, bends, res };
}

// L-профиль: 100x60, один гиб 90°
let r = computeSimPointsTest();
console.log('=== L-профиль, до сгиба ===');
console.log('bendMarkers:', r.bendMarkers.length);
console.log('конечная точка:', r.pts[r.pts.length - 1]);
// Сгибаем гиб 0
S.simBends = [0];
r = computeSimPointsTest();
console.log('=== После сгиба гиба 1 ===');
r.pts.forEach((p, i) => console.log(' pt' + i + ':', p.x.toFixed(2), p.y.toFixed(2)));
// Проверка: Y должна стать ~0, X сократиться

// U-профиль: 3 гиба
S.points = [{ x: 0, y: 0 }, { x: 120, y: 0 }, { x: 120, y: -80 }, { x: 0, y: -80 }];
S.simBends = [];
r = computeSimPointsTest();
console.log('\n=== U-профиль, до сгиба ===');
console.log('bendMarkers:', r.bendMarkers.length);
r.pts.forEach((p, i) => console.log(' pt' + i + ':', p.x.toFixed(2), p.y.toFixed(2)));
// Сгибаем все
S.simBends = [0, 1, 2];
r = computeSimPointsTest();
console.log('=== U-профиль, все согнуты ===');
r.pts.forEach((p, i) => console.log(' pt' + i + ':', p.x.toFixed(2), p.y.toFixed(2)));
// Ожидаем U-форму (открытую вниз или вверх)
