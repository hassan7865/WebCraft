// routes/fileSystem.ts
import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import FileSystemItem from "../Models/FileSystemItem.model";
import { throwError } from "../Helper/error";
import { FileEditHistory } from "../Models/FileHistory.model";

const router = express.Router();

router.get(
  "/:projectId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throwError(400, "Invalid project ID");
      }

      const fileSystemItem = await FileSystemItem.findOne({
        projectId: new mongoose.Types.ObjectId(projectId),
      });

      if (!fileSystemItem) {
        return
      }

      res.json({ fileStructure: fileSystemItem?.fileStructure });
    } catch (err) {
      next(err);
    }
  }
);

router.get('/history/:projectId', async (req: Request, res: Response, next: NextFunction) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).json({ message: 'Invalid project ID' });
  }

  try {
    const history = await FileEditHistory.find({
      projectId: new mongoose.Types.ObjectId(projectId),
    })
      .populate("userId", "username email")
      .sort({ editedAt: -1 });

    
    const shapedHistory = history.map(entry => {
      const { userId, ...rest } = entry.toObject();
      return {
        ...rest,
        user: userId, // now user: { username, email, _id }
      };
    });

    res.status(200).json(shapedHistory);
  } catch (err) {
    console.log(err);
    next(err);
  }
});


export default router;
