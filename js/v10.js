// Tirandor Cartographer v0.10.1 — HD asset sheets without replacing legacy tools/assets
const TC_V10=(()=>{
  const PACKS={
    terrain_hd:{label:'HD · Ландшафты',sheet:'./assets/sheets/terrain_sheet.png',defaultSize:190,rows:[
      ['forest','dark_forest','jungle','plains','hills','mountains','snow_mountains'],
      ['volcano','canyon','cliffs','desert_dunes','oasis','swamp','marsh'],
      ['lake','river_source','waterfall','river_delta','coast','island','glacier'],
      ['tundra','badlands','crystal_field','mushroom_grove','geyser_field','dead_wasteland','enchanted_grove']
    ]},
    ruins_hd:{label:'HD · Руины и места',sheet:'./assets/sheets/ruins_sheet.png',defaultSize:180,rows:[
      ['ancient_ruins','excavation_site','abandoned_temple','ruined_tower','broken_bridge','barrow_mound','mausoleum'],
      ['crypt','catacomb_entrance','standing_stones','obelisk','stone_altar','ruined_shrine','ruined_monastery'],
      ['abandoned_fortress','watchtower_ruin','siege_camp','bandit_camp','battlefield_memorial_site','fallen_statue','wizard_tower'],
      ['ancient_portal','alchemists_laboratory','abandoned_mine','quarry','ruined_lighthouse','sunken_temple','village_ruins']
    ]},
    guilds_hd:{label:'HD · Гильдии',sheet:'./assets/sheets/guilds_sheet.png',defaultSize:145,rows:[
      ['blacksmiths_guild','miners_guild','inventors_guild','merchants_guild','bankers_guild','sailors_guild','cartographers_guild','scribes_guild','hunters_guild','trackers_guild'],
      ['mercenaries_guild','guards_guild','thieves_guild','assassins_guild','actors_guild','bards_guild','circus_guild','healers_guild','alchemists_guild','scholars_guild'],
      ['mages_guild','seers_guild','elementalists_guild','druids_guild','necromancers_guild','astralists_guild','portalkeepers_guild','enchanters_guild','tamers_guild','herbalists_guild'],
      ['farmers_guild','fishermen_guild','cooks_guild','brewers_guild','builders_guild','shipbuilders_guild','treasure_hunters_guild','translators_guild','diplomats_guild','mediators_guild']
    ]},
    buildings_hd:{label:'HD · Постройки',sheet:'./assets/sheets/buildings_sheet.png',defaultSize:165,rows:[
      ['castle','city_walls','keep','town_hall','courthouse','watchtower','barracks','prison','gatehouse','lighthouse'],
      ['cathedral','temple','chapel','monastery','shrine','library','academy','theater','arena','monument'],
      ['peasant_house','house','townhouse','merchant_house','noble_house','tenement','market','blacksmith','workshop','mill','granary','warehouse'],
      ['inn_tavern','roadhouse','caravanserai','stable','cart_shed','docks','farm','barn','windmill','fields','orchard','pasture'],
      ['mine','quarry','smelter','foundry','lumber_camp','oil_derrick','mausoleum','obelisk','fountain','town_square','bridge','ruins']
    ]},
    creatures_hd:{label:'HD · Существа',sheet:'./assets/sheets/creatures_sheet.png',defaultSize:170,rows:[
      ['dragon','griffon','wyvern','phoenix','unicorn','pegasus','manticore','chimera','hydra'],
      ['troll','ogre','giant','centaur','satyr','dire_wolf','giant_spider','basilisk','salamander','hell_hound'],
      ['zombie','skeleton_warrior','ghost','banshee','golem','gargoyle','forest_spirit','sea_serpent','kraken'],
      ['leviathan']
    ]},
    races_hd:{label:'HD · Расы',sheet:'./assets/sheets/races_sheet.png',defaultSize:150,rows:[
      ['human','dwarf','elf','halfling','gnome','orc','dragonborn','tiefling','goliath','aasimar'],
      ['high_elf','wood_elf','drow','mountain_dwarf','hill_dwarf','forest_gnome','rock_gnome','asmodeus_tiefling']
    ]},
    illustrations_hd:{label:'HD · Рисунки и объекты',sheet:'./assets/sheets/mixed_sheet.png',defaultSize:160,rows:[
      ['walled_city','hill_castle','port_city','cathedral_icon','village_windmill','ruins_large'],
      ['watchtower','stone_bridge','lighthouse_icon','mountains','volcano_icon','green_mountains','pine_forest'],
      ['crusader_ship','longship','double_serpent','whale','tuna','sea_serpent_icon'],
      ['red_dragon','griffin_icon','bear','wolf','boar','stag','horse','fox','hare','raven','owl'],
      ['knight','ranger','wizard','bishop','king','sun_deity','demon_lord','gargoyle_statue'],
      ['compass_rose','lion_banner','wolf_banner','crown','war_horn','sword','sun_shield','treasure_chest','hourglass','olive_branch','mushrooms','thistle']
    ]}
  };
  const ui={pack:'terrain_hd',selected:'forest',query:'',size:190};
  const images=new Map(), extracted=new Map();

  function items(packId){
    const p=PACKS[packId]; if(!p)return[];
    const out=[]; p.rows.forEach((row,r)=>row.forEach((id,c)=>out.push({pack:packId,id,row:r,col:c,cols:row.length,label:TC_V08?.label?.(id)||id.replaceAll('_',' ')})));
    return out;
  }
  function item(packId,id){return items(packId).find(x=>x.id===id)}
  function loadImage(src){
    if(images.has(src))return images.get(src);
    const pr=new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=src});
    images.set(src,pr);return pr;
  }
  function bgColor(data,w,h){
    const pts=[[3,3],[w-4,3],[3,h-4],[w-4,h-4],[w>>1,3],[w>>1,h-4]];
    let r=0,g=0,b=0;for(const[x,y]of pts){const i=(y*w+x)*4;r+=data[i];g+=data[i+1];b+=data[i+2]}return[r/pts.length,g/pts.length,b/pts.length]
  }
  function cleanBackground(canvas){
    const c=canvas.getContext('2d',{willReadFrequently:true}),w=canvas.width,h=canvas.height,im=c.getImageData(0,0,w,h),d=im.data,bg=bgColor(d,w,h);
    const seen=new Uint8Array(w*h),queue=new Int32Array(w*h),accept=(idx)=>{
      const i=idx*4,dr=d[i]-bg[0],dg=d[i+1]-bg[1],db=d[i+2]-bg[2];
      return Math.sqrt(dr*dr+dg*dg+db*db)<48;
    };
    let head=0,tail=0;const push=(x,y)=>{if(x<0||x>=w||y<0||y>=h)return;const k=y*w+x;if(seen[k]||!accept(k))return;seen[k]=1;queue[tail++]=k};
    for(let x=0;x<w;x++){push(x,0);push(x,h-1)}for(let y=1;y<h-1;y++){push(0,y);push(w-1,y)}
    while(head<tail){const k=queue[head++],x=k%w,y=(k/w)|0;push(x-1,y);push(x+1,y);push(x,y-1);push(x,y+1)}
    for(let k=0;k<seen.length;k++)if(seen[k])d[k*4+3]=0;
    c.putImageData(im,0,0);
    return trim(canvas,8)
  }
  function trim(src,pad){
    const c=src.getContext('2d',{willReadFrequently:true}),w=src.width,h=src.height,d=c.getImageData(0,0,w,h).data;
    let minX=w,minY=h,maxX=-1,maxY=-1;
    for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(d[(y*w+x)*4+3]>12){if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y}
    if(maxX<0)return src;minX=Math.max(0,minX-pad);minY=Math.max(0,minY-pad);maxX=Math.min(w-1,maxX+pad);maxY=Math.min(h-1,maxY+pad);
    const o=document.createElement('canvas');o.width=maxX-minX+1;o.height=maxY-minY+1;o.getContext('2d').drawImage(src,minX,minY,o.width,o.height,0,0,o.width,o.height);return o
  }
  async function extract(packId,id){
    const key=packId+':'+id;if(extracted.has(key))return extracted.get(key);
    const pr=(async()=>{
      const p=PACKS[packId],it=item(packId,id),im=await loadImage(p.sheet);
      const rowH=im.naturalHeight/p.rows.length,cellW=im.naturalWidth/it.cols;
      const mx=Math.max(4,cellW*.035),my=Math.max(4,rowH*.04);
      const sx=it.col*cellW+mx,sy=it.row*rowH+my,sw=cellW-mx*2,sh=rowH-my*2;
      const c=document.createElement('canvas');c.width=Math.max(1,Math.round(sw));c.height=Math.max(1,Math.round(sh));
      c.getContext('2d').drawImage(im,sx,sy,sw,sh,0,0,c.width,c.height);
      return cleanBackground(c)
    })();
    extracted.set(key,pr);return pr
  }
  function requestRender(){requestAnimationFrame(()=>state.editor?.render())}
  function draw(ctx,o,map){
    const size=o.size||PACKS[o.pack]?.defaultSize||160;
    const rec=extracted.get(o.pack+':'+o.assetId);
    if(rec)rec.then(img=>{o.aspect=img.width/img.height;requestRender()}).catch(()=>{});
    if(!o._hdCanvas){
      extract(o.pack,o.assetId).then(img=>{o._hdCanvas=img;o.aspect=img.width/img.height;requestRender()}).catch(()=>{});
    }
    ctx.save();ctx.globalAlpha=o.opacity??1;ctx.globalCompositeOperation=o.blend||'source-over';ctx.translate(o.x,o.y);ctx.rotate((o.rotation||0)*Math.PI/180);
    if(o._hdCanvas){const h=size/(o.aspect||1);ctx.drawImage(o._hdCanvas,-size/2,-h/2,size,h)}
    ctx.restore()
  }
  function preview(canvas,packId,id){
    canvas.width=112;canvas.height=88;const c=canvas.getContext('2d');c.clearRect(0,0,112,88);
    extract(packId,id).then(img=>{const s=Math.min(104/img.width,80/img.height),w=img.width*s,h=img.height*s;c.clearRect(0,0,112,88);c.drawImage(img,(112-w)/2,(88-h)/2,w,h)}).catch(()=>{})
  }
  function make(map,x,y,pack=ui.pack,id=ui.selected){const p=PACKS[pack];return{id:uid('obj'),type:'hdAsset',pack,assetId:id,x,y,size:ui.size||p.defaultSize,rotation:0,opacity:1,blend:'source-over',layerId:map.activeLayerId}}
  function place(ed,pack,id,x,y,size){
    const l=ed.map.layers.find(v=>v.id===ed.map.activeLayerId);if(l?.locked||!l?.visible)return toast('Активный слой скрыт или заблокирован');
    const o=make(ed.map,x,y,pack,id);o.size=size||PACKS[pack].defaultSize;ed.map.objects.push(o);ed.selectedId=o.id;ed.commit();renderRightPanel(ed,ed.map);return o
  }
  function wireDrop(ed){
    const c=ed.canvas;if(c.dataset.tc10Drop)return;c.dataset.tc10Drop='1';
    c.addEventListener('dragover',e=>{if(e.dataTransfer?.types?.includes('application/x-tirandor-hdasset')){e.preventDefault();e.dataTransfer.dropEffect='copy'}});
    c.addEventListener('drop',e=>{const raw=e.dataTransfer?.getData('application/x-tirandor-hdasset');if(!raw)return;e.preventDefault();try{const a=JSON.parse(raw),p=ed.snap(ed.world(e));place(ed,a.pack,a.id,p.x,p.y,a.size)}catch(err){console.error(err)}});
  }
  return{PACKS,ui,items,item,extract,draw,preview,make,place,wireDrop}
})();

