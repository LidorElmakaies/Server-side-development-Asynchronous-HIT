const mongoose = require("mongoose");

const monthlyReportSchema = new mongoose.Schema(
  {
    userid: { type: Number, required: true, index: true },
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    costs: { type: Array, required: true },
  },
  { timestamps: true, versionKey: false },
);

monthlyReportSchema.index({ userid: 1, year: 1, month: 1 }, { unique: true });

monthlyReportSchema.statics.findCachedReport = function findCachedReport(userid, year, month) {
  return this.findOne(
    { userid, year, month },
    { _id: 0, userid: 1, year: 1, month: 1, costs: 1 }
  ).lean();
};

monthlyReportSchema.statics.upsertReport = function upsertReport(userid, year, month, report) {
  return this.findOneAndUpdate(
    { userid, year, month },
    report,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

module.exports = mongoose.model(
  "MonthlyReport",
  monthlyReportSchema,
  "monthly_reports",
);
