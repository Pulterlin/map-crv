import {floorPlans} from './floor-data.js?v=floor-100';

const $=id=>document.getElementById(id);
const building=new URLSearchParams(location.search).get('building')||'a';
const plan=floorPlans[building];
try{const arrival=JSON.parse(sessionStorage.getItem('mapcrv:floor-entry')||'null');sessionStorage.removeItem('mapcrv:floor-entry');if(arrival?.building===building&&Date.now()-arrival.at<7000){document.documentElement.classList.add('floor-arrival');setTimeout(()=>document.documentElement.classList.remove('floor-arrival'),1250);}}catch{}
const svgNS='http://www.w3.org/2000/svg';
const svg=(tag,attrs={})=>{const node=document.createElementNS(svgNS,tag);for(const [key,value] of Object.entries(attrs))node.setAttribute(key,String(value));return node;};

if(!plan){$('floor-title').textContent='暂未提供该栋平面图';$('floor-subtitle').textContent='返回园区全景查看现有信息。';$('floor-board-title').textContent='暂无平面图';}
else{
 document.title=plan.title+'·深圳生鲜配送中心';
 $('building-crumb').textContent=plan.buildingName;$('floor-crumb').textContent=plan.floor;$('floor-title').textContent=plan.title;$('floor-subtitle').textContent=plan.subtitle;$('floor-badge').textContent=plan.floor;$('floor-board-title').textContent=plan.buildingName+plan.floor;$('floor-note').textContent=plan.note;
 const all=[...plan.zones,...plan.docks],nodes=new Map();let selected=null,filter='all',zoom=1;
 const diagram=$('floor-svg');
 const [viewX,viewY,viewW,viewH]=plan.viewBox;
 diagram.setAttribute('viewBox',plan.viewBox.join(' '));
 diagram.classList.add('redrawn-plan');
 diagram.append(svg('path',{d:'M370 246H1543V1178H1005V1058H370Z',transform:'translate(0 20)',class:'plan-slab-side'}));
 diagram.append(svg('path',{d:'M370 246H1543V1178H1005V1058H370Z',class:'plan-slab'}));
 const annotation=(x,y,text,cls='plan-caption')=>{const node=svg('text',{x,y,class:cls});node.textContent=text;diagram.append(node);};
 annotation(390,200,'前穿堂 · 1–16号码头');annotation(390,1130,'后穿堂 · 27–30号码头');
 annotation(1030,1250,'一楼外扩 · 后穿堂');
 for(const [x,y,w,h,label] of [[374,375,62,112,'楼梯'],[1426,369,112,114,'单据室'],[374,505,62,190,'楼梯'],[1484,503,55,137,'楼梯'],[965,991,136,65,'楼梯']]){
  diagram.append(svg('rect',{x,y,width:w,height:h,rx:3,class:'plan-support'}));annotation(x+w/2,y+h/2,label,'plan-room-label');
 }
 for(const z of plan.zones){
  const g=svg('g',{class:'floor-zone '+z.temp,'data-id':z.id,role:'button',tabindex:'0','aria-label':z.name});
  g.append(svg('rect',{x:z.x,y:z.y,width:z.w,height:z.h,rx:6}));
  const short=z.name.replace(/（.*?）/g,'').replace('社超电子标签分播区','社超电子标签').replace('冷藏肉制品分播区','冷藏肉制品').replace('收发暂存区','收发暂存').replace('综超蔬菜水果、冷藏肉、冷藏品','收货区');
  const chars=z.w<90?3:z.w<150?5:z.w<250?7:14;
  const names={
   'social-label-side':['社超','电子','标签'],
   'social-label-ambient':['社超','电子标签'],
   'social-produce':['社超蔬菜水果','分播区'],
   'general-bread':['综超','面包','分播区'],
   'general-fruit-west':['综超','水果','分播区'],
   'general-vegetable':['综超','蔬菜','分播区'],
   'general-fruit-east':['综超水果','分播区'],
   'social-label-cold':['社超电子','标签分播'],
   'cold-meat':['冷藏肉制品','分播区'],
   'receiving-front':['收货区','仓调·面包·鸡蛋'],
   'receiving-social':['收货区 · 社超蔬菜水果'],
   'receiving-extension':['收货区','综超蔬菜水果·冷藏肉·冷藏品'],
   'high-value':['高值库','巧克力·红酒']
  };
  const lines=names[z.id]||short.match(new RegExp('.{1,'+chars+'}','g'))||[short];
  lines.forEach((line,i)=>{const t=svg('text',{x:z.x+z.w/2,y:z.y+z.h/2+(i-(lines.length-1)/2)*22+6});t.textContent=line;g.append(t);});
  g.addEventListener('click',()=>choose(z));g.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();choose(z);}});diagram.append(g);nodes.set(z.id,g);
 }
 for(const d of plan.docks){
  const g=svg('g',{class:'floor-dock','data-id':d.id,role:'button',tabindex:'0','aria-label':d.name});g.append(svg('rect',{x:d.x,y:d.y,width:d.w,height:d.h,rx:4}));const t=svg('text',{x:d.x+d.w/2,y:d.y+d.h/2});t.textContent=d.number;g.append(t);g.addEventListener('click',()=>choose(d));g.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();choose(d);}});diagram.append(g);nodes.set(d.id,g);
 }
 // Structural partitions stay separate from functional zones; gaps represent openings.
 for(const d of ['M370 250V368H486V490H440V696H370V1058H765 M955 1058H1005V1178H1543V250','M370 250H1543','M486 375H650 M742 375H1100 M1100 375H1390','M1100 494H1418 M1100 494V890 M1100 920V940','M1378 660V895 M1378 925V1058','M1390 645H1543','M370 938H505 M545 938H704 M758 938H960 M1000 938H1156 M1210 938H1418 M1468 938H1543','M1426 369H1543 M1426 369V436 M1426 468V493H1543','M765 1058V995H950V1058','M1005 1058H1193 M1253 1058H1332 M1455 1058H1543']){
  diagram.append(svg('path',{d,transform:'translate(0 12)',class:'plan-wall-side'}));
  diagram.append(svg('path',{d,class:'plan-wall'}));
 }
 // Sliding-door positions follow the yellow door marks on the 0924 CAD plan.
 // Centers are aligned to equivalent wall runs in this clean redraw.
 const doors=[
  {x:550,y:250,width:46,sliding:true,name:'前穿堂平移门'},
  {x:625,y:250,width:46,sliding:true,name:'前穿堂平移门'},
  {x:1271,y:250,width:46,sliding:true,name:'前穿堂平移门'},
  {x:1345,y:250,width:46,sliding:true,name:'前穿堂平移门'},
  {x:370,y:430,width:48,vertical:true,sliding:true,name:'西侧平移门'},
  {x:486,y:430,width:48,vertical:true,sliding:true,name:'西侧平移门'},
  {x:1426,y:430,width:48,vertical:true,sliding:true,name:'东侧平移门'},
  {x:1543,y:430,width:48,vertical:true,sliding:true,name:'东侧平移门'},
  {x:440,y:635,width:62,vertical:true,sliding:true,name:'西侧平移门'},
  {x:1543,y:635,width:62,vertical:true,sliding:true,name:'东侧平移门'},
  {x:1050,y:1178,width:58,sliding:true,name:'后穿堂平移门'}
 ];
 for(const door of doors){
  const g=svg('g',{class:'plan-door',transform:'translate('+door.x+' '+door.y+')'+(door.vertical?' rotate(90)':''),role:'img','aria-label':door.name});
  const title=svg('title');title.textContent=door.name;g.append(title);
  const half=(door.width||38)/2;
  g.append(svg('rect',{x:-half,y:-8,width:half*2,height:20,fill:'#fafbf7'}));
  if(door.sliding){
   g.append(svg('path',{d:`M${-half} -6H${half} M${-half} 6H${half}`,class:'door-track'}));
   g.append(svg('path',{d:`M${-half} 0H-2 M2 2H${half}`,class:'door-leaf'}));
   g.append(svg('path',{d:`M${-half+7} -3L${-half+3} 0L${-half+7} 3 M${half-7} -1L${half-3} 2L${half-7} 5`,class:'door-track'}));
  }else{
   g.append(svg('path',{d:'M-18 0V-18 M18 0V-18',class:'door-leaf'}));
   g.append(svg('path',{d:'M-18 -18A18 18 0 0 1 0 0 M18 -18A18 18 0 0 0 0 0',class:'door-swing'}));
  }
  diagram.append(g);
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
 function renderList(){const q=$('floor-search').value.trim().toLowerCase().replace(/\s+/g,'');const items=all.filter(item=>(filter==='all'||item.type===filter)&&(!q||(item.name+(item.temp||'')).toLowerCase().replace(/\s+/g,'').includes(q)));$('floor-count').textContent=items.length+'个';$('floor-list').replaceChildren();for(const item of items){const button=document.createElement('button');button.dataset.type=item.type;if(item.temp)button.dataset.temp=item.temp;button.classList.toggle('selected',selected?.id===item.id);const icon=document.createElement('span');icon.className='floor-list-icon';icon.textContent=item.type==='dock'?String(item.number):item.temp==='cold'?'冷':item.temp==='support'?'配':'恒';const copy=document.createElement('span');copy.textContent=item.name;button.append(icon,copy);button.onclick=()=>choose(item,true);$('floor-list').append(button);}}
 function choose(item,scrollTo=false){selected=item;for(const [id,node] of nodes)node.classList.toggle('selected',id===item.id);const info=$('floor-info');info.replaceChildren();const eyebrow=document.createElement('span');eyebrow.className='eyebrow';eyebrow.textContent=item.type==='dock'?'LOADING DOCK':'FUNCTIONAL ZONE';const heading=document.createElement('h2');heading.textContent=item.name;info.append(eyebrow,heading);if(item.type==='dock'){const group=document.createElement('span');group.className='floor-temp';group.textContent=item.group;const desc=document.createElement('p');desc.textContent=item.note||'码头位置依据'+plan.buildingName+'一楼平面图标注。';info.append(group,desc);}else{const temp=document.createElement('span');temp.className='floor-temp'+(item.temp==='cold'?' cold':'');temp.textContent=item.temp==='cold'?'冷藏区':item.temp==='support'?'配套区域':'恒温区';const desc=document.createElement('p');desc.textContent=item.note||'区域位置依据'+plan.buildingName+'一楼平面图绘制。';info.append(temp,desc);}if(item.photo){const photo=document.createElement('img');photo.src='./photos/'+item.photo;photo.alt=item.name+'现场参考照片';photo.loading='lazy';photo.onerror=()=>photo.remove();info.append(photo);if(item.photoNote||item.type==='dock'){const note=document.createElement('small');note.textContent=item.photoNote||'穿堂区域参考照片，非该码头单独照片。';info.append(note);}}renderList();if(scrollTo){const viewport=$('floor-viewport'),scale=diagram.clientWidth/viewW;viewport.scrollLeft=Math.max(0,(item.x-viewX+item.w/2)*scale-viewport.clientWidth/2);viewport.scrollTop=Math.max(0,(item.y-viewY+item.h/2)*scale-viewport.clientHeight/2);}}
 let pitch=16,yaw=-.6,panX=0,panY=0,activePointers=new Map(),gesture=null,suppressClick=false;
 function applyView(){diagram.style.setProperty('--floor-pitch',pitch+'deg');diagram.style.setProperty('--floor-yaw',yaw+'deg');diagram.style.setProperty('--floor-pan-x',panX+'px');diagram.style.setProperty('--floor-pan-y',panY+'px');$('floor-view-3d').classList.toggle('active',pitch>2);$('floor-view-top').classList.toggle('active',pitch<=2);$('floor-view-3d').setAttribute('aria-pressed',String(pitch>2));$('floor-view-top').setAttribute('aria-pressed',String(pitch<=2));}
 function setZoom(value){zoom=Math.max(.3,Math.min(2,value));diagram.style.width=Math.round(viewW*zoom)+'px';diagram.style.height=Math.round(viewH*zoom)+'px';}
 function fitZoom(){const a=yaw*Math.PI/180,p=pitch*Math.PI/180,w=Math.abs(Math.cos(a))*viewW+Math.abs(Math.sin(a))*viewH*Math.cos(p),h=Math.abs(Math.sin(a))*viewW+Math.abs(Math.cos(a))*viewH*Math.cos(p);return Math.min(viewport.clientWidth/w,viewport.clientHeight/h);}
 $('floor-zoom-in').onclick=()=>setZoom(zoom*1.25);$('floor-zoom-out').onclick=()=>setZoom(zoom/1.25);$('floor-fit').onclick=()=>{pitch=16;yaw=-.6;panX=0;panY=0;applyView();setZoom(fitZoom());};
 $('floor-view-3d').onclick=()=>{pitch=16;applyView();};$('floor-view-top').onclick=()=>{pitch=0;applyView();};$('floor-rotate').onclick=()=>{yaw=(yaw+45)%360;applyView();};
 const viewport=$('floor-viewport');
 viewport.addEventListener('pointerdown',event=>{
  activePointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
  if(activePointers.size===1){const pan=event.button===1||event.button===2||event.shiftKey;gesture={id:event.pointerId,x:event.clientX,y:event.clientY,lastX:event.clientX,lastY:event.clientY,button:event.button,mode:pan?'pan':'orbit',moved:false};try{event.target.setPointerCapture(event.pointerId);}catch{}}
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
   if(gesture.mode==='pan'){panX+=dx;panY+=dy;applyView();}
   else{yaw+=dx*.42;pitch=Math.max(0,Math.min(58,pitch+dy*.28));applyView();}
   gesture.lastX=event.clientX;gesture.lastY=event.clientY;
  }
 });
 const endGesture=event=>{activePointers.delete(event.pointerId);if(gesture?.moved&&gesture.button===0){suppressClick=true;setTimeout(()=>{suppressClick=false;},0);}if(activePointers.size===0){gesture=null;viewport.classList.remove('is-dragging');}else if(activePointers.size===1){const [id,p]=[...activePointers.entries()][0];gesture={id,x:p.x,y:p.y,lastX:p.x,lastY:p.y,button:0,mode:'orbit',moved:true};}};
 viewport.addEventListener('pointerup',endGesture);viewport.addEventListener('pointercancel',endGesture);viewport.addEventListener('contextmenu',event=>event.preventDefault());
 viewport.addEventListener('click',event=>{if(suppressClick){event.preventDefault();event.stopPropagation();suppressClick=false;}},true);
 viewport.addEventListener('wheel',event=>{event.preventDefault();setZoom(zoom*Math.exp(-event.deltaY*.001));},{passive:false});
 $('floor-search').addEventListener('input',renderList);for(const button of document.querySelectorAll('[data-floor-filter]'))button.onclick=()=>{filter=button.dataset.floorFilter;for(const other of document.querySelectorAll('[data-floor-filter]')){other.classList.toggle('active',other===button);other.setAttribute('aria-pressed',String(other===button));}renderList();};
 applyView();
 setZoom(fitZoom());renderList();const initial=new URLSearchParams(location.search).get('place');if(initial){const item=all.find(value=>value.id===initial);if(item)choose(item,true);}
}













