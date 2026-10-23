import assert from 'node:assert/strict';
import {makeDocument} from './ui-dom.mjs';
const {document}=makeDocument(['wiki-search','wiki-tabs','wiki-list','wiki-detail','wiki-resumo','wiki-more','wiki-intro','wiki-clear']);
globalThis.document=document;
globalThis.localStorage={getItem:()=>null,setItem(){}};
const w=await import('../src/ui/wiki.js');
const {ITEMS,SPELL_MANA,RECIPES}=await import('../src/content/rpg-data.js');
const {QUESTS}=await import('../src/gameplay/quests.js');
const entries=w.indiceDaWiki(), byId=new Map(entries.map(e=>[e.id,e]));
assert.equal(byId.size,entries.length,'links exigem identidade única, inclusive nomes repetidos');
for(const e of entries)for(const id of e.vinculos){
 assert.ok(byId.has(id),`referência quebrada: ${e.id} → ${id}`);
 assert.ok(byId.get(id).vinculos.includes(e.id),`relação sem caminho de volta: ${e.id}`);
}
for(const r of RECIPES){
 const recipe=byId.get(`receita:${r.id}`);
 assert.ok(recipe.vinculos.includes(`item:${r.out}`));
 for(const id of Object.keys(r.need))assert.ok(byId.get(`item:${id}`).vinculos.includes(recipe.id));
}
for(const [id,item] of Object.entries(ITEMS)){
 const e=byId.get(`item:${id}`);
 if(item.damage!==undefined)assert.ok(e.campos.some(([label,value])=>label==='Dano'&&Number(value)===item.damage));
 if(SPELL_MANA[id])assert.ok(e.campos.some(([label,value])=>label==='Custo da magia aprendida'&&value.startsWith(`${SPELL_MANA[id]} de mana`)));
}
for(const q of QUESTS){
 const e=byId.get(`missao:${q.id}`);
 if(q.depois)assert.ok(e.vinculos.includes(`missao:${q.depois}`));
 if(q.quiz)assert.ok(e.solucao.includes(q.quiz.options[q.quiz.answer]));
}
const $=id=>document.getElementById(id);
w.abrirWiki();
assert.equal($('wiki-intro').hidden,false);
assert.equal($('wiki-intro').querySelectorAll('button').length,4);
const cave=entries.find(e=>e.mapa?.tipo==='caverna');
w.abrirWiki(`id:${cave.id}`);
assert.equal($('wiki-list').hidden,true);
assert.equal($('wiki-intro').hidden,true);
assert.ok($('wiki-detail').textContent.includes(cave.nome));
assert.equal($('wiki-detail').querySelectorAll('figure').length,1);
assert.equal($('wiki-detail').querySelectorAll('li').length,cave.mapa.dungeon.rooms.length);
// Cross-link drill-down then back must restore the exact previous article.
const related=$('wiki-detail').querySelectorAll('section')[0].querySelectorAll('button')[0];
related.handlers.click();
$('wiki-detail').querySelectorAll('button').find(b=>b.textContent==='voltar').handlers.click();
assert.ok($('wiki-detail').textContent.includes(cave.nome));
$('wiki-search').value='zzzz';$('wiki-search').handlers.input();
assert.equal($('wiki-detail').hidden,true);
$('wiki-clear').handlers.click();
assert.equal($('wiki-search').value,'');
assert.equal(document.activeElement,$('wiki-search'));
const chapter=entries.find(e=>e.id==='capitulo:arco-1');
w.abrirWiki(`id:${chapter.id}`);
assert.equal($('wiki-detail').querySelectorAll('details')[0].getAttribute('open'),null,'spoiler fechado por padrão');
const url=new URL(w.linkDaEntrada(cave,'https://example.test/game/?debug=1#old'));
assert.equal(url.searchParams.get('wiki'),`id:${cave.id}`);
assert.equal(url.hash,'');
assert.equal(url.searchParams.has('debug'),false);
console.log(`ok enciclopédia: ${entries.length} identidades únicas, relações recíprocas, receitas, atributos, mana, spoilers, plantas e navegação`);
