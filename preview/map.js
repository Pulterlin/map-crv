import * as THREE from 'three';
import {OrbitControls} from './vendor/OrbitControls.js';
import {buildings,places,docks,allPlaces,COLORS} from './data.js?v=floor-90';

export function createMap(container,labelLayer,onSelect){
 const scene=new THREE.Scene();scene.background=new THREE.Color('#eaf0e9');
 const camera=new THREE.PerspectiveCamera(36,1,1,1800);
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.0;container.append(renderer.domElement);
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.09;controls.minDistance=70;controls.maxDistance=900;controls.minPolarAngle=.03;controls.maxPolarAngle=Math.PI*.46;controls.screenSpacePanning=true;
 const hemi=new THREE.HemisphereLight(0xffffff,0xabb49c,1.8);scene.add(hemi);
 const sun=new THREE.DirectionalLight(0xfff5df,2.2);sun.position.set(-180,320,120);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-300,right:300,top:300,bottom:-300,near:1,far:750});sun.shadow.bias=-.0003;sun.shadow.normalBias=.5;sun.shadow.radius=3;sun.target.position.set(0,0,80);scene.add(sun,sun.target);
 const pickables=[],labels=[],objects=new Map(),disposables=[];
 const mat=(color,roughness=.85)=>new THREE.MeshStandardMaterial({color,roughness,metalness:0});
 const wallMat=mat(0xe8e8d9),roadMat=mat(0xaab5ad),curbMat=mat(0xe5e7db),glassMat=mat(0x7eaaa6),trunkMat=mat(0xa49c82),leafMat=mat(0x7d9a78);
 function box(w,h,d,x,y,z,material,id){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),id?material.clone():material);mesh.position.set(x,y,z);mesh.castShadow=h>2;mesh.receiveShadow=true;scene.add(mesh);if(id){mesh.userData.id=id;pickables.push(mesh);if(!objects.has(id))objects.set(id,[]);objects.get(id).push(mesh);}return mesh;}
 // Feather the site into its surroundings instead of ending at a hard slab edge.
 const groundCanvas=document.createElement('canvas');groundCanvas.width=groundCanvas.height=256;
 const groundContext=groundCanvas.getContext('2d');const groundPixels=groundContext.createImageData(256,256);
 for(let py=0;py<256;py++)for(let px=0;px<256;px++){
  const u=Math.abs((px+.5)/256-.5),v=Math.abs((py+.5)/256-.5);
  const fade=Math.max((u-.32)/.18,(v-.33)/.17,0);const t=Math.max(0,1-Math.min(fade,1));
  const offset=(py*256+px)*4;groundPixels.data[offset]=214;groundPixels.data[offset+1]=223;groundPixels.data[offset+2]=206;groundPixels.data[offset+3]=Math.round(255*t*t*(3-2*t));
 }
 groundContext.putImageData(groundPixels,0,0);
 const groundTexture=new THREE.CanvasTexture(groundCanvas);groundTexture.colorSpace=THREE.SRGBColorSpace;disposables.push(groundTexture);
 const ground=new THREE.Mesh(new THREE.PlaneGeometry(720,750),new THREE.MeshStandardMaterial({map:groundTexture,transparent:true,depthWrite:false,roughness:1,side:THREE.DoubleSide}));
 ground.rotation.x=-Math.PI/2;ground.position.set(-10,-.45,86);ground.receiveShadow=true;scene.add(ground);
 // Connected ground-level paths replace floating road rectangles.
 function road(x,z,w,d,id){box(w+3,.36,d+3,x,.2,z,curbMat);return box(w,.45,d,x,.4,z,roadMat,id);}
 road(-148,87,17,375);road(132,87,17,375);road(-8,260,294,17);road(-8,-95,294,16);
 // A schematic neighbourhood gives the site useful context without pretending to be a survey.
 road(-148,96,17,548);road(-8,260,530,17);road(132,96,17,548);
 road(-246,106,13,460);road(218,106,13,460);
 for(const z of [-151,14,130,348]){road(-197,z,100,12);road(175,z,86,12);}
 road(-55,-151,383,13);road(-45,348,400,13);
 const districtMat=mat(0xd9ded3),districtRoof=mat(0xe8e8dc);
 for(const [x,z,w,d] of [[-197,-66,57,72],[-196,74,64,72],[-198,192,63,74],[-201,307,54,52],[177,-62,54,70],[177,73,56,67],[178,195,55,70],[173,309,60,52],[-66,306,65,45],[33,307,73,43]]){
  box(w,.16,d,x,-.16,z,districtMat);box(w*.78,.2,d*.68,x,-.02,z,districtRoof);
 }
 road(-59,40,30,236,'road1');road(-57,-19,27,84,'road2');road(-39,82,218,26,'road3');road(48,139,20,136,'road4');road(48,-10,24,136,'rear');road(0,195,231,14);
 // Short neutral centre marks on perimeter roads; no unconfirmed direction arrows.
 const lineMat=mat(0xf3f2d9);for(const x of [-246,-148,132,218])for(let z=-165;z<365;z+=21)box(.6,.05,7,x,.69,z,lineMat);for(const z of [-151,260,348])for(let x=-254;x<232;x+=21)box(7,.05,.6,x,.69,z,lineMat);
 // Street names are printed on the asphalt, with transparent backgrounds and no DOM label boxes.
 function roadName(name,x,z,vertical=false){const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=224;const ctx=canvas.getContext('2d');ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='700 155px "Microsoft YaHei","PingFang SC",sans-serif';ctx.lineJoin='round';ctx.strokeStyle='rgba(245,248,237,.82)';ctx.lineWidth=11;ctx.strokeText(name,512,112);ctx.fillStyle='#3d625c';ctx.fillText(name,512,112);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;disposables.push(texture);const mesh=new THREE.Mesh(new THREE.PlaneGeometry(62,13),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,side:THREE.DoubleSide}));mesh.rotation.x=-Math.PI/2;if(vertical)mesh.rotateOnWorldAxis(new THREE.Vector3(0,1,0),Math.PI/2);mesh.position.set(x,.75,z);scene.add(mesh);}
 roadName('雪岗北路',-148,175,true);roadName('清祥路',-12,260);roadName('清祥路',-207,260);roadName('雪岗北路',-148,-117,true);
 for(const b of buildings){
  const accent=mat(b.color);box(b.w,b.h,b.d,b.x,b.h/2,b.z,wallMat,b.id);
  const roof=box(b.w+.8,1.6,b.d+.8,b.x,b.h+.8,b.z,accent,b.id);
  box(b.w+1,2.7,b.d+1,b.x,2.1,b.z,accent,b.id);
  // Roof seams give the warehouses a tangible, restrained architectural finish.
  const seamMat=mat(new THREE.Color(b.color).lerp(new THREE.Color(0xffffff),.17));
  for(let x=b.x-b.w/2+3;x<b.x+b.w/2;x+=4)box(.25,.2,b.d-3,x,b.h+1.7,b.z,seamMat);
  if(b.floors>1&&['a','b','office'].includes(b.id)){
   for(let floor=3;floor<b.h;floor+=4){for(let z=b.z-b.d/2+5;z<b.z+b.d/2-3;z+=9){box(.15,1.45,4,b.x+b.w/2+.1,floor,z,glassMat);box(.15,1.45,4,b.x-b.w/2-.1,floor,z,glassMat);}box(.22,.12,b.d-2,b.x+b.w/2+.12,floor+1.7,b.z,curbMat);box(.22,.12,b.d-2,b.x-b.w/2-.12,floor+1.7,b.z,curbMat);}
   if(b.id==='a'||b.id==='office')for(let k=0;k<3;k++)box(6,1.6,4,b.x+b.w*.18,b.h+2.4,b.z-b.d*.26+k*11,mat(0xd2d8cc));
  }
  roof.userData.baseColor=roof.material.color.clone();
 }
 // Front canopy and the two distinct rear loading groups.
 const canopy=mat(0xdbe2d6);box(3,.7,112,-33,5.1,0,canopy,'front');box(3,.7,51,63,5.1,-30,canopy,'rear');box(3,.7,25,33,5.1,40,canopy,'rear');
 const dockMat=mat(COLORS.green);const dockStripe=mat(0xf8f4dc);
 for(const dock of docks){const end=dock.orientation==='end';const mesh=box(end?dock.width:dock.depth,.6,end?dock.depth:dock.width,dock.x,.92,dock.z,dockMat.clone(),dock.id);mesh.userData.baseColor=mesh.material.color.clone();for(const edge of [-1,1]){if(end)box(.18,.09,dock.depth,dock.x+edge*dock.width/2,1.28,dock.z,dockStripe);else box(dock.depth,.09,.18,dock.x,1.28,dock.z+edge*dock.width/2,dockStripe);}if(end)box(dock.width,.09,.4,dock.x,1.28,dock.z-dock.depth/2,dockStripe);else box(.4,.09,dock.width,dock.x+(dock.group==='front'?-1:1)*dock.depth/2,1.28,dock.z,dockStripe);}
 // The document room is a marked zone on A, not a detached building.
 const documentZone=box(15,.35,17,-18,24.85,-43,mat(0xe8c887),'documents');
 box(42,.4,17,20,.85,-76,mat(0xb7cec0),'wash');for(let k=0;k<4;k++)box(3,1.4,3,9+k*6,1.75,-76,mat(0x729a8a));
 // Small contextual details. No animated vehicles or fictitious live data.
 for(let i=0;i<5;i++){const x=-109+i*10;box(5,.08,11,x,.8,135,mat(0xe4e8da));box(3.7,2,7,x,1.9,135,mat(i%2?0x7e9ca5:0xf4f3e8));}
 for(let z=-72;z<246;z+=19){tree(116,z);tree(-130,z+5);}for(let x=-118;x<116;x+=20)tree(x,246);
 function tree(x,z){box(1,4,1,x,2,z,trunkMat);const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(4.2,1),leafMat);crown.position.set(x,6,z);crown.scale.y=1.25;crown.castShadow=true;scene.add(crown);}
 // Charging bays near the front corridor entrance.
 for(let i=0;i<3;i++){box(8,.1,5,-88,.85,64+i*7,mat(0xa2c3ad));box(1.7,3.1,1.2,-94,2.2,64+i*7,mat(COLORS.green));}
 // The entrance road is one straight segment. A portal straddles it at the northwest end.
 const gateGreen=mat(COLORS.green),gateGold=mat(0xd6a446);
 box(2,11,2,-139,5.5,68,gateGreen,'gate');box(2,11,2,-139,5.5,96,gateGreen,'gate');
 box(2,2,30,-139,11,82,gateGreen,'gate');box(3,.65,25,-139,12.35,82,gateGold);
 box(7,.08,22,-139,.76,82,gateGold);
 labelLayer.removeAttribute('aria-hidden');
 function addLabel(p,text,kind=''){const interactive=allPlaces.some(place=>place.id===p.id);const node=document.createElement(interactive?'button':'span');node.className='map-label '+kind;node.textContent=text;if(interactive){node.tabIndex=-1;node.setAttribute('aria-label',p.name||text);node.onclick=()=>onSelect(p.id);}labelLayer.append(node);labels.push({p,node,point:new THREE.Vector3(p.x,p.y||3,p.z),kind});}
 for(const id of ['a','b','d','office','c8','documents','wash','front','rear']){const p=places.find(p=>p.id===id);addLabel(p,p.name,p.kind==='cold'?'cold':'');}
 for(const id of ['c7','c6','c5']){const p=places.find(p=>p.id===id);addLabel(p,p.short+'号库','minor cold');}
 for(const d of docks)addLabel(d,String(d.number),'dock');
 addLabel(places.find(p=>p.id==='gate'),'西北门','gate-label');
 let active=null,transition=null,top=false,dirty=true,frame=0;
 const homeTarget=new THREE.Vector3(-8,0,80),homeDirection=new THREE.Vector3(320,520,420).normalize();
 function homeDistance(){return Math.max(585,470/Math.max(camera.aspect,.52));}
 function move(target,position){transition={start:performance.now(),fromT:controls.target.clone(),toT:target.clone(),fromP:camera.position.clone(),toP:position.clone(),duration:matchMedia('(prefers-reduced-motion: reduce)').matches?0:700};dirty=true;}
 function reset(immediate=false){const position=homeTarget.clone().addScaledVector(homeDirection,homeDistance());if(immediate){camera.position.copy(position);controls.target.copy(homeTarget);controls.update();}else move(homeTarget,position);top=false;}
 function resize(){const w=container.clientWidth,h=container.clientHeight;if(!w||!h)return;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);if(!active)reset(true);dirty=true;}
 const observer=new ResizeObserver(resize);observer.observe(container);resize();
 const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();let down=null;
 renderer.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};transition=null;});
 renderer.domElement.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>6)return;down=null;const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(pickables,false).find(h=>allPlaces.some(p=>p.id===h.object.userData.id));if(hit)onSelect(hit.object.userData.id);});
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();document.getElementById('map-error').hidden=false;});
 controls.addEventListener('change',()=>dirty=true);controls.addEventListener('start',()=>transition=null);
 const projection=new THREE.Vector3();
 function labelPositions(){const width=container.clientWidth,height=container.clientHeight,distance=camera.position.distanceTo(controls.target),occupied=[];
  const ordered=[...labels].sort((a,b)=>(b.p.id===active?100:b.p.id==='gate'?90:b.kind.includes('dock')?0:10)-(a.p.id===active?100:a.p.id==='gate'?90:a.kind.includes('dock')?0:10));
  for(const l of ordered){const selected=l.p.id===active;const dockLabel=l.kind.includes('dock');let visible=true;
   if(dockLabel)visible=selected||distance<310;
   if(l.kind.includes('minor'))visible=selected||distance<520;
   projection.copy(l.point).project(camera);let x=(projection.x*.5+.5)*width,y=(-projection.y*.5+.5)*height;
   const gate=l.p.id==='gate';if(gate){x=THREE.MathUtils.clamp(x,55,width-55);y=THREE.MathUtils.clamp(y,85,height-36);}
   visible=visible&&projection.z>-1&&projection.z<1&&(gate||x>4&&x<width-4&&y>4&&y<height-4);
   l.node.classList.toggle('selected',selected);l.node.style.left=x+'px';l.node.style.top=y+'px';
   if(visible&&!dockLabel){const w=l.node.offsetWidth||35,h=l.node.offsetHeight||20;const rect={x:x-w/2,y:y-h/2,w:w+4,h:h+3};if(!selected&&!gate&&occupied.some(r=>rect.x<r.x+r.w&&rect.x+rect.w>r.x&&rect.y<r.y+r.h&&rect.y+rect.h>r.y))visible=false;else occupied.push(rect);}
   l.node.style.opacity=visible?'1':'0';l.node.style.pointerEvents=visible?'auto':'none';l.node.setAttribute('aria-hidden',String(!visible));
  }
 }
 function clear(){active=null;for(const meshes of objects.values())for(const m of meshes)if(m.material.emissive)m.material.emissive.setHex(0);dirty=true;}
 function select(id){clear();active=id;const p=allPlaces.find(p=>p.id===id);if(!p)return;for(const mesh of objects.get(id)||[])mesh.material.emissive.setHex(0x164133);const t=new THREE.Vector3(p.x,0,p.z);let distance=p.number?185:p.id==='a'?330:250;if(container.clientWidth<650)distance*=1.3;const direction=top?new THREE.Vector3(0,1,.015):camera.position.clone().sub(controls.target).normalize();move(t,t.clone().addScaledVector(direction,distance));dirty=true;}
 function animate(now){frame=requestAnimationFrame(animate);if(document.hidden)return;if(transition){const t=transition.duration===0?1:Math.min((now-transition.start)/transition.duration,1),ease=1-Math.pow(1-t,3);controls.target.lerpVectors(transition.fromT,transition.toT,ease);camera.position.lerpVectors(transition.fromP,transition.toP,ease);if(t===1)transition=null;dirty=true;}controls.update();if(dirty){renderer.render(scene,camera);labelPositions();dirty=false;}}
 frame=requestAnimationFrame(animate);
 return {select,clear,reset,zoom(factor){transition=null;const offset=camera.position.clone().sub(controls.target);offset.setLength(THREE.MathUtils.clamp(offset.length()/factor,70,900));camera.position.copy(controls.target).add(offset);controls.update();dirty=true;},view(value){top=value;const distance=camera.position.distanceTo(controls.target);const dir=top?new THREE.Vector3(0,1,.015).normalize():homeDirection;move(controls.target,controls.target.clone().addScaledVector(dir,distance));},rotate(){transition=null;const offset=camera.position.clone().sub(controls.target).applyAxisAngle(new THREE.Vector3(0,1,0),Math.PI/6);camera.position.copy(controls.target).add(offset);controls.update();dirty=true;},dispose(){cancelAnimationFrame(frame);observer.disconnect();controls.dispose();scene.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();}});for(const item of disposables)item.dispose();renderer.dispose();}};
}

