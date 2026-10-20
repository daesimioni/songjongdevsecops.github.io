// O banco do catálogo reúne os bancos de cada disciplina. Uma área só entra no
// jogo quando o tópico dela está aqui.

import { MATH_BANK } from "./catalog-bank-math.js";
import { PHYSICS_BANK } from "./catalog-bank-physics.js";
import { CHEM_BANK } from "./catalog-bank-chem.js";
import { CS_BANK } from "./catalog-bank-cs.js";
import { LINGUA_BANK } from "./catalog-bank-lingua.js";

export const BANK = {
  ...MATH_BANK,
  ...PHYSICS_BANK,
  ...CHEM_BANK,
  ...CS_BANK,
  ...LINGUA_BANK,
};
