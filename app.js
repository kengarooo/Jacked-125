const STORAGE_KEY='jacked125-v3';
const today=()=>new Date().toISOString().slice(0,10);
const uid=()=>crypto.randomUUID?.()||`${Date.now()}-${Math.random()}`;
const defaults={targets:{calories:1750,protein:140,goalWeight:125},foods:[],sets:[],progress:[]};
let db=load();
let deferredInstallPrompt=null;
const $=id=>document.getElementById(id);
const installBtn=$('installBtn');
const homeWeight=$('homeWeight');
const homeWaist=$('homeWaist');
const homeCalories=$('homeCalories');
const homeProtein=$('homeProtein');
const calMeter=$('calMeter');
const proteinMeter=$('proteinMeter');
const weightDelta=$('weightDelta');
const todaySummary=$('todaySummary');
const weeklyTrend=$('weeklyTrend');
const abSets=$('abSets');
const trainingDays=$('trainingDays');
const foodForm=$('foodForm');
const foodName=$('foodName');
const foodAmount=$('foodAmount');
const foodCalories=$('foodCalories');
const foodProtein=$('foodProtein');
const foodCarbs=$('foodCarbs');
const foodFat=$('foodFat');
const clearTodayFood=$('clearTodayFood');
const macroSummary=$('macroSummary');
const foodList=$('foodList');
const setForm=$('setForm');
const exerciseSelect=$('exerciseSelect');
const setWeight=$('setWeight');
const setReps=$('setReps');
const setSets=$('setSets');
const setRir=$('setRir');
const setList=$('setList');
const progressForm=$('progressForm');
const editProgressId=$('editProgressId');
const progressDate=$('progressDate');
const progressWeight=$('progressWeight');
const progressWaist=$('progressWaist');
const progressHips=$('progressHips');
const progressChest=$('progressChest');
const progressArm=$('progressArm');
const progressThigh=$('progressThigh');
const cancelEdit=$('cancelEdit');
const weightChart=$('weightChart');
const progressList=$('progressList');
const coachSnapshot=$('coachSnapshot');
const targetForm=$('targetForm');
const targetCalories=$('targetCalories');
const targetProtein=$('targetProtein');
const targetWeight=$('targetWeight');
const exportBtn=$('exportBtn');
const importInput=$('importInput');
const resetBtn=$('resetBtn');

const program={
 'MONDAY — GLUTES + QUADS':[['Bulgarian split squat','4 × 8–15/leg'],['Goblet squat','4 × 12–20'],['DB Romanian deadlift','4 × 10–15'],['DB hip thrust','4 × 12–20'],['Reverse lunge','3 × 10–15/leg'],['Calf raise','4 × 15–30']],
 'TUESDAY — UPPER BODY':[['One-arm DB row','4 × 10–20/side'],['DB shoulder press','4 × 8–15'],['Bench-supported row','3 × 12–20/side'],['Lateral raise','4 × 12–25'],['DB chest press','3 × 10–20'],['DB biceps curl','3 × 10–20'],['Overhead triceps extension','3 × 12–20']],
 'THURSDAY — GLUTES + HAMSTRINGS':[['Bulgarian split squat','3 × 10–15/leg'],['Single-leg Romanian deadlift','4 × 10–15/leg'],['DB hip thrust','4 × 15–25'],['DB sumo squat','4 × 12–20'],['DB bench step-up','3 × 8–15/leg'],['Glute bridge burnout','2 × 25–40']],
 'FRIDAY — SHOULDERS + BACK + ARMS':[['One-arm DB row','4 × 12–20'],['DB shoulder press','3 × 10–15'],['Lateral raise','4 × 15–30'],['Rear-delt fly','4 × 15–25'],['DB chest press','3 × 12–20'],['Hammer curl','3 × 12–20'],['Triceps extension','3 × 12–20'],['Push-ups','2 × near failure']],
 'ABS — 3× / WEEK':[['Weighted crunch','3 × 10–15'],['Reverse crunch','3 × 12–20'],['Plank','3 × 30–60 sec'],['Dead bug','3 × 10–15/side'],['Side plank','3 × 30–45 sec/side'],['Weighted sit-up','3 × 10–15']]
};
const allExercises=[...new Set(Object.values(program).flat().map(x=>x[0]))];
const abNames=new Set(program['ABS — 3× / WEEK'].map(x=>x[0]));

