# Projeto API: Sistema de Troca de Livros (Back-End)

API RESTful e servidor de Chat (WebSocket) para o projeto da disciplina de Web 2. Este servidor gerencia usuários, inventário de livros e o sistema de chat em tempo real.

## Tecnologias Utilizadas

* **Node.js**
* **TypeScript**
* **Express.js** (Para o roteamento da API REST)
* **MySQL2** (Driver para conexão com o banco)
* **Socket.io** (Para o servidor de chat em tempo real)
* **JSON Web Token (JWT)** (Para autenticação de rotas)
* **bcrypt.js** (Para hashing de senhas)
* **ts-node** e **nodemon** (Para desenvolvimento)
* **CORS**

---

## Inicialização e Configuração

### 1. Banco de Dados

Este projeto requer um servidor MySQL rodando.

1.  No seu cliente MySQL (Workbench, DBeaver, etc.), crie um novo banco de dados (schema):
    ```sql
    CREATE DATABASE db_troca_livros;
    ```
2.  Use esse banco (`USE db_troca_livros;`) e execute o script SQL que foi fornecido anteriormente para criar todas as tabelas necessárias (`Usuarios`, `Livros`, `Inventario`, `Negociacoes`, `Mensagens`, `Negociacao_Participantes`, etc.).

### 2. Configuração de Credenciais

Este projeto está configurado para rodar com credenciais "hard-coded" (direto no código), pois o arquivo `.env` apresentou problemas de parsing no ambiente de desenvolvimento.

Para o projeto funcionar, você deve garantir que suas credenciais locais batem com as que estão no código:

1.  **Banco de Dados (Arquivo: `src/config/database.ts`):**
    * Verifique se o `pool` corresponde ao seu banco (ex: `user: 'root'`, `password: '123'`, `database: 'db_troca_livros'`).

2.  **Chave JWT (Arquivo: `src/services/authService.ts`):**
    * A chave secreta do JWT também está hard-coded neste arquivo.

3.  **Porta do Servidor (Arquivo: `src/server.ts`):**
    * O servidor está configurado para rodar (por padrão) na porta **3002** (para evitar conflitos com processos "fantasma" na porta 3001).

### 3. Instalação e Execução

1.  Clone o repositório (se aplicável) e entre na pasta do back-end.
2.  Instale todas as dependências:
    ```bash
    npm install
    ```
3.  Execute o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
4.  O servidor (API REST e Socket.io) estará rodando em: `http://localhost:3002`.

---

## Endpoints da API (Visão Geral)

* `POST /api/auth/register` (Público)
* `POST /api/auth/login` (Público)
* `GET /api/inventory/recent` (Público - Para o carrossel da Home)
* `GET /api/users/list` (Público - Para a grade "Comunidade")
* `GET /api/users/:id` (Público - Para a Página de Perfil)
* `GET /api/inventory/by-user/:id` (Público - Para a Página de Perfil)
* `GET /api/inventory/my-books` (Protegido - Para "Minha Estante")
* `POST /api/inventory` (Protegido - Para Adicionar Livro)
* `DELETE /api/inventory/item/:id` (Protegido - Para Deletar Livro)
* `POST /api/chat/initiate` (Protegido - Para criar/buscar sala de chat)
* `GET /api/chat/history/:negociacaoId` (Protegido - Para carregar histórico do chat)
