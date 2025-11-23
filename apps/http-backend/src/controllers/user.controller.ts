import { Request, Response } from "express";
import { createUserSchema, loginSchema } from "@repo/backend-common/types";
import { prisma } from "@repo/prisma/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/jwt-common/jwt";
import { WS_SECRET } from "@repo/jwt-ws/ws_secret"

export const register = async (req: Request, res: Response) => {
  const parsedData = createUserSchema.safeParse(req.body);
  if (!parsedData.success) {
    const error = parsedData.error.issues;
    return res.status(403).json({ error });
  }
  const { name, email, password, avatarUrl } = parsedData.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(404).json({
        success: false,
        message: "Email already Exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        avatarUrl,
      },
    });

    const token = jwt.sign({userId: newUser.id}, JWT_SECRET, {expiresIn: "7d"});

     res.cookie("token", token, {
       httpOnly: true,
       secure: process.env.NODE_ENV === "production",
       maxAge: 7 * 24 * 60 * 60 * 1000,
     });

     const wsToken = jwt.sign({ userId: newUser.id }, WS_SECRET, {
       expiresIn: "15m",
     });

    return res.status(201).json({
        success: true,
        message: "User registered Successfully",
        newUser,
        token,
        wsToken
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Server Error"});
  }
};

export const login = async (req: Request, res: Response) => {
    const parsedData = loginSchema.safeParse(req.body);
    if(!parsedData.success){
        const error = parsedData.error.issues;
        return res.status(403).json({error});
    };

    const {email, password} = parsedData.data;
    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if(!user){
            return res.status(404).json({
                success: false,
                message: "Email not exist, register first"
            });
        };

        const checkPassword = await bcrypt.compare(password, user.password);
        if(!checkPassword){
            return res.status(404).json({ message: "Incorrect Credentials"})
        };

        const token = jwt.sign({userId: user.id}, JWT_SECRET, {expiresIn: "7d" });
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        const wsToken = jwt.sign({ userId: user.id }, WS_SECRET, {
          expiresIn: "15m"
        });


        return res.status(201).json({
            success: true,
            message: "Logged in Successfully",
            user,
            token,
            wsToken
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const logout = async (req: Request, res: Response) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return res.json({
      success: true,
      message: "Logged out successfully",
    });
};

export const me = async (req: Request, res: Response) => {
  const currentUser = req.user;

  const user = await prisma.user.findUnique({
    where: {
      id: currentUser
    }
  });

  if(!user){
    return res.status(403).json({ message: "User not Exist" });
  };

  return res.status(201).json({ user });
}