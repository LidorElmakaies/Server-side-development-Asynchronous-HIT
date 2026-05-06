const express = require("express");
const errors = require("./core/errors");
const logging = require("./core/logging");
const UsersService = require("./services/users.service");
const CostsService = require("./services/costs.service");
const LogsService = require("./services/logs.service");
const AboutService = require("./services/about.service");

class ServerApp {
  constructor() {
    this.app = express();
    this.usersService = new UsersService();
    this.costsService = new CostsService();
    this.logsService = new LogsService();
    this.aboutService = new AboutService();
  }

  wrap(handler) {
    return async (req, res, next) => {
      try {
        await handler(req, res);
      } catch (error) {
        next(error);
      }
    };
  }

  async unifiedAdd(req, res) {
    const body = req.body || {};

    // Route POST /api/add to user or cost logic by payload shape.
    if (Object.prototype.hasOwnProperty.call(body, "userid")) {
      return this.costsService.addCost(req, res);
    }
    if (Object.prototype.hasOwnProperty.call(body, "id")) {
      return this.usersService.addUser(req, res);
    }

    throw errors.makeError(
      "VALIDATION_ERROR",
      "POST /api/add requires either user payload (id,first_name,last_name,birthday) or cost payload (userid,description,category,sum)",
    );
  }

  registerRoutes() {
    this.app.post("/api/add", this.wrap(this.unifiedAdd.bind(this)));
    this.app.get(
      "/api/report",
      this.wrap(this.costsService.getReport.bind(this.costsService)),
    );
    this.app.get(
      "/api/users",
      this.wrap(this.usersService.listUsers.bind(this.usersService)),
    );
    this.app.get(
      "/api/users/:id",
      this.wrap(this.usersService.getUserDetails.bind(this.usersService)),
    );
    this.app.get(
      "/api/logs",
      this.wrap(this.logsService.listLogs.bind(this.logsService)),
    );
    this.app.get(
      "/api/about",
      this.wrap(this.aboutService.getAbout.bind(this.aboutService)),
    );
  }

  create() {
    this.app.use(express.json());
    this.app.use(...logging.requestLogger("main-server"));
    this.registerRoutes();
    this.app.use(logging.errorHandler);
    return this.app;
  }
}

module.exports = ServerApp;
