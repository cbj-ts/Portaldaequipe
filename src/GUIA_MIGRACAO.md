# 🔄 Guia de Migração: Código Antigo → Componentes Novos

## 📋 Como Refatorar Suas Páginas

Este guia mostra passo a passo como migrar do código antigo para os novos componentes.

---

## 🎯 Passo a Passo

### 1. Import dos Componentes

**Antes:**
```tsx
import { ArrowLeft, FileText } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
```

**Depois:**
```tsx
import { ArrowLeft, FileText } from 'lucide-react';
import { Card } from './ui/card';
import { 
  PageHeader, 
  TabButton, 
  FilterButton, 
  SectionCard,
  FormFieldGroup,
  FormField,
  FileUploadArea,
  StatusBadge,
  EmptyState
} from './components/common';
```

---

### 2. Header da Página

**Antes (10 linhas):**
```tsx
<div className="flex items-center gap-4">
  <button
    onClick={onBack}
    className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
  >
    <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
  </button>
  <div>
    <h1 className="text-gray-900 dark:text-white">Chamados Financeiro</h1>
    <p className="text-gray-600 dark:text-gray-400">Solicitações de compra</p>
  </div>
</div>
```

**Depois (1 linha):**
```tsx
<PageHeader 
  title="Chamados Financeiro" 
  description="Solicitações de compra"
  onBack={onBack}
/>
```

**Economia: 9 linhas (90%)**

---

### 3. Tabs de Navegação

**Antes (20 linhas):**
```tsx
<div className="flex gap-2">
  <button
    onClick={() => setViewMode('form')}
    className={`px-6 py-3 rounded-xl transition-colors ${
      viewMode === 'form'
        ? 'bg-[#000aff] text-white'
        : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800'
    }`}
  >
    <FileText className="w-5 h-5 inline mr-2" />
    Novo Chamado
  </button>
  <button
    onClick={() => setViewMode('history')}
    className={`px-6 py-3 rounded-xl transition-colors ${
      viewMode === 'history'
        ? 'bg-[#000aff] text-white'
        : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800'
    }`}
  >
    Histórico ({chamados.length})
  </button>
</div>
```

**Depois (8 linhas):**
```tsx
<div className="flex gap-2">
  <TabButton
    active={viewMode === 'form'}
    onClick={() => setViewMode('form')}
    icon={<FileText className="w-5 h-5" />}
  >
    Novo Chamado
  </TabButton>
  <TabButton
    active={viewMode === 'history'}
    onClick={() => setViewMode('history')}
    count={chamados.length}
  >
    Histórico
  </TabButton>
</div>
```

**Economia: 12 linhas (60%)**

---

### 4. Filtros de Status

**Antes (25 linhas):**
```tsx
<div className="flex flex-wrap gap-2">
  {['todos', 'Pendente', 'Em análise', 'Aprovado', 'Recusado'].map(status => (
    <button
      key={status}
      onClick={() => setStatusFilter(status)}
      className={`px-4 py-2 rounded-xl transition-colors ${
        statusFilter === status
          ? 'bg-[#000aff] text-white'
          : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800'
      }`}
    >
      {status === 'todos' ? 'Todos' : status}
    </button>
  ))}
</div>
```

**Depois (10 linhas):**
```tsx
<div className="flex flex-wrap gap-2">
  {['todos', 'Pendente', 'Em análise', 'Aprovado', 'Recusado'].map(status => (
    <FilterButton
      key={status}
      active={statusFilter === status}
      onClick={() => setStatusFilter(status)}
    >
      {status === 'todos' ? 'Todos' : status}
    </FilterButton>
  ))}
</div>
```

**Economia: 15 linhas (60%)**

---

### 5. Seções de Formulário

