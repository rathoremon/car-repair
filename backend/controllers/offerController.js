const { Offer } = require("../models");

exports.createOffer = async (req, res, next) => {
  try {
    const { title, description, discount, validUntil } = req.body;

    if (!title || !discount) {
      return res.status(400).json({ error: "Title and discount are required" });
    }

    const offer = await Offer.create({
      providerId: req.user.id,
      title,
      description,
      discount,
      validUntil,
    });

    res.status(201).json({ success: true, data: offer });
  } catch (error) {
    next(error);
  }
};

exports.getOffers = async (req, res, next) => {
  try {
    const offers = await Offer.findAll({
      where: { providerId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, data: offers });
  } catch (error) {
    next(error);
  }
};

exports.updateOffer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const offer = await Offer.findByPk(id);

    if (!offer || offer.providerId !== req.user.id) {
      return res.status(404).json({ error: "Offer not found or unauthorized" });
    }

    await offer.update(req.body);
    res.status(200).json({ success: true, data: offer });
  } catch (error) {
    next(error);
  }
};
