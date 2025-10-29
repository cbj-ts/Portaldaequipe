# 🚀 INÍCIO RÁPIDO - INTEGRAÇÃO MONGODB

## ✅ O QUE JÁ ESTÁ PRONTO

### **Agendamento de Salas:** 100% FUNCIONAL! ✅
- Carrega reservas do MongoDB
- Cria novas reservas
- Cancela reservas
- Todas as operações CRUD funcionando

### **Backend de Avaliações:** 100% PRONTO! ✅
- APIs REST criadas (`/api/avaliacoes`)
- Models definidos (`/models/Avaliacao.ts`)
- Services implementados (`/services/avaliacaoService.ts`)
- Collections no MongoDB criadas

### **Frontend de Avaliações:** PENDENTE ⏳
- Componentes usam dados mockados
- Precisam ser conectados às APIs
- Backend já está esperando!

---

## 🎯 O QUE FALTA FAZER

Você precisa atualizar **3 componentes React** para usar as APIs do MongoDB:

1. **AvaliacaoColaboradorPage.tsx** - Avaliar colegas
2. **AvaliacaoLiderPage.tsx** - Avaliar líder
3. **AvaliacaoLogsPage.tsx** - Ver histórico de avaliações

---

## 📖 GUIA PASSO A PASSO

### **PASSO 1: Estudar o exemplo funcional**

Abra e estude este arquivo:
```
/components/AgendamentoSalasPage.tsx
```

**Procure por:**
- `loadAgendamentos()` - Como carregar dados da API
- `handleConfirmarAgendamento()` - Como criar via API
- `handleCancelarAgendamento()` - Como atualizar via API
- `useAuth()` - Como pegar usuário logado
- `toast.success/error()` - Como exibir mensagens

**Este é o padrão que você deve seguir!**

---

### **PASSO 2: Atualizar AvaliacaoColaboradorPage.tsx**

**Arquivo:** `/components/AvaliacaoColaboradorPage.tsx`

#### **2.1 - Adicionar imports:**
```tsx
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';
```

#### **2.2 - Adicionar no início do componente:**
```tsx
const { user } = useAuth();
const [loading, setLoading] = useState(true);
```

#### **2.3 - Substituir mock data por API:**
```tsx
// ANTES (mock hardcoded):
useEffect(() => {
  const mockColaboradores: Colaborador[] = [
    { id: '2', nome: 'Maria Santos', ... },
    { id: '3', nome: 'Pedro Costa', ... },
  ];
  setColaboradores(mockColaboradores);
}, []);

// DEPOIS (API real):
useEffect(() => {
  if (user) {
    loadColaboradores();
  }
}, [user]);

const loadColaboradores = async () => {
  try {
    setLoading(true);
    const response = await fetch(`/api/users?setor=${user?.setor}`);
    if (response.ok) {
      const data = await response.json();
      setColaboradores(data);
    } else {
      toast.error('Erro ao carregar colaboradores');
    }
  } catch (error) {
    console.error('Erro:', error);
    toast.error('Erro ao carregar colaboradores');
  } finally {
    setLoading(false);
  }
};
```

#### **2.4 - Adicionar função para criar avaliação:**
```tsx
const handleIniciarAvaliacao = async (colaborador: Colaborador) => {
  try {
    const response = await fetch('/api/avaliacoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tipo: 'Colaborador',
        avaliadorId: user._id,
        avaliadorNome: user.nome,
        avaliadorSetor: user.setor,
        avaliadoId: colaborador.id,
        avaliadoNome: colaborador.nome,
        avaliadoSetor: colaborador.setor,
        avaliadoCargo: colaborador.funcao,
        dataLimite: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 dias
      })
    });
    
    if (response.ok) {
      const avaliacao = await response.json();
      toast.success('Avaliação criada!');
      setColaboradorSelecionado(colaborador);
      setCurrentPage('avaliar');
    } else {
      const error = await response.json();
      toast.error(error.error || 'Erro ao criar avaliação');
    }
  } catch (error) {
    console.error('Erro:', error);
    toast.error('Erro ao criar avaliação');
  }
};
```

