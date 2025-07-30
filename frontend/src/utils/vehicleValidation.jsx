export function validateVehicle(vehicle) {
  const errors = {};
  if (!vehicle.make) errors.make = "Make is required";
  if (!vehicle.model) errors.model = "Model is required";
  if (!vehicle.year) errors.year = "Year is required";
  if (!vehicle.registrationNumber) {
    errors.registrationNumber = "Registration number is required";
  } else if (
    !/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/.test(vehicle.registrationNumber)
  ) {
    errors.registrationNumber = "Format: AA00AA0000";
  }
  if (!vehicle.fuelType) errors.fuelType = "Fuel type is required";
  return errors;
}
