// Tirandor Cartographer v0.7 — sourced art packs, historical fragments and bundled map fonts
const TC_V07=(()=>{
  const ui={pack:'historic',asset:'hist-compass',size:190};
  const fonts=[
    ['Old Standard TT','Old Standard TT'],['Cormorant SC','Cormorant SC'],['Georgia','Georgia'],['serif','System Serif']
  ];
  const local=[
    ['open-gargoyle','Горгулья — Delapouite','assets/open-icons/gargoyle.svg'],
    ['open-unicorn','Единорог — Delapouite','assets/open-icons/unicorn.svg'],
    ['open-sea-dragon','Морской дракон — Lorc','assets/open-icons/sea-dragon.svg'],
    ['open-sea-serpent','Морской змей — Lorc','assets/open-icons/sea-serpent.svg'],
    ['open-dragon-head','Голова дракона — Lorc','assets/open-icons/dragon-head.svg'],
    ['open-griffin','Грифон — Delapouite','assets/open-icons/griffin.svg'],
    ['open-camel','Верблюд — Delapouite','assets/open-icons/camel.svg'],
    ['open-elephant','Слон — Delapouite','assets/open-icons/elephant.svg'],
    ['open-sailboat','Парусник — Delapouite','assets/open-icons/sailboat.svg'],
    ['open-castle','Замок — Delapouite','assets/open-icons/castle.svg'],
    ['open-watchtower','Дозорная башня — Delapouite','assets/open-icons/watchtower.svg'],
    ['open-windmill','Мельница — Delapouite','assets/open-icons/windmill.svg'],
    ['open-compass','Компас — Lorc','assets/open-icons/compass.svg'],
    ['open-horseback','Всадник — Caro Asercion','assets/open-icons/horseback.svg'],
    ['open-kraken','Щупальце кракена — Delapouite','assets/open-icons/kraken.svg'],
    ['open-ship-bow','Нос корабля — Delapouite','assets/open-icons/ship-bow.svg'],
    ['open-tower-flag','Башня с флагом — Delapouite','assets/open-icons/tower-flag.svg'],
    ['open-evil-tower','Мрачная башня — Delapouite','assets/open-icons/evil-tower.svg'],
    ['open-stone-tower','Каменная башня — Lorc','assets/open-icons/stone-tower.svg'],
    ['open-horse-head','Лошадь — Delapouite','assets/open-icons/horse-head.svg']
  ].map(x=>({id:x[0],label:x[1],src:x[2],kind:'local',aspect:1,license:'CC BY 3.0',sourcePage:'https://game-icons.net/',credit:x[1].split(' — ')[1]||'Game-icons.net'}));

  const historical=[
    {
      id:'hist-compass',label:'Роза ветров — Catalan Atlas, 1375',kind:'historic',aspect:570/618,
      src:'https://upload.wikimedia.org/wikipedia/commons/d/d2/Compass_rose_from_Catalan_Atlas_%281375%29.jpg',
      sourcePage:'https://commons.wikimedia.org/wiki/File:Compass_rose_from_Catalan_Atlas_(1375).jpg',license:'Public domain',credit:'Abraham Cresques / Catalan Atlas'
    },
    {
      id:'hist-mamluk-ruler',label:'Правитель Мамлюкского султаната — 1375',kind:'historic',aspect:619/777,
      src:'https://upload.wikimedia.org/wikipedia/commons/5/5e/Mamluk_Sultanate_in_the_Catalan_Atlas_%281375%29%2C_ruler_and_flags.jpg',
      sourcePage:'https://commons.wikimedia.org/wiki/File:Mamluk_Sultanate_in_the_Catalan_Atlas_(1375),_ruler_and_flags.jpg',license:'Public domain',credit:'Abraham Cresques / Catalan Atlas'
    },
    {
      id:'hist-kublai',label:'Хубилай-хан — Catalan Atlas, 1375',kind:'historic',aspect:990/1594,
      src:'https://upload.wikimedia.org/wikipedia/commons/e/e9/Kublai_Khan_in_the_Catalan_Atlas_%281375%29.jpg',
      sourcePage:'https://commons.wikimedia.org/wiki/File:Kublai_Khan_in_the_Catalan_Atlas_(1375).jpg',license:'Public domain',credit:'Abraham Cresques / Catalan Atlas'
    },
    {
      id:'hist-delhi',label:'Город Дели — Catalan Atlas, 1375',kind:'historic',aspect:1424/1389,
      src:'https://upload.wikimedia.org/wikipedia/commons/2/22/City_of_Delhi_in_the_Catalan_Atlas_%281375%29.jpg',
      sourcePage:'https://commons.wikimedia.org/wiki/File:City_of_Delhi_in_the_Catalan_Atlas_(1375).jpg',license:'Public domain',credit:'Catalan Atlas, 1375'
    },
    {
      id:'hist-ship',label:'Корабль в Индийском океане — 1375',kind:'historic',aspect:3663/2300,
      src:'https://upload.wikimedia.org/wikipedia/commons/3/31/Ilkhante_ship_sailing_the_Indian_Ocean_towards_India%2C_in_the_Catalan_Atlas_%281375%29.jpg',
      sourcePage:'https://commons.wikimedia.org/wiki/File:Ilkhante_ship_sailing_the_Indian_Ocean_towards_India,_in_the_Catalan_Atlas_(1375).jpg',license:'Public domain',credit:'Abraham Cresques / Catalan Atlas'
    },
    {
      id:'hist-dragon-a',label:'Дракон Псалтирной карты I — ок. 1265',kind:'historic',aspect:1.9,
      src:'https://upload.wikimedia.org/wikipedia/commons/0/09/Psalter_World_Map%2C_c.1265_dragons.jpg',crop:[0,0,.34,1],
      sourcePage:'https://commons.wikimedia.org/wiki/File:Psalter_World_Map,_c.1265_dragons.jpg',license:'Public domain',credit:'Psalter World Map, c.1265'
    },
    {
      id:'hist-dragon-b',label:'Дракон Псалтирной карты II — ок. 1265',kind:'historic',aspect:1.9,
      src:'https://upload.wikimedia.org/wikipedia/commons/0/09/Psalter_World_Map%2C_c.1265_dragons.jpg',crop:[.33,0,.34,1],
      sourcePage:'https://commons.wikimedia.org/wiki/File:Psalter_World_Map,_c.1265_dragons.jpg',license:'Public domain',credit:'Psalter World Map, c.1265'
    },
    {
      id:'hist-dragon-c',label:'Дракон Псалтирной карты III — ок. 1265',kind:'historic',aspect:1.9,
      src:'https://upload.wikimedia.org/wikipedia/commons/0/09/Psalter_World_Map%2C_c.1265_dragons.jpg',crop:[.66,0,.34,1],
      sourcePage:'https://commons.wikimedia.org/wiki/File:Psalter_World_Map,_c.1265_dragons.jpg',license:'Public domain',credit:'Psalter World Map, c.1265'
    }
  ];
  const assets=[...historical,...local];
  const def=id=>assets.find(a=>a.id===id)||assets[0];
  const list=()=>ui.pack==='historic'?historical:local;
  const cache=new Map();

  function ensure(target){
    if(!target)return target;
    const settings=target.settings||target;
    settings.labelFont||='Old Standard TT';
    settings.titleFont||='Cormorant SC';
    return target;
  }
  function getImage(src){
    let rec=cache.get(src);if(rec)return rec;
    const img=new Image();rec={img,state:'loading'};cache.set(src,rec);
    if(/^https?:/.test(src))img.crossOrigin='anonymous';
    img.onload=()=>{rec.state='loaded';state.editor?.render()};
    img.onerror=()=>{rec.state='error';state.editor?.render()};
    img.src=src;return rec;
  }
  function objectHeight(o){
    const a=def(o.assetId),asp=o.aspect||a.aspect||1;return (o.size||180)/asp;
  }
  function draw(c,o,map){
    const a=def(o.assetId),rec=getImage(a.src),w=o.size||180,h=objectHeight(o);
    c.save();c.globalAlpha=o.opacity??1;c.translate(o.x,o.y);c.rotate((o.rotation||0)*Math.PI/180);
    if(a.kind==='historic'){
      c.globalCompositeOperation=o.blend||'multiply';
      c.filter='contrast(1.05) saturate(1.08)';
    }
    if(rec.state==='loaded'){
      if(a.crop){
        const [cx,cy,cw,ch]=a.crop,im=rec.img,sx=im.naturalWidth*cx,sy=im.naturalHeight*cy,sw=im.naturalWidth*cw,sh=im.naturalHeight*ch;
        c.drawImage(im,sx,sy,sw,sh,-w/2,-h/2,w,h);
      }else c.drawImage(rec.img,-w/2,-h/2,w,h);
    }else{
      c.fillStyle='rgba(84,63,42,.10)';c.strokeStyle='rgba(84,63,42,.35)';c.fillRect(-w/2,-h/2,w,h);c.strokeRect(-w/2,-h/2,w,h);
      c.fillStyle=map.settings.ink||'#3a2b1f';c.font='12px "Old Standard TT",serif';c.textAlign='center';c.fillText(rec.state==='error'?'Источник недоступен':'Загрузка…',0,0);
    }
    c.restore()
  }
  function drawText(c,o,map){
    const family=o.fontFamily||map.settings.labelFont||'Old Standard TT';
    c.save();c.fillStyle=o.color||map.settings.labelColor||'#2d261f';c.font='600 '+(o.size||28)+'px "'+family+'", Georgia, serif';c.textBaseline='top';c.fillText(o.text||'Подпись',o.x,o.y);c.restore()
  }
  function drawDecorText(c,o,map){
    const style=o.decorStyle||'plain',size=o.size||28,spacing=o.letterSpacing??(style==='portolan'?1.5:style==='royal'?2.5:.5);
    let text=o.text||'Подпись';if(style==='monastic'||style==='royal')text=text.toUpperCase();
    const family=o.fontFamily||(style==='royal'||style==='monastic'?map.settings.titleFont:map.settings.labelFont)||'Old Standard TT';
    c.save();c.globalAlpha=style==='faded'?.68:1;c.fillStyle=o.color||map.settings.labelColor||'#2d261f';
    c.font=(style==='portolan'?'italic ':'')+(style==='royal'?'600':'400')+' '+size+'px "'+family+'", Georgia, serif';c.textBaseline='top';
    let x=o.x;if(style==='royal'){c.shadowColor='rgba(139,79,63,.22)';c.shadowBlur=1;c.shadowOffsetY=1}
    for(const ch of text){c.fillText(ch,x,o.y);x+=c.measureText(ch).width+spacing}c.restore()
  }
  function make(map,x,y){const a=def(ui.asset);return{id:uid('obj'),type:'artAsset',assetId:a.id,x,y,size:ui.size,rotation:0,opacity:1,blend:a.kind==='historic'?'multiply':'source-over',aspect:a.aspect||1,layerId:map.activeLayerId}}
  return{ui,fonts,local,historical,assets,def,list,ensure,getImage,objectHeight,draw,drawText,drawDecorText,make}
})();

