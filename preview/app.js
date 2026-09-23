import {places,docks,allPlaces,contacts,searchPlaces} from './data.js?v=docks-86';
const $=id=>document.getElementById(id);
let map=null,selected=null,filter='all',lastTrigger=null;
const kindNames={building:'园区建筑',dock:'卸货码头',cold:'冷链库区',service:'园区服务',road:'园区道路'};
function list(){
  const results=searchPlaces($('search').value,filter);$('result-count').textContent=results.length+'个';
  $('place-list').replaceChildren();
  if(!results.length){const p=document.createElement('p');p.className='empty';p.textContent='没有找到该地点，试试“A17”或“8号库”。';$('place-list').append(p);return;}
  for(const place of results){const button=document.createElement('button');button.className='place'+(selected?.id===place.id?' selected':'');button.dataset.id=place.id;button.dataset.kind=place.kind;button.setAttribute('aria-pressed',String(selected?.id===place.id));
    const icon=document.createElement('span');icon.className='place-icon';icon.textContent=place.short;
    const copy=document.createElement('span');copy.className='place-copy';const title=document.createElement('strong');title.textContent=place.name;const sub=document.createElement('small');sub.textContent=place.subtitle;copy.append(title,sub);
    const arrow=document.createElement('span');arrow.className='place-arrow';arrow.textContent='↗';button.append(icon,copy,arrow);button.onclick=()=>select(place.id,button);$('place-list').append(button);}
}
function select(id,trigger){
  const p=allPlaces.find(p=>p.id===id);if(!p)return;selected=p;lastTrigger=trigger||document.activeElement;
  $('detail').hidden=false;$('detail-kind').textContent=kindNames[p.kind];$('detail-title').textContent=p.name;$('detail-description').textContent=p.description;
  $('detail-tags').replaceChildren(...(p.tags||[]).map(t=>{const s=document.createElement('span');s.textContent=t;return s;}));
  $('photo-button').hidden=!p.photo;$('photo-note').textContent=p.photoNote||'';$('dock-picker').replaceChildren();
  for(const group of p.groups||[]){const title=document.createElement('div');title.className='dock-group-title';title.textContent=group==='front'?'前穿堂·1–16号':'后穿堂·17–30号';const grid=document.createElement('div');grid.className='dock-grid';for(const dock of docks.filter(d=>d.group===group)){const b=document.createElement('button');b.textContent='A'+dock.number;b.setAttribute('aria-label',dock.name);b.onclick=()=>select(dock.id,b);grid.append(b);}$('dock-picker').append(title,grid);}
  $('map-title').textContent=p.name;$('map-subtitle').textContent=p.subtitle;$('announcement').textContent='已选择'+p.name;map?.select(id);list();
}
function closeDetail(){selected=null;$('detail').hidden=true;$('map-title').textContent='园区全景';$('map-subtitle').textContent='建筑·库区·卸货码头';map?.clear();list();if(lastTrigger?.isConnected)lastTrigger.focus();}
$('search').addEventListener('input',list);$('search').addEventListener('keydown',e=>{if(e.key==='Enter'){const first=searchPlaces(e.target.value,filter)[0];if(first)select(first.id,e.target);}});
for(const b of document.querySelectorAll('[data-filter]'))b.onclick=()=>{filter=b.dataset.filter;for(const x of document.querySelectorAll('[data-filter]')){x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));}list();};
$('detail-close').onclick=closeDetail;
function view(top){map?.view(top);$('view-top').classList.toggle('active',top);$('view-3d').classList.toggle('active',!top);$('view-top').setAttribute('aria-pressed',String(top));$('view-3d').setAttribute('aria-pressed',String(!top));}
$('view-top').onclick=()=>view(true);$('view-3d').onclick=()=>view(false);$('zoom-in').onclick=()=>map?.zoom(1.25);$('zoom-out').onclick=()=>map?.zoom(.8);$('rotate').onclick=()=>map?.rotate();$('reset').onclick=()=>{closeDetail();map?.reset();view(false);};$('retry').onclick=()=>location.reload();
const photo=$('photo');let photoRequest=0;
$('photo-button').onclick=()=>{if(!selected?.photo)return;const current=++photoRequest;$('photo-title').textContent=selected.name+'·现场参考';$('photo-status').hidden=false;$('photo-status').textContent='正在加载照片…';photo.hidden=true;photo.alt=selected.name+'区域参考照片';photo.onload=()=>{if(current!==photoRequest)return;photo.hidden=false;$('photo-status').hidden=true;};photo.onerror=()=>{if(current!==photoRequest)return;$('photo-status').textContent='照片暂时无法加载，请稍后重试。';};photo.src='./photos/'+selected.photo;$('photo-dialog').showModal();};
$('photo-close').onclick=()=>$('photo-dialog').close();$('contact-open').onclick=()=>$('contact-dialog').showModal();$('contact-close').onclick=()=>$('contact-dialog').close();
for(const dialog of document.querySelectorAll('dialog'))dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
for(const [name,tel]of contacts){const row=document.createElement('div');row.className='contact-row';const label=document.createElement('span');label.textContent=name;const link=document.createElement('a');link.textContent=tel;link.href='tel:'+tel;row.append(label,link);$('contacts').append(row);}
document.addEventListener('keydown',e=>{if(e.key==='/'&&!/input|textarea/i.test(e.target.tagName)&&!document.querySelector('dialog[open]')){e.preventDefault();$('search').focus();}if(e.key==='Escape'&&!document.querySelector('dialog[open]'))closeDetail();});
list();
try{const {createMap}=await import('./map.js?v=docks-86');map=createMap($('scene'),$('labels'),id=>select(id));$('loading').hidden=true;const initial=new URLSearchParams(location.search).get('place');if(initial)select(initial);}
catch(error){console.error('Map initialization failed',error);$('loading').hidden=true;$('map-error').hidden=false;for(const id of ['zoom-in','zoom-out','rotate','reset','view-top','view-3d'])$(id).disabled=true;}
