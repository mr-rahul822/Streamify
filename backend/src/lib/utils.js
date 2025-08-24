// Utility function to convert localhost URLs to relative URLs
export const convertImageUrls = (data) => {
  if (!data) return data;
  
  // If it's a string (single URL)
  if (typeof data === 'string') {
    return data.replace('http://localhost:5001', '').replace('https://localhost:5001', '');
  }
  
  // If it's an object
  if (typeof data === 'object') {
    const converted = Array.isArray(data) ? [] : {};
    
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string' && (value.includes('localhost:5001') || value.includes('uploads/'))) {
        converted[key] = value.replace('http://localhost:5001', '').replace('https://localhost:5001', '');
      } else if (typeof value === 'object') {
        converted[key] = convertImageUrls(value);
      } else {
        converted[key] = value;
      }
    }
    
    return converted;
  }
  
  return data;
};
