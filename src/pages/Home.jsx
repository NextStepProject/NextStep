import { useState, useEffect } from "react";
import Header from "../components/Header";
import "./home.css";


const quotes = [
  "„Wer das Ziel kennt, findet den Weg.“ – Laotse (ca. 600 v. Chr.)",
  "„Nicht der Berg ist es, den man bezwingt, sondern das eigene Ich.“ – Edmund Hillary (1953)",
  "„Selbstmotivation ist die Kunst, das eigene Feuer am Brennen zu halten.“ (2025)",
  "„Der Weg entsteht, indem du ihn gehst.“ – Antonio Machado (1912)",
  "„Disziplin ist die Brücke zwischen Zielen und Erfolg.“ – Jim Rohn (1981)",
  "„Wachstum geschieht leise – in Momenten, in denen du fast aufgeben willst, aber weitermachst.“ (2025)",
  "„Beginne mit dem, was du hast. Tu, was du kannst. Dort, wo du bist.“ – Theodore Roosevelt (1901)",
  "„Selbstüberwindung ist der erste Sieg.“ – Platon (ca. 380 v. Chr.)",
  "„Wer sich selbst führt, ist niemals verloren.“ (2025)",
  "„Motivation bringt dich in Gang, Gewohnheit hält dich in Bewegung.“ (2000)",
];

const Home = () => {
  const [quote, setQuote] = useState(quotes[4]);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setQuote(randomQuote);
        setFade(true);
      }, 1000);
    }, 20000); 
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-container">
      <Header />
      <video autoPlay muted loop className="bg-video">
        <source src="/assets/video/promo/promo.mp4" type="video/mp4" />
        Dein Browser unterstützt keine HTML5-Videos.
      </video>
      <div className="content">
        <h3 className={`fade-text ${fade ? "fade-in" : "fade-out"}`}>
          {quote}
        </h3>
      </div>
    </div>
  );
};

export default Home;
