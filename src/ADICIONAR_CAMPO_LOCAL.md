# 📍 Adicionando Campo "Local" ao Calendário

## 🎯 Situação

O campo **"Local"** foi adicionado de volta ao sistema de calendário! Agora todos os eventos podem ter um local especificado, que será exibido com o emoji 📍.

---

## 🔧 Como Ativar

### **SE A TABELA `eventos` JÁ EXISTE:**

Execute este comando no **SQL Editor do Supabase**:

```sql
-- Adicionar a coluna location à tabela existente
ALTER TABLE eventos ADD COLUMN IF NOT EXISTS location TEXT;

-- Verificar se foi adicionada
\d eventos;
```

### **SE A TABELA `eventos` NÃO EXISTE:**

Execute o script completo `/SUPABASE_SETUP_EVENTOS.sql` que já inclui a coluna `location`.

---

## ✨ Funcionalidades Implementadas

### **1. Para RH e Comunicação:**
- ✅ Campo "Local" no formulário de criação/edição
- ✅ Podem preencher local dos eventos
- ✅ Local aparece na visualização

### **2. Para Todos os Usuários:**
- ✅ Local exibido nos eventos com emoji 📍
- ✅ Aparece ao lado da data e horário
- ✅ Visível nas listas de eventos

### **3. Onde o Local Aparece:**
- **Lista de eventos:** `📍 Sala de Reuniões 1`
- **Modal de visualização:** Campo específico "Local"
- **Eventos de hoje:** Junto com data/hora

---

## 🧪 Como Testar

### **1. Configurar usuário RH:**
```typescript
// Em /contexts/UserContext.tsx
setor: "RH", // ou "Comunicação"
```

### **2. Criar evento com local:**
1. Acesse o calendário
2. Clique "Novo Evento"
3. Preencha:
   - **Título:** "Reunião de Time"
   - **Data:** Qualquer data
   - **Categoria:** Reunião
   - **Local:** "Sala de Reuniões 1" ✅
4. Salvar

### **3. Verificar visualização:**
- ✅ Local aparece na lista: `📍 Sala de Reuniões 1`
- ✅ Local aparece no modal de visualização
- ✅ Outros usuários conseguem ver o local

---

## 📋 Exemplos de Locais

**Presenciais:**
- Sala de Reuniões 1
- Auditório Principal
- Copa - 2º Andar
- Estacionamento

**Online:**
- Online - Teams
- Online - Zoom
- Online - Google Meet
- Transmissão ao vivo

**Externos:**
- Bar Parceiro
- Restaurante Central
- Hotel Marriott
- Cliente - Sede SP

---

## 🔄 Estrutura Final da Tabela

```sql
CREATE TABLE eventos (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT,
  category TEXT NOT NULL,
  description TEXT,
  location TEXT,           -- ✅ NOVO CAMPO
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## ✅ Checklist de Verificação

- [ ] Coluna `location` adicionada na tabela Supabase
- [ ] Usuário configurado como RH ou Comunicação
- [ ] Campo "Local" aparece no formulário
- [ ] Local é salvo corretamente no banco
- [ ] Emoji 📍 aparece na visualização dos eventos
- [ ] Outros usuários conseguem ver o local

---

**Agora todos os eventos podem ter um local especificado! 🎉**

Execute o comando SQL acima e teste criando um evento com local.