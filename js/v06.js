// Tirandor Cartographer v0.6 — composition, heraldry and illustrated terrain
const TC_V06=(()=>{
  const ui={heraldrySize:120,terrainSize:150};
  const charges=[
    ['lion','Лев'],['fleur','Лилия'],['cross','Крест'],['tower','Башня'],['star','Звезда'],
    ['dragon','Голова дракона'],['eagle','Орёл'],['crown','Корона']
  ];
  const divisions=[
    ['plain','Одно поле'],['pale','Рассечение'],['fess','Пересечение'],['quarterly','Четверочастный'],
    ['bend','Перевязь'],['cross','Крест'],['chevron','Шеврон']
  ];
  const frames=[
    ['simple','Чернильная рамка'],['double','Двойная рамка'],['rope','Верёвочная рамка'],['illuminated','Иллюминированная рамка']
  ];
  const textStyles=[
    ['plain','Обычная'],['monastic','Monastic'],['portolan','Portolan'],['royal','Royal'],['faded','Faded manuscript']
  ];

  const more=[
    ['bakery','Пекарня','economy','♨'],['brewery','Пивоварня','economy','⚗'],['butcher','Мясная лавка','economy','✣'],
    ['tannery','Кожевня','economy','◇'],['weaver','Ткацкая мастерская','economy','#'],['potter','Гончар','economy','◡'],
    ['market-cross','Рыночный крест','urban','✝'],['hospital','Госпиталь','sacred','✚'],['school','Школа / скрипторий','urban','✎'],
    ['court','Суд','urban','⚖'],['prison','Тюрьма','urban','▥'],['arsenal','Арсенал','urban','⚔'],
    ['stables','Конюшни','urban','♞'],['town-hall','Ратуша','urban','▣'],['bell-tower','Колокольня','sacred','♜'],
    ['fishpond','Рыбный пруд','rural','≈'],['sheepfold','Овчарня','rural','♧'],['woodcutter','Лесорубы','rural','♣'],
    ['charcoal','Угольщики','rural','♨'],['water-gate','Водяные ворота','infrastructure','≋'],['toll-bridge','Платный мост','infrastructure','⋒'],
    ['watchpost','Дозорный пост','infrastructure','⚑'],['waystone','Путевой камень','infrastructure','▴'],['ferry-landing','Паромная пристань','infrastructure','╞']
  ];
  more.forEach(x=>{if(!TC_V02.S.some(s=>s.id===x[0]))TC_V02.S.push({id:x[0],label:x[1],group:x[2],icon:x[3]})});

  if(!TC_V05.GROUPS.some(g=>g[0]==='terrain'))TC_V05.GROUPS.splice(6,0,['terrain','Рисованный рельеф']);
  const illustrated=[
    ['mountain-ridge','Горная цепь','terrain'],['mountain-cluster','Горный массив','terrain'],['forest-cluster','Лесная роща','terrain'],
    ['cypress-grove','Кипарисовая роща','terrain'],['marsh-tufts','Болотные кочки','terrain'],['dunes','Дюны','terrain'],
    ['rocky-coast','Скалистый берег','terrain'],['cultivated-fields','Поля и полосы','terrain'],['orchard-art','Сады','terrain'],
    ['walled-city-b','Город-виньетка II','city'],['port-city-b','Порт-виньетка II','city'],['hill-fortress','Крепость на холме','city'],
    ['lateen-ship','Латинский парус','ship'],['pilgrim-ship','Паломнический корабль','ship'],
    ['kraken','Кракен','beast'],['sea-monster-b','Морское чудовище II','beast'],['merchant-prince','Князь-купец','people'],['bishop','Епископ','people']
  ];
  illustrated.forEach(x=>{if(!TC_V05.A.some(a=>a.id===x[0]))TC_V05.A.push({id:x[0],label:x[1],group:x[2]})});

  function pal(id){return TC_V05.pal(id)}
  function line(c,x1,y1,x2,y2){c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke()}
  function poly(c,pts,fill=false){c.beginPath();pts.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.closePath();fill?c.fill():c.stroke()}
  function circ(c,x,y,r,fill=false){c.beginPath();c.arc(x,y,r,0,Math.PI*2);fill?c.fill():c.stroke()}

  function drawTerrain(c,o){
    const p=pal(o.palette),S=(o.size||150)/2,id=o.asset;
    c.save();c.globalAlpha=o.opacity??1;c.translate(o.x,o.y);c.rotate((o.rotation||0)*Math.PI/180);c.strokeStyle=p.ink;c.fillStyle=p.green;c.lineWidth=Math.max(1.2,S*.02);c.lineCap='round';c.lineJoin='round';
    if(id==='mountain-ridge'||id==='mountain-cluster'){
      const peaks=id==='mountain-ridge'?[-.48,-.25,0,.23,.46]:[-.38,-.12,.18,.4];
      peaks.forEach((x,i)=>{const h=S*(.3+(i%2)*.16),w=S*(id==='mountain-ridge'?.3:.38);c.fillStyle=i%2?p.paper:'#d5c59c';poly(c,[[S*x-w/2,S*.28],[S*x,-h],[S*x+w/2,S*.28]],true);c.strokeStyle=p.ink;poly(c,[[S*x-w/2,S*.28],[S*x,-h],[S*x+w/2,S*.28]]);line(c,S*x,-h,S*(x-.07),-h+S*.13);line(c,S*x,-h,S*(x+.08),-h+S*.14)})
    }else if(id==='forest-cluster'||id==='cypress-grove'||id==='orchard-art'){
      const pts=[[-.34,-.05],[-.14,-.2],[.06,-.08],[.28,-.18],[-.25,.18],[0,.2],[.27,.16]];
      pts.forEach((q,i)=>{c.fillStyle=i%2?p.green:'#71825e';if(id==='cypress-grove'){c.beginPath();c.moveTo(S*q[0],S*(q[1]-.25));c.quadraticCurveTo(S*(q[0]-.09),S*q[1],S*q[0],S*(q[1]+.15));c.quadraticCurveTo(S*(q[0]+.09),S*q[1],S*q[0],S*(q[1]-.25));c.fill();c.stroke()}else{circ(c,S*q[0],S*q[1],S*(id==='orchard-art'?.085:.12),true);c.strokeStyle=p.ink;circ(c,S*q[0],S*q[1],S*(id==='orchard-art'?.085:.12));line(c,S*q[0],S*(q[1]+.08),S*q[0],S*(q[1]+.2))}})
    }else if(id==='marsh-tufts'){
      c.strokeStyle=p.green;for(let y=-.22;y<=.28;y+=.22)for(let x=-.4;x<=.4;x+=.2){line(c,S*x,S*y,S*(x+.13),S*y);line(c,S*(x+.05),S*y,S*(x+.02),S*(y-.12));line(c,S*(x+.08),S*y,S*(x+.12),S*(y-.14))}
    }else if(id==='dunes'){
      c.strokeStyle=p.gold;for(let y=-.28;y<=.3;y+=.18){c.beginPath();c.moveTo(-S*.45,S*y);c.bezierCurveTo(-S*.2,S*(y-.15),S*.05,S*(y+.08),S*.28,S*(y-.06));c.bezierCurveTo(S*.38,S*(y-.12),S*.44,S*(y-.08),S*.5,S*y);c.stroke()}
    }else if(id==='rocky-coast'){
      c.strokeStyle=p.ink;c.beginPath();c.moveTo(-S*.5,-S*.28);c.bezierCurveTo(-S*.28,-S*.35,-S*.22,-S*.05,-S*.02,-S*.1);c.bezierCurveTo(S*.18,-S*.16,S*.18,S*.18,S*.45,S*.22);c.stroke();for(let i=0;i<6;i++){let x=-.38+i*.15;poly(c,[[S*x,S*.26],[S*(x+.06),S*.08],[S*(x+.12),S*.28]])}
      c.strokeStyle=p.blue;for(let i=0;i<3;i++){c.beginPath();c.moveTo(-S*.48,S*(.34+i*.06));c.quadraticCurveTo(0,S*(.28+i*.06),S*.5,S*(.34+i*.06));c.stroke()}
    }else if(id==='cultivated-fields'){
      c.strokeStyle=p.gold;for(let x=-.5;x<.55;x+=.12)line(c,S*x,-S*.36,S*(x+.28),S*.36);c.strokeStyle=p.green;for(let x=-.42;x<.48;x+=.18)line(c,S*x,-S*.34,S*(x+.28),S*.34)
    }
    c.restore()
  }

  function shieldPath(c,S){c.beginPath();c.moveTo(-S*.34,-S*.42);c.quadraticCurveTo(0,-S*.32,S*.34,-S*.42);c.lineTo(S*.3,S*.04);c.quadraticCurveTo(S*.2,S*.34,0,S*.5);c.quadraticCurveTo(-S*.2,S*.34,-S*.3,S*.04);c.closePath()}
  function drawCharge(c,S,h){
    c.save();c.strokeStyle=h.chargeColor;c.fillStyle=h.chargeColor;c.lineWidth=Math.max(2,S*.035);
    if(h.charge==='cross'){line(c,0,-S*.25,0,S*.28);line(c,-S*.22,0,S*.22,0)}
    else if(h.charge==='star'){poly(c,Array.from({length:10},(_,i)=>{let a=-Math.PI/2+i*Math.PI/5,r=i%2?S*.12:S*.3;return[Math.cos(a)*r,Math.sin(a)*r]}),true)}
    else if(h.charge==='tower'){c.fillRect(-S*.13,-S*.18,S*.26,S*.38);c.fillRect(-S*.18,-S*.24,S*.08,S*.1);c.fillRect(S*.1,-S*.24,S*.08,S*.1)}
    else if(h.charge==='fleur'){c.font=Math.round(S*.55)+'px Georgia';c.textAlign='center';c.textBaseline='middle';c.fillText('⚜',0,0)}
    else if(h.charge==='eagle'){c.font=Math.round(S*.48)+'px Georgia';c.textAlign='center';c.textBaseline='middle';c.fillText('✠',0,0)}
    else if(h.charge==='crown'){c.font=Math.round(S*.52)+'px Georgia';c.textAlign='center';c.textBaseline='middle';c.fillText('♛',0,0)}
    else if(h.charge==='dragon'){c.beginPath();c.moveTo(-S*.18,S*.15);c.bezierCurveTo(-S*.25,-S*.18,S*.05,-S*.28,S*.2,-S*.08);c.bezierCurveTo(S*.3,S*.05,S*.15,S*.2,-S*.02,S*.12);c.stroke();circ(c,S*.21,-S*.08,S*.06,true)}
    else{c.beginPath();c.moveTo(-S*.1,S*.22);c.bezierCurveTo(-S*.25,S*.02,-S*.15,-S*.22,S*.02,-S*.12);c.bezierCurveTo(S*.2,-S*.02,S*.1,S*.17,S*.25,S*.25);c.stroke()}
    c.restore()
  }
  function drawHeraldry(c,o,map){
    const S=(o.size||120)/2,h=o.heraldry||{},ink=h.ink||map.settings.ink||'#35261c',f1=h.field1||'#a64532',f2=h.field2||'#315f82';
    c.save();c.globalAlpha=o.opacity??1;c.translate(o.x,o.y);c.rotate((o.rotation||0)*Math.PI/180);c.strokeStyle=ink;c.lineWidth=Math.max(1.5,S*.025);
    shieldPath(c,S);c.fillStyle=f1;c.fill();c.save();shieldPath(c,S);c.clip();
    if(h.division==='pale'){c.fillStyle=f2;c.fillRect(0,-S*.55,S*.5,S*1.1)}
    else if(h.division==='fess'){c.fillStyle=f2;c.fillRect(-S*.5,0,S,S*.55)}
    else if(h.division==='quarterly'){c.fillStyle=f2;c.fillRect(0,-S*.55,S*.5,S*.55);c.fillRect(-S*.5,0,S*.5,S*.55)}
    else if(h.division==='bend'){c.strokeStyle=f2;c.lineWidth=S*.26;line(c,-S*.42,S*.4,S*.42,-S*.4)}
    else if(h.division==='cross'){c.fillStyle=f2;c.fillRect(-S*.09,-S*.55,S*.18,S*1.1);c.fillRect(-S*.5,-S*.08,S,S*.16)}
    else if(h.division==='chevron'){c.strokeStyle=f2;c.lineWidth=S*.16;c.beginPath();c.moveTo(-S*.32,S*.12);c.lineTo(0,-S*.15);c.lineTo(S*.32,S*.12);c.stroke()}
    c.restore();shieldPath(c,S);c.stroke();drawCharge(c,S,{charge:h.charge||'lion',chargeColor:h.chargeColor||'#d6b35c'});
    if(h.crown){c.fillStyle=h.chargeColor||'#d6b35c';poly(c,[[-S*.24,-S*.42],[-S*.16,-S*.6],[-S*.04,-S*.44],[S*.06,-S*.62],[S*.18,-S*.44],[S*.28,-S*.58],[S*.24,-S*.4]],true);c.strokeStyle=ink;poly(c,[[-S*.24,-S*.42],[-S*.16,-S*.6],[-S*.04,-S*.44],[S*.06,-S*.62],[S*.18,-S*.44],[S*.28,-S*.58],[S*.24,-S*.4]])}
    if(o.label){c.fillStyle=ink;c.font='600 '+Math.max(10,Math.round(S*.18))+'px Georgia';c.textAlign='center';c.fillText(o.label,0,S*.68)}
    c.restore()
  }

  function drawFrame(c,o,map){
    const w=map.settings.columns*map.settings.cellSize,h=map.settings.rows*map.settings.cellSize,s=o.inset??18,ink=o.color||map.settings.ink||'#3a2b1f';
    c.save();c.globalAlpha=o.opacity??1;c.strokeStyle=ink;c.lineWidth=o.width||3;
    if(o.style==='simple')c.strokeRect(s,s,w-2*s,h-2*s);
    else if(o.style==='double'){c.strokeRect(s,s,w-2*s,h-2*s);c.lineWidth=1;c.strokeRect(s+9,s+9,w-2*s-18,h-2*s-18)}
    else if(o.style==='rope'){c.strokeRect(s,s,w-2*s,h-2*s);c.lineWidth=1;for(let x=s+8;x<w-s;x+=14){line(c,x,s,x+8,s+8);line(c,x,h-s,x+8,h-s-8)}for(let y=s+8;y<h-s;y+=14){line(c,s,y,s+8,y+8);line(c,w-s,y,w-s-8,y+8)}}
    else{c.lineWidth=2;c.strokeRect(s,s,w-2*s,h-2*s);c.strokeRect(s+12,s+12,w-2*s-24,h-2*s-24);c.fillStyle=map.settings.accent||'#8b4f3f';const cs=26;[[s,s],[w-s,s],[s,h-s],[w-s,h-s]].forEach(([x,y],i)=>{c.save();c.translate(x,y);c.rotate(i*Math.PI/2);poly(c,[[0,0],[cs,4],[8,8],[4,cs]],true);c.restore()})}
    c.restore()
  }

  function drawDecorText(c,o,map){
    const style=o.decorStyle||'plain',size=o.size||28,spacing=o.letterSpacing??(style==='portolan'?1.5:style==='royal'?2.5:.5);let text=o.text||'Подпись';
    if(style==='monastic'||style==='royal')text=text.toUpperCase();
    c.save();c.globalAlpha=style==='faded'?.68:1;c.fillStyle=o.color||map.settings.labelColor||'#2d261f';
    c.font=(style==='portolan'?'italic ':'')+(style==='royal'?'700':'600')+' '+size+'px Georgia,serif';c.textBaseline='top';let x=o.x;
    if(style==='royal'){c.shadowColor='rgba(139,79,63,.25)';c.shadowBlur=1;c.shadowOffsetY=1}
    for(const ch of text){c.fillText(ch,x,o.y);x+=c.measureText(ch).width+spacing}c.restore()
  }

  function ensureLayer(map,name='Composition'){let l=map.layers.find(x=>x.name===name);if(!l){l={id:uid('layer'),name,visible:true,locked:false,audience:'both'};map.layers.unshift(l)}return l}
  function addIllustration(map,layer,asset,x,y,size,palette='catalan',rotation=0,label=''){map.objects.push({id:uid('obj'),type:'illustration',asset,x,y,size,rotation,opacity:1,palette,label,layerId:layer.id})}
  function applyComposition(map,ed,type){
    const w=map.settings.columns*map.settings.cellSize,h=map.settings.rows*map.settings.cellSize,l=ensureLayer(map);
    map.objects.push({id:uid('obj'),type:'frame',style:type==='royal'?'illuminated':type==='mappa'?'double':'rope',inset:20,width:3,opacity:.85,layerId:l.id});
    if(type==='portolan'){map.settings.rhumbVisible=true;addIllustration(map,l,'compass-rose',w*.18,h*.74,210,'portolan');addIllustration(map,l,'wind-east',w*.05,h*.32,120,'portolan');addIllustration(map,l,'wind-west',w*.95,h*.58,120,'portolan',180);addIllustration(map,l,'cartouche-scroll',w*.74,h*.12,210,'portolan',0,map.name)}
    else if(type==='mappa'){map.settings.rhumbVisible=false;addIllustration(map,l,'compass-rose',w*.12,h*.18,170,'mappa');addIllustration(map,l,'sun-face-art',w*.9,h*.12,120,'mappa');addIllustration(map,l,'cartouche-scroll',w*.52,h*.1,220,'mappa',0,map.name);addIllustration(map,l,'sea-dragon',w*.82,h*.74,180,'mappa',-12)}
    else{addIllustration(map,l,'star-compass',w*.12,h*.82,170,'catalan');addIllustration(map,l,'cartouche-scroll',w*.5,h*.09,250,'catalan',0,map.name);map.objects.push({id:uid('obj'),type:'heraldry',x:w*.88,y:h*.14,size:140,rotation:0,opacity:1,label:'',heraldry:{division:'quarterly',field1:'#a64532',field2:'#315f82',charge:'fleur',chargeColor:'#d6b35c',crown:true},layerId:l.id})}
    ed.commit();renderRightPanel(ed,map);toast('Композиционный пресет добавлен')
  }
  function reorder(map,id,mode){const i=map.objects.findIndex(o=>o.id===id);if(i<0)return;const [o]=map.objects.splice(i,1);if(mode==='front')map.objects.push(o);else if(mode==='back')map.objects.unshift(o);else if(mode==='up')map.objects.splice(Math.min(map.objects.length,i+1),0,o);else map.objects.splice(Math.max(0,i-1),0,o)}
  return{ui,charges,divisions,frames,textStyles,drawTerrain,drawHeraldry,drawFrame,drawDecorText,applyComposition,reorder}
})();

