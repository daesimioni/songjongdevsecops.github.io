import assert from 'node:assert/strict';
import { QUESTIONS, DEEP_QUESTIONS } from '../src/content/rpg-data.js';
// Importing a gameplay system must not modify shared content.
const before=JSON.stringify(QUESTIONS);
const deepBefore=JSON.stringify(DEEP_QUESTIONS);
const { createQuestionIndex }=await import('../src/gameplay/question-bank.js');
assert.equal(JSON.stringify(QUESTIONS),before);
const first=createQuestionIndex(),second=createQuestionIndex();
for(const [continent,deep] of Object.entries(DEEP_QUESTIONS)){
 const source=QUESTIONS[continent]?.[3];
 if(!source)continue;
 assert.equal(first.get(continent)[3].length,source.length+1);
 assert.equal(first.get(continent)[3].at(-1).q,deep.q);
}
first.get('cs')[3].at(-1).options[0]='changed-deep';
assert.notEqual(second.get('cs')[3].at(-1).options[0],'changed-deep');
assert.equal(JSON.stringify(DEEP_QUESTIONS),deepBefore);
first.get('cs')[1][0].options[0]='changed';
assert.notEqual(second.get('cs')[1][0].options[0],'changed');
assert.equal(JSON.stringify(QUESTIONS),before);
console.log('ok banco: carregamento não altera conteúdo e índices possuem cópias independentes');
