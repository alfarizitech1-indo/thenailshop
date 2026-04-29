import React, { useState, useEffect } from "react";
import { Home, Calendar, ArrowLeftRight, User, Plus, Search, X, Check,
  Users, LogOut, Eye, EyeOff, AlertCircle, Sparkles, Shuffle, Edit3 } from "lucide-react";

/* ═══ LOCALSTORAGE HOOK ═══ */
function useLS(key, init) {
  const [s, setS] = useState(() => {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : (typeof init === "function" ? init() : init); }
    catch { return typeof init === "function" ? init() : init; }
  });
  const set = (v) => {
    try { const val = typeof v === "function" ? v(s) : v; setS(val); localStorage.setItem(key, JSON.stringify(val)); }
    catch(e) { console.error(e); }
  };
  return [s, set];
}

/* ═══ THEME ═══ */
const C = {
  bg:"#F8F1E7",card:"#FFFCF6",dark:"#1C0A02",brown:"#5C3020",
  med:"#8B5A3C",tan:"#C4936A",cream:"#EDD9B0",gold:"#C9960E",
  border:"#E0C89A",success:"#2D6E45",danger:"#8B2010",
  warning:"#A06010",text:"#1C0A02",textMed:"#5C3020",textLight:"#9B7050",
  white:"#FFFCF6",overlay:"rgba(28,10,2,0.6)"
};

