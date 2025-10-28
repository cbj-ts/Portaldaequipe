# 🚀 TradeStars Portal - Guia Rápido

## 📖 Comece Aqui

**Novo no projeto?**

```
1. Leia → README_COMPONENTES.md (5 minutos) - Componentes reutilizáveis
2. Leia → GUIA_RAPIDO.md (5 minutos) - Design system
3. Copie → TEMPLATE_COMPONENTE.tsx - Template base
4. Use os componentes em /components/common/
5. Crie seu código limpo e organizado!
```

---

## 🆕 NOVA ARQUITETURA: Componentes Reutilizáveis

### 📦 Guias de Componentização
| Arquivo | Descrição |
|---------|-----------|
| **README_COMPONENTES.md** | 🚀 Guia rápido - Como usar os componentes |
| **COMPONENTIZACAO.md** | 📖 Documentação completa - Arquitetura e exemplos |
| **GUIA_MIGRACAO.md** | 🔄 Passo a passo para migrar código antigo → novo |
| **RESUMO_COMPONENTIZACAO.md** | 📊 Métricas e resultados da componentização |
| **ChamadosFinanceiroPageRefactored.tsx** | ✨ Exemplo prático completo |

### 🧱 Componentes Disponíveis (`/components/common/`)
- **PageHeader** - Cabeçalho com botão voltar
- **TabButton** - Botões de navegação por abas
- **FilterButton** - Botões de filtro
- **SectionCard** - Cards coloridos para seções (5 variantes)
- **FileUploadArea** - Upload completo (drag, paste, click)
- **EmptyState** - Estado vazio para listas
- **StatusBadge** - Badges com cores automáticas
- **FormFieldGroup** - Grid responsivo de campos
- **FormField** - Campo completo (Label + Input/Select/Textarea)

### 💡 Benefícios
- ✅ **50% menos código** - De 600 para 200 linhas
- ✅ **Reutilização máxima** - Sem duplicação
- ✅ **Manutenção centralizada** - Mudanças em um lugar
- ✅ **Desenvolvimento rápido** - Componentes prontos

---

## 📚 Documentação do Design System

| Arquivo | Quando Usar |
|---------|-------------|
| **GUIA_RAPIDO.md** | Referência diária para desenvolvimento |
| **TEMPLATE_COMPONENTE.tsx** | Criar novo arquivo do zero |
| **EXEMPLO_COMPONENTE.md** | Ver código de exemplo |
| **DESIGN_SYSTEM.md** | Entender o sistema |
| **ANTES_E_DEPOIS.md** | Ver comparações |
| **README_DESIGN.md** | Índice completo |

---

## 🎯 Regras de Ouro

### ✅ SEMPRE use:

```tsx
<h1>Título</h1>                    // não: text-2xl font-bold
<div className="space-y-6">        // não: mb-7, mb-5
<div className="gap-6">            // não: gap-5, gap-7
<div className="dark:text-white">  // sempre dark mode
```

### ❌ NUNCA use:

```tsx
<div className="text-2xl font-bold">  // ❌ Use <h1>
className="mb-7"                       // ❌ Use mb-6 ou mb-8
className="gap-5"                      // ❌ Use gap-4 ou gap-6
```

---

## 🎨 Sistema de Design

### Tamanhos de Fonte (automáticos)

```tsx
<h1> = 30px    <h2> = 24px    <h3> = 20px    <p> = 16px
```

### Espaçamentos

```tsx
space-y-6  = 24px    gap-6  = 24px    p-6  = 24px    mb-4  = 16px
```

### Grid Responsivo

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

---

## 🔧 Modificar Globalmente

Edite `/styles/globals.css`:

```css
:root {
  --font-size-3xl: 2.25rem;    /* Aumenta h1 */
  --spacing-6: 2rem;            /* Aumenta espaçamentos */
}
```

---

## ⚡ Template Rápido

```tsx
export function MinhaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 dark:text-white">Título</h1>
        <p className="text-gray-600 dark:text-gray-400">Descrição</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle>Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Conteúdo</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

---

## 🎨 Cores TradeStars

```tsx
bg-[#000aff]  // Azul elétrico
bg-[#ac2aff]  // Roxo vibrante
bg-[#ff00ed]  // Magenta/Rosa
```

---

## 📋 Checklist

Antes de commit:

- [ ] Usa `<h1>`, `<h2>`, `<h3>` (não divs)
- [ ] Espaçamentos 4, 6, 8 (não 3, 5, 7)
- [ ] Dark mode em todas as cores
- [ ] Grid responsivo

---

**Ver documentação completa:** `README_DESIGN.md`
