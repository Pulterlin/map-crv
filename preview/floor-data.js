// Each building supplies its own source drawing and hit areas; the floor viewer is shared.
const zone=(id,name,temp,x,y,w,h,note='')=>({id,name,temp,x,y,w,h,note,type:'zone'});
const aZones=[
 zone('station-dispatch','发运工作站','workstation',377,944,125,37),
 zone('station-tally','理货工作站','workstation',1245,944,125,37),
 zone('station-receiving','收货工作站','workstation',1015,1068,100,35),
 zone('social-label-side','社超电子标签分播区（侧区）','ambient',383,701,55,230),
 zone('buffer-rear-right','收发暂存区（后穿堂右侧）','ambient',1245,988,84,55),
 zone('returns','退货暂存区','ambient',657,270,99,34),
 zone('packing','仓调暂存区','ambient',520,314,235,34),
 zone('receiving-front','收货区（仓调）','ambient',765,265,380,85),
 zone('forklift','叉车存放区','support',1150,249,105,82),
 zone('buffer-front-left','收发暂存区（前穿堂西侧）','ambient',491,392,361,64),
 zone('buffer-front-right','收发暂存区（前穿堂东侧）','ambient',1016,392,374,64),
 zone('social-label-ambient','社超电子标签分播区（恒温）','ambient',443,486,83,392),
 zone('social-produce','社超蔬菜水果分播区','ambient',540,486,211,390),
 zone('general-bread','综超面包分播区','ambient',769,486,58,390),
 zone('general-vegetable','综超蔬菜分播区','ambient',844,486,127,390),
 zone('general-fruit-east','综超水果分播区（东侧）','ambient',988,486,105,390),
 zone('cold-sorting','分播区（冷藏）','cold',1263,499,105,396),
 zone('social-label-cold','社超电子标签分播区（冷藏）','cold',1118,499,120,396),
 zone('cold-storage','存储区（冷藏）','cold',1409,489,64,148),
 zone('cold-meat','冷藏肉制品分播区','cold',1410,647,107,249),
 zone('receiving-social','收货区/发货区（社超蔬菜水果、面包、鸡蛋）','ambient',377,985,384,61),
 zone('buffer-rear','收发暂存区（后穿堂）','ambient',508,958,684,24),
 zone('buffer-rear-east','收发暂存区（后穿堂东侧）','ambient',1115,988,74,55),
 zone('high-value','高值库（巧克力、红酒）','ambient',1400,946,140,100),
 zone('receiving-extension','收货区/发货区（综超蔬菜水果、冷藏品）','ambient',1009,1062,530,115,'位于A栋一楼后穿堂外扩部分。')
];
// Four larger end docks and twelve smaller central docks share a consistent clear gap.
const frontWidths=Array.from({length:16},(_,i)=>i<2||i>13?88:54);
const frontGap=10;
let frontCursor=381.5;
const frontDocks=frontWidths.map((w,i)=>{const x=frontCursor;frontCursor+=w+frontGap;return {id:'dock'+(i+1),number:i+1,type:'dock',name:'A'+(i+1)+'号码头',group:'前穿堂',photo:'A栋1楼前穿堂.jpg',x,y:215,w,h:33};});
const rearMain=[30,29,28,27].map((number,i)=>({id:'dock'+number,number,type:'dock',name:'A'+number+'号码头',group:'后穿堂·主楼侧',photo:'A栋1楼后穿堂.jpg',x:370+i*34,y:1081,w:32,h:37}));
const rearExtension=Array.from({length:9},(_,i)=>({id:'dock'+(26-i),number:26-i,type:'dock',name:'A'+(26-i)+'号码头',group:'后穿堂·一楼外扩侧',photo:'A栋1楼后穿堂.jpg',x:1018+i*61,y:1201,w:52,h:43}));
const endDock={id:'dock17',number:17,type:'dock',name:'A17号码头',group:'后穿堂·一楼外扩端面',photo:'A栋1楼后穿堂.jpg',x:1545,y:1151,w:49,h:29};
// Original rack-bank positions, with all four long aisles and the cross aisle clear.
const c8Zone=(id,name,x,y,w,h,note='')=>({...zone(id,name,'frozen',x,y,w,h,note),temperature:'−18℃'});
const c8Zones=[
 c8Zone('c8-work-frozen','理货作业区（速冻食品、雪糕）',78,85,70,640,'相邻拣货位与分播区合并为理货作业区。'),
 ...[['n',85,280,'上部'],['s',475,250,'下部']].flatMap(([part,y,h,position])=>[
  c8Zone('c8-work-seafood-'+part,'理货作业区（水产·'+position+'）',270,y,70,h,'水产拣货位与综超分播区合并；外围通道保留。'),
  c8Zone('c8-work-meat-'+part,'理货作业区（熟食、肉类·'+position+'）',466,y,150,h,'熟食、肉类相邻货架的拣货位与社超分播区合并。')
 ]),
 c8Zone('c8-work-bakery','理货作业区（烘焙）',746,85,145,280,'相邻烘焙拣货位与社超分播区合并。'),
 c8Zone('c8-buffer','收发暂存区 / 第三方业务存储区',746,475,145,250,'同一区块承担收发暂存与第三方业务存储。'),
 c8Zone('c8-bakery-east','烘焙拣货位',1010,85,65,640,'原图最右侧两排均为烘焙拣货位，合并为一个区块。'),
 {...zone('c8-vestibule','穿堂（0–4℃）','cold',665,758,410,194),lines:['穿堂','0–4℃','2个码头'],temperature:'0–4℃',outline:'M650 738H1090V868L650 983Z'},
 zone('c8-charging','叉车充电间','support',1090,578,265,290,'位于穿堂右侧，由穿堂最右端的门进入。')
];
const dZones=[
 zone('d-storage-west','冷藏存储区（西侧）','cold',110,88,82,884),
 zone('d-storage-midwest','冷藏存储区（中西侧）','cold',250,88,126,680),
 zone('d-storage-mideast','冷藏存储区（中东侧）','cold',440,88,126,680),
 zone('d-storage-east','冷藏存储区（东侧）','cold',622,88,60,884),
 {...zone('d-buffer','收发暂存区','cold',250,798,316,158),outline:'M250 798H334V956H250Z M442 798H566V916H442Z'},
 zone('d-returns','退货区','cold',452,935,144,42),
 zone('d-workstation','工作站','workstation',110,1010,140,38),
 zone('d-charging','充电区','support',110,1065,95,105)
];
export const floorPlans={
 d:{building:'d',buildingName:'D栋',title:'D栋·冷藏库平面图',floor:'1F',subtitle:'冷藏库 0–4℃ · 穿堂 · D6 / D7 / D8 码头',viewBox:[40,20,810,1320],zones:dZones.map(z=>z.temp==='cold'?{...z,temperature:'0–4℃'}:z),docks:[6,7,8].map((n,i)=>({id:'d-dock'+n,number:'D'+n,name:'D'+n+'码头',type:'dock',group:'D栋穿堂',x:156+i*194,y:1196,w:92,h:42})),note:'依据所提供图纸的右侧冷藏库绘制；尺寸为导览示意。'},
 c8:{building:'c8',buildingName:'C栋',title:'C栋·8号库平面图',floor:'8号库',subtitle:'冷冻库 −18℃ · 穿堂 0–4℃ · C9 / C10 码头',viewBox:[25,15,1375,1030],zones:c8Zones,docks:[{id:'c9',number:'C9',name:'C9码头',type:'dock',group:'8号库穿堂',x:590,y:810,w:56,h:40},{id:'c10',number:'C10',name:'C10码头',type:'dock',group:'8号库穿堂',x:590,y:911,w:56,h:40}],note:'依据提供的分区截图与C栋图绘制；尺寸为导览示意。'},
 a:{building:'a',buildingName:'A栋',title:'A栋·一楼功能区',floor:'1F',subtitle:'恒温 15℃ · 冷藏 −18℃ · 30个卸货码头',viewBox:[325,165,1280,1160],zones:aZones.map(z=>({...z,...(z.temp==='ambient'?{temperature:'15℃'}:z.temp==='cold'?{temperature:'−18℃'}:{})})),docks:[...frontDocks,...rearMain,...rearExtension,endDock],routes:{visitor:{name:'参观路线',path:'M1582 464 H980 V350 H731 V465 H765 V495 H530 V900 H1183 V965 H1228 V1120 H1582',start:[1582,464],end:[1582,1120]}},note:'依据一楼平面图绘制，保留库板分隔与通道；尺寸为导览示意。'}
};




