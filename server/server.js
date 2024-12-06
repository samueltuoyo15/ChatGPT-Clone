import express from 'express';
import cors from 'cors';
import authRoute from './routes/authRoute.js';
import dotenv from 'dotenv';
import connectDb from './db/mongoose.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
dotenv.config();
const port = process.env.PORT;

const API_KEY = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
const app = express();

app.use(express.json());
app.use("/auth", authRoute)
app.use(cors())
connectDb();
app.post('/generate-content', async (req, res) => {
  const { prompt } = req.body;
  
  try {
    const result = await model.generateContent(prompt);
    res.json({ response: result.response.text() });
    console.log(result);
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
});