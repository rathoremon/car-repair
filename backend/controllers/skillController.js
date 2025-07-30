// controllers/skillController.js
const { Skill } = require("../models");
exports.getAllSkills = async (req, res) => {
  const skills = await Skill.findAll({
    where: { status: "active" },
    order: [["name", "ASC"]],
  });
  res.json({ data: skills });
};
