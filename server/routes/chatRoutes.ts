import { createConversation, saveConversation, getConversations, deleteConversation, getConversationById, generate } from '../controllers/chatController';
import verifyAndAttachUser from "../middlewares/jwtVerification"
import { Router } from 'express';
const router = Router();

router.post('/conversations', verifyAndAttachUser, createConversation);
router.get('/conversations', verifyAndAttachUser, getConversations);
router.get('/conversations/:id', verifyAndAttachUser, getConversationById);
router.put('/conversations/:id', verifyAndAttachUser, saveConversation);
router.delete('/conversations/:id', verifyAndAttachUser, verifyAndAttachUser, deleteConversation);
router.post('/generate', generate);

export default router;