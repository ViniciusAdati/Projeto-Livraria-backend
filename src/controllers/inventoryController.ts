import { Request, Response } from "express";
import { CustomRequest } from "../middleware/authMiddleware";
import * as inventoryService from "../services/inventoryService";

export const addBook = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const bookData = req.body;
    const result = await inventoryService.addBookToInventory(userId, bookData);
    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getRecent = async (req: Request, res: Response) => {
  try {
    const books = await inventoryService.getRecentBooks();
    return res.status(200).json(books);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMyInventory = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const books = await inventoryService.getBooksByUserId(userId);
    return res.status(200).json(books);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteBook = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const inventoryId = parseInt(req.params.id, 10);

    if (isNaN(inventoryId)) {
      return res.status(400).json({ message: "ID do item inválido." });
    }

    const result = await inventoryService.deleteBookFromInventory(
      userId,
      inventoryId
    );
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};

export const getPublicInventoryByUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "ID de usuário inválido." });
    }
    const books = await inventoryService.getBooksByUserId(userId);
    return res.status(200).json(books);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
