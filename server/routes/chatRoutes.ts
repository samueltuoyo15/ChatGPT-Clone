import {createConversation, saveConversation, getConversations, deleteConversation, getConversationById, generate, } from '../controllers/chatController';
import {Router} from 'express';

const router: Router = Router();

router.post('/newChat', createConversation.perform)
router.get('/fetchChats', getConversations.perform);
router.post('/saveChats', saveConversation.perform);
router.get('/fetchChatId/:id', getConversationById.perform)
router.delete('/conversation', deleteConversation.perform)
router.post('/gpt', generate.perform)
export default router;