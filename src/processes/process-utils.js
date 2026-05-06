const express = require("express");
const database = require("../../models/database.model");
const logging = require("../core/logging");

function wrap(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (error) {
      next(error);
    }
  };
}

function createProcessApp({ serviceName, registerRoutes }) {
  process.env.SERVICE_NAME = serviceName;
  const app = express();
  app.use(express.json());
  app.use(...logging.requestLogger(serviceName));
  registerRoutes(app, wrap);
  app.use(logging.errorHandler);
  return app;
}

async function startProcess({ serviceName, port, registerRoutes }) {
  process.env.SERVICE_NAME = serviceName;
  await database.connect(serviceName);
  const app = createProcessApp({ serviceName, registerRoutes });
  app.listen(port, () => {
    console.log(`${serviceName} listening on ${port}`);
  });
}

module.exports = {
  createProcessApp,
  startProcess
};
