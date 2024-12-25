import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['user', 'ai'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const conversationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  groupName: { type: String, default: "Untitled Conversation" },
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now },
});


const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
  },
  password: { type: String, required: true }, 
  conversations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' }],
});


const User = mongoose.model('User', userSchema);
const Conversation = mongoose.model('Conversation', conversationSchema);

export { User, Conversation };
