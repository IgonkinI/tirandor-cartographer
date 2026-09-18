// ---------- shared drawing ----------
function drawGrid(ctx,map){
  if(!map.settings.gridVisible) return
  const w=map.settings.columns*map.settings.cellSize,h=map.settings.rows*map.settings.cellSize,c=map.settings.cellSize
  ctx.save();ctx.globalAlpha=map.settings.gridOpacity;ctx.strokeStyle='#4a4034';ctx.lineWidth=1
  if(map.settings.gridType==='square'){
    ctx.beginPath();for(let x=0;x<=w;x+=c){ctx.moveTo(x,0);ctx.lineTo(x,h)}for(let y=0;y<=h;y+=c){ctx.moveTo(0,y);ctx.lineTo(w,y)}ctx.stroke()
  }else drawHexGrid(ctx,w,h,c,map.settings.gridType==='hex-pointy')
  ctx.restore()
}
function drawHexGrid(ctx,w,h,c,pointy){
  const r=c/2,s3=Math.sqrt(3);ctx.beginPath()
  const hex=(cx,cy)=>{for(let i=0;i<6;i++){const a=(pointy?-Math.PI/2:0)+i*Math.PI/3,x=cx+r*Math.cos(a),y=cy+r*Math.sin(a);i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.closePath()}
  if(pointy){const sx=s3*r,sy=1.5*r;let row=0;for(let y=r;y<h+r;y+=sy,row++){const off=row%2?sx/2:0;for(let x=r+off;x<w+r;x+=sx)hex(x,y)}}
  else{const sx=1.5*r,sy=s3*r;let col=0;for(let x=r;x<w+r;x+=sx,col++){const off=col%2?sy/2:0;for(let y=r+off;y<h+r;y+=sy)hex(x,y)}}ctx.stroke()
}
function visibleLayer(map,id){const l=map.layers.find(x=>x.id===id);return !l||l.visible}
function lockedLayer(map,id){const l=map.layers.find(x=>x.id===id);return !!l?.locked}
function renderObject(ctx,o,selected=false){
  ctx.save();ctx.lineCap='round';ctx.lineJoin='round'
  if(o.type==='room'){
    ctx.fillStyle=o.fill||'#d8c7a1';ctx.strokeStyle=o.stroke||'#493c30';ctx.lineWidth=o.strokeWidth||3;ctx.fillRect(o.x,o.y,o.w,o.h);ctx.strokeRect(o.x,o.y,o.w,o.h)
  }else if(['wall','road','river'].includes(o.type)){
    ctx.strokeStyle=o.type==='wall'?'#342c26':o.type==='road'?'#8a6d4a':'#4d88a8';ctx.lineWidth=o.type==='wall'?7:o.type==='road'?10:12
    if(o.type==='road')ctx.setLineDash([18,10]);ctx.beginPath();ctx.moveTo(o.x,o.y);ctx.lineTo(o.x2,o.y2);ctx.stroke();ctx.setLineDash([])
  }else if(o.type==='text'){
    ctx.fillStyle='#2d261f';ctx.font=`600 ${o.size||28}px Georgia,serif`;ctx.textBaseline='top';ctx.fillText(o.text||'Подпись',o.x,o.y)
  }else if(o.type==='tree'){
    const s=o.size||50;ctx.fillStyle='#526244';ctx.strokeStyle='#33402b';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(o.x,o.y-s*.42);ctx.lineTo(o.x-s*.28,o.y+s*.20);ctx.lineTo(o.x+s*.28,o.y+s*.20);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#6f5139';ctx.fillRect(o.x-s*.06,o.y+s*.18,s*.12,s*.26)
  }else if(o.type==='mountain'){
    const s=o.size||55;ctx.fillStyle='#7a746a';ctx.strokeStyle='#4a463f';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(o.x,o.y-s*.45);ctx.lineTo(o.x-s*.48,o.y+s*.38);ctx.lineTo(o.x+s*.48,o.y+s*.38);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#eee8dc';ctx.beginPath();ctx.moveTo(o.x,o.y-s*.45);ctx.lineTo(o.x-s*.15,o.y-s*.18);ctx.lineTo(o.x+s*.14,o.y-s*.19);ctx.closePath();ctx.fill()
  }else if(o.type==='settlement'){
    const s=o.size||50;ctx.fillStyle='#c79a53';ctx.strokeStyle='#46372a';ctx.lineWidth=3;ctx.beginPath();ctx.arc(o.x,o.y,s*.18,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='#46372a';ctx.beginPath();ctx.arc(o.x,o.y,s*.055,0,Math.PI*2);ctx.fill()
  }else if(o.type==='door'){
    ctx.fillStyle='#a3703d';ctx.strokeStyle='#46311f';ctx.lineWidth=2;ctx.fillRect(o.x-o.w/2,o.y-o.h/2,o.w,o.h);ctx.strokeRect(o.x-o.w/2,o.y-o.h/2,o.w,o.h)
  }
  if(selected) drawSelection(ctx,o)
  ctx.restore()
}
function bounds(o,ctx=null){
  if(o.type==='room') return {x:o.x,y:o.y,w:o.w,h:o.h}
  if(['wall','road','river'].includes(o.type)) return {x:Math.min(o.x,o.x2),y:Math.min(o.y,o.y2),w:Math.abs(o.x2-o.x)||1,h:Math.abs(o.y2-o.y)||1}
  if(o.type==='text') {const w=(o.text?.length||7)*(o.size||28)*.58;return{x:o.x,y:o.y,w,h:(o.size||28)*1.2}}
  const s=o.size||50;if(o.type==='door')return{x:o.x-o.w/2,y:o.y-o.h/2,w:o.w,h:o.h};return{x:o.x-s*.55,y:o.y-s*.55,w:s*1.1,h:s*1.1}
}
function drawSelection(ctx,o){
  const b=bounds(o);ctx.save();ctx.strokeStyle='#c28e3c';ctx.lineWidth=2;ctx.setLineDash([7,5]);ctx.strokeRect(b.x-5,b.y-5,b.w+10,b.h+10);ctx.setLineDash([]);ctx.fillStyle='#f1d59a';ctx.strokeStyle='#4c3920';ctx.lineWidth=1.5;const hs=10;ctx.fillRect(b.x+b.w-hs/2,b.y+b.h-hs/2,hs,hs);ctx.strokeRect(b.x+b.w-hs/2,b.y+b.h-hs/2,hs,hs);ctx.restore()
}
function renderMapToCanvas(map,multiplier=2,forceGrid=false){
  const w=map.settings.columns*map.settings.cellSize,h=map.settings.rows*map.settings.cellSize
  const c=document.createElement('canvas');c.width=Math.round(w*multiplier);c.height=Math.round(h*multiplier);const ctx=c.getContext('2d');ctx.scale(multiplier,multiplier);ctx.fillStyle=map.settings.background;ctx.fillRect(0,0,w,h)
  const g=map.settings.gridVisible;if(forceGrid)map.settings.gridVisible=true;drawGrid(ctx,map);map.settings.gridVisible=g
  map.objects.filter(o=>visibleLayer(map,o.layerId)).forEach(o=>renderObject(ctx,o,false));return c
}

