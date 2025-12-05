# 🧪 Guia de Testes - Integração Frontend com Microserviços

Este guia explica como testar todas as integrações implementadas.

## 📋 Pré-requisitos

1. **Java 17+** instalado
2. **Maven** instalado
3. **Node.js 18+** e **npm** instalados
4. **PostgreSQL** instalado e rodando
5. **Portas disponíveis:**
   - `8080` - API Gateway
   - `8761` - Eureka Discovery Server
   - `5432` - PostgreSQL (product_db)
   - `5433` - PostgreSQL (order_db)

## 🚀 Passo 1: Configurar e Iniciar o Banco de Dados

### Criar os bancos de dados PostgreSQL:

```sql
-- Conecte-se ao PostgreSQL como superusuário
CREATE DATABASE product_db;
CREATE DATABASE order_db;
```

### Verificar configurações nos arquivos `application.yml`:
- **product-service**: `jdbc:postgresql://localhost:5432/product_db`
- **order-service**: `jdbc:postgresql://localhost:5433/order_db`

## 🚀 Passo 2: Iniciar os Serviços Backend (Nesta Ordem)

Abra **4 terminais separados** e execute:

### Terminal 1: Discovery Server (Eureka)
```bash
cd DISCOVERY-SERVER-main/DISCOVERY-SERVER-main
./mvnw spring-boot:run
# ou no Windows:
mvnw.cmd spring-boot:run
```
**Aguarde até ver:** `Started DiscoveryServerApplication`

### Terminal 2: Product Service
```bash
cd product-service-main/product-service-main
./mvnw spring-boot:run
# ou no Windows:
mvnw.cmd spring-boot:run
```
**Aguarde até ver:** `Started ProductServiceApplication` e registro no Eureka

### Terminal 3: Order Service
```bash
cd order-service-main/order-service-main
./mvnw spring-boot:run
# ou no Windows:
mvnw.cmd spring-boot:run
```
**Aguarde até ver:** `Started OrderServiceApplication` e registro no Eureka

### Terminal 4: API Gateway
```bash
cd Api-gateway-main/Api-gateway-main
./mvnw spring-boot:run
# ou no Windows:
mvnw.cmd spring-boot:run
```
**Aguarde até ver:** `Started ApiGatewayApplication`

### ✅ Verificar se tudo está rodando:

1. **Eureka Dashboard**: Acesse http://localhost:8761
   - Deve mostrar: `api-gateway`, `product-service`, `order-service`

2. **Testar Product Service diretamente**:
   ```bash
   curl http://localhost:8080/api/products
   ```
   Deve retornar `[]` (array vazio se não houver produtos)

3. **Testar Order Service diretamente**:
   ```bash
   curl http://localhost:8080/api/orders
   ```
   Deve retornar `[]` (array vazio se não houver pedidos)

## 🚀 Passo 3: Configurar e Iniciar o Frontend

### Opção A: Modo Mock (Mais Rápido para Testes Iniciais)

1. **Criar arquivo `.env` no diretório `front/`**:
```env
VITE_USE_MOCK=true
VITE_API_BASE_URL=http://localhost:8080
```

2. **Instalar dependências** (se ainda não instalou):
```bash
cd front
npm install
```

3. **Iniciar o frontend**:
```bash
npm run dev
```

4. **Acessar**: http://localhost:5173 (ou a porta que o Vite indicar)

### Opção B: Modo Real (Integração com Backend)

1. **Criar arquivo `.env` no diretório `front/`**:
```env
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://localhost:8080
```

2. **Iniciar o frontend**:
```bash
cd front
npm run dev
```

## 🧪 Passo 4: Testar as Funcionalidades

### ✅ Teste 1: Autenticação Tradicional (Login/Registro)

1. Acesse http://localhost:5173/login
2. **Teste com credenciais mock**:
   - Email: `vendedor@email.com` / Senha: `senha123` (Vendedor)
   - Email: `cliente@email.com` / Senha: `senha123` (Cliente)
3. **Ou crie uma nova conta** em `/register`

### ✅ Teste 2: OAuth com GitHub (Modo Mock)

1. Acesse http://localhost:5173/login
2. Clique em **"Continuar com GitHub"**
3. **Em modo mock**: Deve fazer login automaticamente como "GitHub User"
4. **Em modo real**: Será redirecionado para GitHub (precisa configurar `VITE_GITHUB_CLIENT_ID`)

### ✅ Teste 3: OAuth com Google (Modo Mock)

1. Acesse http://localhost:5173/login
2. Clique em **"Continuar com Google"**
3. **Em modo mock**: Deve fazer login automaticamente como "Google User"
4. **Em modo real**: Será redirecionado para Google (precisa configurar `VITE_GOOGLE_CLIENT_ID`)

### ✅ Teste 4: Integração com Product Service

