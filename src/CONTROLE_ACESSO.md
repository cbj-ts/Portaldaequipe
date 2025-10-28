# 🔐 Controle de Acesso por Setor

## 📋 Resumo

Implementado sistema de controle de acesso baseado no setor do usuário para funcionalidades específicas:

| Funcionalidade | Setor Requerido | Onde Aparece |
|----------------|-----------------|--------------|
| **Métricas Financeiro** | `Financeiro` | Chamados → Financeiro → Botão "Métricas" |
| **Métricas TEI** | `TEI` | Chamados → TEI → Botão "Métricas" |
| **Métricas RH** | `RH` | Chamados → RH → Botão "Métricas" |
| **Novo Aviso TEI** | `TEI` | Chamados → TEI → Botão "Novo Aviso" |
| **Formulário Resposta Financeiro** | `Financeiro` | Chamados → Financeiro → Ver detalhes |
| **Formulário Resposta RH** | `RH` | Chamados → RH → Ver detalhes |

---

## 🎯 Como Funciona

### 1. **Context do Usuário**

O arquivo `/contexts/UserContext.tsx` gerencia as informações do usuário:

```typescript
interface User {
  setor: 'TEI' | 'RH' | 'Financeiro' | 'Comercial' | 'BI' | 'Tecnologia' | 'Marketing' | 'Admin';
  // ... outros campos
}
```

A função `isSetor(setor: string)` verifica se o usuário pertence a um setor específico:

```typescript
const isSetor = (setor: string) => {
  return user?.setor === setor;
};
```

---

### 2. **Implementação nas Páginas**

#### **ChamadosFinanceiroPage.tsx**

```typescript
export function ChamadosFinanceiroPage({ onBack, onShowMetrics }: Props) {
  const { user, isSetor } = useUser();
  const isFinanceiro = isSetor('Financeiro');
  
  // ...
  
  return (
    <PageHeader 
      actions={
        onShowMetrics && isFinanceiro && <MetricsButton onClick={onShowMetrics} />
      }
    />
  );
}
```

**Controles implementados:**
- ✅ Botão "Métricas" (linha 449)
- ✅ Formulário de resposta dentro do modal (linha 806)

---

#### **ChamadosTEIPage.tsx**

```typescript
export function ChamadosTEIPage({ onBack, onShowMetrics }: Props) {
  const { user, isSetor } = useUser();
  const isTEI = isSetor('TEI');
  
  // ...
  
  return (
    <>
      <PageHeader 
        actions={
          onShowMetrics && isTEI && <MetricsButton onClick={onShowMetrics} />
        }
      />
      
      {/* Botão "Novo Aviso" */}
      {isTEI && (
        <PrimaryButton onClick={() => setNovoAvisoModalOpen(true)}>
          Novo Aviso
        </PrimaryButton>
      )}
    </>
  );
}
```

**Controles implementados:**
- ✅ Botão "Métricas" (linha 685)
- ✅ Botão "Novo Aviso" (linha 726)

---

#### **ChamadosRHPage.tsx**

```typescript
export function ChamadosRHPage({ onBack, onShowMetrics }: Props) {
  const { user, isSetor } = useUser();
  const isRH = isSetor('RH');
  
  return (
    <PageHeader 
      actions={
        onShowMetrics && isRH && <MetricsButton onClick={onShowMetrics} />
      }
    />
  );
}
```

**Controles implementados:**
- ✅ Botão "Métricas" (linha 254)
- ✅ Formulário de resposta dentro do modal (linha 694)

---

## 🧪 Como Testar

### **Alterar o Setor do Usuário Mock**

Edite o arquivo `/contexts/UserContext.tsx` (linha 42):

```typescript
setor: 'TEI',  // ← Altere aqui
```

**Opções disponíveis:**
- `'TEI'` - Vê métricas TEI e pode criar avisos
- `'Financeiro'` - Vê métricas Financeiro e pode responder chamados
- `'RH'` - Vê métricas RH
- `'Comercial'` / `'BI'` / `'Marketing'` / `'Admin'` - Sem acesso a métricas específicas

---

## 📊 Matriz de Acesso

| Usuário | Métricas Financeiro | Métricas TEI | Métricas RH | Novo Aviso TEI | Responder Chamado Financeiro | Responder Chamado RH |
|---------|---------------------|--------------|-------------|----------------|------------------------------|---------------------|
| **TEI** | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |
| **Financeiro** | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **RH** | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| **Outros** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 🎨 Comportamento Visual

### **Quando o botão não aparece:**

```
┌─────────────────────────────────────┐
│  ← Voltar   Chamados Financeiro     │  ← Sem botão "Métricas"
│                                     │
│  Nova Solicitação   Histórico (5)  │
└─────────────────────────────────────┘
```

### **Quando o botão aparece (usuário autorizado):**

```
┌─────────────────────────────────────┐
│  ← Voltar   Chamados Financeiro  📊 │  ← Com botão "Métricas"
│                                     │
│  Nova Solicitação   Histórico (5)  │
└─────────────────────────────────────┘
```

---

## 🔍 Verificação Rápida

Para verificar rapidamente os controles implementados:

1. **Financeiro:**
   - Abra: Chamados → Financeiro
   - Como TEI: ❌ Sem "Métricas"
   - Como Financeiro: ✅ Com "Métricas" + Formulário de resposta

2. **TEI:**
   - Abra: Chamados → TEI
   - Como Marketing: ❌ Sem "Métricas" nem "Novo Aviso"
   - Como TEI: ✅ Com "Métricas" + "Novo Aviso"

3. **RH:**
   - Abra: Chamados → RH
   - Como Comercial: ❌ Sem "Métricas"
   - Como RH: ✅ Com "Métricas"

---

## 📝 Notas de Implementação

1. **Consistência:** Todos os controles seguem o mesmo padrão:
   ```typescript
   const isSetor = isSetor('NomeDoSetor');
   // Depois usa: isSetor && <ComponenteProtegido />
   ```

2. **Performance:** A verificação é feita no render, sem overhead adicional.

3. **Manutenibilidade:** Fácil adicionar novos controles seguindo o mesmo padrão.

4. **Escalabilidade:** Quando integrar com backend real, basta substituir o mock do UserContext.

---

## 🚀 Próximos Passos

Para integração com sistema de autenticação real:

1. Substituir o mock em `UserContext.tsx` por chamada à API
2. Implementar refresh token
3. Adicionar verificação de permissões no backend
4. Considerar adicionar permissões granulares (além do setor)

---

## 📦 Arquivos Alterados

- ✅ `/components/ChamadosFinanceiroPage.tsx` (controle de métricas + formulário de resposta)
- ✅ `/components/ChamadosTEIPage.tsx` (controle de métricas + novo aviso)
- ✅ `/components/ChamadosRHPage.tsx` (controle de métricas + formulário de resposta)
- ✅ `/contexts/UserContext.tsx` (atualizado comentário)

---

**Status:** ✅ **Implementação Completa**

Todos os controles de acesso baseados em setor foram implementados e testados.
