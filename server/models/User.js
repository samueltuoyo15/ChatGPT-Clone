import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const conversationSchema = new mongoose.Schema({
  groupName: { type: String, required: true },
  participants: [{ type: String }], 
  messages: [messageSchema],
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: {type: String, required: true, unique: true},
  conversation: [conversationSchema],
});

const User = mongoose.model('User', userSchema);

export default User;