function load(){try{return {...defaults,...JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}'),targets:{...defaults.targets,...(JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}').targets||{})}}}catch{return structuredClone(defaults)}}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(db))}
function esc(s=''){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function sumToday(){return db.foods.filter(x=>x.date===today()).reduce((a,x)=>({calories:a.calories+x.calories,protein:a.protein+x.protein,carbs:a.carbs+x.carbs,fat:a.fat+x.fat}),{calories:0,protein:0,carbs:0,fat:0})}
function withinDays(date,days){const d=new Date(date+'T12:00:00');const start=new Date();start.setHours(0,0,0,0);start.setDate(start.getDate()-(days-1));return d>=start}
function latestProgress(){return [...db.progress].sort((a,b)=>a.date.localeCompare(b.date)).at(-1)}
function lastNWeights(days=7){return db.progress.filter(x=>x.weight&&withinDays(x.date,days)).sort((a,b)=>a.date.localeCompare(b.date))}
function avg(arr){return arr.length?arr.reduce((a,b)=>a+b,0)/arr.length:null}

function navigate(id){document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s.id===id));document.querySelectorAll('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.screen===id));scrollTo({top:0,behavior:'instant'});render()}
document.querySelectorAll('.bottom-nav button').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.screen)));
document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.go)));

function render(){renderHome();renderFood();renderProgram();renderSets();renderProgress();renderCoach();fillTargets()}
function renderHome(){const t=sumToday(),p=latestProgress(),target=db.targets;homeWeight.textContent=`${(p?.weight??150).toFixed?.(1)??p?.weight??150} lb`;homeWaist.textContent=p?.waist?`${p.waist}"`:'—';homeCalories.textContent=`${Math.round(t.calories)} / ${target.calories}`;homeProtein.textContent=`${Math.round(t.protein)} / ${target.protein}g`;calMeter.style.width=`${Math.min(100,t.calories/target.calories*100)}%`;proteinMeter.style.width=`${Math.min(100,t.protein/target.protein*100)}%`;
 const goalDiff=p?.weight?Math.max(0,p.weight-target.goalWeight).toFixed(1):'25.0';weightDelta.textContent=p?.weight?`${goalDiff} lb from goal`:`Goal ~${target.goalWeight} lb`;
 todaySummary.innerHTML=[['Calories',Math.round(t.calories)],['Protein',`${Math.round(t.protein)}g`],['Carbs',`${Math.round(t.carbs)}g`],['Fat',`${Math.round(t.fat)}g`]].map(([k,v])=>`<div><span>${k}</span><strong>${v}</strong></div>`).join('');
 const weekSets=db.sets.filter(x=>withinDays(x.date,7));abSets.textContent=weekSets.filter(x=>abNames.has(x.exercise)).reduce((a,x)=>a+x.sets,0);trainingDays.textContent=new Set(weekSets.map(x=>x.date)).size;weeklyTrend.innerHTML=getWeeklyTrend();}
function getWeeklyTrend(){const recent=lastNWeights(7),older=db.progress.filter(x=>x.weight&&withinDays(x.date,14)&&!withinDays(x.date,7));const ra=avg(recent.map(x=>x.weight)),oa=avg(older.map(x=>x.weight));if(!recent.length)return '<p>Add a few weigh-ins to calculate your weekly average. Morning weigh-ins under similar conditions are easiest to compare.</p>';let p=`<p>Current 7-day average: <b>${ra.toFixed(1)} lb</b>.</p>`;if(oa!==null){const d=ra-oa;p+=`<p>Compared with the prior week: <b>${d>0?'+':''}${d.toFixed(1)} lb</b>.</p>`}else p+='<p>We need another week of data before comparing trends.</p>';return p}

