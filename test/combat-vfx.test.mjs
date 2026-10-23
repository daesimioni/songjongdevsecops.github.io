import test from "node:test";
import assert from "node:assert/strict";
import { createCanvas, loadImage } from "@napi-rs/canvas";
import { effectFrame, combatPose } from "../src/rendering/combat-vfx.js";
import { directionVector } from "../src/core/movement.js";

test("animação usa oito quadros sem repetir depois de expirar", () => {
  assert.equal(effectFrame(-1, 260), -1);
  assert.equal(effectFrame(260, 260), -1);
  const frames = new Set();
  for (let t = 0; t < 260; t++) frames.add(effectFrame(t, 260));
  assert.deepEqual([...frames], [0, 1, 2, 3, 4, 5, 6, 7]);
});
test("pose visual segue as oito direções sem alterar a posição lógica", () => {
  for (let dir = 0; dir < 8; dir++) {
    const actor = { x: 100, y: 80, dir, ataqueVisualAte: 260 };
    const before = { ...actor }, v = directionVector(dir), pose = combatPose(actor, 130, true);
    assert.ok(Math.abs(pose.x - v.x * 2.5) < 1e-10);
    assert.ok(Math.abs(pose.y - v.y * 2.5) < 1e-10);
    assert.deepEqual(actor, before);
  }
});
test("atlas de produção contém 64 células com transparência e arte", async () => {
  const image = await loadImage(new URL("../assets/combat/action-vfx-v1.png", import.meta.url).pathname);
  assert.equal(image.width, 512); assert.equal(image.height, 512);
  const canvas = createCanvas(512, 512), ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);
  for (let row = 0; row < 8; row++) for (let col = 0; col < 8; col++) {
    const data = ctx.getImageData(col * 64, row * 64, 64, 64).data;
    let opaque = 0, transparent = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > 100) opaque++;
      if (data[i] < 10) transparent++;
    }
    assert.ok(opaque > 0 && transparent > 500, `célula ${row},${col} vazia ou sem recorte`);
  }
});
