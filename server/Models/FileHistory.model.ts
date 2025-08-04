import mongoose, { Document, Schema, Model } from 'mongoose';


export interface IFileEditHistory extends Document {
  projectId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  fileId: string;
  fileName: string;
  previousContent: string;
  newContent: string;
  editedAt: Date;
}

// 2. Define the schema
const fileEditHistorySchema: Schema<IFileEditHistory> = new Schema(
  {
    projectId: { type: Schema.Types.ObjectId, required: true, ref: 'Project' },
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    fileId: { type: String, required: true },
    fileName: { type: String, required: true },
    previousContent: { type: String },
    newContent: { type: String },
    editedAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

export const FileEditHistory: Model<IFileEditHistory> =
  mongoose.models.FileEditHistory ||
  mongoose.model<IFileEditHistory>('FileEditHistory', fileEditHistorySchema);
