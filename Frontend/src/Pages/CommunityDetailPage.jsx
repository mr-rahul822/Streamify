import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getCommunityById, joinCommunity } from "../lib/api";
import { useStreamClient } from "../store/useStreamClient";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  Window,
} from "stream-chat-react";
import ChatLoader from "../components/ChatLoader";
import "stream-chat-react/dist/css/v2/index.css";
import useAuthUser from "../hooks/useAuthUser";
// import LoadingChannels from "../components/ChatLoader";

const CommunityDetailPage = () => {
  const { authUser, isLoading: authLoading } = useAuthUser(); 
  const { id } = useParams();

  const { data: community, isLoading: communityLoading } = useQuery({
    queryKey: ["community", id],
    queryFn: () => getCommunityById(id),
  });

  const { client, initClient, disconnectClient } = useStreamClient(); 
  const [channel, setChannel] = useState(null);

  // Init Stream client when authUser is ready
  useEffect(() => {
    if (!authLoading && authUser && !client) {
      initClient(authUser);
    }
  }, [authUser, authLoading, client, initClient]);

  // Setup channel when client + community available
  useEffect(() => {
    const setupChannel = async () => {
      if (client && community?.streamChannelId && authUser) {
        try {
          // ensure user is a member of the community before watching channel
          const isMember = Array.isArray(community.members)
            ? community.members.some((m) => (m?._id || m)?.toString() === authUser._id)
            : false;

          if (!isMember) {
            try {
              await joinCommunity(community._id);
            } catch (joinErr) {
              console.error("[stream] failed to join community before channel watch:", joinErr);
            }
          }

          const ch = client.channel("team", community.streamChannelId, {
            name: community.name,
          });
          await ch.watch();
          setChannel(ch);
        } catch (err) {
          console.error("[stream] error setting up channel:", err);
        }
      }
    };
    setupChannel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, community]);

  // Cleanup on unmount (disconnect Stream client)
  useEffect(() => {
    return () => {
      if (client) {
        console.log("[stream] disconnecting client...");
        disconnectClient();
      }
    };
  }, [client, disconnectClient]);

  // Loading states
  if (authLoading || communityLoading) return <p>Loading community...</p>;
  if (!authUser) return <p>User not logged in</p>;
  if (!client) return <ChatLoader />;
  if (!channel) return <ChatLoader />;

  // Render chat UI
  return (
    <div className="h-screen flex flex-col">
      <Chat client={client}>
        <Channel channel={channel}>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
        </Channel>
      </Chat>
    </div>
  );
};

export default CommunityDetailPage;
