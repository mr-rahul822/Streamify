import Community from "../Models/Community.js";
import User from "../Models/User.js";
import { StreamChat } from "stream-chat";
import { convertImageUrls, convertImageUrl } from "../lib/utils.js";


const serverClient = StreamChat.getInstance(process.env.STREAM_API_KEY, process.env.STREAM_API_SECRET);
// ✅ Create Community
export const createCommunity = async (req, res) => {
  try {
    const { name, description, tags, isPrivate } = req.body;

    // agar file aayi hai multer se
    let coverImageUrl = null;
    if (req.file) {
      // Use relative path for production compatibility
      coverImageUrl = `/uploads/${req.file.filename}`;
    }

    // create Stream channel
    const streamChannelId = `community-${Date.now()}`;
    console.log("Creating Stream channel with ID:", streamChannelId);
    const channel = serverClient.channel("team", streamChannelId, {
      name,
      created_by: { id: req.user._id.toString() },
    });
    await channel.create();
    console.log("Stream channel created successfully");

    // save in DB
    const community = await Community.create({
      name,
      description,
      ownerId: req.user._id,
      members: [req.user._id],
      moderators: [req.user._id],
      streamChannelId,
      tags,
      coverImage: coverImageUrl, // 👈 multer ka URL use kiya
      isPrivate,
    });

    // update user
    await User.findByIdAndUpdate(req.user._id, {
      $push: { joinedCommunities: community._id },
    });

    res.status(201).json(convertImageUrls(community));
  } catch (error) {
    console.error("Error creating community:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Join Community
export const joinCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const community = await Community.findById(id);

    if (!community) return res.status(404).json({ message: "Community not found" });

    // Add to DB if not already a member
    if (!community.members.includes(req.user._id)) {
      community.members.push(req.user._id);
      await community.save();

      await User.findByIdAndUpdate(req.user._id, { $push: { joinedCommunities: id } });

      // Add to Stream channel
      const channel = serverClient.channel("team", community.streamChannelId);
      await channel.addMembers([req.user._id.toString()]);
    }

    res.json({ message: "Joined community", community: convertImageUrls(community) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const joinCommunityChannel = async (req, res) => {
  try {
    const channelId = req.params.id; // URL se community id
    const userId = req.user._id.toString(); // protectRoute se mil gaya user

    // "team" type ka channel use kar rahe ho
    const channel = serverClient.channel("team", channelId);

    // Agar channel pehle se nahi bana hai toh create ho jayega
    await channel.create();

    // User ko members me add karo
    await channel.addMembers([userId]);

    res.json({ success: true, message: "User added to channel successfully" });
  } catch (err) {
    console.error("Error joining channel:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Leave Community
export const leaveCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const community = await Community.findById(id);

    if (!community) return res.status(404).json({ message: "Community not found" });

    community.members = community.members.filter(m => m.toString() !== req.user._id.toString());
    await community.save();

    await User.findByIdAndUpdate(req.user._id, { $pull: { joinedCommunities: id } });

    // Remove from Stream channel
    const channel = serverClient.channel("team", community.streamChannelId);
    await channel.removeMembers([req.user._id.toString()]);

    res.json({ message: "Left community" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All Communities
export const getAllCommunities = async (req, res) => {
  try {
    const communities = await Community.find().populate("ownerId", "fullName profilePic");
    console.log("Found communities:", communities.length);
    
    // Debug: Log the first community to see the structure
    if (communities.length > 0) {
      console.log("Sample community structure:", JSON.stringify(communities[0], null, 2));
      console.log("Stream Channel ID:", communities[0].streamChannelId);
      console.log("Stream Channel ID type:", typeof communities[0].streamChannelId);
    }
    
    try {
      // Convert to plain objects first
      const plainCommunities = communities.map(community => {
        const plain = community.toObject ? community.toObject() : community;
        
        // Convert specific image URLs
        if (plain.coverImage) {
          plain.coverImage = convertImageUrl(plain.coverImage);
        }
        
        // Convert populated owner's profile pic
        if (plain.ownerId && plain.ownerId.profilePic) {
          plain.ownerId.profilePic = convertImageUrl(plain.ownerId.profilePic);
        }
        
        return plain;
      });
      
      console.log("Converted communities successfully");
      res.json(plainCommunities);
    } catch (conversionError) {
      console.error("Error converting image URLs:", conversionError);
      // Fallback: return communities without conversion
      res.json(communities);
    }
  } catch (error) {
    console.error("Error in getAllCommunities:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Community by ID
export const getCommunityById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const community = await Community.findById(id)
      .populate("ownerId", "fullName profilePic")
      .populate("members", "fullName profilePic");

    if (!community) return res.status(404).json({ message: "Community not found" });

    // Convert to plain object and handle image URLs
    const plainCommunity = community.toObject ? community.toObject() : community;
    
    // Convert specific image URLs
    if (plainCommunity.coverImage) {
      plainCommunity.coverImage = convertImageUrl(plainCommunity.coverImage);
    }
    
    // Convert populated owner's profile pic
    if (plainCommunity.ownerId && plainCommunity.ownerId.profilePic) {
      plainCommunity.ownerId.profilePic = convertImageUrl(plainCommunity.ownerId.profilePic);
    }
    
    // Convert populated members' profile pics
    if (plainCommunity.members && Array.isArray(plainCommunity.members)) {
      plainCommunity.members = plainCommunity.members.map(member => {
        if (member.profilePic) {
          member.profilePic = convertImageUrl(member.profilePic);
        }
        return member;
      });
    }

    res.json(plainCommunity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
