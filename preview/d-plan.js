export function drawD({diagram,plan,svg,nodes,choose}){
 diagram.classList.add('d-plan');
 const text=(parent,x,y,value,cls='d-zone-text')=>{const t=svg('text',{x,y,class:cls});t.textContent=value;parent.append(t);};
 diagram.append(svg('path',{d:'M90 65H702V1190H90Z',class:'plan-slab'}));
 text(diagram,90,43,'D栋 · 冷藏库','plan-caption');
 text(diagram,702,43,'0–4℃','d-temp-caption');
 for(const z of plan.zones){
  const g=svg('g',{class:'floor-zone '+z.temp,'data-id':z.id,role:'button',tabindex:0,'aria-label':z.name});
  g.append(svg(z.outline?'path':'rect',z.outline?{d:z.outline}:{x:z.x,y:z.y,width:z.w,height:z.h,rx:0}));
  if(z.id.startsWith('d-storage-')){
   Array.from('冷藏存储区').forEach((character,i)=>text(g,z.x+z.w/2,z.y+z.h/2+(i-2)*48,character,'d-storage-text'));
  }else if(z.id==='d-buffer'){
   for(const [x,y] of [[292,867],[504,855]])['收发','暂存区'].forEach((line,i)=>text(g,x,y+i*26,line));
  }else if(z.id==='d-charging'){
   ['充','电','区'].forEach((line,i)=>text(g,z.x+z.w/2,z.y+25+i*28,line));
  }else text(g,z.x+z.w/2,z.y+z.h/2,z.name);
  g.onclick=()=>choose(z);
  g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(z);}};
  diagram.append(g);nodes.set(z.id,g);
 }
 // Keep the central aisle clear from the front cold-room door to the racks.
 text(diagram,388,883,'通','d-aisle-label');text(diagram,388,909,'道','d-aisle-label');
 // External stair beside the right-hand doors, as in the supplied crop.
 diagram.append(svg('rect',{x:714,y:890,width:105,height:105,class:'plan-support'}));
 for(let y=902;y<989;y+=10)diagram.append(svg('path',{d:`M723 ${y}H810`,class:'stair-tread'}));
 text(diagram,766,876,'楼梯','plan-room-label');
 const platform=svg('g',{role:'img','aria-label':'东侧平台'});
 platform.append(svg('rect',{x:702,y:1010,width:140,height:180,class:'plan-support'}));
 text(platform,772,1100,'平台','plan-room-label');diagram.append(platform);
 text(diagram,430,1100,'穿堂','d-hall-label');
 // The lower hall continues to the omitted west half of the building.
 for(const d of ['M90 65H702V1065 M702 1135V1190H90','M90 65V995H339 M429 995H702'])diagram.append(svg('path',{d,class:'plan-wall'}));
 const door=(x,y,width,vertical,name)=>{
  const g=svg('g',{class:'plan-door',role:'img','aria-label':name,transform:`translate(${x} ${y})${vertical?' rotate(90)':''}`});
  const half=width/2;
  g.append(svg('rect',{x:-half,y:-8,width,height:16,fill:'#FAFBF7'}));
  g.append(svg('path',{d:`M${-half} -6H${half} M${-half} 6H${half}`,class:'door-track'}));
  g.append(svg('path',{d:`M${-half} 0H-2 M2 2H${half}`,class:'door-leaf'}));
  g.append(svg('path',{d:`M${-half+7} -3L${-half+3} 0L${-half+7} 3 M${half-7} -1L${half-3} 2L${half-7} 5`,class:'door-track'}));
  diagram.append(g);
 };
 door(384,995,90,false,'冷藏库正面库门');
 door(702,1100,70,true,'东侧平台门');
 for(const d of plan.docks){
  const g=svg('g',{class:'floor-dock','data-id':d.id,role:'button',tabindex:0,'aria-label':d.name});
  g.append(svg('rect',{x:d.x,y:d.y,width:d.w,height:d.h,rx:0}));
  text(g,d.x+d.w/2,d.y+d.h/2,d.number,'d-dock-label');
  g.onclick=()=>choose(d);g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(d);}};
  diagram.append(g);nodes.set(d.id,g);
 }
 text(diagram,90,1290,'穿堂 · D6–D8 码头','plan-caption');
}
