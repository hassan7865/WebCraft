// routes/chat.ts
import express, { Request, Response, NextFunction } from "express";

import mongoose, { Types } from "mongoose";
import { throwError } from "../Helper/error";
import { ChatMessageModel } from "../Models/Chat.model";

const router = express.Router();

interface ChatMessage {
  id: string;
  message: string;
  username: string;
  userId: string;
  timestamp: string;
}

router.get(
  "/:projectId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return throwError(400, "Invalid projectId");
      }

      const messages = await ChatMessageModel.find({ projectId })
        .populate("userId", "username")
        .sort({ createdAt: 1 });

      const formattedMessages: ChatMessage[] = messages.map((msg) => ({
        id: (msg._id as Types.ObjectId).toString(),
        message: msg.message,
        userId: msg.userId._id.toString(),
        username: (msg.userId as any).username,
        timestamp: formatDate(msg.createdAt.toISOString()),
      }));

      res.json({chats:formattedMessages});
    } catch (err) {
      next(err);
    }
  }
);


export function formatDate(timestamp: string) {
    const date = new Date(timestamp)

    // Get hours and minutes
    let hours = date.getHours()
    const minutes = String(date.getMinutes()).padStart(2, "0")

    // Determine AM or PM
    const amOrPm = hours >= 12 ? "PM" : "AM"

    // Convert to 12-hour format
    hours = hours % 12
    hours = hours ? hours : 12 // Handle midnight

    // Format the date string
    const formattedTime = `${hours}:${minutes} ${amOrPm}`

    return formattedTime
}


export default router;
