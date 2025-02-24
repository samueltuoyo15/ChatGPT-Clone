import { createConversation, saveConversation, getConversations, deleteConversation, getConversationById, generate } from '../controllers/chatController';
import { Router } from 'express';

const router = Router();

router.post('/conversations', createConversation);
router.get('/conversations', getConversations);
router.get('/conversations/:id', getConversationById);
router.put('/conversations/:id', saveConversation);
router.delete('/conversations/:id', deleteConversation);
router.post('/generate', generate);

export default router;