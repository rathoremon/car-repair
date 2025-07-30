const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const errorHandler = require("./middleware/errorHandler");

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Load all route files
const routeModules = [
  "authRoutes",
  "userRoutes",
  "vehicleRoutes",
  "bnplRoutes",
  "fleetRoutes",
  "serviceRoutes",
  "appointmentRoutes",
  "paymentRoutes",
  "notificationRoutes",
  "chatRoutes",
  "trackingRoutes",
  "providerRoutes",
  "mechanicRoutes",
  "inventoryRoutes",
  "assignmentRoutes",
  "slaRoutes",
  "payoutRoutes",
  "offerRoutes",
  "tierPlanRoutes",
  "adminRoutes",
  "auditLogRoutes",
  "subscriptionRoutes",
  "invoiceRoutes",
  "disputeRoutes",
  "promotionRoutes",
  "analyticsRoutes",
  "reconciliationRoutes",
];

routeModules.forEach((route) => {
  app.use(
    `/api/${route.replace("Routes", "").toLowerCase()}`,
    require(`./routes/${route}`)
  );
});

app.use(errorHandler);

module.exports = app;
