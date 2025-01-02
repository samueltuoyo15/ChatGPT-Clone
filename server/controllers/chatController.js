import {User, Conversation }from '../models/User.js';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
dotenv.config();

const API_KEY = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export const createConversation = async (req, res) => {
  try {
    const { userId, groupName, messages } = req.body;

    // Validate input
    if (!groupName) {
      return res.status(400).json({ error: 'Group name is required.' });
    }

    // Create a new conversation
    const newConversation = new Conversation({
      userId,
      groupName,
      messages: messages || [], 
    });

    const savedConversation = await newConversation.save();
    res.status(201).json(savedConversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ error: 'Failed to create conversation.' });
  }
};

export const saveConversation = async (req, res) => {
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
      messages: conversation.messages.map(msg => ({
        sender: msg.sender,
        content: msg.message || msg.content, // Handle both 'message' and 'content' properties
        timestamp: msg.timestamp || new Date()
      })),
    });

    await newConversation.save();
    user.conversations.push(newConversation._id);
    await user.save();

    res.status(200).json({ message: "Conversation saved successfully", conversationId: newConversation._id });
  } catch (error) {
    console.error("Error saving conversation:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};




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

export const getConversationById = async (req, res) => {
  const { id } = req.params;
  try {
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    const formattedConversation = {
      _id: conversation._id,
      groupName: conversation.groupName,
      messages: conversation.messages.map(msg => ({
        sender: msg.sender,
        message: msg.content,
        timestamp: msg.timestamp
      }))
    };
    res.json(formattedConversation);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const generate = async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ message: "Prompt is required" });
  }
  
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

