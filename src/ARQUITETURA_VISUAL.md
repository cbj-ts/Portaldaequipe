# 🏗️ Arquitetura Visual - TradeStars Portal

## 📁 Estrutura de Componentes

```
TradeStars Portal
│
├── 🎨 Design System
│   ├── styles/globals.css ............... Tokens e tipografia
│   ├── DESIGN_SYSTEM.md ................. Documentação completa
│   ├── GUIA_RAPIDO.md ................... Referência rápida
│   └── TEMPLATE_COMPONENTE.tsx .......... Template base
│
├── 🧱 Componentes Comuns (NOVO!)
│   ├── common/
│   │   ├── PageHeader.tsx ............... Cabeçalho com voltar
│   │   ├── TabButton.tsx ................ Navegação por abas
│   │   ├── FilterButton.tsx ............. Botões de filtro
│   │   ├── SectionCard.tsx .............. Seções coloridas
│   │   ├── FileUploadArea.tsx ........... Upload completo
│   │   ├── EmptyState.tsx ............... Lista vazia
│   │   ├── StatusBadge.tsx .............. Badges automáticos
│   │   ├── FormFieldGroup.tsx ........... Grid de campos
│   │   ├── FormField.tsx ................ Campo completo
│   │   └── index.ts ..................... Export centralizado
│   │
│   └── 📖 Documentação
│       ├── README_COMPONENTES.md ........ Guia rápido
│       ├── COMPONENTIZACAO.md ........... Documentação completa
│       ├── GUIA_MIGRACAO.md ............. Como migrar
│       └── RESUMO_COMPONENTIZACAO.md .... Métricas
│
├── 📝 Componentes de Formulário
│   ├── FormInput.tsx .................... Input padronizado (44px)
│   ├── FormSelect.tsx ................... Select padronizado (44px)
│   ├── FormTextarea.tsx ................. Textarea padronizado
│   ├── PrimaryButton.tsx ................ Botão padronizado (44px)
│   └── COMPONENTES_PADRONIZADOS.md ...... Documentação
│
├── 📄 Páginas
│   ├── Dashboard.tsx
│   ├── ChamadosPage.tsx
│   │   ├── ChamadosFinanceiroPage.tsx ... Versão antiga
│   │   ├── ChamadosFinanceiroPageRefactored.tsx ... ✨ Nova versão
│   │   ├── ChamadosTEIPage.tsx
│   │   └── ChamadosRHPage.tsx
│   ├── TimePage.tsx
│   ├── SetoresPage.tsx
│   └── ...
│
└── 🎯 ShadCN UI Components
    └── ui/
        ├── card.tsx
        ├── button.tsx
        ├── input.tsx
        ├── label.tsx
        ├── badge.tsx
        └── ... (40+ componentes)
```

---

## 🔄 Fluxo de Desenvolvimento

```
┌─────────────────────────────────────────────────────────┐
│  1. DESIGN SYSTEM (Base)                                │
│  ├── HTML semântico: <h1>, <p>, <small>                │
│  ├── Espaçamentos: space-y-6, gap-6, p-6               │
│  └── Modo escuro: dark:text-white                      │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  2. COMPONENTES PADRONIZADOS (Formulários)              │
│  ├── FormInput (44px altura)                            │
│  ├── FormSelect (44px altura)                           │
│  ├── FormTextarea                                       │
│  └── PrimaryButton (44px altura)                        │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  3. COMPONENTES COMUNS (Reutilizáveis)                  │
│  ├── PageHeader                                         │
│  ├── TabButton                                          │
│  ├── SectionCard                                        │
│  ├── FormField (combina Label + Input)                 │
│  └── FileUploadArea                                     │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  4. PÁGINAS (Composição)                                │
│  └── Usa todos os componentes acima                     │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Hierarquia de Uso

```
Página de Chamados Financeiro
│
├── PageHeader ........................... <PageHeader title="..." />
│
├── Tabs ................................. <TabButton active={...} />
│
├── Formulário
│   ├── SectionCard ...................... <SectionCard variant="green">
│   │   └── FormFieldGroup ............... <FormFieldGroup columns={3}>
│   │       ├── FormField ................ <FormField label="Nome" />
│   │       ├── FormField ................ <FormField label="Email" />
│   │       └── FormField ................ <FormField label="Tel" />
│   │
│   ├── FileUploadArea ................... <FileUploadArea files={...} />
│   │
│   └── PrimaryButton .................... <PrimaryButton>Enviar</...>
│
└── Histórico
    ├── Filtros .......................... <FilterButton active={...} />
    │
    ├── Tabela (se tem dados)
    │   └── StatusBadge .................. <StatusBadge status="..." />
    │
    └── EmptyState (se vazio) ............ <EmptyState icon={...} />
