import {saveConversation, getConversations} from '../controllers/chatController.js';

const router = express.Router();

router.post('/fetchChats', getConversations);
router.post('/saveChats', saveConversation);

export default router;