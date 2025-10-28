# 🎓 Sistema de Cursos & Treinamentos - TradeStars Portal

## 📚 Visão Geral

Sistema completo de e-learning com player de vídeo, progresso por aula, materiais complementares e certificados de conclusão.

---

## 🎯 Funcionalidades Implementadas

### ✅ **Listagem de Cursos**
- **Filtro por Setor:** Tecnologia, RH, BI, Experiência, Liderança, Financeiro
- **Cards Visuais:** Thumbnail, categoria, nível, duração
- **Barra de Progresso:** Visual do percentual concluído
- **Estados:** Não iniciado / Em andamento / Concluído
- **Badges:** Categoria e nível (Básico/Intermediário/Avançado)
- **Indicador de Conclusão:** Ícone verde para cursos 100%

### ✅ **Visualizador de Curso (Player)**
- **Player de Vídeo Embeded:**
  - Suporte para YouTube e Vimeo
  - Player responsivo em formato 16:9
  - Controles nativos do player
  
- **Navegação por Módulos:**
  - Sidebar com lista completa de aulas
  - Expansível/retrátil por módulo
  - Visual de aula atual destacada
  - Ícones de status (concluído/em andamento)

- **Informações da Aula:**
  - Título e descrição
  - Duração em minutos:segundos
  - Badge de conclusão
  - Conteúdo de texto (quando aplicável)

- **Sistema de Progresso:**
  - Barra de progresso geral do curso
  - Status por aula (concluído/pendente)
  - Botão "Marcar como Concluída"
  - Salvamento automático do progresso

- **Materiais Complementares:**
  - Download de PDFs, DOCs, PPTs, etc.
  - Indicação de tipo e tamanho do arquivo
  - Links diretos para download

- **Navegação entre Aulas:**
  - Botões "Aula Anterior" e "Próxima Aula"
  - Desabilitados quando não há mais aulas

- **Certificado:**
  - Botão de download aparece ao atingir 100%
  - Visual destacado em verde

---

## 🏗️ Arquitetura do Sistema

### **Estrutura de Arquivos**

```
/types/curso.ts                 # Tipos TypeScript
/components/CursosPage.tsx      # Listagem de cursos
/components/CursoViewer.tsx     # Visualizador com player
```

### **Tipos de Dados**

```typescript
// Curso completo
interface Curso {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  setor: SetorType;
  instrutor: Instrutor;
  thumbnail: string;
  duracao_total: number; // minutos
  nivel: 'Básico' | 'Intermediário' | 'Avançado';
  modulos: Modulo[];
  tags?: string[];
  ativo: boolean;
  criado_em: string;
}

// Módulo (agrupa aulas)
interface Modulo {
  id: string;
  titulo: string;
  descricao: string;
  ordem: number;
  aulas: Aula[];
}

// Aula individual
interface Aula {
  id: string;
  titulo: string;
  descricao?: string;
  tipo: 'video' | 'quiz' | 'documento' | 'texto';
  video_url?: string; // YouTube ou Vimeo
  duracao: number; // segundos
  materiais?: Material[];
  ordem: number;
  conteudo_texto?: string;
}

// Material complementar
interface Material {
  id: string;
  nome: string;
  tipo: 'pdf' | 'ppt' | 'doc' | 'xlsx' | 'zip';
  url: string;
  tamanho: number; // bytes
}

// Progresso do usuário
interface ProgressoAula {
  aula_id: string;
  completado: boolean;
  progresso_segundos: number;
  ultima_visualizacao: string;
}
```

---

## 🎬 Fluxo de Uso

### **1. Navegação Básica**

```
Usuário acessa "Cursos" no menu
    ↓
Vê lista de cursos disponíveis
    ↓
Filtra por setor (opcional)
    ↓
Clica em um card de curso
    ↓
Visualizador é aberto em tela inteira
```

### **2. Dentro do Curso**

```
Player carrega primeira aula não concluída
    ↓
Usuário assiste o vídeo
    ↓
Marca como concluída (ou avança automaticamente)
    ↓
Clica em "Próxima Aula" ou seleciona na sidebar
    ↓
Progresso é atualizado em tempo real
    ↓
Ao completar 100%, botão de certificado aparece
```

---

## 🎨 Design & UX

