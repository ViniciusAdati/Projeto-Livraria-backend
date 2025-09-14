import { Router } from "express";
import { initiateChat, getHistory } from "../controllers/chatController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/initiate", authMiddleware, initiateChat);
router.get("/history/:negociacaoId", authMiddleware, getHistory);

export default router;
