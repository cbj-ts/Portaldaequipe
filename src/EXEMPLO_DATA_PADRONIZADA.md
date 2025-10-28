# 📅 EXEMPLO: Como Usar Inputs de Data Padronizados

## 🎯 **REGRA DE OURO**

> **Sempre use `useState('')` vazio. O componente preenche automaticamente com hoje!**

---

## ✅ **EXEMPLO COMPLETO: Criar Evento**

```tsx
import { useState } from 'react';
import { DateInput } from './components/DateInput';
import { FormInput } from './components/FormInput';
import { PrimaryButton } from './components/PrimaryButton';
import { toast } from 'sonner@2.0.3';

export function CriarEventoForm() {
  // ✅ Estados vazios - DateInput preenche automaticamente
  const [titulo, setTitulo] = useState('');
  const [data, setData] = useState('');        // ← Vazio = usa hoje!
  const [horario, setHorario] = useState('');
  const [local, setLocal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ data já está preenchida com hoje (YYYY-MM-DD)
    console.log({
      titulo,
      data,      // Ex: "2025-01-21"
      horario,
      local,
    });

    toast.success('Evento criado com sucesso!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        label="Título do Evento"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="Ex: Reunião de equipe"
        required
      />

      {/* ✅ DateInput - Já vem com a data de hoje! */}
      <DateInput
        label="Data"
        value={data}
        onChange={setData}
        required
      />
      {/* 
        Comportamento:
        1. Componente renderiza
        2. Vê que data está vazio
        3. Chama setData('2025-01-21') automaticamente
        4. Campo aparece preenchido com hoje!
        5. Usuário pode mudar se quiser
      */}

      <FormInput
        type="time"
        label="Horário"
        value={horario}
        onChange={(e) => setHorario(e.target.value)}
      />

      <FormInput
        label="Local"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder="Ex: Sala 101"
      />

      <PrimaryButton type="submit">
        Criar Evento
      </PrimaryButton>
    </form>
  );
}
```

---

## 🎨 **VISUAL: Como Aparece Para o Usuário**

### **1. Formulário Abre:**

```
┌─────────────────────────────────────┐
│ Criar Novo Evento                   │
├─────────────────────────────────────┤
│                                     │
│ Título do Evento *                  │
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Data *                              │
│ ┌─────────────────────────────────┐ │
│ │ 21/01/2025              📅      │ │ ← JÁ PREENCHIDO!
│ └─────────────────────────────────┘ │
│                                     │
│ Horário                             │
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Local                               │
│ ┌─────────────────────────────────┐ │
│ │ Ex: Sala 101                    │ │
│ └─────────────────────────────────┘ │
│                                     │
│        [Criar Evento]               │
│                                     │
└─────────────────────────────────────┘
```

**✅ Usuário vê a data de hoje JÁ preenchida!**

---

### **2. Usuário Clica no Campo de Data:**

```
┌─────────────────────────────────────┐
│ Data *                              │
│ ┌─────────────────────────────────┐ │
│ │ 21/01/2025              📅      │ │ ← Clique aqui
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
          ↓ Abre calendário
┌─────────────────────────────────────┐
│   Janeiro 2025        ◀  ▶         │
├─────────────────────────────────────┤
│ D  S  T  Q  Q  S  S                │
│ 1  2  3  4  5  6  7                │
│ 8  9 10 11 12 13 14                │
│15 16 17 18 19 20 [21]              │ ← 21 selecionado (hoje)
│22 23 24 25 26 27 28                │
│29 30 31                            │
└─────────────────────────────────────┘
```

**✅ Calendário abre com dia de hoje destacado!**

---

### **3. Usuário Seleciona Outro Dia (Opcional):**

```
┌─────────────────────────────────────┐
│   Janeiro 2025        ◀  ▶         │
├─────────────────────────────────────┤
│ D  S  T  Q  Q  S  S                │
│ 1  2  3  4  5  6  7                │
│ 8  9 10 11 12 13 14                │
│15 16 17 18 19 20 21                │
│22 23 24 [25] 26 27 28              │ ← Clicou em 25
│29 30 31                            │
└─────────────────────────────────────┘
          ↓ Campo atualiza
┌─────────────────────────────────────┐
│ Data *                              │
│ ┌─────────────────────────────────┐ │
│ │ 25/01/2025              📅      │ │ ← Mudou para 25!
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**✅ Data muda instantaneamente!**

---

## 💡 **CASOS DE USO REAIS**

### **Caso 1: Criar Evento Para Hoje**

```tsx
// Usuário abre formulário
// Data já está em 21/01/2025
// Usuário NÃO precisa mudar nada
// Clica em "Criar Evento"
// ✅ Evento criado para hoje!
```

**Economia:** 3 cliques (abrir calendário, navegar, selecionar)

---

### **Caso 2: Criar Evento Para Amanhã**

```tsx
// Usuário abre formulário
// Data está em 21/01/2025
// Usuário clica no campo
// Clica em "22" no calendário
// Clica em "Criar Evento"
// ✅ Evento criado para amanhã!
```

**Total:** 3 cliques (bem rápido!)

---

### **Caso 3: Criar Evento Para Daqui 10 Dias**

```tsx
// Usuário abre formulário
// Data está em 21/01/2025
// Usuário clica no campo
// Clica em "31" no calendário
// Clica em "Criar Evento"
// ✅ Evento criado para 31/01!
```

**Total:** 3 cliques (eficiente!)

---

## 🔄 **FLUXO TÉCNICO COMPLETO**

### **Passo a Passo:**

```tsx
// 1. Componente renderiza
const [data, setData] = useState(''); // data = ""

