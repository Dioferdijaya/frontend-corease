// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import API_URL from "../config";
import "./Register.css";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/register`, form);
      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registrasi gagal!");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-overlay">
        <div className="auth-branding-left">
          <h1 className="brand-title">
            <span className="brand-icon">⚽</span>
            COURSTEASE
          </h1>
          <h2 className="brand-subtitle">EXPLORE HORIZONS</h2>
          <p className="brand-tagline">Where Your Dream Field Becomes Reality.</p>
        </div>

        <div className="auth-form-box">
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Full name</label>
              <input
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              JOIN US
            </button>

            <div className="divider-text">or</div>

            <button type="button" className="google-btn" disabled>
              <span className="google-icon">G</span> Sign in with Google
            </button>

            <div className="signup-link">
              Already have an account? <Link to="/login">Sign In</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}