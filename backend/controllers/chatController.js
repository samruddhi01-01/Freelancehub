const Chat = require('../models/Chat');
const Project = require('../models/Project');

// @route POST /api/chats/:projectId/start  (client or freelancer, must be project-related)
const startOrGetChat = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { participantId } = req.body; // the other user in the conversation

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const isParticipant =
      String(project.client) === String(req.user._id) ||
      String(project.hiredFreelancer) === String(req.user._id);
    if (!isParticipant && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized for this project chat' });
    }

    let chat = await Chat.findOne({
      project: projectId,
      participants: { $all: [req.user._id, participantId] },
    });

    if (!chat) {
      chat = await Chat.create({
        project: projectId,
        participants: [req.user._id, participantId],
        messages: [],
      });
    }

    res.json({ chat });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/chats/mine
const getMyChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({ participants: req.user._id })
      .populate('participants', 'name avatarUrl')
      .populate('project', 'title')
      .sort({ updatedAt: -1 });
    res.json({ chats });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/chats/:chatId/messages
const sendMessage = async (req, res, next) => {
  try {
    const { text, fileUrl } = req.body;
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    if (!chat.participants.some((p) => String(p) === String(req.user._id))) {
      return res.status(403).json({ message: 'Not a participant of this chat' });
    }

    const message = { sender: req.user._id, text, fileUrl: fileUrl || null, readBy: [req.user._id] };
    chat.messages.push(message);
    await chat.save();

    res.status(201).json({ message: chat.messages[chat.messages.length - 1] });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/chats/:chatId/messages
const getMessages = async (req, res, next) => {
  try {
    const { page = 1, limit = 30 } = req.query;
    const chat = await Chat.findById(req.params.chatId).populate('messages.sender', 'name avatarUrl');
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    if (!chat.participants.some((p) => String(p) === String(req.user._id))) {
      return res.status(403).json({ message: 'Not a participant of this chat' });
    }

    // Simple pagination from the end of the array (most recent messages first)
    const total = chat.messages.length;
    const start = Math.max(0, total - page * limit);
    const end = total - (page - 1) * limit;
    const messages = chat.messages.slice(start, end);

    res.json({ messages, total });
  } catch (err) {
    next(err);
  }
};

module.exports = { startOrGetChat, getMyChats, sendMessage, getMessages };
