export const createCommunity = async (req, res) => {
  try {
    console.log("Uploaded File:", req.file); // 👈 multer file info
    const coverImage = req.file ? `/uploads/${req.file.filename}` : null;

    // ab DB me save kar sakte ho
    res.status(201).json({
      message: "Community created successfully",
      coverImage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
