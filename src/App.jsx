import React, { useState, useEffect } from "react";
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import ComplaintForm from "./components/ComplaintForm";
import StatsBar from "./components/StatsBar"; 
import ComplaintList from "./components/ComplaintList";
import Login from "./components/Login";
import Signup from "./components/Signup";

// --- 1. UTILITY: SAFE USER RETRIEVAL ---
const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw || raw === 'undefined') return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error("Local storage parse error:", err);
    return null;
  }
};

const getStoredTheme = () => localStorage.getItem('theme') || 'light';

const toId = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') return value._id || value.id || '';
  return '';
};

// --- 2. GUARDS: PROTECTED & ROLE-BASED ROUTING ---
const RoleRoute = ({ requiredRole, children }) => {
  const user = getStoredUser();
  const token = localStorage.getItem('token');

  // If no token, kick to login
  if (!token || !user) {
    return <Navigate to="/" />;
  }

  // If they are on the wrong dashboard, send them to their correct one
  if (user.role !== requiredRole) {
    return <Navigate to={`/${user.role}-dashboard`} />;
  }

  return children;
};

const DashboardView = ({
  role,
  onLogout,
  stats,
  complaints,
  onDelete,
  onResolve,
  onAdd,
}) => (
  <div className="app-shell flex flex-col items-center p-6 md:p-10 w-full">
    <div className="w-full max-w-5xl mb-8">
      <div className="surface p-5 md:p-6 flex flex-col md:flex-row md:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] muted mb-2">Smart Campus</p>
          <h1 className="text-3xl font-bold">
            {role === 'admin' ? 'Admin Control Center' : 'Student Help Desk'}
          </h1>
          <p className="muted text-sm mt-1">Welcome back, {getStoredUser()?.name || 'User'}</p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={onLogout} className="danger-btn font-bold">
            Logout
          </button>
        </div>
      </div>
    </div>

    <StatsBar total={stats.total} pending={stats.pending} resolved={stats.resolved} />

    <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
      {role === 'student' && <ComplaintForm onSave={onAdd} />}

      <div className={role === 'student' ? "lg:col-span-3" : "lg:col-span-5"}>
        <ComplaintList
          complaints={complaints}
          onDelete={onDelete}
          onResolve={onResolve}
          isAdmin={role === 'admin'}
        />
      </div>
    </div>
  </div>
);

function App() {
  const [allComplaints, setAllComplaints] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [theme, setTheme] = useState(getStoredTheme());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const fetchComplaints = async () => {
    const user = getStoredUser();
    if (!user) return;

    try {
      // Use one source of truth from backend to avoid route/id mismatch
      const response = await axios.get('http://localhost:5000/api/complaints/all');
      const all = response.data || [];

      if (user.role === 'student') {
        const currentUserId = toId(user);
        const mine = all.filter((item) => {
          const ownerId = toId(item.user);
          return ownerId === currentUserId;
        });
        setAllComplaints(mine);
        return;
      }

      setAllComplaints(all);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch data whenever authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      setTimeout(() => {
        fetchComplaints();
      }, 0);
    } else {
      setTimeout(() => {
        setAllComplaints([]);
      }, 0);
    }
  }, [isAuthenticated]);

  // --- ACTIONS ---
  const addComplaint = (newEntry) => setAllComplaints((prev) => [newEntry, ...prev]);

  const deleteComplaint = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/complaints/${id}`);
      setAllComplaints(prev => prev.filter((item) => (item._id || item.id) !== id));
    } catch { 
      alert("Could not delete. ❌"); 
    }
  };

  const resolveComplaint = async (id) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/complaints/${id}`);
      setAllComplaints(prev => prev.map((item) => 
        (item._id || item.id) === id ? response.data : item
      ));
    } catch { 
      alert("Could not update. ❌"); 
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // --- CALCULATION ---
  const stats = {
    total: allComplaints.length,
    pending: allComplaints.filter(c => c.status === "Pending").length,
    resolved: allComplaints.filter(c => c.status === "Resolved").length
  };

  return (
    <Router>
      <button
        onClick={toggleTheme}
        className="ghost-btn text-sm font-semibold py-2 px-3 fixed top-5 right-5 z-50"
        aria-label="Toggle theme"
        title="Toggle theme"
      >
        {theme === 'light' ? 'Dark' : 'Light'}
      </button>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          isAuthenticated
            ? <Navigate to={`/${getStoredUser()?.role || 'student'}-dashboard`} replace />
            : <Login setIsAuthenticated={setIsAuthenticated} theme={theme} onToggleTheme={toggleTheme} />
        } />

        <Route path="/signup" element={
          isAuthenticated 
            ? <Navigate to="/" replace /> 
            : <Signup theme={theme} onToggleTheme={toggleTheme} />
        } />

        {/* Private Student Route */}
        <Route path="/student-dashboard" element={
          <RoleRoute requiredRole="student">
            <DashboardView
              role="student"
              theme={theme}
              onLogout={handleLogout}
              stats={stats}
              complaints={allComplaints}
              onDelete={deleteComplaint}
              onResolve={resolveComplaint}
              onAdd={addComplaint}
            />
          </RoleRoute>
        } />
        
        {/* Private Admin Route */}
        <Route path="/admin-dashboard" element={
          <RoleRoute requiredRole="admin">
            <DashboardView
              role="admin"
              theme={theme}
              onLogout={handleLogout}
              stats={stats}
              complaints={allComplaints}
              onDelete={deleteComplaint}
              onResolve={resolveComplaint}
              onAdd={addComplaint}
            />
          </RoleRoute>
        } />

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;