TOOL_LABELS.heraldry=['♜','Герб'];TOOL_KINDS.heraldry=['world','region','city'];

const tc6Bounds=bounds;
bounds=function(o){if(o.type==='heraldry'){const s=o.size||120;return{x:o.x-s*.55,y:o.y-s*.62,w:s*1.1,h:s*1.3}}if(o.type==='frame'){const map=state.editor?.map;if(map)return{x:0,y:0,w:map.settings.columns*map.settings.cellSize,h:map.settings.rows*map.settings.cellSize}}return tc6Bounds(o)};

const tc6IllustrationDraw=TC_V05.draw;
TC_V05.draw=function(c,o,map){if(TC_V05.def(o.asset)?.group==='terrain'){TC_V06.drawTerrain(c,o);return}tc6IllustrationDraw(c,o,map)};

const tc6Render=renderObject;
renderObject=function(c,o,sel){const map=state.editor?.map;if(o.type==='heraldry'&&map){TC_V06.drawHeraldry(c,o,map);if(sel)drawSelection(c,o);return}if(o.type==='frame'&&map){TC_V06.drawFrame(c,o,map);if(sel)drawSelection(c,o);return}if(o.type==='text'&&o.decorStyle&&map){TC_V06.drawDecorText(c,o,map);if(sel)drawSelection(c,o);return}tc6Render(c,o,sel)};

