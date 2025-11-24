import dotenv from "dotenv";
dotenv.config();
import { WebSocketServer, WebSocket, RawData } from "ws";
import jwt from "jsonwebtoken";
import { WS_JWT_SECRET } from "@repo/jwt-ws/ws_secret";
import { prisma } from "@repo/prisma/prisma";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  socket: WebSocket;
  rooms: string[];
  userId: string;
}

const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, WS_JWT_SECRET);
    if (!decoded || typeof decoded === "string") return null;
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

wss.on("connection", (socket, request) => {
  const url = request.url;
  if (!url) return;

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") ?? "";
  const userId = checkUser(token);

  if (!userId) {
    socket.close();
    return;
  }

  users.push({ userId, rooms: [], socket });

  socket.on("message", async (message: RawData) => {
    const parsed = JSON.parse(message.toString());

    
    if (parsed.type === "join") {
      const slug = parsed.roomSlug;
      const wsUser = users.find((u) => u.socket === socket);
      if (!wsUser) return;

      const room = await prisma.room.findUnique({ where: { slug } });
      if (!room) {
        return socket.send(
          JSON.stringify({
            type: "error",
            message: "Room does not Exist",
          })
        );
      }

      const roomId = room.id;

      const isMember = await prisma.roomMember.findFirst({
        where: { roomId, userId: wsUser.userId },
      });

      if (!isMember) {
        return socket.send(
          JSON.stringify({
            type: "error",
            message: "You cannot join this room",
          })
        );
      }

      if (!wsUser.rooms.includes(roomId.toString())) {
        wsUser.rooms.push(roomId.toString());
      }

      return socket.send(
        JSON.stringify({
          type: "joined",
          roomId,
        })
      );
    }

   
    if (parsed.type === "chat") {
      const slug = parsed.roomSlug;
      const content = parsed.content;
      const wsUser = users.find((u) => u.socket === socket);
      if (!wsUser) return;

      const room = await prisma.room.findUnique({ where: { slug } });
      if (!room) {
        return socket.send(
          JSON.stringify({
            type: "error",
            message: "Room does not Exist",
          })
        );
      }

      const roomId = room.id;

      const isMember = await prisma.roomMember.findFirst({
        where: { roomId, userId: wsUser.userId },
      });

      if (!isMember) {
        return socket.send(
          JSON.stringify({
            type: "error",
            message: "You cannot send Messages to this room",
          })
        );
      }

      if (!content.trim()) return;

      const savedMessage = await prisma.message.create({
        data: { roomId, userId: wsUser.userId, content },
        include: { user: true },
      });

      // Broadcast to room
      users.forEach((u) => {
        if (u.rooms.includes(roomId.toString())) {
          u.socket.send(
            JSON.stringify({
              type: "new-message",
              message: savedMessage,
            })
          );
        }
      });
    }

   
    if (parsed.type === "leave") {
      const slug = parsed.roomSlug;
      const wsUser = users.find((u) => u.socket === socket);
      if (!wsUser) return;

      const room = await prisma.room.findUnique({ where: { slug } });
      if (!room) {
        return socket.send(
          JSON.stringify({
            type: "error",
            message: "Room does not Exist",
          })
        );
      }

      const roomId = room.id;

      wsUser.rooms = wsUser.rooms.filter((id) => id !== roomId.toString());

      return socket.send(
        JSON.stringify({
          type: "left",
          roomId,
        })
      );
    }
  });

  socket.on("close", () => {
    const index = users.findIndex((u) => u.socket === socket);
    if (index !== -1) users.splice(index, 1);
  });
});
