import { Request, Response } from "express";
import * as authService from "../services/authService";

export const register = async (req: Request, res: Response) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res
        .status(400)
        .json({ message: "Todos os campos são obrigatórios." });
    }
    const result = await authService.register(nome, email, senha);
    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res
        .status(400)
        .json({ message: "Email e senha são obrigatórios." });
    }

    const result = await authService.login(email, senha);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(401).json({ message: error.message });
  }
};
