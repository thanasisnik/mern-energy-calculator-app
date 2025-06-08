const express = require("express");
const cors = require("cors");

const app = express();

const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is working");
});

app.use("/api/users", userRoutes);

app.use("/api/auth", authRoutes);

module.exports = app;
