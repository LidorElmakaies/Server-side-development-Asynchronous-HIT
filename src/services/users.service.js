const User = require("../../models/user.model");
const Cost = require("../../models/cost.model");
const errors = require("../core/errors");
const logging = require("../core/logging");
const validation = require("../core/validation");
const SERVICE_NAME = process.env.SERVICE_NAME || "unknown-service";

class UsersService {
  async listUsers(req, res) {
    await logging.endpointLog(SERVICE_NAME, "GET_USERS", req);
    const users = await User.listUsers();
    res.json(users);
  }

  async getUserDetails(req, res) {
    await logging.endpointLog(SERVICE_NAME, "GET_USER_DETAILS", req);
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw errors.makeError(
        errors.ids.VALIDATION_ERROR,
        "id must be a positive integer",
      );
    }

    const user = await User.findByBusinessId(id);
    if (!user) {
      throw errors.makeError(errors.ids.NOT_FOUND, "user not found", 404);
    }

    const total = await Cost.sumByUserId(id);

    res.json({
      first_name: user.first_name,
      last_name: user.last_name,
      id: user.id,
      total,
    });
  }

  async addUser(req, res) {
    await logging.endpointLog(SERVICE_NAME, "ADD_USER", req);
    validation.validateUserPayload(req.body);

    try {
      const user = await User.createUser({
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
        throw errors.makeError(errors.ids.CONFLICT, "id already exists", 409);
      }
      throw error;
    }
  }
}

module.exports = UsersService;
