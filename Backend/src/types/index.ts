import { Document, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "admin" | "user";
  avatar: string;
  interests: string[];
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISchedule {
  day: string;
  time: string;
  title: string;
  description: string;
}

export interface IEvent extends Document {
  name: string;
  description: string;
  subtitle: string;
  schedule: ISchedule[];
  type: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  venue: string;
  coverImage: string;
  category: string;
  capacity: number;
  price: number;
  status: "draft" | "published" | "cancelled";
  organizer: Types.ObjectId | any;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBookmark extends Document {
  user: Types.ObjectId;
  event: Types.ObjectId;
  savedAt: Date;
}

export interface IComment extends Document {
  user: Types.ObjectId | any;
  event: Types.ObjectId | any;
  text: string;
  createdAt: Date;
}

export interface IContact extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRegistration extends Document {
  user: Types.ObjectId | any;
  event: Types.ObjectId | any;
  registeredAt: Date;
}

export interface IToken extends Document {
  token: string;
  type: "access" | "refresh";
  user: Types.ObjectId;
  expiresAt: Date;
}

export interface IUpvote extends Document {
  user: Types.ObjectId | any;
  event: Types.ObjectId | any;
  upvotedAt: Date;
}

// Extend Express Request namespace globally to support req.user
declare global {
  namespace Express {
    interface Request {
      user?: any; // To allow assigning typed IUser document
    }
  }
}
