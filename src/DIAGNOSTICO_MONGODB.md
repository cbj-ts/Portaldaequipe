# 🔍 DIAGNÓSTICO - MongoDB não está puxando dados

## 🎯 Problema Identificado

Você configurou tudo, mas o banco não está recebendo os dados. Vamos diagnosticar!

---

## ✅ PASSO 1: Testar Conexão

Execute este comando primeiro para ver o que está acontecendo:

```bash
npx tsx scripts/testConnection.ts
```

Este script vai mostrar:
- ✅ Se a conexão está funcionando
- 📚 Quais databases existem
- 📦 Quais collections existem
- 📊 Quantos documentos tem em cada collection
- 💡 O que fazer a seguir

---

## 🚨 Problemas Comuns e Soluções

### **1. Erro: "ENOTFOUND" ou "getaddrinfo ENOTFOUND"**

**Problema:** Não consegue encontrar o servidor MongoDB

**Soluções:**
```bash
# Verifique sua internet
ping google.com

# Teste a connection string diretamente
mongosh "mongodb+srv://di01:0hSNqpUXuR9jAtED@cluster0.suk3y4n.mongodb.net/?appName=Cluster0"
```

**Checklist:**
- [ ] Internet funcionando?
- [ ] Cluster ativo no MongoDB Atlas?
- [ ] Connection string correta?

---

### **2. Erro: "Authentication failed" ou "bad auth"**

**Problema:** Credenciais incorretas

**Soluções:**
1. Acesse https://cloud.mongodb.com
2. Vá em **Database Access**
3. Clique em **EDIT** no usuário `di01`
4. Redefina a senha para: `0hSNqpUXuR9jAtED`
5. Clique em **Update User**

**OU crie um novo usuário:**
1. Clique em **ADD NEW DATABASE USER**
2. Username: `di01`
3. Password: `0hSNqpUXuR9jAtED`
4. Role: **Atlas admin**
5. Clique em **Add User**

---

### **3. Erro: "IP not whitelisted" ou "not authorized"**

**Problema:** Seu IP não está permitido

**Soluções:**
1. Acesse https://cloud.mongodb.com
2. Vá em **Network Access**
3. Clique em **ADD IP ADDRESS**
4. Escolha uma opção:

**Opção A - Apenas seu IP atual:**
```
Clique em "ADD CURRENT IP ADDRESS"
```

**Opção B - Liberar todos os IPs (desenvolvimento):**
```
IP Address: 0.0.0.0/0
Description: Allow all IPs
```

5. Clique em **Confirm**

---

### **4. Database criado mas SEM DADOS**

**Problema:** Collections vazias ou sem documentos

**Sintoma:**
```
✓ Collection "users" criada
   - users: 0 documentos  ← PROBLEMA AQUI
```

**Solução:**
```bash
# Execute o script de seed para popular os dados
npx tsx scripts/seedData.ts
```

---

### **5. Script roda mas dados NÃO aparecem no Atlas**

**Problema:** Conectando no banco errado

**Verificar:**
```bash
# 1. Confirme o nome do banco
npx tsx scripts/testConnection.ts

# 2. Verifique se está vendo o banco certo no Atlas
# Acesse: https://cloud.mongodb.com
# Clique em "Browse Collections"
# Procure por: PortalDaEquipe
```

**Se não encontrar "PortalDaEquipe":**
```bash
# Execute novamente
npx tsx scripts/initMongoDB.ts
npx tsx scripts/seedData.ts
```

---

### **6. Erro: "Cannot find module 'tsx'"**

**Solução:**
```bash
npm install -D tsx
```

---

### **7. Erro: "Cannot find module 'mongodb'"**

**Solução:**
```bash
npm install mongodb bcryptjs @types/bcryptjs
```

---

## 🧪 Checklist Completo de Diagnóstico

Execute estes comandos na ordem:

### **Etapa 1: Verificar Dependências**
```bash
npm list mongodb bcryptjs tsx
```

**Esperado:**
```
├── mongodb@X.X.X
├── bcryptjs@X.X.X
└── tsx@X.X.X
```

**Se faltar algo:**
```bash
npm install mongodb bcryptjs @types/bcryptjs tsx
```

---

### **Etapa 2: Testar Conexão**
```bash
npx tsx scripts/testConnection.ts
```

**Esperado:**
```
✅ Conectado com sucesso!
🏓 Ping: OK
📚 Databases disponíveis:
   - admin
   - local
   - PortalDaEquipe ← DEVE ESTAR AQUI
```

**Se NÃO aparecer "PortalDaEquipe", execute:**
```bash
npx tsx scripts/initMongoDB.ts
```

---

### **Etapa 3: Verificar Collections**
```bash
npx tsx scripts/testConnection.ts
```

**Esperado:**
```
📦 Collections em "PortalDaEquipe":
   - users
   - chamados
   - eventos
   - salas
   - reservas
   - cursos
   - progressos
   - newsletters
   - copys
   - produtos
   - checklists
```

