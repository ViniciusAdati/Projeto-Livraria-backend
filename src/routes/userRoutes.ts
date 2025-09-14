import { Router } from "express";
import {
  getPublicUsers,
  getPublicUserById,
} from "../controllers/userController";

const router = Router();

router.get("/list", getPublicUsers);
router.get("/:id", getPublicUserById);

export default router;
