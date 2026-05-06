require("dotenv").config();

const CostsService = require("../services/costs.service");
const { createProcessApp, startProcess } = require("./process-utils");

const costsService = new CostsService();
const port = Number(process.env.COSTS_PORT || 3002);

const serviceName = "costs-service";
const registerRoutes = (app, wrap) => {
  app.post("/api/add", wrap(costsService.addCost.bind(costsService)));
  app.get("/api/report", wrap(costsService.getReport.bind(costsService)));
};

function createCostsApp() {
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
  createCostsApp
};
