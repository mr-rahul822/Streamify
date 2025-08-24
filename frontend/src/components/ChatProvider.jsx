import React, { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { useQuery } from "@tanstack/react-query";
import useAuthUser from "../hooks/useAuthUser";
import { getStreamToken } from "../lib/api";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY || "placeholder_key_for_build";

export const ChatContext = React.createContext(null);

const ChatProvider = ({ children }) => {
  const { authUser } = useAuthUser();
  const [chatClient, setChatClient] = useState(null);

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    if (!authUser || !tokenData?.token || STREAM_API_KEY === "placeholder_key_for_build") return;

    const client = StreamChat.getInstance(STREAM_API_KEY);

    client.connectUser(
      {
        id: authUser._id,
        name: authUser.fullName,
        image: authUser.profilePic,
      },
      tokenData.token
    );

    setChatClient(client);

    return () => {
      client.disconnectUser();
    };
  }, [authUser, tokenData]);

  return (
    <ChatContext.Provider value={chatClient}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
