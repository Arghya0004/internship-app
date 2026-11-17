requireLogin();
const user = currentUser(), $ = id => document.getElementById(id);
const KEY = "logs_" + user.id;          // each student has their own logs
const TECH = ["React","TypeScript","Node.js","Python","SQL","Docker","AWS","Git","Figma"];
let selected = new Set();

// Seed sample data once so the page isn't empty
if (!localStorage.getItem(KEY)) store.set(KEY, [
  {date:"2026-10-23", in:"09:30", out:"18:00", hrs:8.5, log:"Completed final capstone sprint demo.", tech:["Git","Docker"]},
  {date:"2026-10-22", in:"09:00", out:"17:00", hrs:8,   log:"Optimized frontend bundle size.", tech:["React"]},
  {date:"2026-10-21", in:"08:45", out:"17:15", hrs:8.5, log:"Built automated testing suite.", tech:["TypeScript"]}
]);

$("who").textContent = `${user.name} (${user.id})`;
$("name").textContent = user.name; $("sid").textContent = user.id;
$("course").textContent = `${user.course} · ${user.org} · Term: ${user.term}`;
$("cert").textContent = user.status;
$("date").value = new Date().toISOString().slice(0,10);

TECH.forEach(t => { const s = document.createElement("span"); s.className="tag"; s.textContent=t;
  s.onclick = () => { selected.has(t) ? selected.delete(t) : selected.add(t); s.classList.toggle("on"); };
  $("tags").appendChild(s); });

// Hours between two "HH:MM" strings
function hoursBetween(a, b){ const [h1,m1]=a.split(":").map(Number),[h2,m2]=b.split(":").map(Number);
  return Math.max(0, ((h2*60+m2)-(h1*60+m1))/60); }
function updateDuration(){ $("dur").textContent = hoursBetween($("in").value,$("out").value).toFixed(1).replace(".0","") + " Hours"; }
$("in").oninput = $("out").oninput = updateDuration; updateDuration();

$("save").onclick = () => {
  if (!$("log").value.trim()) return alert("Please describe your work.");
  const logs = store.get(KEY, []);
  logs.unshift({date:$("date").value, in:$("in").value, out:$("out").value,
    hrs:hoursBetween($("in").value,$("out").value), log:$("log").value, tech:[...selected]});
  store.set(KEY, logs); $("log").value=""; render();
};

function render(){
  const logs = store.get(KEY, []);
  const total = logs.reduce((s,l)=>s+l.hrs,0);
  $("total").textContent = Math.round(total);
  $("days").textContent = new Set(logs.map(l=>l.date)).size;
  $("avg").textContent = logs.length ? (total/logs.length).toFixed(1) : 0;
  $("count").textContent = logs.length;
  $("history").innerHTML = logs.map(l => `<div class="entry"><b>${l.date}</b> · ${l.in}-${l.out}
    <span class="badge">${l.hrs} hrs</span><p>${l.log}</p><small>${l.tech.join(", ")}</small></div>`).join("");
  drawCalendar(new Set(logs.map(l=>l.date)));
}

function drawCalendar(loggedDates){
  const now = new Date(), y = now.getFullYear(), m = now.getMonth();
  $("monthName").textContent = now.toLocaleString("default",{month:"long",year:"numeric"});
  let html = ["SUN","MON","TUE","WED","THU","FRI","SAT"].map(d=>`<div class="dow">${d}</div>`).join("");
  html += "<div></div>".repeat(new Date(y,m,1).getDay());
  for (let d=1; d<=new Date(y,m+1,0).getDate(); d++){
    const iso = `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    html += `<div class="${loggedDates.has(iso)?"logged":""} ${iso===$("date").value?"sel":""}">${d}</div>`;
  }
  $("cal").innerHTML = html;
}
render();
