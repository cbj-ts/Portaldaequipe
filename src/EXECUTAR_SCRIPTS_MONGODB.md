# 🚀 Como Executar os Scripts MongoDB

## ✅ Correção Aplicada

Todos os arquivos foram corrigidos com sua connection string real:
- ✅ `/lib/mongodb.ts`
- ✅ `/scripts/initMongoDB.ts`
- ✅ `/scripts/seedData.ts`
- ✅ `/.env`
- ✅ `/.env.example`

---

## 📋 Passo a Passo

### **1. Instalar Dependências**

```bash
npm install mongodb bcryptjs
npm install -D @types/bcryptjs
```

### **2. Verificar Connection String**

Seu cluster configurado:
```
mongodb+srv://di01:0hSNqpUXuR9jAtED@cluster0.suk3y4n.mongodb.net/tradestars_portal
```

### **3. Executar Script de Inicialização**

Este script cria todas as collections e índices:

```bash
npx tsx scripts/initMongoDB.ts
```

**O que esse script faz:**
- ✅ Cria 11 collections (users, chamados, eventos, salas, cursos, etc)
- ✅ Cria todos os índices otimizados
- ✅ Configura validações

**Resultado esperado:**
```
🚀 Iniciando configuração do MongoDB...

✅ Conectado ao MongoDB Atlas!

📦 Criando collections...

  ✓ Collection "users" criada
  ✓ Collection "chamados" criada
  ✓ Collection "eventos" criada
  ...

📊 Criando índices...

  → users
    ✓ Índices criados
  → chamados
    ✓ Índices criados
  ...

✨ MongoDB configurado com sucesso!

📋 Resumo:
   Database: tradestars_portal
   Collections: 11
   Status: Pronto para uso! 🎉
```

### **4. Popular com Dados de Teste**

Este script cria usuários e dados de exemplo:

```bash
npx tsx scripts/seedData.ts
```

**O que esse script faz:**
- ✅ Cria usuários de teste para cada setor
- ✅ Cria chamados de exemplo (TEI, RH, Financeiro)
- ✅ Cria eventos de exemplo
- ✅ Cria salas de reunião

**Resultado esperado:**
```
🌱 Iniciando seed de dados...

🗑️  Limpando dados antigos...
  ✓ Dados antigos removidos

👥 Criando usuários...
  ✓ 8 usuários criados

📞 Criando chamados de exemplo...
  ✓ 6 chamados criados

📅 Criando eventos...
  ✓ 5 eventos criados

🏢 Criando salas...
  ✓ 4 salas criadas

✨ Seed concluído com sucesso!
```

---

## 👤 Credenciais de Teste

Após rodar o seed, você pode fazer login com estas contas:

### Admin Geral
```
Email: admin@tradestars.com
Senha: tradestars2025
Setor: Administração
```

### TEI (Tecnologia)
```
Email: carlos.santos@tradestars.com
Senha: tradestars2025
Setor: TEI
```

### RH
```
Email: ana.costa@tradestars.com
Senha: tradestars2025
Setor: RH
```

### Financeiro
```
Email: marcos.oliveira@tradestars.com
Senha: tradestars2025
Setor: Financeiro
```

### Comercial
```
Email: julia.silva@tradestars.com
Senha: tradestars2025
Setor: Comercial
```

### Desenvolvimento
```
Email: pedro.almeida@tradestars.com
Senha: tradestars2025
Setor: Desenvolvimento
```

---

## 🔍 Verificar Conexão

Para testar se tudo está funcionando:

```bash
npx tsx -e "import { checkConnection } from './lib/mongodb.js'; checkConnection().then(() => process.exit(0))"
```

Deve aparecer: `✅ MongoDB conectado com sucesso!`

---

## ⚠️ Solução de Problemas

### Erro: "querySrv ENOTFOUND"
- ✅ **Corrigido!** Os arquivos agora têm a connection string correta

### Erro: "bad auth"
- Verifique se usuário/senha estão corretos no MongoDB Atlas
- Confirme que o IP está liberado (0.0.0.0/0)

### Erro: "MongoServerError: user is not allowed"
- Vá no MongoDB Atlas → Database Access
- Confirme que o usuário `di01` tem permissões de leitura/escrita

### Erro: "ECONNREFUSED"
- Verifique sua conexão com a internet
- Confirme que o cluster está ativo no MongoDB Atlas

---

## 🎯 Ordem de Execução

**SEMPRE nesta ordem:**

1. ✅ Instalar dependências
2. ✅ `npx tsx scripts/initMongoDB.ts` (criar estrutura)
3. ✅ `npx tsx scripts/seedData.ts` (popular dados)

---

## 🗄️ Ver Dados no MongoDB Atlas

1. Acesse: https://cloud.mongodb.com
2. Faça login
3. Clique em "Browse Collections"
4. Selecione database: **tradestars_portal**
5. Veja as collections criadas

---

## 🔄 Resetar Banco (se necessário)

Para limpar tudo e recomeçar:

```bash
# 1. Recriar estrutura
npx tsx scripts/initMongoDB.ts

# 2. Repopular dados
npx tsx scripts/seedData.ts
```

---

## ✅ Checklist Final

- [x] Connection string configurada
- [x] Arquivos .env criados
- [ ] Dependências instaladas (`npm install mongodb bcryptjs`)
- [ ] Script initMongoDB executado
- [ ] Script seedData executado
- [ ] Login testado na aplicação

---

## 🎉 Pronto!

Após executar os scripts, seu MongoDB estará **100% funcional** com:
- ✅ 8 usuários de teste
- ✅ Chamados de exemplo
- ✅ Eventos no calendário
- ✅ Salas cadastradas
- ✅ Sistema de autenticação funcionando

**Agora é só rodar a aplicação e fazer login!** 🚀
