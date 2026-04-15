import type { Server, Socket } from "socket.io";
import prisma from "./config/db.config.js";
import { produceMessage } from "./lib/kafka.producer.js";
import { consumeMessages } from "./lib/kafka.consumer.js";
import { logger } from "./lib/logger.js";
interface CustomSocket extends Socket {
  room?: string;
}

export function setUpSocket(io: Server) {
  consumeMessages(async (data) => {
    try {
      await prisma.chats.create({ data });
      io.to(data.group_id).emit("message", data);
      logger.info(`Message processed: ${data.id}`);
    } catch (error) {
      logger.error({ error }, "Kafka consumer error");
    }
  });

  io.use((socket: CustomSocket, next) => {
    const room = socket.handshake.auth.room || socket.handshake.headers.room;
    if (!room) {
      return next(new Error("Invalid room pass the code"));
    }
    socket.room = room;
    next();
  });

  io.on("connection", (socket: CustomSocket) => {
    if (socket.room) {
      socket.join(socket.room);
      logger.info(`A user connected to room ${socket.room}: ${socket.id}`);
    }

    socket.on("message", async (data) => {
      try {
        await produceMessage(data);
      } catch (error) {
        console.error("Producer error:", error);

        await prisma.chats.create({ data });
        io.to(socket.room!).emit("message", data);
      }
    });

    socket.on("disconnect", () => {
      logger.info(`A user disconnected: ${socket.id}`);
    });
  });
}
