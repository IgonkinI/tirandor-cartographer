// ---------- editor engine ----------
class MapEditor{
  constructor(canvas,map,onChange,onSelection){
    this.canvas=canvas;this.ctx=canvas.getContext('2d');this.map=map;this.onChange=onChange;this.onSelection=onSelection;this.tool='select';this.zoom=1;this.panX=0;this.panY=0;this.dpr=devicePixelRatio||1;this.selectedId=null;this.mode=null;this.start=null;this.draft=null;this.last=null;this.history=[JSON.stringify(map.objects)];this.historyIndex=0;this.saveTimer=null
    this.resizeObs=new ResizeObserver(()=>this.resize());this.resizeObs.observe(canvas.parentElement);this.bind();this.resize();this.fit()
  }
  destroy(){this.resizeObs.disconnect();this.canvas.replaceWith(this.canvas.cloneNode(true));if(this.saveTimer)clearTimeout(this.saveTimer)}
  bind(){
    this.canvas.addEventListener('wheel',e=>this.wheel(e),{passive:false});this.canvas.addEventListener('pointerdown',e=>this.down(e));this.canvas.addEventListener('pointermove',e=>this.move(e));this.canvas.addEventListener('pointerup',e=>this.up(e));this.canvas.addEventListener('pointercancel',e=>this.up(e));this.canvas.addEventListener('dblclick',e=>this.dbl(e))
    this.keyHandler=e=>this.key(e);window.addEventListener('keydown',this.keyHandler)
  }
  dispose(){window.removeEventListener('keydown',this.keyHandler);this.resizeObs.disconnect();if(this.saveTimer)clearTimeout(this.saveTimer)}
  resize(){const r=this.canvas.parentElement.getBoundingClientRect();this.canvas.width=Math.max(1,Math.floor(r.width*this.dpr));this.canvas.height=Math.max(1,Math.floor(r.height*this.dpr));this.canvas.style.width=`${r.width}px`;this.canvas.style.height=`${r.height}px`;this.render()}
  fit(){const w=this.map.settings.columns*this.map.settings.cellSize,h=this.map.settings.rows*this.map.settings.cellSize,cw=this.canvas.clientWidth,ch=this.canvas.clientHeight,z=Math.min((cw-80)/w,(ch-80)/h);this.zoom=clamp(z,.08,1.4);this.panX=(cw-w*this.zoom)/2;this.panY=(ch-h*this.zoom)/2;this.render()}
  setTool(t){this.tool=t;this.mode=null;this.draft=null;this.canvas.style.cursor=t==='pan'?'grab':t==='select'?'default':'crosshair';this.render()}
  setMap(map){this.map=map;this.render()}
  world(e){const r=this.canvas.getBoundingClientRect();return{x:(e.clientX-r.left-this.panX)/this.zoom,y:(e.clientY-r.top-this.panY)/this.zoom}}
  snap(p){if(!this.map.settings.snapToGrid)return p;const s=this.map.settings.cellSize/2;return{x:Math.round(p.x/s)*s,y:Math.round(p.y/s)*s}}
  wheel(e){e.preventDefault();const rect=this.canvas.getBoundingClientRect(),sx=e.clientX-rect.left,sy=e.clientY-rect.top,wx=(sx-this.panX)/this.zoom,wy=(sy-this.panY)/this.zoom,nz=clamp(this.zoom*Math.pow(.999,e.deltaY),.08,4);this.zoom=nz;this.panX=sx-wx*nz;this.panY=sy-wy*nz;this.render()}
  down(e){
    this.canvas.setPointerCapture?.(e.pointerId);const raw=this.world(e),p=this.snap(raw)
    if(this.tool==='pan'||e.altKey||e.button===1){this.mode='pan';this.last={x:e.clientX,y:e.clientY};this.canvas.style.cursor='grabbing';return}
    if(this.tool==='select'){
      const selected=this.selected(), b=selected?bounds(selected):null
      if(selected&&b&&Math.hypot(raw.x-(b.x+b.w),raw.y-(b.y+b.h))<14/this.zoom&&!lockedLayer(this.map,selected.layerId)){this.mode='resize';this.start={...raw,base:deep(selected)};return}
      const o=this.hit(raw);this.selectedId=o?.id||null;this.onSelection?.(!!o)
      if(o&&!lockedLayer(this.map,o.layerId)){this.mode='drag';this.start={...raw,base:deep(o)}}else this.mode=null;this.render();return
    }
    const layer=this.map.layers.find(l=>l.id===this.map.activeLayerId);if(layer?.locked||!layer?.visible){toast('Активный слой скрыт или заблокирован');return}
    if(['tree','mountain','settlement'].includes(this.tool)){this.map.objects.push({id:uid('obj'),type:this.tool,x:p.x,y:p.y,size:this.map.settings.cellSize,layerId:this.map.activeLayerId});this.commit();return}
    if(this.tool==='door'){this.map.objects.push({id:uid('obj'),type:'door',x:p.x,y:p.y,w:this.map.settings.cellSize*.7,h:8,layerId:this.map.activeLayerId});this.commit();return}
    if(this.tool==='text'){const text=prompt('Текст подписи:','Подпись');if(text!==null){this.map.objects.push({id:uid('obj'),type:'text',x:p.x,y:p.y,text,size:28,layerId:this.map.activeLayerId});this.commit()}return}
    this.mode='draw';this.start=p
    if(this.tool==='room')this.draft={id:uid('obj'),type:'room',x:p.x,y:p.y,w:1,h:1,layerId:this.map.activeLayerId}
    else this.draft={id:uid('obj'),type:this.tool,x:p.x,y:p.y,x2:p.x,y2:p.y,layerId:this.map.activeLayerId}
    this.map.objects.push(this.draft);this.render()
  }
  move(e){
    if(this.mode==='pan'&&this.last){this.panX+=e.clientX-this.last.x;this.panY+=e.clientY-this.last.y;this.last={x:e.clientX,y:e.clientY};this.render();return}
    const raw=this.world(e),p=this.snap(raw)
    if(this.mode==='draw'&&this.draft&&this.start){if(this.draft.type==='room'){this.draft.x=Math.min(this.start.x,p.x);this.draft.y=Math.min(this.start.y,p.y);this.draft.w=Math.max(1,Math.abs(p.x-this.start.x));this.draft.h=Math.max(1,Math.abs(p.y-this.start.y))}else{this.draft.x2=p.x;this.draft.y2=p.y}this.render();return}
    const o=this.selected();if(!o||!this.start)return
    if(this.mode==='drag'){
      const dx=raw.x-this.start.x,dy=raw.y-this.start.y,base=this.start.base
      if(['wall','road','river'].includes(o.type)){o.x=base.x+dx;o.y=base.y+dy;o.x2=base.x2+dx;o.y2=base.y2+dy}else{o.x=base.x+dx;o.y=base.y+dy}this.render()
    }else if(this.mode==='resize'){
      const base=this.start.base, dx=raw.x-this.start.x,dy=raw.y-this.start.y
      if(o.type==='room'){o.w=Math.max(10,base.w+dx);o.h=Math.max(10,base.h+dy)}else if(o.type==='door'){o.w=Math.max(10,base.w+dx);o.h=Math.max(5,base.h+dy)}else if(['tree','mountain','settlement'].includes(o.type)){o.size=Math.max(15,(base.size||50)+Math.max(dx,dy))}else if(o.type==='text'){o.size=Math.max(10,(base.size||28)+Math.max(dx,dy)*.2)}this.render()
    }
  }
  up(){if(this.mode==='draw'||this.mode==='drag'||this.mode==='resize')this.commit();this.mode=null;this.start=null;this.draft=null;if(this.tool==='pan')this.canvas.style.cursor='grab';else this.canvas.style.cursor=this.tool==='select'?'default':'crosshair'}
  dbl(e){const o=this.hit(this.world(e));if(o?.type==='text'&&!lockedLayer(this.map,o.layerId)){const t=prompt('Изменить подпись:',o.text);if(t!==null){o.text=t;this.commit()}}}
  key(e){if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();e.shiftKey?this.redo():this.undo();return}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='y'){e.preventDefault();this.redo();return}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='d'){e.preventDefault();this.duplicate();return}
    if(e.key==='Delete'||e.key==='Backspace'){if(this.selectedId){e.preventDefault();this.deleteSelection()}}
  }
  selected(){return this.map.objects.find(o=>o.id===this.selectedId)||null}
  hit(p){for(let i=this.map.objects.length-1;i>=0;i--){const o=this.map.objects[i];if(!visibleLayer(this.map,o.layerId))continue;if(this.hitObject(o,p))return o}return null}
  hitObject(o,p){
    if(['wall','road','river'].includes(o.type)){const d=pointLineDistance(p.x,p.y,o.x,o.y,o.x2,o.y2);return d<(o.type==='wall'?10:15)/Math.max(this.zoom,.3)}
    const b=bounds(o);return p.x>=b.x-5&&p.x<=b.x+b.w+5&&p.y>=b.y-5&&p.y<=b.y+b.h+5
  }
  render(){
    const ctx=this.ctx,d=this.dpr,cw=this.canvas.width/d,ch=this.canvas.height/d;ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,cw,ch);ctx.save();ctx.translate(this.panX,this.panY);ctx.scale(this.zoom,this.zoom)
    const w=this.map.settings.columns*this.map.settings.cellSize,h=this.map.settings.rows*this.map.settings.cellSize;ctx.shadowColor='rgba(0,0,0,.35)';ctx.shadowBlur=30/this.zoom;ctx.shadowOffsetY=10/this.zoom;ctx.fillStyle=this.map.settings.background;ctx.fillRect(0,0,w,h);ctx.shadowColor='transparent';drawGrid(ctx,this.map);ctx.strokeStyle='rgba(66,53,39,.55)';ctx.lineWidth=2/this.zoom;ctx.strokeRect(0,0,w,h)
    this.map.objects.forEach(o=>{if(visibleLayer(this.map,o.layerId))renderObject(ctx,o,o.id===this.selectedId)});ctx.restore()
  }
  commit(){this.map.updatedAt=now();const snap=JSON.stringify(this.map.objects);if(this.history[this.historyIndex]!==snap){this.history=this.history.slice(0,this.historyIndex+1);this.history.push(snap);if(this.history.length>80)this.history.shift();this.historyIndex=this.history.length-1}this.scheduleSave();this.render()}
  scheduleSave(){clearTimeout(this.saveTimer);this.saveTimer=setTimeout(()=>this.onChange?.(this.map),180)}
  undo(){if(this.historyIndex<=0)return;this.historyIndex--;this.map.objects=JSON.parse(this.history[this.historyIndex]);this.selectedId=null;this.scheduleSave();this.render()}
  redo(){if(this.historyIndex>=this.history.length-1)return;this.historyIndex++;this.map.objects=JSON.parse(this.history[this.historyIndex]);this.selectedId=null;this.scheduleSave();this.render()}
  deleteSelection(){const i=this.map.objects.findIndex(o=>o.id===this.selectedId);if(i>=0){this.map.objects.splice(i,1);this.selectedId=null;this.onSelection?.(false);this.commit()}}
  duplicate(){const o=this.selected();if(!o)return;const c=deep(o);c.id=uid('obj');if(['wall','road','river'].includes(c.type)){c.x+=20;c.y+=20;c.x2+=20;c.y2+=20}else{c.x+=20;c.y+=20}c.layerId=this.map.activeLayerId;this.map.objects.push(c);this.selectedId=c.id;this.commit()}
}
function pointLineDistance(px,py,x1,y1,x2,y2){const A=px-x1,B=py-y1,C=x2-x1,D=y2-y1,den=C*C+D*D;let t=den?clamp((A*C+B*D)/den,0,1):0;return Math.hypot(px-(x1+t*C),py-(y1+t*D))}

