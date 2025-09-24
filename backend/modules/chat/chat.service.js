import prisma from "../../core/db.js";

export async function getConversation(userId, peerId) {
  return prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, receiverId: peerId },
        { senderId: peerId, receiverId: userId }
      ]
    },
    orderBy: { createdAt: "asc" }
  });
}

export async function sendMessage({ text, senderId, receiverId }) {
  return prisma.message.create({
    data: {
      text,
      senderId,
      receiverId,
      status: "SENT"
    }
  });
}
