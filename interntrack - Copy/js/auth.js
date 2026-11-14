let mode = "student";
const $ = id => document.getElementById(id);

document.querySelectorAll(".tab").forEach(t => t.onclick = () => {
  document.querySelectorAll(".tab").forEach(x => x.classList.remove("active"));
  t.classList.add("active"); mode = t.dataset.tab;
  $("regOnly").classList.toggle("hidden", mode !== "register");
  $("quickBox").classList.toggle("hidden", mode !== "student");
  $("submitBtn").textContent = {student:"Sign In to Student Workspace →", register:"Submit Registration", admin:"Sign In as Admin →"}[mode];
  $("msg").textContent = "";
});

document.querySelectorAll(".q").forEach(q => q.onclick = () => {
  $("uid").value = q.dataset.id; $("pwd").value = "demo123";
});

$("form").onsubmit = e => {
  e.preventDefault();
  const id = $("uid").value.trim(), pw = $("pwd").value;
  if (mode === "register") {
    if (!$("fullname").value || !id || !pw) return $("msg").textContent = "Fill all fields.";
    const pending = store.get("pending", []);
    pending.push({name: $("fullname").value, id, password: pw});
    store.set("pending", pending);
    $("msg").style.color = "green";
    return $("msg").textContent = "Registration sent! Wait for admin confirmation.";
  }
  const user = ACCOUNTS.find(a => (a.id.toLowerCase() === id.toLowerCase()) && a.password === pw
                                  && (mode === "admin") === (a.role === "admin"));
  if (!user) { $("msg").style.color = "#dc2626"; return $("msg").textContent = "Invalid ID or password."; }
  store.set("session", user);
  location.href = user.role === "admin" ? "admin.html" : "workspace.html";
};
