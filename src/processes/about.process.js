require("dotenv").config();

const AboutService = require("../services/about.service");
const { createProcessApp, startProcess } = require("./process-utils");

const aboutService = new AboutService();
const port = Number(process.env.ABOUT_PORT || 3004);

const serviceName = "about-service";
const registerRoutes = (app, wrap) => {
  app.get("/api/about", wrap(aboutService.getAbout.bind(aboutService)));
};

function createAboutApp() {
  return createProcessApp({
    serviceName,
    registerRoutes
  });
}

if (require.main === module) {
  startProcess({
    serviceName,
    port,
    registerRoutes
  }).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  createAboutApp
};
