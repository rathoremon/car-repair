const { Appointment, ServiceRequest } = require("../models");

exports.bookAppointment = async (req, res, next) => {
  try {
    const { serviceRequestId, date, timeSlot, serviceType } = req.body;

    const existingRequest = await ServiceRequest.findByPk(serviceRequestId);
    if (!existingRequest)
      return res.status(404).json({ error: "Service request not found" });

    const appointment = await Appointment.create({
      serviceRequestId,
      date,
      timeSlot,
      serviceType,
    });
    res.status(201).json({ success: true, data: appointment });
  } catch (err) {
    next(err);
  }
};

exports.getAppointmentsByRequest = async (req, res, next) => {
  try {
    const { serviceRequestId } = req.params;
    const appointments = await Appointment.findAll({
      where: { serviceRequestId },
    });
    res.status(200).json({ success: true, data: appointments });
  } catch (err) {
    next(err);
  }
};
