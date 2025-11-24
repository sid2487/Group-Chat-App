import { prisma } from "@repo/prisma/prisma";
import { Request, Response } from "express";

export const getMessages = async (req: Request, res: Response) => {
    // const roomId = Number(req.params.id);
    const currentUser = req.user;
    const slug = req.params.id;

    if(!currentUser){
        return res.status(403).json({ message: "User not Aailable"});
    };

    const room = await prisma.room.findUnique({
      where: {
        slug
      }
    });

    if(!room){
      return res.status(404).json({ message: "Room not Found" });
    };

    const roomId = room.id;

    try {
      const member = await prisma.roomMember.findFirst({
        where: {
          roomId,
          userId: currentUser,
        },
      });

      if (!member) {
        return res.status(403).json({ message: "Not allowed in this Room" });
      }

      const messages = await prisma.message.findMany({
        where: {
          roomId,
        },
        orderBy: {
          id: "desc",
        },
        include: {
          user: true,
        },
      });

      return res.status(201).json({
        success: true,
        messages,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went Wrong" });
    }
};

