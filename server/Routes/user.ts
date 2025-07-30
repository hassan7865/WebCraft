import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import User from "../Models/User.model";
import { throwError } from "../Helper/error";
import Project from "../Models/Project.model";
const router = express.Router();

router.get(
  "/search",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username } = req.query;

      if (!username || typeof username !== "string") {
        return next(throwError(400, "Username query parameter is required."));
      }

      const users = await User.find({
        username: { $regex: new RegExp(username, "i") },
      }).select("_id username email");

      return res.status(200).json({ users });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/invite",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, projectId } = req.body;

      if (
        !userId ||
        !projectId ||
        !mongoose.Types.ObjectId.isValid(userId) ||
        !mongoose.Types.ObjectId.isValid(projectId)
      ) {
        return next(throwError(400, "Invalid or missing userId/projectId"));
      }

      const user = await User.findById(userId);
      if (!user) return next(throwError(404, "User not found"));

      const project = await Project.findById(projectId);
      if (!project) return next(throwError(404, "Project not found"));

      if (!user.projects.includes(projectId)) {
        user.projects.push(projectId); // projectId is a string, no need to convert
        await user.save();
      }else{
        return res
        .status(200)
        .json({ message: "User is Already Member" });
      }

      return res
        .status(200)
        .json({ message: "User successfully Added" });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
