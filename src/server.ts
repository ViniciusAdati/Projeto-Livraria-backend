import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mainRouter from "./routes";
import http from "http";
import { Server } from "socket.io";
import { saveMessage } from "./services/chatService";

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

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(
    `--- [SOCKET.IO]: Um usuário se conectou. ID do Socket: ${socket.id} ---`
  );

  const userId = socket.handshake.query.userId;
  console.log(`--- [SOCKET.IO]: Usuário (ID: ${userId}) associado ao socket.`);

  socket.on("join_room", (negociacaoId: string) => {
    socket.join(negociacaoId);
    console.log(
      `--- [SOCKET.IO]: Usuário (ID: ${userId} / Socket: ${socket.id}) entrou na sala: ${negociacaoId} ---`
    );
  });

  socket.on("send_message", async (data) => {
    try {
      await saveMessage(data.negociacaoId, data.remetenteId, data.conteudo);
      socket.to(data.negociacaoId).emit("receive_message", data);
      console.log(
        `--- [SOCKET.IO]: Mensagem recebida e retransmitida para a sala: ${data.negociacaoId} ---`
      );
    } catch (error) {
      console.error("Erro no socket 'send_message':", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(
      `--- [SOCKET.IO]: Usuário (ID: ${userId} / Socket: ${socket.id}) desconectou. ---`
    );
  });
});

httpServer.listen(PORT, () => {
  console.log(
    `🚀 Servidor (Express + Socket.io) rodando com sucesso na porta ${PORT}`
  );
  console.log("Banco de dados conectado (via pool).");
});
