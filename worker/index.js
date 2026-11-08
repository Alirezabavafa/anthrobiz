// Sites supplies verified identity headers. Never take a user ID from request JSON.
export const blankWorkspace=()=>({profile:null,saved:[],reviews:[],trial:null,measurement:null,contributions:[]});
const json=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const text=(v,max=400)=>typeof v==='string'?v.trim().slice(0,max):'';
export function cleanWorkspace(value){
 if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('Invalid workspace');
 const result=blankWorkspace();
 if(value.profile){const p=value.profile;result.profile={};for(const key of ['name','industry','team','revenue','software','budget','location','problem','publicLinks'])result.profile[key]=text(p[key],key==='problem'?1500:key==='publicLinks'?1000:200);if(!result.profile.name||!result.profile.industry||!result.profile.team||!result.profile.problem)throw new Error('Complete your business name, type, size and issue.');}
 if(value.roundtable&&result.profile&&value.roundtable.issue===result.profile.problem){const r=value.roundtable;result.roundtable={issue:text(r.issue,1500),answers:Array.isArray(r.answers)?r.answers.slice(0,3).map(v=>text(v,1200)):[],complete:r.complete===true,skipped:r.skipped===true};}
 result.saved=Array.isArray(value.saved)?[...new Set(value.saved.filter(v=>typeof v==='string'&&/^[a-z0-9-]{1,70}$/.test(v)))].slice(0,200):[];
 result.reviews=Array.isArray(value.reviews)?value.reviews.slice(-100).map(r=>({tool:text(r.tool,70),task:text(r.task,100),body:text(r.body,1000),rating:Math.max(1,Math.min(5,Math.round(Number(r.rating)||3)))})):[];
 result.contributions=Array.isArray(value.contributions)?value.contributions.slice(-20).map(c=>{const type=c?.type==='tool'?'tool':c?.type==='story'?'story':'';if(!type)return null;const raw=c.fields&&typeof c.fields==='object'?c.fields:{};const keys=type==='tool'?['name','url','company','contact','category','description','capabilities','pricingUrl','integrations','privacyUrl','agentUrl','testingAccess']:['businessType','businessSize','location','role','tool','problem','outcome','timeframe','details','tradeoff','displayName','permission'];const fields={};for(const key of keys)fields[key]=text(raw[key],['description','capabilities','details'].includes(key)?1200:500);return {type,status:'pending',createdAt:!Number.isNaN(Date.parse(c.createdAt))?new Date(c.createdAt).toISOString():new Date().toISOString(),fields};}).filter(Boolean):[];
 if(value.trial){const t=value.trial;result.trial={topic:text(t.topic,70),measureLabel:text(t.measureLabel,100),safety:text(t.safety,400),choice:text(t.choice,200),baseline:text(t.baseline,400),goal:text(t.goal,400),start:!Number.isNaN(Date.parse(t.start))?new Date(t.start).toISOString():new Date().toISOString(),checks:[0,1,2,3].map(i=>t.checks?.[i]===true),decision:text(t.decision,200)||null,entries:Array.isArray(t.entries)?t.entries.slice(-100).map(e=>({date:text(e.date,40),missed:Math.max(0,Math.min(100000,Number(e.missed)||0)),minutes:Math.max(0,Math.min(100000,Number(e.minutes)||0)),cost:Math.max(0,Math.min(1000000,Number(e.cost)||0)),note:text(e.note,1000)})):[]};}
 if(value.measurement&&result.profile&&value.measurement.issue===result.profile.problem){const m=value.measurement;result.measurement={issue:text(m.issue,1500),metrics:Array.isArray(m.metrics)?m.metrics.slice(0,3).map(k=>({id:text(k.id,80).replace(/[^a-z0-9-]/gi,''),topic:text(k.topic,70),label:text(k.label,120),unit:text(k.unit,40),direction:k.direction==='up'?'up':'down',why:text(k.why,300),how:text(k.how,500),entries:Array.isArray(k.entries)?k.entries.slice(-100).map(e=>({date:!Number.isNaN(Date.parse(e.date))?new Date(e.date).toISOString():new Date().toISOString(),value:Math.max(0,Math.min(100000000,Number(e.value)||0)),note:text(e.note,500)})):[]})).filter(k=>k.id&&k.label):[],updates:Array.isArray(m.updates)?m.updates.slice(-100).map(u=>({type:['metric','incident','tool-change','purchase'].includes(u.type)?u.type:'incident',date:!Number.isNaN(Date.parse(u.date))?new Date(u.date).toISOString():new Date().toISOString(),metricId:text(u.metricId,80).replace(/[^a-z0-9-]/gi,''),value:Math.max(0,Math.min(100000000,Number(u.value)||0)),tool:text(u.tool,120),cost:Math.max(0,Math.min(1000000,Number(u.cost)||0)),note:text(u.note,1000)})):[]};}
 return result;
}
export async function handle(request,env,assets){
 const u=new URL(request.url),path=u.pathname;
 const userId=request.headers.get('oai-authenticated-user-id');
 if(path==='/api/session')return json({user:userId?{signedIn:true}:null});
 if(path==='/api/workspace'){
  if(!userId)return json({error:'Please log in to access your workspace.'},401);
  if(!env.DB)return json({error:'Saved profiles are temporarily unavailable. Please try again.'},503);
  try{
   if(request.method==='GET'){const row=await env.DB.prepare('SELECT payload FROM workspaces WHERE user_id = ?').bind(userId).first();return json(row?JSON.parse(row.payload):blankWorkspace());}
   if(request.method!=='PUT')return json({error:'Method not allowed'},405);
   if(request.headers.get('Origin')!==u.origin)return json({error:'Invalid request origin'},403);
   if(!request.headers.get('Content-Type')?.startsWith('application/json'))return json({error:'JSON is required'},415);
   if(Number(request.headers.get('Content-Length'))>100000)return json({error:'Workspace is too large'},413);
   const body=await request.text();if(new TextEncoder().encode(body).length>100000)return json({error:'Workspace is too large'},413);
   let value;try{value=cleanWorkspace(JSON.parse(body));}catch(e){return json({error:e.message||'Invalid workspace'},400);}
   await env.DB.prepare('INSERT INTO workspaces (user_id, payload, updated_at) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at').bind(userId,JSON.stringify(value),new Date().toISOString()).run();
   return json({ok:true});
  }catch{return json({error:'Your workspace could not be saved or loaded. Please try again.'},503);}
 }
 if(path.startsWith('/api/'))return json({error:'Not found'},404);
 if(['/dashboard','/onboarding'].includes(path)&&!userId)return Response.redirect(u.origin+'/signin-with-chatgpt?return_to='+encodeURIComponent(path),302);
 if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405});
 let assetPath=path==='/'||['/discover','/dashboard','/onboarding','/proof-lab','/stories','/developers'].includes(path)?'/index.html':path;
 const asset=assets[assetPath];if(!asset)return new Response('Not found',{status:404});
 const bytes=Uint8Array.from(atob(asset.body),c=>c.charCodeAt(0));
 return new Response(request.method==='HEAD'?null:bytes,{headers:{'Content-Type':asset.type,'Cache-Control':path==='/dashboard'||path==='/onboarding'?'no-store':'public, max-age=0, must-revalidate','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-ancestors 'self' https://chatgpt.com https://*.chatgpt.com; base-uri 'self'; form-action 'self'"}});
}
export default {fetch(request,env){return handle(request,env,ASSETS);}};
