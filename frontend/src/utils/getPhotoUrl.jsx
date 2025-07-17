// Set your backend base URL for uploads (should end with a slash)
const DEFAULT_BASE_URL =
  import.meta.env.VITE_MECHANIQ_BACKEND_URL || "http://localhost:5000";

export function getPhotoUrl(photoPath) {
  if (!photoPath) return ""; // nothing to show
  // If it's already absolute (starts with http), return as is
  if (/^https?:\/\//.test(photoPath)) return photoPath;
  // Remove double slashes if present
  let cleaned = photoPath.replace(/\\/g, "/");
  if (cleaned.startsWith("/")) cleaned = cleaned.substring(1);
  return `${DEFAULT_BASE_URL}/${cleaned}`;
}
