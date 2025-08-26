import { axiosInstance } from "./axios";
import { API } from "./axios";

axiosInstance.withCredentials = true;


// api for login
export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
  return response.data;
};




// api for get authuserData
export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me",{ withCredentials: true });
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser:", error);
    return null;
  }
};
export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onbording", userData, { withCredentials: true });
  return response.data;
};

// api for Friends requests
export const getUserFriends = async () => {
  try {
    const res = await axiosInstance.get("/user/friends");
    return res.data;
  } catch (error) {
    console.log("Error in getUserFriends:", error);
    return [];
  }
};

export const getRecommendedUsers = async () => {
  try {
    const res = await axiosInstance.get("/user");
    return res.data;
  } catch (error) {
    console.log("Error in getRecommendedUsers:", error);
    return [];
  }
};

export const getOutgoingFriendReqs = async () => {
  try {
    const res = await axiosInstance.get("/user/outgoing-friend-requests");
    return res.data;
  } catch (error) {
    console.log("Error in getOutgoingFriendReqs:", error);
    return [];
  }
};

// export const sendFriendRequest = async (userId) => {
//   try {
//     console.log("sendFriendRequest received userId:", userId);
//     console.log("userId type:", typeof userId);
//     console.log("userId constructor:", userId?.constructor?.name);

//     let recipientId;

//     // If it's an object with _id (common case from Mongo/Mongoose populated object)
//     if (userId && typeof userId === "object" && userId._id) {
//       recipientId = String(userId._id);
//     }
//     // If it's already a plain string
//     else if (typeof userId === "string") {
//       recipientId = userId.trim();
//     }
//     // If it's a Buffer-like object from Mongo
//     else if (userId?.buffer) {
//       try {
//         recipientId = Buffer.from(userId.buffer).toString("hex");
//       } catch (e) {
//         console.error("Failed to parse buffer userId:", e);
//       }
//     }

//     // Validate final recipientId
//     if (!recipientId || recipientId === "[object Object]") {
//       throw new Error("Recipient ID is missing or invalid in sendFriendRequest");
//     }

//     console.log("📤 Final recipientId being sent:", recipientId);

//     const res = await axiosInstance.post(`/user/friend-request`, { recipientId });
//     return res.data;

//   } catch (error) {
//     console.error("Error in sendFriendRequest:", error);
//     console.error("Server response:", error.response?.data);
//     throw error;
//   }
// };


export const getFriendRequests = async () => {
  try {
    const res = await axiosInstance.get("/user/friend-request");
    return res.data;
  } catch (error) {
    console.log("Error in getFriendRequests:", error);
    return null;
  }
};

export const sendFriendRequest = async (userId) => {
  try {
    console.log("sendFriendRequest received userId:", userId);
    console.log("userId type:", typeof userId);
    console.log("userId constructor:", userId?.constructor?.name);

    console.log("userId raw:", userId);
console.log("userId JSON:", JSON.stringify(userId));
    let recipientId;

    if (userId && typeof userId === "object" && userId._id) {
      // Case 1: Mongoose user object
      recipientId = String(userId._id);
    } else if (typeof userId === "string") {
      // Case 2: Already a string
      recipientId = userId.trim();
    } else if (userId?.buffer) {
      // Case 3: Buffer-like (from MongoDB ObjectId)
      try {
        recipientId = Buffer.from(userId.buffer).toString("hex"); 
        // if hex fails, try: .toString("base64")
      } catch (e) {
        console.error("Failed to parse buffer userId:", e);
      }
    }

    if (!recipientId || recipientId === "[object Object]") {
      throw new Error("Recipient ID is missing or invalid in sendFriendRequest");
    }

    console.log("📤 Final recipientId being sent:", recipientId);

    const res = await axiosInstance.post(`/user/friend-request`, { recipientId });
    return res.data;

  } catch (error) {
    console.error("Error in sendFriendRequest:", error);
    console.error("Server response:", error.response?.data);
    throw error;
  }
};


export async function acceptFriendRequest(requestId) {
  try {
    const response = await axiosInstance.put(`/user/friend-request/${requestId}/accept`);
    return response.data;
  } catch (error) {
    console.log("Error in acceptFriendRequest:", error);
    throw error;
  }
}


// api for stream token
export const getStreamToken = async () => {
  try {
    
    const res = await axiosInstance.get("/chat/token");
    return { token: res.data.token };
  } catch (error) {
    console.log("Error in getStreamToken:", error);
    console.log("Error response:", error.response?.data);
    console.log("Error status:", error.response?.status);
    throw error; // Throw error instead of returning null
  }
};





// apis for community

// Create new community
export const createCommunity = async (data) => {
  const res = await API.post("/communities/create", data, { withCredentials: true });
  return res.data;
};

// Join community
export const joinCommunity = async (id) => {
  const res = await API.post(`/communities/${id}/join`, {}, { withCredentials: true });
  return res.data;
};


export const joinCommunityChannel = async (id) => {
  const res = await API.post(`/communities/${id}/join-channel`, {}, { withCredentials: true });
  return res.data;
};

// Leave community
export const leaveCommunity = async (id) => {
  const res = await API.post(`/communities/${id}/leave`, {}, { withCredentials: true });
  return res.data;
};

// Get all communities
export const getCommunities = async () => {
  const res = await API.get("/communities", { withCredentials: true });
  return res.data;
};

// Get one community
export const getCommunityById = async (id) => {
  const res = await API.get(`/communities/${id}`, { withCredentials: true });
  return res.data;
};

// Profile APIs
export const getProfile = async () => {
  const res = await API.get("/user/profile", { withCredentials: true });
  return res.data;
};

export const updateProfile = async (profileData) => {
  const res = await API.put("/user/profile", profileData, { withCredentials: true });
  return res.data;
};

// // Create new community
// export const createCommunity = async (data) => {
//   const res = await API.post("/communities", data, { withCredentials: true });
//   return res.data;
// };


