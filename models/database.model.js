const mongoose = require("mongoose");
const pino = require("pino");

class DatabaseModel {
  constructor() {
    this.logger = pino({ level: process.env.PINO_LEVEL || "info" });
  }

  async connect(serviceName = "unknown-service") {
    await mongoose.connect(process.env.MONGO_URI);
    this.logger.info({ service: serviceName }, "MongoDB connected");
  }

  async disconnect() {
    await mongoose.disconnect();
  }
}

module.exports = new DatabaseModel();
