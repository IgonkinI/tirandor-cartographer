// Tirandor Cartographer v0.9 — asset-library UX, recent items and drag/drop placement
const TC_V09=(()=>{
  const MODES=[['all','Все'],['favorites','★ Избранное'],['recent','Недавние']];
  const TAGS=[
    ['terrain','Местность'],['settlement','Поселения'],['building','Здания'],['ruin','Руины'],
    ['water','Вода'],['creature','Существа'],['character','Персонажи'],['guild','Гильдии'],
    ['magic','Магия'],['religion','Культ'],['artifact','Артефакты'],['navigation','Навигация']
  ];
  const ui={
    mode:'all',
    tags:new Set(),
    density:localStorage.getItem('tc-v09-density')||'normal'
  };
  const RECENT_KEY='tc-v09-recent';
  const MAX_RECENT=30;
  const guildRu={
    blacksmiths_guild:'Гильдия кузнецов',miners_guild:'Гильдия шахтёров',inventors_guild:'Гильдия изобретателей',
    merchants_guild:'Гильдия торговцев',bankers_guild:'Гильдия банкиров',sailors_guild:'Гильдия мореходов',
    cartographers_guild:'Гильдия картографов',scribes_guild:'Гильдия писцов',hunters_guild:'Гильдия охотников',
    trackers_guild:'Гильдия следопытов',mercenaries_guild:'Гильдия наёмников',guards_guild:'Гильдия стражей',
    thieves_guild:'Гильдия воров',assassins_guild:'Гильдия убийц',actors_guild:'Гильдия актёров',
    bards_guild:'Гильдия бардов',circus_guild:'Гильдия циркачей',healers_guild:'Гильдия целителей',
    alchemists_guild:'Гильдия алхимиков',scholars_guild:'Гильдия учёных',mages_guild:'Гильдия магов',
    seers_guild:'Гильдия провидцев',elementalists_guild:'Гильдия стихийников',druids_guild:'Гильдия друидов',
    necromancers_guild:'Гильдия некромантов',astralists_guild:'Гильдия астралистов',portalkeepers_guild:'Гильдия портальщиков',
    enchanters_guild:'Гильдия заклинателей',tamers_guild:'Гильдия усмирителей',herbalists_guild:'Гильдия травников',
    farmers_guild:'Гильдия земледельцев',fishermen_guild:'Гильдия рыболовов',cooks_guild:'Гильдия кулинаров',
    brewers_guild:'Гильдия пивоваров',builders_guild:'Гильдия строителей',shipbuilders_guild:'Гильдия корабельщиков',
    treasure_hunters_guild:'Гильдия кладоискателей',translators_guild:'Гильдия переводчиков',
    diplomats_guild:'Гильдия дипломатов',mediators_guild:'Гильдия посредников'
  };
  const displayLabel=item=>guildRu[item.id]||TC_V08.label(item.id);

  function recent(){
    try{return JSON.parse(localStorage.getItem(RECENT_KEY)||'[]').filter(x=>x&&x.pack&&x.id)}
    catch{return[]}
  }
  function remember(pack,id){
    let r=recent().filter(x=>!(x.pack===pack&&x.id===id));
    r.unshift({pack,id,at:Date.now()});
    localStorage.setItem(RECENT_KEY,JSON.stringify(r.slice(0,MAX_RECENT)));
  }
  function key(item){return item.pack+':'+item.id}
  function itemTags(item){
    const s=new Set(),id=item.id,pack=item.pack;
    if(pack==='terrain_landscape')s.add('terrain');
    if(pack==='special_places'){s.add('ruin');if(/portal|wizard|alchemist|sunken|altar|shrine|temple|catacomb|crypt/.test(id))s.add('magic')}
    if(pack==='guilds'){s.add('guild');if(/mage|seer|element|druid|necro|astral|portal|enchant|alchemist|healer|herbal/.test(id))s.add('magic')}
    if(pack==='buildings_civic'){s.add('building');if(/castle|walls|keep|town|house|market|inn|farm|barn|village|gate|docks|stable|warehouse/.test(id))s.add('settlement');if(/cathedral|temple|chapel|monastery|shrine|mausoleum/.test(id))s.add('religion');if(/lighthouse|bridge|docks/.test(id))s.add('navigation')}
    if(pack==='creatures'){s.add('creature');if(/ghost|banshee|golem|gargoyle|phoenix|hydra|dragon|wyvern|manticore|chimera|basilisk|salamander|hell|kraken|leviathan|sea_serpent/.test(id))s.add('magic')}
    if(pack==='races')s.add('character');
    if(pack==='mixed_symbols'||pack==='mixed_symbols_alt'){
      if(/city|castle|settlement|village/.test(id))s.add('settlement');
      if(/mountain|forest|tree|volcano|waterfall|arch/.test(id))s.add('terrain');
      if(/bridge|lighthouse|ship|longship|compass/.test(id))s.add('navigation');
      if(/sea|whale|octopus|mermaid/.test(id))s.add('water');
      if(/dragon|griff|wolf|bear|boar|stag|bison|lynx|unicorn|gargoyle/.test(id))s.add('creature');
      if(/knight|ranger|wizard|king|bishop|deity|demon|barbarian|warrior|dryad|elemental|golem/.test(id))s.add('character');
      if(/wizard|deity|demon|dryad|elemental|golem|enchanted|spell/.test(id))s.add('magic');
      if(/crown|sword|chalice|reliquary|spellbook|hourglass|shield|horn|chest|banner/.test(id))s.add('artifact');
      if(/compass/.test(id))s.add('navigation');
    }
    if(/lake|river|water|coast|island|swamp|marsh|oasis|glacier/.test(id))s.add('water');
    if(/ruin|abandoned|broken|fallen|excavation|battlefield/.test(id))s.add('ruin');
    return s;
  }
  function baseItems(){
    let items=TC_V08.allItems().map(x=>({...x,label:displayLabel(x)}));
    const pack=TC_V08.ui.pack;
    if(pack&&pack!=='all')items=items.filter(x=>x.pack===pack);
    if(ui.mode==='favorites'){
      const fav=TC_V08.favorites();items=items.filter(x=>fav.has(key(x)));
    }else if(ui.mode==='recent'){
      const r=recent(),rank=new Map(r.map((x,i)=>[x.pack+':'+x.id,i]));
      items=items.filter(x=>rank.has(key(x))).sort((a,b)=>rank.get(key(a))-rank.get(key(b)));
    }
    if(ui.tags.size)items=items.filter(x=>[...ui.tags].every(t=>itemTags(x).has(t)));
    const q=(TC_V08.ui.query||'').trim().toLowerCase();
    if(q)items=items.filter(x=>(x.id+' '+x.label+' '+x.packLabel+' '+[...itemTags(x)].join(' ')).toLowerCase().includes(q));
    return items;
  }
  function createObject(map,pack,id,x,y,size){
    const p=TC_V08.PACKS[pack];
    return{id:uid('obj'),type:'sheetAsset',pack,assetId:id,x,y,size:size||p.defaultSize,rotation:0,opacity:1,blend:'source-over',layerId:map.activeLayerId}
  }
  function place(ed,pack,id,x,y,size){
    const l=ed.map.layers.find(v=>v.id===ed.map.activeLayerId);
    if(l?.locked||!l?.visible){toast('Активный слой скрыт или заблокирован');return null}
    const o=createObject(ed.map,pack,id,x,y,size);ed.map.objects.push(o);ed.selectedId=o.id;remember(pack,id);ed.commit();renderRightPanel(ed,ed.map);return o
  }
  function centerPoint(ed){
    const r=ed.canvas.getBoundingClientRect();
    return ed.snap(ed.world({clientX:r.left+r.width/2,clientY:r.top+r.height/2}))
  }
  function wireCanvasDrop(ed){
    const c=ed.canvas;if(c.dataset.tc9Drop==='1')return;c.dataset.tc9Drop='1';
    const wrap=c.closest('.canvas-wrap');
    c.addEventListener('dragover',e=>{if(e.dataTransfer?.types?.includes('application/x-tirandor-asset')){e.preventDefault();if(e.dataTransfer)e.dataTransfer.dropEffect='copy';wrap?.classList.add('tc9-drop-active')}});
    c.addEventListener('dragleave',()=>wrap?.classList.remove('tc9-drop-active'));
    c.addEventListener('drop',e=>{wrap?.classList.remove('tc9-drop-active');const raw=e.dataTransfer?.getData('application/x-tirandor-asset');if(!raw)return;e.preventDefault();try{const a=JSON.parse(raw),p=ed.snap(ed.world(e));place(ed,a.pack,a.id,p.x,p.y,a.size)}catch(err){console.error(err);toast('Не удалось разместить ассет')}});
  }
  function setDensity(v){ui.density=v;localStorage.setItem('tc-v09-density',v)}
  return{MODES,TAGS,ui,recent,remember,itemTags,baseItems,displayLabel,createObject,place,centerPoint,wireCanvasDrop,setDensity}
})();

