import Header from "../components/Header";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <Header />

      <video autoPlay muted loop className="bg-video">
        <source src="/assets/video/promo/promo.mp4" type="video/mp4" />
        Dein Browser unterstützt keine HTML5-Videos.
      </video>

      <div className="overlay"></div>

      <div className="content">
        <h1>Beispieltext</h1>
      </div>
    </div>
  );
};

export default Home;
