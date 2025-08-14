// controllers/serviceRequestController.js
const { Op } = require("sequelize");
const {
  ServiceRequest,
  RequestTimeline,
  Provider,
  Mechanic,
  Vehicle,
  User,
} = require("../models");

const { assert } = require("../services/assert");
const {
  getProviderByUser,
  getMechanicByUser,
  resolveProviderForAdminOrProvider, // ⬅️ NEW helper
} = require("../services/roleService");
const { addTimelineEvent } = require("../services/requestTimelineService");
const {
  emitToUser,
  emitToProvider,
  emitToMechanic,
  emitToRequest,
} = require("../services/socketEmitter");

const STATUS = ServiceRequest.STATUS;

/**
 * Customer: create a service request
 * POST /api/service
 */
exports.createRequest = async (req, res, next) => {
  try {
    const {
      categoryId = null,
      vehicleId = null,
      breakdownType = null,
      location,
      description = null,
      attachments = [],
      providerId = null,
      sosFlag = false,
      estimateAmount = null,
    } = req.body;

    assert(
      location &&
        typeof location.lat === "number" &&
        typeof location.lng === "number",
      400,
      "location.lat and location.lng are required"
    );

    const sr = await ServiceRequest.create({
      userId: req.user.id,
      categoryId,
      vehicleId,
      breakdownType,
      location,
      description,
      attachments,
      providerId,
      estimateAmount,
      status: STATUS.NEW,
      sosFlag: !!sosFlag,
    });

    await addTimelineEvent({
      requestId: sr.id,
      byRole: "customer",
      byId: req.user.id,
      event: "CREATED",
      meta: { providerId, sosFlag },
    });

    if (providerId)
      emitToProvider(providerId, "request:created", { id: sr.id });
    emitToRequest(sr.id, "request:created", { id: sr.id });

    res.status(201).json({ success: true, data: sr });
  } catch (err) {
    next(err);
  }
};

/**
 * Role-aware list (customer/provider/mechanic/admin)
 * GET /api/service
 * ?status=&cursor=&limit=
 */
