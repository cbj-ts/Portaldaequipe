# 🔧 Solução para Erro no Calendário de Eventos

## 🎯 Problema Identificado

### ❌ **ERRO ATUAL: "Could not find the 'location' column"**

O sistema está tentando salvar o campo `location` mas essa coluna não existe na sua tabela `eventos` do Supabase.

## ✅ **SOLUÇÃO RÁPIDA (2 minutos)**

### **PASSO 1: Adicionar a Coluna no Supabase**

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto  
3. Vá em **SQL Editor** (lateral esquerda)
4. Clique em **New Query**
5. Cole EXATAMENTE isto:

```sql
ALTER TABLE eventos ADD COLUMN IF NOT EXISTS location TEXT;
```

6. Clique em **Run**
7. Aguarde a confirmação "Success"

### **PASSO 2: Testar**

1. Volte ao calendário
2. Tente criar um evento novamente
3. ✅ Deve funcionar perfeitamente!

---

## 🔄 **Outras Soluções Possíveis**

### 1. **Tabela não existe no Supabase**
A tabela `eventos` pode não ter sido criada ainda no seu projeto Supabase.

### 2. **Estrutura da tabela está incorreta**
As colunas podem ter nomes diferentes ou tipos incompatíveis.

### 3. **Permissões (RLS) bloqueando inserção**
O Row Level Security pode estar impedindo a inserção de dados.

---

## ✅ Solução Passo a Passo

### **PASSO 1: Verificar se a tabela existe**

1. Acesse seu Supabase Dashboard: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Table Editor** (lateral esquerda)
4. Procure pela tabela `eventos`

**Se a tabela NÃO existir**, prossiga para o PASSO 2.

**Se a tabela já existir**, verifique se tem as seguintes colunas:
- `id` (int8, primary key, auto-increment)
- `title` (text)
- `date` (text)
- `time` (text, nullable)
- `category` (text)
- `description` (text, nullable)
- `location` (text, nullable)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

---

### **PASSO 2: Criar a tabela no Supabase**

1. No Supabase Dashboard, vá em **SQL Editor** (lateral esquerda)
2. Clique em **New Query**
3. Copie e cole TODO o conteúdo do arquivo `SUPABASE_SETUP_EVENTOS.sql`
4. Clique em **Run** (ou pressione Ctrl/Cmd + Enter)
5. Aguarde a confirmação "Success"

---

### **PASSO 3: Verificar RLS (Row Level Security)**

Se mesmo após criar a tabela o erro persistir:

1. Vá em **Authentication** > **Policies**
2. Selecione a tabela `eventos`
3. Verifique se as políticas estão habilitadas
4. Se necessário, **desabilite o RLS temporariamente** para testar:

```sql
ALTER TABLE eventos DISABLE ROW LEVEL SECURITY;
```

---

### **PASSO 4: Testar no Console do Navegador**

1. Abra o calendário
2. Pressione **F12** para abrir o DevTools
3. Vá na aba **Console**
4. Tente criar um evento
5. Observe as mensagens:
   - `"Payload sendo enviado:"` - mostra os dados que estão sendo enviados
   - `"Resultado do Supabase:"` - mostra a resposta do Supabase
   - Se houver erro, aparecerá `"Erro do Supabase:"` com detalhes

---

## 🧪 Como Testar

### Teste 1: Criar Evento Simples

1. Configure o usuário como RH:
```typescript
// Em /contexts/UserContext.tsx, linha 62
setor: "RH",
```

2. Acesse o calendário
3. Clique em **"Novo Evento"**
4. Preencha:
   - Título: "Teste de Evento"
   - Data: Qualquer data futura
   - Categoria: Reunião
5. Clique em **"Criar Evento"**

**Resultado esperado:**
- ✅ Toast verde: "Evento criado com sucesso!"
- ✅ Evento aparece no calendário

---

## 🐛 Erros Comuns e Soluções

### Erro: "relation 'eventos' does not exist"
**Causa:** Tabela não foi criada
**Solução:** Execute o script SQL do PASSO 2

### Erro: "permission denied for table eventos"
**Causa:** RLS está bloqueando
**Solução:** Ajuste as políticas ou desabilite RLS temporariamente

### Erro: "null value in column 'xxx' violates not-null constraint"
**Causa:** Campo obrigatório está vazio
**Solução:** Verifique se title, date e category estão preenchidos

### Erro: "insert or update on table 'eventos' violates foreign key constraint"
**Causa:** Relacionamento com outra tabela
**Solução:** Verifique se há foreign keys configuradas

---

## 📊 Estrutura Correta da Tabela

```sql
CREATE TABLE eventos (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT,
  category TEXT NOT NULL,
  description TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔍 Debug Avançado

Se o erro persistir após todos os passos:

1. **Verifique a URL do Supabase**
```typescript
// Em CalendarioPage.tsx, linha 54
const supabaseUrl = 'https://fxlygqcrfciegqmodmav.supabase.co';
```
Certifique-se que é a URL correta do seu projeto.

2. **Verifique a API Key**
```typescript
// Em CalendarioPage.tsx, linha 55
const supabaseKey = 'sua-key-aqui';
```
Use a **anon public** key, não a service_role key.

3. **Teste direto no Supabase**
Vá em **Table Editor** > `eventos` > **Insert row** e tente criar manualmente.

---

## 📞 Precisa de Mais Ajuda?

Se ainda estiver com problemas:

1. Abra o Console (F12)
2. Copie TODA a mensagem de erro que aparece em vermelho
3. Me envie a mensagem completa

Vou conseguir identificar exatamente qual é o problema! 🚀
