const mongoose = require("mongoose");

const categories = ["food", "health", "housing", "sports", "education"];

const costSchema = new mongoose.Schema(
  {
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: categories },
    userid: { type: Number, required: true, index: true },
    sum: { type: mongoose.Schema.Types.Double, required: true, min: 0 },
    createdAt: { type: Date, required: true, default: Date.now, index: true },
  },
  { versionKey: false },
);

module.exports = mongoose.model("Cost", costSchema, "costs");
