import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./CSS/Signup.css";

const API_URL = "http://backend:8080/api/auth";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const text = await response.text();
      setMessage(text);
      if (response.ok) {
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      setMessage("Error connecting to server");
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account?{" "}
        <Link
          to="/login"
          style={{ color: "#000dff", textDecoration: "none" }}
          className="link"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
