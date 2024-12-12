import express from 'express';
import cors from 'cors';
import authRoute from './routes/authRoute.js';
import chatRoutes from './routes/chatRoutes.js';
import botRoute from './routes/botRoute.js';
import dotenv from 'dotenv';
import connectDb from './db/mongoose.js';
dotenv.config();
const port = process.env.PORT;

const app = express();

connectDb();
app.use(cors())
app.use(express.json());
app.use("/auth", authRoute)
app.use("/chats", chatRoutes)
app.use("/bot", botRoute)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
});