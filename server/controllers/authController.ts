import {Request, Response} from "express";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {User} from "../models/User";
dotenv.config();

export const registerUser = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: `${email} user already exists` });
    }
    const encryptedPassword = await bcrypt.hash(password, 10)
  
    const newUser = await User.create({ email, password: encryptedPassword });
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET || 'invalid',
      { expiresIn: process.env.JWT_SECRET_EXPIRES_IN! }
    );

    return res.status(201).json({
      message: "User was created successfully",
      success: true,
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req: Request, res: Response) : Promise<any> => {
  const { email, password} = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: email +" User does not exist" });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'invalid',
      { expiresIn: process.env.JWT_SECRET_EXPIRES_IN! }
    );

    return res.status(200).json({
      message: "User logged in successfully",
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