#### **2.5 - Adicionar função para submeter avaliação:**
```tsx
const handleEnviarAvaliacao = async (avaliacaoId: string) => {
  try {
    const response = await fetch(`/api/avaliacoes/${avaliacaoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        criterios: [
          { nome: 'Comunicação', nota: avaliacaoData.item1, comentario: '' },
          { nome: 'Trabalho em Equipe', nota: avaliacaoData.item2, comentario: '' },
          { nome: 'Proatividade', nota: avaliacaoData.item3, comentario: '' },
          { nome: 'Qualidade', nota: avaliacaoData.item4, comentario: '' },
          { nome: 'Pontualidade', nota: avaliacaoData.item5, comentario: '' },
          { nome: 'Criatividade', nota: avaliacaoData.item6, comentario: '' },
          { nome: 'Organização', nota: avaliacaoData.item7, comentario: '' },
          { nome: 'Flexibilidade', nota: avaliacaoData.item8, comentario: '' },
          { nome: 'Autonomia', nota: avaliacaoData.item9, comentario: '' },
          { nome: 'Relacionamento', nota: avaliacaoData.item10, comentario: '' },
        ],
        pontosFortesGerais: '',
        pontosAMelhorarGerais: '',
        sugestoesGerais: avaliacaoData.feedback
      })
    });
    
    if (response.ok) {
      toast.success('Avaliação enviada com sucesso!');
      setCurrentPage('lista');
      setAvaliacaoData({
        item1: 0, item2: 0, item3: 0, item4: 0, item5: 0,
        item6: 0, item7: 0, item8: 0, item9: 0, item10: 0,
        feedback: ''
      });
    } else {
      const error = await response.json();
      toast.error(error.error || 'Erro ao enviar avaliação');
    }
  } catch (error) {
    console.error('Erro:', error);
    toast.error('Erro ao enviar avaliação');
  }
};
```

---

### **PASSO 3: Atualizar AvaliacaoLiderPage.tsx**

**Arquivo:** `/components/AvaliacaoLiderPage.tsx`

Seguir o mesmo padrão do Passo 2, mas:
- Buscar líder específico via API: `GET /api/users?cargo=Líder&setor=${user.setor}`
- Ao criar avaliação, usar `tipo: 'Líder'`

**Estrutura idêntica ao AvaliacaoColaboradorPage!**

---

### **PASSO 4: Implementar AvaliacaoLogsPage.tsx**

**Arquivo:** `/components/AvaliacaoLogsPage.tsx`

Este precisa ser implementado quase do zero:

```tsx
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';
import { History, FileText } from 'lucide-react';
import { BackButton } from './common/BackButton';

export function AvaliacaoLogsPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadLogs();
    }
  }, [user]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/avaliacoes/logs?avaliadoId=${user._id}`);
      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      } else {
        toast.error('Erro ao carregar logs');
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao carregar logs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <BackButton onClick={() => window.history.back()} />
        <div>
          <h1 className="text-gray-900 dark:text-white">Logs de Avaliações</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Histórico completo de todas as suas avaliações
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Carregando logs...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl p-8 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
          <h3 className="text-gray-900 dark:text-white mb-2">Nenhum log encontrado</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Você ainda não possui registros de avaliações
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map((log: any) => (
            <div
              key={log._id}
              className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-gray-900 dark:text-white">{log.acao}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {log.avaliadorNome} • {log.avaliadoNome}
                  </p>
                </div>
                <small className="text-gray-500 dark:text-gray-400">
                  {new Date(log.dataAcao).toLocaleDateString('pt-BR')}
                </small>
              </div>
              {log.detalhes && (
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {log.detalhes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 🔗 APIs DISPONÍVEIS

### **Para Avaliações:**

```typescript
// Listar avaliações pendentes
GET /api/avaliacoes?tipo=pendentes&usuarioId={id}

// Listar avaliações recebidas
GET /api/avaliacoes?tipo=recebidas&usuarioId={id}

// Criar nova avaliação
POST /api/avaliacoes
Body: {
  tipo: 'Líder' | 'Colaborador',
  avaliadorId: string,
  avaliadorNome: string,
  avaliadorSetor: string,
  avaliadoId: string,
  avaliadoNome: string,
  avaliadoSetor: string,
  avaliadoCargo: string,
  dataLimite: Date
}

// Submeter/Preencher avaliação
PUT /api/avaliacoes/{id}
Body: {
  criterios: Array<{ nome: string, nota: number, comentario: string }>,
  pontosFortesGerais: string,
  pontosAMelhorarGerais: string,
  sugestoesGerais: string
}

// Buscar logs
GET /api/avaliacoes/logs?avaliadoId={id}

// Buscar estatísticas
GET /api/avaliacoes/stats?usuarioId={id}
```

### **Para Usuários:**

```typescript
// Buscar colaboradores por setor
GET /api/users?setor={setor}

// Buscar líder
GET /api/users?cargo=Líder&setor={setor}

