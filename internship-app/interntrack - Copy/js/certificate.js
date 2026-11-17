requireLogin();
const u = currentUser();
const logs = store.get("logs_" + u.id, []);
const hours = Math.round(logs.reduce((s,l)=>s+l.hrs,0));
const approved = u.status.startsWith("Certified");
document.getElementById("out").innerHTML = approved ? `
<div class="cert">
  <h1>CERTIFICATE OF COMPLETION</h1>
  <p style="margin-top:20px">This is proudly presented to</p>
  <h2>${u.name}</h2>
  <p>for successfully completing the internship in <b>${u.course}</b><br>
  at ${u.org}<br>Term: ${u.term}<br>with a total of <b>${hours} verified hours</b>.</p>
  <div class="seal">🏅</div>
  <div class="sig"><div>__________<br>Program Director</div><div>__________<br>Date: ${new Date().toLocaleDateString()}</div></div>
  <p style="margin-top:30px;font-size:13px">Certificate ID: CERT-${u.id}</p>
</div>` : `<div class="card container"><h3>Certificate not available yet</h3>
  <p>Your status is "${u.status}". An admin must approve your hours first.</p></div>`;
