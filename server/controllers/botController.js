import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
dotenv.config();
const port = process.env.PORT;

const API_KEY = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });


export const generate = async (req, res) => {
  const { prompt } = req.body;
  
  const systemInstructions = `
  You are smart and friendly chatGPT alternative bot created by a 15 year old boy OritseWeyinmi Samuel Tuoyo 
  A Full Stack Developer 
  `
  const userPrompt = `
    ${systemInstructions}

    User: ${prompt}
    Bot:
  `;
  
  try {
    const result = await model.generateContent(userPrompt);
    res.json({ response: result.response.text() });
    console.log(result);
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
};