foodForm.addEventListener('submit',e=>{e.preventDefault();db.foods.push({id:uid(),date:today(),name:foodName.value.trim(),amount:foodAmount.value.trim(),calories:+foodCalories.value||0,protein:+foodProtein.value||0,carbs:+foodCarbs.value||0,fat:+foodFat.value||0});save();foodForm.reset();render()});
clearTodayFood.addEventListener('click',()=>{if(confirm('Clear today’s food entries?')){db.foods=db.foods.filter(x=>x.date!==today());save();render()}});
function renderFood(){const t=sumToday(),target=db.targets;macroSummary.innerHTML=[['Calories',`${Math.round(t.calories)} / ${target.calories}`],['Protein',`${Math.round(t.protein)} / ${target.protein}g`],['Carbs',`${Math.round(t.carbs)}g`],['Fat',`${Math.round(t.fat)}g`]].map(([k,v])=>`<div><span>${k}</span><strong>${v}</strong></div>`).join('');const foods=db.foods.filter(x=>x.date===today());foodList.innerHTML=foods.length?foods.map(x=>`<div class="exercise"><div class="exercise-row"><div><b>${esc(x.name)}</b>${x.amount?` — ${esc(x.amount)}`:''}<br><span class="muted">${x.calories} kcal • ${x.protein}g P • ${x.carbs}g C • ${x.fat}g F</span></div><div class="exercise-actions"><button class="danger" onclick="deleteFood('${x.id}')">Delete</button></div></div></div>`).join(''):'<p class="muted">Nothing logged today.</p>'}
window.deleteFood=id=>{db.foods=db.foods.filter(x=>x.id!==id);save();render()};

function renderProgram(){programEl.innerHTML=Object.entries(program).map(([day,arr])=>`<h3>${day}</h3>${arr.map(([name,reps])=>`<div class="exercise"><b>${name}</b><br><span class="muted">${reps}</span></div>`).join('')}`).join('');exerciseSelect.innerHTML=allExercises.map(x=>`<option>${x}</option>`).join('')}
setForm.addEventListener('submit',e=>{e.preventDefault();db.sets.push({id:uid(),date:today(),exercise:exerciseSelect.value,weight:+setWeight.value||0,reps:+setReps.value||0,sets:+setSets.value||1,rir:+setRir.value||0});save();setWeight.value='';setReps.value='';setSets.value='1';setRir.value='2';render()});
function renderSets(){const arr=[...db.sets].slice(-30).reverse();setList.innerHTML=arr.length?arr.map(x=>`<div class="exercise"><div class="exercise-row"><div><b>${x.exercise}</b><br><span class="muted">${x.weight} lb × ${x.reps} × ${x.sets} set(s) • RIR ${x.rir} • ${x.date}</span></div><div class="exercise-actions"><button class="danger" onclick="deleteSet('${x.id}')">Delete</button></div></div></div>`).join(''):'<p class="muted">No training logged yet.</p>'}
window.deleteSet=id=>{db.sets=db.sets.filter(x=>x.id!==id);save();render()};

