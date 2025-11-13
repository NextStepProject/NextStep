import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import "./dashboard.css";

const Dashboard = () => {
  const [dailyTasks, setDailyTasks] = useState([]);
  const [oldTasks, setOldTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, taskId: null, title: "" });
  const [newTask, setNewTask] = useState({ title: "", description: "", due_date: "", repeat_interval: "" });
  const token = localStorage.getItem("jwtToken");

  function isTokenExpired(token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (e) {
      return true;
    }
  }

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("jwtToken");
    window.location.href = "/home";
    return null;
  }

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("http://localhost:9001/dailytask", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Fehler beim Abrufen der Aufgaben");
        const data = await res.json();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayTasks = [];
        const pastTasks = [];

        for (const task of data) {
          const start = new Date(task.due_date);
          if (isNaN(start)) {
            const parts = task.due_date.split(/[-./]/);
            if (parts.length === 3 && parts[2].length === 4) {
              start.setFullYear(parts[2], parts[1] - 1, parts[0]);
            }
          }
          start.setHours(0, 0, 0, 0);

          let isDueToday = false;
          if (!task.repeat_interval || task.repeat_interval === 0) {
            isDueToday = start.getTime() === today.getTime();
          } else {
            const diffDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));
            if (diffDays >= 0 && diffDays % task.repeat_interval === 0) {
              isDueToday = true;
            }
          }

          if (isDueToday) {
            if (task.is_done === 1 && task.repeat_interval > 0) {
              await fetch(`http://localhost:9001/dailytask/done/${task.taskid}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ is_done: 0 }),
              });
              task.is_done = 0;
            }
            todayTasks.push(task);
            continue;
          }

          if (!isDueToday && start < today && task.is_done === 0) {
            pastTasks.push(task);
          }

          if (!isDueToday && start < today && task.is_done === 1 && (!task.repeat_interval || task.repeat_interval === 0)) {
            await fetch(`http://localhost:9001/dailytask/${task.taskid}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
          }
        }

        setDailyTasks(todayTasks);
        setOldTasks(pastTasks);

        const doneCount = todayTasks.filter((t) => t.is_done === 1).length;
        const percentage = todayTasks.length === 0 ? 100 : (doneCount / todayTasks.length) * 100;
        setProgress(percentage);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [token]);

  const toggleTaskDone = async (taskId, currentStatus, isOld = false, repeat_interval = 0) => {
    try {
      await fetch(`http://localhost:9001/dailytask/done/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ is_done: currentStatus ? 0 : 1 }),
      });

      if (isOld && currentStatus === 0 && (!repeat_interval || repeat_interval === 0)) {
        await fetch(`http://localhost:9001/dailytask/${taskId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
        setOldTasks((prev) => prev.filter((t) => t.taskid !== taskId));
        return;
      }

      if (isOld) {
        setOldTasks((prev) => prev.map((t) => (t.taskid === taskId ? { ...t, is_done: currentStatus ? 0 : 1 } : t)));
      } else {
        const updatedTasks = dailyTasks.map((t) => (t.taskid === taskId ? { ...t, is_done: currentStatus ? 0 : 1 } : t));
        setDailyTasks(updatedTasks);
        const doneCount = updatedTasks.filter((t) => t.is_done === 1).length;
        setProgress(updatedTasks.length === 0 ? 100 : (doneCount / updatedTasks.length) * 100);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteConfirmed = async () => {
    try {
      await fetch(`http://localhost:9001/dailytask/${deleteModal.taskId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      setDailyTasks((prev) => prev.filter((t) => t.taskid !== deleteModal.taskId));
      setOldTasks((prev) => prev.filter((t) => t.taskid !== deleteModal.taskId));
      setDeleteModal({ open: false, taskId: null, title: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:9001/dailytask", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(newTask),
      });
      if (!res.ok) throw new Error("Fehler beim Erstellen der Aufgabe");
      setIsModalOpen(false);
      setNewTask({ title: "", description: "", due_date: "", repeat_interval: "" });
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="content-container">
          <p>Lade Aufgaben...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="content-container">
        <section>
          {/* Diese Sektion nicht anpassen wenn nicht erwünscht! auf nicht die Kommentare */}
          <h1>Erinnerungen</h1>
          <div className="reminder-card">
            <p>
              🍰 Martina hat am <strong>1.11.2025</strong> Geburtstag! Sie wird{" "}
              <strong>44</strong>   (1 Woche Verher).
              {/* Errinerung Max 7 Woche Vorher */}
            </p>
          </div>
          <div className="reminder-card highlight">
            <p>
              Die <strong>AOK</strong> bietet aktuell einen{" "}
              <strong>30 € Amazon Gutschein</strong>, wenn Sie jetzt einen
              Krebsvorsorgetermin vereinbaren.
            </p>
          </div>
        </section>
        <section>
          <h1>Heutiger Fortschritt</h1>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress.toFixed(0)}%` }}></div>
          </div>
          <p>{progress.toFixed(0)} % der Aufgaben wurden geschafft</p>

          <div className="task-list">
            <div className="task-header">
              <h2>Heutige Aufgaben</h2>
              <button onClick={() => setIsModalOpen(true)}>+ Neue Aufgabe</button>
            </div>
            <ul>
              {dailyTasks.length === 0 ? (
                <li>Keine Aufgaben für heute</li>
              ) : (
                dailyTasks.map((task) => (
                  <li key={task.taskid} className={`task-item ${task.is_done ? "done" : ""}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label style={{ flexGrow: 1 }}>
                      <input type="checkbox" checked={task.is_done === 1} onChange={() => toggleTaskDone(task.taskid, task.is_done)} />
                      <span>{task.title}</span>
                    </label>
                    <button onClick={() => setDeleteModal({ open: true, taskId: task.taskid, title: task.title })} style={{ marginLeft: "10px", backgroundColor: "#c0392b", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "6px", cursor: "pointer" }}>Löschen</button>
                  </li>
                ))
              )}
            </ul>
          </div>

          {oldTasks.length > 0 && (
            <div className="task-list old-tasks">
              <h2>Offene alte Aufgaben</h2>
              <ul>
                {oldTasks.map((task) => (
                  <li key={task.taskid} className={`task-item old ${task.is_done ? "done" : ""}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label style={{ flexGrow: 1 }}>
                      <input type="checkbox" checked={task.is_done === 1} onChange={() => toggleTaskDone(task.taskid, task.is_done, true, task.repeat_interval)} />
                      <span>{task.title} (Überfällig seit dem {task.due_date})</span>
                    </label>
                    <button onClick={() => setDeleteModal({ open: true, taskId: task.taskid, title: task.title })} style={{ marginLeft: "10px", backgroundColor: "#c0392b", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "6px", cursor: "pointer" }}>Löschen</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Neue Aufgabe erstellen</h2>
            <form onSubmit={handleAddTask} className="task-form">
              <input type="text" placeholder="Titel" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} required />
              <textarea placeholder="Beschreibung" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}></textarea>
              <label>Fällig am:</label>
              <input type="date" value={newTask.due_date} onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })} required />
              <label>Wiederholung (Tage):</label>
              <input type="number" min="0" value={newTask.repeat_interval} onChange={(e) => setNewTask({ ...newTask, repeat_interval: e.target.value ? parseInt(e.target.value) : 0 })} />
              <button type="submit">Speichern</button>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ backgroundColor: "#a00", color: "#fff" }}>Abbrechen</button>
            </form>
          </div>
        </div>
      )}

      {deleteModal.open && (
        <div className="modal-overlay" onClick={() => setDeleteModal({ open: false, taskId: null, title: "" })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Aufgabe löschen?</h2>
            <p>Möchten Sie die Aufgabe <strong>{deleteModal.title}</strong> wirklich löschen? Dies kann nicht rückgängig gemacht werden.</p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button onClick={() => setDeleteModal({ open: false, taskId: null, title: "" })}>Abbrechen</button>
              <button onClick={handleDeleteConfirmed} style={{ backgroundColor: "#c0392b", color: "#fff" }}>Löschen bestätigen</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
