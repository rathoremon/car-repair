const { User, Provider } = require("../models");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const secret = process.env.JWT_SECRET || config.jwtSecret;
    const decoded = jwt.verify(token, secret);

    // Attach user info
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.user = {
      id: user.id,
      role: user.role,
      isOtpVerified: user.isOtpVerified,
      onboardingComplete: user.onboardingComplete,
    };

    // If provider, attach providerId
    if (user.role === "provider") {
      const provider = await Provider.findOne({ where: { userId: user.id } });
      if (provider) req.user.providerId = provider.id;
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
