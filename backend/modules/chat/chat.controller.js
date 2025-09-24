import * as chatService from "./chat.service.js";

export async function getConversation(req, res, next) {
  try {
    const { userId, peerId } = req.params;
    const messages = await chatService.getConversation(userId, peerId);
    res.json(messages);
  } catch (err) {
    next(err);
  }
}

export async function sendMessage(req, res, next) {
  try {
    const { text, senderId, receiverId } = req.body;
    if (!text || !senderId || !receiverId) {
      return res.status(400).json({ error: "text, senderId, receiverId required" });
    }
    const message = await chatService.sendMessage({ text, senderId, receiverId });
    res.json(message);
  } catch (err) {
    next(err);
  }
}
