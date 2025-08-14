// services/assert.js
class HttpError extends Error {
  constructor(status = 400, message = "Validation error", details) {
    super(message);
    this.status = status;
    if (details) this.details = details;
  }
}
const assert = (cond, status = 400, message = "Validation error", details) => {
  if (!cond) throw new HttpError(status, message, details);
};
module.exports = { HttpError, assert };
