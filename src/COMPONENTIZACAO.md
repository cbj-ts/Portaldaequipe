# 🧩 Componentização TradeStars

## 📦 Nova Estrutura de Componentes

Este documento descreve a nova arquitetura componentizada da aplicação TradeStars.

## 🎯 Objetivo

Transformar código duplicado e verboso em componentes reutilizáveis, limpos e organizados.

---

## 📁 Estrutura de Pastas

```
components/
├── common/              # Componentes comuns reutilizáveis
│   ├── PageHeader.tsx
│   ├── TabButton.tsx
│   ├── FilterButton.tsx
│   ├── SectionCard.tsx
│   ├── FileUploadArea.tsx
│   ├── EmptyState.tsx
│   ├── StatusBadge.tsx
│   ├── FormFieldGroup.tsx
│   ├── FormField.tsx
│   └── index.ts         # Barrel export
├── layouts/             # Componentes de layout
│   └── ChamadosLayout.tsx
├── FormInput.tsx        # Componentes de formulário
├── FormSelect.tsx
├── FormTextarea.tsx
├── PrimaryButton.tsx
└── ...                  # Páginas e outros componentes
```

---

## 🧱 Componentes Comuns

### 1. PageHeader
**Propósito:** Cabeçalho de página com botão voltar

```tsx
<PageHeader 
  title="Chamados Financeiro"
  description="Solicitações de compra e contratações"
  onBack={() => navigate(-1)}
/>
```

**Props:**
- `title: string` - Título da página
- `description?: string` - Descrição opcional
- `onBack?: () => void` - Callback do botão voltar

---

### 2. TabButton
**Propósito:** Botão de navegação por abas

```tsx
<TabButton
  active={viewMode === 'form'}
  onClick={() => setViewMode('form')}
  icon={<FileText className="w-5 h-5" />}
  count={10}
>
  Novo Chamado
</TabButton>
```

**Props:**
- `active: boolean` - Se o tab está ativo
- `onClick: () => void` - Callback de clique
- `icon?: ReactNode` - Ícone opcional
- `children: ReactNode` - Texto do botão
- `count?: number` - Contador opcional

---

### 3. FilterButton
**Propósito:** Botão de filtro para listas

```tsx
<FilterButton
  active={filter === 'todos'}
  onClick={() => setFilter('todos')}
>
  Todos
</FilterButton>
```

**Props:**
- `active: boolean` - Se o filtro está ativo
- `onClick: () => void` - Callback de clique
- `children: ReactNode` - Texto do botão

---

### 4. SectionCard
**Propósito:** Card colorido para seções de formulário

```tsx
<SectionCard 
  title="Informações do Solicitante"
  icon={<Building2 className="w-5 h-5" />}
  variant="green"
>
  {/* Campos do formulário */}
</SectionCard>
```

**Props:**
- `title: string` - Título da seção
- `icon?: ReactNode` - Ícone opcional
- `variant?: 'blue' | 'green' | 'purple' | 'orange' | 'red'` - Cor da seção
- `children: ReactNode` - Conteúdo da seção
- `className?: string` - Classes adicionais

**Variantes:**
- `blue` - Azul (padrão)
- `green` - Verde
- `purple` - Roxo
- `orange` - Laranja
- `red` - Vermelho

---

### 5. FileUploadArea
**Propósito:** Área de upload de arquivos com drag&drop, paste e click

```tsx
<FileUploadArea
  files={files}
  onFilesChange={setFiles}
  accept=".pdf,.jpg,.png"
  maxSize={10}
  label="Anexar Documentos"
  required
/>
```

**Props:**
- `files: FileData[]` - Array de arquivos
- `onFilesChange: (files: FileData[]) => void` - Callback de mudança
- `accept?: string` - Tipos de arquivo aceitos
- `maxSize?: number` - Tamanho máximo em MB (padrão: 10)
- `label?: string` - Label do campo
- `required?: boolean` - Se é obrigatório

**Tipo FileData:**
```typescript
interface FileData {
  name: string;
  type: string;
  size: number;
  data: string;
  preview?: string; // Para imagens
}
```

---

### 6. EmptyState
**Propósito:** Estado vazio para listas sem dados

