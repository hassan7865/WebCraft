import express, { NextFunction, Request, Response } from "express";
import Task from "../Models/Task.model";
import { throwError } from "../Helper/error";
import mongoose from "mongoose";
const router = express.Router();



router.post("/save", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      _id,
      title,
      status,
      summary,
      priority,
      assignee,
      dueDate,
      tags,
      progress,
      project,
      reporter
    } = req.body;

    // Validate required fields for creation
    if (!_id && (!title || !project)) {
      return next(throwError(400, "Title, Assignee, and Project are required"));
    }

    // CREATE
    if (!_id) {
      const newTask = new Task({
        title,
        status,
        summary,
        priority,
        assignee,
        dueDate,
        tags,
        progress,
        project,
        reporter
      });

      await newTask.save();

      return res
        .status(201)
        .json({ message: "Task created successfully", task: newTask });
    }

    // UPDATE
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return next(throwError(400, "Invalid _id"));
    }

    const updateData: Record<string, any> = {};

    if (title !== undefined) updateData.title = title;
    if (status !== undefined) updateData.status = status;
    if (summary !== undefined) updateData.summary = summary;
    if (priority !== undefined) updateData.priority = priority;
    if (assignee !== undefined) updateData.assignee = assignee;
    if(reporter!== undefined) updateData.reporter = reporter
    if (dueDate !== undefined) updateData.dueDate = dueDate;
    if (tags !== undefined) updateData.tags = tags;
    if (progress !== undefined) updateData.progress = progress;
    if (project !== undefined) updateData.project = project;

    const updatedTask = await Task.findByIdAndUpdate(_id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) {
      return next(throwError(404, "Task not found"));
    }

    return res
      .status(200)
      .json({ message: "Task updated successfully", task: updatedTask });

  } catch (err) {
    console.error("Task Save Error:", err);
    next(throwError(500, "Failed to save task"));
  }
});

router.get(
  "/:projectId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId } = req.params;

      const tasks = await Task.find({ project: projectId }).populate(
        "assignee",
        "username"
      ).populate("reporter","username");

      res.status(200).json(tasks);
    } catch (error) {
      console.error("Get Tasks Error:", error);
      next(throwError(500, "Failed to fetch tasks"));
    }
  }
);

router.get(
  "/list/:projectId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId } = req.params;
      const tasks = await Task.find({ project: projectId }).populate("assignee","_id username").populate("reporter","_id username");

      res.status(200).json(tasks);
    } catch (error) {
      console.error("Get Tasks Error:", error);
      next(throwError(500, "Failed to fetch tasks"));
    }
  }
);


router.patch("/status", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id, status } = req.body;

    if (!_id || !status) {
      return next(throwError(400, "_id and status are required"));
    }

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return next(throwError(400, "Invalid Task ID"));
    }

    const updatedTask = await Task.findByIdAndUpdate(
      _id,
      { status },
      { new: true }
    );

    if (!updatedTask) {
      return next(throwError(404, "Task not found"));
    }

    res.status(200).json({ message: "Task status updated", task: updatedTask });
  } catch (err) {
    next(err);
  }
});



router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(throwError(400, "Invalid Task ID"));
    }

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return next(throwError(404, "Task not found"));
    }

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Delete Task Error:", err);
    next(throwError(500, "Failed to delete task"));
  }
});


export default router;
