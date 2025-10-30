import { useState } from "react";
import "./header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="header">
      <div className="header-left">
        <img
          src="public/assets/images/logo/logo.png"
          alt="NextStep Logo"
          className="header-logo-image"
        />
        <h1 className="header-title">
          „NextStep“{" "}
          <span style={{ color: "gray", fontSize: "10px" , marginLeft: "5px" }}>
            Konzept Projekt
          </span>
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
          <li className="nav-item">
            <a href="/planer" className="nav-link">Planer</a>
          </li>
          <li className="nav-item">
            <a href="/profile" className="nav-link">Profile</a>
          </li>
        </ul>

        <div className="auth-buttons-mobile">
          <button className="btn login-btn">
            <a href="/login" className="nav-link">Login</a>
          </button>
          <button className="btn register-btn">
            <a href="/register" className="nav-link">Register</a>
          </button>
        </div>
      </nav>

      <div className="auth-buttons desktop-only">
        <button className="btn login-btn">
          <a href="/login" className="nav-link">Login</a>
        </button>
        <button className="btn register-btn">
          <a href="/register" className="nav-link">Register</a>
        </button>
      </div>

      <div className="burger" onClick={toggleMenu}>
        <span className="burger-line"></span>
        <span className="burger-line"></span>
        <span className="burger-line"></span>
      </div>
    </div>
  );
};

export default Header;
