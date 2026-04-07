import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

// --- DYNAMIC API CONFIGURATION ---
const API_BASE_URL = window.location.hostname === "localhost" 
  ? "http://localhost:5000" 
  : "https://campus-backend-2-w9ce.onrender.com";

const Signup = ({ theme, onToggleTheme }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // UPDATED: Used dynamic API_BASE_URL instead of hardcoded localhost
      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        ...formData,
        role: 'student' 
      });
      
      if (res.status === 201) {
        alert("Account Created! Redirecting to Login...");
        navigate('/'); 
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    }
  };

  return (
    <div className="app-shell flex items-center justify-center p-4">
      <div className="surface p-8 w-full max-w-md">
        <div className="flex justify-end">
          <button onClick={onToggleTheme} className="ghost-btn text-sm font-semibold py-2 px-3">
            {theme === 'light' ? 'Dark' : 'Light'}
          </button>
        </div>

        <h2 className="text-3xl font-bold mb-2 mt-3">Create Account</h2>
        <p className="muted mb-6">Join the Smart Campus portal</p>

        {error && (
          <p className="p-3 rounded-lg mb-4 text-sm font-medium" style={{ background: "color-mix(in oklab, var(--danger) 16%, transparent)", color: "var(--danger)", border: "1px solid color-mix(in oklab, var(--danger) 50%, var(--border))" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase muted ml-1">Full Name</label>
            <input 
              name="name" type="text" placeholder="Abhay Kumar" required
              onChange={handleChange}
              className="input-ui mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase muted ml-1">Email Address</label>
            <input 
              name="email" type="email" placeholder="abhay@campus.com" required
              onChange={handleChange}
              className="input-ui mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase muted ml-1">Password</label>
            <input 
              name="password" type="password" placeholder="••••••••" required
              onChange={handleChange}
              className="input-ui mt-1"
            />
          </div>

          <button 
            type="submit"
            className="w-full primary-btn mt-4"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-sm muted">
          Already have an account? <Link to="/" className="font-bold" style={{ color: "var(--primary)" }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;