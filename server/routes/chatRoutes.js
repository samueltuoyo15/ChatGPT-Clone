import {saveConversation, getConversations, generate, } from '../controllers/chatController.js';
import express from 'express';
const router = express.Router();

router.get('/fetchChats', getConversations);
router.post('/saveChats', saveConversation);
router.post('/gpt', generate)
export default router;