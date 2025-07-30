// routes/fileSystem.ts
import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import FileSystemItem from "../Models/FileSystemItem.model";
import { throwError } from "../Helper/error";

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
        throwError(404, "File structure not found");
      }

      res.json({ fileStructure: fileSystemItem?.fileStructure });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
