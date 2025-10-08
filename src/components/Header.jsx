import { useState } from "react";
import "./Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header>
      <div className="header">

        <div className="header-left">
          <img src="public/assets/logo/logo.png " alt="Logo" className="header-logo-image" />
          <h1 className="header-title">
            „Improve Yourself Step by Step“ <span style={{ color: 'gray' , fontSize : '10px' }}>Conzept Projekt</span>
          </h1>
        </div>

        <nav className={`nav ${menuOpen ? "open" : ""}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <a href="/home" className="nav-link">Home</a>
            </li>
            <li className="nav-item">
              <a href="/dashboard" className="nav-link">Dashboard</a>
            </li>
          </ul>

          <div className="auth-buttons-mobile">
            <button className="btn login-btn"><a href="/login" className="nav-link">Login</a></button>
            <button className="btn register-btn"><a href="/login" className="nav-link">Register</a></button>
          </div>
        </nav>

        <div className="auth-buttons desktop-only">
          <button className="btn login-btn"><a href="/login" className="nav-link">Login</a></button>
          <button className="btn register-btn"><a href="/login" className="nav-link">Register</a></button>
        </div>

        <div className="burger" onClick={toggleMenu}>
          <span className="burger-line"></span>
          <span className="burger-line"></span>
          <span className="burger-line"></span>
        </div>
      </div>
    </header>
  );
};

export default Header;
