// models/ServiceRequest.js
/**
 * Professional, future-proof model using your existing pattern.
 * - Plain sequelize.define
 * - Centralized STATUS + TRANSITIONS helpers
 * - Light validation only
 */
module.exports = (sequelize, DataTypes) => {
  const STATUS = {
    NEW: "NEW",
    PROVIDER_ACCEPTED: "PROVIDER_ACCEPTED",
    REJECTED: "REJECTED",
    MECHANIC_ASSIGNED: "MECHANIC_ASSIGNED",
    AWAITING_ESTIMATE_APPROVAL: "AWAITING_ESTIMATE_APPROVAL",
    ESTIMATE_APPROVED: "ESTIMATE_APPROVED",
    EN_ROUTE: "EN_ROUTE",
    IN_PROGRESS: "IN_PROGRESS",
    COMPLETED: "COMPLETED",
    CANCELLED: "CANCELLED",
  };

  const TRANSITIONS = {
    [STATUS.NEW]: [STATUS.PROVIDER_ACCEPTED, STATUS.REJECTED, STATUS.CANCELLED],
    [STATUS.PROVIDER_ACCEPTED]: [STATUS.MECHANIC_ASSIGNED, STATUS.CANCELLED],
    [STATUS.MECHANIC_ASSIGNED]: [
      STATUS.AWAITING_ESTIMATE_APPROVAL,
      STATUS.CANCELLED,
    ],
    [STATUS.AWAITING_ESTIMATE_APPROVAL]: [
      STATUS.ESTIMATE_APPROVED,
      STATUS.CANCELLED,
    ],
    [STATUS.ESTIMATE_APPROVED]: [STATUS.EN_ROUTE, STATUS.CANCELLED],
    [STATUS.EN_ROUTE]: [STATUS.IN_PROGRESS, STATUS.CANCELLED],
    [STATUS.IN_PROGRESS]: [STATUS.COMPLETED, STATUS.CANCELLED],
    [STATUS.REJECTED]: [],
    [STATUS.COMPLETED]: [],
    [STATUS.CANCELLED]: [],
  };

  const ServiceRequest = sequelize.define(
    "ServiceRequest",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      // Ownership
      userId: { type: DataTypes.UUID, allowNull: false },

      // Optional links
      providerId: { type: DataTypes.UUID, allowNull: true },
      mechanicId: { type: DataTypes.UUID, allowNull: true },
      categoryId: { type: DataTypes.UUID, allowNull: true },
      vehicleId: { type: DataTypes.UUID, allowNull: true },

      // Legacy + descriptive
      breakdownType: { type: DataTypes.STRING, allowNull: true },

      // Location payload
      location: {
        type: DataTypes.JSONB,
        allowNull: false,
        validate: {
          hasLatLng(value) {
            if (
              !value ||
              typeof value.lat !== "number" ||
              typeof value.lng !== "number"
            ) {
              throw new Error("location must include numeric lat & lng");
            }
          },
        },
      },

      description: { type: DataTypes.TEXT, allowNull: true },

      attachments: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },

      estimateAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
      estimateApprovedAt: { type: DataTypes.DATE, allowNull: true },

      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: STATUS.NEW,
        validate: { isIn: [Object.values(STATUS)] },
      },

      completedAt: { type: DataTypes.DATE, allowNull: true },
      cancelReason: { type: DataTypes.TEXT, allowNull: true },

      sosFlag: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "ServiceRequests",
    }
  );

  // Static helpers
  ServiceRequest.STATUS = STATUS;
  ServiceRequest.TRANSITIONS = TRANSITIONS;
  ServiceRequest.isValidStatus = (s) => Object.values(STATUS).includes(s);
  ServiceRequest.isTransitionAllowed = (from, to) =>
    (TRANSITIONS[from] || []).includes(to);

  // Instance helper
  ServiceRequest.prototype.canTransitionTo = function (to) {
    return ServiceRequest.isTransitionAllowed(this.status, to);
  };

  return ServiceRequest;
};
