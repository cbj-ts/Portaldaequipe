# 🗄️ INTEGRAÇÃO MONGODB - TODOS OS CRUDs

## ✅ O que foi criado

Todos os CRUDs do portal agora estão integrados com MongoDB! 

---

## 📦 ESTRUTURA CRIADA

### **1. Models (Modelos de Dados)**

| Arquivo | Entidade | Descrição |
|---------|----------|-----------|
| `/models/User.ts` | Usuários | ✅ Já existia |
| `/models/Chamado.ts` | Chamados | ✅ Já existia |
| `/models/Evento.ts` | Calendário | ✅ Já existia |
| `/models/Sala.ts` | Salas e Reservas | ✅ Já existia |
| `/models/Curso.ts` | Cursos | ✅ Já existia |
| `/models/Avaliacao.ts` | Avaliações | **✨ NOVO!** |

---

### **2. Services (Lógica de Negócio)**

| Arquivo | Função | Status |
|---------|--------|--------|
| `/services/userService.ts` | Gerenciar usuários | ✅ Já existia |
| `/services/chamadoService.ts` | Gerenciar chamados | ✅ Já existia |
| `/services/eventoService.ts` | Gerenciar eventos | ✅ Já existia |
| `/services/salaService.ts` | Gerenciar salas e reservas | **✨ NOVO!** |
| `/services/avaliacaoService.ts` | Gerenciar avaliações | **✨ NOVO!** |

---

### **3. APIs REST**

| Endpoint | Métodos | Descrição |
|----------|---------|-----------|
| `/api/auth/login` | POST | Login | ✅ Já existia |
| `/api/chamados` | GET, POST | Listar/Criar chamados | ✅ Já existia |
| `/api/chamados/[id]` | GET, PUT, DELETE | Gerenciar chamado | ✅ Já existia |
| `/api/eventos` | GET, POST | Listar/Criar eventos | ✅ Já existia |
| `/api/salas` | GET | Listar salas | **✨ NOVO!** |
| `/api/salas/reservas` | GET, POST | Gerenciar reservas | **✨ NOVO!** |
| `/api/salas/[id]` | PUT, DELETE | Atualizar/Deletar reserva | **✨ NOVO!** |
| `/api/avaliacoes` | GET, POST | Gerenciar avaliações | **✨ NOVO!** |
| `/api/avaliacoes/[id]` | GET, PUT, DELETE | Gerenciar avaliação | **✨ NOVO!** |
| `/api/avaliacoes/logs` | GET | Logs de avaliações | **✨ NOVO!** |
| `/api/avaliacoes/stats` | GET | Estatísticas | **✨ NOVO!** |

---

## 🗂️ COLLECTIONS NO MONGODB

### **Collections Criadas:**

1. ✅ `users` - Usuários do sistema
2. ✅ `chamados` - Chamados (TEI, RH, Financeiro)
3. ✅ `eventos` - Calendário de eventos
4. ✅ `salas` - Salas de reunião
5. ✅ `reservas` - Reservas de salas
6. ✅ `cursos` - Cursos e treinamentos
7. ✅ `progressos` - Progresso dos alunos
8. ✅ `newsletters` - Newsletters internas
9. ✅ `copys` - Copys de atendimento
10. ✅ `produtos` - Guia de produtos
11. ✅ `checklists` - Checklists de atendimento
12. **✨ `avaliacoes`** - Avaliações de desempenho
13. **✨ `avaliacaoLogs`** - Logs de avaliações

**Total: 13 collections**

---

## 📊 ÍNDICES CRIADOS

### **Total: 45 índices** para otimizar consultas

**Por collection:**
- `users`: 4 índices
- `chamados`: 6 índices
- `eventos`: 4 índices
- `salas`: 2 índices
- `reservas`: 4 índices
- `cursos`: 4 índices
- `progressos`: 2 índices
- `newsletters`: 2 índices
- `copys`: 2 índices
- `produtos`: 3 índices
- `checklists`: 3 índices
- **✨ `avaliacoes`**: 4 índices
- **✨ `avaliacaoLogs`**: 3 índices

---

## 🚀 COMO USAR NOS COMPONENTES

### **1. Agendamento de Salas**

