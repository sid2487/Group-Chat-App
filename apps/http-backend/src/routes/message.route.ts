import express, { Router } from "express";
import { authenticate } from "../middlewares/authenticat.middleware";
import { getMessages } from "../controllers/messages.controller";

const router: Router = express.Router();

router.get("/getmessage/:id", authenticate, getMessages);


export default router;