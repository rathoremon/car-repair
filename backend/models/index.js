const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./User")(sequelize, Sequelize);
db.Vehicle = require("./Vehicle")(sequelize, Sequelize);
db.Appointment = require("./Appointment")(sequelize, Sequelize);
db.ServiceRequest = require("./ServiceRequest")(sequelize, Sequelize);
db.Payment = require("./Payment")(sequelize, Sequelize);
db.Chat = require("./Chat")(sequelize, Sequelize);
db.Notification = require("./Notification")(sequelize, Sequelize);
db.BNPLRequest = require("./BNPLRequest")(sequelize, Sequelize);
db.Provider = require("./Provider")(sequelize, Sequelize);
db.Mechanic = require("./Mechanic")(sequelize, Sequelize);
db.Inventory = require("./Inventory")(sequelize, Sequelize);
db.Assignment = require("./Assignment")(sequelize, Sequelize);
db.SLALog = require("./slaLog")(sequelize, Sequelize);
db.Payout = require("./payout")(sequelize, Sequelize);
db.Offer = require("./offer")(sequelize, Sequelize);
db.TierPlan = require("./tierPlan")(sequelize, Sequelize);
db.AdminUser = require("./adminUser")(sequelize, Sequelize);
db.AuditLog = require("./auditLog")(sequelize, Sequelize);
db.SubscriptionPlan = require("./subscriptionPlan")(sequelize, Sequelize);
db.Dispute = require("./dispute")(sequelize, Sequelize);
db.Promotion = require("./promotion")(sequelize, Sequelize);
db.DynamicPricingRule = require("./dynamicPricingRule")(sequelize, Sequelize);
db.Ticket = require("./ticket")(sequelize, Sequelize);
db.CrossSellAd = require("./crossSellAd")(sequelize, Sequelize);
db.AnalyticsRecord = require("./analyticsRecord")(sequelize, Sequelize);
db.Invoice = require("./Invoice")(sequelize, Sequelize);
db.Document = require("./Document")(sequelize, Sequelize);
db.ServiceCategory = require("./serviceCategory")(sequelize, Sequelize);
db.Skill = require("./Skill")(sequelize, Sequelize);
db.RequestTimeline = require("./RequestTimeline")(sequelize, Sequelize);

// ===== User associations (no change) =====
db.User.hasOne(db.Provider, { foreignKey: "userId" });
db.Provider.belongsTo(db.User, { foreignKey: "userId" });

db.User.hasOne(db.Mechanic, { foreignKey: "userId" });
db.Mechanic.belongsTo(db.User, { foreignKey: "userId" });

db.User.hasOne(db.AdminUser, { foreignKey: "userId" });
db.AdminUser.belongsTo(db.User, { foreignKey: "userId" });

db.User.hasMany(db.Vehicle, { foreignKey: "userId" });
db.Vehicle.belongsTo(db.User, { foreignKey: "userId" });

db.User.hasMany(db.BNPLRequest, { foreignKey: "userId" });
db.BNPLRequest.belongsTo(db.User, { foreignKey: "userId" });

db.User.hasMany(db.Payment, { foreignKey: "userId" });
db.Payment.belongsTo(db.User, { foreignKey: "userId" });

// ===== Provider associations (no change) =====
db.Provider.hasMany(db.Mechanic, { foreignKey: "providerId" });
db.Mechanic.belongsTo(db.Provider, { foreignKey: "providerId" });

db.User.hasMany(db.ServiceRequest, { foreignKey: "userId" });
db.ServiceRequest.belongsTo(db.User, { foreignKey: "userId" });

db.Provider.hasMany(db.ServiceRequest, { foreignKey: "providerId" });
db.ServiceRequest.belongsTo(db.Provider, { foreignKey: "providerId" });

db.Mechanic.hasMany(db.ServiceRequest, { foreignKey: "mechanicId" });
db.ServiceRequest.belongsTo(db.Mechanic, { foreignKey: "mechanicId" });

db.ServiceCategory.hasMany(db.ServiceRequest, { foreignKey: "categoryId" });
db.ServiceRequest.belongsTo(db.ServiceCategory, { foreignKey: "categoryId" });

db.Vehicle.hasMany(db.ServiceRequest, { foreignKey: "vehicleId" });
db.ServiceRequest.belongsTo(db.Vehicle, { foreignKey: "vehicleId" });

db.ServiceRequest.hasOne(db.Appointment, { foreignKey: "serviceRequestId" });
db.Appointment.belongsTo(db.ServiceRequest, { foreignKey: "serviceRequestId" });

db.User.hasMany(db.Document, { foreignKey: "userId" });
db.Document.belongsTo(db.User, { foreignKey: "userId" });

db.Provider.hasMany(db.Document, { foreignKey: "providerId" });
db.Document.belongsTo(db.Provider, { foreignKey: "providerId" });

// ====== NEW: ServiceCategory <-> Skill (Many-to-Many) ======
db.ServiceCategory.belongsToMany(db.Skill, {
  through: "ServiceCategorySkill",
  foreignKey: "serviceCategoryId",
  otherKey: "skillId",
  as: "skills",
});
db.Skill.belongsToMany(db.ServiceCategory, {
  through: "ServiceCategorySkill",
  foreignKey: "skillId",
  otherKey: "serviceCategoryId",
  as: "categories",
});

db.ServiceRequest.hasMany(db.RequestTimeline, {
  foreignKey: "requestId",
  as: "timeline",
});
db.RequestTimeline.belongsTo(db.ServiceRequest, { foreignKey: "requestId" });

module.exports = db;
