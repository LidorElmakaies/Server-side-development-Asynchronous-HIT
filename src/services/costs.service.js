const Cost = require("../../models/cost.model");
const User = require("../../models/user.model");
const MonthlyReport = require("../../models/monthly-report.model");
const errors = require("../core/errors");
const logging = require("../core/logging");
const validation = require("../core/validation");

class CostsService {
  getMonthRange(year, month) {
    return {
      from: new Date(Date.UTC(year, month - 1, 1, 0, 0, 0)),
      to: new Date(Date.UTC(year, month, 1, 0, 0, 0))
    };
  }

  buildReport(userid, year, month, costs) {
    const grouped = {
      food: [],
      health: [],
      housing: [],
      sports: [],
      education: []
    };

    costs.forEach((item) => {
      grouped[item.category].push({
        sum: Number(item.sum),
        description: item.description,
        day: new Date(item.createdAt).getUTCDate()
      });
    });

    return {
      userid,
      year,
      month,
      costs: validation.categories.map((category) => ({ [category]: grouped[category] }))
    };
  }

  isPastMonth(year, month) {
    const now = new Date();
    const currentYear = now.getUTCFullYear();
    const currentMonth = now.getUTCMonth() + 1;
    return year < currentYear || (year === currentYear && month < currentMonth);
  }

  async addCost(req, res) {
    await logging.endpointLog("main-server", "ADD_COST", req);
    validation.validateCostPayload(req.body);

    const user = await User.findOne({ id: req.body.userid }).lean();
    if (!user) {
      throw errors.makeError("NOT_FOUND", "userid does not exist", 404);
    }

    const now = new Date();
    const createdAt = req.body.createdAt ? new Date(req.body.createdAt) : now;
    if (Number.isNaN(createdAt.getTime())) {
      throw errors.makeError("VALIDATION_ERROR", "createdAt must be a valid date");
    }

    const startOfCurrentMonthUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0));
    if (createdAt < startOfCurrentMonthUtc) {
      throw errors.makeError("VALIDATION_ERROR", "cannot add costs for past months");
    }

    const cost = await Cost.create({
      userid: req.body.userid,
      description: req.body.description,
      category: req.body.category,
      sum: req.body.sum,
      createdAt
    });

    res.status(201).json({
      description: cost.description,
      category: cost.category,
      userid: cost.userid,
      sum: Number(cost.sum),
      createdAt: cost.createdAt
    });
  }

  async getReport(req, res) {
    await logging.endpointLog("main-server", "GET_REPORT", req);
    const userid = Number(req.query.id);
    const year = Number(req.query.year);
    const month = Number(req.query.month);

    if (!Number.isInteger(userid) || userid <= 0) {
      throw errors.makeError("VALIDATION_ERROR", "id must be a positive integer");
    }
    if (!Number.isInteger(year) || year < 1970 || year > 3000) {
      throw errors.makeError("VALIDATION_ERROR", "year is invalid");
    }
    if (!Number.isInteger(month) || month < 1 || month > 12) {
      throw errors.makeError("VALIDATION_ERROR", "month is invalid");
    }

    /* Computed Design Pattern: for past months, compute once and cache in monthly_reports.
       Since adding costs for past months is rejected, cached values stay consistent. */
    if (this.isPastMonth(year, month)) {
      const cached = await MonthlyReport.findOne(
        { userid, year, month },
        { _id: 0, userid: 1, year: 1, month: 1, costs: 1 }
      ).lean();
      if (cached) {
        return res.json(cached);
      }
    }

    const range = this.getMonthRange(year, month);
    const costs = await Cost.find({
      userid,
      createdAt: { $gte: range.from, $lt: range.to }
    }).lean();

    const report = this.buildReport(userid, year, month, costs);

    if (this.isPastMonth(year, month)) {
      await MonthlyReport.findOneAndUpdate({ userid, year, month }, report, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      });
    }

    return res.json(report);
  }
}

module.exports = CostsService;
