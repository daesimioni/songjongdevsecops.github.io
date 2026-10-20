// A tela de personagem: gênero, cabelo, pele e olhos, com prévia desenhada.
// Serve para a primeira entrada e para a Ficha depois; quem chama decide onde
// ela mora e o que fazer quando algo muda.
import { GENDERS, HAIRS, SKINS, HAIR_TONES, EYES, normalizeAvatar } from "./avatar.js";
import { drawHuman } from "./human.js";

const el = (tag, cls, text) => {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  return node;
};

function swatchRow(label, list, value, onPick) {
  const row = el("div", "look-row");
  row.appendChild(el("span", "look-label", label));
  const swatches = el("div", "look-swatches");
  list.forEach((color, index) => {
    const button = el("button", `look-swatch${index === value ? " on" : ""}`);
    button.type = "button";
    button.style.background = color;
    button.setAttribute("aria-label", `${label} ${index + 1}`);
    button.setAttribute("aria-pressed", index === value ? "true" : "false");
    button.addEventListener("click", () => onPick(index));
    swatches.appendChild(button);
  });
  row.appendChild(swatches);
  return row;
}

export function renderCharacterEditor(mount, { look, colors, isLocked = () => false, onChange }) {
  const current = normalizeAvatar(look);
  mount.textContent = "";

  const wrap = el("div", "look-editor");
  const previewBox = el("div", "look-preview");
  const canvas = document.createElement("canvas");
  canvas.width = 132;
  canvas.height = 148;
  canvas.setAttribute("aria-label", "prévia do personagem");
  canvas.setAttribute("role", "img");
  previewBox.appendChild(canvas);
  wrap.appendChild(previewBox);

  const controls = el("div", "look-controls");

  const genderRow = el("div", "look-row");
  genderRow.appendChild(el("span", "look-label", "corpo"));
  const genderButtons = el("div", "look-chips");
  for (const gender of GENDERS) {
    const button = el("button", `look-chip${current.gender === gender.id ? " on" : ""}`, gender.name);
    button.type = "button";
    button.addEventListener("click", () => onChange({ gender: gender.id }));
    genderButtons.appendChild(button);
  }
  genderRow.appendChild(genderButtons);
  controls.appendChild(genderRow);

  const hairRow = el("div", "look-row");
  hairRow.appendChild(el("span", "look-label", "cabelo"));
  const hairGrid = el("div", "look-hairs");
  for (const hair of HAIRS) {
    const locked = hair.unlock ? isLocked(hair.unlock) : false;
    const button = el("button", `look-hair${current.hair === hair.id ? " on" : ""}${locked ? " locked" : ""}`, hair.name);
    button.type = "button";
    button.disabled = locked;
    if (locked) button.title = `abre ao completar ${hair.unlock}`;
    button.addEventListener("click", () => onChange({ hair: hair.id }));
    hairGrid.appendChild(button);
  }
  hairRow.appendChild(hairGrid);
  controls.appendChild(hairRow);

  controls.appendChild(swatchRow("pele", SKINS, current.skin, (skin) => onChange({ skin })));
  controls.appendChild(swatchRow("cabelo", HAIR_TONES, current.hairColor, (hairColor) => onChange({ hairColor })));
  controls.appendChild(swatchRow("olhos", EYES, current.eyes, (eyes) => onChange({ eyes })));
  wrap.appendChild(controls);
  mount.appendChild(wrap);

  // prévia: o mesmo desenho do mapa, com a roupa do traje escolhido
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = "#0b1024";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(97, 244, 192, 0.06)";
  ctx.beginPath();
  ctx.ellipse(canvas.width / 2, canvas.height - 22, 52, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  drawHuman(ctx, canvas.width / 2, canvas.height - 20, 0, false, 0, { ...colors, hair: HAIR_TONES[current.hairColor], skin: SKINS[current.skin], eyes: EYES[current.eyes] }, 4.2, current);

  return current;
}
