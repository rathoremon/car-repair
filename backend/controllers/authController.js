const { User, Provider, Mechanic } = require("../models");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const admin = require("../config/firebaseAdmin");
const bcrypt = require("bcrypt");

// Helper: fetch provider details for a user
async function getProviderDetails(userId) {
  let provider = await Provider.findOne({ where: { userId } });
  if (!provider) {
    // Defensive: ensure provider record exists for legacy/fresh
    provider = await Provider.create({
      userId,
      kycStatus: "pending",
      status: "pending",
    });
  }
  return provider;
}

// Register (Customer or Provider)
exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body;
    if (!name || !phone || !password)
      return res.status(400).json({ error: "Missing required fields" });

    if (!["customer", "provider"].includes(role))
      return res.status(400).json({ error: "Invalid role" });

    const existing = await User.findOne({ where: { phone } });
    if (existing)
      return res.status(409).json({ error: "Phone already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      phone,
      password: hashed,
      role,
      isOtpVerified: false,
      otpVerifiedAt: null,
      onboardingComplete: false,
    });

    // If provider, create Provider record with pending status
    let providerData = null;
    if (role === "provider") {
      providerData = await Provider.create({
        userId: user.id,
        kycStatus: "pending",
        status: "pending",
      });
    }

    // Return minimal user + provider
    res.status(201).json({
      success: true,
      data: {
        ...user.toJSON(),
        provider: providerData ? providerData.toJSON() : undefined,
      },
      next: "verify-otp",
    });
  } catch (err) {
    next(err);
  }
};

