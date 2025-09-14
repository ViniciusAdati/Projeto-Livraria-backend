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