TOOL_LABELS.hdasset=['▨','HD ассеты'];
TOOL_KINDS.hdasset=['world','region','city','dungeon','battle'];

const tc10Bounds=bounds;
bounds=function(o){
  if(o.type==='hdAsset'){const w=o.size||160,h=w/(o.aspect||1);return{x:o.x-w/2,y:o.y-h/2,w,h}}
  return tc10Bounds(o)
};

const tc10Render=renderObject;
renderObject=function(c,o,sel){
  const map=state.editor?.map;
  if(o.type==='hdAsset'&&map){TC_V10.draw(c,o,map);if(sel)drawSelection(c,o);return}
  tc10Render(c,o,sel)
};

const tc10Down=MapEditor.prototype.down;
MapEditor.prototype.down=function(e){
  if(this.tool==='hdasset'){
    const p=this.snap(this.world(e)),l=this.map.layers.find(x=>x.id===this.map.activeLayerId);if(l?.locked||!l?.visible)return toast('Активный слой скрыт или заблокирован');
    const o=TC_V10.make(this.map,p.x,p.y);this.map.objects.push(o);this.selectedId=o.id;this.commit();renderRightPanel(this,this.map);return
  }
  tc10Down.call(this,e)
};

const tc10Move=MapEditor.prototype.move;
MapEditor.prototype.move=function(e){
  const o=this.selected();
  if(this.mode==='resize'&&o?.type==='hdAsset'&&this.start){const q=this.world(e),b=this.start.base;o.size=Math.max(36,(b.size||160)+Math.max(q.x-this.start.x,q.y-this.start.y));this.render();return}
  tc10Move.call(this,e)
};

