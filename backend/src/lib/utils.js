// Utility function to convert localhost URLs to relative URLs
export const convertImageUrls = (data) => {
  try {
    if (!data) return data;
    
    // Convert Mongoose documents to plain objects to avoid circular references
    if (data && typeof data === 'object' && data.toObject) {
      data = data.toObject();
    }
    
    // If it's a string (single URL)
    if (typeof data === 'string') {
      return data.replace('http://localhost:5001', '').replace('https://localhost:5001', '');
    }
    
    // If it's an object or array
    if (typeof data === 'object' && data !== null) {
      // Handle arrays
      if (Array.isArray(data)) {
        return data.map(item => {
          // Convert Mongoose documents in arrays
          if (item && typeof item === 'object' && item.toObject) {
            item = item.toObject();
          }
          return convertImageUrls(item);
        });
      }
      
      // Handle objects
      const converted = {};
      
      for (const [key, value] of Object.entries(data)) {
        try {
          // Skip Mongoose internal properties
          if (key.startsWith('$') || key.startsWith('_') && key !== '_id') {
            continue;
          }
          
          if (typeof value === 'string' && (value.includes('localhost:5001') || value.includes('uploads/'))) {
            converted[key] = value.replace('http://localhost:5001', '').replace('https://localhost:5001', '');
          } else if (typeof value === 'object' && value !== null) {
            // Convert Mongoose documents
            if (value.toObject) {
              converted[key] = convertImageUrls(value.toObject());
            } else {
              converted[key] = convertImageUrls(value);
            }
          } else {
            converted[key] = value;
          }
        } catch (err) {
          console.warn(`Error processing key ${key}:`, err);
          converted[key] = value; // Keep original value if processing fails
        }
      }
      
      return converted;
    }
    
    return data;
  } catch (error) {
    console.error('Error in convertImageUrls:', error);
    return data; // Return original data if conversion fails
  }
};

// Helper function to convert image URLs in a more targeted way
export const convertImageUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  return url.replace('http://localhost:5001', '').replace('https://localhost:5001', '');
};
