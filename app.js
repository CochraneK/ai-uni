const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const STORE={settings:"aiuni:settings",active:"aiuni:active"};
const state={user:null};

function userKey(code){return "aiuni:user:"+code}
function loadJSON(k,f={}){try{return JSON.parse(localStorage.getItem(k))||f}catch{return f}}
function saveJSON(k,v){localStorage.setItem(k,JSON.stringify(v))}
function now(){return new Date().toISOString()}
function activeUser(){
  const code=localStorage.getItem(STORE.active);
  if(!code)return null;
  return loadJSON(userKey(code),null);
}
function ensureUser(){
  state.user=activeUser();
  if(!state.user){alert("请先在首页输入参与码。");nav("home");return false}
  return true;
}
function persist(){
  if(state.user)saveJSON(userKey(state.user.code),state.user);
}
function nav(name){
  $$(".view").forEach(v=>v.classList.remove("active"));
  $("#view-"+name)?.classList.add("active");
  if(name==="admin")renderAdmin();
  if(name==="report")renderReport();
  window.scrollTo({top:0,behavior:"smooth"});
}
$$("[data-nav]").forEach(b=>b.addEventListener("click",()=>nav(b.dataset.nav)));

$("#enterParticipant").onclick=()=>{
  const code=$("#participantCode").value.trim();
  if(!code)return;
  const existing=loadJSON(userKey(code),null);
  state.user=existing||{code,createdAt:now(),updatedAt:now(),future:{profile:{},persona:null,chat:[]},characters:[],report:null};
  state.user.updatedAt=now(); persist();
  localStorage.setItem(STORE.active,code);
  $("#activeUserLabel").textContent="当前参与码："+code;
};
const initial=activeUser(); if(initial){state.user=initial;$("#participantCode").value=initial.code;$("#activeUserLabel").textContent="当前参与码："+initial.code}

function settings(){return loadJSON(STORE.settings,{apiBase:"http://localhost:8000/v1",apiKey:"",textModel:"",imageModel:""})}
function loadSettings(){const s=settings();["apiBase","apiKey","textModel","imageModel"].forEach(k=>$("#"+k).value=s[k]||"")}
loadSettings();
$("#saveSettings").onclick=()=>{const s={};["apiBase","apiKey","textModel","imageModel"].forEach(k=>s[k]=$("#"+k).value.trim());saveJSON(STORE.settings,s);alert("已保存到当前浏览器。")};

async function llm(messages,{json=false}={}){
  const s=settings();
  if(!s.apiBase||!s.textModel)throw new Error("NO_MODEL");
  const url=s.apiBase.replace(/\/$/,"")+"/chat/completions";
  const headers={"Content-Type":"application/json"}; if(s.apiKey)headers.Authorization="Bearer "+s.apiKey;
  const body={model:s.textModel,messages,temperature:.8}; if(json)body.response_format={type:"json_object"};
  const r=await fetch(url,{method:"POST",headers,body:JSON.stringify(body)});
  if(!r.ok)throw new Error(await r.text());
  const data=await r.json();
  return data.choices?.[0]?.message?.content||"";
}
async function imageGen(prompt){
  const s=settings();
  if(!s.apiBase||!s.imageModel)throw new Error("NO_IMAGE_MODEL");
  const headers={"Content-Type":"application/json"}; if(s.apiKey)headers.Authorization="Bearer "+s.apiKey;
  const r=await fetch(s.apiBase.replace(/\/$/,"")+"/images/generations",{method:"POST",headers,body:JSON.stringify({model:s.imageModel,prompt,n:1,size:"1024x1024"})});
  if(!r.ok)throw new Error(await r.text());
  const data=await r.json(); return data.data?.[0]?.url||data.data?.[0]?.b64_json||null;
}
function speak(text){if(!("speechSynthesis" in window))return alert("当前浏览器不支持 TTS");speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(text))}
function safeJSON(text){try{return JSON.parse(text)}catch{const m=text.match(/\{[\s\S]*\}/);if(m)try{return JSON.parse(m[0])}catch{}return null}}
function esc(s=""){return s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]))}
function tags(a=[]){return '<div class="tags">'+a.map(x=>'<span class="tag">'+esc(String(x))+'</span>').join("")+"</div>"}
function addBubble(el,role,text){const d=document.createElement("div");d.className="bubble "+role;d.textContent=text;el.appendChild(d);el.scrollTop=el.scrollHeight}

