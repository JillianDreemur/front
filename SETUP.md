# 🚀 Guia de Configuração - PostgreSQL

Este guia explica como configurar o sistema completo com PostgreSQL.

## 📋 Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL instalado e rodando
- npm ou yarn

## 🔧 Passo 1: Configurar PostgreSQL

1. **Inicie o PostgreSQL** (se ainda não estiver rodando)

2. **Crie o banco de dados:**
```sql
-- Conecte-se ao PostgreSQL como superusuário
CREATE DATABASE mcommerce_db;
```

3. **Verifique se o banco foi criado:**
```sql
\l
-- Deve aparecer mcommerce_db na lista
```

## 🔧 Passo 2: Configurar o Backend

1. **Entre na pasta do backend de autenticação:**
```bash
cd front/backend-auth
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**

Crie um arquivo `.env` na pasta `front/backend-auth/`:
```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mcommerce_db
DB_USER=postgres
DB_PASSWORD=sua_senha_postgres_aqui
JWT_SECRET=seu_jwt_secret_super_seguro_aqui_mude_em_producao
CORS_ORIGIN=http://localhost:5173
```

**Importante:** Substitua `sua_senha_postgres_aqui` pela senha do seu PostgreSQL.

4. **Execute a migração do banco:**
```bash
npm run migrate
```

Isso criará:
- A tabela `users`
- Usuários padrão:
  - `vendedor@email.com` / `senha123` (VENDEDOR)
  - `cliente@email.com` / `senha123` (CLIENTE)

5. **Inicie o servidor:**
```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3001`

**Verifique se está funcionando:**
```bash
curl http://localhost:3001/health
# Deve retornar: {"status":"ok","database":"connected"}
```

## 🔧 Passo 3: Configurar o Frontend

1. **Entre na pasta do frontend:**
```bash
cd front
```

2. **Configure as variáveis de ambiente:**

Crie ou edite o arquivo `.env` na pasta `front/`:
```env
VITE_AUTH_API_URL=http://localhost:3001
VITE_API_BASE_URL=http://localhost:8080
```

3. **Instale as dependências (se ainda não instalou):**
```bash
npm install
```

4. **Inicie o frontend:**
```bash
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

## ✅ Testar

1. **Acesse:** http://localhost:5173

2. **Faça login com:**
   - Email: `cliente@email.com`
   - Senha: `senha123`

3. **Ou crie uma nova conta** em `/register`

## 🔍 Verificar se está tudo funcionando

### Backend
- ✅ Servidor rodando na porta 3001
- ✅ Health check: http://localhost:3001/health
- ✅ Banco de dados conectado

### Frontend
- ✅ Consegue fazer login
- ✅ Consegue criar nova conta
- ✅ Token é salvo e validado

## 🐛 Troubleshooting

### Erro: "Cannot connect to PostgreSQL"
- Verifique se o PostgreSQL está rodando
- Verifique as credenciais no `.env`
- Verifique se o banco `mcommerce_db` foi criado

### Erro: "Port 3001 already in use"
- Mude a porta no `.env` do backend
- Atualize `VITE_AUTH_API_URL` no frontend

### Erro: "CORS error"
- Verifique se `CORS_ORIGIN` no backend está correto
- Verifique se a URL do frontend está correta

## 📝 Estrutura do Projeto

```
.
└── front/                # Frontend React
    ├── backend-auth/     # Serviço de autenticação (dentro do front)
    │   ├── src/
    │   │   ├── config/       # Configuração do banco
    │   │   ├── controllers/ # Controllers de autenticação
    │   │   ├── routes/      # Rotas da API
    │   │   └── server.js     # Servidor Express
    │   └── package.json
    └── src/
        └── services/
            └── authService.ts
```

## 🔒 Segurança

⚠️ **Importante para produção:**
- Use um `JWT_SECRET` forte e aleatório
- Use HTTPS
- Configure CORS adequadamente
- Use variáveis de ambiente seguras
- Considere usar um gerenciador de segredos (ex: AWS Secrets Manager)

