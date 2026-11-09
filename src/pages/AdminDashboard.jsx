import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser") || "null");

  const logout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  if (!user || user.role !== "admin") {
    return <h2 style={{ padding: 40 }}>Admin access only.</h2>;
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Admin Console 🛡️</h1>
      <p>Welcome, {user.name}</p>
      <p>Admin Dashboard coming soon...</p>
      <button onClick={logout} style={{ marginTop: 16, padding: "8px 16px" }}>Logout</button>
    </div>
  );
}