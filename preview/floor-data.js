// Each building supplies its own source drawing and hit areas; the floor viewer is shared.
const zone=(id,name,temp,x,y,w,h,note='')=>({id,name,temp,x,y,w,h,note,type:'zone'});
const aZones=[
 zone('social-label-side','社超电子标签分播区（侧区）','ambient',383,701,55,230),
 zone('buffer-rear-right','收发暂存区（后穿堂右侧）','ambient',1245,988,84,55),
 zone('returns','退货暂存区','ambient',657,249,99,40),
 zone('packing','仓调暂存区','ambient',520,290,235,40),
 zone('receiving-front','收货区（仓调、面包、鸡蛋）','ambient',765,265,380,85),
 zone('forklift','叉车存放区','support',1150,249,105,82),
 zone('buffer-front-left','收发暂存区（前穿堂西侧）','ambient',491,392,361,64),
 zone('buffer-front-right','收发暂存区（前穿堂东侧）','ambient',965,392,425,64),
 zone('social-label-ambient','社超电子标签分播区（恒温）','ambient',443,486,83,392),
 zone('social-produce','社超蔬菜水果分播区','ambient',540,486,211,390),
 zone('general-bread','综超面包分播区','ambient',769,486,58,390),
 zone('general-fruit-west','综超水果分播区（西侧）','ambient',844,486,56,390),
 zone('general-vegetable','综超蔬菜分播区','ambient',916,486,55,390),
 zone('general-fruit-east','综超水果分播区（东侧）','ambient',988,486,105,390),
 zone('cold-sorting','分播区（冷藏）','cold',1118,499,120,396),
 zone('social-label-cold','社超电子标签分播区（冷藏）','cold',1263,499,105,396),
 zone('cold-storage','存储区（冷藏）','cold',1409,489,64,148),
 zone('cold-meat','冷藏肉制品分播区','cold',1410,647,107,249),
 zone('receiving-social','收货区（社超蔬菜水果）','ambient',377,985,384,61),
 zone('buffer-rear','收发暂存区（后穿堂）','ambient',508,942,684,41),
 zone('buffer-rear-east','收发暂存区（后穿堂东侧）','ambient',1115,988,74,55),
 zone('high-value','高值库（巧克力、红酒）','ambient',1400,946,140,100),
 zone('receiving-extension','收货区（综超蔬菜水果、冷藏肉、冷藏品）','ambient',1009,1062,530,115,'位于A栋一楼后穿堂外扩部分。')
];
// Four larger end docks and twelve smaller central docks share a consistent clear gap.
const frontWidths=Array.from({length:16},(_,i)=>i<2||i>13?88:54);
const frontGap=10;
let frontCursor=381.5;
const frontDocks=frontWidths.map((w,i)=>{const x=frontCursor;frontCursor+=w+frontGap;return {id:'dock'+(i+1),number:i+1,type:'dock',name:'A'+(i+1)+'号码头',group:'前穿堂',photo:'A栋1楼前穿堂.jpg',x,y:215,w,h:33};});
const rearMain=[30,29,28,27].map((number,i)=>({id:'dock'+number,number,type:'dock',name:'A'+number+'号码头',group:'后穿堂·主楼侧',photo:'A栋1楼后穿堂.jpg',x:370+i*34,y:1060,w:32,h:37}));
const rearExtension=Array.from({length:9},(_,i)=>({id:'dock'+(26-i),number:26-i,type:'dock',name:'A'+(26-i)+'号码头',group:'后穿堂·一楼外扩侧',photo:'A栋1楼后穿堂.jpg',x:1018+i*61,y:1179,w:52,h:43}));
const endDock={id:'dock17',number:17,type:'dock',name:'A17号码头',group:'后穿堂·一楼外扩端面',photo:'A栋1楼后穿堂.jpg',x:1545,y:1151,w:49,h:29};
export const floorPlans={
 a:{building:'a',buildingName:'A栋',title:'A栋·一楼功能区',floor:'1F',subtitle:'恒温与冷藏分区 · 30个卸货码头',viewBox:[325,165,1280,1110],zones:aZones,docks:[...frontDocks,...rearMain,...rearExtension,endDock],routes:{visitor:{name:'参观路线',path:'M1582 464 H1040 V350 H875 V465 H765 V495 H530 V900 H1183 V965 H1228 V1120 H1582',start:[1582,464],end:[1582,1120]}},note:'依据一楼平面图绘制，保留库板分隔与通道；尺寸为导览示意。'}
};




