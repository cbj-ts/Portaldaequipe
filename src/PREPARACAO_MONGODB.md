# 🚀 Guia de Preparação - Integração MongoDB

## ✅ O Que Foi Criado

### 📁 Estrutura de Arquivos

```
/lib/
  └── mongodb.ts              # Conexão singleton com MongoDB

/models/
  ├── User.ts                 # Schema de usuários/colaboradores
  ├── Chamado.ts              # Schema de chamados (tickets)
  ├── Evento.ts               # Schema de eventos do calendário
  ├── Sala.ts                 # Schema de salas e reservas
  └── Curso.ts                # Schema de cursos e progresso

/services/
  ├── userService.ts          # CRUD de usuários
  ├── chamadoService.ts       # CRUD de chamados
  └── eventoService.ts        # CRUD de eventos

/hooks/
  ├── useChamados.ts          # Hook para gerenciar chamados
  └── useEventos.ts           # Hook para gerenciar eventos

/contexts/
  └── AuthContext.tsx         # Contexto de autenticação

/.env.example                 # Template de variáveis de ambiente
```

---

## 🔧 Próximos Passos - VOCÊ PRECISA FAZER

### 1. **Configurar MongoDB Atlas**

**Você tem 3 opções:**

#### Opção A: Fornecer o Cluster Name
```
Me informe o nome do seu cluster MongoDB Atlas:
Exemplo: cluster0.abc123.mongodb.net
```

#### Opção B: Criar Novo Cluster no MongoDB Atlas

1. Acesse: https://cloud.mongodb.com
2. Faça login ou crie uma conta gratuita
3. Clique em "Build a Database"
4. Escolha o plano **FREE (M0)** - 512MB gratuito
5. Escolha a região mais próxima (ex: São Paulo)
6. Clique em "Create Cluster"
7. Após criar, clique em **"Connect"**
8. Escolha **"Connect your application"**
9. Copie a **Connection String**
10. **Me forneça** essa connection string

#### Opção C: MongoDB Local (para desenvolvimento)
```bash
# Instalar MongoDB Community localmente
# Connection string será:
mongodb://localhost:27017/tradestars_portal
```

---

### 2. **Criar Collections no MongoDB**

Após conectar, você precisa criar as collections. Você pode:

**Manualmente no MongoDB Compass:**
```
1. Baixe MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Conecte usando sua connection string
3. Crie database: tradestars_portal
4. Crie as collections:
   - users
   - chamados
   - eventos
   - salas
   - reservas
   - cursos
   - progressos
```

**Ou eu posso criar um script de inicialização** que cria tudo automaticamente.

---

### 3. **Configurar Variáveis de Ambiente**

Crie um arquivo `.env` na raiz do projeto:

```bash
# Copiar o template
cp .env.example .env

# Editar com suas credenciais
# Substituir CLUSTER_NAME pelo seu cluster real
```

---

## 📋 Collections e Índices

### **users** (Colaboradores)
```javascript
{
  nome: "João Silva",
  email: "joao@tradestars.com",
  senha: "hash_bcrypt",
  setor: "TEI",
  cargo: "Analista",
  dataAdmissao: ISODate("2024-01-15"),
  foto: "url_foto",
  isLider: false,
  isAdmin: false,
  ativo: true,
  criadoEm: ISODate(),
  atualizadoEm: ISODate()
}
```

**Índices:**
- `email` (único)
- `setor`
- `ativo`

### **chamados** (Tickets)
```javascript
{
  numero: "TEI-2025-001",
  setor: "TEI",
  solicitanteId: ObjectId(...),
  solicitanteNome: "João Silva",
  titulo: "Problema no computador",
  descricao: "...",
  categoria: "Hardware",
  prioridade: "Alta",
  status: "Aberto",
  respostas: [...],
  criadoEm: ISODate()
}
```

**Índices:**
- `numero` (único)
- `setor + status`
- `solicitanteId`
- `criadoEm`

