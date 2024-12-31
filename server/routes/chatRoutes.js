import {saveConversation, getConversations, getConversationById, generate, } from '../controllers/chatController.js';
import express from 'express';
const router = express.Router();

router.get('/fetchChats', getConversations);
router.post('/saveChats', saveConversation);
router.get('/fetchChatId/:id', getConversationById)
router.post('/gpt', generate)
export default router;