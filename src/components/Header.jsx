import { useState, useEffect } from "react";
import "./header.css";
import axios from "axios";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(localStorage.getItem("jwtToken"))
  );

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    setIsAuthenticated(!!token);
  }, []);

  // 🔹 Login Handler mit Axios
  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const response = await axios.post("http://localhost:9001/login", {
        username,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("jwtToken", response.data.token);
        setIsAuthenticated(true);
        setIsLoginOpen(false);
        console.log("Login erfolgreich!");
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        console.log("Login fehlgeschlagen: " + error.response.data);
      } else {
        console.log("Server nicht erreichbar!");
      }
    }
  };

  // 🔹 Registrierung Handler mit Axios
  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      await axios.post("http://localhost:9001/users", {
        username,
        password,
      });

      console.log("Registrierung erfolgreich!");
      setIsRegisterOpen(false);
    } catch (error) {
      console.error(error);
      if (error.response) {
        console.log("Registrierung fehlgeschlagen: " + error.response.data);
      } else {
        console.log("Server nicht erreichbar!");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    setIsAuthenticated(false);
    window.location.href = "/home";
  };

  return (
    <>
      <div className="header">
        <div className="header-left">
          <img
            src="public/assets/images/logo/logo.png"
            alt="NextStep Logo"
            className="header-logo-image"
          />
          <h1 className="header-title">
            „NextStep“{" "}
            <span style={{ color: "gray", fontSize: "10px", marginLeft: "5px" }}>
              Konzept Projekt
            </span>
          </h1>
        </div>

        <nav className={`nav ${menuOpen ? "open" : ""}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <a href="/home" className="nav-link">
                Home
              </a>
            </li>

            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <a href="/dashboard" className="nav-link">
                    Dashboard
                  </a>
                </li>
                <li className="nav-item">
                  <a href="/planer" className="nav-link">
                    Planer
                  </a>
                </li>
                <li className="nav-item">
                  <a href="/profile" className="nav-link">
                    Profile
                  </a>
                </li>
                <li className="nav-item">
                  <button className="" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>

          {!isAuthenticated && (
            <div className="auth-buttons-mobile">
              <button
                className="btn login-btn"
                onClick={() => setIsLoginOpen(true)}
              >
                Login
              </button>
              <button
                className="btn register-btn"
                onClick={() => setIsRegisterOpen(true)}
              >
                Register
              </button>
            </div>
          )}
        </nav>

        {!isAuthenticated && (
          <div className="auth-buttons desktop-only">
            <button
              className="btn login-btn"
              onClick={() => setIsLoginOpen(true)}
            >
              Login
            </button>
            <button
              className="btn register-btn"
              onClick={() => setIsRegisterOpen(true)}
            >
              Register
            </button>
          </div>
        )}

        <div className="burger" onClick={toggleMenu}>
          <span className="burger-line"></span>
          <span className="burger-line"></span>
          <span className="burger-line"></span>
        </div>
      </div>

      {/* 🔹 Login Modal */}
      {isLoginOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsLoginOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "var(--background-color)",
              padding: "2rem",
              borderRadius: "10px",
              minWidth: "300px",
              color: "white",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <h2>Login</h2>
            <form
              onSubmit={handleLogin}
              style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
            >
              <input
                name="username"
                type="text"
                placeholder="Benutzername"
                required
                style={{
                  padding: "0.5rem",
                  borderRadius: "5px",
                  border: "none",
                  marginRight: "10px",
                }}
              />
              <input
                name="password"
                type="password"
                placeholder="Passwort"
                required
                style={{
                  padding: "0.5rem",
                  borderRadius: "5px",
                  border: "none",
                  marginRight: "10px",
                }}
              />
              <button type="submit" className="login-btn">
                Einloggen
              </button>
            </form>
            <button
              className="close-btn"
              onClick={() => setIsLoginOpen(false)}
              style={{
                position: "absolute",
                top: "0.5rem",
                right: "0.5rem",
                background: "transparent",
                border: "none",
                fontSize: "1.2rem",
                color: "white",
              }}
            >
              X
            </button>
          </div>
        </div>
      )}

      {/* 🔹 Register Modal */}
      {isRegisterOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsRegisterOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "var(--background-color)",
              padding: "2rem",
              borderRadius: "10px",
              minWidth: "300px",
              color: "white",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <h2>Register</h2>
            <form
              onSubmit={handleRegister}
              style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
            >
              <input
                name="username"
                type="text"
                placeholder="Benutzername"
                required
                style={{
                  padding: "0.5rem",
                  borderRadius: "5px",
                  border: "none",
                }}
              />
              <input
                name="password"
                type="password"
                placeholder="Passwort"
                required
                style={{
                  padding: "0.5rem",
                  borderRadius: "5px",
                  border: "none",
                }}
              />
              <button type="submit" className="register-btn">
                Registrieren
              </button>
            </form>
            <button
              className="close-btn"
              onClick={() => setIsRegisterOpen(false)}
              style={{
                position: "absolute",
                top: "0.5rem",
                right: "0.5rem",
                background: "transparent",
                border: "none",
                fontSize: "1.2rem",
                color: "white",
              }}
            >
              X
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
