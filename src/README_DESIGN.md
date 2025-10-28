# 📖 TradeStars Portal - Documentação do Sistema de Design

Bem-vindo à documentação completa do sistema de design do Portal TradeStars! Este é o índice central para toda a documentação.

---

## 🚀 Início Rápido

**Novo no projeto?** Comece aqui:

1. **[GUIA_RAPIDO.md](./GUIA_RAPIDO.md)** ⭐ **COMECE AQUI**
   - Referência rápida de 5 minutos
   - Tabelas de valores prontos
   - Modificações mais comuns

2. **[TEMPLATE_COMPONENTE.tsx](./TEMPLATE_COMPONENTE.tsx)**
   - Template pronto para copiar
   - Exemplo completo funcional
   - Checklist de revisão

3. **[EXEMPLO_COMPONENTE.md](./EXEMPLO_COMPONENTE.md)**
   - Exemplos práticos de uso
   - Padrões de código comentados
   - Casos de uso comuns

---

## 📚 Documentação Completa

### 🎨 Sistema de Design

**[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** - Sistema completo de design
- Tipografia (tamanhos, pesos, line-heights)
- Espaçamentos (sistema de 4px)
- Cores (light e dark mode)
- Responsividade (breakpoints)
- Como modificar globalmente

### 🔄 Aplicação Prática

**[APLICACAO_DO_GUIA.md](./APLICACAO_DO_GUIA.md)** - Status da aplicação
- Componentes já aplicados
- Componentes que não mexer
- Checklist para novos componentes
- Padrões específicos

**[ANTES_E_DEPOIS.md](./ANTES_E_DEPOIS.md)** - Exemplos visuais
- Código antes e depois
- Problemas comuns
- Melhorias aplicadas
- 6 exemplos práticos

---

## 🗂️ Estrutura da Documentação

```
📦 TradeStars Portal
│
├── 📖 README_DESIGN.md           ← VOCÊ ESTÁ AQUI (índice)
│
├── 🚀 Início Rápido
│   ├── GUIA_RAPIDO.md            ← Referência rápida
│   ├── TEMPLATE_COMPONENTE.tsx   ← Template pronto
│   └── EXEMPLO_COMPONENTE.md     ← Exemplos práticos
│
├── 📚 Documentação Completa
│   ├── DESIGN_SYSTEM.md          ← Sistema completo
│   ├── APLICACAO_DO_GUIA.md      ← Status e padrões
│   └── ANTES_E_DEPOIS.md         ← Comparações visuais
│
├── 🎨 Sistema de Estilos
│   └── styles/globals.css        ← Variáveis CSS
│
└── 🧩 Componentes
    ├── components/               ← Componentes aplicados
    └── components/ui/            ← Componentes shadcn (não mexer)
```

---

## 🎯 Casos de Uso Comuns

### 1. "Preciso criar uma nova página"

```
1. Copie TEMPLATE_COMPONENTE.tsx
2. Renomeie e adapte para sua necessidade
3. Siga o checklist no final do arquivo
4. Consulte EXEMPLO_COMPONENTE.md se precisar
```

### 2. "Como alterar tamanho de fonte globalmente?"

```
1. Abra styles/globals.css
2. Modifique as variáveis --font-size-*
3. Ver seção "Como Modificar" em DESIGN_SYSTEM.md
```

### 3. "Como fazer componente responsivo?"

```
Veja seção "Responsividade" em:
- GUIA_RAPIDO.md (tabela rápida)
- EXEMPLO_COMPONENTE.md (código prático)
- ANTES_E_DEPOIS.md (exemplo 5)
```

### 4. "Meu código está inconsistente"

```
1. Compare com ANTES_E_DEPOIS.md
2. Use o checklist em TEMPLATE_COMPONENTE.tsx
3. Veja padrões em APLICACAO_DO_GUIA.md
```

### 5. "Como adicionar dark mode?"

```
Veja seção "Dark Mode" em:
- GUIA_RAPIDO.md (cores mais usadas)
- ANTES_E_DEPOIS.md (exemplo 4)
- TEMPLATE_COMPONENTE.tsx (todos os elementos)
```

---

## 📋 Regras de Ouro

### ✅ SEMPRE faça

1. **Use tags semânticas**: `<h1>`, `<h2>`, `<h3>` (não divs com classes)
2. **Espaçamentos consistentes**: `space-y-6`, `gap-6`, `p-6`, `mb-4`
3. **Dark mode**: Sempre adicione `dark:` nas cores
4. **Responsivo**: Use `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
5. **Componentes do sistema**: Use `Card`, `Button`, `Badge`, etc

### ❌ NUNCA faça

1. **Não** use `text-2xl`, `text-xl`, `font-bold` em títulos
2. **Não** use valores aleatórios (17px, 23px, gap-5, mb-7)
3. **Não** ignore dark mode
4. **Não** quebre a hierarquia (h1 → h4, pulando h2 e h3)
5. **Não** modifique componentes em `/components/ui/` (shadcn)

---

## 🎨 Cores Oficiais TradeStars

```css
#000aff  /* Azul elétrico - primário */
#ac2aff  /* Roxo vibrante - secundário */
#ff00ed  /* Magenta/Rosa - acento */
```

**Uso em código:**
```tsx
className="bg-[#000aff]"
className="text-[#ac2aff]"
className="border-[#ff00ed]"
```

---

## 🔧 Modificações Globais

### Aumentar todos os tamanhos de fonte

**Arquivo:** `styles/globals.css`

```css
:root {
  --font-size-3xl: 2.25rem;    /* h1: 30px → 36px */
  --font-size-2xl: 1.75rem;    /* h2: 24px → 28px */
  --font-size-xl: 1.375rem;    /* h3: 20px → 22px */
}
```

### Aumentar espaçamentos

```css
:root {
  --spacing-6: 2rem;      /* 24px → 32px */
  --spacing-4: 1.25rem;   /* 16px → 20px */
}
```

### Alterar pesos de fonte

```css
:root {
  --font-weight-semibold: 700;  /* h1/h2 mais pesados */
}
```

---

## 📊 Hierarquia de Títulos

| Tag | Tamanho | Peso | Uso | Exemplo |
|-----|---------|------|-----|---------|
| `<h1>` | 30px | Semibold (600) | Título da página | "Cursos & Treinamentos" |
| `<h2>` | 24px | Semibold (600) | Seções principais | "4.5" (estatística) |
| `<h3>` | 20px | Medium (500) | Títulos de cards | "Segurança da Informação" |
| `<h4>` | 18px | Medium (500) | Subtítulos menores | Nome em mini-card |
| `<p>` | 16px | Normal (400) | Texto normal | Descrições |

---

## 🎓 Aprendizado Progressivo

### Nível 1: Iniciante (1 dia)
1. Leia **GUIA_RAPIDO.md** (5 min)
2. Copie **TEMPLATE_COMPONENTE.tsx** (2 min)
3. Crie seu primeiro componente (30 min)

### Nível 2: Intermediário (1 semana)
1. Estude **EXEMPLO_COMPONENTE.md** (15 min)
2. Compare **ANTES_E_DEPOIS.md** (15 min)
3. Refatore um componente existente (1 hora)

### Nível 3: Avançado (1 mês)
1. Domine **DESIGN_SYSTEM.md** (30 min)
2. Leia **APLICACAO_DO_GUIA.md** (20 min)
3. Contribua com melhorias no sistema

---

## 🆘 Suporte e Dúvidas

### Encontrou um problema?

1. **Verifique a documentação:**
   - Tabela de referência em GUIA_RAPIDO.md
   - Exemplos em EXEMPLO_COMPONENTE.md
   - Comparações em ANTES_E_DEPOIS.md

2. **Compare com componentes existentes:**
   - Dashboard.tsx (mais completo)
   - CursosPage.tsx (grid responsivo)
   - SetoresPage.tsx (cards com ícones)

3. **Consulte o template:**
   - TEMPLATE_COMPONENTE.tsx (estrutura completa)

### Quer contribuir?

- Siga os padrões estabelecidos
- Use o checklist em TEMPLATE_COMPONENTE.tsx
- Mantenha consistência com o código existente

---

## 📦 Arquivos do Sistema

| Arquivo | Descrição | Quando Usar |
|---------|-----------|-------------|
| `README_DESIGN.md` | Este arquivo - Índice central | Navegação geral |
| `GUIA_RAPIDO.md` | Referência rápida | Consulta diária |
| `DESIGN_SYSTEM.md` | Sistema completo | Estudo aprofundado |
| `EXEMPLO_COMPONENTE.md` | Exemplos práticos | Criar componentes |
| `TEMPLATE_COMPONENTE.tsx` | Template pronto | Novo arquivo |
| `APLICACAO_DO_GUIA.md` | Status e padrões | Verificar conformidade |
| `ANTES_E_DEPOIS.md` | Comparações visuais | Entender melhorias |
| `styles/globals.css` | Variáveis CSS | Modificar globalmente |

---

## ✅ Checklist Rápido

Antes de fazer commit:

- [ ] Usa `<h1>`, `<h2>`, `<h3>` (não divs com text-xl)
- [ ] Espaçamentos padronizados (4, 6, 8, não 5, 7, 9)
- [ ] Dark mode completo (`dark:` em todas as cores)
- [ ] Grid responsivo (1/2/3 colunas)
- [ ] Componentes do sistema (Card, Button, etc)
- [ ] Hover states implementados
- [ ] Sem valores aleatórios
- [ ] Comentários de seção

---

## 🚀 Começe Agora!

1. **[Leia o GUIA_RAPIDO.md →](./GUIA_RAPIDO.md)**
2. **[Copie o TEMPLATE_COMPONENTE.tsx →](./TEMPLATE_COMPONENTE.tsx)**
3. **[Veja exemplos em EXEMPLO_COMPONENTE.md →](./EXEMPLO_COMPONENTE.md)**

---

**Última atualização:** 16 de Outubro de 2025  
**Versão do sistema:** 1.0  
**Status:** ✅ Completo e documentado

**Bom desenvolvimento! 🚀✨**
