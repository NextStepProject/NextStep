const express = require("express");
const app = express();
const port = 9000;
const cors = require("cors");

// API
app.use(cors());

app.use(express.json());

// Users

const usersRoutes = require("./routes/users");
app.use(usersRoutes);