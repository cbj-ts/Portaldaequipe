# Guia Rápido - TradeStars Portal

## 🆕 ATENÇÃO: Nova Arquitetura Componentizada!

**Antes de começar, veja:**
- 📦 **[README_COMPONENTES.md](./README_COMPONENTES.md)** - Componentes reutilizáveis prontos para usar
- 📖 **[COMPONENTIZACAO.md](./COMPONENTIZACAO.md)** - Documentação completa da nova arquitetura

**Use os componentes em `/components/common/` para código 50% mais limpo!**

---

## 🚀 Começando em 5 Minutos

### 1️⃣ Alterar Tamanhos de Fonte

**Arquivo:** `/styles/globals.css`

```css
:root {
  /* Modifique estes valores: */
  --font-size-display: 1.875rem;    /* h1: 30px → Altere aqui */
  --font-size-heading: 1.5rem;      /* h2: 24px → Altere aqui */
  --font-size-title: 1.25rem;       /* h3: 20px → Altere aqui */
  --font-size-body: 1rem;           /* p: 16px → Altere aqui */
  --font-size-small: 0.875rem;      /* small: 14px → Altere aqui */
  --font-size-caption: 0.75rem;     /* text-meta: 12px → Altere aqui */
}
```

### 2️⃣ Alterar Espaçamentos

**Arquivo:** `/styles/globals.css`

```css
:root {
  /* Modifique estes valores: */
  --spacing-4: 1rem;      /* 16px → Use em padding */
  --spacing-6: 1.5rem;    /* 24px → Use entre seções */
  --spacing-8: 2rem;      /* 32px → Use em margens grandes */
}
```

**No código JSX:**
```tsx
<div className="space-y-6">   {/* 24px entre filhos */}
<div className="gap-4">       {/* 16px entre items do grid */}
<div className="p-6">         {/* 24px de padding */}
<div className="mb-4">        {/* 16px margin-bottom */}
```

### 3️⃣ Criar uma Nova Página

```tsx
export function MinhaPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1>Título da Página</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Descrição
        </p>
      </div>

      {/* Grid Responsivo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Seus cards aqui */}
      </div>
    </div>
  );
}
```

---

## 📏 Tabela de Referência Rápida

### Tamanhos de Fonte

| Elemento | Variável CSS | Tamanho | Uso |
|----------|-------------|---------|-----|
| h1 | `--font-size-3xl` | 30px | Título da página |
| h2 | `--font-size-2xl` | 24px | Subtítulos |
| h3 | `--font-size-xl` | 20px | Títulos de cards |
| h4 | `--font-size-lg` | 18px | Subtítulos menores |
| p | `--font-size-base` | 16px | Texto normal |
| small | `--font-size-sm` | 14px | Texto pequeno |

### Espaçamentos (Tailwind)

| Classe | Tamanho | Uso |
|--------|---------|-----|
| `gap-2` | 8px | Gap pequeno |
| `gap-4` | 16px | Gap médio |
| `gap-6` | 24px | Gap padrão entre cards |
| `p-4` | 16px | Padding médio |
| `p-6` | 24px | Padding grande |
| `space-y-4` | 16px | Espaço vertical médio |
| `space-y-6` | 24px | Espaço vertical entre seções |

### Grid Responsivo

| Classe | Breakpoint | Colunas |
|--------|-----------|---------|
| `grid-cols-1` | Todos | 1 coluna |
| `md:grid-cols-2` | ≥768px | 2 colunas |
| `lg:grid-cols-3` | ≥1024px | 3 colunas |
| `lg:grid-cols-4` | ≥1024px | 4 colunas |

---

## 🎨 Cores Mais Usadas

### Texto

```tsx
// Título escuro/claro
className="text-gray-900 dark:text-white"

// Texto secundário
className="text-gray-600 dark:text-gray-400"

// Texto desabilitado
className="text-gray-400 dark:text-gray-500"
```

### Background

```tsx
// Card
className="bg-white dark:bg-gray-900"

// Página
className="bg-gray-50 dark:bg-[#0a0a0a]"
```

### Bordas

```tsx
// Borda padrão
className="border border-gray-200/50 dark:border-gray-800/50"
```

### TradeStars (Cores oficiais)

```tsx
// Azul elétrico
className="bg-[#000aff]"

// Roxo vibrante
className="bg-[#ac2aff]"

// Magenta/Rosa
className="bg-[#ff00ed]"
```

---

## 🔧 Modificações Comuns

### Aumentar Todos os Títulos

**Arquivo:** `/styles/globals.css`

```css
:root {
  --font-size-3xl: 2.25rem;    /* h1: 30px → 36px */
  --font-size-2xl: 1.75rem;    /* h2: 24px → 28px */
  --font-size-xl: 1.375rem;    /* h3: 20px → 22px */
}
```

### Aumentar Espaçamento Geral

```css
:root {
  --spacing-4: 1.25rem;   /* 16px → 20px */
  --spacing-6: 2rem;      /* 24px → 32px */
}
```

### Deixar Texto Mais Negrito

```css
:root {
  --font-weight-semibold: 700;  /* h1/h2 mais pesados */
  --font-weight-medium: 600;    /* h3/h4 mais pesados */
}
```

Ou altere diretamente:

```css
h1 {
  font-weight: var(--font-weight-bold);  /* 700 */
}
```

---

## 📋 Checklist de Código Limpo

Ao criar/modificar componentes:

- [ ] ✅ Usei `h1`, `h2`, `h3` na hierarquia correta
- [ ] ✅ Adicionei `dark:` para cores customizadas
- [ ] ✅ Usei `space-y-{n}` ou `gap-{n}` para espaçamento
- [ ] ✅ Grid tem `grid-cols-1` + breakpoints responsivos
- [ ] ✅ Textos secundários têm `text-gray-600 dark:text-gray-400`
- [ ] ✅ Cards têm hover state quando clicáveis
- [ ] ✅ Não usei valores aleatórios (ex: `text-[17px]`)

---

## 📚 Documentação Completa

- **DESIGN_SYSTEM.md** - Sistema completo de design
- **EXEMPLO_COMPONENTE.md** - Exemplos práticos
- **/styles/globals.css** - Todas as variáveis CSS

---

## 💡 Dica Final

**Antes de criar algo novo:**
1. Veja se existe um componente similar em `/components`
2. Copie a estrutura e adapte
3. Mantenha a consistência!

**Para dúvidas:**
- Consulte os exemplos em `/components`
- Leia os comentários em `/styles/globals.css`
- Veja o DESIGN_SYSTEM.md