### **eventos** (Calendário)
```javascript
{
  titulo: "Reunião de Equipe",
  tipo: "Reunião",
  dataInicio: ISODate("2025-02-01T10:00:00Z"),
  dataFim: ISODate("2025-02-01T11:00:00Z"),
  organizadorId: ObjectId(...),
  local: "Sala 1",
  participantes: [...],
  criadoEm: ISODate()
}
```

**Índices:**
- `dataInicio`
- `dataFim`
- `organizadorId`
- `participantes.userId`

---

## 🎯 Como Usar nos Componentes

### Exemplo: Usando o Hook de Chamados

```typescript
import { useChamados } from '../hooks/useChamados';

function ChamadosPage() {
  const { chamados, loading, createChamado, updateChamado } = useChamados({
    setor: 'TEI',
    autoLoad: true
  });

  const handleNovoChamado = async (data) => {
    await createChamado({
      titulo: 'Problema urgente',
      descricao: '...',
      categoria: 'Hardware',
      prioridade: 'Alta'
    });
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      {chamados.map(chamado => (
        <div key={chamado._id.toString()}>
          {chamado.titulo}
        </div>
      ))}
    </div>
  );
}
```

### Exemplo: Autenticação

```typescript
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const { login, user } = useAuth();

  const handleLogin = async () => {
    const success = await login('email@tradestars.com', 'senha123');
    if (success) {
      console.log('Logado como:', user.nome);
    }
  };
}
```

---

## 🔐 Segurança

### Senhas
- ✅ Senhas são criptografadas com **bcrypt**
- ✅ Nunca armazene senhas em texto plano
- ✅ Use hash rounds >= 10

### Autenticação
- 📝 **TODO:** Implementar JWT tokens
- 📝 **TODO:** Adicionar refresh tokens
- 📝 **TODO:** Expiração de sessão

### Permissões
- ✅ Sistema de permissões por setor implementado
- ✅ Controle de acesso baseado em papel (isAdmin, isLider)

---

## 📊 Dashboard de Dados

### Estatísticas Disponíveis

```typescript
// Chamados por status
import { getChamadoStats } from '../services/chamadoService';
const stats = await getChamadoStats('TEI');
// { "Aberto": 5, "Em Andamento": 3, "Resolvido": 12 }

// Usuários por setor
import { countUsersBySetor } from '../services/userService';
const users = await countUsersBySetor();
// { "TEI": 8, "RH": 4, "Financeiro": 6 }

// Eventos por tipo
import { countEventosPorTipo } from '../services/eventoService';
const eventos = await countEventosPorTipo();
// { "Reunião": 15, "Treinamento": 8 }
```

---

## 🚨 Troubleshooting

### Erro: "MongoServerError: Authentication failed"
**Solução:** Verifique username e password no `.env`

### Erro: "Cannot find module 'mongodb'"
**Solução:** `npm install mongodb bcryptjs`

### Erro: "getaddrinfo ENOTFOUND"
**Solução:** Verifique o nome do cluster na connection string

### Erro: "IP não autorizado"
**Solução:** No MongoDB Atlas, vá em Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)

---

## 📝 Dados de Exemplo

Quer que eu crie um **script de seed** para popular o banco com dados de exemplo?

Isso incluiria:
- ✅ 10-15 usuários de diferentes setores
- ✅ 20-30 chamados de exemplo
- ✅ 15-20 eventos no calendário
- ✅ 3-5 salas disponíveis
- ✅ 5-8 cursos

---

## ❓ Próxima Ação

**Me diga:**

1. ✅ **Qual é o nome do seu cluster?** (ou a connection string completa)
2. ✅ **Quer que eu crie o script de inicialização?** (cria collections + índices)
3. ✅ **Quer dados de exemplo?** (seed data para testar)
4. ✅ **Quer que eu crie as API routes?** (endpoints REST para o frontend)

**Ou posso:**
- Criar sistema de login completo
- Implementar upload de arquivos
- Adicionar notificações em tempo real
- Criar sistema de permissões avançado