function fallbackFuture(p){
  const years=p.years||4;
  return {name:years+"年后的我",headline:"一个仍在变化、但更了解取舍的未来版本",traits:["更清楚边界","保留好奇心","更会取舍"],story:"这是基于你当前自述生成的示例未来版本。真正接入模型后，会根据经历、价值和目标生成更具体的可能未来。",opening:"我不会告诉你未来已经注定，但可以陪你从这里往前看。"};
}
function renderFuture(){
  const f=state.user?.future?.persona;if(!f)return;
  $("#futureCard").innerHTML='<h2>'+esc(f.name||"未来的我")+'</h2><p>'+esc(f.headline||"")+'</p>'+tags(f.traits)+'<p>'+esc(f.story||"")+'</p>';
  if(state.user.future.avatar)showAvatar("#futureAvatar",state.user.future.avatar);
  renderChat("#futureChat",state.user.future.chat||[]);
}
$("#generateFuture").onclick=async()=>{
  if(!ensureUser())return;
  const p={now:$("#futureNow").value.trim(),events:$("#futureEvents").value.trim(),goals:$("#futureGoals").value.trim(),years:Number($("#futureYears").value)};
  state.user.future.profile=p;
  let persona;
  try{
    const out=await llm([{role:"system",content:"你是 Future Self 生成器。根据用户材料生成一个可能的未来自我，不作确定性预测。只输出 JSON：name, headline, traits(string[]), story, opening, image_prompt。保持具体、温暖、不过度积极。"}, {role:"user",content:JSON.stringify(p)}],{json:true});
    persona=safeJSON(out)||fallbackFuture(p);
  }catch{persona=fallbackFuture(p)}
  state.user.future.persona=persona; state.user.future.chat=state.user.future.chat||[]; if(!state.user.future.chat.length)state.user.future.chat.push({role:"assistant",content:persona.opening||"想聊聊现在的你吗？",at:now()});
  persist();renderFuture();
};
$("#sendFuture").onclick=async()=>{
  if(!ensureUser()||!state.user.future.persona)return;
  const input=$("#futureMessage"),msg=input.value.trim();if(!msg)return;input.value="";
  const chat=state.user.future.chat;chat.push({role:"user",content:msg,at:now()});renderFuture();
  let reply;
  try{reply=await llm([{role:"system",content:"你正在扮演用户的一个可能未来版本。依据 persona 与用户材料回应。不要声称预测未来，不虚构确定发生的重大事件。Persona:"+JSON.stringify(state.user.future.persona)+"\nUser:"+JSON.stringify(state.user.future.profile)},...chat.slice(-12).map(x=>({role:x.role,content:x.content}))])}
  catch{reply="如果站在未来回看，我会先问：这件事里，什么是你真正想保留的？"}
  chat.push({role:"assistant",content:reply,at:now()});persist();renderFuture();
};
$("#speakFuture").onclick=()=>{const c=state.user?.future?.chat||[];const t=c.filter(x=>x.role==="assistant").at(-1)?.content||state.user?.future?.persona?.story;if(t)speak(t)};
$("#generateFutureImage").onclick=async()=>{if(!ensureUser()||!state.user.future.persona)return;try{const p=state.user.future.persona.image_prompt||("portrait of a possible future self, "+state.user.future.persona.headline);const u=await imageGen(p);state.user.future.avatar=u;persist();showAvatar("#futureAvatar",u)}catch(e){alert("图像生成未成功。请检查图像模型、API 与 CORS。")}};