TOOL_LABELS.assetpack=['▧','Ассеты'];
TOOL_KINDS.assetpack=['world','region','city'];

const tc7Settings=defaultSettings;
defaultSettings=function(kind){return TC_V07.ensure(tc7Settings(kind))};

const tc7Bounds=bounds;
bounds=function(o){
  if(o.type==='artAsset'){const w=o.size||180,h=TC_V07.objectHeight(o);return{x:o.x-w/2,y:o.y-h/2,w,h}}
  return tc7Bounds(o)
};

const tc7Decor=TC_V06.drawDecorText;
TC_V06.drawDecorText=function(c,o,map){TC_V07.drawDecorText(c,o,map)};

const tc7Render=renderObject;
renderObject=function(c,o,sel){
  const map=state.editor?.map;
  if(o.type==='artAsset'&&map){TC_V07.draw(c,o,map);if(sel)drawSelection(c,o);return}
  if(o.type==='text'&&!o.decorStyle&&map){TC_V07.drawText(c,o,map);if(sel)drawSelection(c,o);return}
  tc7Render(c,o,sel)
};

const tc7Down=MapEditor.prototype.down;
MapEditor.prototype.down=function(e){
  if(this.tool==='assetpack'){
    const p=this.snap(this.world(e)),l=this.map.layers.find(x=>x.id===this.map.activeLayerId);if(l?.locked||!l?.visible)return toast('Активный слой скрыт или заблокирован');
    const o=TC_V07.make(this.map,p.x,p.y);this.map.objects.push(o);this.selectedId=o.id;this.commit();renderRightPanel(this,this.map);return
  }
  tc7Down.call(this,e)
};

