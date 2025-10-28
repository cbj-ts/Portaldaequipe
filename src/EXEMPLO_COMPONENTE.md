# Exemplo de Componente - TradeStars Portal

## 📋 Exemplo Completo: Página de Listagem

Este exemplo mostra como criar uma página seguindo o sistema de design do portal.

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Users, Clock, TrendingUp } from 'lucide-react';

export function ExemploPage() {
  const items = [
    { 
      id: 1, 
      titulo: 'Item Exemplo 1', 
      descricao: 'Esta é uma descrição do item',
      categoria: 'Tecnologia',
      status: 'Ativo'
    },
    // ... mais items
  ];

  return (
    <div className="space-y-6">
      {/* ========== HEADER DA PÁGINA ========== */}
      <div>
        {/* h1 automático: 30px, semibold, line-height 1.25 */}
        <h1>Título da Página</h1>
        
        {/* Descrição com classes Tailwind personalizadas */}
        <p className="text-gray-600 dark:text-gray-400">
          Descrição da página explicando o conteúdo
        </p>
      </div>

      {/* ========== ESTATÍSTICAS (opcional) ========== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-gray-900 border-gray-200/50 dark:border-gray-800/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                {/* h3 automático: 20px, medium, line-height 1.5 */}
                <h3>125</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total de Items
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        {/* ... mais cards de estatística */}
      </div>

      {/* ========== GRID DE CONTEÚDO ========== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card 
            key={item.id} 
            className="bg-white dark:bg-gray-900 border-gray-200/50 dark:border-gray-800/50 
                       hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
          >
            <CardHeader>
              {/* h3 automático: 20px, medium */}
              <CardTitle>{item.titulo}</CardTitle>
              
              {/* Descrição com estilo padrão do CardDescription */}
              <CardDescription>
                {item.descricao}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Badges para categorias */}
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400">
                  {item.categoria}
                </Badge>
                <Badge className="bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400">
                  {item.status}
                </Badge>
              </div>

              {/* Informações adicionais */}
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>12 usuários</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>2h atrás</span>
                </div>
              </div>

              {/* Botão de ação */}
              <Button className="w-full bg-[#000aff] hover:bg-[#000aff]/90 text-white rounded-xl">
                Ver Detalhes
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

---

## 🎯 Explicação dos Elementos

### 1. Container Principal (`space-y-6`)
```tsx
<div className="space-y-6">
```
- `space-y-6` = 24px de espaçamento vertical entre elementos filhos
- Mantém consistência visual entre seções

### 2. Títulos e Textos

```tsx
<h1>Título da Página</h1>
```
- **Automático**: 30px, semibold (600), line-height 1.25
- Definido em `globals.css`

```tsx
<p className="text-gray-600 dark:text-gray-400">
```
- Cor customizada com Tailwind
- Adapta-se ao modo escuro com `dark:`

### 3. Grid Responsivo

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```
- Mobile: 1 coluna
- Tablet (md): 2 colunas
- Desktop (lg): 3 colunas
- Gap de 24px entre items

### 4. Cards com Hover

```tsx
<Card className="... hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
```
- `hover:shadow-xl`: sombra maior no hover
- `transition-all`: anima todas as mudanças
- `duration-300`: animação de 300ms
- `hover:scale-[1.02]`: aumenta 2% no hover

### 5. Espaçamento Interno

```tsx
<CardContent className="space-y-4">
```
- `space-y-4` = 16px entre elementos filhos
- Use `space-y-{n}` para espaçamento vertical consistente

---

## 🎨 Classes CSS Comuns

### Cores de Texto

```tsx
// Texto normal
className="text-gray-900 dark:text-white"

// Texto secundário
className="text-gray-600 dark:text-gray-400"

// Texto desabilitado
className="text-gray-400 dark:text-gray-500"
```

### Backgrounds

```tsx
// Card claro/escuro
className="bg-white dark:bg-gray-900"

// Background com gradiente
className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black"
```

### Bordas

```tsx
// Borda sutil
className="border border-gray-200/50 dark:border-gray-800/50"

// Borda colorida (esquerda)
className="border-l-4 border-blue-500"
```

### Espaçamentos

```tsx
// Padding
className="p-4"      // 16px em todos os lados
className="p-6"      // 24px em todos os lados
className="px-4 py-6" // 16px horizontal, 24px vertical

// Margin
className="mb-2"     // 8px inferior
className="mb-4"     // 16px inferior
className="mb-6"     // 24px inferior
```

---

## 📱 Padrões de Responsividade

### Layout em Coluna (Mobile) → Grid (Desktop)

```tsx
<div className="flex flex-col md:flex-row gap-4">
  {/* Em mobile: empilhado verticalmente */}
  {/* Em tablet+: lado a lado */}
</div>
```

### Texto que Quebra em Mobile

```tsx
<div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
  <h3>Título Longo</h3>
  <Badge>Status</Badge>
</div>
```

### Esconder em Mobile

```tsx
<div className="hidden md:block">
  {/* Visível apenas em tablet+ */}
</div>

<div className="block md:hidden">
  {/* Visível apenas em mobile */}
</div>
```

---

## ✅ Checklist de Boas Práticas

Ao criar um componente, verifique:

- [ ] Usei `<h1>`, `<h2>`, `<h3>` na ordem correta?
- [ ] O componente é responsivo (funciona em mobile)?
- [ ] Usei espaçamentos consistentes (`space-y-{n}`, `gap-{n}`)?
- [ ] As cores se adaptam ao modo escuro (`dark:`)?
- [ ] Usei os componentes UI existentes (Card, Badge, Button)?
- [ ] Os hover states estão implementados onde apropriado?
- [ ] O código está legível e comentado onde necessário?

---

## 🔗 Próximos Passos

1. Leia o [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) para entender as variáveis CSS
2. Veja os componentes existentes em `/components` como referência
3. Use este exemplo como template para novos componentes
4. Mantenha a consistência com o padrão estabelecido
