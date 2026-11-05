'use strict';
const assert = require('node:assert/strict');
const {loadResearch, parseQuote, classify} = require('./alert-quotes.cjs');
const ctx = loadResearch();
assert.equal(ctx.assets.length, 61);
assert.equal(ctx.assets.filter(x => x.portfolio.included).length, 15);
const now = new Date('2026-11-05T06:05:00Z');
function response(key, time, p=20) {
  const a = Array(50).fill(''); a[2]=key.replace(/^[a-z]+/,''); a[3]=p; a[30]=time;
  return `v_${key}="${a.join('~')}";`;
}
assert.equal(parseQuote(response('sh600036','20261105140500'),'sh600036',now).price,20);
for (const raw of [response('sh600036','20261104140500'),response('sh600036','20261105150000'),response('sh600036','20261105100000'),response('sh600036','20261105140500',0),response('sz000001','20261105140500')]) {
  assert.throws(()=>parseQuote(raw,'sh600036',now));
}
const asset = {key:'sh600036',market:'SH',code:'600036',name:'fixture',gate:'pending',conditionStatus:'pending',valuationStatus:'conditional',executionHold:true,executionHoldReason:'现金待核',model:{type:'pb',inputs:[8,10,12],multiples:[1,1,1],extra:[0,0,0],discountYears:0,margin:[.2,.1]}};
const q = p=>({price:p,time:'20261105140500',source:'TENCENT'});
assert.equal(classify(ctx,asset,q(9)).bucket,'zone');
assert.equal(classify(ctx,asset,q(7)).bucket,'below');
assert.equal(classify(ctx,asset,q(11)).bucket,'above');
assert.match(classify(ctx,asset,q(9)).condition,/暂不启用/);
assert.equal(classify(ctx,{...asset,gate:'failed'},q(9)),null);
assert.equal(classify(ctx,{...asset,modelReviewDueAt:'2020-01-01'},q(9)),null);
console.log('Dashboard loading, fresh quote validation, currency/zone rules and execution holds passed.');
