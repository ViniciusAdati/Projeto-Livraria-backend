import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "12321",
  database: "db_troca_livros",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

console.log(
  "Pool do MySQL criada com SUCESSO (usando credenciais hard-coded)."
);
