import mongoose, { Schema } from "mongoose";
import { IUpvote } from "../types/index.js";

const upvoteSchema = new Schema<IUpvote>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: Schema.Types.ObjectId,
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

const Upvote = mongoose.model<IUpvote>("Upvote", upvoteSchema);
export default Upvote;
