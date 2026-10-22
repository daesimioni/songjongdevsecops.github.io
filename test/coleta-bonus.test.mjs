import assert from 'node:assert/strict';
import { rollGather } from '../src/ui/gather.js';
for (const kind of ['vein', 'tree', 'water']) {
  const counts = bonus => {
    const grades = { comum: 0, incomum: 0, raro: 0, lendario: 0 };
    for (let i = 0; i < 10000; i++) grades[rollGather(kind, () => (i + .5) / 10000, { coleta: bonus }).grade]++;
    return grades;
  };
  const base = counts(1), boosted = counts(1.45);
  assert.equal(boosted.comum, base.comum, `${kind}: bônus preserva comuns`);
  assert.ok(boosted.raro + boosted.lendario > base.raro + base.lendario, `${kind}: bônus aumenta achados melhores`);
  assert.ok(boosted.lendario > 0, `${kind}: lendário segue possível`);
}
console.log('ok coleta: bônus melhora raros e lendários sem mudar os comuns');
