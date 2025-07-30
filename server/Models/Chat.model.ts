import mongoose, { Schema, Document, model, Types } from "mongoose";

export interface IChatMessage extends Document {
  
  message: string;
  userId: Types.ObjectId;
  projectId: Types.ObjectId;
  createdAt: Date;  
  updatedAt: Date;  
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    message: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ChatMessageModel = model<IChatMessage>(
  "ChatMessage",
  ChatMessageSchema
);
