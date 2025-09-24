import prisma from "../core/db.js";

export default function chatSocket(io) {
  io.on("connection", (socket) => {
    console.log("💬 Chat socket connected:", socket.id);

    // пользователь присоединяется к своей "комнате"
    socket.on("chat:join", ({ userId }) => {
      if (!userId) return;
      socket.join(`user:${userId}`);
      console.log(`👤 User ${userId} joined room user:${userId}`);
    });

    // пользователь отправляет сообщение
    socket.on("chat:send", async ({ text, senderId, receiverId }) => {
      if (!text || !senderId || !receiverId) return;

      const message = await prisma.message.create({
        data: { text, senderId, receiverId, status: "SENT" }
      });

      // отправляем обоим участникам
      io.to(`user:${senderId}`).emit("chat:new", message);
      io.to(`user:${receiverId}`).emit("chat:new", message);
    });

    // подтверждение прочтения
    socket.on("chat:read", async ({ messageId }) => {
      if (!messageId) return;

      const updated = await prisma.message.update({
        where: { id: messageId },
        data: { status: "READ" }
      });

      // оповестить обоих участников
      io.to(`user:${updated.senderId}`).emit("chat:read", updated);
      io.to(`user:${updated.receiverId}`).emit("chat:read", updated);
    });
  });
}
