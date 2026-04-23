import { useMemo, useState } from "react";
import { usePortfolioReport } from "../hooks/usePortfolioReport";

const C = {
  forest900:"#1A3326",forest800:"#22422F",forest700:"#2D5A3D",forest600:"#3A6E4A",
  forest500:"#4A8A5A",forest300:"#7CB98A",forest100:"#D6EBD8",forest50:"#EFF7F0",
  cream:"#FAF8F5",sand100:"#F0EDE8",sand200:"#DDD9D2",sand400:"#9E9A92",
  sand600:"#5E5A54",sand800:"#2A2724",sand900:"#1A1814",
  gold:"#C9933A",goldSoft:"#FBF3E6",coral:"#C0524A",coralSoft:"#FDF1F0",
  sky:"#3D6E8A",white:"#FFFFFF",
};
const fonts = {
  display:"'Georgia','Times New Roman',serif",
  body:"'Trebuchet MS','Lucida Sans Unicode',sans-serif",
};

const fmt$ = (v?: number) => {
  if (typeof v !== "number" || isNaN(v)) return "—";
  return v.toLocaleString("es-DO",{style:"currency",currency:"DOP",minimumFractionDigits:2,maximumFractionDigits:2});
};
const fmtText = (v?: string|number|null) => (v===null||v===undefined||v===""?"—":String(v));

type PortfolioRow = {
  loanId?:string|number; loanNumber?:string|number;
  client?:string; clientName?:string;
  originalAmount?:number; amount?:number;
  outstandingBalance?:number; balance?:number;
  totalFeePaidCount?:number; totalFeeCount?:number;
  daysInArrears?:number|null; daysPastDue?:number|null;
  state?:string; status?:string;
};

const getStatusStyle = (s?:string) => {
  const l=(s??"").toLowerCase();
  if(l.includes("día")||l.includes("dia")||l.includes("current"))
    return {bg:C.forest50,color:C.forest700,border:C.forest100};
  if(l.includes("mora")||l.includes("overdue")||l.includes("late"))
    return {bg:C.coralSoft,color:C.coral,border:"#f7c8c5"};
  if(l.includes("vencer")||l.includes("due"))
    return {bg:C.goldSoft,color:C.gold,border:"#f0ddb8"};
  return {bg:C.sand100,color:C.sand600,border:C.sand200};
};

