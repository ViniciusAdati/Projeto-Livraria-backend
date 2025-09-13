import { Router } from "express";
import authRoutes from "./authRoutes";
import inventoryRoutes from "./inventoryRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/inventory", inventoryRoutes);

export default router;
