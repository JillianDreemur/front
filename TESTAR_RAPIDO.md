# ⚡ Teste Rápido - Passo a Passo Simplificado

## 🎯 Teste Rápido em 5 Minutos

### 1️⃣ Iniciar Backend (4 terminais)

**Terminal 1 - Discovery Server:**
```bash
cd DISCOVERY-SERVER-main/DISCOVERY-SERVER-main
mvnw.cmd spring-boot:run
```

**Terminal 2 - Product Service:**
```bash
cd product-service-main/product-service-main
mvnw.cmd spring-boot:run
```

**Terminal 3 - Order Service:**
```bash
cd order-service-main/order-service-main
mvnw.cmd spring-boot:run
```

**Terminal 4 - API Gateway:**
```bash
cd Api-gateway-main/Api-gateway-main
mvnw.cmd spring-boot:run
```

### 2️⃣ Configurar Frontend

**Criar arquivo `front/.env`:**
```env
VITE_USE_MOCK=true
VITE_API_BASE_URL=http://localhost:8080
```

**Iniciar Frontend:**
```bash
cd front
npm install  # apenas na primeira vez
npm run dev
```

### 3️⃣ Testar no Navegador

1. Acesse: **http://localhost:5173**
2. Clique em **"Login"**
3. Use: `cliente@email.com` / `senha123`
4. Explore a loja em **"/store"**
5. Adicione produtos ao carrinho
6. Teste OAuth clicando em **"Continuar com GitHub"** ou **"Continuar com Google"**

### ✅ Verificar se está funcionando:

- ✅ Login funciona
- ✅ OAuth funciona (em modo mock)
- ✅ Produtos aparecem na loja
- ✅ Carrinho funciona
- ✅ Checkout funciona

---

**Para testar com backend real**, mude no `.env`:
```env
VITE_USE_MOCK=false
```

E certifique-se de que todos os serviços backend estão rodando!

