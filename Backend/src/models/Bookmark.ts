import mongoose, { Schema } from "mongoose";
import { IBookmark } from "../types/index.js";

const bookmarkSchema = new Schema<IBookmark>(
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
    savedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

bookmarkSchema.index({ user: 1, event: 1 }, { unique: true });

bookmarkSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id;
  delete obj.__v;
  return obj;
};

const Bookmark = mongoose.model<IBookmark>("Bookmark", bookmarkSchema);
export default Bookmark;
