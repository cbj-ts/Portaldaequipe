# 🚀 Como Usar o Portal TradeHub

## ⚡ Início Rápido (3 passos)

### 1. Abra o Portal
O portal já está pronto para uso! Basta abrir no navegador.

### 2. Escolha seu Setor
Abra `/contexts/UserContext.tsx` e mude o setor na linha 67:

```typescript
setor: "RH"           // ← Mude aqui
```

**Setores disponíveis:**
- `"RH"` - Recursos Humanos
- `"Financeiro"` - Financeiro
- `"TEI"` - Tecnologia da Informação
- `"Comunicação"` - Comunicação
- `"Administração"` - Administração
- `"BI"` - Business Intelligence
- `"Cobrança"` - Cobrança
- `"Contratos"` - Contratos
- `"Live"` - Lives
- `"SDR"` - Sales Development
- `"Suporte Aldeia"` - Suporte Aldeia
- `"Suporte Tribo"` - Suporte Tribo
- `"Vendas"` - Vendas

### 3. Recarregue a Página
Após mudar o setor, recarregue o navegador (F5).

---

## 🎯 O que Cada Setor Pode Fazer

### 👥 RH (Recursos Humanos)
- ✅ Ver Dashboard específico do RH
- ✅ Criar e responder chamados de RH
- ✅ Criar/editar eventos no calendário
- ✅ Avaliar colaboradores
- ✅ Visualizar logs de avaliação
- ✅ Gerenciar equipe

**Como testar:**
```typescript
// Em /contexts/UserContext.tsx linha 67
setor: "RH"
```

### 💰 Financeiro
- ✅ Ver Dashboard específico do Financeiro
- ✅ Ver solicitações financeiras
- ✅ Aprovar/Recusar despesas
- ✅ Ver orçamentos anexados
- ✅ Adicionar justificativas

**Como testar:**
```typescript
// Em /contexts/UserContext.tsx linha 67
setor: "Financeiro"
```

### 💻 TEI (Tecnologia)
- ✅ Ver Dashboard específico do TEI
- ✅ Gerenciar chamados técnicos
- ✅ Sistema de prioridades
- ✅ Responder chamados
- ✅ Upload de anexos

**Como testar:**
```typescript
// Em /contexts/UserContext.tsx linha 67
setor: "TEI"
```

### 📢 Comunicação
- ✅ Criar/editar eventos no calendário
- ✅ Gerenciar newsletters
- ✅ Criar copys
- ✅ Acessar ferramentas de comunicação

**Como testar:**
```typescript
// Em /contexts/UserContext.tsx linha 67
setor: "Comunicação"
```

### 👤 Outros Setores
- ✅ Dashboard geral
- ✅ Ver eventos do calendário (sem editar)
- ✅ Criar chamados
- ✅ Agendar salas
- ✅ Acessar cursos e treinamentos
- ✅ Ver informações da equipe

---

## 🗺️ Navegação do Portal

### Menu Principal

#### 🏠 Dashboard
- Página inicial personalizada por setor
- Métricas e atalhos rápidos
- Pendências e próximos eventos

#### ⚡ Central de Ação
- **Agendamento de Salas** - Reserve salas de reunião
- **Calendário** - Eventos e treinamentos da empresa
- **Chamados** - Sistema de solicitações (TEI, RH, Financeiro)

#### 📚 Desenvolvimento
- **Avaliação de Desempenho** - Sistema de avaliação 360°
- **Cursos & Treinamentos** - Plataforma de capacitação

#### 🏢 Empresa
- **Conheça os Setores** - Informações sobre cada área
- **Nossa Equipe** - Diretório de colaboradores

#### 🛠️ Recursos
- **Ferramentas** - Calculadoras, guias e checklists
- **Playbooks** - Link externo para documentação (Coda.io)

---

## 📝 Principais Funcionalidades

### 1. Chamados

#### Criar um Chamado
1. Clique em **"Chamados"** no menu
2. Escolha o tipo (TEI, RH ou Financeiro)
3. Clique em **"Novo Chamado"**
4. Preencha o formulário
5. Anexe arquivos se necessário
6. Clique em **"Criar Chamado"**

#### Responder um Chamado (apenas setores responsáveis)
1. Abra o chamado
2. Preencha a resposta
3. Atualize o status
4. Clique em **"Enviar Resposta"**

### 2. Calendário

#### Ver Eventos
- Clique na data no calendário
- Veja os eventos do dia à direita

#### Criar Evento (apenas RH e Comunicação)
1. Clique em **"Criar Evento"**
2. Preencha: Título, Data, Hora, Categoria, Local
3. Adicione descrição se necessário
4. Clique em **"Salvar Evento"**

### 3. Agendamento de Salas

#### Reservar uma Sala
1. Selecione a sala desejada
2. Escolha a data
3. Defina horário de início e fim
4. Adicione título e descrição
5. Clique em **"Agendar"**

### 4. Avaliação de Desempenho

#### Avaliar um Colaborador
1. Vá em **"Desenvolvimento" → "Avaliação"**
2. Clique em **"Avaliar Colaborador"**
3. Selecione a pessoa
4. Preencha os critérios (nota 1-5)
5. Adicione observações
6. Clique em **"Enviar Avaliação"**

### 5. Cursos e Treinamentos

#### Criar um Curso (RH)
1. Vá em **"Cursos & Treinamentos"**
2. Clique em **"Criar Curso"**
3. Adicione título, descrição, duração
4. Configure módulos e aulas
5. Adicione vídeos do Vimeo
6. Salve o curso

---

## 🎨 Personalização

### Modo Escuro
- Clique no ícone de sol/lua no rodapé da sidebar
- Alterna entre tema claro e escuro
- A preferência é salva no navegador

