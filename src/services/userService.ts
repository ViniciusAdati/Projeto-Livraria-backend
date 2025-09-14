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