const tc10Right=renderRightPanel;
renderRightPanel=function(ed,map){
  tc10Right(ed,map);const rp=$('#rightPanel');if(!rp)return;TC_V10.wireDrop(ed);
  const p=TC_V10.PACKS[TC_V10.ui.pack],q=(TC_V10.ui.query||'').toLowerCase(),list=TC_V10.items(TC_V10.ui.pack).filter(x=>(x.id+' '+x.label).toLowerCase().includes(q));
  const panel=document.createElement('section');panel.className='panel tc10-hd';
  panel.innerHTML='<span class="eyebrow">Improved source sheets</span><h3>HD ассеты · '+list.length+'</h3><div class="tc10-row"><select id="tc10Pack">'+Object.entries(TC_V10.PACKS).map(([id,v])=>'<option value="'+id+'" '+(TC_V10.ui.pack===id?'selected':'')+'>'+v.label+'</option>').join('')+'</select><input id="tc10Search" placeholder="Поиск…" value="'+esc(TC_V10.ui.query||'')+'"></div><label class="field">Размер размещения<input id="tc10Size" type="number" min="40" max="800" value="'+TC_V10.ui.size+'"></label><div class="tc10-grid">'+list.map(a=>'<button draggable="true" class="tc10-card '+(TC_V10.ui.selected===a.id?'active':'')+'" data-id="'+a.id+'"><canvas data-tc10-preview="'+a.id+'"></canvas><span>'+a.label+'</span></button>').join('')+'</div><p class="muted">Это новый улучшенный набор. Старая библиотека из 302 растровых ассетов, исторические фрагменты, SVG и все инструменты ниже сохранены без замены.</p>';
  const anchor=rp.querySelector('.tc9-library')||rp.querySelector('.tc7-pack')||rp.children[1]||rp.firstChild;rp.insertBefore(panel,anchor);
  $('#tc10Pack').onchange=e=>{TC_V10.ui.pack=e.target.value;const np=TC_V10.PACKS[TC_V10.ui.pack];TC_V10.ui.selected=np.rows[0][0];TC_V10.ui.size=np.defaultSize;renderRightPanel(ed,map)};
  $('#tc10Search').oninput=e=>{TC_V10.ui.query=e.target.value;renderRightPanel(ed,map)};
  $('#tc10Size').onchange=e=>TC_V10.ui.size=clamp(+e.target.value||p.defaultSize,40,800);
  panel.querySelectorAll('.tc10-card').forEach(b=>{
    b.onclick=()=>{TC_V10.ui.selected=b.dataset.id;ed.setTool('hdasset');$$('.tool').forEach(t=>t.classList.toggle('active',t.dataset.tool==='hdasset'));panel.querySelectorAll('.tc10-card').forEach(x=>x.classList.remove('active'));b.classList.add('active')};
    b.ondragstart=e=>{e.dataTransfer.setData('application/x-tirandor-hdasset',JSON.stringify({pack:TC_V10.ui.pack,id:b.dataset.id,size:TC_V10.ui.size}));e.dataTransfer.effectAllowed='copy'};
  });
  panel.querySelectorAll('canvas[data-tc10-preview]').forEach(c=>TC_V10.preview(c,TC_V10.ui.pack,c.dataset.tc10Preview));

  const o=ed.selected?.();
  if(o?.type==='hdAsset'){
    const ins=document.createElement('section');ins.className='panel tc10-inspector';ins.innerHTML='<span class="eyebrow">HD asset inspector</span><h3>'+((TC_V08?.label?.(o.assetId))||o.assetId)+'</h3><div class="field-grid two"><label>Размер<input id="tc10ObjSize" type="number" min="36" max="1000" value="'+Math.round(o.size||160)+'"></label><label>Поворот<input id="tc10ObjRot" type="number" min="-180" max="180" value="'+Math.round(o.rotation||0)+'"></label></div><div class="field-grid two"><label>Прозрачность<input id="tc10ObjOp" type="number" min="0.1" max="1" step="0.05" value="'+(o.opacity??1)+'"></label><label>Смешивание<select id="tc10Blend"><option value="source-over">Normal</option><option value="multiply">Multiply</option><option value="darken">Darken</option></select></label></div>';
    rp.insertBefore(ins,panel.nextSibling);$('#tc10Blend').value=o.blend||'source-over';
    $('#tc10ObjSize').onchange=e=>{o.size=clamp(+e.target.value||160,36,1000);ed.commit();renderRightPanel(ed,map)};
    $('#tc10ObjRot').onchange=e=>{o.rotation=clamp(+e.target.value||0,-180,180);ed.commit()};
    $('#tc10ObjOp').onchange=e=>{o.opacity=clamp(+e.target.value||1,.1,1);ed.commit()};
    $('#tc10Blend').onchange=e=>{o.blend=e.target.value;ed.commit()}
  }
};
