const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const errorHandler = require("./middleware/errorHandler");
const path = require("path");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    optionsSuccessStatus: 200,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(morgan("dev"));

// All API route modules
const routeModules = [
  "authRoutes",
  "userRoutes",
  "vehiclesRoutes",
  "bnplRoutes",
  "fleetRoutes",
  "serviceRoutes",
  "appointmentRoutes",
  "paymentRoutes",
  "notificationRoutes",
  "chatRoutes",
  "trackingRoutes",
  "ServiceCategoriesRoutes",
  "provider/mechanics",
  "providerRoutes",
  "promotionRoutes",
  // "mechanicRoutes",
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
  "adminPromotionRoutes",
  "analyticsRoutes",
  "reconciliationRoutes",
  "documentRoutes", // ⬅️ Moved here
  "adminServiceCategoriesRoutes",
  "skillsRoutes", // ✅ Newly added
];

routeModules.forEach((route) => {
  const routeHandler = require(`./routes/${route}`);

  // NEW MOUNTING LOGIC
  let baseRoute = route.replace("Routes", "");

  // If route starts with admin, mount under /api/admin/
  if (baseRoute.toLowerCase().startsWith("admin")) {
    baseRoute = `/api/admin/${baseRoute
      .replace(/^admin/i, "")
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .toLowerCase()}`;
  } else {
    baseRoute = `/api/${baseRoute
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .toLowerCase()}`;
  }

  console.log("✅ Mounting route:", baseRoute);
  app.use(baseRoute, routeHandler);
});

app.use(errorHandler);

module.exports = app;
