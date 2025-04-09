import { Request, Response } from 'express';
import { User, Conversation } from '../models/User';
import dotenv from 'dotenv';
import axios from 'axios';
import { OpenAI } from 'openai';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
    baseURL: process.env.OPENAI_ENDPOINT || ""
});

const MODEL_INSTRUCTION = process.env.MODEL_INSTRUCTION?.trim() || ""

export const createConversation = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId, groupName, messages } = req.body;
    if (!userId) return res.status(400).json({ error: 'User ID is required.' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const newConversation = new Conversation({
      userId,
      groupName: groupName || 'Untitled Conversation',
      messages: messages || [],
    });

    const savedConversation = await newConversation.save();
    user.conversations.push(savedConversation._id);
    await user.save();

    res.status(201).json(savedConversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ error: 'Failed to create conversation.' });
  }
};


export const saveConversation = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages must be an array.' });
    }

    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found.' });
    }

    conversation.messages.push(...messages);
    await conversation.save();

    res.status(200).json(conversation);
  } catch (error) {
    console.error('Error saving conversation:', error);
    res.status(500).json({ error: 'Failed to save conversation.' });
  }
};


export const getConversations = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const user = await User.findOne({ email }).populate('conversations');
    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.status(200).json(user.conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getConversationById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const conversation = await Conversation.findById(id);
    if (!conversation) return res.status(404).json({ message: 'Conversation not found.' });

    res.status(200).json(conversation);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteConversation = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const conversation = await Conversation.findById(id);
    if (!conversation) return res.status(404).json({ message: 'Conversation not found.' });

    if (conversation.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to delete this conversation.' });
    }

    await Conversation.findByIdAndDelete(id);
    user.conversations = user.conversations.filter((convId) => convId.toString() !== id);
    await user.save();

    res.status(200).json({ message: 'Conversation deleted successfully.' });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({ message: 'Failed to delete conversation.' });
  }
};


export const generate = async (req: Request, res: Response): Promise<any> => {
  try {
    const { prompt } = req.body;
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const stream = await openai.chat.completions.create({
        model: process.env.MODEL_NAME!,
        messages: [
          { role: 'system', content: MODEL_INSTRUCTION},
          { role: 'user', content: prompt },
        ],
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          res.write(`data: ${JSON.stringify({ response: content })}\n\n`);
        }
      }

      res.end()
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


 