import { JWT_SECRET } from "@repo/jwt-common/jwt";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(404).json({ message: "No token Provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "string") {
      throw new Error("Invalid token Format");
    }
    req.user = decoded.userId; // or else we can also do (decoded.userId as JwtPayload)
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
