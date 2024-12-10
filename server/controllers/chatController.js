import User from '../models/User.js';

export const saveConversation = async (req, res) => {
  const { email, conversation } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Ensure the conversation has necessary fields
    if (!conversation || !conversation.groupName || !conversation.messages) {
      return res.status(400).json({ message: 'Invalid conversation data' });
    }

    // Check if the group chat already exists
    const existingGroup = user.conversation.find(
      (conv) => conv.groupName === conversation.groupName
    );

    if (existingGroup) {
      // If it exists, append new messages to the group
      existingGroup.messages.push(...conversation.messages);
    } else {
      // If it doesn't exist, add the new conversation
      user.conversation.push(conversation);
    }
    await user.save();
    res.status(200).json({ message: 'Conversation saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getConversations = async (req, res) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user.conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
