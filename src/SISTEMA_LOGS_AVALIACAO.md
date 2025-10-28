# 📊 Sistema de LOGs - Avaliação de Desempenho

## 🎯 Visão Geral

Sistema completo de registro e auditoria de todas as ações realizadas no módulo de Avaliação de Desempenho da TradeStars.

---

## 📍 Como Acessar

### **Página Principal de Avaliação**
```
/avaliacao
```
- Clique no botão **"Ver Logs"** (canto superior direito)

### **Página de Logs**
```
/avaliacao/logs
```
- Acesso direto à tela de histórico de logs

---

## 🔍 Funcionalidades

### **1. Visualização de Logs**
✅ Timeline completa de todas as ações  
✅ Cards visuais com ícones e cores por tipo  
✅ Detalhes expandidos de cada ação  
✅ Badges de status (Positivo, Melhoria, Queda)  

### **2. Filtros Avançados**
- **Busca por nome**: Avaliador ou colaborador
- **Tipo de ação**: Avaliações ou anotações
- **Período**: Data início e data fim
- **Limpar filtros**: Reset rápido

### **3. Estatísticas em Tempo Real**
- Total de registros
- Quantidade de avaliações
- Quantidade de anotações
- Total de colaboradores avaliados

### **4. Exportação**
- Botão de exportar logs
- Geração de relatórios (CSV/PDF - em desenvolvimento)

---

## 📋 Tipos de LOG Registrados

### **Avaliações**

#### **1. Avaliação de Colaborador**
- **Quando**: Líder envia avaliação de colaborador
- **Registra**:
  - Média obtida
  - Média anterior (se houver)
  - Número de critérios avaliados
  - Indicador de melhoria/queda

#### **2. Avaliação de Líder**
- **Quando**: Colaborador avalia líder
- **Registra**:
  - Média obtida
  - Número de critérios avaliados

### **Anotações**

#### **3. Anotação Adicionada**
- **Quando**: Líder adiciona anotação ao perfil do colaborador
- **Registra**:
  - Título da anotação (Entrega exemplar, Atraso, etc)
  - Descrição completa
  - Tipo (positiva ou negativa)

#### **4. Anotação Editada** *(futuro)*
- Registro de alterações em anotações existentes

#### **5. Anotação Removida** *(futuro)*
- Registro de exclusão de anotações

---

## 🎨 Componentes Visuais

### **Cards de Estatísticas**
```tsx
┌─────────────────────┐
│ 📄 Total            │
│    156              │
└─────────────────────┘

┌─────────────────────┐
│ ⭐ Avaliações       │
│    89               │
└─────────────────────┘

┌─────────────────────┐
│ 💬 Anotações        │
│    67               │
└─────────────────────┘

┌─────────────────────┐
│ 👤 Colaboradores    │
│    42               │
└─────────────────────┘
```

### **Timeline de Logs**
```tsx
┌─────────────────────────────────────────────┐
│ 🟦 Avaliação de Colaborador                │
│                                             │
│ Carlos Mendes → Ana Silva                  │
│ RH → Vendas                                │
│                                             │
│ 📊 Média obtida: 4.2                       │
│ 📈 Média anterior: 3.8                     │
│ ✅ Critérios: 8                            │
│                                             │
│ 📅 20/10/2025  🕐 14:35                    │
└─────────────────────────────────────────────┘
```

---

## 🎨 Cores e Badges

### **Tipos de Ação**
| Tipo | Cor | Badge |
|------|-----|-------|
| Avaliação de Colaborador | 🟦 Azul | `bg-blue-100` |
| Avaliação de Líder | 🟪 Roxo | `bg-purple-100` |
| Anotação Adicionada | 🟩 Verde | `bg-green-100` |
| Anotação Editada | 🟨 Amarelo | `bg-yellow-100` |
| Anotação Removida | 🟥 Vermelho | `bg-red-100` |

### **Indicadores Especiais**
| Indicador | Badge | Quando Aparece |
|-----------|-------|----------------|
| 📈 Melhoria | Verde | Média maior que anterior |
| 📉 Queda | Vermelho | Média menor que anterior |
| ✅ Positivo | Verde | Entrega exemplar / Overdelivery |

---

## 🔧 Estrutura Técnica

### **Componente Principal**
```
/components/AvaliacaoLogsPage.tsx
```

### **Hook Customizado**
```
/hooks/useAvaliacaoLogs.ts
```

### **Funções Disponíveis**
```typescript
const {
  logs,              // Array de todos os logs
  loading,           // Estado de carregamento
  error,             // Erros (se houver)
  registrarAvaliacao,  // Registrar nova avaliação
  registrarAnotacao,   // Registrar nova anotação
  buscarLogs,        // Buscar com filtros
  exportarLogs       // Exportar para CSV
} = useAvaliacaoLogs();
```

---

## 💾 Armazenamento

### **Atual (Mock)**
- `localStorage` para persistência temporária
- Dados mantidos no navegador

