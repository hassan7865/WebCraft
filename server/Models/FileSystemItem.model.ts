import mongoose, { Schema, Document, Model, Types } from "mongoose"

export type FileName = string
export type FileContent = string

export interface IFileTreeNode {
  id:string,
  name: FileName
  type: "file" | "directory"
  content?: FileContent
  isOpen?: boolean
  children?: IFileTreeNode[]
}

export interface IFileSystemItem extends Document {
  projectId: Types.ObjectId
  fileStructure: IFileTreeNode
}

const FileTreeNodeSchema: Schema = new Schema(
  {
     id: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ["file", "directory"], required: true },
    content: { type: String },
    isOpen: { type: Boolean, default: false },
  },
  { _id: false }
)

FileTreeNodeSchema.add({
  children: [FileTreeNodeSchema]
})

const FileSystemItemSchema: Schema<IFileSystemItem> = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      unique: true,
    },
    fileStructure: {
      type: FileTreeNodeSchema,
      required: true,
    },
  },
  { timestamps: true }
)

const FileSystemItem: Model<IFileSystemItem> =
  mongoose.models.FileSystemItem ||
  mongoose.model<IFileSystemItem>("FileSystemItem", FileSystemItemSchema)

export default FileSystemItem
