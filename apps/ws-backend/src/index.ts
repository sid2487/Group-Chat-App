import { WebSocketServer, WebSocket, RawData } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/jwt-common/jwt";
import { prisma } from "@repo/prisma/prisma";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  socket: WebSocket;
  rooms: string[];
  userId: string;
};

const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "string") {
      return null;
    }

    if (!decoded || !decoded.userId) {
      return null;
    }

    return decoded.userId;
  } catch (error) {
    return null;
  }
}

wss.on("connection", (socket, request) => {
  const url = request.url;
  if(!url){
    return;
  };

  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get("token") ?? "";
  const userId = checkUser(token);

  if(userId === null){
    socket.close();
    return null;
  }

  users.push({
    userId,
    rooms: [],
    socket
  });

  socket.on("message", async (message: RawData) => {
    const string = message.toString();
    const parsedMessage = JSON.parse(string);

    if(parsedMessage.type === "join"){
        const roomId = Number(parsedMessage.roomId);
        const wsUser = users.find(x => x.socket === socket);

        if(!wsUser) return;

        const roomExist = await prisma.room.findUnique({
            where: {
                id: roomId
            }
        });

        if (!roomExist) {
            socket.send(JSON.stringify({
                type: "room-not-found",
                roomId
            }));
            return;
        };


        const isMember = await prisma.roomMember.findFirst({
            where: {
                roomId,
                userId: wsUser.userId,
            }
        });

        if(!isMember){
            socket.send(JSON.stringify({
                type: "not-authorized",
                message: "you are not allowed to join this room"
            }));
            return;
        };

        if(!wsUser.rooms.includes(roomId.toString())){
            wsUser.rooms.push(roomId.toString());
        }

        socket.send(JSON.stringify({
            type: "joined",
            roomId
        }));

    };

    if(parsedMessage.type === "chat"){
      const roomId = parsedMessage.roomId;
      const content = parsedMessage.content;
      const wsUser = users.find(u => u.socket === socket);

      if(!wsUser) return;

      const roomExist = await prisma.room.findUnique({
        where: {
          id: roomId,
        }
      });
      if(!roomExist){
        socket.send(JSON.stringify({
          type: "error",
          message: "Room does not Exist"
        }));
        return;
      };

      const isMember = await prisma.roomMember.findFirst({
        where: {
          roomId,
          userId: wsUser.userId,
        }
      });

      if(!isMember){
        socket.send(JSON.stringify({
          type: "error",
          message: "You cannot send Messages to this room",
        }))
        return;
      };

      if(!content || content.trim() === "") return;

      const savedMessage = await prisma.message.create({
        data: {
          roomId,
          userId: wsUser.userId,
          content
        },
        include: { user: true }
      });

      users.forEach(u => {
        if(u.rooms.includes(roomId.toString())){
          u.socket.send(JSON.stringify({
            type: "new-message",
            message: savedMessage
          }))
        }
      })

    };

    if(parsedMessage.type === "leave"){
      const wsUser = users.find(u => u.socket === socket);
      const roomId = parsedMessage.roomId;
      if(!wsUser) return;

      const roomExist = await prisma.room.findUnique({
        where: {
          id: roomId
        }
      });

      if(!roomExist){
        socket.send(JSON.stringify({
          type: "room-not-found",
          message: "Room can not Found",
        }));
        return;
      };

      const isMember = await prisma.roomMember.findFirst({
        where: {
          roomId,
          userId: wsUser.userId,
        }
      });

      if(!isMember){
        socket.send(JSON.stringify({
          type: "error",
          message: "You cannot Leave this room",
        }));
        return;
      };

      wsUser.rooms = wsUser.rooms.filter(u => u !== parsedMessage.roomId.toString() )

      socket.send(
        JSON.stringify({
          type: "left",
          roomId,
        })
      );

    }

    
  })

  socket.on("close", () => {
    const index = users.findIndex((u) => u.socket === socket);
    if (index !== -1) {
      users.splice(index, 1);
    }
  });


  
});
