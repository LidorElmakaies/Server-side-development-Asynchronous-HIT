const User = require("../../models/user.model");
const Cost = require("../../models/cost.model");
const errors = require("../core/errors");
const logging = require("../core/logging");
const validation = require("../core/validation");

class UsersService {
  async listUsers(req, res) {
    await logging.endpointLog("main-server", "GET_USERS", req);
    const users = await User.find({}, { _id: 0 }).lean();
    res.json(users);
  }

  async getUserDetails(req, res) {
    await logging.endpointLog("main-server", "GET_USER_DETAILS", req);
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw errors.makeError(
        "VALIDATION_ERROR",
        "id must be a positive integer",
      );
    }

    const user = await User.findOne({ id }).lean();
    if (!user) {
      throw errors.makeError("NOT_FOUND", "user not found", 404);
    }

    const totals = await Cost.aggregate([
      { $match: { userid: id } },
      { $group: { _id: null, total: { $sum: "$sum" } } },
    ]);

    res.json({
      first_name: user.first_name,
      last_name: user.last_name,
      id: user.id,
      total: totals[0] ? Number(totals[0].total) : 0,
    });
  }

  async addUser(req, res) {
    await logging.endpointLog("main-server", "ADD_USER", req);
    validation.validateUserPayload(req.body);

    try {
      const user = await User.create({
        id: req.body.id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        birthday: new Date(req.body.birthday),
      });

      res.status(201).json({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        birthday: user.birthday,
      });
    } catch (error) {
      if (error.code === 11000) {
        throw errors.makeError("CONFLICT", "id already exists", 409);
      }
      throw error;
    }
  }
}

module.exports = UsersService;