<DateInput value={data} onChange={setData} />

// 2. DateInput detecta valor vazio
useEffect(() => {
  if (!value && defaultToToday) {
    // value = ""
    // defaultToToday = true (padrão)
    
    const today = new Date().toISOString().split('T')[0];
    // today = "2025-01-21"
    
    onChange(today);
    // Chama setData('2025-01-21')
  }
}, [value, defaultToToday, onChange]);

// 3. Estado do pai atualiza
// data = "2025-01-21"

// 4. DateInput re-renderiza com novo valor
<DateInput value="2025-01-21" onChange={setData} />

// 5. Campo mostra "21/01/2025" para o usuário
```

---

## 🎯 **COMPARAÇÃO: Antigo vs Novo**

### **❌ Código Antigo (Trabalhoso):**

```tsx
// Tinha que inicializar manualmente
const [data, setData] = useState(
  new Date().toISOString().split('T')[0]
); // 😫 Longo e repetitivo

// Ou em useEffect
useEffect(() => {
  setData(new Date().toISOString().split('T')[0]);
}, []); // 😫 Código extra

// Input nativo (sem calendário)
<input
  type="date"
  value={data}
  onChange={(e) => setData(e.target.value)}
  className="..." // 😫 Estilo manual
/>
```

**Problemas:**
- ❌ 3+ linhas de código
- ❌ Fácil esquecer
- ❌ Inconsistente
- ❌ Sem calendário visual

---

### **✅ Código Novo (Simples):**

```tsx
// Estado limpo
const [data, setData] = useState(''); // 😊 1 linha!

// Componente padronizado
<DateInput
  value={data}
  onChange={setData}
  required
/> // 😊 Tudo automático!
```

**Vantagens:**
- ✅ 1 linha de código
- ✅ Impossível esquecer
- ✅ Sempre consistente
- ✅ Calendário visual incluído
- ✅ Dark mode automático
- ✅ Formato brasileiro

---

## 📱 **RESPONSIVIDADE**

### **Desktop:**
```
┌─────────────────────────────────────┐
│ Data *                              │
│ ┌─────────────────────────────────┐ │
│ │ 21/01/2025              📅      │ │
│ └─────────────────────────────────┘ │
│                                     │
│      Calendário grande embaixo     │
└─────────────────────────────────────┘
```

### **Mobile:**
```
┌───────────────────┐
│ Data *            │
│ ┌───────────────┐ │
│ │ 21/01  📅     │ │
│ └───────────────┘ │
│                   │
│ Calendário menor  │
│ mas funcional     │
└───────────────────┘
```

**✅ Funciona perfeitamente em qualquer tela!**

---

## 🎊 **BENEFÍCIOS FINAIS**

### **Para o Usuário:**

1. ✅ Campo já preenchido (menos trabalho)
2. ✅ Calendário visual (mais fácil)
3. ✅ Formato brasileiro (familiar)
4. ✅ Hoje destacado (orientação clara)
5. ✅ Rápido de usar (3 cliques)

### **Para o Desenvolvedor:**

1. ✅ Código limpo (1 linha)
2. ✅ Zero configuração (automático)
3. ✅ Consistente (mesmo em toda aplicação)
4. ✅ Fácil manutenção (tudo centralizado)
5. ✅ Menos bugs (menos código = menos erros)

---

## 🚀 **COMEÇE A USAR AGORA**

```tsx
import { DateInput } from './components/DateInput';

function MeuFormulario() {
  const [data, setData] = useState(''); // ← Só isso!

  return (
    <DateInput
      label="Selecione a Data"
      value={data}
      onChange={setData}
      required
    />
  );
}
```

**É só isso! O resto é automático! 🎉**

---

**Última atualização:** 21/01/2025  
**Versão:** 2.0.0 - Padronizado  
**Status:** ✅ Pronto para Produção
