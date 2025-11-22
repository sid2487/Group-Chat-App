import express, { Router } from "express";
import { login, logout, me, register } from "../controllers/user.controller";
import { authenticate } from "../middlewares/authenticat.middleware";

const router: Router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticate, me)

export default router;