const { Mechanic, Provider } = require("../models");

// Add mechanic (Provider only)
exports.addMechanic = async (req, res, next) => {
  try {
    const { name, skillSet, availability } = req.body;
    if (!name || !skillSet)
      return res.status(400).json({ error: "Name and skillSet required" });

    const providerId = req.user.id; // assuming req.user.id is provider's userId
    const provider = await Provider.findOne({ where: { userId: providerId } });
    if (!provider) return res.status(403).json({ error: "Not a provider" });

    const mechanic = await Mechanic.create({
      providerId: provider.id,
      name,
      skillSet,
      availability,
    });

    res.status(201).json({ success: true, data: mechanic });
  } catch (err) {
    next(err);
  }
};

// Get all mechanics for provider
exports.getMechanics = async (req, res, next) => {
  try {
    const providerId = req.user.id;
    const provider = await Provider.findOne({ where: { userId: providerId } });
    if (!provider) return res.status(403).json({ error: "Not a provider" });

    const mechanics = await Mechanic.findAll({
      where: { providerId: provider.id },
      order: [["createdAt", "DESC"]],
    });
    res.json({ success: true, data: mechanics });
  } catch (err) {
    next(err);
  }
};

// Get mechanic by ID
exports.getMechanicById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const mechanic = await Mechanic.findByPk(id);
    if (!mechanic) return res.status(404).json({ error: "Mechanic not found" });
    res.json({ success: true, data: mechanic });
  } catch (err) {
    next(err);
  }
};

// Update mechanic
exports.updateMechanic = async (req, res, next) => {
  try {
    const { id } = req.params;
    const mechanic = await Mechanic.findByPk(id);
    if (!mechanic) return res.status(404).json({ error: "Mechanic not found" });

    await mechanic.update(req.body);
    res.json({ success: true, data: mechanic });
  } catch (err) {
    next(err);
  }
};

// Delete mechanic
exports.deleteMechanic = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Mechanic.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: "Mechanic not found" });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
