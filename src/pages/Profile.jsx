import { useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import "./profile.css";

const Profile = () => {
  const [isMainModalOpen, setIsMainModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [editType, setEditType] = useState(null);

  const token = localStorage.getItem("jwtToken");

  const handleActionSelect = (type) => {
    setEditType(type);
    setIsMainModalOpen(false);
    setIsActionModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editType === "username") {
        const formData = new FormData(e.target);
        const newUsername = formData.get("newUsername");

        const res = await axios.put(
          "http://localhost:9001/user",
          { newUsername },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Username changed to:", newUsername);
        window.location.href = "/profile";
      }

      if (editType === "password") {
        const formData = new FormData(e.target);
        const password = formData.get("password");
        const newPassword = formData.get("newPassword");

        const res = await axios.put(
          "http://localhost:9001/user",
          { password, newPassword },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Password Geändert");
        window.location.href = "/profile";
      }

      if (editType === "delete") {
        if (!window.confirm("Bist du sicher, dass du deinen Account löschen willst?")) {
          return;
        }

        const res = await axios.delete("http://localhost:9001/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        localStorage.removeItem("jwtToken");
        window.location.href = "/home";
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!token) {
    window.location.href = "/home";
    return null;
  }

  return (
    <div>
      <Header />

      <div className="floating-profile-container">
        <div className="profile-image-container">
          <img
            src="/assets/images/profile/default_user.png"
            alt="default profile picture"
            className="profile-picture"
          />
        </div>
        <div className="short-user-infos">
          <p>Username: Demo User</p>
          <p>Birthday: 23.11.1998</p>
        </div>
      </div>

      <div className="detailed-user-infos">
        <p>Beispielinformationen</p>
        <p>Username: Demo User</p>
        <p>Birthday: 23.11.1998</p>
      </div>

      <div className="detailed-user-infos">
        <div className="button-container" style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => setIsMainModalOpen(true)}>
            Profil bearbeiten
          </button>
        </div>
      </div>

      {isMainModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsMainModalOpen(false)}
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
            zIndex: 9999,
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "var(--background-color)",
              padding: "2rem",
              borderRadius: "10px",
              minWidth: "320px",
              color: "white",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <h2>Profil bearbeiten</h2>
            <button onClick={() => handleActionSelect("username")}>
              Namen ändern
            </button>
            <button onClick={() => handleActionSelect("password")}>
              Passwort ändern
            </button>
            <button
              style={{ backgroundColor: "#a00", color: "white" }}
              onClick={() => handleActionSelect("delete")}
            >
              Benutzer löschen
            </button>

            <button
              className="close-btn"
              onClick={() => setIsMainModalOpen(false)}
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

      {isActionModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsActionModalOpen(false)}
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
            zIndex: 9999,
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "var(--background-color)",
              padding: "2rem",
              borderRadius: "10px",
              minWidth: "320px",
              color: "white",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <h2>
              {editType === "username" && "Benutzernamen ändern"}
              {editType === "password" && "Passwort ändern"}
              {editType === "delete" && "Benutzer löschen"}
            </h2>

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
            >
              {editType === "username" && (
                <input
                  name="newUsername"
                  type="text"
                  placeholder="Neuer Benutzername"
                  required
                  style={{
                    padding: "0.5rem",
                    borderRadius: "5px",
                    border: "none",
                  }}
                />
              )}

              {editType === "password" && (
                <>
                  <input
                    name="password"
                    type="password"
                    placeholder="Aktuelles Passwort"
                    required
                    style={{
                      padding: "0.5rem",
                      borderRadius: "5px",
                      border: "none",
                    }}
                  />
                  <input
                    name="newPassword"
                    type="password"
                    placeholder="Neues Passwort"
                    required
                    style={{
                      padding: "0.5rem",
                      borderRadius: "5px",
                      border: "none",
                    }}
                  />
                </>
              )}

              {editType !== "delete" && (
                <button type="submit" className="btn">
                  Speichern
                </button>
              )}
              {editType === "delete" && (
                <button
                  type="submit"
                  className="btn"
                  style={{ backgroundColor: "#a00", color: "white" }}
                >
                  Benutzer löschen
                </button>
              )}
            </form>

            <button
              className="close-btn"
              onClick={() => setIsActionModalOpen(false)}
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
    </div>
  );
};

export default Profile;
