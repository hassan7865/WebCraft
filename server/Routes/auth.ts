import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import User from "../Models/User.model";
import dotenv from "dotenv";
import { throwError } from "../Helper/error";

dotenv.config();

const route = express.Router();

route.post(
  "/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;

    try {
      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });

      if (existingUser) {
        if (existingUser.email === email)
          return next(throwError(400, "Email already exists"));

        else if(existingUser.username == username){
            return next(throwError(400, "Username already exists"));
        }
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });

      const savedUser = await newUser.save();

      const {
        username: userName,
        email: userEmail,
        _id,
      } = savedUser.toObject();
      const userInfo = { username: userName, email: userEmail, _id };

      return res.status(201).json({
        success: true,
        message: "User created successfully",
        user: userInfo,
      });
    } catch (error) {
      next(error);
    }
  }
);

route.post(
  "/signin",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(throwError(400, "Email and password are required"));
      }

      const validUser = await User.findOne({ email });
      if (!validUser) {
        return next(throwError(401, "Invalid credentials!"));
      }

      const isValidPassword = await bcrypt.compare(
        password,
        validUser.password
      );
      if (!isValidPassword) {
        return next(throwError(401, "Invalid credentials!"));
      }

      const { username, email: userEmail, _id } = validUser.toObject();
      const userInfo = { username, email: userEmail, _id };

      return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        user: userInfo,
      });
    } catch (error) {
      next(error);
    }
  }
);

route.get("/check-user", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email } = req.query;

   
    if (!username && !email) {
      return next(throwError(400, "(email or username) is required"));
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    return res.status(200).json({
      exists: !!existingUser,
      message: existingUser ? "User exists" : "User not found",
    });
  } catch (error) {
    next(error);
  }
});

route.post("/validate-credentials", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email && !password) {
      return next(throwError(400, "Email and password are required"));
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({ valid: false, message: "User not found" });
    }

    const isValid = await bcrypt.compare(password, user.password);

    return res.status(200).json({
      valid: isValid,
      message: isValid ? "Credentials are valid" : "Invalid password",
    });
  } catch (error) {
    next(error);
  }
});



export default route;
