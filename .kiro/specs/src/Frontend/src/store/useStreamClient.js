// src/store/useStreamClient.js
import { create } from "zustand";
import { StreamChat } from "stream-chat";
import { getStreamToken } from "../lib/api";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

// 🔑 singleton client (global instance, avoid re-init)
let streamClient = null;

export const useStreamClient = create((set, get) => ({
  client: null,
  loading: false,
  error: null,

  // ✅ call this with authUser
  initClient: async (authUser) => {
    if (!authUser) {
      console.warn("[stream] authUser missing in initClient");
      return null;
    }

    // if already initialized & connected
    if (streamClient && streamClient.userID) {
      console.log("[stream] client already connected as", streamClient.userID);
      set({ client: streamClient });
      return streamClient;
    }

    try {
      set({ loading: true, error: null });
      if (!STREAM_API_KEY) throw new Error("VITE_STREAM_API_KEY missing");

      const { token } = await getStreamToken();
      console.log("[stream] got token");

      // create singleton client
      if (!streamClient) {
        streamClient = StreamChat.getInstance(STREAM_API_KEY);
      }

      // only connect if not connected
      if (!streamClient.userID) {
        await streamClient.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          token
        );
        console.log("[stream] connectUser OK");
      }

      set({ client: streamClient, loading: false });
      return streamClient;
    } catch (err) {
      console.error("[stream] init error:", err);
      set({ error: err.message || "stream init failed", loading: false });
      return null;
    }
  },

  disconnectClient: async () => {
    if (streamClient) {
      await streamClient.disconnectUser();
      streamClient = null;
      set({ client: null });
      console.log("[stream] disconnected");
    }
  },
}));