progressDate.value=today();
progressForm.addEventListener('submit',e=>{e.preventDefault();const entry={id:editProgressId.value||uid(),date:progressDate.value,weight:num(progressWeight.value),waist:num(progressWaist.value),hips:num(progressHips.value),chest:num(progressChest.value),arm:num(progressArm.value),thigh:num(progressThigh.value)};if(editProgressId.value){db.progress=db.progress.map(x=>x.id===entry.id?entry:x)}else{const sameDate=db.progress.find(x=>x.date===entry.date);if(sameDate)entry.id=sameDate.id;db.progress=sameDate?db.progress.map(x=>x.id===sameDate.id?entry:x):[...db.progress,entry]}db.progress.sort((a,b)=>a.date.localeCompare(b.date));save();resetProgressForm();render()});
const num=v=>v===''?null:+v;
function resetProgressForm(){progressForm.reset();progressDate.value=today();editProgressId.value='';cancelEdit.classList.add('hidden')}
cancelEdit.addEventListener('click',resetProgressForm);
function renderProgress(){const arr=[...db.progress].sort((a,b)=>b.date.localeCompare(a.date));progressList.innerHTML=arr.length?arr.map(x=>`<div class="exercise"><div class="exercise-row"><div><b>${x.date}</b> — ${x.weight??'—'} lb ${x.waist?`• waist ${x.waist}"`:''}<br><span class="muted">Hips ${x.hips??'—'} • Chest ${x.chest??'—'} • Arm ${x.arm??'—'} • Thigh ${x.thigh??'—'}</span></div><div class="exercise-actions"><button class="ghost" onclick="editProgress('${x.id}')">Edit</button><button class="danger" onclick="deleteProgress('${x.id}')">Delete</button></div></div></div>`).join(''):'<p class="muted">No check-ins yet.</p>';drawChart()}
window.editProgress=id=>{const x=db.progress.find(x=>x.id===id);if(!x)return;editProgressId.value=x.id;progressDate.value=x.date;progressWeight.value=x.weight??'';progressWaist.value=x.waist??'';progressHips.value=x.hips??'';progressChest.value=x.chest??'';progressArm.value=x.arm??'';progressThigh.value=x.thigh??'';cancelEdit.classList.remove('hidden');navigate('progress')};
window.deleteProgress=id=>{if(confirm('Delete this check-in?')){db.progress=db.progress.filter(x=>x.id!==id);save();render()}};
function drawChart(){const c=weightChart,ctx=c.getContext('2d'),arr=[...db.progress].filter(x=>x.weight).sort((a,b)=>a.date.localeCompare(b.date));const dpr=Math.max(1,devicePixelRatio||1),rect=c.getBoundingClientRect();c.width=Math.round(rect.width*dpr);c.height=Math.round(250*dpr);ctx.scale(dpr,dpr);ctx.clearRect(0,0,rect.width,250);ctx.font='12px -apple-system';if(!arr.length){ctx.fillStyle='#9ca7b4';ctx.fillText('Add weigh-ins to see your trend.',14,28);return}const min=Math.min(db.targets.goalWeight,...arr.map(x=>x.weight))-2,max=Math.max(...arr.map(x=>x.weight))+2,pad=26,w=rect.width-pad*2,h=200;ctx.strokeStyle='#9df49d';ctx.lineWidth=3;ctx.beginPath();arr.forEach((x,i)=>{const px=pad+(i/(Math.max(1,arr.length-1)))*w,py=20+(1-(x.weight-min)/(max-min))*h;i?ctx.lineTo(px,py):ctx.moveTo(px,py)});ctx.stroke();ctx.fillStyle='#f7f9fb';arr.forEach((x,i)=>{const px=pad+(i/(Math.max(1,arr.length-1)))*w,py=20+(1-(x.weight-min)/(max-min))*h;ctx.beginPath();ctx.arc(px,py,3,0,Math.PI*2);ctx.fill()})}

function renderCoach(){const p=latestProgress(),recent=lastNWeights(7),older=db.progress.filter(x=>x.weight&&withinDays(x.date,14)&&!withinDays(x.date,7)),ra=avg(recent.map(x=>x.weight)),oa=avg(older.map(x=>x.weight));let html='<p><b>Primary objective:</b> lose fat gradually while keeping or gaining muscle and strength.</p>';if(p)html+=`<p>Latest: <b>${p.weight??'—'} lb</b>${p.waist?`, waist <b>${p.waist}"</b>`:''}.</p>`;if(ra!==null)html+=`<p>7-day average: <b>${ra.toFixed(1)} lb</b>.</p>`;if(ra!==null&&oa!==null){const d=ra-oa;html+=`<p>Week-over-week change: <b>${d>0?'+':''}${d.toFixed(1)} lb</b>.</p>`}html+=`<p>Current targets: <b>${db.targets.calories} kcal</b>, <b>${db.targets.protein}g protein</b>, goal around <b>${db.targets.goalWeight} lb</b>.</p><p>Do not change calories from one weigh-in. Use at least 2–3 weeks of weight, waist, hunger, recovery, and strength trends.</p>`;coachSnapshot.innerHTML=html}
function fillTargets(){targetCalories.value=db.targets.calories;targetProtein.value=db.targets.protein;targetWeight.value=db.targets.goalWeight}
targetForm.addEventListener('submit',e=>{e.preventDefault();db.targets={calories:+targetCalories.value||1750,protein:+targetProtein.value||140,goalWeight:+targetWeight.value||125};save();render()});

exportBtn.addEventListener('click',()=>{const blob=new Blob([JSON.stringify(db,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`jacked-125-${today()}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)});
importInput.addEventListener('change',async()=>{const f=importInput.files[0];if(!f)return;try{const data=JSON.parse(await f.text());db={...defaults,...data,targets:{...defaults.targets,...(data.targets||{})}};save();render();alert('Backup imported.')}catch{alert('That file could not be imported.')}});
resetBtn.addEventListener('click',()=>{if(confirm('Delete ALL Jacked @ 125 data on this device?')){localStorage.removeItem(STORAGE_KEY);db=structuredClone(defaults);render()}});

window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstallPrompt=e;installBtn.classList.remove('hidden')});
installBtn.addEventListener('click',async()=>{if(!deferredInstallPrompt)return;deferredInstallPrompt.prompt();await deferredInstallPrompt.userChoice;deferredInstallPrompt=null;installBtn.classList.add('hidden')});

if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(console.error))}
const programEl=document.getElementById('program');
render();
window.addEventListener('resize',()=>{if(document.getElementById('progress').classList.contains('active'))drawChart()});