```tsx
<EmptyState
  icon={<FileText className="w-16 h-16" />}
  title="Nenhum chamado encontrado"
  description="Tente ajustar os filtros"
/>
```

**Props:**
- `icon: ReactNode` - Ícone
- `title: string` - Título
- `description?: string` - Descrição opcional

---

### 7. StatusBadge
**Propósito:** Badge de status com cores automáticas

```tsx
<StatusBadge status="Pendente" />
<StatusBadge status="Aprovado" />
```

**Props:**
- `status: string` - Status
- `colorMap?: Record<string, string>` - Mapa de cores personalizado

**Cores Padrão:**
- `Pendente` → Amarelo
- `Em análise` → Azul
- `Aprovado` → Verde
- `Recusado` → Vermelho
- `Baixa` → Verde
- `Média` → Amarelo
- `Alta` → Laranja
- `Urgente` → Vermelho

---

### 8. FormFieldGroup
**Propósito:** Agrupa campos de formulário em grid responsivo

```tsx
<FormFieldGroup columns={3}>
  <FormField label="Nome" value={nome} onChange={setNome} />
  <FormField label="Email" value={email} onChange={setEmail} />
  <FormField label="Telefone" value={tel} onChange={setTel} />
</FormFieldGroup>
```

**Props:**
- `children: ReactNode` - Campos do formulário
- `columns?: 1 | 2 | 3 | 4` - Número de colunas (padrão: 2)
- `className?: string` - Classes adicionais

---

### 9. FormField
**Propósito:** Campo de formulário completo (Label + Input)

```tsx
<FormField 
  label="Nome Completo"
  value={nome}
  onChange={(e) => setNome(e.target.value)}
  placeholder="Digite seu nome"
  required
/>

<FormField 
  label="Setor"
  type="select"
  value={setor}
  onChange={(e) => setSetor(e.target.value)}
  options={['TI', 'RH', 'Financeiro']}
  required
/>

<FormField 
  label="Descrição"
  type="textarea"
  value={desc}
  onChange={(e) => setDesc(e.target.value)}
  rows={5}
/>
```

**Props:**
- `label: string` - Label do campo
- `type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'url' | 'tel' | 'select' | 'textarea'`
- `value: string` - Valor
- `onChange: (e) => void` - Callback de mudança
- `placeholder?: string` - Placeholder
- `required?: boolean` - Se é obrigatório
- `icon?: ReactNode` - Ícone (apenas para inputs)
- `options?: Array<string | {value, label}>` - Opções (apenas para select)
- `rows?: number` - Linhas (apenas para textarea)
- `className?: string` - Classes adicionais

---

## 📋 Exemplo Completo: Antes vs Depois

### ❌ ANTES (Código Duplicado)

```tsx
export function ChamadosFinanceiroPage({ onBack }: Props) {
  // ... 50+ linhas de state ...
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900..."
        >
          <ArrowLeft className="w-5 h-5..." />
        </button>
        <div>
          <h1 className="text-gray-900 dark:text-white">Chamados Financeiro</h1>
          <p className="text-gray-600 dark:text-gray-400">Descrição</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setViewMode('form')}
          className={`px-6 py-3 rounded-xl ${viewMode === 'form' ? 'bg-[#000aff] text-white' : '...'}`}
        >
          Novo Chamado
        </button>
        {/* ... mais código repetido ... */}
      </div>

      {/* Form */}
      <div className="space-y-4 p-4 bg-green-50 dark:bg-green-950/20...">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-green-600..." />
          <h3 className="text-green-900...">Informações do Solicitante</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Nome Completo *</Label>
            <FormInput
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          {/* ... mais 10 campos ... */}
        </div>
      </div>

      {/* ... 200+ linhas de código ... */}
    </div>
  );
}
```

### ✅ DEPOIS (Componentizado e Limpo)

