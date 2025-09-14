import { pool } from "../config/database";

interface BookInputData {
  googleBookId: string;
  title: string;
  author: string;
  imageUrl: string;
  condition: string;
  tradeValue: number;
  description: string;
}

export const addBookToInventory = async (
  userId: number,
  bookData: BookInputData
) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const bookSql = `
      INSERT INTO Livros (google_book_id, titulo, autor, url_capa, descricao_geral)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        titulo = VALUES(titulo), autor = VALUES(autor), url_capa = VALUES(url_capa);
    `;
    await connection.execute(bookSql, [
      bookData.googleBookId,
      bookData.title,
      bookData.author,
      bookData.imageUrl,
      bookData.description || null,
    ]);

    const [rows]: any[] = await connection.execute(
      "SELECT id FROM Livros WHERE google_book_id = ?",
      [bookData.googleBookId]
    );
    const livroId = rows[0].id;

    const inventorySql = `
      INSERT INTO Inventario (usuario_id, livro_id, estado_conservacao, valor_troca, descricao_usuario)
      VALUES (?, ?, ?, ?, ?)
    `;
    await connection.execute(inventorySql, [
      userId,
      livroId,
      bookData.condition,
      bookData.tradeValue,
      bookData.description,
    ]);

    await connection.commit();
    return { success: true, message: "Livro adicionado ao inventário." };
  } catch (error) {
    await connection.rollback();
    console.error("Erro ao adicionar livro:", error); // (Mantemos logs de ERRO reais)
    throw new Error("Falha ao salvar o livro no banco de dados.");
  } finally {
    connection.release();
  }
};

export const deleteBookFromInventory = async (
  userId: number,
  inventoryId: number
) => {
  try {
    const sql = `
      DELETE FROM Inventario 
      WHERE id = ? AND usuario_id = ?;
    `;

    const [result]: any = await pool.execute(sql, [inventoryId, userId]);

    if (result.affectedRows > 0) {
      return { success: true, message: "Item removido com sucesso." };
    } else {
      throw new Error(
        "Item não encontrado ou usuário não autorizado para deletar este item."
      );
    }
  } catch (error: any) {
    console.error("Erro ao deletar item do inventário:", error); // (Mantemos logs de ERRO reais)
    throw new Error(error.message || "Falha ao deletar o item.");
  }
};

export const getRecentBooks = async () => {
  try {
    const sql = `
      SELECT
        inv.id as inventario_id,
        inv.valor_troca,
        inv.estado_conservacao,
        inv.descricao_usuario,
        l.titulo,
        l.autor,
        l.url_capa,
        u.nome as nome_usuario
      FROM Inventario AS inv
      JOIN Livros AS l ON inv.livro_id = l.id
      JOIN Usuarios AS u ON inv.usuario_id = u.id
      WHERE inv.disponivel_para_troca = true
      ORDER BY inv.data_adicao DESC
      LIMIT 10;
    `;

    const [rows] = await pool.execute(sql);
    return rows;
  } catch (error) {
    console.error("Erro ao buscar inventário recente:", error);
    throw new Error("Falha ao buscar livros recentes.");
  }
};

export const getBooksByUserId = async (userId: number) => {
  try {
    const sql = `
      SELECT
        inv.id as inventario_id,
        inv.valor_troca,
        inv.estado_conservacao,
        inv.descricao_usuario,
        l.titulo,
        l.autor,
        l.url_capa,
        u.nome as nome_usuario
      FROM Inventario AS inv
      JOIN Livros AS l ON inv.livro_id = l.id
      JOIN Usuarios AS u ON inv.usuario_id = u.id
      WHERE inv.usuario_id = ?
      ORDER BY inv.data_adicao DESC;
    `;

    const [rows] = await pool.execute(sql, [userId]);
    return rows;
  } catch (error) {
    console.error("Erro ao buscar inventário do usuário:", error);
    throw new Error("Falha ao buscar livros deste usuário.");
  }
};
