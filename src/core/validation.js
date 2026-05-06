const errors = require("./errors");

class ValidationService {
  constructor() {
    this.categories = ["food", "health", "housing", "sports", "education"];
  }

  validateUserPayload(body) {
    if (!Number.isInteger(body.id) || body.id <= 0) {
      throw errors.makeError(errors.ids.VALIDATION_ERROR, "id must be a positive integer");
    }
    if (!body.first_name || !body.last_name) {
      throw errors.makeError(errors.ids.VALIDATION_ERROR, "first_name and last_name are required");
    }
    const birthday = new Date(body.birthday);
    if (Number.isNaN(birthday.getTime())) {
      throw errors.makeError(errors.ids.VALIDATION_ERROR, "birthday must be a valid date");
    }
  }

  validateCostPayload(body) {
    if (!Number.isInteger(body.userid) || body.userid <= 0) {
      throw errors.makeError(errors.ids.VALIDATION_ERROR, "userid must be a positive integer");
    }
    if (!body.description) {
      throw errors.makeError(errors.ids.VALIDATION_ERROR, "description is required");
    }
    if (!this.categories.includes(body.category)) {
      throw errors.makeError(errors.ids.VALIDATION_ERROR, "invalid category");
    }
    if (typeof body.sum !== "number" || !Number.isFinite(body.sum) || body.sum < 0) {
      throw errors.makeError(errors.ids.VALIDATION_ERROR, "sum must be a non-negative number");
    }
  }
}

module.exports = new ValidationService();
