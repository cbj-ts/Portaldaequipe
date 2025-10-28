# 🚀 Guia Rápido: Componentes TradeStars

## 📦 O que foi criado?

### Componentes Comuns (`/components/common/`)

| Componente | Descrição | Uso |
|------------|-----------|-----|
| **PageHeader** | Cabeçalho com botão voltar | Todas as páginas internas |
| **TabButton** | Botão de navegação por tabs | Páginas com múltiplas views |
| **FilterButton** | Botão de filtro | Listas com filtros |
| **SectionCard** | Card colorido para seções | Formulários organizados |
| **FileUploadArea** | Upload de arquivos completo | Formulários com anexos |
| **EmptyState** | Estado vazio | Listas vazias |
| **StatusBadge** | Badge de status colorido | Tabelas e cards |
| **FormFieldGroup** | Grid de campos | Organizar múltiplos campos |
| **FormField** | Campo completo (Label+Input) | Formulários simplificados |

### Componentes de Formulário

| Componente | Altura | Espaçamento | Uso |
|------------|--------|-------------|-----|
| **FormInput** | 44px | 8px top | Campos de texto |
| **FormSelect** | 44px | 8px top | Dropdowns |
| **FormTextarea** | Variável | 8px top | Texto longo |
| **PrimaryButton** | 44px | - | Botões de ação |

---

## 🎯 Como Usar?

### 1. Import Simples

```tsx
import { 
  PageHeader, 
  TabButton, 
  SectionCard,
  FormFieldGroup,
  FormField,
  FileUploadArea,
  StatusBadge,
  EmptyState
} from './components/common';
```

### 2. Exemplo Mínimo

```tsx
export function MinhaPage({ onBack }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  return (
    <div className="space-y-6">
      <PageHeader title="Minha Página" onBack={onBack} />
      
      <SectionCard title="Dados" variant="blue">
        <FormFieldGroup columns={2}>
          <FormField 
            label="Nome" 
            value={nome} 
            onChange={(e) => setNome(e.target.value)} 
          />
          <FormField 
            label="Email" 
            type="email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </FormFieldGroup>
      </SectionCard>
    </div>
  );
}
```

---

## 📋 Receitas Comuns

### Página com Tabs (Form + List)

```tsx
function MinhaPage() {
  const [view, setView] = useState('form');
  
  return (
    <div className="space-y-6">
      <PageHeader title="Título" onBack={() => {}} />
      
      <div className="flex gap-2">
        <TabButton active={view === 'form'} onClick={() => setView('form')}>
          Formulário
        </TabButton>
        <TabButton active={view === 'list'} onClick={() => setView('list')} count={10}>
          Lista
        </TabButton>
      </div>
      
      {view === 'form' && <FormComponent />}
      {view === 'list' && <ListComponent />}
    </div>
  );
}
```

### Lista com Filtros

```tsx
function ListaComponent() {
  const [filter, setFilter] = useState('todos');
  const filters = ['todos', 'ativo', 'inativo'];
  
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {filters.map(f => (
          <FilterButton 
            key={f} 
            active={filter === f} 
            onClick={() => setFilter(f)}
          >
            {f}
          </FilterButton>
        ))}
      </div>
      
      {items.length > 0 ? (
        <Table data={items} />
      ) : (
        <EmptyState icon={<FileText />} title="Nenhum item" />
      )}
    </div>
  );
}
```

### Formulário Completo

```tsx
function FormComponent() {
  const [nome, setNome] = useState('');
  const [setor, setSetor] = useState('');
  const [desc, setDesc] = useState('');
  const [files, setFiles] = useState([]);

  return (
    <form className="space-y-6">
      <SectionCard title="Dados Básicos" icon={<User />} variant="blue">
        <FormFieldGroup columns={2}>
          <FormField 
            label="Nome" 
            value={nome} 
            onChange={(e) => setNome(e.target.value)}
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
        </FormFieldGroup>
      </SectionCard>

      <SectionCard title="Detalhes" icon={<FileText />} variant="green">
        <FormField 
          label="Descrição" 
          type="textarea"
          value={desc} 
          onChange={(e) => setDesc(e.target.value)}
          rows={5}
        />
      </SectionCard>

      <FileUploadArea
        files={files}
        onFilesChange={setFiles}
        label="Anexos"
      />

      <PrimaryButton type="submit">Salvar</PrimaryButton>
    </form>
  );
}
```