const MONTHS=["","Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const DOW=["Min","Sen","Sel","Rab","Kam","Jum","Sab"];
const BRANCHES=["PIK","MOI","KOKAS","GC","CP","EMRO","LIPPO","GI","BW","OBP","SMS","MJ"];
const HOLIDAYS={5:[1,14,25]};

const getHols=(m)=>HOLIDAYS[m]||[];
const getDOW=(d,m,y)=>new Date(y,m-1,d).getDay();
const daysInMonth=(m,y)=>new Date(y,m,0).getDate();
const isPremium=(d,m,y)=>{const dw=getDOW(d,m,y);return dw===0||dw===5||dw===6||getHols(m).includes(d);};
const dayLabel=(d,m,y)=>{const h=getHols(m);const dw=getDOW(d,m,y);if(h.includes(d))return"Tgl Merah";if(dw===5)return"Jumat";if(dw===6)return"Sabtu";if(dw===0)return"Minggu";return DOW[dw];};

/* ═══ SCHEDULE GEN ═══ */
function seededRNG(seed){let s=seed>>>0;return()=>{s=(Math.imul(1664525,s)+1013904223)>>>0;return s/0xFFFFFFFF;};}

function generateSchedule(emps,month,year,bonus=0){
  const rng=seededRNG(month*31337+year);
  const total=daysInMonth(month,year);
  const dailyOff={};const sched={};
  const active=emps.filter(e=>e.active);
  active.forEach(emp=>{
    const jatah=(emp.hasChild?4:2)+bonus;
    const leaves=[];let tries=0;
    while(leaves.length<jatah&&tries<500){
      tries++;
      const d=Math.floor(rng()*total)+1;
      if(leaves.includes(d)||isPremium(d,month,year))continue;
      const k=`${emp.branch}-${d}`;
      if(!dailyOff[k])dailyOff[k]=0;
      const sz=active.filter(e=>e.branch===emp.branch).length;
      if(dailyOff[k]>=Math.max(1,Math.floor(sz*0.25)))continue;
      leaves.push(d);dailyOff[k]++;
    }
    sched[emp.id]={leaveDays:leaves.sort((a,b)=>a-b),branch:emp.branch};
  });
  if(sched["e001"])sched["e001"].leaveDays=[4,17];
  if(sched["e002"])sched["e002"].leaveDays=[9,27];
  return sched;
}

/* ═══ EMPLOYEE DATA ═══ */
const INIT_EMPS=[
  {id:"e001",name:"Alfa",branch:"OBP",hasChild:false,username:"alfa",password:"1234",active:true},
  {id:"e002",name:"Jihan",branch:"OBP",hasChild:false,username:"jihan",password:"1234",active:true},
  {id:"e003",name:"Siti",branch:"OBP",hasChild:true,username:"siti",password:"1234",active:true},
  {id:"e004",name:"Fina",branch:"OBP",hasChild:false,username:"fina",password:"1234",active:true},
  {id:"e005",name:"Seli",branch:"OBP",hasChild:false,username:"seli",password:"1234",active:true},
  {id:"e006",name:"Nadia",branch:"OBP",hasChild:false,username:"nadia",password:"1234",active:true},
  {id:"e007",name:"Nursyoh",branch:"OBP",hasChild:true,username:"nursyoh",password:"1234",active:true},
  {id:"e008",name:"Iea",branch:"OBP",hasChild:false,username:"iea",password:"1234",active:true},
  {id:"e009",name:"Anik",branch:"OBP",hasChild:false,username:"anik",password:"1234",active:true},
  {id:"e010",name:"Krisna",branch:"PIK",hasChild:false,username:"krisna",password:"1234",active:true},
  {id:"e011",name:"Robby",branch:"PIK",hasChild:true,username:"robby",password:"1234",active:true},
  {id:"e012",name:"Denoi",branch:"PIK",hasChild:false,username:"denoi",password:"1234",active:true},
  {id:"e013",name:"Julia",branch:"PIK",hasChild:false,username:"julia",password:"1234",active:true},
  {id:"e014",name:"Rehan",branch:"PIK",hasChild:false,username:"rehan",password:"1234",active:true},
  {id:"e015",name:"Asri",branch:"PIK",hasChild:false,username:"asri",password:"1234",active:true},
  {id:"e016",name:"Anita",branch:"PIK",hasChild:true,username:"anita",password:"1234",active:true},
  {id:"e017",name:"Fani",branch:"PIK",hasChild:false,username:"fani",password:"1234",active:true},
  {id:"e018",name:"April",branch:"PIK",hasChild:false,username:"april",password:"1234",active:true},
  {id:"e019",name:"Atikah",branch:"PIK",hasChild:false,username:"atikah",password:"1234",active:true},
  {id:"e020",name:"Cahya",branch:"PIK",hasChild:false,username:"cahya",password:"1234",active:true},
  {id:"e021",name:"Suci",branch:"PIK",hasChild:false,username:"suci",password:"1234",active:true},
  {id:"e022",name:"Risma",branch:"PIK",hasChild:true,username:"risma",password:"1234",active:true},
  {id:"e023",name:"Endah",branch:"PIK",hasChild:false,username:"endah",password:"1234",active:true},
  {id:"e024",name:"Nisa",branch:"MOI",hasChild:false,username:"nisa",password:"1234",active:true},
  {id:"e025",name:"Dini",branch:"MOI",hasChild:false,username:"dini",password:"1234",active:true},
  {id:"e026",name:"Hanzany",branch:"MOI",hasChild:false,username:"hanzany",password:"1234",active:true},
  {id:"e027",name:"Riska",branch:"MOI",hasChild:false,username:"riska",password:"1234",active:true},
  {id:"e028",name:"Amel",branch:"MOI",hasChild:true,username:"amel",password:"1234",active:true},
  {id:"e029",name:"Riri",branch:"MOI",hasChild:false,username:"riri",password:"1234",active:true},
  {id:"e030",name:"Anton",branch:"MOI",hasChild:false,username:"anton",password:"1234",active:true},
  {id:"e031",name:"Sovia",branch:"MOI",hasChild:false,username:"sovia",password:"1234",active:true},
  {id:"e032",name:"Yulia",branch:"MOI",hasChild:false,username:"yulia",password:"1234",active:true},
  {id:"e033",name:"Rani",branch:"MOI",hasChild:true,username:"rani",password:"1234",active:true},
  {id:"e034",name:"Leny",branch:"KOKAS",hasChild:false,username:"leny",password:"1234",active:true},
  {id:"e035",name:"Helma",branch:"KOKAS",hasChild:false,username:"helma",password:"1234",active:true},
  {id:"e036",name:"Yuli",branch:"KOKAS",hasChild:true,username:"yuli",password:"1234",active:true},
  {id:"e037",name:"Fariga",branch:"KOKAS",hasChild:false,username:"fariga",password:"1234",active:true},
  {id:"e038",name:"Sari",branch:"KOKAS",hasChild:false,username:"sari",password:"1234",active:true},
  {id:"e039",name:"Kiki",branch:"KOKAS",hasChild:false,username:"kiki",password:"1234",active:true},
  {id:"e040",name:"Angel",branch:"KOKAS",hasChild:false,username:"angel",password:"1234",active:true},
  {id:"e041",name:"Nuni",branch:"KOKAS",hasChild:true,username:"nuni",password:"1234",active:true},
  {id:"e042",name:"Amelia",branch:"KOKAS",hasChild:false,username:"amelia",password:"1234",active:true},
  {id:"e043",name:"Sandra",branch:"KOKAS",hasChild:false,username:"sandra",password:"1234",active:true},
  {id:"e044",name:"Esti",branch:"KOKAS",hasChild:false,username:"esti",password:"1234",active:true},
  {id:"e045",name:"Indri",branch:"KOKAS",hasChild:false,username:"indri",password:"1234",active:true},
  {id:"e046",name:"Aini",branch:"KOKAS",hasChild:false,username:"aini",password:"1234",active:true},
  {id:"e047",name:"Salma",branch:"GC",hasChild:false,username:"salma",password:"1234",active:true},
  {id:"e048",name:"Karmila",branch:"GC",hasChild:true,username:"karmila",password:"1234",active:true},
  {id:"e049",name:"Turmi",branch:"GC",hasChild:false,username:"turmi",password:"1234",active:true},
  {id:"e050",name:"Okta",branch:"GC",hasChild:false,username:"okta",password:"1234",active:true},
  {id:"e051",name:"Sibit",branch:"GC",hasChild:false,username:"sibit",password:"1234",active:true},
  {id:"e052",name:"Rima",branch:"GC",hasChild:false,username:"rima",password:"1234",active:true},
  {id:"e053",name:"Aminah",branch:"GC",hasChild:true,username:"aminah",password:"1234",active:true},
  {id:"e054",name:"Nuri",branch:"GC",hasChild:false,username:"nuri",password:"1234",active:true},
  {id:"e055",name:"Yogi",branch:"GC",hasChild:false,username:"yogi",password:"1234",active:true},
  {id:"e056",name:"Puji",branch:"GC",hasChild:false,username:"puji",password:"1234",active:true},
  {id:"e057",name:"Feby",branch:"GC",hasChild:false,username:"feby",password:"1234",active:true},
  {id:"e058",name:"Nabila",branch:"GC",hasChild:false,username:"nabila",password:"1234",active:true},
  {id:"e059",name:"Resti",branch:"GC",hasChild:false,username:"resti",password:"1234",active:true},
  {id:"e060",name:"Cindy",branch:"CP",hasChild:false,username:"cindy",password:"1234",active:true},
  {id:"e061",name:"Dia",branch:"CP",hasChild:false,username:"dia",password:"1234",active:true},
  {id:"e062",name:"Titia",branch:"CP",hasChild:false,username:"titia",password:"1234",active:true},
  {id:"e063",name:"Widya",branch:"CP",hasChild:true,username:"widya",password:"1234",active:true},
  {id:"e064",name:"Okta2",branch:"CP",hasChild:false,username:"okta2",password:"1234",active:true},
  {id:"e065",name:"Evita",branch:"CP",hasChild:false,username:"evita",password:"1234",active:true},
  {id:"e066",name:"Saisa",branch:"CP",hasChild:false,username:"saisa",password:"1234",active:true},
  {id:"e067",name:"Nesia",branch:"CP",hasChild:false,username:"nesia",password:"1234",active:true},
  {id:"e068",name:"Xanti",branch:"CP",hasChild:false,username:"xanti",password:"1234",active:true},
  {id:"e069",name:"Lintang",branch:"CP",hasChild:false,username:"lintang",password:"1234",active:true},
  {id:"e070",name:"Hanny",branch:"CP",hasChild:true,username:"hanny",password:"1234",active:true},
  {id:"e071",name:"Diana",branch:"CP",hasChild:false,username:"diana",password:"1234",active:true},
  {id:"e072",name:"Yuni",branch:"EMRO",hasChild:false,username:"yuni",password:"1234",active:true},
  {id:"e073",name:"Putri",branch:"EMRO",hasChild:false,username:"putri",password:"1234",active:true},
  {id:"e074",name:"Lia",branch:"EMRO",hasChild:true,username:"lia",password:"1234",active:true},
  {id:"e075",name:"Rumi",branch:"EMRO",hasChild:false,username:"rumi",password:"1234",active:true},
  {id:"e076",name:"Tari",branch:"EMRO",hasChild:false,username:"tari",password:"1234",active:true},
  {id:"e077",name:"Zahra",branch:"EMRO",hasChild:false,username:"zahra",password:"1234",active:true},
  {id:"e078",name:"Meysa",branch:"EMRO",hasChild:false,username:"meysa",password:"1234",active:true},
  {id:"e079",name:"Mimiru",branch:"EMRO",hasChild:false,username:"mimiru",password:"1234",active:true},
  {id:"e080",name:"Maolia",branch:"EMRO",hasChild:false,username:"maolia",password:"1234",active:true},
  {id:"e081",name:"Neri",branch:"LIPPO",hasChild:false,username:"neri",password:"1234",active:true},
  {id:"e082",name:"Kuat",branch:"LIPPO",hasChild:false,username:"kuat",password:"1234",active:true},
  {id:"e083",name:"Yamah",branch:"LIPPO",hasChild:true,username:"yamah",password:"1234",active:true},
  {id:"e084",name:"Nia",branch:"LIPPO",hasChild:false,username:"nia",password:"1234",active:true},
  {id:"e085",name:"Wike",branch:"LIPPO",hasChild:false,username:"wike",password:"1234",active:true},
  {id:"e086",name:"Anisa",branch:"LIPPO",hasChild:false,username:"anisa",password:"1234",active:true},
  {id:"e087",name:"Selia",branch:"LIPPO",hasChild:false,username:"selia",password:"1234",active:true},
  {id:"e088",name:"Ginanjaru",branch:"LIPPO",hasChild:false,username:"ginanjaru",password:"1234",active:true},
  {id:"e089",name:"Tuti",branch:"LIPPO",hasChild:true,username:"tuti",password:"1234",active:true},
  {id:"e090",name:"Andien",branch:"LIPPO",hasChild:false,username:"andien",password:"1234",active:true},
  {id:"e091",name:"Nurhea",branch:"LIPPO",hasChild:false,username:"nurhea",password:"1234",active:true},
  {id:"e092",name:"Salam",branch:"LIPPO",hasChild:false,username:"salam",password:"1234",active:true},
  {id:"e093",name:"Triq",branch:"LIPPO",hasChild:false,username:"triq",password:"1234",active:true},
  {id:"e094",name:"Wanti",branch:"LIPPO",hasChild:false,username:"wanti",password:"1234",active:true},
  {id:"e095",name:"Suany",branch:"GI",hasChild:false,username:"suany",password:"1234",active:true},
  {id:"e096",name:"Ajena",branch:"GI",hasChild:false,username:"ajena",password:"1234",active:true},
  {id:"e097",name:"Ika",branch:"GI",hasChild:false,username:"ika",password:"1234",active:true},
  {id:"e098",name:"Meti",branch:"GI",hasChild:false,username:"meti",password:"1234",active:true},
  {id:"e099",name:"Furoh",branch:"GI",hasChild:true,username:"furoh",password:"1234",active:true},
  {id:"e100",name:"Lia2",branch:"GI",hasChild:false,username:"lia2",password:"1234",active:true},
  {id:"e101",name:"Selti",branch:"GI",hasChild:false,username:"selti",password:"1234",active:true},
  {id:"e102",name:"Mila",branch:"GI",hasChild:false,username:"mila",password:"1234",active:true},
  {id:"e103",name:"Sekar",branch:"GI",hasChild:false,username:"sekar",password:"1234",active:true},
  {id:"e104",name:"Ana",branch:"GI",hasChild:false,username:"ana",password:"1234",active:true},
  {id:"e105",name:"Iyul",branch:"GI",hasChild:true,username:"iyul",password:"1234",active:true},
  {id:"e106",name:"Amet",branch:"GI",hasChild:false,username:"amet",password:"1234",active:true},
  {id:"e107",name:"Nurma",branch:"GI",hasChild:false,username:"nurma",password:"1234",active:true},
  {id:"e108",name:"Muji",branch:"BW",hasChild:false,username:"muji",password:"1234",active:true},
  {id:"e109",name:"Tari2",branch:"BW",hasChild:false,username:"tari2",password:"1234",active:true},
  {id:"e110",name:"Indah",branch:"BW",hasChild:true,username:"indah",password:"1234",active:true},
  {id:"e111",name:"Olu",branch:"BW",hasChild:false,username:"olu",password:"1234",active:true},
  {id:"e112",name:"Diah",branch:"SMS",hasChild:false,username:"diah",password:"1234",active:true},
  {id:"e113",name:"Aidah",branch:"SMS",hasChild:false,username:"aidah",password:"1234",active:true},
  {id:"e114",name:"Jaya",branch:"SMS",hasChild:false,username:"jaya",password:"1234",active:true},
  {id:"e115",name:"Aan",branch:"SMS",hasChild:false,username:"aan",password:"1234",active:true},
  {id:"e116",name:"Shyta",branch:"SMS",hasChild:false,username:"shyta",password:"1234",active:true},
  {id:"e117",name:"Ara",branch:"SMS",hasChild:false,username:"ara",password:"1234",active:true},
  {id:"e118",name:"Atika",branch:"SMS",hasChild:false,username:"atika",password:"1234",active:true},
  {id:"e119",name:"Zahra2",branch:"SMS",hasChild:false,username:"zahra2",password:"1234",active:true},
  {id:"e120",name:"Naujal",branch:"SMS",hasChild:false,username:"naujal",password:"1234",active:true},
  {id:"e121",name:"Tika",branch:"MJ",hasChild:false,username:"tika",password:"1234",active:true},
  {id:"e122",name:"Rina",branch:"MJ",hasChild:false,username:"rina",password:"1234",active:true},
  {id:"e123",name:"Ani2",branch:"MJ",hasChild:true,username:"ani2",password:"1234",active:true},
  {id:"e124",name:"Krisma",branch:"MJ",hasChild:false,username:"krisma",password:"1234",active:true},
  {id:"e125",name:"Juwita",branch:"MJ",hasChild:false,username:"juwita",password:"1234",active:true},
  {id:"e126",name:"Wiwit",branch:"MJ",hasChild:true,username:"wiwit",password:"1234",active:true},
];

/* ═══ COMPONENTS ═══ */
const GS=`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');*{box-sizing:border-box;margin:0;padding:0;}input,select,button{font-family:'DM Sans',sans-serif;}input::placeholder{color:#9B7050;}input:focus,select:focus{outline:none;}::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-thumb{background:#C4936A;border-radius:4px;}.tnb:active{opacity:.7;}@keyframes sup{from{transform:translateY(50px);opacity:0}to{transform:translateY(0);opacity:1}}`;

const Av=({name,sz=40})=>{
  const in2=name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  const hue=name.charCodeAt(0)%50;
  return <div style={{width:sz,height:sz,borderRadius:"50%",background:`linear-gradient(135deg,hsl(${18+hue},55%,36%),hsl(${28+hue},58%,52%))`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:sz*.36,flexShrink:0}}>{in2}</div>;
};

const Pill=({label,color=C.med,bg=C.cream})=><span style={{background:bg,color,padding:"2px 9px",borderRadius:20,fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>{label}</span>;

const Btn=({children,onClick,v="primary",disabled=false,s={}})=>{
  const vs={primary:{background:disabled?C.border:`linear-gradient(135deg,${C.brown},${C.med})`,color:C.white,border:"none"},outline:{background:"transparent",color:C.brown,border:`1.5px solid ${C.brown}`},danger:{background:C.danger,color:C.white,border:"none"},success:{background:C.success,color:C.white,border:"none"},ghost:{background:"transparent",color:C.textMed,border:`1.5px solid ${C.border}`}};
  return <button disabled={disabled} onClick={onClick} style={{...vs[v],borderRadius:13,padding:"11px 18px",fontSize:14,fontWeight:600,cursor:disabled?"not-allowed":"pointer",transition:"opacity .15s",...s}} onMouseOver={e=>{if(!disabled)e.currentTarget.style.opacity=".85";}} onMouseOut={e=>e.currentTarget.style.opacity="1"}>{children}</button>;
};

const Modal=({show,onClose,title,children})=>{
  if(!show)return null;
  return <div style={{position:"fixed",inset:0,background:C.overlay,zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}><div onClick={e=>e.stopPropagation()} style={{background:C.card,borderRadius:"24px 24px 0 0",width:"100%",maxWidth:430,maxHeight:"90vh",overflowY:"auto",paddingBottom:32,animation:"sup .25s ease"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 20px 0",position:"sticky",top:0,background:C.card,zIndex:1}}><span style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,color:C.dark}}>{title}</span><button onClick={onClose} style={{background:C.cream,border:"none",borderRadius:"50%",width:32,height:32,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><X size={16} color={C.textMed}/></button></div><div style={{padding:"16px 20px 0"}}>{children}</div></div></div>;
};

const Inp=({value,onChange,placeholder,type="text",style:s={}})=><input value={value} onChange={onChange} placeholder={placeholder} type={type} style={{width:"100%",padding:"11px 14px",border:`1.5px solid ${C.border}`,borderRadius:12,fontSize:14,color:C.text,background:C.bg,...s}}/>;

const Fld=({label,children})=><div style={{marginBottom:14}}><label style={{fontSize:11,fontWeight:700,color:C.textLight,textTransform:"uppercase",letterSpacing:1,display:"block",marginBottom:6}}>{label}</label>{children}</div>;

const Hdr=({children,sub,right,grad=`linear-gradient(135deg,${C.brown},${C.med})`})=>(
  <div style={{background:grad,padding:"52px 20px 24px",borderRadius:"0 0 28px 28px",color:C.white}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
      <div><div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700}}>{children}</div>{sub&&<div style={{opacity:.65,fontSize:13,marginTop:3}}>{sub}</div>}</div>
      {right}
    </div>
  </div>
);

/* ═══ LOGIN ═══ */
function Login({onLogin}){
  const [u,setU]=useState("");const[p,setP]=useState("");const[show,setShow]=useState(false);
  const[err,setErr]=useState("");const[load,setLoad]=useState(false);
  const go=()=>{setLoad(true);setErr("");setTimeout(()=>{if(!onLogin(u.trim().toLowerCase(),p)){setErr("Username atau password salah");setLoad(false);}},500);};
  return(
    <div style={{minHeight:"100vh",background:`linear-gradient(160deg,#1C0A02 0%,#5C3020 55%,#8B5A3C 100%)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
      <style>{GS}</style>
      <div style={{textAlign:"center",marginBottom:36}}>
        <div style={{width:76,height:76,borderRadius:22,background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}><span style={{fontSize:36}}>💅</span></div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:30,fontWeight:700,color:"#FFFCF6"}}>The Nail Shop</div>
        <div style={{color:"rgba(255,255,255,.5)",fontSize:13,marginTop:4}}>Sistem Jadwal Karyawan</div>
      </div>
      <div style={{background:"rgba(255,252,246,.97)",borderRadius:24,padding:"28px 24px",width:"100%",maxWidth:380,boxShadow:"0 24px 64px rgba(28,10,2,.45)"}}>
        <Fld label="Username"><div style={{border:`1.5px solid ${err?C.danger:C.border}`,borderRadius:12,background:C.bg,display:"flex",alignItems:"center"}}><input value={u} onChange={e=>setU(e.target.value)} placeholder="masukkan username..." onKeyDown={e=>e.key==="Enter"&&go()} style={{flex:1,padding:"11px 14px",border:"none",background:"transparent",fontSize:14,color:C.text}}/></div></Fld>
        <Fld label="Password"><div style={{border:`1.5px solid ${err?C.danger:C.border}`,borderRadius:12,background:C.bg,display:"flex",alignItems:"center"}}><input value={p} onChange={e=>setP(e.target.value)} placeholder="masukkan password..." type={show?"text":"password"} onKeyDown={e=>e.key==="Enter"&&go()} style={{flex:1,padding:"11px 14px",border:"none",background:"transparent",fontSize:14,color:C.text}}/><button onClick={()=>setShow(!show)} style={{background:"none",border:"none",cursor:"pointer",padding:"0 12px"}}>{show?<EyeOff size={16} color={C.textLight}/>:<Eye size={16} color={C.textLight}/>}</button></div></Fld>
        {err&&<div style={{background:"#FFF0EE",border:`1px solid ${C.danger}`,borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:13,color:C.danger,display:"flex",alignItems:"center",gap:8}}><AlertCircle size={14}/>{err}</div>}
        <Btn onClick={go} disabled={load} s={{width:"100%",padding:14,fontSize:15}}>{load?"Masuk...":"Masuk"}</Btn>
        <div style={{marginTop:16,padding:14,background:C.cream,borderRadius:12,fontSize:12,color:C.textMed,lineHeight:1.9}}>
          <strong>👑 Admin:</strong> admin / admin123<br/>
          <strong>👤 Karyawan:</strong> nama (huruf kecil) / 1234<br/>
          <span style={{opacity:.7,fontSize:11}}>Contoh: alfa / 1234 &nbsp;·&nbsp; jihan / 1234</span>
        </div>
      </div>
    </div>
  );
}

/* ═══ EMP BERANDA ═══ */
function EmpBeranda({user,schedule,swaps,employees}){
  const m=5,y=2026,today=27;
  const leaves=schedule[user.id]?.leaveDays||[];
  const isOff=leaves.includes(today);
  const pending=swaps.filter(s=>s.targetId===user.id&&s.status==="pending");
  return(
    <div>
      <div style={{background:`linear-gradient(135deg,${C.brown},${C.med})`,padding:"52px 20px 28px",borderRadius:"0 0 28px 28px",color:C.white}}>
        <div style={{fontSize:12,opacity:.65,marginBottom:4}}>Halo, selamat datang 👋</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:700}}>{user.name}</div>
        <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}}>
          <Pill label={`📍 ${user.branch}`} color={C.cream} bg="rgba(255,255,255,.18)"/>
          <Pill label={user.hasChild?"👶 4 hari/bln":"🙋 2 hari/bln"} color={C.cream} bg="rgba(255,255,255,.18)"/>
        </div>
      </div>
      <div style={{padding:"18px 16px",display:"flex",flexDirection:"column",gap:14}}>
        <div style={{borderRadius:18,padding:18,color:C.white,background:isOff?`linear-gradient(135deg,${C.success},#4A9060)`:`linear-gradient(135deg,#2C1408,${C.brown})`}}>
          <div style={{fontSize:11,opacity:.75,marginBottom:4}}>{DOW[getDOW(today,m,y)]}, {today} {MONTHS[m]} {y}</div>
          <div style={{fontSize:19,fontWeight:700}}>{isOff?"🏖️ Kamu Libur Hari Ini!":"💼 Masuk Kerja Hari Ini"}</div>
        </div>
        {pending.length>0&&(
          <div style={{background:`${C.warning}12`,border:`1.5px solid ${C.warning}`,borderRadius:18,padding:16}}>
            <div style={{fontWeight:700,color:C.warning,fontSize:14,marginBottom:6}}>🔔 {pending.length} Permintaan Tukar Masuk</div>
            {pending.slice(0,2).map(s=>{
              const req=employees.find(e=>e.id===s.requesterId);
              return <div key={s.id} style={{fontSize:13,color:C.textMed,marginBottom:3}}>• {req?.name} → tukar tgl {s.requesterDay} ↔ tgl {s.targetDay} milikmu</div>;
            })}
            <div style={{fontSize:12,color:C.warning,marginTop:8,fontWeight:600}}>Buka tab Tukar untuk konfirmasi →</div>
          </div>
        )}
        <div style={{background:C.card,borderRadius:18,padding:18,border:`1px solid ${C.border}`}}>
          <div style={{fontWeight:700,color:C.dark,marginBottom:14,fontSize:15}}>📅 Jadwal Libur Mei 2026</div>
          {leaves.length===0
            ?<div style={{color:C.textLight,fontSize:13,textAlign:"center",padding:12}}>Belum ada jadwal libur</div>
            :<div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {leaves.map(d=>{
                const prem=isPremium(d,m,y);const past=d<today;
                return(
                  <div key={d} style={{borderRadius:14,padding:"10px 14px",textAlign:"center",background:past?"#F0EAE0":prem?`${C.gold}20`:`${C.med}15`,border:`1.5px solid ${past?C.border:prem?C.gold:C.med}`,opacity:past?.55:1}}>
                    <div style={{fontSize:18,fontWeight:700,color:past?C.textLight:prem?C.warning:C.brown}}>{d}</div>
                    <div style={{fontSize:10,color:C.textLight,marginTop:1}}>{DOW[getDOW(d,m,y)]}</div>
                    {prem&&!past&&<div style={{fontSize:9,color:C.warning,fontWeight:700,marginTop:1}}>⚡PREMIUM</div>}
                    {past&&<div style={{fontSize:9,color:C.textLight,fontWeight:600,marginTop:1}}>LEWAT</div>}
                  </div>
                );
              })}
            </div>}
        </div>
        <div style={{background:C.cream,borderRadius:16,padding:16,border:`1px solid ${C.border}`}}>
          <div style={{fontWeight:700,color:C.brown,fontSize:13,marginBottom:6}}>⚡ Info Hari Premium</div>
          <div style={{fontSize:12,color:C.textMed,lineHeight:1.75}}>Libur di <strong>Jumat, Sabtu, Minggu</strong> atau <strong>Tanggal Merah</strong> memotong jatah menjadi setengah.<br/><span style={{color:C.danger}}>🔴 Merah Mei: 1, 14, 25 Mei 2026</span></div>
        </div>
      </div>
    </div>
  );
}

/* ═══ EMP KALENDER ═══ */
function EmpKalender({user,schedule,month=5,year=2026}){
  const leaves=schedule[user.id]?.leaveDays||[];
  const total=daysInMonth(month,year);
  const firstDOW=getDOW(1,month,year);
  const hols=getHols(month);
  const cells=[];
  for(let i=0;i<firstDOW;i++)cells.push(null);
  for(let d=1;d<=total;d++)cells.push(d);
  return(
    <div>
      <div style={{background:`linear-gradient(135deg,${C.brown},${C.med})`,padding:"52px 20px 24px",color:C.white,borderRadius:"0 0 28px 28px"}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700}}>Kalender Libur</div>
        <div style={{opacity:.7,fontSize:13,marginTop:2}}>{MONTHS[month]} {year} · Cabang {user.branch}</div>
        <div style={{display:"flex",gap:8,marginTop:12}}>
          <Pill label={`Jatah: ${user.hasChild?4:2} hari`} color={C.cream} bg="rgba(255,255,255,.18)"/>
          <Pill label={`Diambil: ${leaves.length} hari`} color={C.cream} bg="rgba(255,255,255,.18)"/>
        </div>
      </div>
      <div style={{padding:"18px 16px"}}>
        <div style={{background:C.card,borderRadius:18,padding:16,border:`1px solid ${C.border}`,marginBottom:14}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:8}}>
            {DOW.map(d=><div key={d} style={{textAlign:"center",fontSize:11,fontWeight:700,color:["Min","Jum","Sab"].includes(d)?C.warning:C.textLight}}>{d}</div>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
            {cells.map((d,i)=>{
              if(!d)return <div key={`e${i}`}/>;
              const isL=leaves.includes(d);const isH=hols.includes(d);const dw=getDOW(d,month,year);const isW=dw===0||dw===5||dw===6;
              return(
                <div key={d} style={{borderRadius:10,padding:"5px 2px",textAlign:"center",minHeight:40,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:isL?`linear-gradient(135deg,${C.med},${C.tan})`:isH?`${C.danger}12`:"transparent",border:`1px solid ${isL?C.med:isH?`${C.danger}30`:isW?`${C.warning}20`:"transparent"}`}}>
                  <div style={{fontSize:13,fontWeight:isL?700:400,color:isL?C.white:isH?C.danger:isW?C.warning:C.text}}>{d}</div>
                  {isL&&<div style={{fontSize:8,color:"rgba(255,255,255,.8)",fontWeight:700,marginTop:1}}>OFF</div>}
                  {isH&&!isL&&<div style={{fontSize:8,color:C.danger,marginTop:1}}>🔴</div>}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:14}}>
          {[{c:C.med,l:"Hari Liburmu"},{c:C.danger,l:"Tgl Merah"},{c:C.warning,l:"Jum/Sab/Min"}].map(({c,l})=>(
            <div key={l} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:C.textMed}}>
              <div style={{width:12,height:12,borderRadius:3,background:c,flexShrink:0}}/>{l}
            </div>
          ))}
        </div>
        <div style={{background:C.card,borderRadius:18,border:`1px solid ${C.border}`,overflow:"hidden"}}>
          <div style={{padding:"14px 16px",borderBottom:`1px solid ${C.border}`,fontWeight:700,color:C.dark}}>Detail Hari Libur</div>
          {leaves.length===0
            ?<div style={{padding:24,textAlign:"center",color:C.textLight,fontSize:13}}>Belum ada jadwal libur</div>
            :leaves.map(d=>{
              const prem=isPremium(d,month,year);
              return(
                <div key={d} style={{padding:"13px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div><div style={{fontWeight:600,color:C.dark}}>{d} {MONTHS[month]} {year}</div><div style={{fontSize:12,color:C.textLight,marginTop:2}}>{dayLabel(d,month,year)}</div></div>
                  {prem&&<Pill label="⚡ Premium" color={C.warning} bg={`${C.warning}15`}/>}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

/* ═══ EMP TUKAR ═══ */
function EmpTukar({user,employees,schedule,swaps,setSwaps,addNotif,month=5,year=2026}){
  const[tab,setTab]=useState("masuk");
  const[step,setStep]=useState(0);
  const[myDay,setMyDay]=useState(null);
  const[target,setTarget]=useState(null);
  const[targetDay,setTargetDay]=useState(null);

  const myLeaves=schedule[user.id]?.leaveDays||[];
  const branchEmps=employees.filter(e=>e.branch===user.branch&&e.id!==user.id&&e.active);
  const incoming=swaps.filter(s=>s.targetId===user.id);
  const outgoing=swaps.filter(s=>s.requesterId===user.id);
  const getName=id=>employees.find(e=>e.id===id)?.name||id;

  const ss=s=>s==="pending"?{c:C.warning,bg:`${C.warning}15`,label:"⏳ Menunggu"}
    :s==="accepted"?{c:C.success,bg:`${C.success}15`,label:"✅ Disetujui"}
    :{c:C.danger,bg:`${C.danger}15`,label:"❌ Ditolak"};

  const sendReq=()=>{
    if(!myDay||!target||!targetDay)return;
    const id=`sw${Date.now()}`;
    setSwaps(p=>[...p,{id,requesterId:user.id,targetId:target.id,requesterDay:myDay,targetDay,month,year,status:"pending",ts:Date.now()}]);
    addNotif(target.id,{type:"swap_in",msg:`${user.name} mengajak tukar libur: tgl ${myDay} miliknya ↔ tgl ${targetDay} milikmu`,swapId:id});
    setStep(0);setMyDay(null);setTarget(null);setTargetDay(null);
  };

  const respond=(swapId,accept)=>{
    setSwaps(prev=>prev.map(s=>{
      if(s.id!==swapId)return s;
      if(accept){
        const rL=[...(schedule[s.requesterId]?.leaveDays||[])];
        const tL=[...(schedule[s.targetId]?.leaveDays||[])];
        const ri=rL.indexOf(s.requesterDay);const ti=tL.indexOf(s.targetDay);
        if(ri>=0)rL[ri]=s.targetDay;if(ti>=0)tL[ti]=s.requesterDay;
        if(schedule[s.requesterId])schedule[s.requesterId].leaveDays=rL.sort((a,b)=>a-b);
        if(schedule[s.targetId])schedule[s.targetId].leaveDays=tL.sort((a,b)=>a-b);
      }
      return{...s,status:accept?"accepted":"rejected"};
    }));
    const sw=swaps.find(s=>s.id===swapId);
    if(sw)addNotif(sw.requesterId,{type:"swap_resp",msg:accept?`🎉 ${user.name} menyetujui! Tgl ${sw.requesterDay} ↔ ${sw.targetDay} berhasil ditukar.`:`${user.name} menolak permintaan tukar liburmu.`,swapId});
  };

  const reset=()=>{setStep(0);setMyDay(null);setTarget(null);setTargetDay(null);};

  return(
    <div>
      <div style={{background:`linear-gradient(135deg,${C.brown},${C.med})`,padding:"52px 20px 20px",borderRadius:"0 0 28px 28px",color:C.white}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700}}>Tukar Libur</div><div style={{opacity:.7,fontSize:13,marginTop:2}}>Ajukan atau konfirmasi tukar jadwal</div></div>
          <button onClick={()=>setStep(1)} style={{background:"rgba(255,255,255,.18)",border:"1px solid rgba(255,255,255,.3)",borderRadius:12,padding:"8px 14px",color:C.white,cursor:"pointer",fontSize:13,fontWeight:600,display:"flex",alignItems:"center",gap:6}}><Plus size={14}/>Ajukan</button>
        </div>
      </div>
      <div style={{padding:"16px"}}>
        <div style={{display:"flex",background:C.cream,borderRadius:14,padding:4,gap:4,marginBottom:16}}>
          {[["masuk","📥 Masuk",incoming],["keluar","📤 Terkirim",outgoing]].map(([v,l,arr])=>{
            const cnt=arr.filter(s=>s.status==="pending").length;
            return(
              <button key={v} onClick={()=>setTab(v)} className="tnb" style={{flex:1,padding:"9px 8px",borderRadius:10,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,background:tab===v?C.card:"transparent",color:tab===v?C.brown:C.textMed,boxShadow:tab===v?"0 2px 8px rgba(0,0,0,.07)":"none"}}>
                {l}{cnt>0&&<span style={{marginLeft:4,background:C.danger,color:"#fff",borderRadius:10,padding:"0 5px",fontSize:10}}>{cnt}</span>}
              </button>
            );
          })}
        </div>
        {(tab==="masuk"?incoming:outgoing).length===0
          ?<div style={{textAlign:"center",padding:"40px 0",color:C.textLight}}><div style={{fontSize:40,marginBottom:8}}>🔄</div><div style={{fontSize:14}}>Belum ada permintaan tukar</div></div>
          :[...(tab==="masuk"?incoming:outgoing)].reverse().map(s=>{
            const otherId=tab==="masuk"?s.requesterId:s.targetId;
            const st=ss(s.status);
            return(
              <div key={s.id} style={{background:C.card,borderRadius:16,padding:16,marginBottom:10,border:`1.5px solid ${s.status==="pending"?C.warning:C.border}`}}>
                <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                  <Av name={getName(otherId)} sz={42}/>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,color:C.dark,fontSize:14}}>{getName(otherId)}</div>
                    <div style={{fontSize:12,color:C.textLight,marginTop:3,lineHeight:1.5}}>
                      {tab==="masuk"?`Minta tukar tgl ${s.requesterDay} miliknya ↔ tgl ${s.targetDay} milikmu`:`Tukar tgl ${s.requesterDay} milikmu ↔ tgl ${s.targetDay} milik ${getName(otherId)}`}
                    </div>
                  </div>
                  <Pill label={st.label} color={st.c} bg={st.bg}/>
                </div>
                {tab==="masuk"&&s.status==="pending"&&(
                  <div style={{display:"flex",gap:8,marginTop:12}}>
                    <Btn onClick={()=>respond(s.id,true)} v="success" s={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"10px"}}><Check size={14}/>Setuju</Btn>
                    <Btn onClick={()=>respond(s.id,false)} v="danger" s={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"10px"}}><X size={14}/>Tolak</Btn>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* Step 1 - pilih hari sendiri */}
      <Modal show={step===1} onClose={reset} title="Pilih Hari Liburmu">
        <div style={{display:"flex",gap:6,marginBottom:16}}>{[1,2,3].map(n=><div key={n} style={{flex:1,height:4,borderRadius:4,background:n<=step?C.med:C.cream}}/>)}</div>
        <div style={{fontSize:13,color:C.textMed,marginBottom:12}}>Pilih hari liburmu yang mau ditukar:</div>
        {myLeaves.length===0
          ?<div style={{padding:16,textAlign:"center",color:C.textLight,fontSize:13}}>Belum punya jadwal libur bulan ini</div>
          :myLeaves.map(d=>(
            <div key={d} onClick={()=>{setMyDay(d);setStep(2);}} style={{padding:"14px 16px",borderRadius:14,cursor:"pointer",marginBottom:8,border:`2px solid ${myDay===d?C.med:C.border}`,background:myDay===d?`${C.med}10`:C.card,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><span style={{fontWeight:700,color:C.dark}}>{d} {MONTHS[month]}</span><span style={{fontSize:12,color:C.textLight,marginLeft:8}}>{DOW[getDOW(d,month,year)]}</span></div>
              {isPremium(d,month,year)&&<Pill label="⚡ Premium" color={C.warning} bg={`${C.warning}15`}/>}
            </div>
          ))}
      </Modal>

      {/* Step 2 - pilih karyawan */}
      <Modal show={step===2} onClose={reset} title="Pilih Karyawan">
        <div style={{display:"flex",gap:6,marginBottom:16}}>{[1,2,3].map(n=><div key={n} style={{flex:1,height:4,borderRadius:4,background:n<=step?C.med:C.cream}}/>)}</div>
        <div style={{fontSize:13,color:C.textMed,marginBottom:12}}>Kamu mau tukar tgl <strong>{myDay}</strong> dengan siapa? (Cabang {user.branch})</div>
        {branchEmps.map(e=>(
          <div key={e.id} onClick={()=>{setTarget(e);setStep(3);}} style={{padding:"12px 14px",borderRadius:14,cursor:"pointer",marginBottom:8,border:`2px solid ${target?.id===e.id?C.med:C.border}`,background:target?.id===e.id?`${C.med}10`:C.card,display:"flex",alignItems:"center",gap:12}}>
            <Av name={e.name} sz={38}/>
            <div><div style={{fontWeight:700,color:C.dark}}>{e.name}</div><div style={{fontSize:11,color:C.textLight,marginTop:2}}>Libur: {(schedule[e.id]?.leaveDays||[]).join(", ")||"Belum ada"}</div></div>
          </div>
        ))}
        <Btn onClick={()=>{setStep(1);setTarget(null);}} v="ghost" s={{width:"100%",marginTop:8}}>← Kembali</Btn>
      </Modal>

      {/* Step 3 - pilih hari target */}
      <Modal show={step===3} onClose={reset} title="Pilih Hari yang Diinginkan">
        <div style={{display:"flex",gap:6,marginBottom:16}}>{[1,2,3].map(n=><div key={n} style={{flex:1,height:4,borderRadius:4,background:n<=step?C.med:C.cream}}/>)}</div>
        <div style={{fontSize:13,color:C.textMed,marginBottom:12}}>Pilih hari libur <strong>{target?.name}</strong> yang kamu mau:</div>
        {(target&&(schedule[target.id]?.leaveDays||[]).length===0)
          ?<div style={{padding:16,textAlign:"center",color:C.textLight,fontSize:13}}>{target?.name} belum punya jadwal libur</div>
          :(target&&(schedule[target.id]?.leaveDays||[])).map(d=>(
            <div key={d} onClick={()=>setTargetDay(d)} style={{padding:"14px 16px",borderRadius:14,cursor:"pointer",marginBottom:8,border:`2px solid ${targetDay===d?C.med:C.border}`,background:targetDay===d?`${C.med}10`:C.card,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><span style={{fontWeight:700,color:C.dark}}>{d} {MONTHS[month]}</span><span style={{fontSize:12,color:C.textLight,marginLeft:8}}>{DOW[getDOW(d,month,year)]}</span></div>
              {isPremium(d,month,year)&&<Pill label="⚡ Premium" color={C.warning} bg={`${C.warning}15`}/>}
            </div>
          ))}
        {targetDay&&(
          <div style={{background:`${C.med}10`,border:`1.5px solid ${C.med}`,borderRadius:14,padding:14,margin:"12px 0"}}>
            <div style={{fontSize:13,fontWeight:700,color:C.brown,marginBottom:4}}>Ringkasan Tukar:</div>
            <div style={{fontSize:13,color:C.textMed,lineHeight:1.7}}>Liburmu <strong>tgl {myDay}</strong> akan ditukar dengan libur {target?.name} <strong>tgl {targetDay}</strong></div>
          </div>
        )}
        <div style={{display:"flex",gap:8}}>
          <Btn onClick={()=>{setStep(2);setTargetDay(null);}} v="ghost" s={{flex:1}}>← Kembali</Btn>
          <Btn onClick={sendReq} disabled={!targetDay} s={{flex:2}}>Kirim Permintaan 📤</Btn>
        </div>
      </Modal>
    </div>
  );
}

/* ═══ EMP PROFIL ═══ */
function EmpProfil({user,notifs,markRead,onLogout}){
  const myNotifs=[...(notifs[user.id]||[])].reverse();
  return(
    <div>
      <div style={{background:`linear-gradient(135deg,${C.brown},${C.med})`,padding:"52px 20px 28px",borderRadius:"0 0 28px 28px",color:C.white,textAlign:"center"}}>
        <Av name={user.name} sz={72}/>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,marginTop:12}}>{user.name}</div>
        <div style={{opacity:.65,fontSize:13,marginTop:4}}>@{user.username} · Cabang {user.branch}</div>
      </div>
      <div style={{padding:"18px 16px",display:"flex",flexDirection:"column",gap:14}}>
        <div style={{background:C.card,borderRadius:18,border:`1px solid ${C.border}`,overflow:"hidden"}}>
          {[["📍 Cabang",user.branch],["👶 Status",user.hasChild?"Punya Anak → 4 hari/bln":"Belum Punya Anak → 2 hari/bln"],["🔑 Username",user.username]].map(([k,v])=>(
            <div key={k} style={{padding:"13px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{color:C.textLight,fontSize:13}}>{k}</span>
              <span style={{color:C.dark,fontSize:13,fontWeight:600,textAlign:"right",maxWidth:"60%"}}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{background:C.card,borderRadius:18,border:`1px solid ${C.border}`,overflow:"hidden"}}>
          <div style={{padding:"14px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontWeight:700,color:C.dark,fontSize:15}}>🔔 Notifikasi{myNotifs.filter(n=>!n.read).length>0&&<span style={{background:C.danger,color:"#fff",borderRadius:10,padding:"1px 7px",fontSize:11,marginLeft:8}}>{myNotifs.filter(n=>!n.read).length}</span>}</span>
            {myNotifs.some(n=>!n.read)&&<button onClick={()=>markRead(user.id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:C.med,fontWeight:600}}>Baca semua</button>}
          </div>
          {myNotifs.length===0
            ?<div style={{padding:24,textAlign:"center",color:C.textLight,fontSize:13}}>Tidak ada notifikasi</div>
            :myNotifs.map(n=>(
              <div key={n.id} style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,background:n.read?"transparent":`${C.gold}08`}}>
                <div style={{fontSize:13,color:C.dark,lineHeight:1.5}}>{n.msg}</div>
                <div style={{fontSize:11,color:C.textLight,marginTop:4}}>{n.read?"":"🔵 "}{new Date(n.ts).toLocaleDateString("id-ID",{day:"numeric",month:"long"})}</div>
              </div>
            ))}
        </div>
        <Btn onClick={onLogout} v="danger" s={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><LogOut size={16}/>Keluar dari Akun</Btn>
      </div>
    </div>
  );
}

/* ═══ ADMIN DASHBOARD ═══ */
function AdminDash({employees,swaps,schedule}){
  const today=27,m=5,y=2026;
  const active=employees.filter(e=>e.active);
  const pendingSwaps=swaps.filter(s=>s.status==="pending");
  const totalOff=Object.entries(schedule).filter(([id])=>active.find(e=>e.id===id)).filter(([_,v])=>(v.leaveDays||[]).includes(today)).length;
  return(
    <div>
      <div style={{background:`linear-gradient(135deg,${C.dark},#3C1808)`,padding:"52px 20px 28px",borderRadius:"0 0 28px 28px",color:C.white}}>
        <div style={{fontSize:11,opacity:.55,marginBottom:4,letterSpacing:1,textTransform:"uppercase"}}>Admin Dashboard</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700}}>The Nail Shop 💅</div>
        <div style={{opacity:.6,fontSize:13,marginTop:4}}>{DOW[getDOW(today,m,y)]}, {today} {MONTHS[m]} {y}</div>
      </div>
      <div style={{padding:"18px 16px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
          {[{icon:"👥",label:"Total Karyawan",val:active.length,c:C.med},{icon:"🏪",label:"Cabang Aktif",val:12,c:C.brown},{icon:"⏳",label:"Request Tukar",val:pendingSwaps.length,c:C.warning},{icon:"🏖️",label:"Libur Hari Ini",val:totalOff,c:C.success}].map(({icon,label,val,c})=>(
            <div key={label} style={{background:C.card,borderRadius:18,padding:18,border:`1px solid ${C.border}`}}>
              <div style={{fontSize:26}}>{icon}</div>
              <div style={{fontSize:28,fontWeight:800,color:c,marginTop:4}}>{val}</div>
              <div style={{fontSize:12,color:C.textLight,marginTop:2}}>{label}</div>
            </div>
          ))}
        </div>
        {pendingSwaps.length>0&&(
          <div style={{background:C.card,borderRadius:18,border:`1.5px solid ${C.warning}`,overflow:"hidden",marginBottom:16}}>
            <div style={{padding:"13px 16px",background:`${C.warning}10`,fontWeight:700,color:C.warning}}>⏳ Tukar Libur Menunggu ({pendingSwaps.length})</div>
            {pendingSwaps.map(s=>{
              const rn=employees.find(e=>e.id===s.requesterId)?.name||s.requesterId;
              const tn=employees.find(e=>e.id===s.targetId)?.name||s.targetId;
              return <div key={s.id} style={{padding:"12px 16px",borderTop:`1px solid ${C.border}`}}><div style={{fontSize:13,color:C.dark,fontWeight:600}}>{rn} → {tn}</div><div style={{fontSize:12,color:C.textLight,marginTop:2}}>Tgl {s.requesterDay} ↔ Tgl {s.targetDay}</div></div>;
            })}
          </div>
        )}
        <div style={{background:C.card,borderRadius:18,border:`1px solid ${C.border}`,overflow:"hidden"}}>
          <div style={{padding:"14px 16px",borderBottom:`1px solid ${C.border}`,fontWeight:700,color:C.dark,fontSize:15}}>🏪 Semua Cabang — Hari Ini</div>
          {BRANCHES.map(b=>{
            const emps=active.filter(e=>e.branch===b);
            const off=Object.entries(schedule).filter(([id])=>emps.find(e=>e.id===id)).filter(([_,v])=>(v.leaveDays||[]).includes(today)).length;
            return(
              <div key={b} style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><div style={{fontWeight:600,color:C.dark}}>{b}</div><div style={{fontSize:11,color:C.textLight}}>{emps.length} karyawan</div></div>
                {off>0?<Pill label={`${off} libur`} color={C.warning} bg={`${C.warning}15`}/>:<Pill label="Semua masuk" color={C.success} bg={`${C.success}15`}/>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══ ADMIN JADWAL ═══ */
function AdminJadwal({employees,schedule,setSchedule,month=5,year=2026}){
  const[branch,setBranch]=useState("OBP");
  const[editEmp,setEditEmp]=useState(null);
  const[editLeaves,setEditLeaves]=useState([]);
  const[bonus,setBonus]=useState(0);
  const[showBonus,setShowBonus]=useState(false);
  const[showLebaran,setShowLebaran]=useState(false);
  const[lSesi,setLSesi]=useState(null);

  const active=employees.filter(e=>e.active);
  const branchEmps=active.filter(e=>e.branch===branch);
  const total=daysInMonth(month,year);
  const hols=getHols(month);

  const openEdit=emp=>{setEditEmp(emp);setEditLeaves([...(schedule[emp.id]?.leaveDays||[])]);};
  const toggleLeave=d=>{
    setEditLeaves(prev=>{
      if(prev.includes(d))return prev.filter(x=>x!==d);
      if(prev.length>=(editEmp.hasChild?4:2)+2)return prev;
      return[...prev,d].sort((a,b)=>a-b);
    });
  };
  const saveEdit=()=>{
    setSchedule(prev=>({...prev,[editEmp.id]:{...prev[editEmp.id],leaveDays:editLeaves}}));
    setEditEmp(null);
  };

  const regenerate=()=>setSchedule(generateSchedule(active,month,year,bonus));

  const applyBonus=()=>{setSchedule(generateSchedule(active,month,year,bonus));setShowBonus(false);};

  const lebaranMap={1:[29,30,31],2:[1,2,3,4,5],3:[6,7,8,9,10]};
  const applyLebaran=sesi=>{
    const days=lebaranMap[sesi]||[];
    const ns={...schedule};
    active.forEach(emp=>{ns[emp.id]={...ns[emp.id],leaveDays:days.slice(0,sesi===1?3:5)};});
    setSchedule(ns);setShowLebaran(false);
  };

  return(
    <div>
      <div style={{background:`linear-gradient(135deg,${C.dark},#3C1808)`,padding:"52px 16px 16px",borderRadius:"0 0 28px 28px",color:C.white}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div><div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700}}>Jadwal {MONTHS[month]} {year}</div><div style={{opacity:.65,fontSize:12,marginTop:2}}>Kelola jadwal libur semua cabang</div></div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setShowLebaran(true)} style={{background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.25)",borderRadius:10,padding:"7px 11px",color:C.white,cursor:"pointer",fontSize:12,fontWeight:600}}>🌙 Lebaran</button>
            <button onClick={()=>setShowBonus(true)} style={{background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.25)",borderRadius:10,padding:"7px 11px",color:C.white,cursor:"pointer",fontSize:12,fontWeight:600}}>✨ Bonus</button>
          </div>
        </div>
        <div style={{overflowX:"auto",display:"flex",gap:7,paddingBottom:4}}>
          {BRANCHES.map(b=>(
            <button key={b} onClick={()=>setBranch(b)} className="tnb" style={{flexShrink:0,padding:"7px 14px",borderRadius:20,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,background:branch===b?"rgba(255,255,255,.9)":"rgba(255,255,255,.12)",color:branch===b?C.brown:C.white}}>{b}</button>
          ))}
        </div>
      </div>
      <div style={{padding:"16px"}}>
        <div style={{background:`${C.med}12`,borderRadius:16,padding:14,border:`1px solid ${C.med}30`,marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontSize:13,fontWeight:700,color:C.brown}}>🤖 Auto-Generate</div><div style={{fontSize:11,color:C.textLight,marginTop:2}}>Tiap tgl 20 → jadwal bulan depan dibuat otomatis</div></div>
          <Btn onClick={regenerate} s={{padding:"8px 14px",fontSize:12}}>Generate</Btn>
        </div>
        <div style={{background:C.card,borderRadius:18,border:`1px solid ${C.border}`,overflow:"hidden"}}>
          <div style={{padding:"13px 16px",borderBottom:`1px solid ${C.border}`,fontWeight:700,color:C.dark,fontSize:14}}>Cabang {branch} — {branchEmps.length} karyawan</div>
          {branchEmps.map(emp=>{
            const leaves=schedule[emp.id]?.leaveDays||[];
            return(
              <div key={emp.id} style={{padding:"14px 16px",borderBottom:`1px solid ${C.border}`}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <Av name={emp.name} sz={36}/>
                  <div style={{flex:1}}><div style={{fontWeight:700,color:C.dark,fontSize:14}}>{emp.name}</div><div style={{fontSize:11,color:C.textLight}}>Jatah: {emp.hasChild?4:2} hari/bln</div></div>
                  <button onClick={()=>openEdit(emp)} style={{background:C.cream,border:`1px solid ${C.border}`,borderRadius:10,padding:"6px 12px",cursor:"pointer",fontSize:12,fontWeight:600,color:C.brown,display:"flex",alignItems:"center",gap:4}}><Edit3 size={12}/>Edit</button>
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {leaves.map(d=>(
                    <div key={d} style={{background:isPremium(d,month,year)?`${C.warning}18`:C.cream,border:`1px solid ${isPremium(d,month,year)?C.warning:C.border}`,borderRadius:8,padding:"4px 10px",fontSize:12,fontWeight:600,color:isPremium(d,month,year)?C.warning:C.brown}}>
                      {d} {DOW[getDOW(d,month,year)]}{isPremium(d,month,year)&&" ⚡"}
                    </div>
                  ))}
                  {leaves.length===0&&<span style={{fontSize:12,color:C.textLight,fontStyle:"italic"}}>Belum ada jadwal</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal show={!!editEmp} onClose={()=>setEditEmp(null)} title={`Edit Libur — ${editEmp?.name}`}>
        {editEmp&&(
          <div>
            <div style={{fontSize:13,color:C.textMed,marginBottom:12}}>Ketuk tanggal untuk pilih/hapus. Jatah normal: <strong>{editEmp.hasChild?4:2} hari</strong>. ⚡ = hari premium.</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:14}}>
              {DOW.map(d=><div key={d} style={{textAlign:"center",fontSize:10,fontWeight:700,color:["Min","Jum","Sab"].includes(d)?C.warning:C.textLight}}>{d}</div>)}
              {Array.from({length:getDOW(1,month,year)}).map((_,i)=><div key={`e${i}`}/>)}
              {Array.from({length:total}).map((_,i)=>{
                const d=i+1;const sel=editLeaves.includes(d);const prem=isPremium(d,month,year);const hol=hols.includes(d);
                return(
                  <div key={d} onClick={()=>toggleLeave(d)} style={{borderRadius:8,padding:"5px 2px",textAlign:"center",cursor:"pointer",background:sel?C.med:hol?`${C.danger}10`:"transparent",border:`1px solid ${sel?C.med:hol?`${C.danger}30`:prem?`${C.warning}30`:"transparent"}`}}>
                    <div style={{fontSize:12,fontWeight:sel?700:400,color:sel?C.white:hol?C.danger:prem?C.warning:C.text}}>{d}</div>
                    {prem&&!sel&&<div style={{fontSize:7,color:C.warning}}>⚡</div>}
                  </div>
                );
              })}
            </div>
            <div style={{background:C.cream,borderRadius:12,padding:12,marginBottom:16,fontSize:13}}>
              Dipilih: <strong style={{color:C.brown}}>{editLeaves.join(", ")||"Belum ada"}</strong>
              <span style={{color:C.textLight,marginLeft:8}}>({editLeaves.length} hari)</span>
            </div>
            <div style={{display:"flex",gap:8}}><Btn onClick={()=>setEditEmp(null)} v="ghost" s={{flex:1}}>Batal</Btn><Btn onClick={saveEdit} s={{flex:2}}>Simpan Jadwal ✓</Btn></div>
          </div>
        )}
      </Modal>

      {/* Bonus Modal */}
      <Modal show={showBonus} onClose={()=>setShowBonus(false)} title="✨ Bonus Libur untuk Semua">
        <div style={{fontSize:13,color:C.textMed,marginBottom:16,lineHeight:1.6}}>Tambah hari libur bonus untuk semua karyawan aktif. (Tanpa anak: 2+bonus, Punya anak: 4+bonus)</div>
        <div style={{display:"flex",alignItems:"center",gap:16,justifyContent:"center",background:C.cream,borderRadius:16,padding:20,marginBottom:20}}>
          <button onClick={()=>setBonus(p=>Math.max(0,p-1))} style={{width:44,height:44,borderRadius:12,border:`2px solid ${C.border}`,background:C.card,fontSize:22,cursor:"pointer",color:C.brown,fontWeight:700}}>−</button>
          <div style={{textAlign:"center"}}><div style={{fontSize:40,fontWeight:800,color:C.dark}}>{bonus}</div><div style={{fontSize:12,color:C.textLight}}>hari bonus</div></div>
          <button onClick={()=>setBonus(p=>Math.min(5,p+1))} style={{width:44,height:44,borderRadius:12,border:`2px solid ${C.border}`,background:C.card,fontSize:22,cursor:"pointer",color:C.brown,fontWeight:700}}>+</button>
        </div>
        <Btn onClick={applyBonus} s={{width:"100%"}}>Terapkan +{bonus} Hari Bonus</Btn>
      </Modal>

      {/* Lebaran Modal */}
      <Modal show={showLebaran} onClose={()=>setShowLebaran(false)} title="🌙 Jadwal Lebaran">
        <div style={{fontSize:13,color:C.textMed,marginBottom:16,lineHeight:1.6}}>Pilih sesi lebaran untuk diterapkan ke semua karyawan:</div>
        {[{sesi:1,label:"Sesi 1 — Hari H Lebaran",desc:"Libur 3 hari (pas hari raya)",days:"29–31 Mei",c:C.gold},{sesi:2,label:"Sesi 2 — Pasca Lebaran",desc:"Libur 5 hari (setelah hari raya)",days:"1–5 Juni",c:C.med},{sesi:3,label:"Sesi 3 — Pasca Lebaran",desc:"Libur 5 hari (lebih akhir)",days:"6–10 Juni",c:C.brown}].map(({sesi,label,desc,days,c})=>(
          <div key={sesi} onClick={()=>setLSesi(sesi)} style={{padding:16,borderRadius:16,border:`2px solid ${lSesi===sesi?c:C.border}`,background:lSesi===sesi?`${c}10`:C.card,cursor:"pointer",marginBottom:10}}>
            <div style={{fontWeight:700,color:c,fontSize:14}}>{label}</div>
            <div style={{fontSize:12,color:C.textMed,marginTop:4}}>{desc}</div>
            <div style={{fontSize:11,color:C.textLight,marginTop:2}}>📅 {days}</div>
          </div>
        ))}
        <Btn onClick={()=>{if(lSesi)applyLebaran(lSesi);}} disabled={!lSesi} s={{width:"100%",marginTop:8}}>Terapkan Sesi {lSesi||"—"}</Btn>
      </Modal>
    </div>
  );
}

/* ═══ ADMIN KARYAWAN ═══ */
function AdminKaryawan({employees,setEmployees}){
  const[search,setSearch]=useState("");const[fb,setFb]=useState("Semua");const[showAdd,setShowAdd]=useState(false);
  const[form,setForm]=useState({name:"",branch:"OBP",hasChild:false,username:"",password:"1234"});
  const list=employees.filter(e=>(e.name.toLowerCase().includes(search.toLowerCase())||e.username.toLowerCase().includes(search.toLowerCase()))&&(fb==="Semua"||e.branch===fb));
  const add=()=>{if(!form.name.trim()||!form.username.trim())return;setEmployees(p=>[...p,{...form,id:`e${Date.now()}`,active:true,name:form.name.trim(),username:form.username.trim().toLowerCase()}]);setShowAdd(false);setForm({name:"",branch:"OBP",hasChild:false,username:"",password:"1234"});};
  const toggleActive=id=>setEmployees(p=>p.map(e=>e.id===id?{...e,active:!e.active}:e));
  return(
    <div>
      <div style={{background:`linear-gradient(135deg,${C.dark},#3C1808)`,padding:"52px 16px 16px",borderRadius:"0 0 28px 28px",color:C.white}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div><div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700}}>Karyawan</div><div style={{opacity:.65,fontSize:12,marginTop:2}}>{employees.filter(e=>e.active).length} aktif · {employees.filter(e=>!e.active).length} nonaktif</div></div>
          <button onClick={()=>setShowAdd(true)} style={{background:"rgba(255,255,255,.18)",border:"1px solid rgba(255,255,255,.28)",borderRadius:12,padding:"8px 14px",color:C.white,cursor:"pointer",fontSize:13,fontWeight:600,display:"flex",alignItems:"center",gap:6}}><Plus size={14}/>Tambah</button>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,background:"rgba(255,255,255,.12)",borderRadius:12,padding:"9px 12px",border:"1px solid rgba(255,255,255,.2)"}}>
          <Search size={14} color="rgba(255,255,255,.6)"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari nama / username..." style={{border:"none",background:"transparent",flex:1,fontSize:13,color:C.white}}/>
        </div>
      </div>
      <div style={{padding:"14px 16px"}}>
        <div style={{overflowX:"auto",display:"flex",gap:7,paddingBottom:4,marginBottom:12}}>
          {["Semua",...BRANCHES].map(b=>(
            <button key={b} onClick={()=>setFb(b)} className="tnb" style={{flexShrink:0,padding:"6px 14px",borderRadius:20,cursor:"pointer",fontSize:12,fontWeight:600,border:`1.5px solid ${fb===b?C.med:C.border}`,background:fb===b?C.med:C.card,color:fb===b?C.white:C.textMed}}>{b}</button>
          ))}
        </div>
        <div style={{background:C.card,borderRadius:18,border:`1px solid ${C.border}`,overflow:"hidden"}}>
          {list.length===0&&<div style={{padding:24,textAlign:"center",color:C.textLight,fontSize:13}}>Tidak ditemukan</div>}
          {list.map(emp=>(
            <div key={emp.id} style={{padding:"13px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:12,opacity:emp.active?1:.5}}>
              <Av name={emp.name} sz={40}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:700,color:C.dark,fontSize:14}}>{emp.name}</div>
                <div style={{fontSize:11,color:C.textLight,marginTop:2,display:"flex",gap:6,flexWrap:"wrap"}}>
                  <span style={{background:C.cream,padding:"1px 7px",borderRadius:8}}>{emp.branch}</span>
                  <span style={{background:emp.hasChild?`${C.success}15`:C.cream,color:emp.hasChild?C.success:C.textLight,padding:"1px 7px",borderRadius:8}}>{emp.hasChild?"👶 Punya anak":"🙋 Belum"}</span>
                </div>
              </div>
              <button onClick={()=>toggleActive(emp.id)} style={{background:emp.active?`${C.danger}12`:`${C.success}12`,border:`1px solid ${emp.active?C.danger:C.success}`,borderRadius:10,padding:"6px 11px",cursor:"pointer",fontSize:11,fontWeight:700,color:emp.active?C.danger:C.success,flexShrink:0}}>{emp.active?"Nonaktif":"Aktifkan"}</button>
            </div>
          ))}
        </div>
      </div>
      <Modal show={showAdd} onClose={()=>setShowAdd(false)} title="➕ Tambah Karyawan Baru">
        <Fld label="Nama Lengkap"><Inp value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Nama lengkap karyawan"/></Fld>
        <Fld label="Username"><Inp value={form.username} onChange={e=>setForm(p=>({...p,username:e.target.value}))} placeholder="untuk login, contoh: siti"/></Fld>
        <Fld label="Password Awal"><Inp value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} placeholder="password awal"/></Fld>
        <Fld label="Cabang"><select value={form.branch} onChange={e=>setForm(p=>({...p,branch:e.target.value}))} style={{width:"100%",padding:"11px 14px",border:`1.5px solid ${C.border}`,borderRadius:12,fontSize:14,color:C.text,background:C.bg}}>{BRANCHES.map(b=><option key={b}>{b}</option>)}</select></Fld>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20,cursor:"pointer"}} onClick={()=>setForm(p=>({...p,hasChild:!p.hasChild}))}>
          <div style={{width:22,height:22,borderRadius:6,border:`2px solid ${form.hasChild?C.med:C.border}`,background:form.hasChild?C.med:"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>{form.hasChild&&<Check size={13} color={C.white}/>}</div>
          <span style={{fontSize:14,color:C.dark}}>Punya Anak <span style={{color:C.textLight,fontSize:12}}>(jatah 4 hari/bln)</span></span>
        </div>
        <Btn onClick={add} disabled={!form.name||!form.username} s={{width:"100%"}}>Tambah Karyawan</Btn>
      </Modal>
    </div>
  );
}

/* ═══ ADMIN ROLLING ═══ */
function AdminRolling({employees,setEmployees}){
  const[preview,setPreview]=useState(null);
  const doRoll=()=>{
    const active=employees.filter(e=>e.active);
    const shuffled=[...active].sort(()=>Math.random()-.5);
    const assigned={};
    shuffled.forEach((e,i)=>{assigned[e.id]=BRANCHES[i%BRANCHES.length];});
    setPreview(assigned);
  };
  const applyRoll=()=>{
    setEmployees(p=>p.map(e=>preview[e.id]?{...e,branch:preview[e.id]}:e));
    setPreview(null);
  };
  const byBranch=preview&&BRANCHES.reduce((acc,b)=>{acc[b]=employees.filter(e=>preview[e.id]===b);return acc;},{});
  return(
    <div>
      <div style={{background:`linear-gradient(135deg,${C.dark},#3C1808)`,padding:"52px 20px 28px",borderRadius:"0 0 28px 28px",color:C.white}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700}}>Rolling Cabang</div>
        <div style={{opacity:.65,fontSize:13,marginTop:4}}>Rotasi karyawan ke 12 cabang setiap bulan</div>
      </div>
      <div style={{padding:"18px 16px"}}>
        <div style={{background:C.card,borderRadius:18,padding:18,border:`1px solid ${C.border}`,marginBottom:16}}>
          <div style={{fontWeight:700,color:C.dark,fontSize:15,marginBottom:8}}>🔀 Rolling Acak</div>
          <div style={{fontSize:13,color:C.textMed,lineHeight:1.6,marginBottom:16}}>Sistem random distribusi semua karyawan ke 12 cabang. Preview dulu sebelum apply.</div>
          <Btn onClick={doRoll} s={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><Shuffle size={16}/>Generate Preview Rolling</Btn>
        </div>
        {preview?(
          <div>
            <div style={{fontWeight:700,color:C.dark,fontSize:15,marginBottom:12}}>👀 Preview Rolling Bulan Depan:</div>
            <div style={{background:C.card,borderRadius:18,border:`1px solid ${C.border}`,overflow:"hidden",marginBottom:14}}>
              {BRANCHES.map(b=>(
                <div key={b} style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`}}>
                  <div style={{fontWeight:700,color:C.brown,marginBottom:8}}>{b} <span style={{fontSize:12,color:C.textLight,fontWeight:400}}>({(byBranch[b]||[]).length} org)</span></div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {(byBranch[b]||[]).map(e=><div key={e.id} style={{background:C.cream,borderRadius:8,padding:"4px 10px",fontSize:12,fontWeight:600,color:C.brown}}>{e.name}</div>)}
                  </div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:8}}>
              <Btn onClick={()=>setPreview(null)} v="ghost" s={{flex:1}}>Batal</Btn>
              <Btn onClick={applyRoll} s={{flex:2,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><Check size={16}/>Terapkan Rolling</Btn>
            </div>
          </div>
        ):(
          <div style={{background:C.cream,borderRadius:16,padding:16,border:`1px solid ${C.border}`}}>
            <div style={{fontWeight:700,color:C.brown,marginBottom:10}}>📋 Distribusi Cabang Saat Ini</div>
            {BRANCHES.map(b=>{
              const cnt=employees.filter(e=>e.active&&e.branch===b).length;
              return(
                <div key={b} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px dashed ${C.border}`}}>
                  <span style={{fontWeight:600,color:C.dark}}>{b}</span>
                  <span style={{color:C.textMed,fontSize:13}}>{cnt} karyawan</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══ MAIN APP ═══ */
export default function App(){
  const[user,setUser]=useState(null);
  const[employees,setEmployees]=useLS("tns_employees",INIT_EMPS);
  const[schedule,setSchedule]=useLS("tns_schedule",()=>generateSchedule(INIT_EMPS,5,2026));
  const[swaps,setSwaps]=useLS("tns_swaps",[]);
  const[notifs,setNotifs]=useLS("tns_notifs",{});
  const[tab,setTab]=useState("home");

  const addNotif=(userId,notif)=>setNotifs(p=>({...p,[userId]:[...(p[userId]||[]),{...notif,id:`n${Date.now()}`,read:false,ts:Date.now()}]}));
  const markRead=userId=>setNotifs(p=>({...p,[userId]:(p[userId]||[]).map(n=>({...n,read:true}))}));

  const handleLogin=(u,p)=>{
    if(u==="admin"&&p==="admin123"){setUser({id:"admin",name:"Admin",role:"admin",username:"admin"});setTab("home");return true;}
    const emp=employees.find(e=>e.username===u&&e.password===p&&e.active);
    if(emp){setUser({...emp,role:"employee"});setTab("home");return true;}
    return false;
  };

  if(!user) return <Login onLogin={handleLogin}/>;

  const isAdmin=user.role==="admin";
  const unread=(notifs[user.id]||[]).filter(n=>!n.read).length;
  const pendingIn=swaps.filter(s=>s.targetId===user.id&&s.status==="pending").length;

  const empTabs=[{id:"home",icon:<Home size={20}/>,label:"Beranda",badge:0},{id:"jadwal",icon:<Calendar size={20}/>,label:"Kalender",badge:0},{id:"tukar",icon:<ArrowLeftRight size={20}/>,label:"Tukar",badge:pendingIn},{id:"profil",icon:<User size={20}/>,label:"Profil",badge:unread}];
  const adminTabs=[{id:"home",icon:<Home size={20}/>,label:"Dashboard",badge:0},{id:"jadwal",icon:<Calendar size={20}/>,label:"Jadwal",badge:0},{id:"karyawan",icon:<Users size={20}/>,label:"Karyawan",badge:0},{id:"rolling",icon:<Shuffle size={20}/>,label:"Rolling",badge:0}];
  const tabs=isAdmin?adminTabs:empTabs;

  return(
    <div style={{background:C.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto",display:"flex",flexDirection:"column",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{GS}</style>
      <div style={{flex:1,overflowY:"auto",paddingBottom:76}}>
        {!isAdmin&&tab==="home"&&<EmpBeranda user={user} schedule={schedule} swaps={swaps} employees={employees}/>}
        {!isAdmin&&tab==="jadwal"&&<EmpKalender user={user} schedule={schedule}/>}
        {!isAdmin&&tab==="tukar"&&<EmpTukar user={user} employees={employees} schedule={schedule} swaps={swaps} setSwaps={setSwaps} addNotif={addNotif}/>}
        {!isAdmin&&tab==="profil"&&<EmpProfil user={user} notifs={notifs} markRead={markRead} onLogout={()=>{setUser(null);setTab("home");}}/>}
        {isAdmin&&tab==="home"&&<AdminDash employees={employees} swaps={swaps} schedule={schedule}/>}
        {isAdmin&&tab==="jadwal"&&<AdminJadwal employees={employees} schedule={schedule} setSchedule={setSchedule}/>}
        {isAdmin&&tab==="karyawan"&&<AdminKaryawan employees={employees} setEmployees={setEmployees}/>}
        {isAdmin&&tab==="rolling"&&<AdminRolling employees={employees} setEmployees={setEmployees}/>}
      </div>
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:C.card,borderTop:`1px solid ${C.border}`,display:"flex",zIndex:100,boxShadow:"0 -4px 24px rgba(28,10,2,.1)"}}>
        {tabs.map(t=>{
          const active=tab===t.id;
          return(
            <button key={t.id} onClick={()=>setTab(t.id)} className="tnb" style={{flex:1,padding:"10px 0 12px",border:"none",background:"transparent",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,position:"relative"}}>
              {active&&<div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:28,height:3,background:C.med,borderRadius:"0 0 4px 4px"}}/>}
              <div style={{color:active?C.med:C.textLight,transition:"color .2s"}}>{t.icon}</div>
              <span style={{fontSize:10,fontWeight:active?700:400,color:active?C.med:C.textLight}}>{t.label}</span>
              {t.badge>0&&<div style={{position:"absolute",top:6,right:"calc(50% - 16px)",background:C.danger,color:"#fff",borderRadius:10,minWidth:16,height:16,fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 4px"}}>{t.badge}</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
