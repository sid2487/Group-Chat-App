import express, { Router } from "express";
import { authenticate } from "../middlewares/authenticat.middleware";
import { createRoom, joinRoom, myRooms } from "../controllers/room.controller";

const router: Router = express.Router();

router.post("/createRoom", authenticate, createRoom);
router.post("/join/:id", authenticate, joinRoom);
router.get("/myroom", authenticate, myRooms);

export default router;