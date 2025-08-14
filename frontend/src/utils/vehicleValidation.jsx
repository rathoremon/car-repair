export const REG_NO_REGEX = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;
export const FUEL_TYPES = [
  "Petrol",
  "Diesel",
  "Electric",
  "Hybrid",
  "CNG",
  "LPG",
];

export function validateVehicleCore(v) {
  const errors = {};
  const now = new Date().getFullYear();
  if (!v.make) errors.make = "Make is required";
  if (!v.model) errors.model = "Model is required";
  if (!v.year) errors.year = "Year is required";
  else if (+v.year < 1980 || +v.year > now + 1)
    errors.year = `Year must be 1980–${now + 1}`;
  if (!v.registrationNumber)
    errors.registrationNumber = "Registration number is required";
  else if (!REG_NO_REGEX.test(String(v.registrationNumber).toUpperCase()))
    errors.registrationNumber = "Format: AA00AA0000";
  if (!v.fuelType) errors.fuelType = "Fuel type is required";
  return errors;
}