**Antes (30 linhas):**
```tsx
<div className="space-y-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-900">
  <div className="flex items-center gap-2 mb-2">
    <Building2 className="w-5 h-5 text-green-600 dark:text-green-400" />
    <h3 className="text-green-900 dark:text-green-100">Informações do Solicitante</h3>
  </div>
  
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div>
      <Label>Nome Completo *</Label>
      <FormInput
        value={nomeCompleto}
        onChange={(e) => setNomeCompleto(e.target.value)}
        placeholder="Seu nome completo"
        required
      />
    </div>
    <div>
      <Label>Email *</Label>
      <FormInput
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email@exemplo.com"
        required
      />
    </div>
    <div>
      <Label>Telefone</Label>
      <FormInput
        value={telefone}
        onChange={(e) => setTelefone(e.target.value)}
        placeholder="(00) 00000-0000"
      />
    </div>
  </div>
</div>
```

**Depois (12 linhas):**
```tsx
<SectionCard 
  title="Informações do Solicitante" 
  icon={<Building2 className="w-5 h-5" />} 
  variant="green"
>
  <FormFieldGroup columns={3}>
    <FormField label="Nome Completo" value={nomeCompleto} onChange={(e) => setNomeCompleto(e.target.value)} placeholder="Seu nome completo" required />
    <FormField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemplo.com" required />
    <FormField label="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(00) 00000-0000" />
  </FormFieldGroup>
</SectionCard>
```

**Economia: 18 linhas (60%)**

---

### 6. Upload de Arquivos

**Antes (80 linhas):**
```tsx
const fileInputRef = useRef<HTMLInputElement>(null);

const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (files) {
    Array.from(files).forEach(processFile);
  }
};

const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  const files = e.dataTransfer.files;
  if (files) {
    Array.from(files).forEach(processFile);
  }
};

const handlePaste = (e: ClipboardEvent) => {
  const items = e.clipboardData?.items;
  if (items) {
    Array.from(items).forEach((item) => {
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) processFile(file);
      }
    });
  }
};

const processFile = (file: File) => {
  if (file.size > 10 * 1024 * 1024) {
    toast.error('Arquivo muito grande. Máximo: 10MB');
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    const fileData = {
      name: file.name,
      type: file.type,
      size: file.size,
      data: e.target?.result as string,
      preview: file.type.startsWith('image/') ? e.target?.result as string : undefined
    };
    setFiles(prev => [...prev, fileData]);
    toast.success(`"${file.name}" adicionado`);
  };
  reader.readAsDataURL(file);
};

useEffect(() => {
  const handlePasteEvent = (e: ClipboardEvent) => handlePaste(e);
  document.addEventListener('paste', handlePasteEvent);
  return () => document.removeEventListener('paste', handlePasteEvent);
}, [files]);

return (
  <div>
    <Label>Arquivo do Orçamento *</Label>
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="mt-2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center bg-gray-50 dark:bg-gray-900/50 hover:border-[#000aff] dark:hover:border-[#000aff] transition-colors cursor-pointer"
      onClick={() => fileInputRef.current?.click()}
    >
      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
      <p className="text-gray-900 dark:text-white mb-2">
        Arraste orçamentos aqui ou clique para selecionar
      </p>
      <small className="text-gray-600 dark:text-gray-400">
        Você também pode usar Ctrl+C / Ctrl+V para colar arquivos
      </small>
      <small className="block text-gray-500 dark:text-gray-500 mt-2">
        Tamanho máximo: 10MB por arquivo
      </small>
    </div>
    <input
      ref={fileInputRef}
      type="file"
      multiple
      onChange={handleFileSelect}
      accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.doc,.docx"
      className="hidden"
    />
    {/* ... lista de arquivos ... */}
  </div>
);
```

**Depois (6 linhas):**
```tsx
<FileUploadArea
  files={files}
  onFilesChange={setFiles}
  accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.doc,.docx"
  maxSize={10}
  label="Arquivo do Orçamento"
  required
/>
```

**Economia: 74 linhas (93%)**

---

### 7. Estado Vazio

**Antes (15 linhas):**
```tsx
<Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
  <CardContent className="p-12 text-center">
    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
    <p className="text-gray-600 dark:text-gray-400">Nenhum chamado encontrado</p>
    <small className="text-gray-500 dark:text-gray-500 mt-2 block">
      Tente ajustar os filtros ou crie um novo chamado
    </small>
  </CardContent>
</Card>
```

