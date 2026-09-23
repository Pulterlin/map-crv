// Layout follows the user's annotated satellite reference. Local units are illustrative,
// not surveyed metres. x: toward the rear corridor; z: toward B/C buildings.
export const COLORS = {green:0x18605a, blue:0x1f4082, sand:0xb6b19e};
export const buildings = [
  {id:'a',name:'A 栋',x:0,z:0,w:64,d:112,h:23,color:0x18605a},
  {id:'b',name:'B 栋',x:-4,z:146,w:65,d:88,h:20,color:0xb6b19e},
  {id:'d',name:'D 栋冷冻库',x:-100,z:-41,w:56,d:63,h:25,color:0x1f4082},
  {id:'office',name:'办公楼',x:79,z:158,w:33,d:99,h:29,color:0xb6b19e},
  {id:'rear-sheds',name:'后穿堂配套',x:70,z:0,w:24,d:111,h:9,color:0xc3c4b5},
  ...[8,7,6,5].map((n,i)=>({id:'c'+n,name:n+'号库',x:-50+i*40,z:220,w:39.5,d:35,h:14,color:n===8?0x1f4082:0x8294b1}))
];
export const places = [
  {id:'a',name:'A 栋',short:'A',kind:'building',subtitle:'主要作业区域',x:0,z:0,y:26,description:'园区主要作业建筑。前穿堂设 1–16 号码头，后穿堂设 17–30 号码头。',tags:['前穿堂 16 个码头','后穿堂 14 个码头'],groups:['front','rear']},
  {id:'front',name:'A 栋前穿堂',short:'前',kind:'dock',subtitle:'1–16 号 · 两端大码头',x:-42,z:0,y:3,photo:'A栋1楼前穿堂.jpg',description:'从充电站端向单据室端依次为 1–16 号。1–2、15–16 号为大码头，3–14 号为小码头。',tags:['1–2 / 15–16 大码头','3–14 小码头'],groups:['front']},
  {id:'rear',name:'A 栋后穿堂',short:'后',kind:'dock',subtitle:'17–26 号 / 27–30 号两组',x:45,z:0,y:3,photo:'A栋1楼后穿堂.jpg',description:'17 号从洗筐区端起向 B 栋方向递增。17–26 号与 27–30 号按现场标注分为两组。',tags:['17–26 号','27–30 号'],groups:['rear']},
  {id:'c8',name:'C 栋 · 8 号库',short:'8',kind:'cold',subtitle:'冷冻库 · 重点目的地',x:-50,z:220,y:17,photo:'C栋冷冻库.jpg',description:'C 栋冷冻库靠截图左上端的库区，作为主要目的地突出显示。沿建筑依次为 8、7、6、5 号库。',tags:['C 栋冷冻库','8 号库'],photoNote:'照片为原 C 栋冷冻库参考照片，非单独的 8 号库照片。'},
  ...[7,6,5].map((n,i)=>({id:'c'+n,name:'C 栋 · '+n+' 号库',short:String(n),kind:'cold',subtitle:'C 栋冷冻库',x:-10+i*40,z:220,y:17,photo:'C栋冷冻库.jpg',description:'C 栋冷冻库 '+n+' 号库，库区边界为示意划分。',tags:['C 栋冷冻库'],photoNote:'照片为原 C 栋冷冻库参考照片。'})),
  {id:'d',name:'D 栋冷冻库',short:'D',kind:'cold',subtitle:'靠西北门一侧',x:-100,z:-41,y:28,photo:'D栋冷冻库.jpg',description:'位于 A 栋前穿堂一侧的独立冷冻库。',tags:['独立库栋','冷冻区域']},
  {id:'documents',name:'单据室',short:'单',kind:'service',subtitle:'A 栋内部 · 靠前穿堂末端',x:-18,z:-43,y:26,photo:'单据室.jpg',description:'单据室已位于 A 栋内部，此处标记其所在区域，不再作为独立建筑展示。',tags:['A 栋内部'],photoNote:'沿用原单据室照片；搬迁后的现场外观请以实际为准。'},
  {id:'wash',name:'洗筐区',short:'洗',kind:'service',subtitle:'A 栋外侧 · 靠 17 号端',x:23,z:-76,y:2,photo:'洗筐区.jpg',description:'位于 A 栋外侧的室外作业区域，靠近后穿堂 17 号码头端。',tags:['室外作业区域']},
  {id:'office',name:'办公楼',short:'办',kind:'service',subtitle:'B 栋旁的长条建筑',x:79,z:158,y:32,photo:'办公楼.jpg',description:'位于园区办公配套区域，可查看现场照片辅助识别。',tags:['办公配套']},
  {id:'b',name:'B 栋',short:'B',kind:'building',subtitle:'A 栋与 C 栋之间',x:-4,z:146,y:23,description:'位于 A 栋与 C 栋之间的独立建筑，作为园区定位参照。',tags:['园区建筑']},
  {id:'road1',name:'通行道 1',short:'路',kind:'road',subtitle:'原图通行道 · 查看实景',x:-63,z:35,y:1,photo:'通行道1.jpg',description:'对应原地图前穿堂端的通行道 1。此处展示道路及原有实景照片，不提供未经核实的行车路线。',tags:['前穿堂侧','道路示意']},
  {id:'road2',name:'通行道 2',short:'路',kind:'road',subtitle:'前穿堂沿线',x:-57,z:-22,y:1,photo:'通行道2.jpg',description:'对应原地图前穿堂沿线的通行道 2，可查看原有道路照片。',tags:['前穿堂沿线','道路示意']},
  {id:'road3',name:'通行道 3',short:'路',kind:'road',subtitle:'A / B 栋之间',x:4,z:86,y:1,photo:'通行道3.jpg',description:'对应原地图中央通道延伸至后穿堂端的路段，具体路段边界为示意。',tags:['道路示意']},
  {id:'road4',name:'通行道 4',short:'路',kind:'road',subtitle:'后穿堂与办公区域连接处',x:53,z:111,y:1,photo:'通行道4.jpg',description:'对应原地图办公楼一侧的通行道 4，可查看原有实景照片。',tags:['办公区域','道路示意']}
];
// Larger front docks bookend twelve smaller docks. Gap units are illustrative.
const widths=Array.from({length:16},(_,i)=>i<2||i>13?8.5:5.1);
const total=widths.reduce((a,b)=>a+b,0)+15*.9;
let cursor=total/2;
export const docks=widths.map((width,i)=>{const z=cursor-width/2;cursor-=width+.9;return {id:'dock'+(i+1),number:i+1,name:'A'+(i+1)+' 号码头',short:String(i+1),kind:'dock',group:'front',x:-37.5,z,y:2.4,width,depth:10,large:i<2||i>13};});
for(let n=17;n<=30;n++){const second=n>=27;docks.push({id:'dock'+n,number:n,name:'A'+n+' 号码头',short:String(n),kind:'dock',group:'rear',x:second?64:38,z:second?30+(n-27)*7:-49+(n-17)*7,y:2.4,width:5.8,depth:9,large:false});}
for(const dock of docks){dock.subtitle=(dock.group==='front'?'前穿堂':'后穿堂')+(dock.large?' · 大码头':'');dock.description=dock.group==='front'?'前穿堂 '+dock.number+' 号码头。编号从充电站端向单据室端递增。':'后穿堂 '+dock.number+' 号码头，位于 '+(dock.number<=26?'17–26':'27–30')+' 号分组。';dock.photo=dock.group==='front'?'A栋1楼前穿堂.jpg':'A栋1楼后穿堂.jpg';dock.photoNote='照片为对应穿堂的区域参考，并非该码头单独照片。';dock.tags=[dock.group==='front'?'前穿堂':'后穿堂',dock.group==='front'?(dock.large?'大码头':'小码头'):(dock.number<=26?'17–26 号组':'27–30 号组')];}
export const allPlaces=[...places,...docks];
export const contacts=[['DC 负责人 · 徐先生','13510195897'],['收货部负责人 · 黄先生','15017911001'],['收货部','0755-89355300'],['第三方业务 · 成小姐','13798207749'],['投诉与建议 · 陈先生','18219206635']];
export function searchPlaces(query='',filter='all'){
  const q=query.toLowerCase().replace(/\s+/g,'');
  const exactDock=/^(?:a)?(\d+)(?:号码头|号|码头)?$/.exec(q);
  const source=q||filter==='dock'?allPlaces:places;
  return source.filter(p=>{
    if(filter==='dock'&&p.kind!=='dock')return false;
    if(filter==='cold'&&p.kind!=='cold')return false;
    if(filter==='service'&&p.kind!=='service')return false;
    if(!q)return true;
    if(exactDock)return p.number===Number(exactDock[1]);
    const hay=[p.name,p.subtitle,p.description,...(p.tags||[])].join('').toLowerCase().replace(/\s+/g,'');
    return hay.includes(q)||((q==='单证室')&&p.id==='documents');
  });
}
