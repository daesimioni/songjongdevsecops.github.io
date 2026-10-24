// Requer Playwright no ambiente de QA; não entra no runtime do jogo.
// UI_PLAYWRIGHT_MODULE e UI_BROWSER permitem usar uma instalação já disponível.
const {chromium} = await import(process.env.UI_PLAYWRIGHT_MODULE || 'playwright');
import {createStaticServer} from './serve.mjs';
import {writeFile,mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
const server=createStaticServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:process.env.UI_BROWSER || undefined,headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:900},hasTouch:process.env.UI_TOUCH === '1',reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
try {
await page.goto(`http://127.0.0.1:${server.address().port}/?debug`, {waitUntil:"domcontentloaded",timeout:60000});await page.waitForFunction(()=>window.__mundo, null, {timeout:60000});
await page.locator('#intro-skip').click();await page.locator('#intro-name').fill('Viajante');await page.locator('.look-vocation').first().click();await page.locator('#intro-net').uncheck();await page.locator('#intro-form button[type=submit]').click();await page.waitForFunction(()=>document.querySelector('#intro').hidden);await page.waitForTimeout(200);
// Congela apenas a animação do mundo durante a medição de layout.
await page.evaluate(()=>{const frame=window.requestAnimationFrame.bind(window);window.requestAnimationFrame=callback=>callback.name === "loop" ? 0 : frame(callback);});
const output = process.env.UI_OUTPUT || 'temporarios/audit-ui';
await mkdir(output,{recursive:true});const results=[];
const openers={journal:()=>document.querySelector('#btn-journal').click(),sheet:()=>document.querySelector('#btn-sheet').click(),inventory:()=>document.querySelector('#btn-inventory').click(),bestiary:()=>document.querySelector('#btn-bestiary').click(),wiki:()=>window.__mundo.openWiki(),help:()=>document.querySelector('#btn-help').click(),rede:()=>document.querySelector('#btn-rede').click(),shop:()=>{window.__mundo.dungeon.open('dungeon-cs');window.__mundo.openShop()},travel:()=>window.__mundo.openTravel(),vocacoes:()=>window.__mundo.openVocacoes(),biblioteca:()=>window.__mundo.openBiblioteca(),guilda:()=>window.__mundo.openGuilda()};
Object.assign(openers, {
  npc:()=>window.__mundo.ui.openNpc(window.__mundo.world.npcs.find(n=>!n.trainer)),
  gather:()=>window.__mundo.ui.openGather('tree'),
  training:()=>window.__mundo.ui.openTraining(window.__mundo.world.npcs.find(n=>n.trainer)),
  outfits:()=>window.__mundo.ui.openOutfits(),
  look:()=>window.__mundo.ui.openLook(),
  "world-combat":()=>{window.__mundo.ui.openTraining(window.__mundo.world.npcs.find(n=>n.trainer));document.querySelector('[data-tier]').click();window.__mundo.ui.refreshCombat();},
});
// Functions are serialized individually to execute the real UI entry points.
const viewports=JSON.parse(process.env.UI_VIEWPORTS || '[[1440,900],[1024,768],[768,1024],[390,844],[320,568],[844,390]]');
for(const [width,height] of viewports){
 await page.evaluate(large=>document.documentElement.dataset.fonte=large?'grande':'normal',process.env.UI_LARGE === '1');
 await page.setViewportSize({width,height});
 console.log(`Auditando ${width}×${height}`);
 for(const [id,fn] of Object.entries(openers)){
  await page.keyboard.press('Escape');await page.evaluate(()=>{window.__mundo.ui.stopCombat();window.__mundo.dungeon.close();});await page.evaluate(fn);await page.evaluate(()=>window.__mundo.ui.refreshCombat());await page.waitForTimeout(50);
  const visible=await page.locator('#'+id).isVisible();if(!visible) throw new Error(`Não abriu: ${id} em ${width}x${height}`);
  const geometry=await page.locator('#'+id).evaluate(root=>{const card=root.querySelector('.modal-card') || root;const r=card.getBoundingClientRect();const overflowing=[...root.querySelectorAll('*')].filter(n=>{if(!n.getClientRects().length)return false;const s=window.getComputedStyle(n);return n.scrollWidth>n.clientWidth+3 && n.clientWidth>0 && !['auto','scroll','hidden'].includes(s.overflowX) && !['CANVAS','SVG','PATH','INPUT'].includes(n.tagName)}).map(n=>({tag:n.tagName,cls:n.className,sw:n.scrollWidth,cw:n.clientWidth}));const clippedButtons=[...root.querySelectorAll('button')].filter(n=>n.getClientRects().length && n.clientHeight && n.scrollHeight>n.clientHeight+3).map(n=>({text:n.textContent.trim().slice(0,60),height:n.clientHeight,content:n.scrollHeight}));return {bounds:{x:r.x,y:r.y,right:r.right,bottom:r.bottom},overflowing:overflowing.slice(0,10),clippedButtons};});
  results.push({width,height,id,...geometry});
  if(id === "world-combat") {
    await page.evaluate(()=>window.__mundo.ui.renderFrame());
    const overlaps = await page.locator('#world-combat').evaluate(root=>{
      const a=root.getBoundingClientRect();
      return [...document.querySelectorAll('#touch .dpad, #touch .touch-right, .minimap:not(.grande)')].filter(n=>n.getClientRects().length).some(n=>{
        const b=n.getBoundingClientRect();
        return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
      });
    });
    assert.equal(overlaps,false,'Combate cobre controles de movimento ou minimapa');
  }
  if(id === 'sheet') {
    await page.locator('#sheet-tab-resumo').focus();
    await page.keyboard.press('End');
    assert.equal(await page.locator('#sheet-tab-forja').getAttribute('aria-selected'), 'true');
    await page.keyboard.press('Home');
    assert.equal(await page.locator('#sheet-tab-resumo').getAttribute('aria-selected'), 'true');
  }
  if(id !== "world-combat") {
  await page.keyboard.press('Tab');
  assert.ok(await page.locator('#'+id).evaluate(root=>root.contains(document.activeElement)), `Foco saiu de ${id}`);
  } else { assert.equal(await page.locator("#duel").isVisible(), false); }

  if(process.env.UI_SCREENSHOTS !== '0' && [1440,390,844,320].includes(width)&&JSON.parse(process.env.UI_SCREENSHOT_IDS || '["inventory","wiki","journal","help","sheet","bestiary","shop","look","world-combat","gather"]').includes(id))await page.screenshot({animations:'disabled',timeout:15000,path:`${output}/${width}-${id}.png`});
 }
}
const problems=results.filter(r=>r.overflowing.length || r.clippedButtons.length || r.bounds.x<0 || r.bounds.right>r.width+1 || r.bounds.bottom>r.height+1);
await writeFile(`${output}/results.json`,JSON.stringify({errors,results,problems},null,2));console.log(JSON.stringify({screens:results.length,errors,problems},null,2));
if(errors.length || problems.length) process.exitCode=1;
} finally { await browser.close(); server.close(); }
