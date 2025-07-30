const DEFAULT_BASE_URL =
  import.meta.env.VITE_MECHANIQ_BACKEND_URL || "http://localhost:5000";

export function getPhotoUrl(photoPath) {
  if (!photoPath) return "";
  if (/^https?:\/\//.test(photoPath)) return photoPath;
  let cleaned = photoPath.replace(/\\/g, "/");
  if (cleaned.startsWith("/")) cleaned = cleaned.substring(1);
  return `${DEFAULT_BASE_URL}/${cleaned}`;
}