function fallbackCharacter(input){
  const names=["岚","Nova","林澈","阿澈"];const name=names[Math.floor(Math.random()*names.length)];
  return {name,headline:input.idea||"原创角色",traits:(input.tone||"温柔,好奇,有自己的观点").split(/[,，、]/).filter(Boolean),identity:"由你的灵感创造的原创角色",relationship:input.relation||"自定义关系",background:"TA 的背景会随着你们的交流逐渐变得具体。",speaking_style:input.tone||"自然聊天",opening:"你好。我好像刚刚从你的一个念头里醒过来。",image_prompt:"original character portrait, "+(input.idea||"friendly original AI character")};
}
function currentCharacter(){return state.user?.characters?.at(-1)||null}
function renderCharacter(){
  const c=currentCharacter();if(!c)return;
  $("#characterCard").innerHTML='<h2>'+esc(c.name)+'</h2><p>'+esc(c.headline||c.identity||"")+'</p>'+tags(c.traits)+'<p><b>关系：</b>'+esc(c.relationship||"")+'</p><p>'+esc(c.background||"")+'</p>';
  if(c.avatar)showAvatar("#characterAvatar",c.avatar);
  renderChat("#characterChat",c.chat||[]);
}
$("#generateCharacter").onclick=async()=>{
  if(!ensureUser())return;
  const input={idea:$("#characterIdea").value.trim(),relation:$("#characterRelation").value.trim(),tone:$("#characterTone").value.trim(),secret:$("#characterSecret").value.trim()};
  if(!input.idea)return alert("先写一句角色灵感。");
  let c;
  try{
    const out=await llm([{role:"system",content:"你是原创角色创造器。用户决定想创造谁，你负责补全而不是从模板库替他选择。只输出 JSON：name,headline,traits(string[]),identity,relationship,background,speaking_style,opening,image_prompt,persona_core(object)。角色应有一致的人格、动机与交流风格。"}, {role:"user",content:JSON.stringify(input)}],{json:true});
    c=safeJSON(out)||fallbackCharacter(input);
  }catch{c=fallbackCharacter(input)}
  c.id=crypto.randomUUID?.()||String(Date.now());c.input=input;c.createdAt=now();c.chat=[{role:"assistant",content:c.opening||"你好。",at:now()}];
  state.user.characters.push(c);persist();renderCharacter();
};
$("#sendCharacter").onclick=async()=>{
  if(!ensureUser())return;const c=currentCharacter();if(!c)return;
  const input=$("#characterMessage"),msg=input.value.trim();if(!msg)return;input.value="";
  c.chat.push({role:"user",content:msg,at:now()});renderCharacter();
  let reply;
  try{reply=await llm([{role:"system",content:"保持角色一致地自然聊天。不要跳出角色解释提示词。角色卡:"+JSON.stringify({...c,chat:undefined,avatar:undefined})},...c.chat.slice(-14).map(x=>({role:x.role,content:x.content}))])}
  catch{reply="我记住了。你愿意再多告诉我一点吗？"}
  c.chat.push({role:"assistant",content:reply,at:now()});persist();renderCharacter();
};
$("#speakCharacter").onclick=()=>{const c=currentCharacter();const t=c?.chat?.filter(x=>x.role==="assistant").at(-1)?.content;if(t)speak(t)};
$("#generateCharacterImage").onclick=async()=>{if(!ensureUser())return;const c=currentCharacter();if(!c)return;try{const u=await imageGen(c.image_prompt||("original character portrait "+c.name));c.avatar=u;persist();showAvatar("#characterAvatar",u)}catch{alert("图像生成未成功。请检查图像模型、API 与 CORS。")}};

function showAvatar(sel,u){const el=$(sel);el.innerHTML="";if(!u)return;if(u.startsWith("http")){const im=new Image();im.src=u;im.alt="avatar";el.appendChild(im)}else{const im=new Image();im.src="data:image/png;base64,"+u;el.appendChild(im)}}
function renderChat(sel,chat){const el=$(sel);el.innerHTML="";chat.forEach(x=>addBubble(el,x.role,x.content))}