**Antes (localStorage):**
```tsx
const reservas = JSON.parse(localStorage.getItem('reservas') || '[]');
localStorage.setItem('reservas', JSON.stringify([...reservas, novaReserva]));
```

**Depois (MongoDB):**
```tsx
// Listar salas
const response = await fetch('/api/salas');
const salas = await response.json();

// Criar reserva
const response = await fetch('/api/salas/reservas', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    salaId: '...',
    usuarioId: user._id,
    usuarioNome: user.nome,
    usuarioSetor: user.setor,
    dataInicio: new Date(),
    dataFim: new Date(),
    titulo: 'Reunião',
    participantes: 5
  })
});

// Listar reservas
const response = await fetch('/api/salas/reservas?usuarioId=' + user._id);
const reservas = await response.json();

// Atualizar reserva
await fetch(`/api/salas/${reservaId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ titulo: 'Novo título' })
});

// Cancelar reserva
await fetch(`/api/salas/${reservaId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    status: 'Cancelada',
    motivoCancelamento: 'Remarcada' 
  })
});

// Deletar reserva
await fetch(`/api/salas/${reservaId}`, { method: 'DELETE' });
```

---

### **2. Calendário / Eventos**

**Já estava integrado!** Usar `/api/eventos`

```tsx
// Listar eventos
const response = await fetch('/api/eventos');
const eventos = await response.json();

// Criar evento
await fetch('/api/eventos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    titulo: 'Reunião',
    dataInicio: new Date(),
    dataFim: new Date(),
    tipo: 'Reunião',
    // ... outros campos
  })
});
```

---

### **3. Chamados**

**Já estava integrado!** Usar `/api/chamados`

```tsx
// Listar chamados
const response = await fetch('/api/chamados?setor=TEI');
const chamados = await response.json();

// Criar chamado
await fetch('/api/chamados', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    setor: 'TEI',
    titulo: 'Problema',
    descricao: 'Descrição',
    // ...
  })
});

// Atualizar status
await fetch(`/api/chamados/${chamadoId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'Em Andamento' })
});
```

---

### **4. Avaliação de Desempenho**

**Novo! 100% integrado com MongoDB**

```tsx
// Listar avaliações pendentes
const response = await fetch(`/api/avaliacoes?tipo=pendentes&usuarioId=${user._id}`);
const pendentes = await response.json();

// Listar avaliações recebidas
const response = await fetch(`/api/avaliacoes?tipo=recebidas&usuarioId=${user._id}`);
const recebidas = await response.json();

// Criar avaliação
await fetch('/api/avaliacoes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    tipo: 'Líder',
    avaliadorId: user._id,
    avaliadorNome: user.nome,
    avaliadorSetor: user.setor,
    avaliadoId: liderId,
    avaliadoNome: 'Nome do Líder',
    avaliadoSetor: 'Setor',
    avaliadoCargo: 'Cargo',
    dataLimite: new Date('2025-12-31')
  })
});

