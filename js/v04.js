// Tirandor Cartographer v0.4 — editable geometry, historical overlays and illuminated marginalia
const TC_V04 = (() => {
  const ui = { nodeEditId:null, era:'high', illustrationSize:110 }

  const addGroup = (id,label) => {
    if (!TC_V02.G.some(g => g[0] === id)) TC_V02.G.push([id,label])
  }
  addGroup('urban','Город')
  addGroup('economy','Ремёсла')
  addGroup('rural','Сельская местность')
  addGroup('infrastructure','Пути')
  addGroup('illuminations','Иллюминации')

  const extraSymbols = [
    ['gatehouse','Надвратная башня','urban','▥'],['keep','Донжон','urban','▣'],['house','Дом','urban','⌂'],
    ['townhouse','Городской дом','urban','⌑'],['workshop','Мастерская','urban','⚒'],['inn','Постоялый двор','urban','♨'],
    ['bathhouse','Бани','urban','≋'],['well','Колодец','urban','⊙'],['cistern','Цистерна','urban','◉'],
    ['dock','Причал','urban','╞'],['shipyard','Верфь','urban','⚓'],['warehouse','Склад','urban','▤'],
    ['granary','Амбар','urban','▧'],['chapel','Часовня','sacred','†'],['monastery','Монастырь','sacred','☩'],
    ['shrine','Святилище','sacred','✥'],['pilgrim-cross','Паломнический крест','sacred','✝'],
    ['fair','Ярмарка','economy','⚖'],['mint','Монетный двор','economy','◈'],['customs','Таможня','economy','⚑'],
    ['tollhouse','Застава','economy','▥'],['smithy','Кузница','economy','⚒'],['quarry','Каменоломня','economy','◇'],
    ['saltworks','Солеварня','economy','✣'],['fishery','Рыбный промысел','economy','><>'],['watermill','Водяная мельница','economy','✺'],
    ['farmstead','Двор / хутор','rural','⌂'],['vineyard','Виноградник','rural','❧'],['pasture','Пастбище','rural','♧'],
    ['apiary','Пасека','rural','⬡'],['hunting-lodge','Охотничий дом','rural','⚜'],['hermitage','Скит','rural','†'],
    ['ford','Брод','infrastructure','≈'],['crossroads','Перекрёсток','infrastructure','✣'],['milestone','Мильный камень','infrastructure','▴'],
    ['beacon','Сигнальный огонь','infrastructure','♨'],['causeway','Гать / дамба','infrastructure','═'],
    ['dragon','Дракон','illuminations','D'],['wyvern','Виверна','illuminations','W'],['sea-serpent','Морской змей','illuminations','S'],
    ['whale','Кит','illuminations','Wh'],['siren','Сирена','illuminations','Si'],['griffin','Грифон','illuminations','Gr'],
    ['unicorn','Единорог','illuminations','Un'],['lion','Лев','illuminations','Li'],['basilisk','Василиск','illuminations','Ba'],
    ['gargoyle','Горгулья','illuminations','Ga'],['elephant','Слон','illuminations','El'],['camel','Верблюд','illuminations','Ca'],
    ['stag','Олень','illuminations','St'],['boar','Вепрь','illuminations','Bo'],['wolf','Волк','illuminations','Wo'],
    ['eagle','Орёл','illuminations','Ea'],['king','Король','illuminations','♛'],['knight','Рыцарь','illuminations','Kn'],
    ['pilgrim','Паломник','illuminations','Pi'],['wind-head','Голова ветра','illuminations','◔'],['angel','Ангел','illuminations','An'],
    ['demon','Демон','illuminations','De'],['sun-face','Солнце','illuminations','☼'],['moon-face','Луна','illuminations','☾']
  ]
  extraSymbols.forEach(([id,label,group,icon]) => {
    if (!TC_V02.S.some(s => s.id === id)) TC_V02.S.push({id,label,group,icon})
  })

  const illuminated = new Set(extraSymbols.filter(x => x[2] === 'illuminations').map(x => x[0]))
  const oldList = TC_V02.list
  TC_V02.list = kind => oldList(kind).filter(s => {
    if (s.group === 'illuminations') return ['world','region','city'].includes(kind)
    if (s.group === 'urban') return ['city','battle','dungeon'].includes(kind)
    return true
  })

  TC_V02.T.mappa = {label:'Mappa Mundi c.1300',background:'#ead8b4',grid:'#77654b',ink:'#3d2a1c',accent:'#8b4f3f'}
  TC_V02.T.portolan = {label:'Portolan 1375',background:'#eadbbd',grid:'#88775f',ink:'#342519',accent:'#9a543c'}
  const oldTheme = TC_V02.theme
  TC_V02.theme = function(map,id){
    oldTheme(map,id)
    ensure(map)
    if(id === 'portolan'){ map.settings.rhumbVisible = true; map.settings.waterHatching = true; map.settings.era = 'late' }
    if(id === 'mappa'){ map.settings.rhumbVisible = false; map.settings.waterHatching = true; map.settings.era = 'high' }
  }

  TC_V03.AREAS.coast = {label:'Суша / берег',fill:'rgba(178,151,100,.26)',stroke:'#5e452c'}
  TC_V03.AREAS.quarter = {label:'Городской квартал',fill:'rgba(147,109,74,.16)',stroke:'#76563c'}
  TC_V03.AREAS.fields = {label:'Поля',fill:'rgba(170,148,83,.18)',stroke:'#8c7546'}

  function ensure(map){
    map.settings.era ||= 'high'
    map.settings.rhumbVisible ??= false
    map.settings.waterHatching ??= true
    map.settings.areaPatterns ??= true
    map.settings.coastTicks ??= true
    map.settings.wallTowers ??= true
    return map
  }

  function line(ctx,a,b){ ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke() }
  function circle(ctx,x,y,r,fill){
    ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2)
    fill ? ctx.fill() : ctx.stroke()
  }
  function ellipse(ctx,x,y,rx,ry){ ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.stroke() }

  function drawIllumination(ctx,o,map){
    const id=o.symbol,s=o.size||110,S=s/2,ink=o.color||map.settings.ink||'#3a2b1f'
    ctx.save();ctx.translate(o.x,o.y);ctx.rotate((o.rotation||0)*Math.PI/180);ctx.strokeStyle=ink;ctx.fillStyle='rgba(111,76,43,.12)';ctx.lineWidth=Math.max(1.4,s*.025);ctx.lineCap='round';ctx.lineJoin='round'
    const body=(rx=.28,ry=.17)=>{ellipse(ctx,0,0,S*rx*2,S*ry*2)}
    const head=(x,y,r=.09)=>circle(ctx,S*x,S*y,S*r,false)
    switch(id){
      case 'dragon':
        ctx.beginPath();ctx.moveTo(-S*.42,S*.2);ctx.bezierCurveTo(-S*.2,-S*.32,S*.18,-S*.24,S*.34,0);ctx.bezierCurveTo(S*.48,S*.18,S*.3,S*.38,S*.1,S*.2);ctx.stroke()
        ctx.beginPath();ctx.moveTo(-S*.06,-S*.12);ctx.lineTo(-S*.34,-S*.42);ctx.lineTo(S*.02,-S*.3);ctx.closePath();ctx.stroke()
        ctx.beginPath();ctx.moveTo(S*.08,-S*.08);ctx.lineTo(S*.36,-S*.34);ctx.lineTo(S*.3,-S*.02);ctx.closePath();ctx.stroke()
        head(.36,-.02,.1);line(ctx,[S*.43,-S*.05],[S*.56,-S*.12]);line(ctx,[S*.42,S*.02],[S*.57,S*.08]);break
      case 'wyvern':
        body(.28,.16);head(.3,-.14,.09);line(ctx,[S*.28,-S*.2],[S*.48,-S*.34]);line(ctx,[-S*.22,S*.06],[-S*.44,S*.34])
        ctx.beginPath();ctx.moveTo(-S*.08,-S*.1);ctx.lineTo(-S*.38,-S*.42);ctx.lineTo(S*.08,-S*.26);ctx.closePath();ctx.stroke();break
      case 'sea-serpent':
        ctx.beginPath();ctx.moveTo(-S*.48,S*.15);ctx.bezierCurveTo(-S*.3,-S*.35,-S*.05,S*.4,S*.14,-S*.16);ctx.bezierCurveTo(S*.26,-S*.42,S*.42,-S*.12,S*.36,S*.14);ctx.stroke();head(.39,.14,.1);line(ctx,[S*.45,S*.12],[S*.58,S*.04]);break
      case 'whale':
        ctx.beginPath();ctx.ellipse(-S*.04,0,S*.36,S*.2,0,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(S*.31,0);ctx.lineTo(S*.5,-S*.17);ctx.lineTo(S*.44,0);ctx.lineTo(S*.5,S*.17);ctx.closePath();ctx.stroke();circle(ctx,-S*.23,-S*.04,S*.025,true);break
      case 'siren':
        head(0,-.28,.09);line(ctx,[0,-S*.19],[0,S*.05]);line(ctx,[-S*.18,-S*.04],[S*.18,-S*.04]);ctx.beginPath();ctx.moveTo(0,S*.05);ctx.bezierCurveTo(-S*.14,S*.18,-S*.32,S*.26,-S*.4,S*.1);ctx.moveTo(0,S*.05);ctx.bezierCurveTo(S*.14,S*.18,S*.32,S*.26,S*.4,S*.1);ctx.stroke();break
      case 'griffin':
        body(.26,.15);head(.28,-.12,.09);ctx.beginPath();ctx.moveTo(-S*.06,-S*.1);ctx.lineTo(-S*.34,-S*.38);ctx.lineTo(S*.05,-S*.28);ctx.closePath();ctx.stroke();line(ctx,[S*.32,-S*.12],[S*.47,-S*.16]);line(ctx,[-S*.17,S*.12],[-S*.28,S*.35]);line(ctx,[S*.12,S*.12],[S*.2,S*.35]);break
      case 'unicorn':
        body(.28,.15);head(.3,-.16,.08);line(ctx,[S*.32,-S*.23],[S*.47,-S*.42]);line(ctx,[-S*.2,S*.1],[-S*.24,S*.38]);line(ctx,[S*.15,S*.1],[S*.18,S*.38]);break
      case 'lion':
        body(.28,.16);head(.3,-.1,.13);circle(ctx,S*.3,-S*.1,S*.18,false);line(ctx,[-S*.18,S*.12],[-S*.24,S*.36]);line(ctx,[S*.14,S*.12],[S*.2,S*.36]);ctx.beginPath();ctx.moveTo(-S*.28,-S*.05);ctx.bezierCurveTo(-S*.5,-S*.18,-S*.45,S*.22,-S*.55,S*.18);ctx.stroke();break
      case 'basilisk':
        ctx.beginPath();ctx.moveTo(-S*.42,S*.2);ctx.bezierCurveTo(-S*.15,-S*.2,S*.05,S*.35,S*.28,-S*.05);ctx.stroke();head(.3,-.08,.09);ctx.beginPath();ctx.moveTo(S*.22,-S*.17);ctx.lineTo(S*.3,-S*.38);ctx.lineTo(S*.38,-S*.18);ctx.stroke();ctx.beginPath();ctx.moveTo(-S*.02,-S*.02);ctx.lineTo(-S*.25,-S*.34);ctx.lineTo(S*.08,-S*.22);ctx.closePath();ctx.stroke();break
      case 'gargoyle':
        head(0,-.08,.16);line(ctx,[-S*.12,S*.02],[-S*.28,S*.28]);line(ctx,[S*.12,S*.02],[S*.28,S*.28]);ctx.beginPath();ctx.moveTo(-S*.1,-S*.18);ctx.lineTo(-S*.32,-S*.38);ctx.lineTo(-S*.24,-S*.08);ctx.moveTo(S*.1,-S*.18);ctx.lineTo(S*.32,-S*.38);ctx.lineTo(S*.24,-S*.08);ctx.stroke();line(ctx,[-S*.08,-S*.2],[-S*.17,-S*.36]);line(ctx,[S*.08,-S*.2],[S*.17,-S*.36]);break
      case 'elephant':
        body(.3,.2);head(.3,-.04,.1);ctx.beginPath();ctx.moveTo(S*.38,-S*.02);ctx.bezierCurveTo(S*.52,S*.06,S*.42,S*.28,S*.5,S*.34);ctx.stroke();line(ctx,[-S*.2,S*.14],[-S*.2,S*.38]);line(ctx,[S*.12,S*.14],[S*.12,S*.38]);break
      case 'camel':
        ctx.beginPath();ctx.moveTo(-S*.34,S*.14);ctx.quadraticCurveTo(-S*.2,-S*.18,-S*.04,S*.04);ctx.quadraticCurveTo(S*.08,-S*.24,S*.2,S*.04);ctx.lineTo(S*.32,-S*.12);ctx.stroke();head(.35,-.18,.07);line(ctx,[-S*.18,S*.14],[-S*.2,S*.38]);line(ctx,[S*.12,S*.14],[S*.16,S*.38]);break
      case 'stag':
        body(.27,.14);head(.28,-.18,.08);line(ctx,[S*.27,-S*.25],[S*.2,-S*.42]);line(ctx,[S*.28,-S*.28],[S*.38,-S*.45]);line(ctx,[S*.2,-S*.4],[S*.1,-S*.48]);line(ctx,[S*.38,-S*.43],[S*.48,-S*.5]);line(ctx,[-S*.18,S*.1],[-S*.22,S*.36]);line(ctx,[S*.12,S*.1],[S*.14,S*.36]);break
      case 'boar':
        body(.3,.16);head(.32,-.02,.1);line(ctx,[S*.38,0],[S*.5,S*.06]);line(ctx,[S*.38,S*.04],[S*.48,S*.15]);line(ctx,[-S*.18,S*.12],[-S*.2,S*.32]);break
      case 'wolf':
        body(.3,.15);head(.32,-.12,.09);ctx.beginPath();ctx.moveTo(S*.27,-S*.2);ctx.lineTo(S*.3,-S*.36);ctx.lineTo(S*.37,-S*.23);ctx.stroke();line(ctx,[-S*.2,S*.1],[-S*.22,S*.34]);ctx.beginPath();ctx.moveTo(-S*.3,-S*.04);ctx.lineTo(-S*.48,-S*.22);ctx.stroke();break
      case 'eagle':
        ctx.beginPath();ctx.moveTo(0,-S*.05);ctx.bezierCurveTo(-S*.16,-S*.14,-S*.28,-S*.32,-S*.5,-S*.28);ctx.lineTo(-S*.22,S*.02);ctx.lineTo(0,S*.18);ctx.lineTo(S*.22,S*.02);ctx.lineTo(S*.5,-S*.28);ctx.bezierCurveTo(S*.28,-S*.32,S*.16,-S*.14,0,-S*.05);ctx.stroke();head(.08,-.12,.06);break
      case 'king':
        head(0,-.25,.1);line(ctx,[0,-S*.15],[0,S*.25]);line(ctx,[-S*.2,-S*.02],[S*.2,-S*.02]);ctx.beginPath();ctx.moveTo(-S*.12,-S*.34);ctx.lineTo(-S*.05,-S*.48);ctx.lineTo(0,-S*.35);ctx.lineTo(S*.07,-S*.48);ctx.lineTo(S*.14,-S*.34);ctx.stroke();ctx.strokeRect(-S*.2,S*.25,S*.4,S*.12);break
      case 'knight':
        body(.22,.12);head(.22,-.19,.07);line(ctx,[S*.22,-S*.2],[S*.42,-S*.34]);line(ctx,[S*.04,-S*.1],[S*.32,S*.08]);ctx.beginPath();ctx.moveTo(-S*.22,S*.02);ctx.lineTo(-S*.48,S*.18);ctx.stroke();break
      case 'pilgrim':
        head(0,-.25,.08);ctx.beginPath();ctx.moveTo(0,-S*.16);ctx.lineTo(-S*.16,S*.22);ctx.lineTo(S*.16,S*.22);ctx.closePath();ctx.stroke();line(ctx,[S*.16,-S*.06],[S*.32,S*.35]);line(ctx,[S*.26,-S*.2],[S*.38,-S*.2]);break
      case 'wind-head':
        head(-.15,0,.18);ctx.beginPath();ctx.moveTo(S*.02,-S*.06);ctx.bezierCurveTo(S*.18,-S*.12,S*.28,-S*.12,S*.48,-S*.18);ctx.moveTo(S*.02,0);ctx.bezierCurveTo(S*.2,S*.02,S*.3,S*.02,S*.52,0);ctx.moveTo(S*.02,S*.06);ctx.bezierCurveTo(S*.18,S*.12,S*.3,S*.14,S*.46,S*.2);ctx.stroke();break
      case 'angel':
        head(0,-.25,.08);line(ctx,[0,-S*.17],[0,S*.22]);ctx.beginPath();ctx.moveTo(-S*.04,-S*.08);ctx.lineTo(-S*.4,-S*.3);ctx.lineTo(-S*.22,S*.06);ctx.moveTo(S*.04,-S*.08);ctx.lineTo(S*.4,-S*.3);ctx.lineTo(S*.22,S*.06);ctx.stroke();break
      case 'demon':
        head(0,-.18,.11);line(ctx,[-S*.06,-S*.28],[-S*.18,-S*.42]);line(ctx,[S*.06,-S*.28],[S*.18,-S*.42]);line(ctx,[0,-S*.07],[0,S*.25]);line(ctx,[-S*.16,S*.03],[S*.16,S*.03]);ctx.beginPath();ctx.moveTo(0,S*.25);ctx.lineTo(-S*.18,S*.42);ctx.moveTo(0,S*.25);ctx.lineTo(S*.18,S*.42);ctx.stroke();break
      case 'sun-face':
        circle(ctx,0,0,S*.24,false);for(let i=0;i<12;i++){const a=i*Math.PI/6;line(ctx,[Math.cos(a)*S*.3,Math.sin(a)*S*.3],[Math.cos(a)*S*.48,Math.sin(a)*S*.48])}circle(ctx,-S*.08,-S*.03,S*.02,true);circle(ctx,S*.08,-S*.03,S*.02,true);break
      case 'moon-face':
        ctx.beginPath();ctx.arc(-S*.05,0,S*.3,-Math.PI*.6,Math.PI*.6);ctx.arc(S*.08,0,S*.24,Math.PI*.55,-Math.PI*.55,true);ctx.stroke();circle(ctx,-S*.14,-S*.05,S*.018,true);break
      default:
        ctx.font=Math.round(s*.55)+'px Georgia,serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=ink;ctx.fillText(TC_V02.def(id).icon,0,0)
    }
    ctx.restore()
  }

  function drawRhumbs(ctx,map){
    if(!map.settings.rhumbVisible || !['world','region'].includes(map.kind)) return
    const w=map.settings.columns*map.settings.cellSize,h=map.settings.rows*map.settings.cellSize,cx=w/2,cy=h/2,r=Math.min(w,h)*.42
    ctx.save();ctx.globalAlpha=.18;ctx.lineWidth=1
    const pts=[]
    for(let i=0;i<16;i++){const a=-Math.PI/2+i*Math.PI/8;pts.push({x:cx+Math.cos(a)*r,y:cy+Math.sin(a)*r})}
    pts.forEach((p,i)=>{
      ctx.strokeStyle=i%3===0?'#8b4237':i%3===1?'#3c665d':map.settings.ink
      line(ctx,[cx,cy],[p.x,p.y])
      const q=pts[(i+5)%16];line(ctx,[p.x,p.y],[q.x,q.y])
    })
    ctx.restore()
  }

  function clipPolygon(ctx,points){
    ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.clip()
  }
  function drawAreaPattern(ctx,o,map){
    if(!map.settings.areaPatterns || !o.points || o.points.length<3) return
    const b=TC_V03.pathBounds(o.points)
    ctx.save();clipPolygon(ctx,o.points);ctx.globalAlpha=.32;ctx.strokeStyle=o.stroke||map.settings.ink;ctx.fillStyle=o.stroke||map.settings.ink;ctx.lineWidth=1
    if(o.areaKind==='water'){
      for(let y=b.y+12;y<b.y+b.h;y+=20)for(let x=b.x+8;x<b.x+b.w;x+=38){ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+7,y-4,x+14,y);ctx.quadraticCurveTo(x+21,y+4,x+28,y);ctx.stroke()}
    }else if(o.areaKind==='forest'){
      for(let y=b.y+14;y<b.y+b.h;y+=30)for(let x=b.x+14;x<b.x+b.w;x+=32){ctx.beginPath();ctx.moveTo(x,y-7);ctx.lineTo(x-5,y+5);ctx.lineTo(x+5,y+5);ctx.closePath();ctx.stroke()}
    }else if(o.areaKind==='swamp'){
      for(let y=b.y+12;y<b.y+b.h;y+=24)for(let x=b.x+10;x<b.x+b.w;x+=34){line(ctx,[x,y],[x+14,y]);line(ctx,[x+6,y],[x+4,y-6]);line(ctx,[x+8,y],[x+10,y-7])}
    }else if(o.areaKind==='fields'){
      for(let x=b.x-b.h;x<b.x+b.w;x+=18)line(ctx,[x,b.y],[x+b.h,b.y+b.h])
    }else if(o.areaKind==='quarter'){
      for(let y=b.y+10;y<b.y+b.h;y+=22)line(ctx,[b.x,y],[b.x+b.w,y])
    }
    ctx.restore()
    if((o.areaKind==='coast'||o.areaKind==='land') && map.settings.coastTicks){
      ctx.save();ctx.strokeStyle=o.stroke||map.settings.ink;ctx.globalAlpha=.35;ctx.lineWidth=1
      const pts=o.points
      for(let i=0;i<pts.length;i++){
        const a=pts[i],b2=pts[(i+1)%pts.length],dx=b2.x-a.x,dy=b2.y-a.y,len=Math.hypot(dx,dy)||1,nx=-dy/len,ny=dx/len
        for(let d=18;d<len;d+=28){const x=a.x+dx*d/len,y=a.y+dy*d/len;line(ctx,[x,y],[x+nx*8,y+ny*8])}
      }
      ctx.restore()
    }
  }

  function drawCityWall(ctx,o,map){
    if(!o.points?.length)return
    const pts=o.points,ink=map.settings.ink||'#33261b'
    ctx.save();ctx.lineJoin='round';ctx.lineCap='round'
    ctx.strokeStyle=ink;ctx.lineWidth=o.width||10;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));if(o.closed!==false)ctx.closePath();ctx.stroke()
    ctx.strokeStyle=map.settings.background;ctx.lineWidth=Math.max(2,(o.width||10)*.42);ctx.stroke()
    if(map.settings.wallTowers){
      ctx.fillStyle=map.settings.background;ctx.strokeStyle=ink;ctx.lineWidth=2
      for(let i=0;i<pts.length;i+=Math.max(1,Math.floor(pts.length/10))){circle(ctx,pts[i].x,pts[i].y,7,true);circle(ctx,pts[i].x,pts[i].y,7,false)}
    }
    ctx.restore()
  }
  function nearestNode(o,p,zoom){
    if(!o.points)return -1
    let best=-1,d=Infinity,limit=16/Math.max(zoom,.25)
    o.points.forEach((q,i)=>{const n=Math.hypot(q.x-p.x,q.y-p.y);if(n<d&&n<limit){d=n;best=i}})
    return best
  }
  function drawNodes(ctx,o){
    if(!o.points)return
    ctx.save();ctx.fillStyle='#f2d39b';ctx.strokeStyle='#5b3b1d';ctx.lineWidth=1.5
    o.points.forEach(p=>{ctx.beginPath();ctx.rect(p.x-4,p.y-4,8,8);ctx.fill();ctx.stroke()})
    ctx.restore()
  }
  function ensureLayerAudience(map){map.layers.forEach(l=>l.audience ||= /^GM\b/i.test(l.name)?'gm':'both')}

  return {ui,illuminated,ensure,drawIllumination,drawRhumbs,drawAreaPattern,drawCityWall,nearestNode,drawNodes,ensureLayerAudience}
})()