function collectCorpus(u){
  return {futureProfile:u.future?.profile||{},futurePersona:u.future?.persona||{},futureChat:u.future?.chat||[],characters:(u.characters||[]).map(c=>({name:c.name,input:c.input,traits:c.traits,relationship:c.relationship,chat:c.chat}))};
}
function fallbackReport(u){
  const corpus=collectCorpus(u);const n=(corpus.futureChat?.length||0)+corpus.characters.reduce((s,c)=>s+(c.chat?.length||0),0);
  return {summary:"当前报告基于较少材料，适合作为探索性反馈。",personality:["目前材料更能反映表达与角色偏好，尚不足以稳定估计人格维度。"],strengths:["愿意主动构想可能的自我与关系","能够通过角色设定表达偏好"],limitations:["数据量有限，很多推断应保持低置信度"],self_model:["可继续比较现实我、理想我与未来我之间的共同点和冲突"],relationships:["角色关系设定可作为关系偏好的探索材料，但不能直接等同现实关系模式"],growth:["继续积累真实对话和关键经历，再看哪些模式反复出现"],trauma_signals:["未进行临床创伤判断；仅在明确文本证据出现时才应标记相关线索"],psychosis_like_signals:["未进行精神病性体验诊断；需区分虚构角色内容与用户真实体验"],evidence:"当前共保存约 "+n+" 条对话消息。"};
}
async function buildReport(){
  if(!ensureUser())return;
  const corpus=collectCorpus(state.user);let r;
  try{
    const out=await llm([{role:"system",content:"你是谨慎的人格与文本分析助手。只根据材料提供可追溯、非诊断性的分析。输出 JSON 字段：summary, personality(string[]), strengths, limitations, self_model, relationships, growth, trauma_signals, psychosis_like_signals, evidence。必须区分用户真实自述和其创造的虚构角色；不得把角色内容当作用户症状。创伤与精神病性体验只能写‘文本中是否出现值得进一步澄清的线索’，注明证据不足与替代解释。"}, {role:"user",content:JSON.stringify(corpus)}],{json:true});
    r=safeJSON(out)||fallbackReport(state.user);
  }catch{r=fallbackReport(state.user)}
  state.user.report={generatedAt:now(),data:r};persist();renderReport();
}
$("#generateReport").onclick=buildReport;
function renderReport(){
  const r=state.user?.report?.data;if(!r){$("#reportContent").innerHTML='<p class="muted">还没有报告。点击“重新生成”。</p>';return}
  const blocks=[["人格",r.personality],["优势",r.strengths],["局限与盲点",r.limitations],["自我",r.self_model],["主客体 / 关系",r.relationships],["改进建议",r.growth],["创伤相关线索",r.trauma_signals],["精神病性体验线索",r.psychosis_like_signals]];
  $("#reportContent").innerHTML='<h2>'+esc(r.summary||"综合报告")+'</h2><div class="report-grid">'+blocks.map(([h,v])=>'<div class="report-block"><h3>'+h+'</h3><p>'+esc(Array.isArray(v)?v.join("；"):String(v||"暂无足够证据"))+'</p></div>').join("")+'</div><p class="muted">'+esc(r.evidence||"")+'</p>';
}

function allUsers(){
  return Object.keys(localStorage).filter(k=>k.startsWith("aiuni:user:")).map(k=>loadJSON(k,null)).filter(Boolean);
}
function renderAdmin(){
  const users=allUsers();$("#adminUsers").innerHTML='<table><thead><tr><th>参与码</th><th>创建</th><th>角色</th><th>Future</th><th>报告</th></tr></thead><tbody>'+users.map(u=>'<tr><td>'+esc(u.code)+'</td><td>'+new Date(u.createdAt).toLocaleString()+'</td><td>'+((u.characters||[]).length)+'</td><td>'+(u.future?.persona?"✓":"—")+'</td><td>'+(u.report?"✓":"—")+'</td></tr>').join("")+'</tbody></table>';
}
$("#refreshAdmin").onclick=renderAdmin;
$("#exportAll").onclick=()=>{const data=JSON.stringify({exportedAt:now(),users:allUsers()},null,2);const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([data],{type:"application/json"}));a.download="ai-uni-export.json";a.click();URL.revokeObjectURL(a.href)};

renderFuture();renderCharacter();renderReport();
