const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

const context={
  console,Date,Math,JSON,Promise,setTimeout,clearTimeout,
  document:{querySelector:()=>({}),querySelectorAll:()=>[],fonts:{ready:Promise.resolve()}},
  indexedDB:{open:()=>({})},
  localStorage:{getItem:()=>null,setItem:()=>{}},
  Image:function(){},
  state:{editor:null},
  bounds:o=>o,
  renderObject:()=>{},
  renderEditor:async()=>{},
  renderRightPanel:()=>{},
  idbGet:async()=>null,
  idbPut:async()=>{},
  MapEditor:function(){}
};
context.MapEditor.prototype={down(){},move(){}};
vm.createContext(context);
vm.runInContext(fs.readFileSync('js/core.js','utf8'),context,{filename:'core.js'});
context.TC_V06={drawDecorText(){}};
vm.runInContext(fs.readFileSync('js/v07.js','utf8'),context,{filename:'v07.js'});

const settings=vm.runInContext("defaultSettings('world')",context);
assert.equal(settings.labelFont,'Old Standard TT');
assert.equal(settings.titleFont,'Cormorant SC');
assert.equal(settings.columns,60);

const map={settings:{background:'#fff'}};
vm.runInContext("TC_V07.ensure",context)(map);
assert.equal(map.settings.labelFont,'Old Standard TT');
assert.equal(map.settings.titleFont,'Cormorant SC');
console.log('runtime model smoke: ok');
