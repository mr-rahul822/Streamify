import User from "../Models/User.js"
import FriendRequest from "../Models/FriendRequest.js";
import { convertImageUrls } from "../lib/utils.js";
import mongoose from "mongoose";


export async function getRecommendedUsers(req,res){
        try {
            const currentUserId = req.user._id;
            const currentUser = req.user;

            // const recommendedUser = await User.find({
            //     $and : [ 
            //         {_id:{$in: currentUserId }}, // excclude current user
            //         {_id:{$nin: currentUser.friends }}, // exclude my current friends.
            //         {isOnboarded: true}
            //     ],
            // });

            const recommendedUser = await User.find({
    _id: { $ne: currentUserId, $nin: currentUser.friends },
    isOnboarded: true
}).select("fullName profilePic nativeLanguage learningLanguage bio location");

            res.status(200).json(convertImageUrls(recommendedUser));
        } catch (error) {
            console.error("Error in getRecommendedUsers controller", error.message);
            res.status(500).json({ message: "Internal Server Error" });
        }
}

export async function getMyFriends(req,res){

    try {
    const user = await User.findById(req.user._id)
    .select("friends")
    .populate("friends", "fullName profilePic nativeLanguage learningLanguage bio");

    res.status(200).json(convertImageUrls(user.friends))
        
    } catch (error) {
       console.error("Error in getMyFriends controller", error.message);
       res.status(500).json({ message: "Internal Server Error" }); 
    }
} 

export async function sendFriendRequest(req,res) {

    try {
        const myId  = req.user.id;
        // Accept recipient id from URL param or request body
        const rawRecipient = (req.params && req.params.id) ? req.params.id : req.body?.recipientId;
        const  recipientId =  String(rawRecipient || "").trim();

        console.log("Raw Recipient:", rawRecipient);
        console.log("Final RecipientId:", recipientId);

        if (!recipientId) {
            return res.status(400).json({ message: "Recipient id is required" });
        }
        if (!mongoose.Types.ObjectId.isValid(recipientId)) {
            return res.status(400).json({ message: "Invalid recipient id" });
        }

        if(myId === recipientId){
            return res.status(400).json({ message: "You can't send friend request to yourself" });
        }

        const recipient = await User.findById(recipientId);
         if (!recipient) {
                return res.status(404).json({ message: "Recipient not found" });
         }

         if(recipient.friends.includes(myId)){
            return res.status(200).json({message:  "You are already friends with this user"})
         }

         const existingRequest = await FriendRequest.findOne({
            $or: [
                {sender : myId , recipient :recipientId },
                {sender: recipientId, recipient : myId},
            ],
         });

         if(existingRequest){
            return res.status(400).json({ message: "A friend request already exists between you and this user" });
         }

         const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId,
         })


          res.status(201).json(friendRequest);


    } catch (error) {
        console.error("Error in sendFriendRequest controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
        
    }

}


export async function acceptFriendRequest(req,res) {

    try {
        const {id : requestId} = req.params;

        const friendRequest =  await FriendRequest.findById(requestId);

        if(!friendRequest){
            return res.status(404).json({ message: "Friend request not found" });
        }

        if(friendRequest.recipient.toString() !== req.user.id){
            return res.status(403).json({ message: "You are not authorized to accept this request" });
        }

        friendRequest.status = "accepted";
        await friendRequest.save();


         // add each user to the other's friends array
    // $addToSet: adds elements to an array only if they do not already exist.
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    res.status(200).json({ message: "Friend request accepted" });

    } catch (error) {
         console.log("Error in acceptFriendRequest controller", error.message);
         res.status(500).json({ message: "Internal Server Error" });
    }
    

}


export async function getFriendRequests(req,res) {

    try {
        
        const incomingReqs = await FriendRequest.find({
            recipient : req.user.id,
            status: "pending",
        }).populate("sender" , "fullName profilePic nativeLanguage learningLanguage");

        const acceptedReqs =  await FriendRequest.find({
            recipient : req.user.id,
            status : "accepted",
        }).populate("sender","fullName profilePic");

        return res.status(200).json({incomingReqs,acceptedReqs});

    } catch (error) {
        console.log("Error in getPendingFriendRequests controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }}


    export async function getOutgoingFriendReqs(req ,res) {

        try {
            
            const outgoingRequests =  await FriendRequest.find({
                sender : req.user.id,
                status : "pending"
            }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");


            res.status(200).json(outgoingRequests);
        } catch (error) {
            console.log("Error in getOutgoingFriendReqs controller", error.message);
            res.status(500).json({ message: "Internal Server Error" });
        }
        
    }

    // Get current user's profile
    export async function getProfile(req, res) {
        try {
            const user = await User.findById(req.user._id)
                .select("fullName email bio profilePic nativeLanguage learningLanguage location isOnboarded friends joinedCommunities")
                .populate("joinedCommunities", "name description coverImage");

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json(convertImageUrls(user));
        } catch (error) {
            console.error("Error in getProfile controller", error.message);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    // Update current user's profile
    export async function updateProfile(req, res) {
        try {
            const { fullName, bio, profilePic, location, learningLanguage, nativeLanguage } = req.body;

            // Validate required fields
            if (!fullName || fullName.trim().length < 3) {
                return res.status(400).json({ message: "Full name must be at least 3 characters long" });
            }

            const updatedUser = await User.findByIdAndUpdate(
                req.user._id,
                {
                    fullName: fullName.trim(),
                    bio: bio || "",
                    profilePic: profilePic || "",
                    location: location || "",
                    learningLanguage: learningLanguage || "",
                    nativeLanguage: nativeLanguage || "",
                },
                { new: true, runValidators: true }
            ).select("fullName email bio profilePic nativeLanguage learningLanguage location isOnboarded friends joinedCommunities");

            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json(convertImageUrls(updatedUser));
        } catch (error) {
            console.error("Error in updateProfile controller", error.message);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

