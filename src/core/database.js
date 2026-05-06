const mongoose = require("mongoose");
const pino = require("pino");

class DatabaseService {
  constructor() {
    this.logger = pino({ level: process.env.PINO_LEVEL || "info" });
  }

  async connect(serviceName) {
    await mongoose.connect(process.env.MONGO_URI);
    this.logger.info({ service: serviceName }, "MongoDB connected");
  }
}

module.exports = new DatabaseService();