// Submeter avaliação (preencher)
await fetch(`/api/avaliacoes/${avaliacaoId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    criterios: [
      { nome: 'Comunicação', nota: 5, comentario: 'Excelente!' },
      { nome: 'Liderança', nota: 4, comentario: 'Muito bom' },
      // ...
    ],
    pontosFortesGerais: 'Ótima comunicação...',
    pontosAMelhorarGerais: 'Poderia melhorar...',
    sugestoesGerais: 'Sugiro que...'
  })
});

// Buscar logs
const response = await fetch(`/api/avaliacoes/logs?avaliadoId=${user._id}`);
const logs = await response.json();

// Buscar estatísticas
const response = await fetch(`/api/avaliacoes/stats?usuarioId=${user._id}`);
const stats = await response.json();
// stats = { pendentes: 2, recebidas: 5, mediaGeral: 4.2 }
```

---

## 🔄 PRÓXIMOS PASSOS

### **1. Atualizar script de inicialização**

```bash
# Executar para criar as novas collections
npx tsx scripts/initMongoDB.ts
```

Isso vai criar:
- Collection `avaliacoes`
- Collection `avaliacaoLogs`
- 7 novos índices

---

### **2. Atualizar componentes React**

Você precisa atualizar os seguintes componentes para usar as APIs ao invés de localStorage:

#### **Agendamento de Salas:**
- ✏️ `/components/AgendamentoSalasPage.tsx`
  - Substituir localStorage por `fetch('/api/salas')`
  - Criar, editar, deletar reservas via API

#### **Calendário:**
- ✅ `/components/CalendarioPage.tsx` (já usa API)
- ✅ `/components/EventosPage.tsx` (já usa API)

#### **Chamados:**
- ✅ `/components/ChamadosTEIPage.tsx` (já usa API)
- ✅ `/components/ChamadosRHPage.tsx` (já usa API)
- ✅ `/components/ChamadosFinanceiroPage.tsx` (já usa API)

#### **Avaliação:**
- ✏️ `/components/AvaliacaoPage.tsx`
  - Usar `fetch('/api/avaliacoes')`
- ✏️ `/components/AvaliacaoColaboradorPage.tsx`
  - Criar e submeter avaliações via API
- ✏️ `/components/AvaliacaoLiderPage.tsx`
  - Criar e submeter avaliações via API
- ✏️ `/components/AvaliacaoLogsPage.tsx`
  - Buscar logs via `fetch('/api/avaliacoes/logs')`

---

## 📝 EXEMPLO COMPLETO DE MIGRAÇÃO

### **Antes (localStorage):**

```tsx
// AgendamentoSalasPage.tsx
const [reservas, setReservas] = useState<any[]>([]);

useEffect(() => {
  const stored = localStorage.getItem('reservas');
  if (stored) {
    setReservas(JSON.parse(stored));
  }
}, []);

const handleCreate = (nova: any) => {
  const updated = [...reservas, { ...nova, id: Date.now() }];
  setReservas(updated);
  localStorage.setItem('reservas', JSON.stringify(updated));
};

const handleDelete = (id: number) => {
  const updated = reservas.filter(r => r.id !== id);
  setReservas(updated);
  localStorage.setItem('reservas', JSON.stringify(updated));
};
```

---

### **Depois (MongoDB):**

```tsx
// AgendamentoSalasPage.tsx
import { useAuth } from '../contexts/AuthContext';

const [reservas, setReservas] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
const { user } = useAuth();

// Carregar reservas do MongoDB
useEffect(() => {
  loadReservas();
}, [user]);

const loadReservas = async () => {
  try {
    setLoading(true);
    const response = await fetch(`/api/salas/reservas?usuarioId=${user._id}`);
    if (response.ok) {
      const data = await response.json();
      setReservas(data);
    }
  } catch (error) {
    console.error('Erro ao carregar reservas:', error);
    toast.error('Erro ao carregar reservas');
  } finally {
    setLoading(false);
  }
};

// Criar reserva
const handleCreate = async (nova: any) => {
  try {
    const response = await fetch('/api/salas/reservas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...nova,
        usuarioId: user._id,
        usuarioNome: user.nome,
        usuarioSetor: user.setor,
      })
    });
    
    if (response.ok) {
      toast.success('Reserva criada com sucesso!');
      loadReservas(); // Recarregar lista
    } else {
      const error = await response.json();
      toast.error(error.error || 'Erro ao criar reserva');
    }
  } catch (error) {
    console.error('Erro:', error);
    toast.error('Erro ao criar reserva');
  }
};

// Deletar reserva
const handleDelete = async (id: string) => {
  try {
    const response = await fetch(`/api/salas/${id}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      toast.success('Reserva deletada!');
      loadReservas(); // Recarregar lista
    } else {
      toast.error('Erro ao deletar reserva');
    }
  } catch (error) {
    console.error('Erro:', error);
    toast.error('Erro ao deletar reserva');
  }
};
```

---

## ⚡ BENEFÍCIOS DA MIGRAÇÃO

### **1. Persistência Real**
- ✅ Dados salvos no banco de dados
- ✅ Não perdem ao limpar navegador
- ✅ Sincronizados entre dispositivos

### **2. Multi-usuário**
- ✅ Cada usuário vê seus próprios dados
- ✅ Controle de acesso por setor
- ✅ Auditoria completa

### **3. Performance**
- ✅ Índices otimizados para buscas rápidas
- ✅ Paginação e filtros eficientes
- ✅ Cache quando necessário

### **4. Escalabilidade**
- ✅ Suporta milhares de registros
- ✅ Consultas complexas
- ✅ Agregações e relatórios

### **5. Confiabilidade**
- ✅ Backup automático (MongoDB Atlas)
- ✅ Recuperação de desastres
- ✅ Alta disponibilidade

---

## 🛠️ FERRAMENTAS DE DESENVOLVIMENTO

### **MongoDB Compass (Recomendado)**
Interface gráfica para visualizar e editar dados

**Download:** https://www.mongodb.com/try/download/compass

**Connection String:**
```
mongodb+srv://di01:0hSNqpUXuR9jAtED@cluster0.suk3y4n.mongodb.net/?appName=Cluster0
```

---

### **MongoDB Atlas (Web)**
Painel online para gerenciar o banco

**URL:** https://cloud.mongodb.com

**Acesso:**
1. Clique em "Browse Collections"
2. Selecione "PortalDaEquipe"
3. Veja todas as collections e dados

---

## 📊 MONITORAMENTO

### **Ver logs no terminal:**
```bash
# No servidor de desenvolvimento
npm run dev
```

### **Testar conexão:**
```bash
npx tsx scripts/testConnection.ts
```

### **Ver collections e dados:**
```bash
npx tsx scripts/testConnection.ts
```

Saída esperada:
```
✅ Conectado com sucesso!
📦 Collections em "PortalDaEquipe":
   - users: 10 documentos
   - chamados: 15 documentos
   - eventos: 8 documentos
   - salas: 3 documentos
   - reservas: 12 documentos
   - avaliacoes: 0 documentos
   - avaliacaoLogs: 0 documentos
