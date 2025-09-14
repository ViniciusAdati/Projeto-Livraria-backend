import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mainRouter from "./routes";

const app = express();
const PORT = process.env.PORT || 3002;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());

app.use("/api", mainRouter);

app.get("/", (req, res) => {
  res.send("API do Projeto Web 2 (Troca de Livros) está funcionando!");
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando com sucesso na porta ${PORT}`);
  console.log("Banco de dados conectado (via pool).");
});
