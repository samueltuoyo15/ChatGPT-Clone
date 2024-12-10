import User from '../models/User.js';

export const saveConversation = async (req, res) => {
  const { email, conversation } = req.body;
  try{
    const user = await User.findOne({email});
    if(!user) return res.status(404).json({message: 'user not found'});
    user.conversation.push(...conversation);
    await user.save();
    res.status(200).json({message: 'conversation saved successfully'});
  }catch(error){
    console.error(error);
    res.status(500).json({message: 'internal server error'});
  }
}

export const getConversations = async (req, res) => {
  const { email } = req.query;
  try{
    const user = await User.findOne({email});
    if(!user) return res.status(404).json({message: 'user not found'});
    res.status(200).json(user.conversation);
  }catch(error){
    console.error(error);
    res.status(500).json({message: 'internal server error'});
  }
}