TOOL_LABELS.citywall=['▰','Городская стена']
TOOL_KINDS.citywall=['city','battle']

const tc4Create=createMap
createMap=function(){
  const m=tc4Create.apply(null,arguments)
  return TC_V04.ensure(m)
}

const tc4Grid=drawGrid
drawGrid=function(ctx,map){
  TC_V04.ensure(map)
  tc4Grid(ctx,map)
  TC_V04.drawRhumbs(ctx,map)
}

const tc4Area=TC_V03.drawArea
TC_V03.drawArea=function(ctx,o){
  tc4Area(ctx,o)
  const map=state.editor?.map
  if(map)TC_V04.drawAreaPattern(ctx,o,map)
}

const tc4Bounds=bounds
bounds=function(o){
  if(o.type==='citywall')return TC_V03.pathBounds(o.points)
  return tc4Bounds(o)
}

const tc4Render=renderObject
renderObject=function(ctx,o,selected){
  const map=state.editor?.map
  if(o.type==='symbol'&&TC_V04.illuminated.has(o.symbol)&&map){
    TC_V04.drawIllumination(ctx,o,map)
    if(selected)drawSelection(ctx,o)
  }else if(o.type==='citywall'&&map){
    TC_V04.drawCityWall(ctx,o,map)
    if(selected)drawSelection(ctx,o)
  }else{
    tc4Render(ctx,o,selected)
  }
  if(selected&&state.editor?.tc4NodeEdit===o.id&&['path','area','citywall'].includes(o.type))TC_V04.drawNodes(ctx,o)
}

