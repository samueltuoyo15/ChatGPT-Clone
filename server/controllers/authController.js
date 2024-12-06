import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";
dotenv.config();

export const registerUser = async (req, res) => {
  try{
    const {email, password} = req.body;
    const existingUser = await User.findOne({email});
    if(existingUser){
      res.status(400).json({message: email + ' already exist'});
    }
    
    const encryptedPassword = await bcrypt.hash(password, 17);
    
    const newUser = User.create({
      email,
      password: encryptedPassword,
    });
    
    const token = jwt.sign({userId: newUser_.id}, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_SECRET_EXPIRES_IN,
    });
    
    res.status(200).json({
      message: "User was Created Successfully",
      success: true,
      token,
      user: {
        id: newUser_id,newUser_id,
        email: user.email,
      },
    })
  }catch(error){
    res.status(500).json({message: "internal server error"})
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_SECRET_EXPIRES_IN,
    })
    
    res.status(200).json({
      message: 'User Logged In Successfully',
      success: true,
      token,user: {
        id: newUser_id,newUser_id,
        email: user.email,
      },
    })
  } catch(error){
    res.status(500).json({message: "internal server error"})
  }
}