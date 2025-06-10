import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User";

const generateToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || "your_jwt_secret_key_here",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

export const register = async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      role,
      dateOfBirth,
      phoneNumber,
      location,
      preferences,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create new user
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      role,
      dateOfBirth,
      phoneNumber,
      location,
      preferences,
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Return user data (excluding password)
    const userData = user.toObject();
    delete userData.password;

    res.status(201).json({
      message: "User registered successfully",
      user: userData,
      token,
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = generateToken(user._id);

    // Return user data (excluding password)
    const userData = user.toObject();
    delete userData.password;

    res.json({
      message: "Login successful",
      user: userData,
      token,
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "firstName",
    "lastName",
    "phoneNumber",
    "profilePicture",
    "bio",
    "location",
    "preferences",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).json({ message: "Invalid updates" });
  }

  try {
    updates.forEach((update) => {
      (req.user as any)[update] = req.body[update];
    });

    await req.user.save();
    const userData = req.user.toObject();
    delete userData.password;

    res.json({
      message: "Profile updated successfully",
      user: userData,
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to update profile",
      error: error.message,
    });
  }
};
