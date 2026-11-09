import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser") || "null");

  const logout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  if (!user || user.role !== "student") {
    return <h2 style={{ padding: 40 }}>Please login first.</h2>;
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Welcome, {user.name} 👋</h1>
      <p>ID: {user.id}</p>
      <p>Student Dashboard coming soon...</p>
      <button onClick={logout} style={{ marginTop: 16, padding: "8px 16px" }}>Logout</button>
    </div>
  );
}