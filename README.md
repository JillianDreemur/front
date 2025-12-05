# M-Commerce - Frontend React

Frontend completo de e-commerce desenvolvido com React, TypeScript e TailwindCSS.

## 🚀 Funcionalidades

### Autenticação

- ✅ Login com email/senha
- ✅ Registro de novos usuários
- ✅ Persistência de sessão (localStorage)
- ✅ Rotas protegidas

### RBAC (Role-Based Access Control)

- ✅ **VENDEDOR**: Acesso ao dashboard de produtos
- ✅ **CLIENTE**: Acesso à loja e carrinho

### Para Vendedores

- ✅ Dashboard com lista de produtos
- ✅ Criar novos produtos
- ✅ Editar produtos existentes
- ✅ Excluir produtos
- ✅ Busca de produtos

### Para Clientes

- ✅ Visualizar todos os produtos
- ✅ Filtrar por categoria
- ✅ Buscar produtos
- ✅ Ordenar por nome/preço
- ✅ Ver detalhes do produto
- ✅ Adicionar ao carrinho
- ✅ Gerenciar carrinho
- ✅ Finalizar compra (checkout)

## 🛠️ Tecnologias

- **React 18** com TypeScript
- **Vite** - Build tool
- **React Router v6** - Roteamento
- **Context API** - Gerenciamento de estado
- **TailwindCSS** - Estilização
- **React Hook Form** + **Zod** - Formulários e validação
- **Lucide React** - Ícones

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── Common/          # Loading, ProtectedRoute, RoleBasedRoute
│   ├── Layout/          # Header, Footer, Layout
│   └── Products/        # ProductCard, ProductList, ProductForm, ProductDetail
├── context/
│   ├── AuthContext.tsx  # Estado de autenticação
│   └── CartContext.tsx  # Estado do carrinho
├── hooks/
│   ├── useAuth.ts       # Hook de autenticação
│   └── useCart.ts       # Hook do carrinho
├── pages/
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── StoreFront.tsx
│   ├── SellerDashboard.tsx
│   ├── CartPage.tsx
│   ├── CheckoutPage.tsx
│   └── NotFoundPage.tsx
├── services/
│   ├── authService.ts   # Autenticação (mock/API)
│   ├── productService.ts# Produtos (mock/API)
│   └── orderService.ts  # Pedidos (mock/API)
├── types/
│   └── index.ts         # Tipos TypeScript
├── App.tsx
├── main.tsx
└── index.css
```

## 🚀 Instalação e Execução

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 🧪 Credenciais de Teste

O sistema está configurado com dados mockados para testes:

| Tipo       | Email              | Senha    |
| ---------- | ------------------ | -------- |
| Vendedor   | vendedor@email.com | senha123 |
| Cliente    | cliente@email.com  | senha123 |
| Vendedor 2 | outro@email.com    | senha123 |

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```env
# Use mocks ao invés da API real
VITE_USE_MOCK=true

# URL base da API (usado quando USE_MOCK=false)
VITE_API_BASE_URL=http://localhost:8080
```

### Transição para API Real

Para conectar ao backend real:

1. Altere `VITE_USE_MOCK=false` no `.env`
2. Configure `VITE_API_BASE_URL` com a URL do seu backend

Os services (`authService`, `productService`, `orderService`) já estão preparados para fazer a transição automaticamente.

## 📱 Rotas

| Rota        | Acesso      | Descrição                  |
| ----------- | ----------- | -------------------------- |
| `/`         | Público     | Página inicial             |
| `/login`    | Público     | Página de login            |
| `/register` | Público     | Página de cadastro         |
| `/store`    | Cliente     | Loja com todos os produtos |
| `/cart`     | Autenticado | Carrinho de compras        |
| `/checkout` | Autenticado | Finalização de compra      |
| `/seller`   | Vendedor    | Dashboard de produtos      |

## 🎨 Design

- Interface moderna e responsiva
- Suporte a mobile, tablet e desktop
- Cores predominantes: Indigo e Purple
- Feedback visual para ações do usuário
- Animações suaves

## 📝 Próximos Passos

Para integração com o backend:

1. [ ] Implementar autenticação JWT real
2. [ ] Conectar com os microserviços:
   - API Gateway
   - Product Service
   - Order Service
   - Discovery Server
3. [ ] Implementar login com OAuth (Google/GitHub)
4. [ ] Adicionar upload de imagens
5. [ ] Implementar histórico de pedidos

## 🔗 Links dos Microserviços

- [API Gateway](https://github.com/samuelftlz/Api-gateway)
- [Discovery Server](https://github.com/samuelftlz/DISCOVERY-SERVER)
- [Order Service](https://github.com/samuelftlz/order-service)
- [Product Service](https://github.com/samuelftlz/product-service)

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos.
