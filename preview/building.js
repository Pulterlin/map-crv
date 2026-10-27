import {floorPlans} from './floor-data.js?v=20261027-a-codes-4';

const $=id=>document.getElementById(id);
const building=new URLSearchParams(location.search).get('building')||'a';
const plan=floorPlans[building];
try{const arrival=JSON.parse(sessionStorage.getItem('mapcrv:floor-entry')||'null');sessionStorage.removeItem('mapcrv:floor-entry');if(arrival?.building===building&&Date.now()-arrival.at<7000){document.documentElement.classList.add('floor-arrival');setTimeout(()=>document.documentElement.classList.remove('floor-arrival'),1250);}}catch{}
const svgNS='http://www.w3.org/2000/svg';
const svg=(tag,attrs={})=>{const node=document.createElementNS(svgNS,tag);for(const [key,value] of Object.entries(attrs))node.setAttribute(key,String(value));return node;};

if(!plan){$('floor-title').textContent='暂未提供该栋平面图';$('floor-subtitle').textContent='返回园区全景查看现有信息。';$('floor-board-title').textContent='暂无平面图';}
else{
 document.title=plan.title+'·深圳生鲜配送中心';
 $('building-crumb').textContent=plan.buildingName;$('floor-crumb').textContent=plan.floor;$('floor-title').textContent=plan.title;$('floor-subtitle').textContent=plan.subtitle;$('floor-badge').textContent=plan.floor;$('floor-board-title').textContent=plan.buildingName+(building==='c8'?'·8号库':plan.floor);$('floor-note').textContent=plan.note;
 const all=[...plan.zones,...plan.docks,...(plan.doors||[])],nodes=new Map();let selected=null,filter='all',zoom=1;
 const diagram=$('floor-svg');
 const [viewX,viewY,viewW,viewH]=plan.viewBox;
 diagram.setAttribute('viewBox',plan.viewBox.join(' '));
 diagram.classList.add('redrawn-plan');
 if(building==='d'){
  const {drawD}=await import('./d-plan.js?v=20261026-release-4');
  drawD({diagram,plan,svg,nodes,choose});
 }else if(building==='c8'){
  const {drawC8}=await import('./c8-plan.js?v=20261027-c8-1');
  drawC8({diagram,plan,svg,nodes,choose});
 }else{
 diagram.append(svg('path',{d:'M370 246H1543V1178H1005V1058H1105V985H950V995H765V1058H370Z',class:'plan-slab'}));
 const annotation=(x,y,text,cls='plan-caption')=>{const node=svg('text',{x,y,class:cls});node.textContent=text;diagram.append(node);};
 annotation(390,200,'前穿堂 · 1–16号码头');
 const dockCaption=(numbers,label)=>{const group=plan.docks.filter(d=>numbers.includes(d.number));annotation(Math.min(...group.map(d=>d.x)),Math.max(...group.map(d=>d.y+d.h))+46,label);};
 dockCaption([27,28,29,30],'后穿堂 · 27–30号码头');
 dockCaption([18,19,20,21,22,23,24,25,26],'一楼外扩 · 后穿堂');
 for(const [x,y,w,h,label] of [[374,375,38,78,''],[420,375,38,78,''],[1426,379,112,104,'单据室'],[374,645,38,47,'']]){
  diagram.append(svg('rect',{x,y,width:w,height:h,rx:3,class:'plan-support'}));annotation(x+w/2,y+h/2,label,'plan-room-label');
 }
 // One stair symbol is shared by all three external stairwells.
 const drawStair=(id,x,y,w,h,name)=>{
  const g=svg('g',{'data-stair':id,role:'img','aria-label':name});
  g.append(svg('rect',{x,y,width:w,height:h,rx:0,class:'plan-support'}));
  const vertical=h>w;
  const label=svg('text',{x:vertical?x+w/2:x+29,y:vertical?y+23:y+h/2,class:'plan-room-label'});label.textContent='楼梯';g.append(label);
  for(let i=0;i<9;i++){
   const t=vertical?y+41+i*(h-53)/8:x+57+i*(w-69)/8;
   g.append(svg('path',{d:vertical?`M${x+6} ${t}H${x+w-6}`:`M${t} ${y+7}V${y+h-7}`,class:'stair-tread'}));
  }
  g.append(svg('path',{d:vertical?`M${x+w/2} ${y+36}V${y+h-8}`:`M${x+52} ${y+h/2}H${x+w-8}`,class:'stair-tread'}));
  diagram.append(g);
 };
 drawStair('west',374,495,62,140,'西侧楼梯');
 drawStair('east',1484,503,55,137,'东侧楼梯');
 drawStair('rear',965,991,136,65,'后穿堂楼梯（库外）');
 for(const z of [...plan.zones].sort((a,b)=>(a.temp==='workstation')-(b.temp==='workstation'))){
  const g=svg('g',{class:'floor-zone '+z.temp,'data-id':z.id,role:'button',tabindex:'0','aria-label':z.name});
  g.append(svg('rect',{x:z.x,y:z.y,width:z.w,height:z.h,rx:6}));
  const short=z.name.replace(/（.*?）/g,'').replace('社超电子标签分播区','社超电子标签').replace('冷藏肉制品分播区','冷藏肉制品').replace('收发暂存区','收发暂存').replace('综超蔬菜水果、冷藏肉、冷藏品','收货区');
  const chars=z.w<90?3:z.w<150?5:z.w<250?7:14;
  const names={
   'social-label-side':['社超','电子','标签'],
   'social-label-ambient':['社超','电子标签'],
   'social-produce':['社超蔬菜水果','分播区'],
   'general-bread':['综超','面包','分播区'],
   'general-vegetable':['综超','蔬菜','分播区'],
   'general-fruit-east':['综超水果','分播区'],
   'social-label-cold':['社超电子','标签分播'],
   'cold-meat':['冷藏肉制品','分播区'],
   'receiving-front':['收货区','仓调'],
   'receiving-social':['收货区/发货区','社超蔬菜水果·面包·鸡蛋'],
   'receiving-extension':['收货区/发货区','综超蔬菜·综超水果·冷藏品'],
   'high-value':['高值库','巧克力·红酒']
  };
  const lines=names[z.id]||short.match(new RegExp('.{1,'+chars+'}','g'))||[short];
  lines.forEach((line,i)=>{const t=svg('text',{x:z.x+z.w/2,y:z.y+z.h/2+(i-(lines.length-1)/2)*22+6});t.textContent=line;g.append(t);});
  g.addEventListener('click',()=>choose(z));g.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();choose(z);}});diagram.append(g);nodes.set(z.id,g);
 }
 for(const d of plan.docks){
  const g=svg('g',{class:'floor-dock','data-id':d.id,role:'button',tabindex:'0','aria-label':d.name});g.append(svg('rect',{x:d.x,y:d.y,width:d.w,height:d.h,rx:4}));const t=svg('text',{x:d.x+d.w/2,y:d.y+d.h/2});t.textContent=d.code||d.number;if(d.code)t.setAttribute('class','a-dock-code');g.append(t);g.addEventListener('click',()=>choose(d));g.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();choose(d);}});diagram.append(g);nodes.set(d.id,g);
 }
 // Structural partitions stay separate from functional zones; gaps represent openings.
 for(const d of ['M370 250V318 M370 362V375H486 M440 490V696H370V1003 M370 1047V1058H765 M1005 1058V1178H1543V250','M370 250H1543','M370 375V696 M370 640H412V696','M486 375H717 M745 375H844 M872 375H960 M1000 375H1543','M1100 494H1156 M1210 494H1418 M1100 494V890 M1100 920V940','M1378 660V895 M1378 925V1058','M1390 645H1543','M370 938H505 M545 938H704 M758 938H1156 M1210 938H1294 M1322 938H1418 M1468 938H1543','M1426 375V416 M1426 444V493H1543','M765 1058V995H950','M1005 1058H1193 M1253 1058H1328 M1455 1058H1543']){
  diagram.append(svg('path',{d,class:'plan-wall'}));
 }
 diagram.append(svg('path',{d:'M370 490H391 M419 490H440',class:'plan-wall','data-boundary':'west-stair'}));
 diagram.append(svg('path',{d:'M950 995V985H1019 M1047 985H1105V1058',class:'plan-wall','data-boundary':'rear-stair'}));
 // Warehouse doors have blue numbered badges; safety doors use a hinged symbol.
 for(const door of plan.doors){
  const feature=svg('g',{class:'door-feature','data-id':door.id,'data-door-code':door.code||'',role:'button',tabindex:0,'aria-label':door.name});
  const g=svg('g',{class:'plan-door '+door.doorType+'-door',transform:`translate(${door.x} ${door.y})${door.vertical?' rotate(90)':''}`,role:'img','aria-label':door.name});
  const half=door.width/2;
  g.append(svg('rect',{x:-half,y:-8,width:door.width,height:20,fill:'#FAFBF7'}));
  if(door.doorType==='warehouse'){
   g.append(svg('path',{d:`M${-half} -6H${half} M${-half} 6H${half}`,class:'door-track'}));
   g.append(svg('path',{d:`M${-half} 0H-2 M2 2H${half}`,class:'door-leaf'}));
   g.append(svg('path',{d:`M${-half+7} -3L${-half+3} 0L${-half+7} 3 M${half-7} -1L${half-3} 2L${half-7} 5`,class:'door-track'}));
  }else{
   g.append(svg('path',{d:'M-14 0H-10 M10 0H14 M-10 0V-20',class:'safety-leaf'}));
   g.append(svg('path',{d:'M-10 -20C1.05 -20 10 -11.05 10 0',class:'safety-swing'}));
  }
  feature.append(g);
  if(door.code){
   const tag=svg('g',{class:'warehouse-door-tag'});
   tag.append(svg('rect',{x:door.labelX-32,y:door.labelY-13,width:64,height:26,rx:0}));
   const t=svg('text',{x:door.labelX,y:door.labelY});t.textContent=door.code;tag.append(t);feature.append(tag);
  }
  feature.onclick=()=>choose(door);feature.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(door);}};
  diagram.append(feature);nodes.set(door.id,feature);
 }

 }
 if(building==='a'){document.querySelector('.floor-legend').innerHTML='<span><i class="ambient"></i>恒温区</span><span><i class="cold"></i>冷藏区</span><span><i class="support"></i>配套区域</span><span><i class="dock"></i>卸货码头 A01–A30</span><span><i class="warehouse-door"></i>库门 W01–W13</span><span><i class="safety-door"></i>安全门</span><span><i class="workstation"></i>工作站</span>';}
 if(building==='c8'){document.querySelector('.route-toolbar').hidden=true;$('floor-search').placeholder='搜索功能区或码头，如水产、C9';document.querySelector('.floor-legend').innerHTML='<span><i class="frozen"></i>冷冻区 −18℃</span><span><i class="cold"></i>穿堂 0–4℃</span><span><i class="support"></i>配套区域</span><span><i class="dock"></i>卸货码头</span>';diagram.setAttribute('aria-label','C栋8号库功能区与C9、C10码头俯视平面图');}
 if(building==='d'){
  document.querySelector('.route-toolbar').hidden=true;
  $('floor-search').placeholder='搜索功能区或码头，如退货区、D7';
  $('floor-search').setAttribute('aria-label','搜索D栋冷藏库功能区');
  document.querySelector('[data-floor-filter="dock"]').hidden=false;
  document.querySelector('.floor-legend').innerHTML='<span><i class="cold"></i>冷藏区 0–4℃</span><span><i class="support"></i>配套区域</span><span><i class="workstation"></i>工作站</span><span><i class="dock"></i>卸货码头</span>';
  diagram.setAttribute('aria-label','D栋右侧冷藏库俯视平面图');
 }
 const routeKinds=[['visitor','参观'],['employee','员工'],['supplier','供应商'],['driver','司机']];
 const routeLayer=svg('g',{class:'route-layer','aria-hidden':'true'});diagram.append(routeLayer);
 const routeButtons=new Map();
 function showRoute(kind){
  routeLayer.replaceChildren();
  for(const [key,button] of routeButtons){button.classList.toggle('active',key===kind);button.setAttribute('aria-pressed',String(key===kind));}
  const route=plan.routes?.[kind];
  if(!route){$('route-status').textContent=kind==='none'?'已关闭路线高亮':'这条路线待补充，请提供线路标注。';return;}
  routeLayer.append(svg('path',{d:route.path,class:'route-glow'}),svg('path',{d:route.path,class:'route-line'}));
  for(const point of [route.start,route.end])if(point)routeLayer.append(svg('circle',{cx:point[0],cy:point[1],r:10,class:'route-endpoint'}));
  $('route-status').textContent='';
 }
 for(const [key,label] of [...routeKinds,['none','关闭']]){const button=document.createElement('button');button.type='button';button.textContent=label;button.setAttribute('aria-pressed','false');button.onclick=()=>showRoute(key);$('route-options').append(button);routeButtons.set(key,button);}
 showRoute('none');
 function renderList(){const q=$('floor-search').value.trim().toLowerCase().replace(/\s+/g,'');const items=all.filter(item=>(filter==='all'||item.type===filter)&&(!q||(item.name+(item.temp||'')).toLowerCase().replace(/\s+/g,'').includes(q)));$('floor-count').textContent=items.length+'个';$('floor-list').replaceChildren();for(const item of items){const button=document.createElement('button');button.dataset.type=item.type;if(item.temp)button.dataset.temp=item.temp;button.classList.toggle('selected',selected?.id===item.id);const icon=document.createElement('span');icon.className='floor-list-icon';icon.textContent=item.type==='door'?(item.code||'安'):item.type==='dock'?String(item.code||item.number):item.temp==='cold'?'冷':item.temp==='support'?'配':item.temp==='workstation'?'工':item.temp==='frozen'?'冻':'恒';const copy=document.createElement('span');copy.textContent=item.name;button.append(icon,copy);button.onclick=()=>choose(item,true);$('floor-list').append(button);}}
 function choose(item,scrollTo=false){selected=item;for(const [id,node] of nodes)node.classList.toggle('selected',id===item.id);const info=$('floor-info');info.replaceChildren();const eyebrow=document.createElement('span');eyebrow.className='eyebrow';eyebrow.textContent=item.type==='door'?'DOOR':item.type==='dock'?'LOADING DOCK':'FUNCTIONAL ZONE';const heading=document.createElement('h2');heading.textContent=item.name;info.append(eyebrow,heading);if(item.type==='door'){const kind=document.createElement('span');kind.className='floor-temp';kind.textContent=item.doorType==='warehouse'?'库门':'安全门';const desc=document.createElement('p');desc.textContent=item.note;info.append(kind,desc);}else if(item.type==='dock'){const group=document.createElement('span');group.className='floor-temp';group.textContent=item.group;const desc=document.createElement('p');desc.textContent=item.note||'码头位置依据'+plan.buildingName+'一楼平面图标注。';info.append(group,desc);}else{const temp=document.createElement('span');temp.className='floor-temp'+(item.temp==='cold'?' cold':'');temp.textContent=item.temperature|| (item.temp==='cold'?'冷藏区':item.temp==='support'?'配套区域':item.temp==='workstation'?'工作站':'恒温区');const desc=document.createElement('p');desc.textContent=item.note||'区域位置依据'+plan.buildingName+(building==='c8'?'8号库':'一楼')+'平面图绘制。';info.append(temp,desc);}if(item.photo){const photo=document.createElement('img');photo.src='./photos/'+item.photo;photo.alt=item.name+'现场参考照片';photo.loading='lazy';photo.onerror=()=>photo.remove();info.append(photo);if(item.photoNote||item.type==='dock'){const note=document.createElement('small');note.textContent=item.photoNote||'穿堂区域参考照片，非该码头单独照片。';info.append(note);}}renderList();if(scrollTo){const viewport=$('floor-viewport'),scale=diagram.clientWidth/viewW;viewport.scrollLeft=Math.max(0,(item.x-viewX+item.w/2)*scale-viewport.clientWidth/2);viewport.scrollTop=Math.max(0,(item.y-viewY+item.h/2)*scale-viewport.clientHeight/2);}}
 let panX=0,panY=0,activePointers=new Map(),gesture=null,suppressClick=false;
 function applyView(){diagram.style.setProperty('--floor-pan-x',panX+'px');diagram.style.setProperty('--floor-pan-y',panY+'px');}
 function setZoom(value){zoom=Math.max(Math.min(.3,fitZoom()),Math.min(2,value));diagram.style.width=Math.round(viewW*zoom)+'px';diagram.style.height=Math.round(viewH*zoom)+'px';}
 function fitZoom(){return Math.min(viewport.clientWidth/viewW,viewport.clientHeight/viewH);}
 $('floor-zoom-in').onclick=()=>setZoom(zoom*1.25);$('floor-zoom-out').onclick=()=>setZoom(zoom/1.25);$('floor-fit').onclick=()=>{panX=0;panY=0;applyView();setZoom(fitZoom());viewport.scrollLeft=0;viewport.scrollTop=0;};
 const viewport=$('floor-viewport');
 viewport.addEventListener('pointerdown',event=>{
  activePointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
  if(activePointers.size===1){gesture={id:event.pointerId,x:event.clientX,y:event.clientY,lastX:event.clientX,lastY:event.clientY,button:event.button,mode:'pan',moved:false};try{event.target.setPointerCapture(event.pointerId);}catch{}}
  else if(activePointers.size===2){const points=[...activePointers.values()];gesture={mode:'pinch',distance:Math.hypot(points[0].x-points[1].x,points[0].y-points[1].y),zoom};}
  if(event.button!==0||event.pointerType==='touch')event.preventDefault();
 });
 viewport.addEventListener('pointermove',event=>{
  if(!activePointers.has(event.pointerId))return;
  activePointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
  if(activePointers.size>=2&&gesture?.mode==='pinch'){
   const points=[...activePointers.values()],distance=Math.hypot(points[0].x-points[1].x,points[0].y-points[1].y);
   if(gesture.distance>0)setZoom(gesture.zoom*distance/gesture.distance);
   return;
  }
  if(!gesture||gesture.id!==event.pointerId)return;
  const dx=event.clientX-gesture.lastX,dy=event.clientY-gesture.lastY;
  if(Math.hypot(event.clientX-gesture.x,event.clientY-gesture.y)>4){gesture.moved=true;viewport.classList.add('is-dragging');}
  if(gesture.moved){
   panX+=dx;panY+=dy;applyView();
   gesture.lastX=event.clientX;gesture.lastY=event.clientY;
  }
 });
 const endGesture=event=>{activePointers.delete(event.pointerId);if(gesture?.moved&&gesture.button===0){suppressClick=true;setTimeout(()=>{suppressClick=false;},0);}if(activePointers.size===0){gesture=null;viewport.classList.remove('is-dragging');}else if(activePointers.size===1){const [id,p]=[...activePointers.entries()][0];gesture={id,x:p.x,y:p.y,lastX:p.x,lastY:p.y,button:0,mode:'pan',moved:true};}};
 viewport.addEventListener('pointerup',endGesture);viewport.addEventListener('pointercancel',endGesture);viewport.addEventListener('contextmenu',event=>event.preventDefault());
 viewport.addEventListener('click',event=>{if(suppressClick){event.preventDefault();event.stopPropagation();suppressClick=false;}},true);
 viewport.addEventListener('wheel',event=>{event.preventDefault();setZoom(zoom*Math.exp(-event.deltaY*.001));},{passive:false});
 $('floor-search').addEventListener('input',renderList);for(const button of document.querySelectorAll('[data-floor-filter]'))button.onclick=()=>{filter=button.dataset.floorFilter;for(const other of document.querySelectorAll('[data-floor-filter]')){other.classList.toggle('active',other===button);other.setAttribute('aria-pressed',String(other===button));}renderList();};
 applyView();
 setZoom(fitZoom());renderList();const initial=new URLSearchParams(location.search).get('place');if(initial){const item=all.find(value=>value.id===initial);if(item)choose(item,true);}
}