const tc4Hit=MapEditor.prototype.hitObject
MapEditor.prototype.hitObject=function(o,p){
  if(o.type==='citywall'){
    const pts=o.points||[]
    for(let i=1;i<pts.length;i++)if(TC_V03.pointDist(p,pts[i-1],pts[i])<14/Math.max(this.zoom,.3))return true
    if(o.closed!==false&&pts.length>2&&TC_V03.pointDist(p,pts[pts.length-1],pts[0])<14/Math.max(this.zoom,.3))return true
    return false
  }
  return tc4Hit.call(this,o,p)
}

const tc4Down=MapEditor.prototype.down
const tc4Move=MapEditor.prototype.move
const tc4Up=MapEditor.prototype.up
MapEditor.prototype.down=function(e){
  const raw=this.world(e),p=this.snap(raw),o=this.selected()
  if(this.tool==='select'&&this.tc4NodeEdit&&o&&o.id===this.tc4NodeEdit&&['path','area','citywall'].includes(o.type)){
    const idx=TC_V04.nearestNode(o,p,this.zoom)
    if(idx>=0){this.mode='tc4node';this.tc4NodeIndex=idx;return}
  }
  if(this.tool==='citywall'){
    const layer=this.map.layers.find(l=>l.id===this.map.activeLayerId)
    if(layer?.locked||!layer?.visible)return toast('Активный слой скрыт или заблокирован')
    const wall={id:uid('obj'),type:'citywall',points:[p],closed:true,width:10,layerId:this.map.activeLayerId}
    this.map.objects.push(wall);this.draft=wall;this.mode='tc4wall';this.tc4last=p;this.selectedId=wall.id;this.render();return
  }
  tc4Down.call(this,e)
}
MapEditor.prototype.move=function(e){
  const p=this.snap(this.world(e))
  if(this.mode==='tc4node'){
    const o=this.selected();if(o?.points?.[this.tc4NodeIndex]){o.points[this.tc4NodeIndex]=p;this.scheduleSave();this.render()}return
  }
  if(this.mode==='tc4wall'&&this.draft){
    if(Math.hypot(p.x-this.tc4last.x,p.y-this.tc4last.y)>Math.max(4,8/this.zoom)){this.draft.points.push(p);this.tc4last=p;this.render()}return
  }
  tc4Move.call(this,e)
}
MapEditor.prototype.up=function(e){
  if(this.mode==='tc4node'){this.commit();this.mode=null;return}
  if(this.mode==='tc4wall'){
    if(this.draft.points.length<3)this.map.objects=this.map.objects.filter(x=>x!==this.draft)
    this.commit();this.mode=null;this.draft=null;return
  }
  tc4Up.call(this,e)
}

