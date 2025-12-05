# 🔐 Auth Service - Backend com PostgreSQL

Serviço de autenticação para o e-commerce, usando Node.js, Express e PostgreSQL.

Este serviço está localizado dentro da pasta `front` pois o projeto principal já possui microserviços separados.

## 📋 Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL instalado e rodando
- npm ou yarn

## 🚀 Instalação

1. **Instalar dependências:**
```bash
cd front/backend-auth
npm install
```

2. **Configurar banco de dados PostgreSQL:**

Crie um banco de dados:
```sql
CREATE DATABASE mcommerce_db;
```

3. **Configurar variáveis de ambiente:**

Copie o arquivo `env.template` para `.env`:
```bash
cp env.template .env
```

Edite o `.env` com suas configurações:
```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mcommerce_db
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
CORS_ORIGIN=http://localhost:5173
```

4. **Executar migração:**
```bash
npm run migrate
```

Isso criará a tabela `users` e inserirá usuários padrão:
- `vendedor@email.com` / `senha123` (VENDEDOR)
- `cliente@email.com` / `senha123` (CLIENTE)

## 🏃 Executar

**Modo desenvolvimento (com watch):**
```bash
npm run dev
```

**Modo produção:**
```bash
npm start
```

O servidor estará rodando em `http://localhost:3001`

## 📡 Endpoints

### POST /auth/login
Login de usuário

**Body:**
```json
{
  "email": "cliente@email.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "user": {
    "id": "1",
    "email": "cliente@email.com",
    "name": "Maria Cliente",
    "role": "CLIENTE"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST /auth/register
Registro de novo usuário

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123",
  "role": "CLIENTE"
}
```

### GET /auth/validate
Valida um token JWT

**Headers:**
```
Authorization: Bearer <token>
```

### GET /health
Verifica saúde do servidor e conexão com banco

## 🔒 Segurança

- Senhas são hasheadas com bcrypt (10 rounds)
- Tokens JWT com expiração de 7 dias
- Validação de dados de entrada
- CORS configurado

## 📝 Estrutura

```
backend-auth/
├── src/
│   ├── config/
│   │   └── database.js      # Configuração PostgreSQL
│   ├── controllers/
│   │   └── authController.js # Controllers de autenticação
│   ├── database/
│   │   └── migrate.js        # Script de migração
│   ├── routes/
│   │   └── authRoutes.js     # Rotas da API
│   └── server.js             # Servidor Express
├── package.json
└── README.md
```