exports.getRequests = async (req, res, next) => {
  try {
    const { status, cursor, limit = 20 } = req.query;
    const where = {};
    if (status) where.status = status;

    // Scope by role
    if (req.user.role === "customer") {
      where.userId = req.user.id;
    } else if (req.user.role === "provider") {
      const provider = await getProviderByUser(req.user.id);
      assert(provider, 403, "Provider profile not found");
      where.providerId = provider.id;
    } else if (req.user.role === "mechanic") {
      const mechanic = await getMechanicByUser(req.user.id);
      assert(mechanic, 403, "Mechanic profile not found");
      where.mechanicId = mechanic.id;
    } else if (req.user.role === "admin") {
      // no additional filter
    } else {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (cursor) where.createdAt = { [Op.lt]: new Date(cursor) };

    const rows = await ServiceRequest.findAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: Math.min(parseInt(limit, 10) || 20, 100),
      include: [
        {
          model: Vehicle,
          attributes: ["id", "registrationNumber", "displayName"],
        },
        { model: Provider, attributes: ["id", "businessName"] },
        { model: Mechanic, attributes: ["id", "providerId"] },
      ],
    });

    const nextCursor = rows.length ? rows[rows.length - 1].createdAt : null;
    res.json({ success: true, data: rows, nextCursor });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/service/:id
 */
exports.getRequestById = async (req, res, next) => {
  try {
    const sr = await ServiceRequest.findByPk(req.params.id, {
      include: [
        {
          model: Vehicle,
          attributes: ["id", "registrationNumber", "displayName"],
        },
        { model: Provider, attributes: ["id", "businessName"] },
        { model: Mechanic, attributes: ["id", "providerId"] },
        {
          model: RequestTimeline,
          as: "timeline",
          separate: true,
          order: [["createdAt", "ASC"]],
        },
      ],
    });
    assert(sr, 404, "Request not found");

    if (req.user.role === "customer")
      assert(sr.userId === req.user.id, 403, "Forbidden");
    if (req.user.role === "provider") {
      const provider = await getProviderByUser(req.user.id);
      assert(provider && sr.providerId === provider.id, 403, "Forbidden");
    }
    if (req.user.role === "mechanic") {
      const mechanic = await getMechanicByUser(req.user.id);
      assert(mechanic && sr.mechanicId === mechanic.id, 403, "Forbidden");
    }
    // admin can view all

    res.json({ success: true, data: sr });
  } catch (err) {
    next(err);
  }
};

/**
 * Provider/Admin: accept
 * PUT /api/service/:id/accept
 * body: { providerId? } // for admin
 */
exports.acceptRequest = async (req, res, next) => {
  try {
    const sr = await ServiceRequest.findByPk(req.params.id);
    assert(sr, 404, "Request not found");
    assert(sr.canTransitionTo(STATUS.PROVIDER_ACCEPTED), 409, "ILLEGAL_STATE");

    const { provider, providerId } = await resolveProviderForAdminOrProvider({
      req,
      sr,
      bodyProviderId: req.body?.providerId,
      requireExisting: false, // allow admin to attach a provider now
    });

    await sr.update({
      status: STATUS.PROVIDER_ACCEPTED,
      providerId,
    });

    await addTimelineEvent({
      requestId: sr.id,
      byRole: req.user.role === "admin" ? "admin" : "provider",
      byId: req.user.role === "admin" ? req.user.id : provider.id,
      event: "PROVIDER_ACCEPTED",
      meta: { providerId },
    });

    emitToUser(sr.userId, "request:accepted", { id: sr.id });
    emitToRequest(sr.id, "request:accepted", { id: sr.id });
    res.json({ success: true, data: sr });
  } catch (err) {
    next(err);
  }
};

/**
 * Provider/Admin: reject with reason
 * PUT /api/service/:id/reject
 * body: { reason, providerId? } // providerId only for admin if not bound
 */
exports.rejectRequest = async (req, res, next) => {
  try {
    const { reason } = req.body;
    assert(reason && reason.trim(), 400, "Reason is required");

    const sr = await ServiceRequest.findByPk(req.params.id);
    assert(sr, 404, "Request not found");
    assert(sr.canTransitionTo(STATUS.REJECTED), 409, "ILLEGAL_STATE");

    const { providerId } = await resolveProviderForAdminOrProvider({
      req,
      sr,
      bodyProviderId: req.body?.providerId,
      requireExisting: false,
    });

    await sr.update({
      status: STATUS.REJECTED,
      providerId: providerId || sr.providerId,
      cancelReason: reason,
    });

    await addTimelineEvent({
      requestId: sr.id,
      byRole: req.user.role === "admin" ? "admin" : "provider",
      byId: req.user.id,
      event: "REJECTED",
      note: reason,
      meta: { providerId: providerId || sr.providerId },
    });

    emitToUser(sr.userId, "request:rejected", { id: sr.id, reason });
    emitToRequest(sr.id, "request:rejected", { id: sr.id, reason });
    res.json({ success: true, data: sr });
  } catch (err) {
    next(err);
  }
};

/**
 * Provider/Admin: assign mechanic
 * PUT /api/service/:id/assign-mechanic
 * body: { mechanicId, providerId? } // providerId for admin if needed
 */
exports.assignMechanic = async (req, res, next) => {
  try {
    const { mechanicId } = req.body;
    assert(mechanicId, 400, "mechanicId is required");

    const sr = await ServiceRequest.findByPk(req.params.id);
    assert(sr, 404, "Request not found");
    assert(sr.canTransitionTo(STATUS.MECHANIC_ASSIGNED), 409, "ILLEGAL_STATE");

    const mech = await Mechanic.findByPk(mechanicId);
    assert(mech, 404, "Mechanic not found");

    const { providerId } = await resolveProviderForAdminOrProvider({
      req,
      sr,
      bodyProviderId: req.body?.providerId,
      requireExisting: true, // by this step, request should have a provider or be provided explicitly by admin
    });

    // Validate mechanic belongs to provider
    assert(
      mech.providerId === providerId,
      403,
      "Mechanic does not belong to this provider"
    );

    await sr.update({
      status: STATUS.MECHANIC_ASSIGNED,
      mechanicId,
      providerId,
    });

    await addTimelineEvent({
      requestId: sr.id,
      byRole: req.user.role === "admin" ? "admin" : "provider",
      byId: req.user.id,
      event: "MECHANIC_ASSIGNED",
      meta: { mechanicId, providerId },
    });

    emitToMechanic(mechanicId, "request:assigned", { id: sr.id });
    emitToUser(sr.userId, "request:mechanic_assigned", {
      id: sr.id,
      mechanicId,
    });
    emitToRequest(sr.id, "request:mechanic_assigned", {
      id: sr.id,
      mechanicId,
    });

    res.json({ success: true, data: sr });
  } catch (err) {
    next(err);
  }
};

/**
 * Provider/Admin: set/refresh estimate
 * PUT /api/service/:id/estimate
 * body: { amount, providerId? }
 */
exports.setEstimate = async (req, res, next) => {
  try {
    const { amount } = req.body;
    assert(
      amount !== undefined && !isNaN(Number(amount)),
      400,
      "amount is required"
    );

    const sr = await ServiceRequest.findByPk(req.params.id);
    assert(sr, 404, "Request not found");
    assert(
      [STATUS.MECHANIC_ASSIGNED, STATUS.AWAITING_ESTIMATE_APPROVAL].includes(
        sr.status
      ),
      409,
      "ILLEGAL_STATE"
    );

    const { providerId } = await resolveProviderForAdminOrProvider({
      req,
      sr,
      bodyProviderId: req.body?.providerId,
      requireExisting: true,
    });

    await sr.update({
      estimateAmount: amount,
      status: STATUS.AWAITING_ESTIMATE_APPROVAL,
      providerId, // ensure bound
    });

    await addTimelineEvent({
      requestId: sr.id,
      byRole: req.user.role === "admin" ? "admin" : "provider",
      byId: req.user.id,
      event: "ESTIMATE_UPDATED",
      meta: { amount, providerId },
    });

    emitToUser(sr.userId, "request:estimate_updated", { id: sr.id, amount });
    emitToRequest(sr.id, "request:estimate_updated", { id: sr.id, amount });
    res.json({ success: true, data: sr });
  } catch (err) {
    next(err);
  }
};

/**
 * Customer: approve estimate
 * PUT /api/service/:id/estimate/approve
 */
exports.approveEstimate = async (req, res, next) => {
  try {
    const sr = await ServiceRequest.findByPk(req.params.id);
    assert(sr, 404, "Request not found");
    assert(sr.userId === req.user.id, 403, "Only request owner can approve");
    assert(
      sr.status === STATUS.AWAITING_ESTIMATE_APPROVAL,
      409,
      "ILLEGAL_STATE"
    );

    await sr.update({
      status: STATUS.ESTIMATE_APPROVED,
      estimateApprovedAt: new Date(),
    });

    await addTimelineEvent({
      requestId: sr.id,
      byRole: "customer",
      byId: req.user.id,
      event: "ESTIMATE_APPROVED",
      meta: { amount: sr.estimateAmount },
    });

    if (sr.providerId)
      emitToProvider(sr.providerId, "request:estimate_approved", { id: sr.id });
    if (sr.mechanicId)
      emitToMechanic(sr.mechanicId, "request:estimate_approved", { id: sr.id });
    emitToRequest(sr.id, "request:estimate_approved", { id: sr.id });

    res.json({ success: true, data: sr });
  } catch (err) {
    next(err);
  }
};

/**
 * Mechanic/Provider/Admin: update status
 * PUT /api/service/:id/status
 */
exports.updateStatus = async (req, res, next) => {
  try {
    const { toStatus, note = null, meta = {} } = req.body;
    assert(ServiceRequest.isValidStatus(toStatus), 400, "Invalid toStatus");

    const sr = await ServiceRequest.findByPk(req.params.id);
    assert(sr, 404, "Request not found");
    assert(sr.canTransitionTo(toStatus), 409, "ILLEGAL_STATE");

    // Role guards
    if (["EN_ROUTE", "IN_PROGRESS", "COMPLETED"].includes(toStatus)) {
      // mechanic/admin only
      if (req.user.role !== "mechanic" && req.user.role !== "admin") {
        return res.status(403).json({ error: "Forbidden" });
      }
      if (req.user.role === "mechanic") {
        const mech = await getMechanicByUser(req.user.id);
        assert(
          mech && sr.mechanicId === mech.id,
          403,
          "Not the assigned mechanic"
        );
      }
    }
    if (
      [
        "PROVIDER_ACCEPTED",
        "MECHANIC_ASSIGNED",
        "AWAITING_ESTIMATE_APPROVAL",
      ].includes(toStatus)
    ) {
      // provider/admin only
      if (req.user.role !== "provider" && req.user.role !== "admin") {
        return res.status(403).json({ error: "Forbidden" });
      }
      if (req.user.role === "provider") {
        const prov = await getProviderByUser(req.user.id);
        assert(
          prov && sr.providerId === prov.id,
          403,
          "Not the assigned provider"
        );
      }
    }

    const updatePayload = { status: toStatus };
    if (toStatus === STATUS.COMPLETED) updatePayload.completedAt = new Date();

    await sr.update(updatePayload);

    await addTimelineEvent({
      requestId: sr.id,
      byRole: req.user.role,
      byId: req.user.id,
      event: "STATUS_CHANGED",
      note,
      meta: { from: sr._previousDataValues.status, to: toStatus, ...meta },
    });

    emitToRequest(sr.id, "request:status_changed", { id: sr.id, toStatus });
    emitToUser(sr.userId, "request:status_changed", { id: sr.id, toStatus });

    res.json({ success: true, data: sr });
  } catch (err) {
    next(err);
  }
};

/**
 * Add note
 * POST /api/service/:id/notes
 */
exports.addNote = async (req, res, next) => {
  try {
    const { note, attachmentIds = [] } = req.body;
    assert(
      note || (attachmentIds && attachmentIds.length),
      400,
      "note or attachmentIds required"
    );

    await addTimelineEvent({
      requestId: req.params.id,
      byRole: req.user.role,
      byId: req.user.id,
      event: "NOTE_ADDED",
      note,
      meta: { attachmentIds },
    });

    emitToRequest(req.params.id, "request:note_added", { id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/service/:id/timeline
 */
exports.getTimeline = async (req, res, next) => {
  try {
    const items = await RequestTimeline.findAll({
      where: { requestId: req.params.id },
      order: [["createdAt", "ASC"]],
    });
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};
