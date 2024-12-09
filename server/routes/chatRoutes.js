import {saveConversation, getConversations} from '../controllers/chatController.js';
import express from 'express';
const router = express.Router();

router.post('/fetchChats', getConversations);
router.post('/saveChats', saveConversation);

export default router;