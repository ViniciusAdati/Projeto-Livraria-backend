import { Router } from "express";
import {
  addBook,
  getRecent,
  getMyInventory,
  deleteBook,
  getPublicInventoryByUser,
} from "../controllers/inventoryController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/recent", getRecent);
router.get("/by-user/:id", getPublicInventoryByUser);

router.get("/my-books", authMiddleware, getMyInventory);
router.post("/", authMiddleware, addBook);
router.delete("/item/:id", authMiddleware, deleteBook);

export default router;
