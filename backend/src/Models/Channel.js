import mongoose from "mongoose";
const { Schema } = mongoose;

const channelSchema = new Schema(
  {
    communityId: { type: Schema.Types.ObjectId, ref: "Community", required: true },

    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["text", "voice", "video"], default: "text" },

    streamChannelId: { type: String, required: true }, // linked to Stream API
  },
  { timestamps: true }
);

const Channel = mongoose.model("Channel", channelSchema);
export default Channel;