// Login (Customer, Provider, Mechanic)
exports.login = async (req, res, next) => {
  try {
    let { phone, email, password } = req.body;

    if (!password || (!phone && !email))
      return res.status(400).json({ error: "Missing credentials" });

    // Normalize phone
    if (phone) {
      phone = phone.replace(/\D/g, "");
      if (!phone.startsWith("91")) phone = "91" + phone;
      phone = "+" + phone;
    }

    // Fetch user
    const user = await User.findOne({
      where: phone ? { phone } : { email },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    // Compare password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid password" });

    const secret = process.env.JWT_SECRET || config.jwtSecret;

    // Get provider & mechanic profile
    const [provider, mechanic] = await Promise.all([
      Provider.findOne({ where: { userId: user.id } }),
      Mechanic.findOne({ where: { userId: user.id } }),
    ]);

    const hasProviderProfile = !!provider;
    const hasMechanicProfile = !!mechanic;

    // OTP verification check
    const now = new Date();
    const lastVerified = user.otpVerifiedAt
      ? new Date(user.otpVerifiedAt)
      : null;
    const otpExpired =
      !user.isOtpVerified ||
      !lastVerified ||
      lastVerified.toDateString() !== now.toDateString();

    // Self-mechanic check
    const isSelfMechanic =
      mechanic &&
      mechanic.userId === user.id &&
      mechanic.providerId === user.providerId;

    const isFirstTimeMechanic =
      !!mechanic &&
      !isSelfMechanic &&
      user.role === "mechanic" &&
      user.updatedAt.getTime() === user.createdAt.getTime(); // implies never changed password

    // Sign token
    const token = jwt.sign({ id: user.id, role: user.role }, secret, {
      expiresIn: "1d",
    });

    // Build response
    const responseUser = {
      ...user.toJSON(),
      provider: provider ? provider.toJSON() : undefined,
      hasProviderProfile,
      hasMechanicProfile,
      requiresPasswordReset: isFirstTimeMechanic && !isSelfMechanic,
    };

    // 🔐 Mechanic OTP logic
    if (user.role === "mechanic") {
      if (!mechanic) {
        return res.status(400).json({ error: "No mechanic profile found" });
      }

      if (otpExpired) {
        user.isOtpVerified = false;
        user.otpVerifiedAt = null;
        await user.save();

        return res.status(200).json({
          success: true,
          token,
          user: responseUser,
          next:
            isFirstTimeMechanic && !isSelfMechanic
              ? "set-password"
              : "verify-otp",
        });
      }
    }

    // 🔐 Provider OTP expired
    if (user.role === "provider" && otpExpired) {
      user.isOtpVerified = false;
      user.otpVerifiedAt = null;
      await user.save();

      return res.status(200).json({
        success: true,
        token,
        user: responseUser,
        next: "verify-otp",
      });
    }

    // 🔁 Dual-role handling
    if (hasMechanicProfile && hasProviderProfile) {
      return res.status(200).json({
        success: true,
        token,
        user: responseUser,
        next: "select-role",
      });
    }

    // ✅ Default successful login
    return res.status(200).json({
      success: true,
      token,
      user: responseUser,
      next:
        user.role === "customer"
          ? "customer"
          : user.role === "admin"
          ? "admin"
          : user.role === "provider"
          ? "provider"
          : user.role === "mechanic"
          ? "mechanic"
          : null,
    });
  } catch (err) {
    console.error("Login error:", err);
    next(err);
  }
};

// OTP Verification
// ✅ Enhanced OTP verification logic
exports.verifyOtp = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ error: "Missing idToken" });

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const phoneNumber = decodedToken.phone_number;
    if (!phoneNumber)
      return res.status(400).json({ error: "Phone number not found in token" });

    let user = await User.findOne({ where: { phone: phoneNumber } });
    if (!user) return res.status(404).json({ error: "User not found" });

    user.isOtpVerified = true;
    user.otpVerifiedAt = new Date();
    await user.save();

    const [provider, mechanic] = await Promise.all([
      Provider.findOne({ where: { userId: user.id } }),
      Mechanic.findOne({ where: { userId: user.id } }),
    ]);

    const isSelfMechanic =
      mechanic &&
      mechanic.userId === user.id &&
      mechanic.providerId === user.providerId;

    const isFirstTimeMechanic =
      mechanic &&
      user.role === "mechanic" &&
      !isSelfMechanic &&
      mechanic.createdAt.getTime() === mechanic.updatedAt.getTime();

    const responseUser = {
      ...user.toJSON(),
      provider: provider ? provider.toJSON() : undefined,
      hasProviderProfile: !!provider,
      hasMechanicProfile: !!mechanic,
      requiresPasswordReset: isFirstTimeMechanic,
    };

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    let nextStep;
    if (isFirstTimeMechanic && !isSelfMechanic) {
      nextStep = "set-password";
    } else if (user.role === "provider") {
      nextStep = "provider";
    } else if (user.role === "mechanic") {
      nextStep = "mechanic";
    } else if (user.role === "customer") {
      nextStep = "customer";
    } else if (user.role === "admin") {
      nextStep = "admin";
    } else {
      nextStep = null;
    }

    return res.status(200).json({
      success: true,
      token,
      user: responseUser,
      next: nextStep,
    });
  } catch (err) {
    console.error("verifyOtp error:", err);
    next(err);
  }
};

// ✅ Enhanced current user getter logic
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const [provider, mechanic] = await Promise.all([
      Provider.findOne({ where: { userId: user.id } }),
      Mechanic.findOne({ where: { userId: user.id } }),
    ]);

    const isSelfMechanic =
      mechanic &&
      mechanic.userId === user.id &&
      mechanic.providerId === user.providerId;

    const isFirstTimeMechanic =
      mechanic &&
      user.role === "mechanic" &&
      !isSelfMechanic &&
      mechanic.createdAt.getTime() === mechanic.updatedAt.getTime();

    const responseUser = {
      ...user.toJSON(),
      provider: provider ? provider.toJSON() : undefined,
      hasProviderProfile: !!provider,
      hasMechanicProfile: !!mechanic,
      requiresPasswordReset: isFirstTimeMechanic,
    };

    res.status(200).json({
      success: true,
      user: responseUser,
    });
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.setNewPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: "Password required" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const target = req.query.target;

    if (target === "mechanic") {
      if (user.role !== "mechanic") {
        return res.status(403).json({ error: "User is not a mechanic" });
      }

      // ✅ Save password directly to user
      user.password = hashed;
      user.requiresPasswordReset = false;
      await user.save();
    } else {
      user.password = hashed;
      user.requiresPasswordReset = false;
      await user.save();
    }

    return res.json({ success: true, message: "Password updated" });
  } catch (err) {
    next(err);
  }
};
