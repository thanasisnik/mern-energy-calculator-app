const express = require("express");
const cors = require("cors");

const app = express();

const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const deviceRoutes = require("./routes/device.routes");
const energyRoutes = require("./routes/energy.routes");

app.use(cors());
app.use(express.json());

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger');

app.get("/", (req, res) => {
  res.send("API is working");
});

app.use("/api/users", userRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/devices", deviceRoutes);

app.use("/api/consumption", energyRoutes);

app.use("/api-docs", 
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument.options)
)

module.exports = app;
