const Cost = require("../../models/cost.model");
const User = require("../../models/user.model");
const MonthlyReport = require("../../models/monthly-report.model");
const errors = require("../core/errors");
const logging = require("../core/logging");
const validation = require("../core/validation");
const SERVICE_NAME = process.env.SERVICE_NAME || "unknown-service";

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
    await logging.endpointLog(SERVICE_NAME, "ADD_COST", req);
    validation.validateCostPayload(req.body);

    const user = await User.findByBusinessId(req.body.userid);
    if (!user) {
      throw errors.makeError(errors.ids.NOT_FOUND, "userid does not exist", 404);
    }

    const now = new Date();
    const createdAt = req.body.createdAt ? new Date(req.body.createdAt) : now;
    if (Number.isNaN(createdAt.getTime())) {
      throw errors.makeError(errors.ids.VALIDATION_ERROR, "createdAt must be a valid date");
    }

    const startOfCurrentMonthUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0));
    if (createdAt < startOfCurrentMonthUtc) {
      throw errors.makeError(errors.ids.VALIDATION_ERROR, "cannot add costs for past months");
    }

    const cost = await Cost.createCost({
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
    await logging.endpointLog(SERVICE_NAME, "GET_REPORT", req);
    const userid = Number(req.query.id);
    const year = Number(req.query.year);
    const month = Number(req.query.month);

    if (!Number.isInteger(userid) || userid <= 0) {
      throw errors.makeError(errors.ids.VALIDATION_ERROR, "id must be a positive integer");
    }
    if (!Number.isInteger(year) || year < 1970 || year > 3000) {
      throw errors.makeError(errors.ids.VALIDATION_ERROR, "year is invalid");
    }
    if (!Number.isInteger(month) || month < 1 || month > 12) {
      throw errors.makeError(errors.ids.VALIDATION_ERROR, "month is invalid");
    }

    /* Computed Design Pattern: for past months, compute once and cache in monthly_reports.
       Since adding costs for past months is rejected, cached values stay consistent. */
    if (this.isPastMonth(year, month)) {
      const cached = await MonthlyReport.findCachedReport(userid, year, month);
      if (cached) {
        return res.json(cached);
      }
    }

    const range = this.getMonthRange(year, month);
    const costs = await Cost.findByUserAndDateRange(userid, range.from, range.to);

    const report = this.buildReport(userid, year, month, costs);

    if (this.isPastMonth(year, month)) {
      await MonthlyReport.upsertReport(userid, year, month, report);
    }

    return res.json(report);
  }
}

module.exports = CostsService;
