require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const bodyParser = require("body-parser");

const loadMongoDatabase = require("./database/loadMongoDatabase");
const { loadRedisDatabase } = require("./database/loadRedisDatabase");

const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});

const readRoutes = (dir) => {
  const files = fs.readdirSync(path.join(__dirname, dir));
  for (const file of files) {
    const stat = fs.lstatSync(path.join(__dirname, dir, file));
    if (stat.isDirectory()) {
      readRoutes(path.join(dir, file));
    } else {
      if (file.endsWith(".js")) {
        let routePath = `${dir}/${file}`
          .replace("routes", "")
          .replace(".js", "")
          .replace("\\", "/");

        if (file === "main.js") {
          routePath = routePath.replace("main", "");
        }

        const routeLogic = require(path.join(__dirname, dir, file));
        setTimeout(() => {
          console.log(`> Loaded Route: ${routePath}`);
        }, 1000);
        app.use(routePath, routeLogic);
      }
    }
  }
};

readRoutes("routes");
loadMongoDatabase();
loadRedisDatabase();

app.use("*", (req, res) => {
  res.status(404).send({ Message: "Not Found" });
});

app.listen(PORT, () => {
  console.log(`> http://localhost:${PORT}`);
  console.log(`> Server Started: ${PORT}`);
});
