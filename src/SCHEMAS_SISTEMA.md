# 📊 SCHEMAS DO SISTEMA - TradeHub

## Documentação Completa dos Schemas de Dados

Este documento centraliza todos os schemas (estruturas de dados) utilizados no sistema TradeHub, armazenados em **localStorage** do navegador.

---

## 📋 ÍNDICE

1. [Usuário e Autenticação](#usuário-e-autenticação)
2. [Setores](#setores)
3. [Cursos e Treinamentos](#cursos-e-treinamentos)
4. [Eventos e Calendário](#eventos-e-calendário)
5. [Chamados](#chamados)
6. [Newsletter](#newsletter)
7. [Recursos/Documentos](#recursos-documentos)
8. [Checklist de Atendimento](#checklist-de-atendimento)
9. [Avaliações](#avaliações)
10. [Agendamento de Salas](#agendamento-de-salas)

---

## 1. Usuário e Autenticação

### UserProfile
**LocalStorage Key:** `tradestars_user`

```typescript
interface UserProfile {
  _id: string;
  nome: string;
  email: string;
  setor: string;
  cargo?: string;
  telefone?: string;
  avatar?: string;
}
```

**Exemplo:**
```json
{
  "_id": "1",
  "nome": "João Silva",
  "email": "joao@tradehub.com",
  "setor": "TEI",
  "cargo": "Desenvolvedor",
  "telefone": "(11) 98765-4321",
  "avatar": "https://..."
}
```

---

## 2. Setores

### Setor
**Fonte:** `/types/setores.ts`

```typescript
interface Setor {
  id: string;
  nome: string;
  sigla: string;
  cor: string; // HEX color
  descricao: string;
  areas: string[];
}
```

**Setores Disponíveis:**
- Administração (ADM) - `#64748b`
- Business Intelligence (BI) - `#f59e0b`
- Cobrança - `#f97316`
- Comunicação - `#a855f7`
- Contratos - `#06b6d4`
- Financeiro - `#10b981`
- Live - `#ff00ed`
- Recursos Humanos (RH) - `#3b82f6`
- SDR - `#6366f1`
- Suporte Aldeia - `#14b8a6`
- Suporte Tribo - `#8b5cf6`
- Time de Experiência e Inovação (TEI) - `#ec4899`
- Vendas - `#ef4444`

**Ícones Espaciais por Setor:**
```typescript
const SETOR_ICONS: Record<string, string> = {
  administracao: "satellite",
  bi: "telescope",
  cobranca: "meteor",
  comunicacao: "constellation",
  contratos: "scroll",
  financeiro: "planet",
  live: "starburst",
  rh: "astronaut",
  sdr: "radar",
  "suporte-aldeia": "nebula",
  "suporte-tribo": "galaxy",
  tei: "comet",
  vendas: "rocket"
}
```

---

## 3. Cursos e Treinamentos

### Curso
**LocalStorage Key:** `tradestars_cursos`

```typescript
interface Curso {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  setor: SetorType;
  instrutor: Instrutor;
  thumbnail: string;
  duracao_total: number; // minutos
  nivel: NivelType;
  modulos: Modulo[];
  tags?: string[];
  ativo: boolean;
  criado_em: string;
}

interface Instrutor {
  nome: string;
  foto?: string;
  cargo: string;
  bio?: string;
}

interface Modulo {
  id: string;
  titulo: string;
  descricao: string;
  ordem: number;
  aulas: Aula[];
}

interface Aula {
  id: string;
  titulo: string;
  descricao?: string;
  tipo: TipoAulaType; // 'video' | 'quiz' | 'documento' | 'texto'
  video_url?: string; // YouTube/Vimeo
  duracao: number; // segundos
  materiais?: Material[];
  ordem: number;
  conteudo_texto?: string;
}

interface Material {
  id: string;
  nome: string;
  tipo: TipoMaterialType; // 'pdf' | 'ppt' | 'doc' | 'xlsx' | 'zip'
  url: string;
  tamanho: number; // bytes
}
```

### ProgressoCurso
**LocalStorage Key:** `tradestars_progresso_cursos`

```typescript
interface ProgressoCurso {
  usuario_id: string;
  curso_id: string;
  progresso_aulas: ProgressoAula[];
  percentual_conclusao: number;
  data_inicio?: string;
  data_conclusao?: string;
}

interface ProgressoAula {
  aula_id: string;
  completado: boolean;
  progresso_segundos: number;
  ultima_visualizacao: string;
}
```

**Tipos Disponíveis:**
```typescript
type SetorType = 'Todos' | 'Tecnologia' | 'RH' | 'BI' | 'Experiência' | 'Liderança' | 'Financeiro';
type NivelType = 'Básico' | 'Intermediário' | 'Avançado';
type TipoAulaType = 'video' | 'quiz' | 'documento' | 'texto';
type TipoMaterialType = 'pdf' | 'ppt' | 'doc' | 'xlsx' | 'zip';
```

---

## 4. Eventos e Calendário

### Evento
**LocalStorage Key:** `tradestars_eventos`

```typescript
interface Evento {
  id: number;
  title: string;
  date: string; // YYYY-MM-DD
  time: string | null;
  category: string;
  description: string | null;
  location: string | null;
  createdAt: string;
  updatedAt: string;
}
```

**Exemplo:**
```json
{
  "id": 1,
  "title": "Reunião de Planejamento",
  "date": "2025-01-15",
  "time": "14:00",
  "category": "Reunião",
  "description": "Planejamento trimestral",
  "location": "Sala de Reuniões 1",
  "createdAt": "2025-01-10T10:00:00.000Z",
  "updatedAt": "2025-01-10T10:00:00.000Z"
}
```

---

## 5. Chamados

### Chamado
**LocalStorage Key:** `tradestars_chamados`

```typescript
type SetorChamado = 'TEI' | 'RH' | 'Financeiro';

interface Chamado {
  id: string;
  numero: string; // Formato: SETOR-ANO-###
  setor: SetorChamado;
  titulo: string;
  descricao: string;
  status: string; // 'Aberto' | 'Em Andamento' | 'Resolvido' | 'Fechado'
  prioridade: string; // 'Baixa' | 'Média' | 'Alta' | 'Urgente'
  solicitanteNome: string;
  solicitanteSetor: string;
  dataCriacao: string;
  dataAtualizacao: string;
}
```

**Exemplo de Número:**
```
TEI-2025-001
RH-2025-045
Financeiro-2025-123
```

---

## 6. Newsletter

### Newsletter
**LocalStorage Key:** `tradestars_newsletters`

```typescript
interface Newsletter {
  id: number;
  titulo: string;
  descricao: string;
  data: string; // DD/MM/YYYY
  categoria: string;
  destaque?: boolean;
  conteudo?: string; // Conteúdo completo em HTML/Markdown
  autor?: string;
  tags?: string[];
}
```

**Categorias:**
- Geral
- Resultados
- Desenvolvimento
- RH
- Eventos

---

## 7. Recursos/Documentos

### Documento/Recurso
**LocalStorage Key:** `tradestars_recursos`

```typescript
interface Recurso {
  id: string;
  nome: string;
  tipo: string; // 'PDF' | 'DOCX' | 'XLSX' | 'PPTX' | 'HTML' | 'MD'
  tamanho: string; // Ex: "2.5 MB"
  data: string; // DD/MM/YYYY
  categoria: CategoriaRecurso;
  url?: string;
  descricao?: string;
}

type CategoriaRecurso = 
  | 'Gerais' 
  | 'RH' 
  | 'Comunicação' 
  | 'BI' 
  | 'Técnicos';
```

---

## 8. Checklist de Atendimento

### Student (Aluno)
**LocalStorage Key:** `tradestars_checklist_students`

```typescript
interface Student {
  id: string;
  name: string;
  phone: string;
  checklist: Record<string, boolean>; // checklistItemId: completed
  selectedPostType: 'deposito' | 'indicacao';
  createdAt: string;
}

interface ChecklistItem {
  id: string;
  category: string; // 'Pré-Atendimento' | 'Durante o Atendimento' | 'Pós-Atendimento' | 'Finalização'
  subCategory?: string; // 'Depósito' | 'Indicação'
  label: string;
}
```

**Categorias do Checklist:**
1. **Pré-Atendimento**: Verificações antes do atendimento
2. **Durante o Atendimento**: Ações durante o atendimento
3. **Pós-Atendimento**: Ações após o atendimento
   - Subcategoria: Depósito
   - Subcategoria: Indicação
4. **Finalização**: Ações de conclusão

**Exemplo de Progresso:**
```typescript
interface ProgressData {
  percentage: number;
  allCoreCompleted: boolean;
  preCompleted: boolean;
  duringCompleted: boolean;
  postCompleted: boolean;
  finalCompleted: boolean;
  depositCompleted: boolean;
  referralCompleted: boolean;
}
```

---

## 9. Avaliações

### Avaliação de Líder
**LocalStorage Key:** `tradestars_avaliacoes_lider`

```typescript
interface Lider {
  id: string;
  nome: string;
  cargo: string;
  foto?: string;
  setor: string;
}

interface AvaliacaoLider {
  id: string;
  lider_id: string;
  avaliador_id: string;
  avaliador_nome: string;
  data: string;
  nota: number; // 1-10
  comentario?: string;
}
```

### Avaliação de Colaborador
**LocalStorage Key:** `tradestars_avaliacoes_colaborador`

```typescript
interface Colaborador {
  id: string;
  nome: string;
  cargo: string;
  setor: string;
  foto?: string;
  gestorNome?: string;
  dataAdmissao?: string;
  departamento?: string;
}

interface AvaliacaoColaborador {
  id: string;
  colaborador_id: string;
  avaliador_id: string;
  avaliador_nome: string;
  data: string;
  nota: number; // 1-10
  comentario?: string;
  aspectos?: {
    produtividade?: number;
    qualidade?: number;
    comunicacao?: number;
    trabalhoEmEquipe?: number;
    proatividade?: number;
  };
}

interface Aviso {
  id: string;
  colaborador_id: string;
  titulo: string;
  descricao: string;
  data: string;
  tipo: 'advertencia' | 'observacao' | 'feedback';
  autor_nome: string;
}
```

### Logs de Avaliação
**LocalStorage Key:** `tradestars_avaliacoes_logs`

```typescript
type TipoLog = 
  | 'avaliacao_colaborador' 
  | 'avaliacao_lider' 
  | 'aviso_criado' 
  | 'anotacao_adicionada' 
  | 'anotacao_removida';

interface LogItem {
  id: string;
  tipo: TipoLog;
  usuario_nome: string;
  alvo_nome: string;
  data: string;
  detalhes?: string;
  nota?: number;
}
```

---

## 10. Agendamento de Salas

### Agendamento
**LocalStorage Key:** `tradestars_agendamentos_salas`

```typescript
interface Agendamento {
  id: string;
  sala: string; // ID da sala
  data: string; // DD/MM/YYYY
  horarioInicio: string; // HH:MM
  horarioFim: string; // HH:MM
  nome: string; // Nome do solicitante
  telefone: string;
  email: string;
  observacoes?: string;
  dataCriacao: string;
}

interface Sala {
  id: string;
  nome: string;
  capacidade: number;
  recursos: string[]; // Ex: ['Projetor', 'WiFi', 'Ar-condicionado']
  localizacao: string;
  cor?: string;
}
```

**Salas Disponíveis (Exemplo):**
```typescript
const salas = [
  {
    id: 'sala-reuniao-1',
    nome: 'Sala de Reunião 1',
    capacidade: 8,
    recursos: ['Projetor', 'WiFi', 'Quadro Branco'],
    localizacao: 'Andar 2'
  },
  {
    id: 'sala-reuniao-2',
    nome: 'Sala de Reunião 2',
    capacidade: 12,
    recursos: ['TV 55"', 'WiFi', 'Sistema de Som'],
    localizacao: 'Andar 3'
  },
  {
    id: 'auditorio',
    nome: 'Auditório',
    capacidade: 50,
    recursos: ['Projetor', 'Microfones', 'WiFi', 'Ar-condicionado'],
    localizacao: 'Térreo'
  }
];
```

---

## 🔧 Funções Utilitárias

### LocalStorage Helpers
```typescript
// Carregar dados
function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Erro ao carregar ${key}:`, error);
    return defaultValue;
  }
}

// Salvar dados
function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Erro ao salvar ${key}:`, error);
  }
}

// Limpar dados específicos
function clearStorage(key: string): void {
  localStorage.removeItem(key);
}

// Exportar backup
function exportBackup(keys: string[]): string {
  const backup: Record<string, any> = {};
  keys.forEach(key => {
    const data = localStorage.getItem(key);
    if (data) {
      backup[key] = JSON.parse(data);
    }
  });
  return JSON.stringify(backup, null, 2);
}
```

---

## 📦 Keys do LocalStorage Resumidas

```typescript
const STORAGE_KEYS = {
  // Autenticação
  USER: 'tradestars_user',
  
  // Cursos
  CURSOS: 'tradestars_cursos',
  PROGRESSO_CURSOS: 'tradestars_progresso_cursos',
  
  // Eventos
  EVENTOS: 'tradestars_eventos',
  
  // Chamados
  CHAMADOS: 'tradestars_chamados',
  
  // Newsletter
  NEWSLETTERS: 'tradestars_newsletters',
  
  // Recursos
  RECURSOS: 'tradestars_recursos',
  
  // Checklist
  CHECKLIST_STUDENTS: 'tradestars_checklist_students',
  
  // Avaliações
  AVALIACOES_LIDER: 'tradestars_avaliacoes_lider',
  AVALIACOES_COLABORADOR: 'tradestars_avaliacoes_colaborador',
  AVALIACOES_LOGS: 'tradestars_avaliacoes_logs',
  AVISOS_COLABORADOR: 'tradestars_avisos_colaborador',
  
  // Agendamentos
  AGENDAMENTOS_SALAS: 'tradestars_agendamentos_salas'
};
```

---

## 🎯 Migração para MongoDB

Quando for necessário migrar para MongoDB, todos os schemas já estão preparados. Basta:

1. Criar coleções no MongoDB com os mesmos nomes
2. Adaptar os IDs (trocar `id: string` por `_id: ObjectId`)
3. Substituir chamadas `localStorage` por queries MongoDB
4. Manter a mesma estrutura de dados

**Exemplo de Migração:**
```typescript
// Antes (localStorage)
const eventos = JSON.parse(localStorage.getItem('tradestars_eventos') || '[]');

// Depois (MongoDB)
const eventos = await db.collection('eventos').find().toArray();
```

---

## 📝 Notas Importantes

1. **IDs**: Atualmente usando timestamps e strings. MongoDB usará ObjectId.
2. **Datas**: Formato ISO 8601 (`YYYY-MM-DD`) ou timestamps
3. **Validação**: Implementar validação de schemas com Zod ou Yup
4. **Backup**: Sempre fazer backup antes de limpar localStorage
5. **Performance**: LocalStorage tem limite de ~5-10MB por domínio

---

## 🔗 Arquivos Relacionados

- `/types/curso.ts` - Tipos de cursos
- `/types/setores.ts` - Definições de setores
- `/utils/localStorage.ts` - Funções de eventos
- `/hooks/useChamados.ts` - Hook de chamados
- `/hooks/useEventos.ts` - Hook de eventos
- `/contexts/AuthContext.tsx` - Contexto de autenticação

---

**Última atualização:** 04/11/2025
