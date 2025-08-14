// src/utils/media.jsx

const ensureSlash = (s = "") => (s.endsWith("/") ? s : `${s}/`);

export const DOCUMENTS_BASE_URL = ensureSlash(
  import.meta?.env?.VITE_DOCUMENTS_URL ||
    "http://localhost:5000/uploads/documents/"
);

export const PLACEHOLDER_IMAGE = "/placeholder-image.png";

// cross-platform safe filename extractor
export const getFileName = (path = "") =>
  (path ? path.split(/[\\/]/).pop() : "") || "";

// quick absolute URL check (http/https/blob/data)
export const isAbsoluteUrl = (u = "") =>
  /^https?:\/\//i.test(u) || /^blob:/i.test(u) || /^data:/i.test(u);

// build full URL to a stored doc by filePath
export const buildDocUrl = (filePath = "") => {
  const file = getFileName(filePath);
  return file ? `${DOCUMENTS_BASE_URL}${file}` : "";
};
export const buildDocumentUrl = buildDocUrl; // alias for backward-compat

// basic type guards
export const isImage = (nameOrPath = "") =>
  /\.(jpe?g|png|webp|gif)$/i.test(nameOrPath);
export const isPDF = (nameOrPath = "") => /\.pdf$/i.test(nameOrPath);

// robust resolver for images used across your app
// accepts: string (absolute URL or filePath) or object
// object can contain: previewUrl | filePath | url | photoUrl
export const getImageUrl = (input) => {
  if (!input) return PLACEHOLDER_IMAGE;

  if (typeof input === "string") {
    if (isAbsoluteUrl(input)) return input;
    return buildDocUrl(input);
  }

  // object-like
  if (input.previewUrl) return input.previewUrl;
  if (input.filePath) return buildDocUrl(input.filePath);
  if (input.url)
    return isAbsoluteUrl(input.url) ? input.url : buildDocUrl(input.url);
  if (input.photoUrl)
    return isAbsoluteUrl(input.photoUrl)
      ? input.photoUrl
      : buildDocUrl(input.photoUrl);

  return PLACEHOLDER_IMAGE;
};

// specific helper for vehicles (since your data sometimes uses `photoUrl` or `vehiclePhotoUrl`)
export const getVehiclePhotoUrl = (vehicle = {}) =>
  getImageUrl(vehicle?.photoUrl || vehicle?.vehiclePhotoUrl || "");
