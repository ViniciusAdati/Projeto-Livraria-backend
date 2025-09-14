import { Router } from "express";
import authRoutes from "./authRoutes";
import inventoryRoutes from "./inventoryRoutes";
import userRoutes from "./userRoutes";
import chatRoutes from "./chatRoutes";
const router = Router();

router.use("/auth", authRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/users", userRoutes);
router.use("/chat", chatRoutes);

export default router;