export default function PortfolioReportPage() {
  const {report,items,isLoading,error,refetch} = usePortfolioReport();
  const [searchInput,setSearchInput] = useState("");
  const summary = report?.summary ?? report;

  const filtered = useMemo(()=>{
    const q=searchInput.toLowerCase().trim();
    if(!q) return items??[];
    return (items??[]).filter((item:PortfolioRow)=>{
      const client=(item.clientName??item.client??"").toLowerCase();
      const ln=String(item.loanNumber??"").toLowerCase();
      const st=(item.status??item.state??"").toLowerCase();
      return client.includes(q)||ln.includes(q)||st.includes(q);
    });
  },[items,searchInput]);

  return (
    <div style={page}>

      <nav style={nav}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <CredioMark size={34}/>
          <div>
            <div style={{fontFamily:fonts.display,fontWeight:700,fontSize:16,color:C.sand900,letterSpacing:"-.3px",lineHeight:"1.1"}}>Credio</div>
            <div style={{fontSize:9,color:C.sand400,letterSpacing:"1.4px",textTransform:"uppercase",fontFamily:fonts.body}}>Sistema de Gestión</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={navPill}>Reporte de cartera</span>
          <span style={navDot as React.CSSProperties}/>
        </div>
      </nav>

      <div style={heroStrip}>
        <h1 style={heroTitle}>Reporte de cartera</h1>
        <p style={heroSub}>Consulta el estado actual de la cartera de préstamos</p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12}}>
        <StatCard label="Total préstamos"  value={typeof summary?.totalLoans==="number"?summary.totalLoans.toLocaleString("es-DO"):"—"} sub="Contratos activos"     accent={C.forest600}/>
        <StatCard label="Cartera total"    value={fmt$(summary?.totalPortfolio)}                      sub="Capital colocado"      accent={C.sky}/>
        <StatCard label="Cargos por mora"  value={fmt$(summary?.lateFees??summary?.totalOverdue)}     sub="Recargo acumulado"     accent={C.gold}/>
        <StatCard label="Balance total"    value={fmt$(summary?.totalBalance)}                        sub="Pendiente por cobrar"  accent={C.coral}/>
      </div>

      <div style={card}>
        <div style={{...cardHead,justifyContent:"space-between",flexWrap:"wrap" as const,gap:10}}>
          <SectionLabel color={C.forest600}>Detalle de cartera</SectionLabel>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <div style={{position:"relative"}}>
              <span style={searchIconSt}>⌕</span>
              <input value={searchInput} onChange={e=>setSearchInput(e.target.value)}
                placeholder="Buscar cliente, préstamo o estado…" style={searchInputSt}/>
            </div>
            <button onClick={refetch} style={btnRefresh}>↺ Refrescar</button>
          </div>
        </div>

        {isLoading && <div style={stateMsg}>Cargando reporte…</div>}

        {!isLoading&&error&&(
          <div style={{margin:"16px 20px",background:C.coralSoft,border:"1px solid #f7c8c5",borderRadius:9,padding:"12px 16px",fontSize:13,color:C.coral,fontFamily:fonts.body}}>
            {error}
          </div>
        )}

        {!isLoading&&!error&&filtered.length===0&&(
          <div style={stateMsg}>No hay datos disponibles para mostrar.</div>
        )}

        {!isLoading&&!error&&filtered.length>0&&(
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",minWidth:780}}>
              <thead>
                <tr style={{background:C.sand100}}>
                  {["Préstamo","Cliente","Monto original","Balance pendiente","Avance","Estado","Días en mora"].map(h=>(
                    <th key={h} style={th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((item:PortfolioRow,i:number)=>{
                  const original=item.originalAmount??item.amount;
                  const balance=item.outstandingBalance??item.balance;
                  const status=item.state??item.status;
                  const days=item.daysInArrears??item.daysPastDue;
                  const paid=item.totalFeePaidCount;
                  const total=item.totalFeeCount;
                  const progress=(paid!=null&&total!=null&&total>0)?(paid/total)*100:null;
                  const ss=getStatusStyle(status);
                  const moraColor=(!days||days===0)?C.sand400:days<=7?C.gold:C.coral;
                  return (
                    <tr key={`${item.loanId??item.loanNumber??i}`}
                      style={{borderBottom:`1px solid ${C.sand100}`,background:i%2===0?C.white:C.cream}}>
                      <td style={td_}>
                        <span style={{fontFamily:"monospace",fontSize:11,fontWeight:700,color:C.sky}}>
                          #{fmtText(item.loanNumber)}
                        </span>
                      </td>
                      <td style={{...td_,fontWeight:700,color:C.sand900,fontSize:13,fontFamily:fonts.display}}>
                        {fmtText(item.client??item.clientName)}
                      </td>
                      <td style={{...td_,fontFamily:fonts.display,fontWeight:700,color:C.sand900}}>
                        {fmt$(original)}
                      </td>
                      <td style={{...td_,fontFamily:fonts.display,fontWeight:700,color:C.forest700}}>
                        {fmt$(balance)}
                      </td>
                      <td style={td_}>
                        {progress!==null?(
                          <div style={{display:"flex",alignItems:"center",gap:6}}>
                            <div style={{flex:1,height:4,background:C.sand200,borderRadius:99,overflow:"hidden",minWidth:40}}>
                              <div style={{width:`${progress}%`,height:"100%",background:C.forest500,borderRadius:99}}/>
                            </div>
                            <span style={{fontSize:11,color:C.sand400,whiteSpace:"nowrap"}}>{paid}/{total}</span>
                          </div>
                        ):"—"}
                      </td>
                      <td style={td_}>
                        <span style={{padding:"3px 9px",borderRadius:99,fontSize:10,fontWeight:700,fontFamily:fonts.body,background:ss.bg,color:ss.color,border:`1px solid ${ss.border}`}}>
                          {fmtText(status)}
                        </span>
                      </td>
                      <td style={{...td_,fontWeight:700,color:moraColor}}>
                        {typeof days==="number"?days:"—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <footer style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,padding:"6px 0 4px"}}>
        <CredioMark size={20}/>
        <span style={{fontFamily:fonts.body,fontSize:12,color:C.sand400}}>
          Credio · Sistema de Gestión · {new Date().getFullYear()}
        </span>
      </footer>
    </div>
  );
}

function CredioMark({size=34}:{size?:number}){
  return(
    <div style={{width:size,height:size,borderRadius:Math.round(size*.265),background:C.forest800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
      <svg width={size*.5} height={size*.5} viewBox="0 0 24 24" fill="none">
        <path d="M18 6C14 4 8 5 6 10C4.5 14 6 18 10 19.5C7 17 7 13 9 10.5C11 8 15 7.5 18 9C17 7.5 17.5 6.5 18 6Z" fill="white" opacity=".9"/>
        <path d="M8 14C9 17 12 19 15 18.5C17 18 19 16 19.5 14C18 16 15 17 13 16C11 15 9.5 13 10 11C9 11.5 8 12.5 8 14Z" fill="white" opacity=".55"/>
      </svg>
    </div>
  );
}

function SectionLabel({color,children}:{color:string;children:React.ReactNode}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <div style={{width:3,height:17,background:color,borderRadius:2,flexShrink:0}}/>
      <h2 style={{fontFamily:fonts.display,fontSize:14,fontWeight:700,color:C.sand800,margin:0}}>{children}</h2>
    </div>
  );
}

function StatCard({label,value,sub,accent}:{label:string;value:string;sub:string;accent:string}){
  return(
    <div style={{background:C.white,borderRadius:12,padding:"16px 18px",border:`1px solid ${C.sand200}`,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:accent,borderRadius:"12px 12px 0 0"}}/>
      <div style={{fontSize:10,fontWeight:700,color:C.sand400,textTransform:"uppercase",letterSpacing:".8px",fontFamily:fonts.body,marginTop:2}}>{label}</div>
      <div style={{fontFamily:fonts.display,fontSize:18,fontWeight:800,color:C.sand900,margin:"6px 0 3px"}}>{value}</div>
      <div style={{fontSize:11,color:C.sand400,fontFamily:fonts.body}}>{sub}</div>
    </div>
  );
}

const page:React.CSSProperties={display:"grid",gap:18,padding:"clamp(16px,3vw,28px)",background:C.cream,minHeight:"100vh",fontFamily:fonts.body};
const nav:React.CSSProperties={display:"flex",justifyContent:"space-between",alignItems:"center",background:C.white,borderRadius:12,padding:"12px 18px",border:`1px solid ${C.sand200}`};
const navPill:React.CSSProperties={background:C.forest50,color:C.forest700,fontSize:11,fontWeight:600,padding:"4px 12px",borderRadius:99,border:`1px solid ${C.forest100}`,fontFamily:fonts.body};
const navDot={display:"inline-block",width:8,height:8,borderRadius:"50%",background:C.forest500,boxShadow:`0 0 0 3px ${C.forest100}`};
const heroStrip:React.CSSProperties={background:C.forest900,borderRadius:14,padding:"22px 28px"};
const heroTitle:React.CSSProperties={fontFamily:fonts.display,fontSize:"clamp(20px,4vw,26px)",fontWeight:700,color:C.white,margin:0,letterSpacing:"-.3px"};
const heroSub:React.CSSProperties={fontFamily:fonts.body,fontSize:12,color:C.forest300,marginTop:4,marginBottom:0};
const card:React.CSSProperties={background:C.white,borderRadius:14,border:`1px solid ${C.sand200}`,overflow:"hidden"};
const cardHead:React.CSSProperties={padding:"16px 20px",borderBottom:`1px solid ${C.sand100}`,display:"flex",alignItems:"center"};
const searchIconSt:React.CSSProperties={position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:C.sand400,fontSize:14,pointerEvents:"none"};
const searchInputSt:React.CSSProperties={padding:"7px 10px 7px 30px",borderRadius:8,border:`1px solid ${C.sand200}`,background:C.cream,fontFamily:fonts.body,fontSize:12,color:C.sand900,outline:"none",width:260};
const btnRefresh:React.CSSProperties={padding:"7px 14px",borderRadius:8,border:`1px solid ${C.sand200}`,background:C.white,color:C.sand600,fontFamily:fonts.body,fontSize:12,cursor:"pointer"};
const stateMsg:React.CSSProperties={padding:"40px",textAlign:"center",color:C.sand400,fontFamily:fonts.body,fontSize:13};
const th:React.CSSProperties={textAlign:"left",padding:"10px 14px",fontSize:10,fontWeight:700,color:C.sand600,textTransform:"uppercase",letterSpacing:".8px",fontFamily:fonts.body};
const td_:React.CSSProperties={padding:"12px 14px",fontSize:12,color:C.sand600};