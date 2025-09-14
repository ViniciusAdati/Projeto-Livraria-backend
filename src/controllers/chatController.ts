import { Response } from "express";
import { CustomRequest } from "../middleware/authMiddleware";
import * as chatService from "../services/chatService";

export const initiateChat = async (req: CustomRequest, res: Response) => {
  try {
    const myUserId = req.user!.id;
    const { otherUserId } = req.body;

    if (!otherUserId || myUserId === otherUserId) {
      return res
        .status(400)
        .json({ message: "ID de usuário receptor inválido." });
    }

    const negociacaoId = await chatService.findOrCreateNegociacao(
      myUserId,
      Number(otherUserId)
    );
    res.status(200).json({ negociacaoId });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getHistory = async (req: CustomRequest, res: Response) => {
  try {
    const negociacaoId = parseInt(req.params.negociacaoId, 10);
    const messages = await chatService.getMessageHistory(negociacaoId);
    res.status(200).json(messages);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
