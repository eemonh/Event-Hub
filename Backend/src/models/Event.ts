import mongoose, { Schema } from "mongoose";
import { IEvent } from "../types/index.js";

const CATEGORIES = [
  "Technology", "Design", "Business", "Startup", "Music",
  "Arts", "Health", "Sports", "Education", "Food & Drink",
  "Networking", "Other",
];

const eventSchema = new Schema<IEvent>(
  {
    name: {
      type: String,
      required: [true, "Event name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    subtitle: {
      type: String,
      default: "",
      trim: true,
    },
    schedule: [{
      day: { type: String, default: "" },
      time: { type: String, default: "" },
      title: { type: String, default: "" },
      description: { type: String, default: "" },
    }],
    type: {
      type: String,
      required: [true, "Event type is required"],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
      validate: {
        validator: function (this: any, value: Date) {
          return !this.startDate || value >= this.startDate;
        },
        message: "End date must be on or after start date",
      },
    },
    startTime: {
      type: String,
      default: "",
    },
    endTime: {
      type: String,
      default: "",
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
      trim: true,
    },
    coverImage: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: CATEGORIES,
    },
    capacity: {
      type: Number,
      default: 100,
      min: [1, "Capacity must be at least 1"],
    },
    price: {
      type: Number,
      default: 0,
      min: [0, "Price cannot be negative"],
    },
    status: {
      type: String,
      enum: ["draft", "published", "cancelled"],
      default: "published",
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Organizer is required"],
    },
  },
  { timestamps: true }
);

eventSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id;
  delete obj.__v;
  return obj;
};

const Event = mongoose.model<IEvent>("Event", eventSchema);

export { CATEGORIES };
export default Event;
