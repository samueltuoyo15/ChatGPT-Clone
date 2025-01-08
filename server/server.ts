import express, {Application} from 'express';
import cors from 'cors';
import helmet from "helmet";
import authRoute from './routes/authRoute';
import chatRoutes from './routes/chatRoutes';
import dotenv from 'dotenv';
import connectDb from './db/mongoose';
dotenv.config();
const port = process.env.PORT;

const app: Application = express();

connectDb();
app.use(cors());
app.use(express.json());
app.use(helmet());

app.use("/auth", authRoute);
app.use("/chat", chatRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});