// Buscar todos os usuários
GET /api/users
```

---

## 📝 CHECKLIST DE IMPLEMENTAÇÃO

### **AvaliacaoColaboradorPage.tsx:**
- [ ] Adicionar `useAuth()` e `toast`
- [ ] Criar função `loadColaboradores()`
- [ ] Substituir mock data por API
- [ ] Criar função `handleIniciarAvaliacao()`
- [ ] Criar função `handleEnviarAvaliacao()`
- [ ] Adicionar loading states
- [ ] Testar criação de avaliação
- [ ] Testar submissão de avaliação

### **AvaliacaoLiderPage.tsx:**
- [ ] Adicionar `useAuth()` e `toast`
- [ ] Criar função `loadLider()`
- [ ] Substituir mock data por API
- [ ] Criar função `handleIniciarAvaliacao()` com `tipo: 'Líder'`
- [ ] Criar função `handleEnviarAvaliacao()`
- [ ] Adicionar loading states
- [ ] Testar criação de avaliação
- [ ] Testar submissão de avaliação

### **AvaliacaoLogsPage.tsx:**
- [ ] Implementar do zero
- [ ] Adicionar `useAuth()` e `toast`
- [ ] Criar função `loadLogs()`
- [ ] Renderizar lista de logs
- [ ] Adicionar filtros (opcional)
- [ ] Adicionar paginação (opcional)
- [ ] Testar carregamento de logs

---

## 🧪 COMO TESTAR

### **1. Testar Avaliação de Colaborador:**

```bash
# 1. Iniciar servidor
npm run dev

# 2. Fazer login

# 3. Navegar: Desenvolvimento → Avaliação de Desempenho → Avaliar Colaborador

# 4. Criar avaliação:
# - Selecionar colaborador
# - Preencher notas (1-5)
# - Adicionar feedback
# - Enviar

# 5. Verificar no MongoDB Compass:
# - Database: PortalDaEquipe
# - Collection: avaliacoes
# → Deve aparecer o registro!

# 6. Verificar logs:
# - Collection: avaliacaoLogs
# → Deve ter logs automáticos!
```

### **2. Ver dados no MongoDB:**

```
MongoDB Compass:
Connection: mongodb+srv://di01:0hSNqpUXuR9jAtED@cluster0.suk3y4n.mongodb.net/
Database: PortalDaEquipe
Collections:
  - avaliacoes
  - avaliacaoLogs
```

---

## 💡 DICAS IMPORTANTES

### **1. Use o AgendamentoSalasPage como referência:**
Este componente já está 100% funcional com MongoDB. Copie o padrão!

### **2. Sempre use try/catch:**
```tsx
try {
  const response = await fetch(...);
  // sucesso
} catch (error) {
  console.error('Erro:', error);
  toast.error('Mensagem amigável');
}
```

### **3. Sempre recarregue os dados após mudanças:**
```tsx
// Após criar/atualizar/deletar
await loadDados(); // Recarrega lista
```

### **4. Use loading states:**
```tsx
const [loading, setLoading] = useState(true);

// Ao carregar
setLoading(true);
await fetch(...);
setLoading(false);

// No render
{loading ? <Spinner /> : <Lista />}
```

### **5. Use toasts para feedback:**
```tsx
toast.success('Operação realizada!');
toast.error('Erro ao processar');
toast.info('Informação importante');
```

---

## 📚 DOCUMENTAÇÃO COMPLETA

- **Guia Detalhado:** `/INTEGRACAO_MONGODB_CRUDS.md`
- **Mudanças Aplicadas:** `/CRUDS_ATUALIZADOS_MONGODB.md`
- **Status Atual:** `/STATUS_CRUDS_FINAL.md`
- **Exemplo Funcional:** `/components/AgendamentoSalasPage.tsx`

---

## 🎯 RESULTADO ESPERADO

Quando terminar, você terá:

✅ **Agendamento de Salas** - Funcional (já está!)
✅ **Avaliação de Colaborador** - Funcional (depois de integrar)
✅ **Avaliação de Líder** - Funcional (depois de integrar)
✅ **Logs de Avaliações** - Funcional (depois de implementar)

**Todos conectados ao MongoDB!** 🚀

---

## 🚨 PRECISA DE AJUDA?

### **Erros comuns:**

1. **"fetch is not defined":**
   - Você está usando Node.js? Use `fetch` nativo ou instale `node-fetch`

2. **"Cannot read property '_id' of undefined":**
   - O usuário não está logado. Verifique `useAuth()`

3. **"404 Not Found":**
   - Endpoint da API está errado. Verifique a URL

4. **"Network Error":**
   - Servidor não está rodando. Execute `npm run dev`

5. **"MongoDB connection failed":**
   - Connection string errada. Verifique `/lib/mongodb.ts`

---

## ✅ CONCLUSÃO

O backend está **100% pronto**! Você só precisa conectar o frontend.

Siga este guia passo a passo e use o `AgendamentoSalasPage.tsx` como exemplo. 

**Você consegue! 💪**

---

**Boa sorte! 🚀**
