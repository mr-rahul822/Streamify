// Capitalize helper
export const capitialize = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1);

// Utility function to get full image URL from backend
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (typeof imagePath !== "string") return null;

  // If already absolute
  if (/^https?:\/\//i.test(imagePath)) return imagePath;

  // Ensure leading slash for server static route
  let path = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;

  // Derive base URL consistently between dev/prod and envs
  const envBase = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE;
  let base = import.meta.env.MODE === "development" ? "http://localhost:5001" : (envBase || "https://streamify-vbs2.onrender.com");

  // If provided base includes /api, strip it for static assets
  if (base.endsWith("/api")) base = base.slice(0, -4);

  // Avoid double slashes when concatenating
  if (base.endsWith("/")) base = base.slice(0, -1);

  return `${base}${path}`;
};
