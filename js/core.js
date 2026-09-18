const APP_VERSION = '0.1.0'
const $app = document.querySelector('#app')

const KIND_LABELS = { world:'Мир', region:'Регион', city:'Город', dungeon:'Подземелье', battle:'Battlemap' }
const TOOL_LABELS = {
  select:['⌖','Выбор'], pan:['✥','Перемещение'], room:['□','Комната / область'], wall:['━','Стена'], door:['▭','Дверь'],
  road:['⌁','Дорога'], river:['≈','Река'], text:['T','Подпись'], tree:['♣','Лес / дерево'], mountain:['▲','Гора'], settlement:['●','Поселение']
}
const TOOL_KINDS = {
  door:['dungeon','battle','city'], road:['world','region','city'], river:['world','region','city'],
  tree:['world','region','city'], mountain:['world','region'], settlement:['world','region']
}

const state = { screen:'home', projectId:null, mapId:null, editor:null }
const uid = (p='id') => `${p}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,9)}`
const now = () => Date.now()
const esc = (s='') => String(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))
const clamp = (n,a,b) => Math.max(a,Math.min(b,n))
const deep = obj => JSON.parse(JSON.stringify(obj))

// ---------- IndexedDB ----------
const dbPromise = new Promise((resolve,reject) => {
  const req = indexedDB.open('tirandor-cartographer', 1)
  req.onupgradeneeded = () => {
    const db = req.result
    if (!db.objectStoreNames.contains('projects')) db.createObjectStore('projects',{keyPath:'id'})
    if (!db.objectStoreNames.contains('maps')) {
      const s = db.createObjectStore('maps',{keyPath:'id'})
      s.createIndex('projectId','projectId',{unique:false})
    }
  }
  req.onsuccess = () => resolve(req.result)
  req.onerror = () => reject(req.error)
})
async function txStore(name, mode='readonly') { const db = await dbPromise; return db.transaction(name,mode).objectStore(name) }
async function idbGet(store,key){ const s=await txStore(store); return new Promise((res,rej)=>{const r=s.get(key);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)}) }
async function idbPut(store,val){ const s=await txStore(store,'readwrite'); return new Promise((res,rej)=>{const r=s.put(val);r.onsuccess=()=>res(val);r.onerror=()=>rej(r.error)}) }
async function idbDelete(store,key){ const s=await txStore(store,'readwrite'); return new Promise((res,rej)=>{const r=s.delete(key);r.onsuccess=()=>res();r.onerror=()=>rej(r.error)}) }
async function idbAll(store){ const s=await txStore(store); return new Promise((res,rej)=>{const r=s.getAll();r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)}) }
async function mapsFor(projectId){ return (await idbAll('maps')).filter(m=>m.projectId===projectId).sort((a,b)=>b.updatedAt-a.updatedAt) }

function defaultSettings(kind){ return {
  columns: ['world','region'].includes(kind)?60:kind==='city'?50:30,
  rows: ['world','region'].includes(kind)?40:kind==='city'?36:22,
  cellSize:50, gridVisible:['dungeon','battle'].includes(kind), gridOpacity:.24, gridType:'square',
  background:['dungeon','battle'].includes(kind)?'#f0e5cf':'#e8ddbf', snapToGrid:['dungeon','battle'].includes(kind)
}}
function defaultLayers(kind){ return ['dungeon','battle'].includes(kind)
  ? [{id:uid('layer'),name:'GM Notes',visible:true,locked:false},{id:uid('layer'),name:'Objects',visible:true,locked:false},{id:uid('layer'),name:'Walls & doors',visible:true,locked:false},{id:uid('layer'),name:'Floor',visible:true,locked:false}]
  : [{id:uid('layer'),name:'Labels',visible:true,locked:false},{id:uid('layer'),name:'Settlements',visible:true,locked:false},{id:uid('layer'),name:'Roads & rivers',visible:true,locked:false},{id:uid('layer'),name:'Terrain',visible:true,locked:false}]
}
function createProject(name='Тирандор'){ return {id:uid('project'),name,description:'Карты мира, регионов, городов и подземелий.',createdAt:now(),updatedAt:now()} }
function createMap(projectId,name='Новая карта',kind='dungeon'){
  const layers=defaultLayers(kind); return {id:uid('map'),projectId,name,kind,createdAt:now(),updatedAt:now(),settings:defaultSettings(kind),layers,activeLayerId:layers[layers.length-1].id,objects:[]}
}

