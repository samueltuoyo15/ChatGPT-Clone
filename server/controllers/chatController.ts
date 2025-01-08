import {Request, Response} from "express";
import { User, Conversation } from "../models/User";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { GoogleGenerativeAI } from "@google/generative-ai";
dotenv.config();

interface Messages{
  sender: string;
  content: string;
  timestamp: Date;
}

const API_KEY = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || 'null');
const textModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large";
const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY || 'null';

export const createConversation = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId, groupName, messages } = req.body;
    if (!groupName) return res.status(400).json({ error: "Group name is required." });

    const newConversation = new Conversation({
      userId,
      groupName,
      messages: messages || [],
    });

    const savedConversation = await newConversation.save();
    res.status(201).json(savedConversation);
  } catch (error: unknown) {
    console.error("Error creating conversation:", error);
    res.status(500).json({ error: "Failed to create conversation." });
  }
};

export const saveConversation = async (req: Request, res: Response): Promise<any> => {
  const { email, conversation } = req.body;
  if (!email || !conversation || !Array.isArray(conversation.messages)) {
    return res.status(400).json({ message: "Invalid input data" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const newConversation = new Conversation({
      userId: user._id,
      groupName: conversation.groupName || "Untitled Conversation",
      messages: conversation.messages.map((msg : Messages) => ({
        sender: msg.sender,
        content: msg.content,
        timestamp: msg.timestamp || new Date(),
      })),
    });

    await newConversation.save();
    user.conversations.push(newConversation._id);
    await user.save();

    res.status(200).json({ message: "Conversation saved successfully", conversationId: newConversation._id });
  } catch (error: any) {
    console.error("Error saving conversation:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const getConversations = async (req: Request, res: Response): Promise<any> => {
  const { email } = req.query;
  try {
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email }).populate("conversations");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user.conversations);
  } catch (error: any) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getConversationById = async (req: Request, res: Response): Promise<any>=> {
  const { id } = req.params;
  try {
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    const formattedConversation = {
      _id: conversation._id,
      groupName: conversation.groupName,
      messages: conversation.messages.map((msg : Messages) => ({
        sender: msg.sender,
        message: msg.content,
        timestamp: msg.timestamp,
      })),
    };
    res.json(formattedConversation);
  } catch (error: any) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteConversation = async (req : Request, res: Response): Promise<any>=> {
  const { email, conversationId } = req.body;
  if (!email || !conversationId) {
    return res.status(400).json({ message: "Email and conversation ID are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(404).json({ message: "Conversation not found" });

    if (conversation.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to delete this conversation" });
    }

    await Conversation.findByIdAndDelete(conversationId);
    user.conversations = user.conversations.filter(
      (convId) => convId.toString() !== conversationId.toString()
    );
    await user.save();

    res.status(200).json({ message: "Conversation deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting conversation:", error);
    res.status(500).json({ message: "Failed to delete conversation" });
  }
};

export const generate = async (req: Request, res: Response): Promise<any> => {
  const { prompt, type } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ message: "Invalid or missing prompt" });
  }
  
  const systemInstructions = `
    You are a smart and non friendly but 10x smart ChatGPT alternative bot created by OritseWeyinmi Samuel Tuoyo,
    a Mern Stack Developer.
  `;
  const userPrompt = `
    ${systemInstructions}

    User: ${prompt}
    Bot:
  `;

  try {
    if (type === "image") {
     const response = await fetch(HUGGING_FACE_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      });

      if (!response.ok) {
        throw new Error(`Hugging Face API error: ${response.statusText}`);
      }

      const buffer = await response.arrayBuffer();
      const base64Image = Buffer.from(buffer).toString("base64")
      const result = `data:image/png;base64,${base64Image}`
      //if (result.error) {
       // throw new Error(`Hugging Face API error: ${result.error}`);
      //}

     res.status(200).json({ response: result});
    
    } else {
      const result = await textModel.generateContent(userPrompt);
      res.status(200).json({ response: result.response.text().trim() });
    }
  } catch (error: any) {
    console.error("Error generating content:", error);
     res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

