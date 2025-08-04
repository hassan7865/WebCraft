import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { throwError } from "../Helper/error";
import Project from "../Models/Project.model";
import User from "../Models/User.model"
import Task from "../Models/Task.model";
const router = express.Router();

router.post("/save", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id, key, name, description, createdBy, avatarUrl,status } = req.body;
    if (!key || !name || !createdBy)
      return next(throwError(400, "key, ProjectName, and Assignee  are required"));

    if (!_id) {
     

      const newProject = new Project({ key, name, description, createdBy, avatarUrl,status });
      await newProject.save();
       await User.findByIdAndUpdate(
        createdBy,
        { $addToSet: { projects: newProject._id } },
        { new: true }
      );
      return res.status(201).json({ message: "Project created successfully", project: newProject });
    } else {
      if (!mongoose.Types.ObjectId.isValid(_id)) return next(throwError(400, "Invalid _id"));

      const updated = await Project.findByIdAndUpdate(
        _id,
        { key, name, description,status},
        { new: true, runValidators: true }
      );

      if (!updated) return next(throwError(404, "Project not found"));

      return res.status(200).json({ message: "Project updated successfully", project: updated });
    }
  } catch (err) {
    next(err);
  }
});

router.get("/list", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== "string" || !mongoose.Types.ObjectId.isValid(userId)) {
      return next(throwError(400, "Invalid or missing userId"));
    }

    const user = await User.findById(userId).lean();
    if (!user) return next(throwError(404, "User not found"));

    const projectIds = user.projects || [];

    // 1. Fetch all relevant projects
    const projects = await Project.find({ _id: { $in: projectIds } })
      .populate("createdBy", "username email")
      .lean();

    // 2. Aggregate member counts for each project
    const memberCounts = await User.aggregate([
      { $match: { projects: { $in: projectIds } } },
      { $unwind: "$projects" },
      { $match: { projects: { $in: projectIds } } },
      {
        $group: {
          _id: "$projects",
          memberCount: { $sum: 1 },
        },
      },
    ]);

    const memberCountMap = memberCounts.reduce((acc, curr) => {
      acc[curr._id.toString()] = curr.memberCount;
      return acc;
    }, {} as Record<string, number>);

  
    const projectsWithProgress = await Promise.all(
      projects.map(async (project) => {
        const totalTasks = await Task.countDocuments({ project: project._id });
        const completedTasks = await Task.countDocuments({
          project: project._id,
          status: "done",
        });

        const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        const memberCount = memberCountMap[project._id.toString()] || 0;

        return {
          ...project,
          progress,
          memberCount,
        };
      })
    );

    res.status(200).json({ projects: projectsWithProgress });
  } catch (error) {
    next(error);
  }
});


router.get("/stats", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== "string" || !mongoose.Types.ObjectId.isValid(userId)) {
      return next(throwError(400, "Invalid or missing userId"));
    }

    const user = await User.findById(userId).lean();
    if (!user || !Array.isArray(user.projects) || user.projects.length === 0) {
      return res.status(200).json({
        totalProjects: 0,
        doneProjects: 0,
        activeProjects: 0,
        averageProgress: 0,
      });
    }

    const projectObjectIds = user.projects
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id));

    // Get all valid projects and their statuses
    const validProjects = await Project.find({ _id: { $in: projectObjectIds } }, { _id: 1, status: 1 }).lean();

    const existingProjectIds = validProjects.map((p) => p._id);
    if (existingProjectIds.length === 0) {
      return res.status(200).json({
        totalProjects: 0,
        doneProjects: 0,
        activeProjects: 0,
        averageProgress: 0,
      });
    }

    // Count based on project status
    const doneProjects = validProjects.filter((p) => p.status === "completed").length;
    const activeProjects = validProjects.filter((p) => p.status === "active").length;

    // Aggregate progress from TaskModel
    const results = await Task.aggregate([
      { $match: { project: { $in: existingProjectIds } } },
      {
        $group: {
          _id: "$project",
          totalTasks: { $sum: 1 },
          doneTasks: {
            $sum: {
              $cond: [{ $eq: ["$status", "done"] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          totalTasks: 1,
          doneTasks: 1,
          progress: {
            $cond: [
              { $gt: ["$totalTasks", 0] },
              { $multiply: [{ $divide: ["$doneTasks", "$totalTasks"] }, 100] },
              0,
            ],
          },
        },
      },
    ]);

    const statsMap = new Map(results.map((r) => [r._id.toString(), r]));

    let totalProgress = 0;
    for (const id of existingProjectIds) {
      const stat = statsMap.get(id.toString());
      totalProgress += stat?.progress || 0;
    }

    const totalProjects = existingProjectIds.length;
    const averageProgress = totalProjects > 0 ? Math.round(totalProgress / totalProjects) : 0;

    return res.status(200).json({
      totalProjects,
      doneProjects,
      activeProjects,
      averageProgress,
    });
  } catch (error) {
    next(error);
  }
});



router.get("/:projectId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params;


    const project = await Project.findById(projectId).populate("createdBy","username email");

    if (!project) {
      return next(throwError(404, "Project not found"));
    }

   
    const assignees = await User.find({ projects: projectId }).select('_id username email');

   
    res.status(200).json({
      project,
      assignees
    });
  } catch (error) {
    console.error("Get Project With Assignees Error:", error);
    next(throwError(500, "Failed to fetch project details with assignees"));
  }
});


router.delete("/:projectId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return next(throwError(400, "Invalid Project ID"));
    }

    const deletedProject = await Project.findByIdAndDelete(projectId);

    if (!deletedProject) {
      return next(throwError(404, "Project not found"));
    }

    res.status(200).json({ message: "Project deleted successfully", project: deletedProject });
  } catch (error) {
    console.error("Delete Project Error:", error);
    next(throwError(500, "Failed to delete project"));
  }
});



export default router;
