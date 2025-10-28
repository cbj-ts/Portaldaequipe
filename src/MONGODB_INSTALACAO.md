# 🚀 Instalação e Configuração MongoDB - TradeStars Portal

## ✅ Arquivos Criados

### 📁 Estrutura Completa

```
/scripts/
  ├── initMongoDB.ts          # Criar collections e índices
  └── seedData.ts             # Popular com dados de exemplo

/api/
  ├── auth/
  │   └── login.ts            # Endpoint de autenticação
  ├── chamados/
  │   ├── index.ts            # GET/POST chamados
  │   └── [id].ts             # GET/PATCH chamado específico
  └── eventos/
      └── index.ts            # GET/POST eventos

/components/
  └── LoginPage.tsx           # Tela de login MongoDB

/lib/
  └── mongodb.ts              # ✅ Conexão (já criado)

/models/
  ├── User.ts                 # ✅ Schema usuários (já criado)
  ├── Chamado.ts              # ✅ Schema chamados (já criado)
  ├── Evento.ts               # ✅ Schema eventos (já criado)
  ├── Sala.ts                 # ✅ Schema salas (já criado)
  └── Curso.ts                # ✅ Schema cursos (já criado)

/services/
  ├── userService.ts          # ✅ CRUD usuários (já criado)
  ├── chamadoService.ts       # ✅ CRUD chamados (já criado)
  └── eventoService.ts        # ✅ CRUD eventos (já criado)

/hooks/
  ├── useChamados.ts          # ✅ Hook chamados (já criado)
  └── useEventos.ts           # ✅ Hook eventos (já criado)

/contexts/
  └── AuthContext.tsx         # ✅ Autenticação (já criado)

/.env.example                 # ✅ Template variáveis (já criado)
```

---

## 📋 Passo a Passo - Instalação

### **1. Instalar Dependências**

```bash
npm install mongodb bcryptjs
npm install -D @types/bcryptjs
```

### **2. Configurar MongoDB Atlas**

#### Opção A: Já tem cluster?
Edite o arquivo `.env` na raiz do projeto:

```env
MONGODB_URI=mongodb+srv://di01_db_user:4Qk9QEl1spKWkuaa@SEU_CLUSTER.mongodb.net/tradestars_portal?retryWrites=true&w=majority
```

**Substitua `SEU_CLUSTER`** pelo nome real do seu cluster.

#### Opção B: Criar novo cluster (5 minutos)

1. Acesse: https://cloud.mongodb.com
2. Clique **"Build a Database"**
3. Escolha **FREE (M0)** - 512MB grátis
4. Região: **São Paulo (SA-EAST-1)**
5. Cluster Name: **Cluster0** (ou outro nome)
6. Clique **"Create Cluster"**
7. Em **Security** → **Network Access**:
   - Add IP Address → **0.0.0.0/0** (allow from anywhere)
8. Em **Database Access**:
   - Username já existe: `di01_db_user`
   - Password: `4Qk9QEl1spKWkuaa`
9. Clique **"Connect"** → **"Connect your application"**
10. Copie a connection string

### **3. Criar arquivo `.env`**

```bash
# Na raiz do projeto, crie o arquivo .env
cp .env.example .env

# Edite e cole sua connection string
nano .env
```

Exemplo de `.env` final:

```env
MONGODB_URI=mongodb+srv://di01_db_user:4Qk9QEl1spKWkuaa@cluster0.abc123.mongodb.net/tradestars_portal?retryWrites=true&w=majority
MONGODB_DB=tradestars_portal
NODE_ENV=development
```

### **4. Executar Scripts de Inicialização**

#### 4.1. Criar Collections e Índices

```bash
# Se estiver usando Node com TypeScript
npx tsx scripts/initMongoDB.ts

# Ou se tiver ts-node instalado
node --loader ts-node/esm scripts/initMongoDB.ts
```

