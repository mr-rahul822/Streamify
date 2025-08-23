import mongoose from "mongoose";
const { Schema } = mongoose;

const membershipSchema = new Schema(
  {
    communityId: { type: Schema.Types.ObjectId, ref: "Community", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },

    requestedAt: { type: Date, default: Date.now },
    approvedAt: { type: Date },
  },
  { timestamps: true }
);

const Membership = mongoose.model("Membership", membershipSchema);
export default Membership;

