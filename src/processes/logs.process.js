require("dotenv").config();

const LogsService = require("../services/logs.service");
const { createProcessApp, startProcess } = require("./process-utils");

const logsService = new LogsService();
const port = Number(process.env.LOGS_PORT || 3003);

const serviceName = "adminLogsManager";
const registerRoutes = (app, wrap) => {
  app.get("/api/logs", wrap(logsService.listLogs.bind(logsService)));
};

function createLogsApp() {
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
  createLogsApp
};