### **Futuro (Produção)**
```typescript
// Supabase
await supabase
  .from('avaliacao_logs')
  .insert({
    tipo,
    avaliador_id,
    alvo_id,
    data,
    hora,
    detalhes
  });
```

---

## 📊 Exemplo de Registro

### **Log de Avaliação**
```typescript
{
  id: "log-1729439700000",
  tipo: "avaliacao_colaborador",
  avaliador: {
    id: "user-123",
    nome: "Carlos Mendes",
    setor: "RH"
  },
  alvo: {
    id: "user-456",
    nome: "Ana Silva",
    setor: "Vendas"
  },
  data: "20/10/2025",
  hora: "14:35",
  detalhes: {
    media: 4.2,
    mediaAnterior: 3.8,
    criteriosAvaliados: 8
  }
}
```

### **Log de Anotação**
```typescript
{
  id: "log-1729439800000",
  tipo: "anotacao_adicionada",
  avaliador: {
    id: "user-123",
    nome: "Maria Santos",
    setor: "RH"
  },
  alvo: {
    id: "user-789",
    nome: "João Pedro",
    setor: "SDR"
  },
  data: "20/10/2025",
  hora: "11:20",
  detalhes: {
    tituloAnotacao: "Entrega exemplar",
    descricaoAnotacao: "Superou as expectativas..."
  }
}
```

---

## 🚀 Como Usar no Código

### **Registrar Avaliação**
```typescript
import { useAvaliacaoLogs } from '@/hooks/useAvaliacaoLogs';

const { registrarAvaliacao } = useAvaliacaoLogs();

// Ao enviar avaliação
await registrarAvaliacao({
  tipo: 'avaliacao_colaborador',
  avaliadorId: user.id,
  avaliadorNome: user.nome,
  avaliadorSetor: user.setor,
  alvoId: colaborador.id,
  alvoNome: colaborador.nome,
  alvoSetor: colaborador.setor,
  media: 4.2,
  mediaAnterior: 3.8,
  criteriosAvaliados: 8
});
```

### **Registrar Anotação**
```typescript
import { useAvaliacaoLogs } from '@/hooks/useAvaliacaoLogs';

const { registrarAnotacao } = useAvaliacaoLogs();

// Ao adicionar anotação
await registrarAnotacao({
  tipo: 'anotacao_adicionada',
  avaliadorId: user.id,
  avaliadorNome: user.nome,
  avaliadorSetor: user.setor,
  alvoId: colaborador.id,
  alvoNome: colaborador.nome,
  alvoSetor: colaborador.setor,
  tituloAnotacao: 'Entrega exemplar',
  descricaoAnotacao: 'Superou expectativas no projeto...'
});
```

---

## 📱 Responsividade

✅ **Desktop**: Layout completo com 4 colunas de stats  
✅ **Tablet**: 2 colunas de stats, filtros em grid  
✅ **Mobile**: 1 coluna, texto resumido nos botões  

---

## 🎯 Próximos Passos

### **Integração com Backend**
- [ ] Conectar ao Supabase
- [ ] Criar tabela `avaliacao_logs`
- [ ] Implementar queries otimizadas
- [ ] Cache de dados

### **Funcionalidades Adicionais**
- [ ] Exportação PDF
- [ ] Gráficos de tendências
- [ ] Notificações de logs importantes
- [ ] Filtro por múltiplos setores
- [ ] Visualização em calendário

### **Melhorias de UX**
- [ ] Animações de entrada dos cards
- [ ] Skeleton loading
- [ ] Infinite scroll
- [ ] Busca em tempo real

---

## 📄 Arquivos do Sistema

```
/components/AvaliacaoLogsPage.tsx    - Componente principal
/hooks/useAvaliacaoLogs.ts           - Hook de gerenciamento
/App.tsx                             - Rota /avaliacao/logs
/components/AvaliacaoPage.tsx        - Botão "Ver Logs"
```

---

## ✅ Checklist de Implementação

- [x] Componente AvaliacaoLogsPage criado
- [x] Hook useAvaliacaoLogs implementado
- [x] Rota /avaliacao/logs adicionada
- [x] Botão "Ver Logs" na página de avaliação
- [x] Filtros funcionais
- [x] Estatísticas em tempo real
- [x] Visualização de detalhes
- [x] Badges coloridos por tipo
- [x] Responsividade completa
- [x] Modo escuro suportado
- [ ] Integração com Supabase
- [ ] Sistema de exportação completo

---

## 🎉 Resultado Final

**Sistema completo de auditoria e rastreabilidade** para todas as ações do módulo de avaliação de desempenho, permitindo:

✅ **Transparência total** das avaliações  
✅ **Histórico completo** de anotações  
✅ **Análise de tendências** de desempenho  
✅ **Relatórios personalizados**  
✅ **Conformidade** com políticas de RH  

---

**Desenvolvido seguindo os padrões TradeStars** 🚀
