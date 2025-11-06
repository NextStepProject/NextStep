import Header from "../components/Header";
import "./dashboard.css";

const Dashboard = () => {
  const dailyTasks = [
    "Windows Update durchführen (Arbeitslaptop)",
    "Hausaufgaben (Schüler)",
    "Brusttraining - 18 Uhr mit Max",
    "Käfig Reinigung",
  ];

  const token = localStorage.getItem("jwtToken");

  if (!token) {
    window.location.href = "/home";
    return null;
  }

  return (
    <div>
      <Header />
      <div className="content-container">
        <section>
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
            <div className="progress-fill" style={{ width: "60%" }}></div>
          </div>
          <p>60 % der Aufgaben wurden geschafft </p>

          <div className="task-list">
            <h2>Noch offene Aufgaben</h2>
            <ul>
              {dailyTasks.map((task, i) => (
                <li key={i}>
                  <label>
                    <input type="checkbox" /> {task}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
