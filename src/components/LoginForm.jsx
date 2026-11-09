import { useState } from "react";

export default function LoginForm({ role }) {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // পরে এখানে backend API call বসবে
    console.log(role, form);
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>{role === "admin" ? "Admin" : "Student"} Login</h2>
        <input name="email" type="email" placeholder="Email"
               value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password"
               value={form.password} onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}