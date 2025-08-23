import { StreamChat } from "stream-chat";
import "dotenv/config"

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_SCREAT_KEY

if (!api_key || !api_secret) {
  console.error("❌ Stream API key or Secret is missing!");
  console.error("Please add STREAM_API_KEY and STREAM_SCREAT_KEY to your .env file");
  process.exit(1);
}

const streamClient = StreamChat.getInstance(api_key, api_secret);

export const upsertStreamUser = async (userData)=>{
    try{
         console.log("🟡 Stream User Data:", userData);
        await streamClient.upsertUsers([userData]);
        return userData;
    }catch(error){
        console.error("error in upserting user",error)
    }
} 

// TODO :  do it later

export const genrateStreamToken = async (userId) => {
    try {
        const userIdstr = userId.toString();
        return streamClient.createToken(userIdstr);
    } catch (error) {
        console.log("error generating stream token :", error);
        throw error; // Re-throw the error so it can be handled by the controller
    }
    
}