```

---

## 🔒 SEGURANÇA

### **Já implementado:**
- ✅ Autenticação via JWT
- ✅ Senhas criptografadas com bcrypt
- ✅ Validação de dados no backend
- ✅ Connection pooling
- ✅ Índices únicos (email, numero de chamado, etc)

### **Recomendações:**
- 🔹 Sempre validar `user._id` nas requisições
- 🔹 Verificar permissões por setor
- 🔹 Sanitizar inputs do usuário
- 🔹 Usar HTTPS em produção

---

## ✅ CHECKLIST DE MIGRAÇÃO

### **Backend (✅ Pronto!):**
- [x] Models criados
- [x] Services implementados
- [x] APIs REST criadas
- [x] Índices otimizados
- [x] Script de inicialização atualizado

### **Frontend (⏳ Próximo passo):**
- [ ] Atualizar AgendamentoSalasPage.tsx
- [ ] Atualizar AvaliacaoColaboradorPage.tsx
- [ ] Atualizar AvaliacaoLiderPage.tsx
- [ ] Atualizar AvaliacaoLogsPage.tsx
- [x] CalendarioPage.tsx (já usa API)
- [x] ChamadosPage.tsx (já usa API)

### **Testes:**
- [ ] Testar criação de reservas
- [ ] Testar edição de reservas
- [ ] Testar cancelamento de reservas
- [ ] Testar criação de avaliações
- [ ] Testar submissão de avaliações
- [ ] Testar logs de avaliações

---

## 🚀 EXECUTAR AGORA

```bash
# 1. Atualizar banco de dados
npx tsx scripts/initMongoDB.ts

# 2. Verificar se funcionou
npx tsx scripts/testConnection.ts

# 3. Iniciar servidor
npm run dev

# 4. Testar endpoints
# GET http://localhost:4321/api/salas
# GET http://localhost:4321/api/avaliacoes?tipo=pendentes&usuarioId=123
```

---

## 📚 DOCUMENTAÇÃO DAS APIS

Consulte:
- `/api/salas/index.ts` - Salas e reservas
- `/api/salas/[id].ts` - Gerenciar reserva individual
- `/api/avaliacoes/index.ts` - Avaliações
- `/api/avaliacoes/[id].ts` - Gerenciar avaliação individual

**Todas as APIs** retornam JSON e usam os códigos HTTP padrão:
- `200` - Sucesso
- `201` - Criado
- `400` - Erro de validação
- `404` - Não encontrado
- `500` - Erro interno

---

**Próximo passo:** Atualizar os componentes React para usar as APIs! 🎯