const tc6Down=MapEditor.prototype.down;
MapEditor.prototype.down=function(e){if(this.tool==='heraldry'){const p=this.snap(this.world(e)),l=this.map.layers.find(x=>x.id===this.map.activeLayerId);if(l?.locked||!l?.visible)return toast('Активный слой скрыт или заблокирован');const o={id:uid('obj'),type:'heraldry',x:p.x,y:p.y,size:TC_V06.ui.heraldrySize,rotation:0,opacity:1,label:'',heraldry:{division:'quarterly',field1:'#a64532',field2:'#315f82',charge:'lion',chargeColor:'#d6b35c',crown:false},layerId:this.map.activeLayerId};this.map.objects.push(o);this.selectedId=o.id;this.commit();renderRightPanel(this,this.map);return}tc6Down.call(this,e)};

const tc6Move=MapEditor.prototype.move;
MapEditor.prototype.move=function(e){const o=this.selected();if(this.mode==='resize'&&o?.type==='heraldry'&&this.start){const q=this.world(e),b=this.start.base;o.size=Math.max(36,(b.size||120)+Math.max(q.x-this.start.x,q.y-this.start.y));this.render();return}tc6Move.call(this,e)};

const tc6Dup=MapEditor.prototype.duplicate;
MapEditor.prototype.duplicate=function(){const o=this.selected();if(o?.type==='frame'){const c=deep(o);c.id=uid('obj');c.inset=(c.inset||18)+10;this.map.objects.push(c);this.selectedId=c.id;this.commit();return}tc6Dup.call(this)};

