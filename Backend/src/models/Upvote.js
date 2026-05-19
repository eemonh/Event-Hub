import mongoose from "mongoose";

const upvoteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    upvotedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

upvoteSchema.index({ user: 1, event: 1 }, { unique: true });

upvoteSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id;
  delete obj.__v;
  return obj;
};

export default mongoose.model("Upvote", upvoteSchema);
