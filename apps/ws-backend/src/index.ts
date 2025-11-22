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
            }))
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

    }

    
  })

  
});
