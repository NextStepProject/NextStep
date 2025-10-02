import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Home from './pages/Home';
import Header from './components/Header';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/header" element={<Header />} />
        </Routes>
      </Router>
    </AuthProvider>
  </StrictMode>
);
