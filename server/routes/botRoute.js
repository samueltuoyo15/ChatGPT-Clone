import express from "express";
import {generate} from '../controllers/botController.js';

const router = express.Router();

router.post("/gpt", generate);

export default router