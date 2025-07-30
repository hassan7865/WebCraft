import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IProject extends Document {
  key: String;
  name: string;
  description?: string;
  createdBy: Types.ObjectId;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  status: "active" | "completed" | "on-hold";
}

const ProjectSchema: Schema<IProject> = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "completed", "on-hold"],
      default:"active"
    },
  },
  { timestamps: true }
);

const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
