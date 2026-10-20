// Chaves públicas do administrador. A privada nunca entra no repositório:
// quem controla a nsec correspondente é reconhecido pelo jogo.
//
// Cole aqui o npub (npub1...) ou a chave pública em hexadecimal (64 caracteres).
// Exemplo de linha:
//   "npub1...",
export const ADMIN_PUBKEYS = [];

const HEX64 = /^[0-9a-f]{64}$/i;

export function isAdminKey(pubkey, npub, keys = ADMIN_PUBKEYS) {
  const hex = String(pubkey || "").toLowerCase();
  const bech = String(npub || "");
  return (keys || []).some((raw) => {
    const key = String(raw || "").trim();
    if (!key) return false;
    if (HEX64.test(key)) return key.toLowerCase() === hex;
    return key === bech;
  });
}
