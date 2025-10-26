# DropEntregas

Sistema de entrega com backend Node.js, frontend Vue.js e banco PostgreSQL.

## 🚀 Tecnologias

### Backend
- Node.js + Express
- Sequelize ORM
- PostgreSQL
- JWT Authentication
- bcryptjs para hash de senhas

### Frontend
- Vue.js 3 (Composition API)
- Vue Router
- Pinia (State Management)
- Axios (HTTP Client)
- CSS puro (sem frameworks)

### Banco de Dados
- PostgreSQL 16
- Docker

## 📋 Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- npm ou yarn

## 🛠️ Instalação e Execução

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd dropentregas
```

### 2. Configure o banco de dados
```bash
# Inicie o PostgreSQL com Docker
docker-compose up -d

# Verifique se o container está rodando
docker ps
```

### 3. Configure o Backend
```bash
cd backend

# Instale as dependências
npm install

# Crie o arquivo .env
cp .env.example .env

# Edite o arquivo .env se necessário
# DATABASE_URL=postgres://postgres:postgres@localhost:5432/dropentregas
# JWT_SECRET=supersecretjwtkey
# JWT_EXPIRES_IN=7d
# PORT=4000
# NODE_ENV=development
# CORS_ORIGIN=http://localhost:5173

# Execute o backend
npm run dev
```

### 4. Configure o Frontend
```bash
cd frontend

# Instale as dependências
npm install

# Execute o frontend
npm run dev
```

## 🌐 Acessos

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **PostgreSQL**: localhost:5432

## 📱 Funcionalidades

### Autenticação
- ✅ Login
- ✅ Registro
- ✅ Logout
- ✅ Proteção de rotas

### Dashboard
- ✅ Página inicial após login
- ✅ Estatísticas do usuário
- ✅ Ações rápidas
- ✅ Pedidos recentes

### Veículos
- ✅ Listagem de veículos disponíveis
- ✅ Adicionar ao carrinho
- ✅ Preços dinâmicos

### Carrinho
- ✅ Gerenciar itens
- ✅ Aplicar cupons de desconto
- ✅ Informações de entrega
- ✅ Cálculo de preços

### Pedidos
- ✅ Histórico de pedidos
- ✅ Detalhes completos
- ✅ Status de entrega

## 🗄️ Estrutura do Banco

### Tabelas
- **users**: Usuários do sistema
- **vehicles**: Tipos de veículos disponíveis
- **coupons**: Cupons de desconto
- **orders**: Pedidos realizados
- **order_items**: Itens de cada pedido

### Relacionamentos
- User → Orders (1:N)
- Order → OrderItems (1:N)
- OrderItem → Vehicle (N:1)

## 🔧 Scripts Disponíveis

### Backend
```bash
npm run dev    # Desenvolvimento com nodemon
npm start      # Produção
```

### Frontend
```bash
npm run dev     # Desenvolvimento
npm run build   # Build para produção
npm run preview # Preview do build
```

## 🐳 Docker

### Banco de Dados
```bash
# Iniciar PostgreSQL
docker-compose up -d

# Parar PostgreSQL
docker-compose down

# Ver logs
docker-compose logs -f db
```

## 📝 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/me` - Dados do usuário logado

### Veículos
- `GET /api/vehicles` - Listar veículos
- `GET /api/vehicles/:id` - Buscar veículo por ID

### Cupons
- `GET /api/coupons` - Listar cupons
- `GET /api/coupons/:code` - Buscar cupom por código

### Pedidos
- `POST /api/orders/price` - Calcular preço
- `POST /api/orders` - Criar pedido
- `GET /api/orders/me` - Meus pedidos

## 🎨 Design

O frontend foi desenvolvido com CSS puro, seguindo um design moderno e responsivo:
- Cores principais: Azul (#3b82f6) e cinza
- Layout responsivo para mobile e desktop
- Componentes reutilizáveis
- Estados de loading e erro
- Feedback visual para ações do usuário

## 🔒 Segurança

- Senhas hasheadas com bcryptjs
- Autenticação JWT
- Validação de dados no backend
- CORS configurado
- Headers de segurança

## 🚀 Deploy

### Backend
1. Configure as variáveis de ambiente
2. Execute `npm start`
3. Configure proxy reverso (nginx)

### Frontend
1. Execute `npm run build`
2. Sirva os arquivos da pasta `dist`
3. Configure proxy para API

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.


