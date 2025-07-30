const { Assignment, ServiceRequest, Mechanic } = require("../models");

exports.createAssignment = async (req, res, next) => {
  try {
    const { mechanicId, serviceRequestId, status } = req.body;

    const mechanic = await Mechanic.findByPk(mechanicId);
    if (!mechanic) return res.status(404).json({ error: "Mechanic not found" });

    const request = await ServiceRequest.findByPk(serviceRequestId);
    if (!request)
      return res.status(404).json({ error: "Service request not found" });

    const assignment = await Assignment.create({
      mechanicId,
      serviceRequestId,
      status: status || "assigned",
    });
    res.status(201).json({ success: true, data: assignment });
  } catch (err) {
    next(err);
  }
};

exports.getAssignments = async (req, res, next) => {
  try {
    const mechanicId = req.user.id;
    const assignments = await Assignment.findAll({ where: { mechanicId } });
    res.status(200).json({ success: true, data: assignments });
  } catch (err) {
    next(err);
  }
};

exports.updateAssignmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const assignment = await Assignment.findByPk(id);
    if (!assignment || assignment.mechanicId !== req.user.id)
      return res.status(404).json({ error: "Assignment not found" });

    assignment.status = status;
    await assignment.save();
    res.json({ success: true, data: assignment });
  } catch (err) {
    next(err);
  }
};