const tc6Right=renderRightPanel;
renderRightPanel=function(ed,map){
  tc6Right(ed,map);const rp=$('#rightPanel');if(!rp)return;
  const compose=document.createElement('section');compose.className='panel tc6-compose';compose.innerHTML='<span class="eyebrow">Map composition</span><h3>Композиция листа</h3><div class="tc6-presets"><button data-c="portolan">Portolan</button><button data-c="mappa">Mappa Mundi</button><button data-c="royal">Royal Chart</button></div><p class="muted">Добавляет рамку, картуш и характерные декоративные элементы. Объекты остаются редактируемыми.</p>';
  const anchor=rp.querySelector('.tc5-assets')||rp.children[1]||rp.firstChild;rp.insertBefore(compose,anchor);compose.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>TC_V06.applyComposition(map,ed,b.dataset.c));
  const sel=ed.selected?.();
  let z=null;
  if(sel){z=document.createElement('section');z.className='panel tc6-z';z.innerHTML='<span class="eyebrow">Stacking</span><h3>Порядок объектов</h3><div class="tc6-zgrid"><button data-z="front">На передний план</button><button data-z="up">Выше</button><button data-z="down">Ниже</button><button data-z="back">На задний план</button></div>';rp.insertBefore(z,compose.nextSibling);z.querySelectorAll('[data-z]').forEach(b=>b.onclick=()=>{TC_V06.reorder(map,sel.id,b.dataset.z);ed.commit();renderRightPanel(ed,map)})}
  if(sel?.type==='heraldry'){const h=sel.heraldry||{};const i=document.createElement('section');i.className='panel tc6-heraldry';i.innerHTML='<span class="eyebrow">Heraldry editor</span><h3>Герб</h3><label class="field">Деление<select id="tc6Div">'+TC_V06.divisions.map(x=>'<option value="'+x[0]+'" '+((h.division||'plain')===x[0]?'selected':'')+'>'+x[1]+'</option>').join('')+'</select></label><div class="field-grid two"><label>Поле I<input id="tc6F1" type="color" value="'+(h.field1||'#a64532')+'"></label><label>Поле II<input id="tc6F2" type="color" value="'+(h.field2||'#315f82')+'"></label></div><label class="field">Фигура<select id="tc6Charge">'+TC_V06.charges.map(x=>'<option value="'+x[0]+'" '+((h.charge||'lion')===x[0]?'selected':'')+'>'+x[1]+'</option>').join('')+'</select></label><div class="field-grid two"><label>Цвет фигуры<input id="tc6CC" type="color" value="'+(h.chargeColor||'#d6b35c')+'"></label><label>Размер<input id="tc6HS" type="number" min="36" max="500" value="'+Math.round(sel.size||120)+'"></label></div><div class="toggle"><span>Корона</span><button id="tc6Crown" class="switch '+(h.crown?'on':'')+'"><span></span></button></div><label class="field">Подпись<input id="tc6HL" value="'+esc(sel.label||'')+'"></label>';rp.insertBefore(i,z?.nextSibling||compose.nextSibling);const set=(q,fn)=>{const el=$(q);if(el)el.onchange=()=>{fn(el.value);ed.commit();renderRightPanel(ed,map)}};set('#tc6Div',v=>h.division=v);set('#tc6F1',v=>h.field1=v);set('#tc6F2',v=>h.field2=v);set('#tc6Charge',v=>h.charge=v);set('#tc6CC',v=>h.chargeColor=v);set('#tc6HS',v=>sel.size=clamp(+v||120,36,500));set('#tc6HL',v=>sel.label=v);$('#tc6Crown').onclick=()=>{h.crown=!h.crown;sel.heraldry=h;ed.commit();renderRightPanel(ed,map)};sel.heraldry=h}
  if(sel?.type==='text'){const t=document.createElement('section');t.className='panel tc6-text';t.innerHTML='<span class="eyebrow">Manuscript label</span><h3>Стиль подписи</h3><label class="field">Стиль<select id="tc6TS">'+TC_V06.textStyles.map(x=>'<option value="'+x[0]+'" '+((sel.decorStyle||'plain')===x[0]?'selected':'')+'>'+x[1]+'</option>').join('')+'</select></label><label class="field">Разрядка<input id="tc6LS" type="number" min="0" max="12" step="0.5" value="'+(sel.letterSpacing??1)+'"></label>';rp.insertBefore(t,z?.nextSibling||compose.nextSibling);$('#tc6TS').onchange=e=>{sel.decorStyle=e.target.value;ed.commit();renderRightPanel(ed,map)};$('#tc6LS').onchange=e=>{sel.letterSpacing=clamp(+e.target.value||0,0,12);ed.commit();renderRightPanel(ed,map)}}
  if(sel?.type==='frame'){const f=document.createElement('section');f.className='panel tc6-frame';f.innerHTML='<span class="eyebrow">Frame</span><h3>Рамка карты</h3><label class="field">Стиль<select id="tc6FS">'+TC_V06.frames.map(x=>'<option value="'+x[0]+'" '+((sel.style||'simple')===x[0]?'selected':'')+'>'+x[1]+'</option>').join('')+'</select></label><div class="field-grid two"><label>Отступ<input id="tc6FI" type="number" min="4" max="120" value="'+(sel.inset||18)+'"></label><label>Толщина<input id="tc6FW" type="number" min="1" max="12" value="'+(sel.width||3)+'"></label></div>';rp.insertBefore(f,z?.nextSibling||compose.nextSibling);$('#tc6FS').onchange=e=>{sel.style=e.target.value;ed.commit();renderRightPanel(ed,map)};$('#tc6FI').onchange=e=>{sel.inset=clamp(+e.target.value||18,4,120);ed.commit()};$('#tc6FW').onchange=e=>{sel.width=clamp(+e.target.value||3,1,12);ed.commit()}}
};
