// services/socketEmitter.js
// Thin wrapper over your config/socket exports.
const {
  emitToUser,
  emitToProvider,
  emitToMechanic,
  emitToRequest,
} = require("../config/socket");

module.exports = { emitToUser, emitToProvider, emitToMechanic, emitToRequest };
