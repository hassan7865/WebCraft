import express, { Response, Request, NextFunction } from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import { SocketEvent, SocketId } from "./types/socket";
import { USER_CONNECTION_STATUS, User } from "./types/user";
import { Server } from "socket.io";
import path from "path";
import authRoute from "../Routes/auth";
import errorHandler from "../Helper/errorHandler";
import connect from "../Helper/connect";
import projectRoute from "../Routes/project";
import userRoute from "../Routes/user";
import FileSystemItem from "../Models/FileSystemItem.model";
import mongoose from "mongoose";
import fileRoute from '../Routes/fileStructure'
import {ChatMessageModel} from '../Models/Chat.model'
import {FileEditHistory} from '../Models/FileHistory.model'
import chatRoute from '../Routes/chat'
import taskRoute from '../Routes/task' 
import { FileNode } from "./types/file";
import otpRoute from '../Routes/otp'
dotenv.config();

const app = express();

app.use(express.json());

app.use(cors());

app.use(express.static(path.join(__dirname, "public"))); // Serve static files

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
  maxHttpBufferSize: 1e8,
  pingTimeout: 60000,
});

let userSocketMap: User[] = [];

// Function to get all users in a room
function getUsersInRoom(projectId: string): User[] {
  return userSocketMap.filter((user) => user.projectId == projectId);
}

// Function to get room id by socket id
function getprojectId(socketId: SocketId): string | null {
  const projectId = userSocketMap.find(
    (user) => user.socketId == socketId
  )?.projectId;

  if (!projectId) {
    console.error("Room ID is undefined for socket ID:", socketId);
    return null;
  }
  return projectId;
}

function getUserBySocketId(socketId: SocketId): User | null {
  const user = userSocketMap.find((user) => user.socketId === socketId);
  if (!user) {
    console.error("User not found for socket ID:", socketId);
    return null;
  }
  return user;
}

