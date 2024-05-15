const fs = require("fs");
const path = require("path");

const loadRoutes = (app, dir) => {
  const files = fs.readdirSync(path.join(__dirname, dir));
  for (const file of files) {
    const stat = fs.lstatSync(path.join(__dirname, dir, file));
    if (stat.isDirectory()) {
      loadRoutes(app, path.join(dir, file));
    } else {
      if (file.endsWith(".js")) {
        let routePath = `${dir}/${file}`
          .replace("routes", "")
          .replace(".js", "")
          .replace(/\\/g, "/")
          .replace("../", "");

        if (file === "main.js") {
          routePath = routePath.replace("main", "");
        }

        const routeLogic = require(path.join(__dirname, dir, file));
        app.use(routePath, routeLogic);
      }
    }
  }
};

module.exports = loadRoutes;
