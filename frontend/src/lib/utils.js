export const capitialize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Utility function to get full image URL from backend
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath; // Already a full URL
  return `http://localhost:5001${imagePath}`; // Prepend backend URL
};