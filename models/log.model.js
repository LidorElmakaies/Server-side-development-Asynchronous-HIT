const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    level: { type: String, required: true },
    message: { type: String, required: true },
    method: { type: String },
    path: { type: String },
    statusCode: { type: Number },
    service: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, index: true }
  },
  { versionKey: false }
);

logSchema.statics.createLog = function createLog(payload) {
  return this.create(payload);
};

logSchema.statics.listLogs = function listLogs() {
  return this.find({}, { _id: 0 }).sort({ createdAt: -1 }).lean();
};

module.exports = mongoose.model("Log", logSchema, "logs");
