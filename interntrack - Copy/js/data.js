// Fake "database" using localStorage. Later, replace with a real backend (Firebase/Supabase).
const ACCOUNTS = [
  {id:"INT-2026-8821", name:"Shruti Bhattacharya", password:"demo123", role:"student", status:"Certified & Approved",
   course:"Full-Stack Software Engineering", org:"Stanford University, Dept. of Computer Science", term:"2026-09-01 to 2026-11-01"},
  {id:"INT-2026-4402", name:"Rohan Sharma", password:"demo123", role:"student", status:"Active (Logging Hours)",
   course:"Data Analytics", org:"Demo University", term:"2026-09-01 to 2026-12-01"},
  {id:"ADMIN-001", name:"Admin", password:"admin123", role:"admin"}
];
const store = {
  get:(k,d)=>JSON.parse(localStorage.getItem(k)||JSON.stringify(d)),
  set:(k,v)=>localStorage.setItem(k,JSON.stringify(v))
};
function currentUser(){return store.get("session",null);}
function requireLogin(){ if(!currentUser()) location.href="index.html"; }
function logout(){ localStorage.removeItem("session"); location.href="index.html"; }
