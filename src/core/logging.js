const pino = require("pino");
const pinoHttp = require("pino-http");
const Log = require("../../models/log.model");
const errors = require("./errors");

class LoggingService {
  constructor() {
    this.logger = pino({ level: process.env.PINO_LEVEL || "info" });
    this.errorHandler = this.errorHandler.bind(this);
  }

  async writeLog(log) {
    try {
      await Log.createLog(log);
    } catch (error) {
      this.logger.error(
        { err: error.message },
        "Failed writing log to MongoDB",
      );
    }
  }

  requestLogger(service) {
    return [
      pinoHttp({ logger: this.logger }),
      async (req, res, next) => {
        res.on("finish", () => {
          this.writeLog({
            level: "info",
            message: "HTTP_REQUEST",
            method: req.method,
            path: req.originalUrl,
            statusCode: res.statusCode,
            service,
          });
        });
        next();
      },
    ];
  }

  endpointLog(service, message, req, level = "info") {
    return this.writeLog({
      level,
      message,
      method: req.method,
      path: req.originalUrl,
      service,
    });
  }

  errorHandler(err, req, res, next) {
    if (res.headersSent) {
      return next(err);
    }

    const status = err.status || 500;
    const errorBody = {
      id: err.id || errors.ids.INTERNAL_ERROR,
      message: err.message || "Unexpected error",
    };

    this.writeLog({
      level: "error",
      message: `${errorBody.id}: ${errorBody.message}`,
      method: req.method,
      path: req.originalUrl,
      statusCode: status,
      service: process.env.SERVICE_NAME || "unknown",
    });

    return res.status(status).json(errorBody);
  }
}

module.exports = new LoggingService();
