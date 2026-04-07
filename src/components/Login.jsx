import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ setIsAuthenticated, theme, onToggleTheme }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      if (setIsAuthenticated) setIsAuthenticated(true);

      const role = response.data.user.role;
      navigate(role === 'admin' ? '/admin-dashboard' : '/student-dashboard');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Login Failed. Please try again.');
    }
  };

  return (
    <div className="app-shell flex flex-col items-center p-4">
      <button
        onClick={onToggleTheme}
        className="ghost-btn text-sm font-semibold py-2 px-3 fixed top-5 right-5 z-50"
        aria-label="Toggle theme"
        title="Toggle theme"
      >
        {theme === 'light' ? 'Dark' : 'Light'}
      </button>

      <header className="w-full max-w-md pt-16 pb-6">
        <div className="text-center">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{
              background: 'linear-gradient(135deg, var(--primary), var(--primary-strong))',
              color: '#fff',
              boxShadow: '0 12px 30px rgba(79,70,229,.25)'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M6 9h12M6 13h12M8 5h8l1 2H7l1-2Z"
              />
            </svg>
          </div>

          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-3xl font-extrabold">Smart Campus</span>
          </div>
          <p className="muted text-sm">Sign in to your account</p>
        </div>
      </header>

      <main className="w-full max-w-md pb-8">
        <div className="surface p-8 w-full flex flex-col gap-6">
          {error && (
            <div
              className="p-3 text-sm font-medium rounded"
              style={{
                background: "color-mix(in oklab, var(--danger) 16%, transparent)",
                color: "var(--danger)",
                border: "1px solid color-mix(in oklab, var(--danger) 50%, var(--border))"
              }}
              role="alert"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-1">Email Address</label>
              <input
                type="email"
                placeholder="name@university.edu"
                className="input-ui"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="input-ui"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="w-full primary-btn">
              Sign In
            </button>
          </form>

          <div className="pt-4" style={{ borderTop: "1px solid var(--border)" }}>
            <p className="muted text-sm text-center">
              New to the portal?{" "}
              <Link to="/signup" className="font-bold" style={{ color: "var(--primary)" }}>
                Create an Account
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="w-full text-center muted text-xs pb-6 mt-auto">
        Copyright &copy; {new Date().getFullYear()} Abhay
      </footer>
    </div>
  );
};

export default Login;