io.on("connection", (socket) => {
  // Handle user actions
  socket.on(SocketEvent.JOIN_REQUEST, ({ projectId, username }) => {
    const isUsernameExist = getUsersInRoom(projectId).filter(
      (u) => u.username === username
    );
    if (isUsernameExist.length > 0) {
      io.to(socket.id).emit(SocketEvent.USERNAME_EXISTS);
      return;
    }

    const user = {
      username,
      projectId,
      status: USER_CONNECTION_STATUS.ONLINE,
      cursorPosition: 0,
      typing: false,
      socketId: socket.id,
      currentFile: null,
    };
    userSocketMap.push(user);
    socket.join(projectId);
    socket.broadcast.to(projectId).emit(SocketEvent.USER_JOINED, { user });
    const users = getUsersInRoom(projectId);
    io.to(socket.id).emit(SocketEvent.JOIN_ACCEPTED, { user, users });
  });

  socket.on("disconnecting", () => {
    const user = getUserBySocketId(socket.id);
    if (!user) return;
    socket.broadcast
      .to(user.projectId)
      .emit(SocketEvent.USER_DISCONNECTED, { user });

    userSocketMap = userSocketMap.filter(
      (u: User) => u.socketId !== socket.id && u.username !== user.username
    );

    socket.leave(user.projectId);

    const remainingUsers: User[] = getUsersInRoom(user.projectId);
   
    socket.broadcast
      .to(user.projectId)
      .emit(SocketEvent.USER_DISCONNECTED, { users: remainingUsers });
  });

  socket.on(
    SocketEvent.SYNC_FILE_STRUCTURE,
    ({ fileStructure, openFiles, activeFile, socketId }) => {
      io.to(socketId).emit(SocketEvent.SYNC_FILE_STRUCTURE, {
        fileStructure,
        openFiles,
        activeFile,
      });
    }
  );

  socket.on(SocketEvent.DIRECTORY_CREATED, ({ parentDirId, newDirectory }) => {
    const projectId = getprojectId(socket.id);
    if (!projectId) return;
    socket.broadcast.to(projectId).emit(SocketEvent.DIRECTORY_CREATED, {
      parentDirId,
      newDirectory,
    });
  });

  socket.on(SocketEvent.DIRECTORY_UPDATED, ({ dirId, children }) => {
    const projectId = getprojectId(socket.id);
    if (!projectId) return;
    socket.broadcast.to(projectId).emit(SocketEvent.DIRECTORY_UPDATED, {
      dirId,
      children,
    });
  });

  socket.on(SocketEvent.DIRECTORY_RENAMED, ({ dirId, newName }) => {
    const projectId = getprojectId(socket.id);
    if (!projectId) return;
    socket.broadcast.to(projectId).emit(SocketEvent.DIRECTORY_RENAMED, {
      dirId,
      newName,
    });
  });

  socket.on(SocketEvent.DIRECTORY_DELETED, ({ dirId }) => {
    const projectId = getprojectId(socket.id);
    if (!projectId) return;
    socket.broadcast
      .to(projectId)
      .emit(SocketEvent.DIRECTORY_DELETED, { dirId });
  });

  socket.on(SocketEvent.FILE_CREATED, ({ parentDirId, newFile }) => {
    const projectId = getprojectId(socket.id);
    if (!projectId) return;
    socket.broadcast
      .to(projectId)
      .emit(SocketEvent.FILE_CREATED, { parentDirId, newFile });
  });

  socket.on(SocketEvent.FILE_UPDATED, ({ fileId, newContent }) => {
    const projectId = getprojectId(socket.id);
    if (!projectId) return;
    socket.broadcast.to(projectId).emit(SocketEvent.FILE_UPDATED, {
      fileId,
      newContent,
    });
  });

  socket.on(SocketEvent.FILE_RENAMED, ({ fileId, newName }) => {
    const projectId = getprojectId(socket.id);
    if (!projectId) return;
    socket.broadcast.to(projectId).emit(SocketEvent.FILE_RENAMED, {
      fileId,
      newName,
    });
  });

  socket.on(SocketEvent.FILE_DELETED, ({ fileId }) => {
    const projectId = getprojectId(socket.id);
    if (!projectId) return;
    socket.broadcast.to(projectId).emit(SocketEvent.FILE_DELETED, { fileId });
  });

  // Handle user status
  socket.on(SocketEvent.USER_OFFLINE, ({ socketId }) => {
    userSocketMap = userSocketMap.map((user) => {
      if (user.socketId === socketId) {
        return { ...user, status: USER_CONNECTION_STATUS.OFFLINE };
      }
      return user;
    });
    const projectId = getprojectId(socketId);
    if (!projectId) return;
    socket.broadcast.to(projectId).emit(SocketEvent.USER_OFFLINE, { socketId });
  });

  socket.on(SocketEvent.USER_ONLINE, ({ socketId }) => {
    userSocketMap = userSocketMap.map((user) => {
      if (user.socketId === socketId) {
        return { ...user, status: USER_CONNECTION_STATUS.ONLINE };
      }
      return user;
    });
    const projectId = getprojectId(socketId);
    if (!projectId) return;
    socket.broadcast.to(projectId).emit(SocketEvent.USER_ONLINE, { socketId });
  });

  // Handle chat actions
  socket.on(SocketEvent.SEND_MESSAGE, async({ message }) => {
	console.log(message)
    const projectId = getprojectId(socket.id);
    if (!projectId) return;
    socket.broadcast
      .to(projectId)
      .emit(SocketEvent.RECEIVE_MESSAGE, { message });
	 try {
    await ChatMessageModel.create({
      message: message.message,
	  userId:message.userId,
      projectId: new mongoose.Types.ObjectId(projectId),
    });
  } catch (err) {
    console.error("Error saving chat message:", err);
  }
});

  // Handle cursor position
  socket.on(SocketEvent.TYPING_START, ({ cursorPosition }) => {
    userSocketMap = userSocketMap.map((user) => {
      if (user.socketId === socket.id) {
        return { ...user, typing: true, cursorPosition };
      }
      return user;
    });
    const user = getUserBySocketId(socket.id);
    if (!user) return;
    const projectId = user.projectId;
    socket.broadcast.to(projectId).emit(SocketEvent.TYPING_START, { user });
  });

socket.on(SocketEvent.TYPING_PAUSE, async ({ fileStructure, userId }) => {
  userSocketMap = userSocketMap.map(user =>
    user.socketId === socket.id ? { ...user, typing: false } : user
  );

  const user = getUserBySocketId(socket.id);
  if (!user) return;

  const projectId = user.projectId;

  try {
    const objectId = new mongoose.Types.ObjectId(projectId);

    // 1. Get previous file structure
    const existing = await FileSystemItem.findOne({ projectId: objectId });

    // 2. Update file structure
    await FileSystemItem.findOneAndUpdate(
      { projectId: objectId },
      { $set: { fileStructure } },
      { new: true, upsert: true }
    );

    // 3. Compare files
    const compareFiles = (oldChildren: FileNode[] = [], newChildren: FileNode[] = []): {
      fileId: string;
      fileName: string;
      previousContent: string;
      newContent: string;
    }[] => {
      const changes = [];
      const oldMap = new Map(oldChildren.map(f => [f.id, f]));

      for (const newFile of newChildren) {
        const oldFile = oldMap.get(newFile.id);

        if (newFile.type === 'file' && (!oldFile || oldFile.content !== newFile.content)) {
          changes.push({
            fileId: newFile.id,
            fileName: newFile.name,
            previousContent: oldFile?.content || '',
            newContent: newFile.content || '',
          });
        }

        if (newFile.children?.length) {
          const nested = compareFiles(oldFile?.children || [], newFile.children);
          changes.push(...nested);
        }
      }

      return changes;
    };

    const changedFiles = compareFiles(
      existing?.fileStructure?.children,
      fileStructure.children
    );

    if (changedFiles.length === 0) return;

    const fileIds = changedFiles.map(f => f.fileId);

    // Get existing records for these files by this user in this session
    const existingRecords = await FileEditHistory.find({
      projectId,
      userId,
      fileId: { $in: fileIds },
      // Optional: Add session-based filtering if you track editing sessions
      // sessionId: currentSessionId 
    }).sort({ editedAt: -1 });

    // Create a map of existing records by fileId
    const existingRecordMap = new Map();
    existingRecords.forEach(record => {
      if (!existingRecordMap.has(record.fileId)) {
        existingRecordMap.set(record.fileId, record);
      }
    });

    const operations = [];

    for (const file of changedFiles) {
      const existingRecord = existingRecordMap.get(file.fileId);

      if (existingRecord) {
        // Check if content actually changed
        if (existingRecord.newContent === file.newContent) {
          // No change in content, just update timestamp
          operations.push({
            updateOne: {
              filter: { _id: existingRecord._id },
              update: { 
                $set: { 
                  editedAt: new Date(),
                  fileName: file.fileName // Update filename in case of rename
                } 
              }
            }
          });
        } else {
          // Update existing record with new content
          // Keep the original previousContent from when editing started
          operations.push({
            updateOne: {
              filter: { _id: existingRecord._id },
              update: { 
                $set: { 
                  newContent: file.newContent, // Update with latest changes
                  editedAt: new Date(),
                  fileName: file.fileName,
                  // previousContent stays the same (original state when editing started)
                } 
              }
            }
          });
        }
      } else {
        // First time editing this file - create new record
        operations.push({
          insertOne: {
            document: {
              projectId,
              userId,
              fileId: file.fileId,
              fileName: file.fileName,
              previousContent: file.previousContent, // Original content when editing started
              newContent: file.newContent,           // Current content
              editedAt: new Date(),
              createdAt: new Date(),
              // Optional: Add session tracking
              // sessionId: currentSessionId
            }
          }
        });
      }
    }

    // Execute all operations in a single batch
    if (operations.length > 0) {
      await FileEditHistory.bulkWrite(operations);
    }

  } catch (err) {
    console.error('Error saving file structure or edit history:', err);
  }

  socket.broadcast.to(projectId).emit(SocketEvent.TYPING_PAUSE, { user });
});


  socket.on(SocketEvent.REQUEST_DRAWING, () => {
    const projectId = getprojectId(socket.id);
    if (!projectId) return;
    socket.broadcast
      .to(projectId)
      .emit(SocketEvent.REQUEST_DRAWING, { socketId: socket.id });
  });

  socket.on(SocketEvent.SYNC_DRAWING, ({ drawingData, socketId }) => {
    socket.broadcast
      .to(socketId)
      .emit(SocketEvent.SYNC_DRAWING, { drawingData });
  });

  socket.on(SocketEvent.DRAWING_UPDATE, ({ snapshot }) => {
    const projectId = getprojectId(socket.id);
    if (!projectId) return;
    socket.broadcast.to(projectId).emit(SocketEvent.DRAWING_UPDATE, {
      snapshot,
    });
  });
});

const PORT = process.env.PORT || 3000;

connect();
app.use("/api/auth", authRoute);
app.use("/api/project", projectRoute);
app.use("/api/user", userRoute);
app.use("/api/fileStructure",fileRoute)
app.use("/api/chat",chatRoute)
app.use("/api/task",taskRoute)
app.use("/api/otp",otpRoute)

app.get("/", (req: Request, res: Response) => {
  // Send the index.html file
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});
app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
