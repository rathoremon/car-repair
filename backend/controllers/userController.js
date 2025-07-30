const { User } = require("../models");

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.update(req.body);

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

exports.markOnboardingComplete = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.onboardingComplete = true;
    await user.save();

    // 🟢 Update provider KYC status if present
    const provider = await user.getProvider(); // assumes User.hasOne(Provider)
    if (provider && provider.kycStatus !== "verified") {
      provider.kycStatus = "pending"; // or "under_review"
      provider.rejectionReason = null; // clear any old reason
      await provider.save();
    }

    res.json({ success: true, message: "Onboarding completed", user });
  } catch (error) {
    console.error("Mark onboarding error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};
