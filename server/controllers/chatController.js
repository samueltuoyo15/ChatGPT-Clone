import {User, Conversation }from '../models/User.js';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {Readable} from 'stream'
dotenv.config();

const API_KEY = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// **Save Conversation**
export const saveConversation = async (req, res) => {
  const { email, conversation } = req.body;
  console.log("Request body:", req.body);

  if (!email || !conversation || !Array.isArray(conversation.messages)) {
    return res.status(400).json({ message: "Invalid input data" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const existingConversation = await Conversation.findOne({
      userId: user._id,
      groupName: conversation.groupName || "Untitled Conversation",
    });

    if (existingConversation) {
      existingConversation.messages.push(...conversation.messages);
      await existingConversation.save();
    } else {
      const newConversation = new Conversation({
        userId: user._id,
        groupName: conversation.groupName || "Untitled Conversation",
        messages: conversation.messages,
      });
      await newConversation.save();
      user.conversations.push(newConversation._id);
      await user.save();
    }
    
    console.log("Request body:", req.body);
    res.status(200).json({ message: "Conversation saved successfully" });
  } catch (error) {
    console.error("Error saving conversation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// **Get Conversations**
export const getConversations = async (req, res) => {
  const { email } = req.query;

  try {
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email }).populate('conversations');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user.conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// **Generate AI Response**
export const generate = async (req, res) => {
  const { prompt } = req.body;

  const systemInstructions = `
    You are a smart and friendly ChatGPT alternative bot created by OritseWeyinmi Samuel Tuoyo,
    a Full Stack Developer.
  `;
  const userPrompt = `
    ${systemInstructions}

    User: ${prompt}
    Bot:
  `;

  try {
    const result = await model.generateContent(userPrompt);
    res.status(200).json({ response: result.response.text().trim() });
    } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ message: 'Failed to generate content' });
  }
};
