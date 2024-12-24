import {User, Conversation }from '../models/User.js';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const API_KEY = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// **Save Conversation**
export const saveConversation = async (req, res) => {
  const { email, conversation } = req.body;

  try {
    // Validate input
    if (!email || !conversation || !conversation.messages) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    // Find the user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate a unique title for the conversation based on the first 3 messages
    const firstThreeMessages = conversation.messages.slice(0, 3).map(msg => msg.content).join(' ');
    const titlePrompt = `Generate a concise and unique title for the following conversation snippet:\n\n"${firstThreeMessages}"`;
    const titleResult = await model.generateContent(titlePrompt);
    const groupName = titleResult.response.text().trim() || 'Untitled Conversation';

    // Check for existing conversation by title
    let existingConversation = await Conversation.findOne({ userId: user._id, groupName });

    if (existingConversation) {
      // Append new messages to the existing conversation
      existingConversation.messages.push(...conversation.messages);
    } else {
      // Create a new conversation
      existingConversation = new Conversation({
        userId: user._id,
        groupName,
        messages: conversation.messages,
      });
    }

    await existingConversation.save();

    // Add conversation reference to the user if it's new
    if (!user.conversations.includes(existingConversation._id)) {
      user.conversations.push(existingConversation._id);
      await user.save();
    }

    res.status(200).json({ message: 'Conversation saved successfully', groupName });
  } catch (error) {
    console.error('Error saving conversation:', error);
    res.status(500).json({ message: 'Internal server error' });
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
