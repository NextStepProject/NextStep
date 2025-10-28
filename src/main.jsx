import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './main.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import Planer from './pages/Planer';
import Profile from './pages/Profile';
import Error from './pages/Error';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/planer" element={<Planer />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  </StrictMode>
);
