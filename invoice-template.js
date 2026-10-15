// Proprietary PrintSwift browser preview invoice template. NOT FBR verified.
(function (global) {
'use strict';
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function paisa(v,name){if(!Number.isSafeInteger(v)||v<0||v>9000000000000)throw Error(name+' must be nonnegative integer paisa');return v}
function money(v){return 'Rs '+(paisa(v,'Amount')/100).toLocaleString('en-PK',{minimumFractionDigits:2,maximumFractionDigits:2})}
function date(v){if(!v)return 'Not scheduled';var d=new Date(v);if(!Number.isFinite(d.getTime()))throw Error('Invalid date');return d.toLocaleString('en-PK',{year:'numeric',month:'short',day:'2-digit',hour:'2-digit',minute:'2-digit'})}
function render(o,paper){
 if(!o||typeof o!=='object')throw Error('Order required');
 paper=paper||'a4';if(paper!=='a4'&&paper!=='receipt80')throw Error('Unsupported paper size');
 var total=paisa(o.totalCents,'Total'),paid=paisa(o.paidCents,'Advance'),discount=paisa(o.discountCents,'Discount'),rate=paisa(o.rateCents,'Rate');
 if(paid>total||!Number.isSafeInteger(total+discount)||total+discount>9000000000000)throw Error('Invalid totals');
 var qty=Number(o.qty),unit=String(o.unit||'');
 if(!Number.isSafeInteger(qty)||qty<1||qty>100000)throw Error('Invalid quantity');
 if(!['ft','in','cm','m','mm','piece'].includes(unit))throw Error('Invalid unit');
 var size=unit==='piece'?'Per piece':esc(o.width)+' × '+esc(o.height)+' '+esc(unit);
 var id=esc(o.id||'DRAFT'),customer=esc(o.customer||'Walk-in'),phone=esc(o.phone||'—');
 var material=esc(o.material||'Print job'),created=esc(date(o.created||new Date().toISOString()));
 var due=esc(date(o.due)),priority=esc(o.priority||'normal'),narrow=paper==='receipt80';
 var css='@page{size:'+(narrow?'80mm auto':'A4')+';margin:'+(narrow?'3mm':'12mm')+'}*{box-sizing:border-box}body{font:13px/1.5 system-ui,Arial,sans-serif;background:#e9edf5;color:#17213a;margin:0;padding:20px}.toolbar{max-width:'+(narrow?'74mm':'190mm')+';margin:0 auto 10px;display:flex;justify-content:space-between;gap:10px}.toolbar button{padding:9px 14px;background:#182646;color:white;border:0;border-radius:6px;cursor:pointer}.paper{width:'+(narrow?'74mm':'190mm')+';max-width:100%;margin:auto;padding:'+(narrow?'9px':'24px')+';background:white;box-shadow:0 8px 30px #0002}header{display:flex;justify-content:space-between;gap:8px;align-items:start;border-bottom:3px solid #202b48;padding-bottom:12px}h1{margin:0;font-size:'+(narrow?'19px':'27px')+'}.brand,small{color:#69748a;font-size:10px}.tag{font-size:9px;font-weight:800;border:1px solid #b78243;background:#fff2e3;padding:6px}.meta{display:grid;grid-template-columns:'+(narrow?'1fr':'1fr 1fr')+';gap:12px;padding:14px 0}.meta b{display:block;overflow-wrap:anywhere}table{width:100%;border-collapse:collapse;margin-top:12px}td,th{padding:'+(narrow?'5px 2px':'9px 5px')+';border-bottom:1px solid #dfe4ef;vertical-align:top}th{text-align:left;background:#f0f3f9;color:#46526d;font-size:10px}.num{text-align:right}.totals{margin:16px 0 0 auto;max-width:'+(narrow?'none':'280px')+'}.totalrow{display:flex;justify-content:space-between;gap:12px;padding:5px 0}.grand{border-top:2px solid #1a2844;font-weight:900;font-size:15px}.due{margin-top:18px;background:#f1f4f8;padding:10px}footer{border-top:1px solid #dfe4ef;margin-top:22px;padding-top:12px;font-size:10px}.warn{font-weight:900;color:#8d430d}@media print{body{padding:0;background:white}.toolbar{display:none}.paper{width:100%;padding:0;box-shadow:none}}';
 return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PrintSwift '+id+'</title><style>'+css+'</style></head><body>'+
 '<div class="toolbar"><span>Print preview · '+(narrow?'80 mm receipt':'A4')+' · Ctrl+P</span><button type="button" onclick="window.print()">Print</button></div>'+
 '<main class="paper"><header><div><h1>PrintSwift</h1><div class="brand">PRINTING · DESIGN · PRODUCTION</div></div><span class="tag">DEMO · NOT FBR VERIFIED</span></header>'+
 '<div class="meta"><div><small>INVOICE / ESTIMATE</small><b>'+id+'</b><small>Created: '+created+'</small></div><div><small>CUSTOMER</small><b>'+customer+'</b><div>'+phone+'</div></div></div>'+
 '<table><thead><tr><th>Description</th><th>Size</th><th class="num">Qty</th><th class="num">Rate</th><th class="num">Amount</th></tr></thead><tbody><tr><td>'+material+'</td><td>'+size+'</td><td class="num">'+qty+'</td><td class="num">'+money(rate)+'</td><td class="num">'+money(total+discount)+'</td></tr></tbody></table>'+
 '<div class="totals"><div class="totalrow"><span>Subtotal</span><b>'+money(total+discount)+'</b></div><div class="totalrow"><span>Discount</span><b>− '+money(discount)+'</b></div><div class="totalrow grand"><span>Total</span><b>'+money(total)+'</b></div><div class="totalrow"><span>Advance</span><b>'+money(paid)+'</b></div><div class="totalrow grand"><span>Balance due</span><b>'+money(total-paid)+'</b></div></div>'+
 '<div class="due"><strong>Promised delivery:</strong> '+due+'<br><strong>Priority:</strong> '+priority+'</div>'+
 '<footer><div class="warn">DEVELOPMENT PREVIEW — NOT A TAX INVOICE · NOT FBR VERIFIED</div><p>Confirm measurements, artwork and delivery date. Tax treatment requires an authorized invoicing system.</p></footer></main></body></html>';
}
function open(order,paper){var html=render(order,paper),w=global.open('','_blank');if(!w)throw Error('Allow pop-ups to view the invoice');w.opener=null;w.document.open();w.document.write(html);w.document.close();w.focus();return w}
global.PrintSwiftInvoice={render:render,open:open};
})(window);