```tsx
export function ChamadosFinanceiroPageRefactored({ onBack }: Props) {
  // ... state organizado ...

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Chamados Financeiro"
        description="Solicitações de compra e contratações"
        onBack={onBack}
      />

      <div className="flex gap-2">
        <TabButton
          active={viewMode === 'form'}
          onClick={() => setViewMode('form')}
          icon={<FileText className="w-5 h-5" />}
        >
          Nova Solicitação
        </TabButton>
        <TabButton
          active={viewMode === 'history'}
          onClick={() => setViewMode('history')}
          count={chamados.length}
        >
          Histórico
        </TabButton>
      </div>

      {viewMode === 'form' && (
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <SectionCard 
                title="Informações do Solicitante" 
                icon={<Building2 className="w-5 h-5" />} 
                variant="green"
              >
                <FormFieldGroup columns={3}>
                  <FormField label="Data" type="date" value={data} onChange={setData} required />
                  <FormField label="Nome" value={nome} onChange={setNome} required />
                  <FormField label="Centro" type="number" value={cc} onChange={setCC} required />
                </FormFieldGroup>
              </SectionCard>

              <SectionCard title="Detalhes" icon={<DollarSign />} variant="blue">
                <FormField 
                  label="Descrição" 
                  type="textarea" 
                  value={desc} 
                  onChange={setDesc} 
                  rows={4}
                  required 
                />
              </SectionCard>

              <FileUploadArea
                files={files}
                onFilesChange={setFiles}
                label="Orçamento"
                required
              />

              <div className="flex gap-4">
                <PrimaryButton type="submit">Enviar</PrimaryButton>
                <PrimaryButton variant="outline" onClick={clear}>Limpar</PrimaryButton>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {viewMode === 'history' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            {filters.map(f => (
              <FilterButton key={f} active={filter === f} onClick={() => setFilter(f)}>
                {f}
              </FilterButton>
            ))}
          </div>

          {chamados.length > 0 ? (
            <TableComponent chamados={chamados} />
          ) : (
            <EmptyState
              icon={<FileText className="w-16 h-16" />}
              title="Nenhuma solicitação"
            />
          )}
        </div>
      )}
    </div>
  );
}
```

---

## 📊 Benefícios

### 🎯 Código Reduzido
- **Antes:** 600+ linhas por página
- **Depois:** 200-300 linhas por página
- **Redução:** ~50% de código

### 🔄 Reutilização
- Componentes usados em múltiplas páginas
- Sem duplicação de código
- Manutenção centralizada

### 🧹 Legibilidade
- Código mais limpo e organizado
- Intenção clara em cada componente
- Fácil de entender e modificar

### 🚀 Manutenção
- Mudanças em um lugar afetam todas as páginas
- Bugs corrigidos uma vez
- Novos recursos adicionados facilmente

---

## 📝 Como Usar

### 1. Import dos Componentes

```tsx
import { 
  PageHeader, 
  TabButton, 
  FilterButton, 
  SectionCard, 
  FileUploadArea, 
  EmptyState,
  StatusBadge,
  FormFieldGroup,
  FormField
} from './components/common';
```

### 2. Estrutura Básica de uma Página

```tsx
export function MinhaPage({ onBack }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>('form');
  const [data, setData] = useState([]);

  return (
    <div className="space-y-6">
      <PageHeader title="Título" description="Descrição" onBack={onBack} />

      <div className="flex gap-2">
        <TabButton active={viewMode === 'form'} onClick={() => setViewMode('form')}>
          Formulário
        </TabButton>
        <TabButton active={viewMode === 'list'} onClick={() => setViewMode('list')} count={data.length}>
          Lista
        </TabButton>
      </div>

      {viewMode === 'form' && <FormComponent />}
      {viewMode === 'list' && <ListComponent />}
    </div>
  );
}
```

---

## 🔧 Próximos Passos

1. ✅ Refatorar ChamadosFinanceiroPage
2. ⏳ Refatorar ChamadosTEIPage
3. ⏳ Refatorar ChamadosRHPage
4. ⏳ Refatorar outras páginas
5. ⏳ Criar mais componentes conforme necessário

---

## 📚 Referências

- `/components/common/` - Componentes comuns
- `/components/ChamadosFinanceiroPageRefactored.tsx` - Exemplo completo
- `/COMPONENTES_PADRONIZADOS.md` - Componentes de formulário
- `/DESIGN_SYSTEM.md` - Sistema de design

---

## ✨ Conclusão

A componentização torna o código:
- **Mais limpo** - Menos linhas, mais clareza
- **Mais reutilizável** - DRY (Don't Repeat Yourself)
- **Mais manutenível** - Mudanças centralizadas
- **Mais escalável** - Fácil adicionar novos recursos

**Use os componentes comuns sempre que possível!**
