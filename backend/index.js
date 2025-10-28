const express = require("express");
const app = express();
const port = 9000;
const cors = require("cors");

// Users

const usersRoutes = require("./routes/users");
app.use(usersRoutes);