const tc4Right=renderRightPanel
renderRightPanel=function(ed,map){
  TC_V04.ensure(map);TC_V04.ensureLayerAudience(map)
  tc4Right(ed,map)
  const rp=$('#rightPanel');if(!rp)return
  const historic=document.createElement('section')
  historic.className='panel tc4-history'
  historic.innerHTML='<span class="eyebrow">Historical overlays</span><h3>Эпоха и оформление</h3>'+
    '<label class="field">Ориентир эпохи<select id="tc4Era"><option value="high">Высокое Средневековье · XI–XIII вв.</option><option value="late">XIV–XV вв. · портоланы и атласы</option></select></label>'+
    '<div class="toggle"><span>Сеть румбов / ветров</span><button id="tc4Rhumb" class="switch '+(map.settings.rhumbVisible?'on':'')+'"><span></span></button></div>'+
    '<div class="toggle"><span>Средневековая штриховка областей</span><button id="tc4Patterns" class="switch '+(map.settings.areaPatterns?'on':'')+'"><span></span></button></div>'+
    '<div class="toggle"><span>Береговые штрихи</span><button id="tc4Coast" class="switch '+(map.settings.coastTicks?'on':'')+'"><span></span></button></div>'+
    '<button id="tc4WallTool" class="secondary wide">▰ Рисовать городскую стену</button>'+
    '<p class="muted">Mappa Mundi — пиктографические виньетки и чудесные существа. Portolan — морская сетка румбов, розы ветров, корабли и прибрежная детализация.</p>'
  rp.insertBefore(historic,rp.children[1]||rp.firstChild)
  $('#tc4Era').value=map.settings.era||'high'
  $('#tc4Era').onchange=e=>{map.settings.era=e.target.value;if(e.target.value==='late')TC_V02.theme(map,'portolan');else TC_V02.theme(map,'mappa');ed.scheduleSave();ed.render();renderRightPanel(ed,map)}
  $('#tc4Rhumb').onclick=()=>{map.settings.rhumbVisible=!map.settings.rhumbVisible;ed.scheduleSave();ed.render();renderRightPanel(ed,map)}
  $('#tc4Patterns').onclick=()=>{map.settings.areaPatterns=!map.settings.areaPatterns;ed.scheduleSave();ed.render();renderRightPanel(ed,map)}
  $('#tc4Coast').onclick=()=>{map.settings.coastTicks=!map.settings.coastTicks;ed.scheduleSave();ed.render();renderRightPanel(ed,map)}
  $('#tc4WallTool').onclick=()=>{ed.setTool('citywall');$$('.tool').forEach(t=>t.classList.toggle('active',t.dataset.tool==='citywall'))}

  const selected=ed.selected?.()
  if(selected&&['path','area','citywall'].includes(selected.type)){
    const node=document.createElement('section')
    node.className='panel tc4-node-panel'
    const on=ed.tc4NodeEdit===selected.id
    node.innerHTML='<span class="eyebrow">Geometry</span><h3>Узлы контура</h3><button id="tc4Nodes" class="'+(on?'primary':'secondary')+' wide">'+(on?'✓ Редактирование узлов':'Редактировать узлы')+'</button><p class="muted">Включи режим и перетаскивай квадратные точки контура инструментом «Выбор».</p>'
    rp.insertBefore(node,historic.nextSibling)
    $('#tc4Nodes').onclick=()=>{ed.tc4NodeEdit=on?null:selected.id;ed.setTool('select');$$('.tool').forEach(t=>t.classList.toggle('active',t.dataset.tool==='select'));ed.render();renderRightPanel(ed,map)}
  }
}

const tc4Editor=renderEditor
renderEditor=async function(id){
  const m=await idbGet('maps',id)
  if(m){TC_V04.ensure(m);TC_V04.ensureLayerAudience(m);await idbPut('maps',m)}
  await tc4Editor(id)
}
