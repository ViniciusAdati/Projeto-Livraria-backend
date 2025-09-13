import { pool } from "../config/database";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { RowDataPacket } from "mysql2";

export const register = async (
  nome: string,
  email: string,
  senhaPlana: string
) => {
  const salt = await bcrypt.genSalt(10);
  const senhaHash = await bcrypt.hash(senhaPlana, salt);

  try {
    const [result] = await pool.execute(
      "INSERT INTO Usuarios (nome, email, senha_hash) VALUES (?, ?, ?)",
      [nome, email, senhaHash]
    );
    return { success: true, userId: (result as any).insertId };
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("Este email já está cadastrado.");
    }
    throw new Error("Erro ao registrar usuário: " + error.message);
  }
};

export const login = async (email: string, senhaPlana: string) => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    "SELECT * FROM Usuarios WHERE email = ?",
    [email]
  );

  if (rows.length === 0) {
    throw new Error("Email ou senha inválidos.");
  }

  const usuario = rows[0];

  const senhaCorreta = await bcrypt.compare(senhaPlana, usuario.senha_hash);

  if (!senhaCorreta) {
    throw new Error("Email ou senha inválidos.");
  }

  const secretKey =
    "MINHA_CHAVE_SECRETA_SUPER_LONGA_E_ALEATORIA_PARA_O_PROJETO_WEB2";

  if (!secretKey) {
    throw new Error("Chave JWT não configurada.");
  }

  const token = jwt.sign({ id: usuario.id, email: usuario.email }, secretKey, {
    expiresIn: "8h",
  });

  delete usuario.senha_hash;

  return { usuario, token };
};
