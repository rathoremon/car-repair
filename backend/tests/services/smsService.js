// Example placeholder (e.g. Twilio can be plugged in)
exports.sendSMS = async ({ to, message }) => {
  console.log(`Sending SMS to ${to}: ${message}`);
  return true;
};
