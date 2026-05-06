class ErrorService {
  constructor() {
    this.ids = Object.freeze({
      VALIDATION_ERROR: "VALIDATION_ERROR",
      NOT_FOUND: "NOT_FOUND",
      CONFLICT: "CONFLICT",
      INTERNAL_ERROR: "INTERNAL_ERROR",
    });
  }

  makeError(id, message, status = 400) {
    const error = new Error(message);
    error.id = id;
    error.status = status;
    return error;
  }
}

module.exports = new ErrorService();
