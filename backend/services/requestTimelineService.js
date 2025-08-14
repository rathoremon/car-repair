// services/requestTimelineService.js
const { RequestTimeline } = require("../models");
function addTimelineEvent({
  requestId,
  byRole,
  byId,
  event,
  note = null,
  meta = {},
}) {
  return RequestTimeline.create({ requestId, byRole, byId, event, note, meta });
}
module.exports = { addTimelineEvent };
