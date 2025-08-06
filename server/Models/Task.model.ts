import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ITask extends Document {
  title: string;
  status: "todo" | "inprogress" | "review" | "done";
  summary: string;
  priority: "Low" | "Normal" | "High" | "Critical";
  assignees?: Types.ObjectId[];
  reporter:Types.ObjectId;
  dueDate?: Date;
  tags?: string[];
  progress?: number;
  project: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema<ITask> = new Schema(
  {
    title: { type: String, required: true },
    status: {
      type: String,
      enum: ["todo", "inprogress", "review", "done"],
      default: "todo",
      required: true,
    },
    summary: { type: String, required: true },
    priority: {
      type: String,
      enum: ["Low", "Normal", "High", "Critical"],
      default: "Normal",
      required: true,
    },
    assignees: { // Changed to an array of ObjectIds
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    dueDate: { type: Date },
    tags: { type: [String], default: [] },
    progress: {
      type: Number,
      min: 0,
      max: 100,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
  },
  { timestamps: true }
);

const Task: Model<ITask> =
  mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);

export default Task;
