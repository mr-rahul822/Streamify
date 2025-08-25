import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import useThemeStore from "../store/useThemeStore";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken, getUserFriends } from "../lib/api";

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

console.log("STREAM_API_KEY available:", !!STREAM_API_KEY);

const ChatPage = () => {
  const { id: targetUserIdParam } = useParams();
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
      if (!tokenData?.token || !authUser) return;

      try {
        console.log("Initializing stream chat client...");

        const client = StreamChat.getInstance(STREAM_API_KEY);

        const myId = String(authUser._id);

        // Validate target id from URL params
        const rawTarget = targetUserIdParam;
        const isValidId = (s) => /^[a-f0-9]{24}$/i.test(String(s || ""));
        if (rawTarget === "[object Object]" || !isValidId(rawTarget)) {
          console.error("❌ Invalid target user id:", rawTarget);
          toast.error("Invalid chat link");
          setLoading(false);
          return;
        }

        const targetId = typeof rawTarget === "object" && rawTarget?._id
          ? String(rawTarget._id)
          : String(rawTarget);

        // connect current user only if needed
        if (client.userID && client.userID !== myId) {
          await client.disconnectUser();
        }
        if (!client.userID) {
          await client.connectUser(
            {
              id: myId,
              name: authUser.fullName,
              image: authUser.profilePic,
            },
            tokenData.token
          );
        }

        // Always create stable channel id (sorted)
        const channelId = [myId, targetId].sort().join("-");

        const currChannel = client.channel("messaging", channelId, {
          members: [myId, targetId],
        });

        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing chat:", error);
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

  // Map app theme to Stream Chat theme (light/dark)
  const darkThemes = new Set([
    "dark",
    "synthwave",
    "halloween",
    "forest",
    "black",
    "dracula",
    "business",
    "night",
    "dim",
    "sunset",
    "coffee",
  ]);
  const chatTheme = darkThemes.has(theme)
    ? "str-chat__theme-dark"
    : "str-chat__theme-light";

  // ---------- Main Render ----------
  return (
    <div className="h-[93vh]">
      <div className="flex h-full">
        {/* Sidebar: friends list */}
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
              const active = friend._id === targetUserIdParam;
              return (
                <button
                  key={friend._id}
                  onClick={() => navigate(`/chat/${friend._id}`)}
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

        {/* Chat content */}
        <div className="flex-1 min-w-0">
          {loading || !chatClient || !channel ? (
            <ChatLoader />
          ) : (
            <Chat client={chatClient} theme={chatTheme}>
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