### **Cores por Setor**
- **Tecnologia:** Azul (#000aff)
- **RH:** Verde
- **BI:** Amarelo
- **Experiência:** Laranja
- **Liderança:** Roxo (#ac2aff)
- **Financeiro:** Índigo

### **Estados Visuais**

**Card de Curso:**
- ✅ **100% Concluído:** Ícone verde + texto verde
- 🔵 **Em Andamento:** Barra azul + botão "Continuar"
- ⚪ **Não Iniciado:** Barra cinza + botão "Iniciar"

**Aula na Sidebar:**
- ✅ **Concluída:** CheckCircle verde
- ⚪ **Pendente:** Circle cinza
- 🔵 **Atual:** Fundo azul + texto branco

### **Responsividade**

**Desktop (lg):**
- Player: 2/3 da largura
- Sidebar de aulas: 1/3 da largura
- Layout lado a lado

**Tablet/Mobile:**
- Player: largura completa
- Sidebar: abaixo do player
- Stacking vertical

---

## 📹 Integração de Vídeos

### **Plataformas Suportadas**

**YouTube:**
```typescript
// URL original
https://www.youtube.com/watch?v=VIDEO_ID

// Convertido para embed
https://www.youtube.com/embed/VIDEO_ID
```

**Vimeo:**
```typescript
// URL original
https://vimeo.com/VIDEO_ID

// Convertido para embed
https://player.vimeo.com/video/VIDEO_ID
```

### **Configuração do Player**

```tsx
<iframe
  src={getVideoEmbedUrl(aula.video_url)}
  className="w-full h-full"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
/>
```

---

## 💾 Gerenciamento de Dados

### **Atualmente (Mock)**

Os dados são mockados dentro do componente `CursosPage.tsx`:

```typescript
const cursos: Curso[] = [ /* ... */ ];
const [progressoUsuario, setProgressoUsuario] = useState<ProgressoAula[]>([]);
```

### **Migração para Supabase (Futuro)**

**Tabelas necessárias:**

```sql
-- Tabela de cursos
CREATE TABLE cursos (
  id UUID PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  categoria TEXT,
  setor TEXT,
  instrutor_nome TEXT,
  instrutor_cargo TEXT,
  thumbnail_url TEXT,
  duracao_total INTEGER,
  nivel TEXT,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de módulos
CREATE TABLE modulos (
  id UUID PRIMARY KEY,
  curso_id UUID REFERENCES cursos(id),
  titulo TEXT NOT NULL,
  descricao TEXT,
  ordem INTEGER,
  UNIQUE(curso_id, ordem)
);

-- Tabela de aulas
CREATE TABLE aulas (
  id UUID PRIMARY KEY,
  modulo_id UUID REFERENCES modulos(id),
  titulo TEXT NOT NULL,
  descricao TEXT,
  tipo TEXT,
  video_url TEXT,
  duracao INTEGER,
  ordem INTEGER,
  conteudo_texto TEXT,
  UNIQUE(modulo_id, ordem)
);

-- Tabela de materiais
CREATE TABLE materiais (
  id UUID PRIMARY KEY,
  aula_id UUID REFERENCES aulas(id),
  nome TEXT NOT NULL,
  tipo TEXT,
  url TEXT,
  tamanho INTEGER
);

-- Tabela de progresso do usuário
CREATE TABLE progresso_aulas (
  id UUID PRIMARY KEY,
  usuario_id UUID NOT NULL,
  aula_id UUID REFERENCES aulas(id),
  completado BOOLEAN DEFAULT false,
  progresso_segundos INTEGER DEFAULT 0,
  ultima_visualizacao TIMESTAMP,
  UNIQUE(usuario_id, aula_id)
);
```

---

## 🚀 Como Usar

### **Acessar Cursos**

1. Clique em **"Cursos"** no menu lateral
2. Navegue pelos cursos disponíveis
3. Use os filtros por setor no topo

### **Iniciar um Curso**

1. Clique em um card de curso
2. O player abrirá automaticamente
3. Primeira aula não concluída será carregada

### **Navegar pelas Aulas**

**Opção 1 - Sidebar:**
- Expanda o módulo desejado
- Clique na aula que deseja assistir

**Opção 2 - Botões:**
- Use "Próxima Aula" / "Aula Anterior" no rodapé

### **Marcar Progresso**

1. Assista o vídeo
2. Clique em **"Marcar como Concluída"**
3. O progresso é salvo automaticamente

### **Baixar Materiais**

1. Role até a seção "Materiais Complementares"
2. Clique no material desejado
3. Download iniciará automaticamente

### **Obter Certificado**

1. Complete todas as aulas (100%)
2. Botão **"Baixar Certificado"** aparecerá na sidebar
3. Clique para baixar

---

## 📊 Métricas e Analytics (Futuro)

### **Para o Usuário**
- Total de cursos iniciados
- Total de cursos concluídos
- Horas de treinamento
- Certificados obtidos
- Streak de aprendizado

### **Para Gestores**
- Taxa de conclusão por curso
- Tempo médio de conclusão
- Cursos mais populares
- Engajamento por setor
- ROI de treinamento

---

## 🔧 Personalização

### **Adicionar Novo Curso**

```typescript
const novoCurso: Curso = {
  id: 'uuid-aqui',
  titulo: 'Nome do Curso',
  descricao: 'Descrição completa',
  categoria: 'Desenvolvimento',
  setor: 'Tecnologia',
  instrutor: {
    nome: 'Nome do Instrutor',
    cargo: 'Cargo',
  },
  thumbnail: 'url-da-imagem',
  duracao_total: 300, // minutos
  nivel: 'Intermediário',
  ativo: true,
  criado_em: new Date().toISOString(),
  modulos: [
    {
      id: 'mod-1',
      titulo: 'Módulo 1',
      descricao: 'Descrição',
      ordem: 1,
      aulas: [
        {
          id: 'aula-1',
          titulo: 'Aula 1',
          tipo: 'video',
          video_url: 'https://youtube.com/...',
          duracao: 600,
          ordem: 1,
        }
      ]
    }
  ]
};
```

### **Adicionar Material a uma Aula**

```typescript
materiais: [
  {
    id: 'mat-1',
    nome: 'Slides do Curso.pdf',
    tipo: 'pdf',
    url: '/materiais/slides.pdf',
    tamanho: 2048576 // 2MB em bytes
  }
]
```

---

## 🎯 Próximos Passos Recomendados

### **Fase 1 - Melhorias Básicas**
- [ ] Adicionar quiz/avaliações entre módulos
- [ ] Sistema de notas/comentários nas aulas
- [ ] Marcadores/bookmarks em vídeos
- [ ] Speed control (1x, 1.5x, 2x)

### **Fase 2 - Gamificação**
- [ ] Pontos por conclusão de curso
- [ ] Badges e conquistas
- [ ] Ranking de aprendizado
- [ ] Desafios semanais

### **Fase 3 - Social**
- [ ] Discussões por aula
- [ ] Compartilhar progresso
- [ ] Grupos de estudo
- [ ] Mentorias

### **Fase 4 - Backend**
- [ ] Migrar para Supabase
- [ ] Sistema de recomendação
- [ ] Analytics avançado
- [ ] Certificados digitais com blockchain

---

## 🎬 Vídeos de Demonstração (Mock)

Os vídeos atualmente usam exemplos públicos do YouTube para demonstração:

- **Segurança da Informação:** Vídeos educativos sobre cibersegurança
- **Outros cursos:** Vídeos genéricos (podem ser substituídos)

**Para produção**, substitua por:
- Vídeos próprios hospedados no Vimeo PRO
- Canal corporativo no YouTube (não listado)
- Ou storage próprio com streaming configurado

---

## 💡 Dicas de Uso

1. **Organize por Trilhas:** Agrupe cursos relacionados
2. **Cursos Obrigatórios:** Marque com categoria especial
3. **Prazos:** Adicione campo de data_limite para compliance
4. **Feedback:** Permita avaliação de cursos após conclusão
5. **Offline:** Considere permitir download para assistir offline

---

## 📞 Suporte

Para dúvidas sobre o sistema de cursos, consulte:
- **Código:** `/components/CursosPage.tsx` e `/components/CursoViewer.tsx`
- **Tipos:** `/types/curso.ts`
- **Este guia:** `/SISTEMA_CURSOS.md`

---

**Última atualização:** 16 de outubro de 2025  
**Versão:** 1.0  
**Status:** ✅ Implementado e funcional
