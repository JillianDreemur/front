# 🧪 Como Testar - Resumo Executivo

## ⚡ Início Rápido (Modo Mock - 2 minutos)

### 1. Frontend apenas (mais rápido)
```bash
cd front
# Criar arquivo .env
echo "VITE_USE_MOCK=true" > .env
echo "VITE_API_BASE_URL=http://localhost:8080" >> .env

# Instalar e rodar
npm install
npm run dev
```

**Acesse:** http://localhost:5173

✅ **Teste:**
- Login: `cliente@email.com` / `senha123`
- OAuth GitHub/Google (funciona em modo mock)
- Navegar pela loja
- Adicionar ao carrinho

---

## 🔌 Teste Completo com Backend (10 minutos)

### Passo 1: Banco de Dados
```sql
-- No PostgreSQL
CREATE DATABASE product_db;
CREATE DATABASE order_db;
```

### Passo 2: Iniciar Serviços (4 terminais)

**Terminal 1:**
```bash
cd DISCOVERY-SERVER-main/DISCOVERY-SERVER-main
mvnw.cmd spring-boot:run
```
Aguarde: `Started DiscoveryServerApplication`

**Terminal 2:**
```bash
cd product-service-main/product-service-main
mvnw.cmd spring-boot:run
```
Aguarde: `Started ProductServiceApplication`

**Terminal 3:**
```bash
cd order-service-main/order-service-main
mvnw.cmd spring-boot:run
```
Aguarde: `Started OrderServiceApplication`

**Terminal 4:**
```bash
cd Api-gateway-main/Api-gateway-main
mvnw.cmd spring-boot:run
```
Aguarde: `Started ApiGatewayApplication`

### Passo 3: Verificar Serviços

1. **Eureka Dashboard:** http://localhost:8761
   - Deve mostrar 3 serviços registrados

2. **Testar API:**
```bash
curl http://localhost:8080/api/products
# Deve retornar: []
```

### Passo 4: Frontend

```bash
cd front
# Criar arquivo .env
echo "VITE_USE_MOCK=false" > .env
echo "VITE_API_BASE_URL=http://localhost:8080" >> .env

npm run dev
```

**Acesse:** http://localhost:5173

---

## ✅ Checklist de Testes

### Autenticação
- [ ] Login com email/senha funciona
- [ ] Registro de novo usuário funciona
- [ ] OAuth GitHub funciona (mock ou real)
- [ ] OAuth Google funciona (mock ou real)
- [ ] Logout funciona

### Produtos (Vendedor)
- [ ] Criar produto funciona
- [ ] Listar produtos do vendedor funciona
- [ ] Editar produto funciona
- [ ] Deletar produto funciona

### Loja (Cliente)
- [ ] Listar todos os produtos funciona
- [ ] Ver detalhes do produto funciona
- [ ] Adicionar ao carrinho funciona
- [ ] Remover do carrinho funciona
- [ ] Atualizar quantidade funciona

### Pedidos
- [ ] Finalizar compra funciona
- [ ] Pedido é criado no backend
- [ ] Estoque é reduzido automaticamente
- [ ] Ver histórico de pedidos funciona

---

## 🔍 Verificações Importantes

### 1. Verificar Logs dos Serviços

**Product Service** deve mostrar:
```
INFO: Produto criado com sucesso
INFO: Buscando produto por ID: 1
```

**Order Service** deve mostrar:
```
INFO: Pedido ORD-xxx realizado com sucesso
INFO: Reduzindo quantidade do produto 1
```

**API Gateway** deve mostrar:
```
INFO: Rota /api/products/** redirecionada para product-service
INFO: Rota /api/orders/** redirecionada para order-service
```

### 2. Testar Endpoints Diretamente

**Criar Produto:**
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","description":"Desc","price":99.99,"skuCode":"SKU-001","quantity":10}'
```

**Listar Produtos:**
```bash
curl http://localhost:8080/api/products
```

**Criar Pedido:**
```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -d '{"orderLineItemsDtoList":[{"id":1,"skuCode":null,"price":null,"quantity":2}]}'
```

**Listar Pedidos:**
```bash
curl http://localhost:8080/api/orders
```

---

## 🐛 Problemas Comuns

### ❌ "Serviços não aparecem no Eureka"
**Solução:** Aguarde 30-60 segundos após iniciar cada serviço

### ❌ "Erro 404 ao acessar /api/products"
**Solução:** 
1. Verifique se API Gateway está na porta 8080
2. Verifique se product-service está registrado no Eureka
3. Verifique as rotas no `application.yml` do API Gateway

### ❌ "Erro de conexão com PostgreSQL"
**Solução:**
1. Verifique se PostgreSQL está rodando
2. Verifique se os bancos `product_db` e `order_db` existem
3. Verifique usuário/senha nos `application.yml`

### ❌ "Frontend não conecta com backend"
**Solução:**
1. Verifique se `VITE_USE_MOCK=false` no `.env`
2. Verifique se `VITE_API_BASE_URL=http://localhost:8080`
3. Abra o Console do navegador (F12) e veja os erros
4. Verifique CORS (se necessário, configure no backend)

### ❌ "OAuth não funciona"
**Solução:**
- **Modo Mock:** Deve funcionar automaticamente
- **Modo Real:** 
  1. Configure `VITE_GITHUB_CLIENT_ID` e `VITE_GOOGLE_CLIENT_ID`
  2. Configure redirect URIs nos provedores OAuth
  3. Backend precisa ter endpoints de callback implementados

---

## 📊 Ordem de Inicialização Recomendada

```
1. PostgreSQL (banco de dados)
2. Discovery Server (Eureka) - porta 8761
3. Product Service - porta aleatória
4. Order Service - porta aleatória  
5. API Gateway - porta 8080
6. Frontend - porta 5173
```

**Tempo total:** ~2-3 minutos para todos os serviços iniciarem

---

## 🎯 Teste de Integração Completo

1. ✅ Iniciar todos os serviços
2. ✅ Criar produto via frontend (como vendedor)
3. ✅ Verificar produto no backend: `curl http://localhost:8080/api/products`
4. ✅ Adicionar produto ao carrinho (como cliente)
5. ✅ Finalizar pedido
6. ✅ Verificar pedido no backend: `curl http://localhost:8080/api/orders`
7. ✅ Verificar se estoque foi reduzido: `curl http://localhost:8080/api/products/1`

---

**Pronto! Agora você pode testar tudo! 🚀**

Para mais detalhes, veja `GUIA_DE_TESTES.md`

