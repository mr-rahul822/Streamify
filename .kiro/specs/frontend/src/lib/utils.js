// Capitalize helper
export const capitialize = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1);

// Utility function to get full image URL from backend
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath; // Already a full URL

  const BASE_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:5001"
      : import.meta.env.VITE_API_BASE || "https://streamify-vbs2.onrender.com"; 
      // 👆 fallback Render backend URL

  return `${BASE_URL}${imagePath}`;
};
