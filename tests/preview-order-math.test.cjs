const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const context={window:{}};
vm.runInNewContext(fs.readFileSync('preview-order-math.js','utf8'),context);
const calc=context.window.PrintSwiftOrderMath.calculate;
const base={unit:'ft',width:'4',height:'8',quantity:'2',rate:'65.00',discount:'10.00',paid:'200.00'};
test('exact subtotal, discount and balance',()=>{
 const r=calc(base);assert.equal(r.subtotalCents,416000);assert.equal(r.totalCents,415000);assert.equal(r.balanceCents,395000);
});
test('piece rate and no dimensions',()=>{
 const r=calc({...base,unit:'piece',width:'',height:'',quantity:'10',rate:'2.50',discount:'0',paid:'0'});
 assert.equal(r.totalCents,2500);
});
test('half paisa rounds up',()=>{
 const r=calc({...base,width:'0.5',height:'0.1',quantity:'1',rate:'0.10',discount:'0',paid:'0'});
 assert.equal(r.totalCents,1);
});
test('invalid orders fail closed',()=>{
 for(const [key,value] of [['quantity','0'],['quantity','2.5'],['quantity','100001'],['width','0'],['rate','1.999'],['discount','999999'],['paid','999999'],['unit','unknown']])
  assert.throws(()=>calc({...base,[key]:value}),Error);
});
