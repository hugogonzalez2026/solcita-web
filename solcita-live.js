/* Solcita · public HP observations; read-only, browser-safe. */
(() => {
  "use strict";
  const holder=document.getElementById("debian-market-cards");
  const msg=document.getElementById("debian-market-message");
  if(!holder || !msg)return;

  const assets=new Set(["BTC","ETH","SOL","DOT","PAXG"]);
  const quotes=new Set(["USD","USDT","USDC"]);
  const format=new Intl.NumberFormat("es-AR",{maximumFractionDigits:4,minimumFractionDigits:2});
  const deltaFmt=new Intl.NumberFormat("es-AR",{maximumFractionDigits:2,minimumFractionDigits:2});
  const pct=x=>typeof x==="number"&&Number.isFinite(x)
    ?(x>0?"+":"")+deltaFmt.format(x)+" %":"N/D";
  const date=ms=>new Date(ms).toLocaleString("es-AR",{
    timeZone:"America/Argentina/Buenos_Aires",dateStyle:"short",timeStyle:"short"
  });
  const node=(tag,content,cls)=>{
    const e=document.createElement(tag);
    e.textContent=content;
    if(cls)e.className=cls;
    return e;
  };
  function showData(payload){
    if(!payload||payload.schema_version!==1||!Array.isArray(payload.assets)){
      throw new Error("Formato desconocido");
    }
    const now=Date.now();
    const last=Date.parse(payload.data_asof_utc);
    const posted=Date.parse(payload.published_at_utc);
    if(!Number.isFinite(posted)||posted>now+3*60000)throw new Error("Hora incorrecta");
    const fresh=Number.isFinite(last)&&last<=now+3*60000&&now-last<=30*60000;
    const visible=[];
    const seen=new Set();
    for(const a of payload.assets.slice(0,12)){
      if(!a || !assets.has(a.asset)||!quotes.has(a.quote_currency)||
        !["Kraken","Pionex"].includes(a.exchange)||seen.has(a.asset))continue;
      if(typeof a.price!=="number"||!Number.isFinite(a.price)||a.price<=0)continue;
      const when=Date.parse(a.asof_utc);
      if(!Number.isFinite(when)||when>now+3*60000)continue;
      seen.add(a.asset);
      visible.push({data:a,stale:!!a.stale||!fresh||now-when>15*60000});
    }
    holder.replaceChildren();
    if(!visible.length){
      msg.textContent="La HP todavía no publicó observaciones de mercado verificables. Las cotizaciones públicas de arriba siguen disponibles.";
      return;
    }
    for(const {data:d,stale} of visible){
      const card=node("article",null,"debian-market-item");
      const head=node("div",d.asset+" · "+d.exchange+" / "+d.quote_currency,"debian-market-head");
      const price=node("strong",format.format(d.price)+" "+d.quote_currency,"debian-market-price");
      const one=node("span","1 h: "+pct(d.change_1h_pct),"debian-market-change");
      const day=node("span","24 h: "+pct(d.change_24h_pct),"debian-market-change");
      const meta=node("span",(stale?"Histórico · ":"Medido · ")+date(Date.parse(d.asof_utc))+
        (stale?" · desactualizado":""),"debian-market-meta");
      card.append(head,price,one,day,meta);
      holder.append(card);
    }
    msg.textContent=(fresh?"Lectura de mercado recibida de la HP":"Último resumen disponible, posiblemente desactualizado")+
      " · "+date(Number.isFinite(last)?last:posted)+" (Argentina)."+
      " Se mantienen las unidades originales USD, USDT o USDC.";
  }
  async function refresh(){
    try{
      const controller=new AbortController();
      const timer=setTimeout(()=>controller.abort(),10000);
      let response;
      try {
        response=await fetch("./market-public.json?refresh="+Date.now(),{
          cache:"no-store",credentials:"omit",signal:controller.signal
        });
      }finally{clearTimeout(timer);}
      if(!response.ok)throw new Error("Pendiente");
      showData(await response.json());
    }catch(_){
      holder.replaceChildren();
      msg.textContent="Esperando la primera publicación autónoma desde Debian. Mientras tanto, las cotizaciones de CoinGecko siguen funcionando.";
    }
  }
  refresh();
  setInterval(refresh,300000);
  document.addEventListener("visibilitychange",()=>{
    if(!document.hidden)refresh();
  });
})();
