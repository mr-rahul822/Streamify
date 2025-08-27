import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import useThemeStore from "../store/useThemeStore";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken, getUserFriends } from "../lib/api.js";
import { normalizeId } from "../utils/id";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";

const STREAM_API_KEY =
  import.meta.env.VITE_STREAM_API_KEY || "placeholder_key_for_build";

console.log("🔑 STREAM_API_KEY available:", !!STREAM_API_KEY);

// // ✅ Normalize all user ids into string
// function normalizeId(id) {
//   console.log("🟢 normalizeId() called with:", id);

//   if (!id) return null;

//   if (typeof id === "string") {
//     console.log("   ↳ returning plain string:", id.trim());
//     return id.trim();
//   }

//   if (id._id) {
//     console.log("   ↳ returning nested _id:", id._id);
//     return String(id._id);
//   }

//   if (id.buffer) {
//     const bytes = Object.values(id.buffer);
//     const hex = bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
//     console.log("   ↳ returning buffer hex:", hex);
//     return hex;
//   }

//   // Handle case where id is an object but we need to convert it to string
//   if (typeof id === "object") {
//     console.log("   ↳ converting object to string:", JSON.stringify(id));
//     return JSON.stringify(id);
//   }

//   console.warn("   ⚠️ Could not normalize id:", id);
//   return null;
// }

const ChatPage = () => {
   const { id } = useParams();
  const targetUserIdParam = normalizeId(id);
  console.log("📌 useParams() -> params:", params);
  console.log("📌 useParams() -> targetUserIdParam:", targetUserIdParam);

  const navigate = useNavigate();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser, isLoading: authLoading } = useAuthUser();
  const { theme } = useThemeStore();

  // Token from backend
  const {
    data: tokenData,
    error: tokenError,
    isLoading: tokenLoading,
  } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  // Friends list
  const { data: friends = [], isLoading: friendsLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser) {
        console.log("⏳ Waiting for token/authUser...");
        return;
      }

      try {
        console.log("🚀 Initializing stream chat client...");
        const client = StreamChat.getInstance(STREAM_API_KEY);

        const myId = normalizeId(authUser._id);
        const targetId = normalizeId(targetUserIdParam);

        console.log("👤 My ID:", myId);
        console.log("👥 Target ID (from URL):", targetId);

        // Validate IDs
        const isValidId = (s) => {
          const str = String(s || "");
          return /^[a-f0-9]{24}$/i.test(str);
        };
        
        if (!isValidId(myId) || !isValidId(targetId)) {
          console.error("❌ Invalid user ids:", { myId, targetId });
          console.error("❌ Raw targetUserIdParam:", targetUserIdParam);
          toast.error("Invalid chat link");
          setLoading(false);
          return;
        }

        // reconnect if needed
        if (client.userID && client.userID !== myId) {
          console.log("🔄 Disconnecting previous user:", client.userID);
          await client.disconnectUser();
        }
        if (!client.userID) {
          console.log("✅ Connecting user:", myId);
          await client.connectUser(
            {
              id: myId,
              name: authUser.fullName,
              image: authUser.profilePic,
            },
            tokenData.token
          );
        }

        // Stable channel id
        const channelId = [myId, targetId].sort().join("-");
        console.log("📡 Using channelId:", channelId);

        const currChannel = client.channel("messaging", channelId, {
          members: [myId, targetId],
        });

        console.log("👀 Watching channel with members:", [myId, targetId]);
        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("🔥 Error initializing chat:", error);
        toast.error("Could not connect to chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [tokenData?.token, authUser?._id, targetUserIdParam]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;
      console.log("📹 Sending call link:", callUrl);

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });
      toast.success("Video call link sent successfully!");
    }
  };

  // ---------- UI States ----------
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-[93vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Loading...</h2>
          <p className="text-gray-500">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="flex items-center justify-center h-[93vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600">Please log in to access the chat</p>
        </div>
      </div>
    );
  }

  if (!STREAM_API_KEY) {
    return (
      <div className="flex items-center justify-center h-[93vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Stream API Key Missing
          </h2>
          <p className="text-gray-600">
            Please add VITE_STREAM_API_KEY to your frontend .env file
          </p>
        </div>
      </div>
    );
  }

  if (tokenError) {
    return (
      <div className="flex items-center justify-center h-[93vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Failed to connect to chat
          </h2>
          <p className="text-gray-600">
            Please check your Stream API configuration and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ---------- Main Render ----------
  return (
    <div className="h-[93vh]">
      <div className="flex h-full">
        {/* Sidebar */}
        <aside className="w-80 max-w-[22rem] border-r border-base-300 bg-base-100 overflow-y-auto">
          <div className="px-4 py-3 border-b border-base-300">
            <h2 className="text-lg font-semibold">Messages</h2>
          </div>
          <div className="divide-y divide-base-300">
            {friendsLoading && (
              <div className="p-4 text-sm opacity-70">Loading friends...</div>
            )}
            {!friendsLoading && friends.length === 0 && (
              <div className="p-4 text-sm opacity-70">No friends yet</div>
            )}
            {friends.map((friend) => {
              console.log("👤 Rendering friend:", friend);
              const friendId = normalizeId(friend._id);
              console.log("   → Normalized friendId:", friendId);

              const active = friendId === normalizeId(targetUserIdParam);
              return (
                <button
                  key={friendId}
                  onClick={() => {
                    console.log("👉 Navigating to /chat/", friendId);
                    navigate(`/chat/${String(friendId)}`);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-base-200 ${
                    active ? "bg-base-200" : ""
                  }`}
                >
                  <div className="avatar">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img src={friend.profilePic} alt={friend.fullName} />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium truncate">{friend.fullName}</div>
                    {friend.bio && (
                      <div className="text-xs opacity-70 truncate">{friend.bio}</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Chat */}
        <div className="flex-1 min-w-0">
          {loading || !chatClient || !channel ? (
            <ChatLoader />
          ) : (
            <Chat client={chatClient}>
              <Channel channel={channel}>
                <div className="w-full relative h-full">
                  <CallButton handleVideoCall={handleVideoCall} />
                  <Window>
                    <ChannelHeader />
                    <MessageList />
                    <MessageInput focus />
                  </Window>
                  <Thread />
                </div>
              </Channel>
            </Chat>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
