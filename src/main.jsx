import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import Blanko from './pages/Blanko';
import Admin from './pages/Admin';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/blanko" element={<Blanko />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<h1>404: Seite nicht gefunden</h1>} />
        </Routes>
      </Router>
    </AuthProvider>
  </StrictMode>
);
