export function drawC8({diagram,plan,svg,nodes,choose}){
 diagram.classList.add('c8-plan');
 const addText=(x,y,text,cls)=>{const t=svg('text',{x,y,class:cls});t.textContent=text;diagram.append(t);};
 diagram.append(svg('path',{d:'M65 65H1090V738H65Z',class:'c8-shell'}));
 addText(65,43,'C栋 · 8号库','plan-caption');
 addText(1090,43,'冷冻库 −18℃','c8-temp-caption');
 for(const z of plan.zones){
  const g=svg('g',{class:'floor-zone '+z.temp+' '+(z.rackType||''),'data-id':z.id,role:'button',tabindex:0,'aria-label':z.name});
  g.append(svg(z.outline?'path':'rect',z.outline?{d:z.outline}:{x:z.x,y:z.y,width:z.w,height:z.h,rx:0}));
  if(z.outline){
   ['穿堂','0–4℃'].forEach((line,i)=>{const t=svg('text',{x:870,y:820+i*27,class:'c8-zone-text'});t.textContent=line;g.append(t);});
  }else if(z.id==='c8-buffer'){
   ['收发暂存区','第三方业务','存储区'].forEach((line,i)=>{const t=svg('text',{x:z.x+z.w/2,y:z.y+z.h/2+(i-1)*26,class:'c8-zone-text'});t.textContent=line;g.append(t);});
  }else if(z.w>100){
   ['理货','作业区'].forEach((line,i)=>{const t=svg('text',{x:z.x+z.w/2,y:z.y+z.h/2+(i-.5)*34,class:'c8-zone-text',style:'font-size:28px'});t.textContent=line;g.append(t);});
  }else{
   const label=z.id.startsWith('c8-work')?'理货作业区':z.name;
   const characters=Array.from(label);const leading=34;
   characters.forEach((character,i)=>{const t=svg('text',{x:z.x+z.w/2,y:z.y+z.h/2+(i-(characters.length-1)/2)*leading,class:'c8-rack-text',style:'font-size:28px'});t.textContent=character;g.append(t);});
  }

  g.onclick=()=>choose(z);g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(z);}};diagram.append(g);nodes.set(z.id,g);
 }
 // This clear aisle aligns with the 90-wide warehouse door and joins the cross aisle.
 for(const [i,character] of ['通','道'].entries())addText(945,561+i*24,character,'c8-access-label');
 // The ramp runs right into the vestibule above C9; the warehouse entry is farther east.
 diagram.append(svg('rect',{x:550,y:758,width:100,height:47,class:'c8-ramp'}));
 diagram.append(svg('path',{d:'M565 781H633 M622 772L633 781L622 790',class:'c8-ramp-arrow'}));
 addText(535,787,'斜坡','c8-ramp-label');
 // Reuse A's sliding-door symbol for both confirmed entrances.
 const drawDoor=(x,y,width,vertical,name)=>{
  const g=svg('g',{class:'plan-door',role:'img','aria-label':name,transform:`translate(${x} ${y})${vertical?' rotate(90)':''}`});
  const half=width/2;
  g.append(svg('rect',{x:-half,y:-8,width,height:16,fill:'#FAFBF7'}));
  g.append(svg('path',{d:`M${-half} -6H${half} M${-half} 6H${half}`,class:'door-track'}));
  g.append(svg('path',{d:`M${-half} 0H-2 M2 2H${half}`,class:'door-leaf'}));
  g.append(svg('path',{d:`M${-half+7} -3L${-half+3} 0L${-half+7} 3 M${half-7} -1L${half-3} 2L${half-7} 5`,class:'door-track'}));
  diagram.append(g);
 };
 drawDoor(650,781.5,47,true,'斜坡进入穿堂的门');
 drawDoor(945,738,90,false,'穿堂进入8号库的门');
 for(const d of plan.docks){
  const g=svg('g',{class:'floor-dock','data-id':d.id,role:'button',tabindex:0,'aria-label':d.name});g.append(svg('rect',{x:d.x,y:d.y,width:d.w,height:d.h,rx:0}));const t=svg('text',{x:d.x+d.w/2,y:d.y+d.h/2});t.textContent=d.number;g.append(t);g.onclick=()=>choose(d);g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(d);}};diagram.append(g);nodes.set(d.id,g);
 }
 addText(650,1020,'穿堂 · C9 / C10 码头','plan-caption');
}
