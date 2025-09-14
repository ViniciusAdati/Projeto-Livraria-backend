import { pool } from "../config/database";

export const getAllUsersPublic = async () => {
  try {
    const sql = `
      SELECT id, nome, data_cadastro, cidade, estado 
      FROM Usuarios
      ORDER BY data_cadastro DESC;
    `;
    const [rows] = await pool.execute(sql);
    return rows;
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    throw new Error("Falha ao buscar lista de usuários.");
  }
};

export const getUserByIdPublic = async (userId: number) => {
  try {
    const sql = `
      SELECT id, nome, cidade, estado, data_cadastro 
      FROM Usuarios
      WHERE id = ?;
    `;
    const [rows]: any[] = await pool.execute(sql, [userId]);
    if (rows.length === 0) {
      throw new Error("Usuário não encontrado.");
    }
    return rows[0];
  } catch (error: any) {
    console.error("Erro ao buscar usuário por ID:", error);
    throw new Error(error.message || "Falha ao buscar dados do usuário.");
  }
};