```

---

## 📊 Camadas da Aplicação

```
┌────────────────────────────────────────────────────────┐
│  CAMADA 1: Tokens CSS                                  │
│  /styles/globals.css                                   │
│  ↓ --font-size-*, --spacing-*, --color-*               │
└────────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────────┐
│  CAMADA 2: ShadCN UI Base                              │
│  /components/ui/*                                      │
│  ↓ Card, Button, Input, Label, Badge, etc.             │
└────────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────────┐
│  CAMADA 3: Componentes Padronizados                    │
│  FormInput, FormSelect, FormTextarea, PrimaryButton    │
│  ↓ Altura 44px, espaçamento 8px, estilos TradeStars    │
└────────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────────┐
│  CAMADA 4: Componentes Comuns                          │
│  /components/common/*                                  │
│  ↓ PageHeader, SectionCard, FormField, etc.            │
└────────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────────┐
│  CAMADA 5: Páginas                                     │
│  Dashboard, Chamados, Time, etc.                       │
│  ↓ Composição de todos os componentes                  │
└────────────────────────────────────────────────────────┘
```

---

## 🔄 Import Flow

```tsx
// Página.tsx
import { 
  // CAMADA 4: Componentes Comuns
  PageHeader, 
  TabButton, 
  SectionCard,
  FormField,
  FileUploadArea
} from './components/common';

import { 
  // CAMADA 3: Componentes Padronizados (se precisar direto)
  FormInput,
  FormSelect,
  PrimaryButton
} from './components';

import { 
  // CAMADA 2: ShadCN UI (quando necessário)
  Card,
  CardContent
} from './components/ui/card';
```

---

## 📦 Dependency Graph

```
FormField
   ├── depende de → Label (ui)
   ├── depende de → FormInput (padronizado)
   ├── depende de → FormSelect (padronizado)
   └── depende de → FormTextarea (padronizado)

SectionCard
   └── usa → CSS do globals.css

FileUploadArea
   ├── depende de → Label (ui)
   ├── usa → Upload icon (lucide-react)
   └── usa → toast (sonner)

PageHeader
   └── usa → ArrowLeft icon (lucide-react)
```

---

## 🎨 Cores por Camada

### Design Tokens (globals.css)
```
--color-primary: #030213
--color-border: rgba(0, 0, 0, 0.1)
```

### Cores TradeStars (hardcoded)
```
#000aff - Azul elétrico
#ac2aff - Roxo vibrante
#ff00ed - Magenta/Rosa
```

### SectionCard Variants
```
blue   → bg-blue-50 dark:bg-blue-950/20
green  → bg-green-50 dark:bg-green-950/20
purple → bg-purple-50 dark:bg-purple-950/20
orange → bg-orange-50 dark:bg-orange-950/20
red    → bg-red-50 dark:bg-red-950/20
```

---

## 📏 Tamanhos Padronizados

```
┌──────────────────────────────────────────┐
│  Componentes de Formulário               │
├──────────────────────────────────────────┤
│  FormInput ........... 44px (h-11)       │
│  FormSelect .......... 44px (h-11)       │
│  PrimaryButton ....... 44px (h-11)       │
│  FormTextarea ........ variável (rows)   │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  Espaçamentos                            │
├──────────────────────────────────────────┤
│  Entre seções ........ 24px (space-y-6)  │
│  Entre elementos ..... 16px (space-y-4)  │
│  Grid gap ............ 24px (gap-6)      │
│  Padding card ........ 24px (p-6)        │
│  Label → Input ....... 8px (mt-2)        │
└──────────────────────────────────────────┘
```

---

## 🚀 Exemplo de Página Completa

```tsx
import { PageHeader, SectionCard, FormFieldGroup, FormField } from './common';

export function MinhaPage({ onBack }) {
  return (
    <div className="space-y-6">              {/* 24px entre seções */}
      
      {/* Cabeçalho */}
      <PageHeader 
        title="Minha Página" 
        description="Descrição"
        onBack={onBack}
      />

      {/* Card com seção colorida */}
      <Card>
        <CardContent className="p-6">       {/* 24px padding */}
          <form className="space-y-6">      {/* 24px entre seções */}
            
            <SectionCard 
              title="Dados" 
              icon={<Icon />} 
              variant="blue"
            >
              <FormFieldGroup columns={3}>  {/* Grid 3 colunas */}
                <FormField label="Nome" value={nome} onChange={setNome} />
                <FormField label="Email" value={email} onChange={setEmail} />
                <FormField label="Tel" value={tel} onChange={setTel} />
              </FormFieldGroup>
            </SectionCard>

            <PrimaryButton type="submit">
              Salvar
            </PrimaryButton>

          </form>
        </CardContent>
      </Card>

    </div>
  );
}
```

---

## 📚 Documentação por Tipo de Desenvolvedor

### 👨‍💻 Desenvolvedor Novo
1. Leia: **README_COMPONENTES.md** (5 min)
2. Veja: **ChamadosFinanceiroPageRefactored.tsx**
3. Use: Componentes em `/components/common/`

### 🎨 Designer/UX
1. Leia: **DESIGN_SYSTEM.md**
2. Edite: `/styles/globals.css` (tokens)
3. Veja: **ANTES_E_DEPOIS.md**

### 🔧 Refatorando Código Antigo
1. Leia: **GUIA_MIGRACAO.md**
2. Siga: Checklist passo a passo
3. Teste: Lado a lado

### 📊 Gerente/Lead
1. Leia: **RESUMO_COMPONENTIZACAO.md**
2. Veja: Métricas e benefícios
3. Decida: Prioridade de migração

---

## ✅ Status da Aplicação

```
Componentes Criados:
├── ✅ PageHeader
├── ✅ TabButton
├── ✅ FilterButton
├── ✅ SectionCard
├── ✅ FileUploadArea
├── ✅ EmptyState
├── ✅ StatusBadge
├── ✅ FormFieldGroup
└── ✅ FormField

Páginas Refatoradas:
├── ✅ ChamadosFinanceiroPageRefactored (exemplo)
└── ⏳ Demais páginas (aguardando migração)

Documentação:
├── ✅ README_COMPONENTES.md
├── ✅ COMPONENTIZACAO.md
├── ✅ GUIA_MIGRACAO.md
├── ✅ RESUMO_COMPONENTIZACAO.md
└── ✅ ARQUITETURA_VISUAL.md (este arquivo)
```

---

## 🎯 Próximos Passos

1. **Usar componentes existentes** em novas páginas
2. **Migrar páginas antigas** uma por vez
3. **Criar novos componentes** conforme necessário
4. **Documentar padrões** que surgirem
5. **Manter consistência** em toda aplicação

---

**Tudo pronto para desenvolvimento componentizado e organizado! 🚀**
