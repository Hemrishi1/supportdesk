let state, selectedId;
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let toastTimer;
function toast(message) { $('#toast').textContent=message; $('#toast').hidden=false; clearTimeout(toastTimer); toastTimer=setTimeout(()=>$('#toast').hidden=true,6000); }
async function api(path, data) {
  const response = await fetch(path, data ? {method:'POST',headers:{'Content-Type':'application/json','X-App-Token':state.token},body:JSON.stringify(data)} : {});
  const result=await response.json(); if(!response.ok) throw Error(result.error || 'Request failed.'); return result;
}
async function refresh() {
  state=await api('/api/state');
  const provName = state.provider === 'experiential' ? `Live AI (Experiential · ${state.model})` : state.provider === 'gemini' ? `Live AI (Gemini · ${state.model})` : state.provider === 'openai' ? `Live AI (OpenAI · ${state.model})` : 'Live AI available';
  $('#connection').textContent=state.live_available?provName:'Demo mode · local workspace';
  $('#workspace-name').textContent=state.settings.company; $('#company').value=state.settings.company; $('#policy').value=state.settings.policy;
  $('#mode option[value="live"]').disabled=!state.live_available;
  const provLabel = state.provider === 'experiential' ? 'Experiential gateway' : state.provider === 'gemini' ? 'Google Gemini' : 'OpenAI';
  $('#setup-status').textContent=state.live_available?`Connected to ${provLabel} (${state.model}). Live AI is ready.`:'No API key configured. Set EXPLABS_API_KEY or GEMINI_API_KEY in .env to enable Live AI.';
  render();
}
function render() {
  $('#stat-total').textContent=state.tickets.length; $('#stat-review').textContent=state.tickets.filter(t=>t.status==='Needs review').length; $('#stat-approved').textContent=state.tickets.filter(t=>t.status==='Approved').length;
  const search=$('#search').value.toLowerCase(), filter=$('#filter').value;
  const tickets=state.tickets.filter(t=>(filter==='All statuses'||t.status===filter)&&(t.subject+' '+t.customer+' '+t.message).toLowerCase().includes(search));
  $('#count').textContent=tickets.length;
  $('#ticket-list').innerHTML=tickets.length ? tickets.map(t=>`<button class="ticket" data-ticket="${t.id}"><span class="avatar">${esc(t.customer.charAt(0).toUpperCase())}</span><span><span class="ticket-title">${esc(t.subject)}</span><small>${esc(t.customer)} · #${t.id} · ${t.mode==='demo'?'Demo':'Live AI'}</small></span><span class="tag category">${esc(t.category)}</span><span class="tag priority ${t.priority.toLowerCase()}">${esc(t.priority)}</span><span class="tag ${t.status==='Approved'?'approved':t.status==='Escalated'?'escalated':'review'}">${esc(t.status)}</span></button>`).join('') : `<div class="empty"><span class="empty-icon">▤</span><h3>${state.tickets.length?'No matching requests':'An organized inbox starts with one request.'}</h3><p>${state.tickets.length?'Try another search or status filter.':'Add a customer message and let your support agent<br>classify it, prioritize it, and prepare a reply.'}</p>${state.tickets.length?'':'<button class="secondary" id="empty-sample">✦ Try a sample request</button>'}</div>`;
  $('#empty-sample')?.addEventListener('click',()=>{openCreate();sample();});
  document.querySelectorAll('[data-ticket]').forEach(b=>b.onclick=()=>openReview(Number(b.dataset.ticket)));
  $('#events').innerHTML=state.events.length?state.events.map(e=>`<div class="event"><strong>Request #${e.ticket_id}</strong> · ${esc(e.action)}<small>${esc(new Date(e.created).toLocaleString())}</small></div>`).join(''):'<p class="hint">No activity yet. Generate your first draft to start the record.</p>';
}
function openCreate(){ $('#create-dialog').showModal(); }
function sample(){ const f=$('#request-form'); f.elements.customer.value='Maya Patel';f.elements.subject.value='Charged twice for my monthly subscription';f.elements.message.value='Hi, I noticed two charges for my subscription this month. Could you check what happened and let me know if I can get the duplicate payment refunded? My invoice reference is INV-1042. Thank you!';f.elements.mode.value='demo'; }
function openReview(id){ selectedId=id; const t=state.tickets.find(t=>t.id===id); $('#review-number').textContent=`REQUEST #${id} · ${t.mode==='demo'?'DEMO OUTPUT':'LIVE AI DRAFT'}`;$('#review-title').textContent=t.subject;$('#review-customer').textContent=t.customer;$('#review-message').textContent=t.message;$('#review-summary').textContent=t.summary;$('#review-reason').textContent=t.reason;$('#review-draft').value=t.draft;$('#review-meta').innerHTML=[t.category,t.priority,t.status].map(s=>`<span class="tag">${esc(s)}</span>`).join('');$('#review-dialog').showModal(); }
async function review(status){ const buttons=$('#review-dialog').querySelectorAll('button');buttons.forEach(b=>b.disabled=true);try{await api('/api/review',{id:selectedId,draft:$('#review-draft').value,status}); await refresh();$('#review-dialog').close();toast(status==='Approved'?'Draft approved and saved. No message was sent.':status==='Escalated'?'Request marked for escalation. No external notification was sent.':'Draft saved for review.');}catch(e){toast(e.message);}finally{buttons.forEach(b=>b.disabled=false);} }
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-view]').forEach(n=>n.classList.toggle('active',n===b));['inbox','policy','activity'].forEach(v=>$(`#${v}-view`).hidden=v!==b.dataset.view);$('#breadcrumb').textContent=b.textContent.trim();});
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>$('#'+b.dataset.close).close());
$('#new-ticket').onclick=openCreate;$('#sample').onclick=sample;$('#search').oninput=render;$('#filter').onchange=render;
$('#request-form').onsubmit=async e=>{e.preventDefault();const button=$('#run-agent');button.disabled=true;button.textContent='Preparing your draft…';try{const data=Object.fromEntries(new FormData(e.target));const result=await api('/api/tickets',data);await refresh();$('#create-dialog').close();e.target.reset();openReview(result.id);}catch(err){toast(err.message);}finally{button.disabled=false;button.textContent='✦ Generate draft';}};
$('#policy-form').onsubmit=async e=>{e.preventDefault();try{await api('/api/settings',{company:$('#company').value,policy:$('#policy').value});await refresh();toast('Company knowledge saved.');}catch(err){toast(err.message);}};
$('#save-draft').onclick=()=>review('Needs review');$('#approve').onclick=()=>review('Approved');$('#escalate').onclick=()=>review('Escalated');
$('#copy').onclick=async()=>{try{await navigator.clipboard.writeText($('#review-draft').value);toast('Reply copied.');}catch{toast('Copy unavailable. Select the draft text and copy it manually.');}};
$('#export').onclick=()=>{if(!state.tickets.length)return toast('Add a request before exporting.');const fields=['id','customer','subject','message','category','priority','status','mode','draft','created'];const cell=s=>'"'+String(s??'').replace(/^[\s]*[=+@-]/,m=>"'"+m).replace(/"/g,'""')+'"';const csv=[fields.map(cell).join(','),...state.tickets.map(t=>fields.map(f=>cell(t[f])).join(','))].join('\r\n');const url=URL.createObjectURL(new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'}));const a=document.createElement('a');a.href=url;a.download='supportdesk-requests.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
refresh().catch(e=>{toast('Unable to load workspace: '+e.message);$('#connection').textContent='Connection unavailable';});
