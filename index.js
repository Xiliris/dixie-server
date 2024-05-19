require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const loadMongoDatabase = require("./database/loadMongoDatabase");
const { loadRedisDatabase } = require("./database/loadRedisDatabase");
const loadRoutes = require("./handlers/route-handler");
const clientLogin = require("./client-modules/client-login");
const logAllClients = require("./client-modules/client-data");

const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "storage")));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});

loadRoutes(app, "../routes");
loadMongoDatabase();
loadRedisDatabase();
clientLogin(process.env.CLIENT_TOKEN);
logAllClients();

app.use("*", (req, res) => {
  res.status(404).send({ Message: "Not Found" });
});

app.listen(PORT, () => {
  console.log(`> http://localhost:${PORT}`);
  console.log(`> Server Started: ${PORT}`);
});
