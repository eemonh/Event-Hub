import mongoose, { Schema } from "mongoose";
import { IToken } from "../types/index.js";

const tokenSchema = new Schema<IToken>({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ["access", "refresh"],
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Token = mongoose.model<IToken>("Token", tokenSchema);
export default Token;