**Se NÃO aparecer collections, execute:**
```bash
npx tsx scripts/initMongoDB.ts
```

---

### **Etapa 4: Verificar Dados**
```bash
npx tsx scripts/testConnection.ts
```

**Esperado:**
```
📦 Collections em "PortalDaEquipe":
   - users: 10 documentos       ← DEVE TER DADOS
   - chamados: 3 documentos     ← DEVE TER DADOS
   - eventos: 3 documentos      ← DEVE TER DADOS
   - salas: 3 documentos        ← DEVE TER DADOS
```

**Se mostrar "0 documentos", execute:**
```bash
npx tsx scripts/seedData.ts
```

---

## 🔄 Sequência de Execução Correta

**Se nada estiver funcionando, execute tudo na ordem:**

```bash
# 1. Limpar e reinstalar dependências
rm -rf node_modules package-lock.json
npm install

# 2. Instalar MongoDB e dependências
npm install mongodb bcryptjs @types/bcryptjs tsx

# 3. Testar conexão
npx tsx scripts/testConnection.ts

# 4. Criar collections e índices
npx tsx scripts/initMongoDB.ts

# 5. Popular com dados
npx tsx scripts/seedData.ts

# 6. Testar novamente
npx tsx scripts/testConnection.ts
```

---

## 🎯 Resultado Esperado Final

Após executar tudo, o `testConnection.ts` deve mostrar:

```
🧪 Testando conexão com MongoDB...

📍 URI: mongodb+srv://*****:*****@cluster0.suk3y4n.mongodb.net/?appName=Cluster0
📦 Database: PortalDaEquipe

⏳ Conectando...

✅ Conectado com sucesso!

🏓 Ping: OK

📚 Databases disponíveis:
   - admin (0.00 MB)
   - local (0.00 MB)
   - PortalDaEquipe (0.05 MB)

✅ Database "PortalDaEquipe" encontrado!

📦 Collections em "PortalDaEquipe":
   - users: 10 documentos
   - chamados: 3 documentos
   - eventos: 3 documentos
   - salas: 3 documentos
   - reservas: 0 documentos
   - cursos: 0 documentos
   - progressos: 0 documentos
   - newsletters: 0 documentos
   - copys: 0 documentos
   - produtos: 0 documentos
   - checklists: 0 documentos

✨ Teste de conexão concluído!

🎯 Próximos passos:
   ✅ Tudo pronto! Faça login com:
      Email: admin@tradestars.com
      Senha: tradestars2025
```

---

## 🆘 Ainda com Problemas?

### **Verificar no MongoDB Atlas:**

1. Acesse: https://cloud.mongodb.com
2. Faça login
3. Clique em **"Browse Collections"**
4. Procure: **PortalDaEquipe**
5. Clique nas collections para ver os dados

### **Se os dados aparecem no Atlas mas não no script:**

Problema de cache. Solução:
```bash
# Fechar todas as conexões
pkill -f node

# Executar novamente
npx tsx scripts/testConnection.ts
```

### **Se nada funcionar:**

Execute este comando e me envie a saída:
```bash
npx tsx scripts/testConnection.ts > resultado.txt 2>&1
cat resultado.txt
```

---

## 📞 Comandos Úteis para Debug

### **Ver variáveis de ambiente:**
```bash
# Windows (PowerShell)
$env:MONGODB_URI
$env:MONGODB_DB

# Mac/Linux
echo $MONGODB_URI
echo $MONGODB_DB
```

### **Testar connection string com mongosh:**
```bash
mongosh "mongodb+srv://di01:0hSNqpUXuR9jAtED@cluster0.suk3y4n.mongodb.net/?appName=Cluster0"

# Dentro do mongosh:
show dbs
use PortalDaEquipe
show collections
db.users.countDocuments()
```

### **Verificar se o script está rodando:**
```bash
# Adicionar logs de debug
npx tsx scripts/initMongoDB.ts

# Deve aparecer:
# 🚀 Iniciando configuração do MongoDB...
# ✅ Conectado ao MongoDB Atlas!
# ... etc
```

---

## ✅ Checklist Final

- [ ] Dependências instaladas (`npm install mongodb bcryptjs tsx`)
- [ ] Connection string correta (verificar no testConnection)
- [ ] Cluster ativo no MongoDB Atlas
- [ ] Usuário `di01` existe no Database Access
- [ ] IP liberado no Network Access
- [ ] Database `PortalDaEquipe` criado (verificar no testConnection)
- [ ] Collections criadas (11 collections)
- [ ] Dados inseridos (users: 10, chamados: 3, eventos: 3, salas: 3)
- [ ] Login funcionando (admin@tradestars.com / tradestars2025)

---

## 🎉 Tudo Certo?

Se tudo funcionou, você deve conseguir:
1. Ver o database no MongoDB Atlas
2. Ver 11 collections
3. Ver dados nas collections users, chamados, eventos, salas
4. Fazer login na aplicação

**Credenciais de teste:**
```
Email: admin@tradestars.com
Senha: tradestars2025
```

🚀 **Portal da Equipe pronto para uso!**
