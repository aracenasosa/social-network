import { Request, Response } from "express";
import { IUser } from "../types/user.types";
import { User } from "../models/user.model";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    const formatUsers = users.map((user: IUser) => ({
      id: user._id,
      fullName: user.fullName,
      userName: user.userName,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    return res.status(200).json(formatUsers);
  } catch (error: any) {
    console.log(error);
    return res
      .status(500)
      .json({ message: `Internal server error: ${error.message}` });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { userName, fullName, email, password } = req.body;

    // Validate email and username
    const parsedEmail = email.toLowerCase();
    const parsedUsername = userName.toLowerCase();
    const userEmail = await User.findOne({ email: parsedEmail });
    const userUsername = await User.findOne({
      userName: parsedUsername,
    });

    // Check if user already exists
    if (userEmail) {
      return res
        .status(400)
        .json({ message: "An user with that email already exists" });
    }

    // Check if username already exists
    if (userUsername) {
      return res
        .status(400)
        .json({ message: "An user with that username already exists" });
    }

    // Create new user
    const newUser = await User.create({
      userName: parsedUsername,
      fullName,
      email: parsedEmail,
      password,
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        userName: newUser.userName,
        email: newUser.email,
      },
    });
  } catch (error: any) {
    console.log(error);
    return res
      .status(500)
      .json({ message: `Internal server error: ${error.message}` });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { userNameOrEmail, password } = req.body;

    // Validate email and username
    const parsedUsernameOrEmail = userNameOrEmail.toLowerCase();

    const user = await User.findOne({
      $or: [
        { email: parsedUsernameOrEmail },
        { userName: parsedUsernameOrEmail },
      ],
    });

    // Check if user already exists
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if password is correct
    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(400).json({ message: "Invalid password" });
    }

    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        userName: user.userName,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.log(error);
    return res
      .status(500)
      .json({ message: `Internal server error: ${error.message}` });
  }
};
