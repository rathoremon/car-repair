// middlewares/authMiddleware.js

exports.authenticateUser = (req, res, next) => {
  // JWT check logic here
  next();
};

exports.requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized" });
  }
  next();
};
