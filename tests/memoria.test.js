/* Solcita memory tests: synthetic data, no network or accounts. */
"use strict";
const fs=require("node:fs");
const vm=require("node:vm");
const assert=require("node:assert/strict");
const path=require("node:path");
const code=fs.readFileSync(path.join(__dirname,"..","memoria.js"),"utf8");
const data=new Map();
const storage={
  getItem:key=>data.has(key)?data.get(key):null,
  setItem:(key,value)=>data.set(key,String(value)),
  removeItem:key=>data.delete(key)
};
const window={localStorage:storage};
const sandbox={window,Date,Math,JSON,Set,Number,String,Array,Object,Error};
vm.runInNewContext(code,sandbox,{filename:"memoria.js"});
const M=window.SolcitaJournal;
assert.ok(M,"API de memoria disponible");
const now=Date.now();
const current={ticker:"BTC",kind:"crypto",name:"Bitcoin",source:"Fixture",
  sourceTime:new Date(now-60000).toISOString(),currency:"USD",
  price:100,d7:1,d30:8,vol:60,drawdown:-20};
const first=M.createObservation(current);
assert.equal(first.saved,true);
assert.equal(first.entry.ruleDirection,"up","la regla de continuidad usa 30 dias previos");
assert.equal(M.createObservation(current).saved,false,"una observacion por activo y dia");
const edit=M.edit(first.entry.id,{personalDirection:"down",note:"Veremos qué pasa"});
assert.equal(edit.personalDirection,"down");
assert.equal(edit.note,"Veremos qué pasa");
const older={...first.entry,id:"synthetic-one-month-ago",
  ts:new Date(now-31*M.DAY).toISOString(),
  sourceTime:new Date(now-31*M.DAY).toISOString(),
  resultPrice:null,resultTime:null,verifiedAt:null,resultSource:""};
assert.equal(M.importJson(JSON.stringify({version:1,entries:[older]})),2);
const old=M.read().find(x=>x.id===older.id);
assert.equal(M.isDue(old),true);
const due=M.targetTime(old);
const selected=M.selectAtHorizon(old,[
  [due-M.DAY,200],[due+3600000,106],[due+4*M.DAY,300]]);
assert.equal(selected.price,106,"no usar cotizacion anterior al vencimiento");
assert.throws(()=>M.verify(old.id,{time:due+4*M.DAY,price:300},"Fixture"),
  /cotización histórica válida/);
const tested=M.verify(old.id,{time:selected.time,price:selected.price},"Fixture");
const verdict=M.result(tested);
assert.equal(Math.round(verdict.returnPct),6);
assert.equal(verdict.ruleVerdict,"acierto");
assert.equal(verdict.personalVerdict,"error");
assert.throws(()=>M.edit(tested.id,{personalDirection:"up"}),/no se puede editar/i);
const summary=M.summary();
assert.equal(summary.observations,2);
assert.equal(summary.tested,1);
assert.equal(summary.successes,1);
const exported=M.exportJson();
assert.ok(!exported.includes("localhost")&&!exported.includes("github_pat_"));
M.erase();
assert.equal(M.read().length,0);
M.importJson(exported);
assert.equal(M.read().length,2,"la copia se puede restaurar");
assert.throws(()=>M.importJson(JSON.stringify({version:1,entries:[{ticker:"BAD",price:0}]})),
  /inválidos/);
console.log("OK: registro diario, editado, vencimiento, precio historico, acierto/error, exportar/importar, bloqueo de hindsight.");
