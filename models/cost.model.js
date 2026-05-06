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

costSchema.statics.createCost = function createCost(payload) {
  return this.create(payload);
};

costSchema.statics.sumByUserId = async function sumByUserId(userid) {
  const totals = await this.aggregate([
    { $match: { userid } },
    { $group: { _id: null, total: { $sum: "$sum" } } }
  ]);
  return totals[0] ? Number(totals[0].total) : 0;
};

costSchema.statics.findByUserAndDateRange = function findByUserAndDateRange(userid, from, to) {
  return this.find({ userid, createdAt: { $gte: from, $lt: to } }).lean();
};

module.exports = mongoose.model("Cost", costSchema, "costs");