**Saída esperada:**
```
🚀 Iniciando configuração do MongoDB...

✅ Conectado ao MongoDB Atlas!

📦 Criando collections...

  ✓ Collection "users" criada
  ✓ Collection "chamados" criada
  ✓ Collection "eventos" criada
  ✓ Collection "salas" criada
  ✓ Collection "reservas" criada
  ✓ Collection "cursos" criada
  ✓ Collection "progressos" criada

📊 Criando índices...

  → users
    ✓ Índices criados
  → chamados
    ✓ Índices criados
  → eventos
    ✓ Índices criados

✨ MongoDB configurado com sucesso!
```

#### 4.2. Popular com Dados de Exemplo

```bash
npx tsx scripts/seedData.ts
```

**Saída esperada:**
```
🌱 Iniciando seed de dados...

🗑️  Limpando dados antigos...
  ✓ Dados antigos removidos

👥 Criando usuários...
  ✓ 10 usuários criados

🏢 Criando salas de reunião...
  ✓ 3 salas criadas

🎫 Criando chamados de exemplo...
  ✓ 3 chamados criados

📅 Criando eventos...
  ✓ 3 eventos criados

✨ Seed completo!

📋 Resumo dos dados criados:
   👥 Usuários: 10
   🏢 Salas: 3
   🎫 Chamados: 3
   📅 Eventos: 3

🔐 Credenciais de teste:
   Email: admin@tradestars.com
   Senha: tradestars2025
```

---

## 🧪 Testar Conexão

### Teste Rápido no Node

```javascript
// test-connection.js
import { checkConnection } from './lib/mongodb.js';

checkConnection();
```

```bash
node test-connection.js
```

**Saída esperada:**
```
✅ MongoDB conectado com sucesso!
```

---

## 🔐 Credenciais de Teste

Após executar o seed, você terá estes usuários disponíveis:

| Email | Senha | Setor | Cargo | Admin |
|-------|-------|-------|-------|-------|
| admin@tradestars.com | tradestars2025 | Diretoria | CEO | ✅ Sim |
| carlos.santos@tradestars.com | tradestars2025 | TEI | Coordenador | ❌ Não |
| ana.costa@tradestars.com | tradestars2025 | RH | Gerente | ❌ Não |
| ricardo.mendes@tradestars.com | tradestars2025 | Financeiro | Coordenador | ❌ Não |
| fernando.silva@tradestars.com | tradestars2025 | Comercial | Gerente | ❌ Não |
| laura.rodrigues@tradestars.com | tradestars2025 | Marketing | Coordenador | ❌ Não |

**Todos os usuários têm a mesma senha:** `tradestars2025`

---

## 🎯 Integrar Login no App.tsx

Edite o arquivo `/App.tsx`:

```typescript
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './components/LoginPage';

// Dentro do componente App:
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Restante do código existente do App
  return (
    <Router>
      {/* ... código atual ... */}
    </Router>
  );
}
```

---

## 📊 Visualizar Dados (MongoDB Compass)

1. Baixe: https://www.mongodb.com/try/download/compass
2. Conecte usando sua connection string
3. Explore as collections criadas

---

## 🔧 Troubleshooting

### Erro: "Cannot find module 'mongodb'"
```bash
npm install mongodb bcryptjs
```

### Erro: "Authentication failed"
- Verifique username e password no `.env`
- Confirme que o usuário existe no MongoDB Atlas

### Erro: "IP não autorizado"
1. MongoDB Atlas → Network Access
2. Add IP Address → **0.0.0.0/0**
3. Save

### Erro: "Cannot find module 'tsx'"
```bash
npm install -g tsx
```

---

## 📝 Próximos Passos

Após a instalação bem-sucedida:

1. ✅ **Testar Login** - Use as credenciais demo
2. ✅ **Integrar componentes existentes** - Conectar páginas ao MongoDB
3. ✅ **Criar API routes** para outras funcionalidades
4. ✅ **Implementar upload de arquivos**
5. ✅ **Adicionar validação de formulários**

---

## 🎉 Pronto!

Sua integração MongoDB está completa! O portal agora tem:

- ✅ Autenticação funcional
- ✅ Banco de dados estruturado
- ✅ Dados de exemplo
- ✅ API routes básicas
- ✅ Sistema de usuários completo

**Use as credenciais demo para fazer login e explorar!** 🚀
