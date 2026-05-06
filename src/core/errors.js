class ErrorService {
  makeError(id, message, status = 400) {
    const error = new Error(message);
    error.id = id;
    error.status = status;
    return error;
  }
}

module.exports = new ErrorService();