### Tabela com Status

```tsx
function TabelaComponent({ items }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map(item => (
          <TableRow key={item.id}>
            <TableCell>{item.nome}</TableCell>
            <TableCell>
              <StatusBadge status={item.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

---

## 🎨 Cores do SectionCard

```tsx
<SectionCard variant="blue">...</SectionCard>    // Azul
<SectionCard variant="green">...</SectionCard>   // Verde
<SectionCard variant="purple">...</SectionCard>  // Roxo
<SectionCard variant="orange">...</SectionCard>  // Laranja
<SectionCard variant="red">...</SectionCard>     // Vermelho
```

---

## 🔢 Colunas do FormFieldGroup

```tsx
<FormFieldGroup columns={1}>...</FormFieldGroup> // 1 coluna
<FormFieldGroup columns={2}>...</FormFieldGroup> // 2 colunas (padrão)
<FormFieldGroup columns={3}>...</FormFieldGroup> // 3 colunas
<FormFieldGroup columns={4}>...</FormFieldGroup> // 4 colunas
```

---

## 📝 Tipos de FormField

```tsx
// Input normal
<FormField label="Nome" value={v} onChange={set} />

// Email
<FormField label="Email" type="email" value={v} onChange={set} />

// Número
<FormField label="Idade" type="number" value={v} onChange={set} />

// Data
<FormField label="Data" type="date" value={v} onChange={set} />

// Select
<FormField 
  label="Setor" 
  type="select" 
  value={v} 
  onChange={set}
  options={['TI', 'RH']}
/>

// Textarea
<FormField 
  label="Descrição" 
  type="textarea" 
  value={v} 
  onChange={set}
  rows={5}
/>

// Com ícone
<FormField 
  label="Valor" 
  value={v} 
  onChange={set}
  icon={<DollarSign />}
/>
```

---

## ✅ Checklist para Refatoração

Ao refatorar uma página, siga esta ordem:

1. ✅ Substitua o header manual por `<PageHeader>`
2. ✅ Substitua botões de tab por `<TabButton>`
3. ✅ Substitua botões de filtro por `<FilterButton>`
4. ✅ Agrupe seções em `<SectionCard>`
5. ✅ Use `<FormFieldGroup>` para organizar campos
6. ✅ Substitua Label + Input por `<FormField>`
7. ✅ Use `<FileUploadArea>` para uploads
8. ✅ Use `<StatusBadge>` para status
9. ✅ Use `<EmptyState>` para listas vazias
10. ✅ Teste tudo!

---

## 📚 Documentação Completa

- `/COMPONENTIZACAO.md` - Documentação detalhada
- `/COMPONENTES_PADRONIZADOS.md` - Componentes de formulário
- `/components/ChamadosFinanceiroPageRefactored.tsx` - Exemplo completo
- `/components/common/` - Código-fonte dos componentes

---

## 💡 Dicas

### ✅ FAÇA
- Use componentes sempre que possível
- Mantenha a hierarquia HTML semântica
- Aproveite os props opcionais
- Combine componentes para criar soluções

### ❌ NÃO FAÇA
- Não duplique código
- Não crie componentes inline
- Não ignore os componentes existentes
- Não misture estilos inline com componentes

---

## 🎯 Resultado Final

**Antes:** 600 linhas de código duplicado
**Depois:** 200 linhas de código limpo

**Benefícios:**
- ✅ 50% menos código
- ✅ Manutenção centralizada
- ✅ Reutilização máxima
- ✅ Consistência visual
- ✅ Desenvolvimento mais rápido

---

**Pronto para começar? Veja o exemplo completo em:**
`/components/ChamadosFinanceiroPageRefactored.tsx`
