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

module.exports = mongoose.model("Log", logSchema, "logs");
