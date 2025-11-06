const express = require("express");
const app = express();
const port = 9001;
const cors = require("cors");


// API
app.use(cors());

app.use(express.json());


// Users

const usersRoutes = require("./routes/users");
app.use(usersRoutes);

// DailyTask

const dailytaskRoutes = require("./routes/dailytask");
app.use(dailytaskRoutes);

app.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
});