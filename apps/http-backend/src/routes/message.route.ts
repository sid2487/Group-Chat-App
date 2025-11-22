import express, { Router } from "express";
import { authenticate } from "../middlewares/authenticat.middleware";
import { getMessages, sendMessages } from "../controllers/messages.controller";

const router: Router = express.Router();

router.get("/getmessage/:id", authenticate, getMessages);
router.post("/sendmessage/:id", authenticate, sendMessages);

export default router;