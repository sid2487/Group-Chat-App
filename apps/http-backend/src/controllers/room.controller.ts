import { createRoomSchema } from "@repo/backend-common/types";
import { prisma } from "@repo/prisma/prisma";
import { Request, Response } from "express";

export const createRoom = async (req: Request, res: Response) => {
  const parsedMessage = createRoomSchema.safeParse(req.body);
  if (!parsedMessage.success) {
    const error = parsedMessage.error.issues;
    return res.status(403).json({ error });
  }

  const currentUser = req.user;
  try {
    const { slug, description } = parsedMessage.data;
    if (!currentUser) {
      return res.status(404).json({ message: "User doesnot exist" });
    }

    const room = await prisma.room.create({
      data: {
        slug,
        description,
        userId: currentUser,
        members: {
          create: {
            userId: currentUser,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      room,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went Wrong" });
  }
};

export const joinRoom = async (req: Request, res: Response) => {
  const roomId = Number(req.params.id);
  const currentUser = req.user;

  if (!currentUser) {
    return res.status(404).json({ message: "User does not exist" });
  }

  try {
    const alreadyJoined = await prisma.roomMember.findFirst({
      where: {
        roomId,
        userId: currentUser,
      },
    });

    if (alreadyJoined) {
      return res.status(201).json({ message: "Already Joined the room" });
    }

    await prisma.roomMember.create({
      data: {
        roomId,
        userId: currentUser,
      },
    });

    return res.status(201).json({ success: true, message: "Joined the Room" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went Wrong" });
  }
};

export const myRooms = async (req: Request, res: Response) => {
  const userId = req.user;
  if (!userId) {
    return res.status(404).json({ message: "User not Exist" });
  }

  try {
    const rooms = await prisma.room.findMany({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
    });

    if(!rooms){
        return res.status(404).json({ message: "No Room found for you" });
    };

    return res.status(201).json({
        success: true,
        rooms,
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went Wrong" });
  }
};
