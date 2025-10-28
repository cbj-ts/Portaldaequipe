# TradeStars Portal - Sistema de Design

## 📝 Visão Geral

Este documento descreve o sistema de design do portal TradeStars, facilitando a manutenção e modificação por desenvolvedores.

---

## 🎨 Tipografia

### Tamanhos de Fonte

Todos os tamanhos de fonte são definidos em `/styles/globals.css`:

```css
--font-size-xs: 0.75rem;      /* 12px - textos muito pequenos */
--font-size-sm: 0.875rem;     /* 14px - textos pequenos */
--font-size-base: 1rem;       /* 16px - texto padrão */
--font-size-lg: 1.125rem;     /* 18px - texto grande */
--font-size-xl: 1.25rem;      /* 20px - h3 */
--font-size-2xl: 1.5rem;      /* 24px - h2 */
--font-size-3xl: 1.875rem;    /* 30px - h1 */
--font-size-4xl: 2.25rem;     /* 36px - títulos grandes */
```

### Hierarquia de Títulos

| Elemento | Tamanho | Peso | Uso |
|----------|---------|------|-----|
| `<h1>` | 30px (1.875rem) | Semibold (600) | Título principal da página |
| `<h2>` | 24px (1.5rem) | Semibold (600) | Subtítulos de seções importantes |
| `<h3>` | 20px (1.25rem) | Medium (500) | Títulos de cards e componentes |
| `<h4>` | 18px (1.125rem) | Medium (500) | Subtítulos menores |
| `<p>` | 16px (1rem) | Normal (400) | Texto de parágrafo |

### Pesos de Fonte

```css
--font-weight-normal: 400;    /* texto normal */
--font-weight-medium: 500;    /* texto médio */
--font-weight-semibold: 600;  /* texto semi-negrito */
--font-weight-bold: 700;      /* texto negrito */
```

### Altura de Linha

```css
--line-height-tight: 1.25;    /* linhas compactas - use em títulos */
--line-height-normal: 1.5;    /* linhas normais - padrão */
--line-height-relaxed: 1.75;  /* linhas espaçadas - use em textos longos */
```

---

## 📏 Espaçamentos

Sistema de espaçamento baseado em múltiplos de 4px:

```css
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
```

### Como Usar

**No CSS:**
```css
.meu-componente {
  margin-bottom: var(--spacing-6);
  padding: var(--spacing-4);
}
```

**Com Tailwind CSS:**
```tsx
<div className="mb-6 p-4">
  {/* mb-6 = 24px, p-4 = 16px */}
</div>
```

---

## 🎨 Cores

### Cores Principais - TradeStars

```css
/* Cores oficiais da marca */
#000aff  /* Azul elétrico - primário */
#ac2aff  /* Roxo vibrante - secundário */
#ff00ed  /* Magenta/Rosa - acento */
```

### Cores do Sistema

As cores do sistema são definidas em variáveis CSS e se adaptam automaticamente ao modo escuro:

- `--background`: Cor de fundo principal
- `--foreground`: Cor do texto principal
- `--card`: Cor de fundo dos cards
- `--primary`: Cor primária
- `--secondary`: Cor secundária
- `--accent`: Cor de destaque
- `--muted`: Cor para elementos discretos

---

## 📱 Responsividade

### Breakpoints

O sistema usa breakpoints padrão do Tailwind CSS:

| Nome | Tamanho | Uso |
|------|---------|-----|
| `sm` | 640px | Celulares em landscape |
| `md` | 768px | Tablets |
| `lg` | 1024px | Notebooks pequenos |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Telas grandes |

### Exemplo de Uso

```tsx
<div className="
  grid 
  grid-cols-1        /* 1 coluna em mobile */
  md:grid-cols-2     /* 2 colunas em tablet */
  lg:grid-cols-3     /* 3 colunas em desktop */
  gap-6              /* espaçamento de 24px */
">
  {/* conteúdo */}
</div>
```

---

## 🔧 Como Modificar

### 1. Alterar Tamanhos de Fonte Globalmente

Edite `/styles/globals.css`:

```css
:root {
  /* Altere estes valores para modificar todos os tamanhos */
  --font-size-3xl: 2rem;      /* Aumenta h1 de 30px para 32px */
  --font-size-base: 1.125rem; /* Aumenta texto padrão de 16px para 18px */
}
```

### 2. Alterar Espaçamentos Globalmente

```css
:root {
  /* Altere estes valores para modificar espaçamentos */
  --spacing-4: 1.25rem;  /* Muda de 16px para 20px */
  --spacing-6: 2rem;     /* Muda de 24px para 32px */
}
```

### 3. Alterar Pesos de Fonte

```css
:root {
  --font-weight-semibold: 700;  /* Muda h1/h2 para negrito */
  --font-weight-medium: 600;    /* Muda h3/h4 para semi-negrito */
}
```

### 4. Alterar Estilos de um Elemento Específico

Edite a seção de tipografia em `/styles/globals.css`:

```css
h1 {
  font-size: var(--font-size-4xl);  /* Muda h1 para 36px */
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-4);
}
```

---

## 📂 Estrutura de Componentes

### Padrão de Card

```tsx
<Card className="bg-white dark:bg-gray-900 border-gray-200/50 dark:border-gray-800/50">
  <CardHeader>
    <CardTitle>Título do Card</CardTitle>
    <CardDescription>Descrição do card</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Conteúdo */}
  </CardContent>
</Card>
```

### Padrão de Página

```tsx
export function MinhaPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1>Título da Página</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Descrição da página
        </p>
      </div>

      {/* Conteúdo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Cards ou componentes */}
      </div>
    </div>
  );
}
```

---

## 🎯 Boas Práticas

### ✅ Faça

- Use as variáveis CSS definidas em `globals.css`
- Use o sistema de espaçamento baseado em 4px
- Use classes Tailwind para responsividade
- Mantenha consistência com os padrões estabelecidos

### ❌ Evite

- Valores de fonte e espaçamento aleatórios (ex: `font-size: 17px`)
- Classes inline com valores customizados
- Quebrar a hierarquia de títulos (ex: h1 → h4)
- Ignorar o sistema de cores do tema escuro

---

## 📞 Suporte

Para dúvidas sobre o sistema de design, consulte:
- Este documento (`DESIGN_SYSTEM.md`)
- O arquivo de estilos (`/styles/globals.css`)
- Os componentes de exemplo em `/components`

**Última atualização:** Outubro 2025
