import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface CustomRequest extends Request {
  user?: { id: number; email: string };
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Token de autenticação não fornecido." });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Formato de token inválido." });
  }

  const secretKey =
    process.env.JWT_SECRET ||
    "MINHA_CHAVE_SECRETA_SUPER_LONGA_E_ALEATORIA_PARA_O_PROJETO_WEB2";

  try {
    const decoded = jwt.verify(token, secretKey);

    (req as CustomRequest).user = decoded as { id: number; email: string };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
};
