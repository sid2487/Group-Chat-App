import { createRoomSchema } from "@repo/backend-common/types";
import { prisma } from "@repo/prisma/prisma";
import { Request, Response } from "express";

export const room = async (req: Request, res: Response) => {
    const parsedMessage = createRoomSchema.safeParse(req.body);
    if(!parsedMessage.success){
        const error = parsedMessage.error.issues;
        return res.status(403).json({error});
    };

    const currentUser = req.user;
    try {
        const { name, description } = parsedMessage.data;
        if (!currentUser) {
          return res.status(404).json({ message: "User doesnot exist" });
        }

        const roomId = await prisma.room.create({
          data: {
            slug: name,
            description,
            userId: currentUser,
          },
        });

        return res.status(201).json({
          success: true,
          roomId,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went Wrong" });
    }
}