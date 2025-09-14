import { Router } from "express";
import { getPublicUsers } from "../controllers/userController";

const router = Router();

router.get("/list", getPublicUsers);

export default router;
