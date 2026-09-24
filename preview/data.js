// Layout follows the user's annotated satellite reference. Local units are illustrative,
// not surveyed metres. x: toward the rear corridor; z: toward B/C buildings.
export const COLORS = {green:0x18605a, blue:0x1f4082, sand:0xb6b19e};
export const buildings = [
  {id:'a',name:'A栋·恒温/冷藏',floors:6,x:0,z:0,w:64,d:112,h:24,color:0x18605a},
  {id:'a',name:'A栋1楼后穿堂外扩',floors:1,part:'ground-floor-extension',x:42,z:-30,w:20,d:52,h:4,color:0x2f7b70},
  {id:'b',name:'B栋',floors:6,x:-4,z:146,w:65,d:88,h:24,color:0xb6b19e},
  {id:'d',name:'D栋·冷藏',floors:1,x:-100,z:-41,w:56,d:63,h:6,color:0x1f4082},
  {id:'office',name:'办公楼',floors:6,x:80,z:137,w:30,d:60,h:24,color:0xb6b19e},
  ...[8,7,6,5].map((n,i)=>({id:'c'+n,name:n+'号库',floors:1,heightLabel:'約10米',x:-50+i*40,z:220,w:39.5,d:35,h:24,color:n===8?0x1f4082:0x8294b1}))
];
export const places = [
  {id:'a',name:'A栋·恒温/冷藏',short:'A',kind:'building',subtitle:'6层·恒温与冷藏区域',x:0,z:0,y:27,description:'6层建筑，设有恒温与冷藏区域。前穿堂设1–16号码头，后穿堂设17–30号码头。',tags:['6层','恒温/冷藏','前穿堂16个码头','后穿堂14个码头'],groups:['front','rear']},
  {id:'front',name:'A栋前穿堂',short:'前',kind:'dock',subtitle:'1–16号·两端大码头',x:-42,z:0,y:3,photo:'A栋1楼前穿堂.jpg',description:'从充电站端向单据室端依次为1–16号。1–2、15–16号为大码头，3–14号为小码头。',tags:['1–2/15–16大码头','3–14小码头'],groups:['front']},
  {id:'rear',name:'A栋后穿堂',short:'后',kind:'dock',subtitle:'17–26号/27–30号两组',x:55,z:-24,y:3,photo:'A栋1楼后穿堂.jpg',description:'17号位于一楼外扩端面，18–26号沿外扩段外侧排列，27–30号位于后穿堂另一端。',tags:['17–26号','27–30号','一楼外扩'],groups:['rear']},
  {id:'c8',name:'C栋8号库·冷冻',short:'8',kind:'cold',subtitle:'单层高库·约10米',x:-50,z:220,y:27,photo:'C栋冷冻库.jpg',description:'C栋为单层冷冻库，高约10米，视觉高度约相当于普通6层建筑。靠截图左上端的库区为8号库。沿建筑依次为8、7、6、5号库。',tags:['C栋·单层','约10米高','8号库·冷冻'],photoNote:'照片为原C栋冷冻库参考照片，非单独的8号库照片。'},
  ...[7,6,5].map((n,i)=>({id:'c'+n,name:'C栋·'+n+'号库',short:String(n),kind:'cold',subtitle:'C栋·单层约10米',x:-10+i*40,z:220,y:27,photo:'C栋冷冻库.jpg',description:'C栋单层高冷冻库约10米，视觉高度约相当于普通6层建筑。此处为'+n+'号库，库区边界为示意划分。',tags:['C栋·单层','约10米高'],photoNote:'照片为原C栋冷冻库参考照片。'})),
  {id:'d',name:'D栋·冷藏',short:'D',kind:'cold',subtitle:'1层·靠西北门一侧',x:-100,z:-41,y:10,photo:'D栋冷冻库.jpg',description:'1层冷藏库，位于A栋前穿堂一侧。',tags:['1层','独立库栋','冷藏区域']},
  {id:'documents',name:'单据室',short:'单',kind:'service',subtitle:'A栋内部·靠前穿堂末端',x:-18,z:-43,y:26,photo:'单据室.jpg',description:'单据室已位于A栋内部，此处标记其所在区域，不再作为独立建筑展示。',tags:['A栋内部'],photoNote:'沿用原单据室照片；搬迁后的现场外观请以实际为准。'},
  {id:'wash',name:'洗筐区',short:'洗',kind:'service',subtitle:'A栋外侧·靠17号端',x:23,z:-76,y:2,photo:'洗筐区.jpg',description:'位于A栋外侧的室外作业区域，靠近后穿堂17号码头端。',tags:['室外作业区域']},
  {id:'office',name:'办公楼',short:'办',kind:'service',subtitle:'6层·B栋上方',x:80,z:137,y:27,photo:'办公楼.jpg',description:'6层办公楼，位于B栋上方标注的区域，并与通行道留有间隔，可查看现场照片辅助识别。',tags:['6层','办公配套']},
  {id:'b',name:'B栋',short:'B',kind:'building',subtitle:'6层·A栋与C栋之间',x:-4,z:146,y:27,description:'6层建筑，位于A栋与C栋之间，作为园区定位参照。',tags:['6层','园区建筑']},
  {id:'gate',name:'西北门',short:'门',kind:'service',subtitle:'园区主入口',x:-139,z:82,y:14,description:'位于入园主路上的西北门，点击可快速定位到门架。',tags:['主入口','西北侧']},
  {id:'road1',name:'通行道1',short:'路',kind:'road',subtitle:'原图通行道·查看实景',x:-63,z:35,y:1,photo:'通行道1.jpg',description:'对应原地图前穿堂端的通行道1。此处展示道路及原有实景照片，不提供未经核实的行车路线。',tags:['前穿堂侧','道路示意']},
  {id:'road2',name:'通行道2',short:'路',kind:'road',subtitle:'前穿堂沿线',x:-57,z:-22,y:1,photo:'通行道2.jpg',description:'对应原地图前穿堂沿线的通行道2，可查看原有道路照片。',tags:['前穿堂沿线','道路示意']},
  {id:'road3',name:'通行道3',short:'路',kind:'road',subtitle:'A/B栋之间',x:4,z:86,y:1,photo:'通行道3.jpg',description:'对应原地图中央通道延伸至后穿堂端的路段，具体路段边界为示意。',tags:['道路示意']},
  {id:'road4',name:'通行道4',short:'路',kind:'road',subtitle:'后穿堂与办公区域连接处',x:53,z:111,y:1,photo:'通行道4.jpg',description:'对应原地图办公楼一侧的通行道4，可查看原有实景照片。',tags:['办公区域','道路示意']}
];
// Larger front docks bookend twelve smaller docks. Gap units are illustrative.
const widths=Array.from({length:16},(_,i)=>i<2||i>13?8.5:5.1);
const total=widths.reduce((a,b)=>a+b,0)+15*.9;
let cursor=total/2;
export const docks=widths.map((width,i)=>{const z=cursor-width/2;cursor-=width+.9;return {id:'dock'+(i+1),number:i+1,name:'A'+(i+1)+'号码头',short:String(i+1),kind:'dock',group:'front',x:-37.5,z,y:2.4,width,depth:10,large:i<2||i>13};});
for(let n=17;n<=30;n++){const mainRear=n>=27,endDock=n===17;docks.push({id:'dock'+n,number:n,name:'A'+n+'号码头',short:String(n),kind:'dock',group:'rear',x:mainRear?38:endDock?45:57,z:mainRear?31+(n-27)*6.1:endDock?-61:-51+(n-18)*5.75,y:2.4,width:mainRear?5.2:endDock?8:5,depth:9,orientation:endDock?'end':'side',large:false});}
for(const dock of docks){dock.subtitle=(dock.group==='front'?'前穿堂':'后穿堂')+(dock.large?'·大码头':'');dock.description=dock.group==='front'?'前穿堂'+dock.number+'号码头。编号从充电站端向单据室端递增。':'后穿堂'+dock.number+'号码头，位于'+(dock.number<=26?'17–26':'27–30')+'号分组。';dock.photo=dock.group==='front'?'A栋1楼前穿堂.jpg':'A栋1楼后穿堂.jpg';dock.photoNote='照片为对应穿堂的区域参考，并非该码头单独照片。';dock.tags=[dock.group==='front'?'前穿堂':'后穿堂',dock.group==='front'?(dock.large?'大码头':'小码头'):(dock.number<=26?'17–26号组':'27–30号组')];}
export const allPlaces=[...places,...docks];
export const contacts=[['DC负责人·徐先生','13510195897'],['收货部负责人·黄先生','15017911001'],['收货部','0755-89355300'],['第三方业务·成小姐','13798207749'],['投诉与建议·陈先生','18219206635']];
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
