// Exact decimal calculation for the browser preview only; no tax/FBR submission.
(function(){
  'use strict';
  function decimal(value, places, label, positive) {
    const s=String(value ?? '').trim();
    if (!new RegExp('^[0-9]+(?:\\.[0-9]{1,'+places+'})?$').test(s)) throw Error(label+' must have at most '+places+' decimals');
    const parts=s.split('.'),scale=10n**BigInt(places);
    const n=BigInt(parts[0])*scale+BigInt((parts[1]||'').padEnd(places,'0')||'0');
    if ((positive && n===0n)||n>90000000000000000n) throw Error(label+' outside range');
    return n;
  }
  function calculate(x) {
    if (!['ft','in','cm','m','mm','piece'].includes(x.unit)) throw Error('Invalid unit');
    const qty=decimal(x.quantity,0,'Quantity',true);
    if(qty>100000n) throw Error('Quantity exceeds 100000');
    const rate=decimal(x.rate,2,'Rate',false);
    const discount=decimal(x.discount,2,'Discount',false);
    const paid=decimal(x.paid,2,'Advance',false);
    const piece=x.unit==='piece',scale=10000n;
    const width=piece?scale:decimal(x.width,4,'Width',true);
    const height=piece?scale:decimal(x.height,4,'Height',true);
    if(width>1000000n*scale||height>1000000n*scale) throw Error('Dimension too large');
    const area=width*height*qty;
    const subtotal=piece?qty*rate:(area*rate+50000000n)/100000000n;
    if(subtotal>9000000000000n) throw Error('Subtotal too large');
    if(discount>subtotal) throw Error('Discount exceeds subtotal');
    const total=subtotal-discount;
    if(paid>total) throw Error('Advance exceeds total');
    const area100=(area+500000n)/1000000n;
    return {subtotalCents:Number(subtotal),discountCents:Number(discount),
      totalCents:Number(total),paidCents:Number(paid),balanceCents:Number(total-paid),
      areaText:piece?String(qty):String(area100/100n)+'.'+String(area100%100n).padStart(2,'0'),
      areaUnit:piece?'pcs':'sq '+x.unit};
  }
  window.PrintSwiftOrderMath={calculate};
})();
