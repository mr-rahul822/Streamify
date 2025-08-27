import mongoose from "mongoose";
const { Schema } = mongoose;

const communitySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },

    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    moderators: [{ type: Schema.Types.ObjectId, ref: "User" }],

    streamChannelId: { type: String, required: true }, // Linked to Stream API channel

    coverImage: { type: String, default: "" },
    tags: [{ type: String }], // for discovery

    isPrivate: { type: Boolean, default: false }, // if true -> use Membership requests
  },
  { timestamps: true }
);

const Community = mongoose.model("Community", communitySchema);
export default Community;
