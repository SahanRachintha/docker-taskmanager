import React, { useState } from "react"; 
import { useNavigate, Link } from "react-router-dom";
import './CSS/Login.css';

const API_URL = "http://springboot-backend:8080/api/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const text = await response.text();
      setMessage(text);
      if (response.ok) {
        navigate("/dashboard");
      }
    } catch (err) {
      setMessage("Error connecting to server");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <input 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
        /><br />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
        /><br />
        <button type="submit">Login</button>
      </form>
      <p style={{ marginTop: "15px" }}>
        Don't have an account?{" "}
        <Link to="/signup" style={{ color: "#000dff", textDecoration: "none" }}>
          Signup
        </Link>
      </p>
    </div>
  );
}
