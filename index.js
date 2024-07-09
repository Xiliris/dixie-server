require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const loadMongoDatabase = require("./database/loadMongoDatabase");
const { loadRedisDatabase } = require("./database/loadRedisDatabase");
const loadRoutes = require("./handlers/route-handler");
const signToken = require("./middlewere/sign-token"); // Corrected typo here
const logAllClients = require("./bot/client-modules/client-data");
require("./bot/index");

const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "storage")));
app.use(signToken);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});

loadRoutes(app, "../routes");
loadMongoDatabase();
loadRedisDatabase();
logAllClients();

app.use("*", (req, res) => {
  res.status(404).send({ Message: "Not Found" });
});

app.listen(PORT, () => {
  console.log(`> http://localhost:${PORT}`);
  console.log(`> Server Started: ${PORT}`);
});
