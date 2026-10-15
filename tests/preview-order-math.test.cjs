const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const context={window:{}};
vm.runInNewContext(fs.readFileSync('preview-order-math.js','utf8'),context);
const calc=context.window.PrintSwiftOrderMath.calculate;
const base={unit:'ft',width:'4',height:'8',quantity:'2',rate:'65.00',discount:'10.00',paid:'200.00'};

test('exact subtotal, discount and balance',()=>{
 const r=calc(base);
 assert.equal(r.subtotalCents,416000);
 assert.equal(r.totalCents,415000);
 assert.equal(r.balanceCents,395000);
});
test('piece rate and no dimensions',()=>{
 const r=calc({...base,unit:'piece',width:'',height:'',quantity:'10',rate:'2.50',discount:'0',paid:'0'});
 assert.equal(r.totalCents,2500);
 assert.equal(r.areaText,'10');
});
test('half paisa rounds up',()=>{
 const r=calc({...base,width:'0.5',height:'0.1',quantity:'1',rate:'0.10',discount:'0',paid:'0'});
 assert.equal(r.totalCents,1);
});
test('invalid orders fail closed even when calculator runs in another JS realm',()=>{
 // vm.runInNewContext creates a different Error constructor. Do not compare
 // cross-realm exceptions using assert.throws(fn, Error).
 for(const [key,value,pattern] of [
  ['quantity','0',/Quantity outside range/],
  ['quantity','2.5',/Quantity must be a decimal/],
  ['quantity','100001',/Quantity exceeds 100000/],
  ['width','0',/Width outside range/],
  ['height','0',/Height outside range/],
  ['rate','1.999',/Rate must be a decimal/],
  ['discount','999999',/Discount exceeds subtotal/],
  ['paid','999999',/Advance exceeds total/],
  ['unit','unknown',/Invalid unit/],
  ['rate','-1',/Rate must be a decimal/],
  ['rate','1e5',/Rate must be a decimal/],
  ['rate','NaN',/Rate must be a decimal/],
  ['rate','Infinity',/Rate must be a decimal/],
  ['width','0.00001',/Width must be a decimal/],
  ['discount','0.001',/Discount must be a decimal/],
 ]){
  assert.throws(()=>calc({...base,[key]:value}),pattern,`${key}=${value} should fail`);
 }
});
test('fully discounted order permits zero advance and zero balance',()=>{
 const r=calc({...base,unit:'piece',quantity:'2',rate:'100.00',discount:'200.00',paid:'0'});
 assert.equal(r.totalCents,0);
 assert.equal(r.balanceCents,0);
});
test('full advance is accepted and has zero balance',()=>{
 const r=calc({...base,unit:'piece',quantity:'2',rate:'100.00',discount:'0',paid:'200.00'});
 assert.equal(r.totalCents,20000);
 assert.equal(r.balanceCents,0);
});
test('non-pieces retain two-decimal area display',()=>{
 const r=calc({...base,width:'0.25',height:'0.25',quantity:'1',rate:'100',discount:'0',paid:'0'});
 assert.equal(r.areaText,'0.06');
 assert.equal(r.totalCents,625);
});
