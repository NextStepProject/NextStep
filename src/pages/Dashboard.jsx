import Header from "../components/Header";

const Dashboard = () => {
  const tasks = ["Staubsaugen", "Hausaufgaben", "Brusttraining"];

  return (
    <div>
      <Header />
      <h1>Dashboard</h1>
      <p>Hier kommt deine Wochenübersicht und Tasks hin.</p>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>{task}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;