**Depois (5 linhas):**
```tsx
<EmptyState
  icon={<FileText className="w-16 h-16" />}
  title="Nenhum chamado encontrado"
  description="Tente ajustar os filtros ou crie um novo chamado"
/>
```

**Economia: 10 linhas (67%)**

---

### 8. Badges de Status

**Antes (15 linhas):**
```tsx
const getStatusColor = (status: string) => {
  const colors = {
    'Pendente': 'bg-yellow-500',
    'Em análise': 'bg-blue-500',
    'Aprovado': 'bg-green-500',
    'Recusado': 'bg-red-500'
  };
  return colors[status as keyof typeof colors] || 'bg-gray-500';
};

// ... em algum lugar ...
<Badge className={`${getStatusColor(chamado.status)} text-white border-0`}>
  {chamado.status}
</Badge>
```

**Depois (1 linha):**
```tsx
<StatusBadge status={chamado.status} />
```

**Economia: 14 linhas (93%)**

---

## 📊 Resumo de Economia

| Componente | Antes | Depois | Economia |
|------------|-------|--------|----------|
| PageHeader | 10 linhas | 1 linha | 90% |
| TabButton | 20 linhas | 8 linhas | 60% |
| FilterButton | 25 linhas | 10 linhas | 60% |
| SectionCard | 30 linhas | 12 linhas | 60% |
| FileUploadArea | 80 linhas | 6 linhas | 93% |
| EmptyState | 15 linhas | 5 linhas | 67% |
| StatusBadge | 15 linhas | 1 linha | 93% |
| **TOTAL** | **195 linhas** | **43 linhas** | **78%** |

---

## 🔄 Checklist de Migração

Quando refatorar uma página, siga esta ordem:

- [ ] 1. Adicione os imports dos componentes comuns
- [ ] 2. Substitua o header manual por `<PageHeader>`
- [ ] 3. Substitua botões de tab por `<TabButton>`
- [ ] 4. Substitua botões de filtro por `<FilterButton>`
- [ ] 5. Agrupe seções em `<SectionCard>`
- [ ] 6. Use `<FormFieldGroup>` para organizar campos em grid
- [ ] 7. Substitua `<Label> + <FormInput>` por `<FormField>`
- [ ] 8. Substitua upload manual por `<FileUploadArea>`
- [ ] 9. Use `<StatusBadge>` para badges de status
- [ ] 10. Use `<EmptyState>` para listas vazias
- [ ] 11. Remova funções helper duplicadas
- [ ] 12. Teste tudo!

---

## ✅ Exemplo Completo de Migração

### Arquivo Original: ChamadosFinanceiroPage.tsx (600 linhas)

1. Mantenha o arquivo original
2. Crie nova versão: ChamadosFinanceiroPageRefactored.tsx
3. Copie toda lógica de estado
4. Substitua UI pelos componentes
5. Teste lado a lado
6. Quando confirmado, renomeie e delete o antigo

---

## 🎯 Dicas de Migração

### ✅ FAÇA
- Migre uma página por vez
- Teste cada componente ao substituir
- Mantenha backup do código original
- Use TypeScript para validar props
- Leia a documentação dos componentes

### ❌ NÃO FAÇA
- Não migre tudo de uma vez
- Não pule testes
- Não delete código sem backup
- Não ignore warnings do TypeScript
- Não invente novos padrões

---

## 📚 Recursos

- **README_COMPONENTES.md** - Como usar cada componente
- **COMPONENTIZACAO.md** - Arquitetura completa
- **ChamadosFinanceiroPageRefactored.tsx** - Exemplo completo
- **/components/common/** - Código fonte

---

## 🚀 Resultados Esperados

Após migrar uma página, você terá:

- ✅ **50-70% menos código**
- ✅ **Código mais legível**
- ✅ **Sem duplicação**
- ✅ **Fácil manutenção**
- ✅ **Consistência visual**
- ✅ **Desenvolvimento mais rápido**

**Comece hoje mesmo! Escolha uma página e refatore! 🎉**
