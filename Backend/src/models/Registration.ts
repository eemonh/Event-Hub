import mongoose, { Schema } from "mongoose";
import { IRegistration } from "../types/index.js";

const registrationSchema = new Schema<IRegistration>(
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
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

registrationSchema.index({ user: 1, event: 1 }, { unique: true });

registrationSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id;
  delete obj.__v;
  return obj;
};

const Registration = mongoose.model<IRegistration>("Registration", registrationSchema);
export default Registration;
