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

    const exist = await prisma.room.findUnique({
      where: {
        slug
      }
    });

    if(exist){
      return res.status(400).json({ message: "Room with the slug already exists"});
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
  const currentUser = req.user;
  const { slug } = req.body;

  if(!currentUser){
    return;
  }

  const room = await prisma.room.findUnique({
    where: {
      slug,
    }
  });

  if(!room) {
    return res.status(404).json({ message: "Room not Found" });
  };

  const existing = await prisma.roomMember.findFirst({
    where: {
      userId: currentUser,
      roomId: room.id
    }
  });

  if(existing){
    return res.status(200).json({ message: "Already Joined" });
  };

  await prisma.roomMember.create({
    data: {
      userId: currentUser,
      roomId: room.id
    }
  });

  return res.status(200).json({ message: "Joinied Successfully" });
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