const tc7Move=MapEditor.prototype.move;
MapEditor.prototype.move=function(e){
  const o=this.selected();
  if(this.mode==='resize'&&o?.type==='artAsset'&&this.start){const q=this.world(e),b=this.start.base;o.size=Math.max(42,(b.size||180)+Math.max(q.x-this.start.x,q.y-this.start.y));this.render();return}
  tc7Move.call(this,e)
};

const tc7Editor=renderEditor;
renderEditor=async function(id){
  const m=await idbGet('maps',id);if(m){TC_V07.ensure(m);await idbPut('maps',m)}
  await tc7Editor(id);
  document.fonts?.ready.then(()=>state.editor?.render())
};

const tc7Right=renderRightPanel;
renderRightPanel=function(ed,map){
  TC_V07.ensure(map);tc7Right(ed,map);const rp=$('#rightPanel');if(!rp)return;

  const fontPanel=document.createElement('section');fontPanel.className='panel tc7-fonts';
  fontPanel.innerHTML='<span class="eyebrow">Typography</span><h3>Шрифты карты</h3><div class="field-grid two"><label>Подписи<select id="tc7LabelFont">'+TC_V07.fonts.map(x=>'<option value="'+x[0]+'" '+(map.settings.labelFont===x[0]?'selected':'')+'>'+x[1]+'</option>').join('')+'</select></label><label>Заголовки<select id="tc7TitleFont">'+TC_V07.fonts.map(x=>'<option value="'+x[0]+'" '+(map.settings.titleFont===x[0]?'selected':'')+'>'+x[1]+'</option>').join('')+'</select></label></div><p class="muted">Old Standard TT и Cormorant SC встроены локально и поддерживают кириллицу.</p>';
  const anchor=rp.querySelector('.tc6-compose')||rp.children[1]||rp.firstChild;rp.insertBefore(fontPanel,anchor);
  $('#tc7LabelFont').onchange=e=>{map.settings.labelFont=e.target.value;ed.scheduleSave();ed.render();renderRightPanel(ed,map)};
  $('#tc7TitleFont').onchange=e=>{map.settings.titleFont=e.target.value;ed.scheduleSave();ed.render();renderRightPanel(ed,map)};

  const pack=document.createElement('section');pack.className='panel tc7-pack';
  const shown=TC_V07.list();
  pack.innerHTML='<span class="eyebrow">Sourced asset library</span><h3>Архивные и свободные ассеты</h3><div class="segmented"><button class="tc7-pack-tab '+(TC_V07.ui.pack==='historic'?'active':'')+'" data-p="historic">Исторические</button><button class="tc7-pack-tab '+(TC_V07.ui.pack==='open'?'active':'')+'" data-p="open">Open SVG</button></div><label class="field">Размер при размещении<input id="tc7AssetSize" type="number" min="48" max="520" value="'+TC_V07.ui.size+'"></label><div class="tc7-grid">'+shown.map(a=>'<button class="tc7-card '+(TC_V07.ui.asset===a.id?'active':'')+'" data-a="'+a.id+'"><img loading="lazy" crossorigin="anonymous" src="'+a.src+'" style="'+(a.crop?'object-fit:cover;object-position:'+(a.id.endsWith('-a')?'0%':a.id.endsWith('-b')?'50%':'100%')+' 50%;':'')+'"><span>'+a.label+'</span><small>'+a.license+'</small></button>').join('')+'</div><p class="muted">'+(TC_V07.ui.pack==='historic'?'Фрагменты подлинных карт XIII–XIV веков. Public domain; на карте по умолчанию смешиваются с пергаментом через Multiply.':'Детализированные SVG из Game-icons.net, лицензия CC BY 3.0. В репозиторий включены локально.')+'</p>';
  rp.insertBefore(pack,fontPanel.nextSibling);
  pack.querySelectorAll('.tc7-pack-tab').forEach(b=>b.onclick=()=>{TC_V07.ui.pack=b.dataset.p;TC_V07.ui.asset=TC_V07.list()[0]?.id||TC_V07.ui.asset;renderRightPanel(ed,map)});
  $('#tc7AssetSize').onchange=e=>TC_V07.ui.size=clamp(+e.target.value||190,48,520);
  pack.querySelectorAll('.tc7-card').forEach(b=>b.onclick=()=>{TC_V07.ui.asset=b.dataset.a;ed.setTool('assetpack');$$('.tool').forEach(t=>t.classList.toggle('active',t.dataset.tool==='assetpack'));renderRightPanel(ed,map)});

  const o=ed.selected?.();
  if(o?.type==='artAsset'){
    const a=TC_V07.def(o.assetId),ins=document.createElement('section');ins.className='panel tc7-inspector';
    ins.innerHTML='<span class="eyebrow">Asset inspector</span><h3>'+a.label+'</h3><div class="field-grid two"><label>Размер<input id="tc7ObjSize" type="number" min="42" max="800" value="'+Math.round(o.size||180)+'"></label><label>Поворот<input id="tc7ObjRot" type="number" min="-180" max="180" value="'+Math.round(o.rotation||0)+'"></label></div><div class="field-grid two"><label>Прозрачность<input id="tc7ObjOp" type="number" min="0.1" max="1" step="0.05" value="'+(o.opacity??1)+'"></label><label>Смешивание<select id="tc7Blend"><option value="source-over">Normal</option><option value="multiply">Multiply</option><option value="darken">Darken</option></select></label></div><div class="tc7-source"><strong>'+a.license+'</strong><span>'+a.credit+'</span><a href="'+a.sourcePage+'" target="_blank" rel="noopener">Источник ↗</a></div>';
    rp.insertBefore(ins,pack.nextSibling);$('#tc7Blend').value=o.blend||'source-over';
    $('#tc7ObjSize').onchange=e=>{o.size=clamp(+e.target.value||180,42,800);ed.commit();renderRightPanel(ed,map)};
    $('#tc7ObjRot').onchange=e=>{o.rotation=clamp(+e.target.value||0,-180,180);ed.commit()};
    $('#tc7ObjOp').onchange=e=>{o.opacity=clamp(+e.target.value||1,.1,1);ed.commit()};
    $('#tc7Blend').onchange=e=>{o.blend=e.target.value;ed.commit()}
  }
  if(o?.type==='text'){
    const textPanel=document.createElement('section');textPanel.className='panel tc7-text-font';
    const current=o.fontFamily||(o.decorStyle==='royal'||o.decorStyle==='monastic'?map.settings.titleFont:map.settings.labelFont);
    textPanel.innerHTML='<span class="eyebrow">Font</span><h3>Шрифт объекта</h3><label class="field">Гарнитура<select id="tc7ObjFont">'+TC_V07.fonts.map(x=>'<option value="'+x[0]+'" '+(current===x[0]?'selected':'')+'>'+x[1]+'</option>').join('')+'</select></label>';
    rp.insertBefore(textPanel,fontPanel.nextSibling);$('#tc7ObjFont').onchange=e=>{o.fontFamily=e.target.value;ed.commit();renderRightPanel(ed,map)}
  }
};
