const { Inventory } = require("../models");

exports.addItem = async (req, res, next) => {
  try {
    const { name, quantity, unitCost, partNumber } = req.body;

    if (!name || quantity === undefined || !unitCost) {
      return res
        .status(400)
        .json({ error: "Missing required inventory fields" });
    }

    const item = await Inventory.create({
      providerId: req.user.id,
      name,
      quantity,
      unitCost,
      partNumber,
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

exports.getItems = async (req, res, next) => {
  try {
    const items = await Inventory.findAll({
      where: { providerId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

exports.updateItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const item = await Inventory.findByPk(id);
    if (!item)
      return res.status(404).json({ error: "Inventory item not found" });

    await item.update(updates);
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

exports.deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await Inventory.destroy({
      where: { id, providerId: req.user.id },
    });
    if (!deleted)
      return res.status(404).json({ error: "Inventory item not found" });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
