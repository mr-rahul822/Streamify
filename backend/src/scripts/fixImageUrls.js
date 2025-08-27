import mongoose from "mongoose";
import "dotenv/config";
import Community from "../Models/Community.js";
import User from "../Models/User.js";

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Function to fix image URLs
const fixImageUrls = async () => {
  try {
    console.log("Starting image URL fix...");

    // ✅ Fix community cover images
    const communities = await Community.find({
      coverImage: { $regex: /localhost:5001/ }
    });

    console.log(`Found ${communities.length} communities with localhost URLs`);

    for (const community of communities) {
      // store only relative path like /uploads/xyz.png
      const fixedUrl = community.coverImage
        .replace("http://localhost:5001", "")
        .replace("https://localhost:5001", "");

      await Community.findByIdAndUpdate(community._id, { coverImage: fixedUrl });
      console.log(`✅ Fixed community ${community._id}`);
    }

    // ✅ Fix user profile pictures
    const users = await User.find({
      profilePic: { $regex: /localhost:5001/ }
    });

    console.log(`Found ${users.length} users with localhost URLs`);

    for (const user of users) {
      const fixedUrl = user.profilePic
        .replace("http://localhost:5001", "")
        .replace("https://localhost:5001", "");

      await User.findByIdAndUpdate(user._id, { profilePic: fixedUrl });
      console.log(`✅ Fixed user ${user._id}`);
    }

    console.log("🎉 Image URL fix completed successfully!");
  } catch (error) {
    console.error("Error fixing image URLs:", error);
  }
};

// Run the migration
const runMigration = async () => {
  await connectDB();
  await fixImageUrls();
  await mongoose.disconnect();
  console.log("Migration completed ✅");
  process.exit(0);
};

runMigration();