**Com `VITE_USE_MOCK=false`:**

1. **Criar um produto** (como Vendedor):
   - Faça login como vendedor
   - Acesse `/seller` (Dashboard do Vendedor)
   - Clique em "Adicionar Produto"
   - Preencha os dados e salve

2. **Ver produtos na loja**:
   - Faça logout
   - Acesse `/store` (Loja)
   - Deve mostrar os produtos criados

3. **Verificar no backend**:
   ```bash
   curl http://localhost:8080/api/products
   ```
   Deve retornar os produtos criados

### ✅ Teste 5: Integração com Order Service

**Com `VITE_USE_MOCK=false`:**

1. **Adicionar produtos ao carrinho**:
   - Acesse `/store`
   - Clique em um produto
   - Adicione ao carrinho

2. **Finalizar pedido**:
   - Acesse `/cart`
   - Clique em "Finalizar Compra"
   - Preencha os dados (simulado)
   - Clique em "Confirmar Pedido"

3. **Verificar no backend**:
   ```bash
   curl http://localhost:8080/api/orders
   ```
   Deve retornar os pedidos criados

4. **Verificar redução de estoque**:
   ```bash
   curl http://localhost:8080/api/products/{id}
   ```
   A quantidade (`quantity`) deve ter sido reduzida

## 🔍 Verificações Adicionais

### Verificar Logs dos Serviços

**Product Service**: Deve mostrar logs de:
- Criação de produtos
- Busca de produtos
- Redução de estoque

**Order Service**: Deve mostrar logs de:
- Criação de pedidos
- Chamadas ao Product Service (via Feign)
- Sucesso ou erro na criação

**API Gateway**: Deve mostrar logs de:
- Rotas acessadas
- Redirecionamentos para os serviços

### Testar Endpoints Diretamente

**Criar Produto**:
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Produto Teste",
    "description": "Descrição do produto",
    "price": 99.99,
    "skuCode": "SKU-TEST-001",
    "quantity": 10
  }'
```

**Criar Pedido**:
```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "orderLineItemsDtoList": [
      {
        "id": 1,
        "skuCode": null,
        "price": null,
        "quantity": 2
      }
    ]
  }'
```

## ⚠️ Troubleshooting

### Problema: Serviços não aparecem no Eureka

**Solução**:
1. Verifique se o Discovery Server está rodando
2. Verifique se as portas não estão em conflito
3. Aguarde alguns segundos para o registro

### Problema: Erro 404 ao acessar endpoints

**Solução**:
1. Verifique se o API Gateway está rodando na porta 8080
2. Verifique se os serviços estão registrados no Eureka
3. Verifique as rotas no `application.yml` do API Gateway

### Problema: Erro de conexão com PostgreSQL

**Solução**:
1. Verifique se o PostgreSQL está rodando
2. Verifique se os bancos `product_db` e `order_db` existem
3. Verifique usuário e senha nos `application.yml`
4. Verifique as portas (5432 para product, 5433 para order)

### Problema: OAuth não funciona em modo real

**Solução**:
1. Configure `VITE_GITHUB_CLIENT_ID` e `VITE_GOOGLE_CLIENT_ID` no `.env`
2. Configure os redirect URIs nos provedores OAuth:
   - GitHub: `http://localhost:5173/auth/callback/github`
   - Google: `http://localhost:5173/auth/callback/google`
3. O backend precisa ter os endpoints de callback implementados

### Problema: Frontend não conecta com backend

**Solução**:
1. Verifique se `VITE_USE_MOCK=false` no `.env`
2. Verifique se `VITE_API_BASE_URL=http://localhost:8080`
3. Verifique o console do navegador para erros CORS
4. Verifique se o API Gateway está acessível

## 📝 Checklist de Testes

- [ ] Discovery Server rodando (porta 8761)
- [ ] Product Service rodando e registrado no Eureka
- [ ] Order Service rodando e registrado no Eureka
- [ ] API Gateway rodando (porta 8080)
- [ ] Frontend rodando (porta 5173)
- [ ] Login tradicional funcionando
- [ ] Registro de usuário funcionando
- [ ] OAuth GitHub funcionando (mock ou real)
- [ ] OAuth Google funcionando (mock ou real)
- [ ] Criar produto funcionando
- [ ] Listar produtos funcionando
- [ ] Adicionar ao carrinho funcionando
- [ ] Criar pedido funcionando
- [ ] Redução de estoque funcionando

## 🎯 Próximos Passos

1. **Implementar autenticação no backend** (se ainda não tiver)
2. **Configurar OAuth no backend** para GitHub e Google
3. **Adicionar validações** nos endpoints
4. **Implementar tratamento de erros** mais robusto
5. **Adicionar testes automatizados**

---

**Boa sorte com os testes! 🚀**

