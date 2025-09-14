import { Request, Response } from "express";
import * as userService from "../services/userService";

export const getPublicUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsersPublic();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPublicUserById = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "ID de usuário inválido." });
    }
    const user = await userService.getUserByIdPublic(userId);
    res.status(200).json(user);
  } catch (error: any) {
    if (error.message === "Usuário não encontrado.") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};