### Foto de Perfil
- Edite em `/contexts/UserContext.tsx` linha 66
- Use URLs válidas de imagens

### Nome e Cargo
- Edite em `/contexts/UserContext.tsx` linhas 64-65

---

## 💾 Gerenciar Dados

### Ver Dados Salvos
Abra o Console do navegador (F12) e execute:

```javascript
// Ver todos os eventos
console.log(JSON.parse(localStorage.getItem('tradestars_eventos')))

// Ver todos os chamados
console.log(JSON.parse(localStorage.getItem('tradestars_chamados')))

// Ver dados do usuário
console.log(JSON.parse(localStorage.getItem('tradestars_user')))
```

### Limpar Todos os Dados
```javascript
localStorage.clear()
// Depois recarregue a página
```

### Limpar Apenas Eventos
```javascript
localStorage.removeItem('tradestars_eventos')
```

### Limpar Apenas Chamados
```javascript
localStorage.removeItem('tradestars_chamados')
```

---

## 🔍 Filtros e Buscas

### Chamados
- Filtre por status: Pendente, Em análise, Resolvido
- Filtre por prioridade: Alta, Média, Baixa
- Use a barra de busca para encontrar chamados

### Calendário
- Clique nas datas para filtrar eventos
- Filtre por categoria no seletor

### Equipe
- Use a barra de busca para encontrar colaboradores
- Filtre por setor

---

## ⌨️ Atalhos e Dicas

### Dicas de Uso
1. **Campos obrigatórios** - Têm asterisco vermelho (*)
2. **Contadores de caracteres** - Aparecem abaixo dos campos
3. **Botões de voltar** - Sempre no canto superior esquerdo
4. **Validações** - Campos são validados em tempo real
5. **Toasts** - Mensagens de sucesso/erro aparecem no canto da tela

### Atalhos de Teclado
- **ESC** - Fecha modais abertos
- **F5** - Recarrega a página
- **F12** - Abre console do desenvolvedor (para debug)

---

## 🎯 Casos de Uso Comuns

### Caso 1: "Preciso abrir um chamado para o TEI"
1. Menu → **Chamados**
2. Clique em **"TEI"**
3. **"Novo Chamado"**
4. Preencha título, descrição, prioridade
5. **"Criar Chamado"**

### Caso 2: "Sou do RH e preciso avaliar um colaborador"
1. Altere setor para "RH" no UserContext
2. Menu → **Desenvolvimento** → **Avaliação**
3. **"Avaliar Colaborador"**
4. Selecione a pessoa e preencha
5. **"Enviar Avaliação"**

### Caso 3: "Preciso agendar uma sala de reunião"
1. Menu → **Central de Ação** → **Agendamento de Salas**
2. Selecione a sala
3. Escolha data e horário
4. Adicione título
5. **"Agendar"**

### Caso 4: "Sou do Financeiro e preciso aprovar uma despesa"
1. Altere setor para "Financeiro" no UserContext
2. Menu → **Chamados** → **Financeiro**
3. Clique em **"Ver Detalhes"** no chamado
4. Preencha a resposta e selecione "Aprovar"
5. **"Enviar Resposta"**

### Caso 5: "Quero criar um evento no calendário"
1. Altere setor para "RH" ou "Comunicação"
2. Menu → **Calendário**
3. **"Criar Evento"**
4. Preencha os dados
5. **"Salvar Evento"**

---

## 🐛 Resolução de Problemas

### Problema: "Não consigo criar eventos"
**Solução:** Apenas RH e Comunicação podem criar eventos. Verifique o setor no UserContext.

### Problema: "Não vejo o formulário de resposta nos chamados"
**Solução:** Apenas o setor responsável vê o formulário (TEI para chamados TEI, RH para chamados RH, etc.)

### Problema: "Os dados sumiram"
**Solução:** Os dados são salvos no localStorage. Se limpou o cache do navegador, os dados foram perdidos.

### Problema: "A tela está em branco"
**Solução:** 
1. Abra o console (F12)
2. Veja se há erros em vermelho
3. Tente recarregar a página (F5)
4. Limpe o localStorage: `localStorage.clear()`

---

## 📱 Mobile

O portal é totalmente responsivo:

- **Menu Hamburguer** - Clique no ícone ☰ no header
- **Sidebar Overlay** - Menu aparece sobre o conteúdo
- **Cards Empilhados** - Layout vertical no mobile
- **Touch Friendly** - Botões e inputs maiores

---

## ✅ Checklist de Primeiros Passos

- [ ] Abrir o portal no navegador
- [ ] Definir meu setor no UserContext
- [ ] Explorar o Dashboard
- [ ] Testar criar um chamado
- [ ] Ver o calendário de eventos
- [ ] Testar agendar uma sala
- [ ] Explorar cursos e treinamentos
- [ ] Ver o diretório da equipe
- [ ] Testar o modo escuro
- [ ] Explorar as ferramentas

---

## 🎓 Recursos de Aprendizado

### Onde Aprender Mais
- **Guidelines.md** - Guia completo de desenvolvimento
- **DESIGN_SYSTEM.md** - Sistema de design e tipografia
- **GUIA_RAPIDO.md** - Referência rápida
- **README_COMPONENTES.md** - Componentes disponíveis

### Componentes UI (shadcn/ui)
Todos os componentes estão em `/components/ui/`:
- Card, Dialog, Badge, Button, Input, Select, Textarea, etc.

### Ícones (lucide-react)
- Homepage: https://lucide.dev
- Importação: `import { IconName } from 'lucide-react'`

---

**Divirta-se usando o Portal TradeHub! 🚀**

Se tiver dúvidas, veja os arquivos de documentação na pasta raiz.
