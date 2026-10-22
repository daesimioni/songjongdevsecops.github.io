// Engine-neutral correctness rules. Browser globals are checked separately
// from Node tooling; source contracts in older tests retain their formatting.
const browserNames = ['window','document','navigator','location','history','localStorage','sessionStorage','performance','requestAnimationFrame','cancelAnimationFrame','setTimeout','clearTimeout','setInterval','clearInterval','console','URL','URLSearchParams','TextEncoder','TextDecoder','WebSocket','Worker','Image','Audio','AudioContext','webkitAudioContext','OffscreenCanvas','ResizeObserver','MutationObserver','IntersectionObserver','fetch','crypto','atob','btoa','Blob','File','FileReader','CompressionStream','DecompressionStream','Response','AbortController','structuredClone','matchMedia','devicePixelRatio','Event','CustomEvent','HTMLElement','HTMLInputElement','HTMLTextAreaElement','HTMLSelectElement','Node','getComputedStyle','innerWidth','innerHeight','WebAssembly','PointerEvent','InputEvent','alert','confirm','prompt'];
const rules = {
  'no-undef':'error', 'no-unreachable':'error', 'no-dupe-args':'error',
  'no-dupe-keys':'error', 'no-duplicate-case':'error', 'no-func-assign':'error',
  'no-import-assign':'error', 'no-const-assign':'error', 'valid-typeof':'error',
  'constructor-super':'error', 'no-this-before-super':'error', 'no-unsafe-finally':'error',
  'no-async-promise-executor':'error', 'no-promise-executor-return':'error',
};
export default [
  { ignores:['node_modules/**','dist/**','coverage/**'] },
  { files:['src/**/*.js'], languageOptions:{ ecmaVersion:'latest', sourceType:'module', globals:Object.fromEntries(browserNames.map(name=>[name,'readonly'])) }, rules:{ ...rules, 'no-unused-vars':['error',{args:'none',caughtErrors:'none',varsIgnorePattern:'^_'}] } },
  { files:['tools/**/*.mjs','test/**/*.mjs','eslint.config.js'], languageOptions:{ ecmaVersion:'latest', sourceType:'module', globals:{ process:'readonly', console:'readonly', Buffer:'readonly', setTimeout:'readonly', clearTimeout:'readonly', setInterval:'readonly', clearInterval:'readonly', document:'readonly', window:'readonly', localStorage:'readonly', navigator:'readonly', requestAnimationFrame:'readonly', cancelAnimationFrame:'readonly', URL:'readonly', Response:'readonly', fetch:'readonly', TextEncoder:'readonly', TextDecoder:'readonly', structuredClone:'readonly', performance:'readonly', WebAssembly:'readonly', atob:'readonly', btoa:'readonly', Blob:'readonly', location:'readonly', Event:'readonly', crypto:'readonly' } }, rules:{ ...rules, 'no-promise-executor-return':'off' } },
];
