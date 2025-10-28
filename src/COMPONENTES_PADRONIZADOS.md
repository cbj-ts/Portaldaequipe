# Componentes Padronizados TradeStars

## 📦 Visão Geral

Este documento descreve os componentes padronizados criados para manter consistência visual em toda a aplicação.

## 🎯 Objetivos

- ✅ Altura uniforme de 44px (`h-11`) em todos os controles de input
- ✅ Espaçamento de 8px (`mt-2`) entre label e input
- ✅ Estilização consistente com as cores TradeStars
- ✅ Suporte completo ao modo escuro
- ✅ Fácil reutilização em toda a aplicação
- ✅ Manutenção centralizada

---

## 📝 FormInput

### Descrição
Componente de input padronizado com suporte a ícones e estilização consistente.

### Props
Aceita todas as props padrão de `<input>` HTML, mais:
- `icon?: ReactNode` - Ícone opcional à esquerda

### Uso Básico
```tsx
import { FormInput } from './components/FormInput';

// Sem ícone
<FormInput 
  placeholder="Digite seu nome..."
  value={nome}
  onChange={(e) => setNome(e.target.value)}
/>

// Com ícone
<FormInput 
  placeholder="Buscar..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  icon={<Search className="w-5 h-5" />}
/>
```

### Características
- ✅ Altura: 44px (`h-11`)
- ✅ Espaçamento top: 8px (`mt-2`)
- ✅ Bordas arredondadas: `rounded-xl`
- ✅ Hover com cor primária (#000aff)
- ✅ Suporte a modo escuro
- ✅ Ícone opcional com espaçamento automático

---

## 📝 FormTextarea

### Descrição
Componente de textarea padronizado para áreas de texto maiores.

### Props
Aceita todas as props padrão de `<textarea>` HTML

### Uso Básico
```tsx
import { FormTextarea } from './components/FormTextarea';

<FormTextarea 
  placeholder="Digite sua mensagem..."
  value={mensagem}
  onChange={(e) => setMensagem(e.target.value)}
  rows={5}
/>
```

### Características
- ✅ Espaçamento top: 8px (`mt-2`)
- ✅ Bordas arredondadas: `rounded-xl`
- ✅ Hover com cor primária (#000aff)
- ✅ Suporte a modo escuro
- ✅ Altura ajustável via prop `rows`

---

## 💰 CurrencyInput

### Descrição
Componente de input para valores monetários com formatação automática em tempo real.

### Props
- `value: string` - Valor numérico (apenas números, ex: "12345" = R$ 123,45)
- `onChange: (value: string) => void` - Callback que recebe apenas números
- `label?: string` - Label do campo (padrão: "Valor")
- `placeholder?: string` - Placeholder (padrão: "R$ 0,00")
- `required?: boolean` - Se o campo é obrigatório
- `className?: string` - Classes CSS adicionais

### Uso Básico
```tsx
import { CurrencyInput } from './components/CurrencyInput';

const [valor, setValor] = useState('');

<CurrencyInput 
  value={valor}
  onChange={setValor}
  label="Valor Total"
  required
/>
```

### Como Funciona
- **Estado armazena apenas números**: `"12345"` representa R$ 123,45
- **Input exibe formatado**: Usuário vê `R$ 123,45` enquanto digita
- **Remove não-numéricos**: Aceita apenas dígitos
- **Divisão por 100**: Últimos 2 dígitos são centavos

### Exemplo Completo
```tsx
// Estado
const [valorDespesa, setValorDespesa] = useState('');

// Componente
<CurrencyInput 
  value={valorDespesa}
  onChange={setValorDespesa}
  label="Valor da Despesa"
  placeholder="R$ 0,00"
  required
/>

// Para enviar à API
const valorEmReais = parseFloat(valorDespesa) / 100; // 12345 → 123.45
```

### Características
- ✅ Formatação em tempo real dentro do input
- ✅ Ícone DollarSign integrado
- ✅ Altura: 44px (`h-11`)
- ✅ Suporte a modo escuro
- ✅ Asterisco vermelho quando `required={true}`
- ✅ Formato brasileiro: R$ 1.234,56

---

## 🔽 FormSelect

### Descrição
Componente de select padronizado com duas formas de uso.

### Props
- `options: (string | { value: string; label: string })[]` - Array de opções
- Aceita todas as props padrão de `<select>` HTML

### Uso Básico

#### Array de strings simples
```tsx
import { FormSelect } from './components/FormSelect';

<FormSelect 
  value={setor}
  onChange={(e) => setSetor(e.target.value)}
  options={['Todos', 'RH', 'Tecnologia', 'BI']}
/>
```

#### Array de objetos
```tsx
<FormSelect 
  value={status}
  onChange={(e) => setStatus(e.target.value)}
  options={[
    { value: 'todos', label: 'Todos os Status' },
    { value: 'ativo', label: 'Ativos' },
    { value: 'inativo', label: 'Inativos' }
  ]}
/>
```

### Características
- ✅ Altura: 44px (`h-11`)
- ✅ Espaçamento top: 8px (`mt-2`)
- ✅ Bordas arredondadas: `rounded-xl`
- ✅ Hover com cor primária (#000aff)
- ✅ Suporte a modo escuro
- ✅ Cursor pointer
- ✅ Flexível: aceita strings ou objetos

---

## 🔘 PrimaryButton

### Descrição
Componente de botão padronizado com 4 variantes visuais.

### Props
- `children: ReactNode` - Conteúdo do botão
- `icon?: ReactNode` - Ícone opcional à esquerda
- `variant?: 'primary' | 'secondary' | 'danger' | 'outline'` - Estilo visual
- Aceita todas as props padrão de `<button>` HTML

### Uso Básico

#### Botão Primário (Azul)
```tsx
import { PrimaryButton } from './components/PrimaryButton';
import { Plus } from 'lucide-react';

<PrimaryButton 
  onClick={handleAdd}
  icon={<Plus className="w-4 h-4" />}
>
  Adicionar
</PrimaryButton>
```

#### Botão Secundário (Roxo)
```tsx
<PrimaryButton 
  variant="secondary"
  onClick={handleEdit}
  icon={<Edit className="w-4 h-4" />}
>
  Editar
</PrimaryButton>
```

#### Botão de Perigo (Vermelho)
```tsx
<PrimaryButton 
  variant="danger"
  onClick={handleDelete}
  icon={<Trash className="w-4 h-4" />}
>
  Excluir
</PrimaryButton>
```

#### Botão Outline (Transparente)
```tsx
<PrimaryButton 
  variant="outline"
  onClick={handleCancel}
>
  Cancelar
</PrimaryButton>
```

### Variantes

| Variante | Cor de Fundo | Uso |
|----------|--------------|-----|
| `primary` | #000aff (azul) | Ações principais |
| `secondary` | #ac2aff (roxo) | Ações secundárias |
| `danger` | Vermelho | Ações destrutivas |
| `outline` | Transparente | Ações alternativas |

### Características
- ✅ Altura: 44px (`h-11`)
- ✅ Bordas arredondadas: `rounded-xl`
- ✅ Padding horizontal: 24px (`px-6`)
- ✅ Ícone opcional com espaçamento automático
- ✅ Estados disabled automáticos
- ✅ Transições suaves
- ✅ Suporte a modo escuro

---

## 🎨 Padrão de Altura

**TODOS** os componentes de formulário devem ter **44px de altura** (`h-11`):

```tsx
// ✅ CORRETO
<FormInput className="h-11" />
<FormSelect className="h-11" />
<PrimaryButton className="h-11" />

// ❌ EVITAR
<Input className="h-10" />  // altura diferente
<select className="py-2" />  // altura variável
```

---

## 📍 Onde Usar

### ✅ Use os componentes padronizados em:
- Campos de busca
- Filtros (selects)
- Botões de ação (adicionar, editar, excluir)
- Formulários de criação/edição
- Barras de ferramentas

### 🔧 Páginas já atualizadas:
- ✅ TimePage (Conheça o Time) - FormInput, FormSelect, PrimaryButton
- ✅ ChamadosRHPage - FormInput para busca
- ✅ ChamadosTEIPage - FormInput, FormSelect, FormTextarea, PrimaryButton
- ✅ ChamadosFinanceiroPage - FormInput, FormSelect, FormTextarea, PrimaryButton

---

## 💡 Exemplos Práticos

### Barra de Filtros (como em TimePage)
```tsx
<div className="flex flex-col sm:flex-row gap-4 items-stretch">
  {/* Filtro de Setor */}
  <div className="w-full sm:w-64">
    <FormSelect
      value={setorFilter}
      onChange={(e) => setSetorFilter(e.target.value)}
      options={['Todos os Setores', 'RH', 'Tecnologia', 'BI']}
    />
  </div>

  {/* Busca */}
  <FormInput
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Buscar por nome, email ou cargo..."
    icon={<Search className="w-5 h-5" />}
  />

  {/* Botão Adicionar */}
  <PrimaryButton
    onClick={handleAdd}
    icon={<Plus className="w-4 h-4" />}
  >
    Adicionar
  </PrimaryButton>
</div>
```

### Formulário Simples
```tsx
<div className="space-y-4">
  <div>
    <Label>Nome Completo</Label>
    <FormInput 
      placeholder="Digite seu nome"
      value={nome}
      onChange={(e) => setNome(e.target.value)}
    />
  </div>

  <div>
    <Label>Setor</Label>
    <FormSelect
      value={setor}
      onChange={(e) => setSetor(e.target.value)}
      options={['RH', 'Tecnologia', 'BI', 'Qualidade']}
    />
  </div>

  <div className="flex gap-4">
    <PrimaryButton type="submit">
      Salvar
    </PrimaryButton>
    <PrimaryButton variant="outline" onClick={onCancel}>
      Cancelar
    </PrimaryButton>
  </div>
</div>
```

---

## 🎯 Cores TradeStars

Os componentes usam as cores oficiais:

```css
--primary: #000aff    /* Azul elétrico */
--secondary: #ac2aff  /* Roxo vibrante */
--accent: #ff00ed     /* Magenta/Rosa */
```

---

## 🌙 Modo Escuro

Todos os componentes têm suporte completo ao modo escuro usando a classe `dark:`:

```tsx
// Modo claro: bg-white, border-gray-200
// Modo escuro: bg-gray-900, border-gray-800
```

---

## 🔄 Migração

Para migrar código existente:

### Antes
```tsx
<div className="relative flex-1">
  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
  <Input
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Buscar..."
    className="h-11 pl-10 bg-white dark:bg-gray-900 rounded-xl"
  />
</div>
```

### Depois
```tsx
<FormInput
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  placeholder="Buscar..."
  icon={<Search className="w-5 h-5" />}
/>
```

---

## 📚 Referências

- Ver `/components/FormInput.tsx` - Input padronizado
- Ver `/components/FormSelect.tsx` - Select padronizado
- Ver `/components/FormTextarea.tsx` - Textarea padronizado
- Ver `/components/PrimaryButton.tsx` - Botão padronizado
- Ver `/DESIGN_SYSTEM.md` para sistema completo de design
- Ver `/GUIA_RAPIDO.md` para referência rápida

## 🔄 Resumo das Alturas

| Componente | Altura | Espaçamento Top | Uso |
|------------|--------|-----------------|-----|
| FormInput | 44px (`h-11`) | 8px (`mt-2`) | Campos de texto |
| FormSelect | 44px (`h-11`) | 8px (`mt-2`) | Dropdowns |
| FormTextarea | Variável (rows) | 8px (`mt-2`) | Texto longo |
| PrimaryButton | 44px (`h-11`) | - | Botões de ação |

**Importante:** O espaçamento de 8px (`mt-2`) garante consistência visual entre o Label e o campo de input em todos os formulários.
