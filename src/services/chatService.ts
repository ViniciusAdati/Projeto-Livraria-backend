import { pool } from "../config/database";
import { RowDataPacket } from "mysql2";

interface NegociacaoRow extends RowDataPacket {
  id: number;
  negociacao_id: number;
}

export const findOrCreateNegociacao = async (
  userId1: number,
  userId2: number
): Promise<number> => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const sqlFind = `
      SELECT np1.negociacao_id 
      FROM Negociacao_Participantes np1
      JOIN Negociacao_Participantes np2 ON np1.negociacao_id = np2.negociacao_id
      WHERE (np1.usuario_id = ? AND np2.usuario_id = ?) 
         OR (np1.usuario_id = ? AND np2.usuario_id = ?);
    `;

    const [rows] = await connection.execute<NegociacaoRow[]>(sqlFind, [
      userId1,
      userId2,
      userId2,
      userId1,
    ]);

    if (rows.length > 0) {
      await connection.commit();
      return rows[0].negociacao_id;
    }

    const [negResult]: any = await connection.execute(
      "INSERT INTO Negociacoes (status) VALUES (?)",
      ["Pendente"]
    );
    const negociacaoId = negResult.insertId;

    await connection.execute(
      "INSERT INTO Negociacao_Participantes (negociacao_id, usuario_id) VALUES (?, ?)",
      [negociacaoId, userId1]
    );
    await connection.execute(
      "INSERT INTO Negociacao_Participantes (negociacao_id, usuario_id) VALUES (?, ?)",
      [negociacaoId, userId2]
    );

    await connection.commit();
    return negociacaoId;
  } catch (error) {
    await connection.rollback();
    console.error("Erro ao buscar/criar negociação:", error);
    throw new Error("Falha ao iniciar chat.");
  } finally {
    connection.release();
  }
};

export const saveMessage = async (
  negociacaoId: number,
  remetenteId: number,
  conteudo: string
) => {
  try {
    const sql = `
      INSERT INTO Mensagens (negociacao_id, remetente_id, conteudo) 
      VALUES (?, ?, ?);
    `;
    await pool.execute(sql, [negociacaoId, remetenteId, conteudo]);
  } catch (error) {
    console.error("Erro ao salvar mensagem:", error);
    throw new Error("Falha ao salvar mensagem.");
  }
};

export const getMessageHistory = async (negociacaoId: number) => {
  try {
    const sql = `
      SELECT m.id, m.remetente_id, m.conteudo, m.timestamp, u.nome as remetente_nome
      FROM Mensagens m
      JOIN Usuarios u ON m.remetente_id = u.id
      WHERE m.negociacao_id = ?
      ORDER BY m.timestamp ASC;
    `;
    const [rows] = await pool.execute(sql, [negociacaoId]);
    return rows;
  } catch (error) {
    console.error("Erro ao buscar histórico de mensagens:", error);
    throw new Error("Falha ao buscar histórico.");
  }
};
