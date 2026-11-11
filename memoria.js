/* Solcita · Diario de investigación v1. Unicamente datos locales del navegador. */
(function (root) {
  "use strict";
  const KEY = "solcita.financial-memory.v1";
  const VERSION = 1;
  const LIMIT = 180;
  const DAY = 86400000;
  const THRESHOLD = 2;
  const supported = new Set(["crypto", "equity"]);
  const validPrice = x => typeof x === "number" && Number.isFinite(x) && x > 0 && x < 1e11;
  const cleanText = (x,n=250) => typeof x === "string" ? x.slice(0,n).replace(/[\u0000-\u001f\u007f]/g," ").trim() : "";
  const val = x => typeof x === "number" && Number.isFinite(x) ? +x.toFixed(4) : null;
  const validDate = x => typeof x === "string" && x.length < 40 && Number.isFinite(Date.parse(x));
  const directions = new Set(["up","down","flat","none"]);
  const deepCopy = x => JSON.parse(JSON.stringify(x));

  function validate(raw) {
    if (!raw || typeof raw !== "object") return null;
    const ticker = cleanText(raw.ticker,24).toUpperCase();
    const kind = raw.kind;
    const ts = raw.ts;
    const sourceTime = raw.sourceTime;
    if (!/^[A-Z0-9^._=-]{1,24}$/.test(ticker) || !supported.has(kind)
      || !validDate(ts) || !validPrice(raw.price)) return null;
    if (!validDate(sourceTime)) return null;
    const price = +raw.price;
    const calculatedDay = Date.parse(ts) + 30 * DAY;
    if (!Number.isFinite(calculatedDay)) return null;
    const ruleDirection = directions.has(raw.ruleDirection) ? raw.ruleDirection : "none";
    const personalDirection = directions.has(raw.personalDirection) ? raw.personalDirection : "none";
    const entry = {
      id: cleanText(raw.id,100) || (Date.now().toString(36)+"-"+Math.random().toString(36).slice(2)),
      ts: new Date(ts).toISOString(), sourceTime: new Date(sourceTime).toISOString(),
      ticker,kind,name:cleanText(raw.name,110),currency:cleanText(raw.currency,12).toUpperCase(),
      source:cleanText(raw.source,90),price,
      d7:val(raw.d7),d30:val(raw.d30),vol:val(raw.vol),drawdown:val(raw.drawdown),
      factualNote:cleanText(raw.factualNote,400),
      layerBriefs:Array.isArray(raw.layerBriefs)?raw.layerBriefs.slice(0,7).map(x=>cleanText(x,180)):[],
      note:cleanText(raw.note,400),
      ruleDirection,personalDirection,horizonDays:30,
      resultPrice:validPrice(raw.resultPrice)?+raw.resultPrice:null,
      resultTime:validDate(raw.resultTime)?new Date(raw.resultTime).toISOString():null,
      verifiedAt:validDate(raw.verifiedAt)?new Date(raw.verifiedAt).toISOString():null,
      resultSource:cleanText(raw.resultSource,100)
    };
    if (!entry.resultPrice || !entry.resultTime) {
      entry.resultPrice=null;entry.resultTime=null;entry.verifiedAt=null;entry.resultSource="";
    }
    return entry;
  }

  function read() {
    try {
      const raw = JSON.parse(root.localStorage.getItem(KEY)||"null");
      if (!raw || raw.version !== VERSION || !Array.isArray(raw.entries)) return [];
      return raw.entries.slice(0,LIMIT).map(validate).filter(Boolean).sort((a,b)=>Date.parse(b.ts)-Date.parse(a.ts));
    } catch (_) { return []; }
  }
  function persist(entries) {
    // A failure to write must never be mistaken for a successfully saved memory.
    root.localStorage.setItem(KEY,JSON.stringify({version:VERSION,entries:entries.slice(0,LIMIT).map(validate).filter(Boolean)}));
  }
  function createObservation(facts) {
    if (!facts || !validPrice(facts.price) || !validDate(facts.sourceTime)) throw new Error("Cotización inválida; no se guarda");
    const time = Date.now();
    const age = time-Date.parse(facts.sourceTime);
    if (!Number.isFinite(age) || age< -10*60000 || age> (facts.kind==="crypto"?90*60000:7*DAY)) {
      throw new Error("La cotización está desactualizada; no se registra como observación nueva");
    }
    const entries = read();
    const today = new Date(time).toISOString().slice(0,10);
    const ticker = cleanText(facts.ticker,24).toUpperCase();
    const already = entries.find(x=>x.ticker===ticker&&x.kind===facts.kind&&x.ts.slice(0,10)===today);
    if (already) return {saved:false,entry:deepCopy(already),count:entries.length};
    const d30=val(facts.d30);
    const ruleDirection = d30===null?"none":d30>3?"up":d30< -3?"down":"flat";
    const factualNote = "Variación de 30 días: "+(d30===null?"no disponible":d30.toFixed(2)+"%")+
      ". Volatilidad histórica estimada: "+(val(facts.vol)===null?"no disponible":val(facts.vol).toFixed(2)+"%")+
      ". Catalizadores, balances y valor intrínseco: sin verificar. Regla experimental: "+
      (ruleDirection==="none"?"sin hipótesis, falta contexto suficiente":ruleDirection==="up"?"continuidad alcista":ruleDirection==="down"?"continuidad bajista":"continuidad lateral")+".";
    const entry=validate({
      id:time.toString(36)+"-"+Math.random().toString(36).slice(2),
      ts:new Date(time).toISOString(),sourceTime:facts.sourceTime,
      ticker,kind:facts.kind,name:facts.name,currency:facts.currency,source:facts.source,
      price:facts.price,d7:facts.d7,d30,vol:facts.vol,drawdown:facts.drawdown,
      factualNote,layerBriefs:facts.layerBriefs,ruleDirection,personalDirection:"none"
    });
    if (!entry) throw new Error("No se pudo validar la observación");
    entries.unshift(entry);
    persist(entries);
    return {saved:true,entry:deepCopy(entry),count:entries.length};
  }
  function edit(id,patch) {
    const entries=read();
    const target=entries.find(x=>x.id===id);
    if (!target) throw new Error("No existe esta observación");
    if (isDue(target)) throw new Error("No se puede editar una hipótesis después de su vencimiento");
    target.note=cleanText(patch.note,400);
    target.personalDirection=directions.has(patch.personalDirection)?patch.personalDirection:"none";
    persist(entries);
    return deepCopy(target);
  }
  function targetTime(entry){return Date.parse(entry.ts)+30*DAY;}
  function isDue(entry,now=Date.now()){return now>=targetTime(entry);}
  function selectAtHorizon(entry,series) {
    if (!entry || !isDue(entry) || !Array.isArray(series))return null;
    const at=targetTime(entry),maxGap=entry.kind==="crypto"?2*DAY:5*DAY;
    const candidates=series
      .filter(x=>Array.isArray(x)&&Number.isFinite(x[0])&&validPrice(x[1])&&x[0]>=at&&x[0]<=at+maxGap)
      .sort((a,b)=>a[0]-b[0]);
    return candidates.length?{time:candidates[0][0],price:candidates[0][1]}:null;
  }
  function resultOf(direction,ret){
    if (direction==="none")return "sin_tesis";
    if (!Number.isFinite(ret))return "pendiente";
    const up=ret>THRESHOLD,down=ret< -THRESHOLD,flat=Math.abs(ret)<=THRESHOLD;
    return (direction==="up"?up:direction==="down"?down:flat)?"acierto":"error";
  }
  function result(entry){
    if (!entry || !validPrice(entry.resultPrice))return null;
    const change=100*(entry.resultPrice/entry.price-1);
    return {returnPct:change,ruleVerdict:resultOf(entry.ruleDirection,change),
      personalVerdict:resultOf(entry.personalDirection,change)};
  }
  function verify(id,point,provider) {
    const entries=read(),entry=entries.find(x=>x.id===id);
    if (!entry)throw new Error("Registro no encontrado");
    if (!isDue(entry))throw new Error("El plazo de 30 días todavía no terminó");
    const t=Number(point.time),price=Number(point.price);
    if (!validPrice(price)||!Number.isFinite(t)||t<targetTime(entry)||
      t>targetTime(entry)+(entry.kind==="crypto"?2:5)*DAY)
      throw new Error("No hay cotización histórica válida cerca del vencimiento");
    entry.resultPrice=price;entry.resultTime=new Date(t).toISOString();
    entry.verifiedAt=new Date().toISOString();entry.resultSource=cleanText(provider,90);
    persist(entries);
    return deepCopy(entry);
  }
  function summary(entries=read()) {
    const tested=entries.filter(x=>result(x)&&x.ruleDirection!=="none");
    const successes=tested.filter(x=>result(x).ruleVerdict==="acierto");
    return {observations:entries.length,due:entries.filter(x=>isDue(x)&&!result(x)).length,
      tested:tested.length,successes:successes.length,
      accuracy:tested.length?100*successes.length/tested.length:null};
  }
  function exportJson() {return JSON.stringify({version:VERSION,exportedAt:new Date().toISOString(),entries:read()},null,2);}
  function importJson(text) {
    if (typeof text!=="string"||text.length>2e6)throw new Error("Archivo demasiado grande");
    const parsed=JSON.parse(text);
    if (!parsed||parsed.version!==VERSION||!Array.isArray(parsed.entries)||parsed.entries.length>200)
      throw new Error("Formato de copia no reconocido");
    const imported=parsed.entries.map(validate);
    if (imported.some(x=>!x))throw new Error("La copia contiene registros inválidos");
    const entries=read();
    const ids=new Set(entries.map(x=>x.id));
    for(const entry of imported){if(!ids.has(entry.id)){entries.push(entry);ids.add(entry.id);}}
    entries.sort((a,b)=>Date.parse(b.ts)-Date.parse(a.ts));
    persist(entries);
    return read().length;
  }
  function erase() {root.localStorage.removeItem(KEY);}
  root.SolcitaJournal=Object.freeze({
    read,createObservation,edit,isDue,targetTime,selectAtHorizon,result,summary,
    verify,exportJson,importJson,erase,DAY
  });
})(typeof window!=="undefined"?window:globalThis);