const tc9Right=renderRightPanel;
renderRightPanel=function(ed,map){
  tc9Right(ed,map);const rp=$('#rightPanel');if(!rp)return;
  rp.querySelector('.tc8-assets')?.remove();
  TC_V09.wireCanvasDrop(ed);

  const items=TC_V09.baseItems(),favs=TC_V08.favorites();
  const panel=document.createElement('section');panel.className='panel tc9-library tc9-density-'+TC_V09.ui.density;
  panel.innerHTML='<span class="eyebrow">Illustrated asset library</span><div class="panel-head"><div><h3>Библиотека · '+items.length+' / 302</h3><span class="muted">Клик — выбрать · двойной клик — в центр · drag & drop — прямо на карту</span></div></div>'+
    '<div class="tc9-mode">'+TC_V09.MODES.map(([id,label])=>'<button data-mode="'+id+'" class="'+(TC_V09.ui.mode===id?'active':'')+'">'+label+'</button>').join('')+'</div>'+
    '<div class="tc9-search-row"><select id="tc9Pack"><option value="all">Все 8 наборов</option>'+Object.entries(TC_V08.PACKS).map(([id,p])=>'<option value="'+id+'" '+(TC_V08.ui.pack===id?'selected':'')+'>'+p.label+' · '+p.ids.length+'</option>').join('')+'</select><input id="tc9Search" placeholder="Поиск по названию, ID и тегам…" value="'+esc(TC_V08.ui.query||'')+'"></div>'+
    '<div class="tc9-tags">'+TC_V09.TAGS.map(([id,label])=>'<button data-tag="'+id+'" class="'+(TC_V09.ui.tags.has(id)?'active':'')+'">'+label+'</button>').join('')+'</div>'+
    '<div class="tc9-meta"><label>Размер размещения <input id="tc9Size" type="number" min="40" max="650" value="'+TC_V08.ui.size+'"></label><div class="tc9-density"><span>Превью</span><button data-density="compact" class="'+(TC_V09.ui.density==='compact'?'active':'')+'">S</button><button data-density="normal" class="'+(TC_V09.ui.density==='normal'?'active':'')+'">M</button><button data-density="large" class="'+(TC_V09.ui.density==='large'?'active':'')+'">L</button></div></div>'+
    (items.length?'<div class="tc9-grid">'+items.map(a=>'<div class="tc9-card-wrap"><button draggable="true" class="tc9-card '+(TC_V08.ui.selected===a.id&&TC_V08.ui.pack===a.pack?'active':'')+'" data-pack="'+a.pack+'" data-id="'+a.id+'"><canvas data-tc9-preview data-pack="'+a.pack+'" data-id="'+a.id+'"></canvas><span>'+a.label+'</span><small>'+a.packLabel+'</small></button><button class="tc9-star '+(favs.has(a.pack+':'+a.id)?'active':'')+'" data-fav="'+a.pack+':'+a.id+'" title="В избранное">★</button></div>').join('')+'</div>':'<div class="tc9-empty"><b>Ничего не найдено</b><span>Снимите часть фильтров или измените запрос.</span></div>');

  const anchor=rp.querySelector('.tc7-pack')||rp.querySelector('.tc6-compose')||rp.children[1]||rp.firstChild;
  rp.insertBefore(panel,anchor);TC_V08.ensureAtlas();

  panel.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{TC_V09.ui.mode=b.dataset.mode;renderRightPanel(ed,map)});
  $('#tc9Pack').onchange=e=>{TC_V08.ui.pack=e.target.value;renderRightPanel(ed,map)};
  let searchTimer=null;
  $('#tc9Search').oninput=e=>{TC_V08.ui.query=e.target.value;clearTimeout(searchTimer);searchTimer=setTimeout(()=>{const pos=TC_V08.ui.query.length;renderRightPanel(ed,map);requestAnimationFrame(()=>{const i=$('#tc9Search');if(i){i.focus();i.setSelectionRange(pos,pos)}})},150)};
  panel.querySelectorAll('[data-tag]').forEach(b=>b.onclick=()=>{const t=b.dataset.tag;TC_V09.ui.tags.has(t)?TC_V09.ui.tags.delete(t):TC_V09.ui.tags.add(t);renderRightPanel(ed,map)});
  $('#tc9Size').onchange=e=>TC_V08.ui.size=clamp(+e.target.value||160,40,650);
  panel.querySelectorAll('[data-density]').forEach(b=>b.onclick=()=>{TC_V09.setDensity(b.dataset.density);renderRightPanel(ed,map)});

  panel.querySelectorAll('.tc9-card').forEach(b=>{
    const choose=()=>{TC_V08.ui.pack=b.dataset.pack;TC_V08.ui.selected=b.dataset.id;TC_V08.ui.size=TC_V08.PACKS[b.dataset.pack].defaultSize;TC_V09.remember(b.dataset.pack,b.dataset.id);ed.setTool('sheetasset');$$('.tool').forEach(t=>t.classList.toggle('active',t.dataset.tool==='sheetasset'))};
    b.onclick=()=>{choose();panel.querySelectorAll('.tc9-card').forEach(x=>x.classList.remove('active'));b.classList.add('active')};
    b.ondblclick=e=>{e.preventDefault();choose();const p=TC_V09.centerPoint(ed);TC_V09.place(ed,b.dataset.pack,b.dataset.id,p.x,p.y,TC_V08.ui.size)};
    b.ondragstart=e=>{const payload={pack:b.dataset.pack,id:b.dataset.id,size:TC_V08.ui.size||TC_V08.PACKS[b.dataset.pack].defaultSize};e.dataTransfer.setData('application/x-tirandor-asset',JSON.stringify(payload));e.dataTransfer.effectAllowed='copy'};
  });
  panel.querySelectorAll('.tc9-star').forEach(b=>b.onclick=e=>{e.stopPropagation();const f=TC_V08.favorites(),k=b.dataset.fav;f.has(k)?f.delete(k):f.add(k);TC_V08.saveFavorites(f);renderRightPanel(ed,map)});
  panel.querySelectorAll('canvas[data-tc9-preview]').forEach(c=>TC_V08.drawPreview(c,c.dataset.id,c.dataset.pack));
};
