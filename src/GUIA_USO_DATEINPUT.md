# 🚀 Guia Rápido: Como Usar DateInput e MonthYearInput

## 📦 **Importação**

```tsx
import { DateInput } from './components/DateInput';
import { MonthYearInput } from './components/MonthYearInput';
```

---

## ⚡ **Uso Básico**

### **DateInput - Data Completa**

```tsx
const [date, setDate] = useState('');

<DateInput
  label="Data"
  value={date}
  onChange={setDate}
  required
/>
```

**Resultado:** `date = "2025-01-21"` (formato ISO)

---

### **MonthYearInput - Apenas Mês/Ano**

```tsx
const [monthYear, setMonthYear] = useState('');

<MonthYearInput
  label="Período"
  value={monthYear}
  onChange={setMonthYear}
  required
/>
```

**Resultado:** `monthYear = "2025-01"` (formato ISO)

---

## 🎯 **Casos Comuns**

### **1. Range de Datas (Início e Fim)**

```tsx
const [startDate, setStartDate] = useState('');
const [endDate, setEndDate] = useState('');

<div className="grid grid-cols-2 gap-4">
  <DateInput
    label="Data Inicial"
    value={startDate}
    onChange={setStartDate}
    maxDate={endDate ? new Date(endDate + 'T00:00:00') : undefined}
  />
  
  <DateInput
    label="Data Final"
    value={endDate}
    onChange={setEndDate}
    minDate={startDate ? new Date(startDate + 'T00:00:00') : undefined}
  />
</div>
```

---

### **2. Data com Limite (Hoje em Diante)**

```tsx
const [deliveryDate, setDeliveryDate] = useState('');
const today = new Date();

<DateInput
  label="Data de Entrega"
  value={deliveryDate}
  onChange={setDeliveryDate}
  minDate={today}
  required
/>
```

---

### **3. Filtro por Mês e Ano**

```tsx
const [selectedMonth, setSelectedMonth] = useState('');

<MonthYearInput
  label="Filtrar por Mês"
  value={selectedMonth}
  onChange={setSelectedMonth}
  minYear={2023}
  maxYear={2025}
/>

// Depois, filtrar array:
const filtered = data.filter(item => 
  item.date.startsWith(selectedMonth) // "2025-01-15" starts with "2025-01"
);
```

---

### **4. Formulário Completo**

```tsx
<form onSubmit={handleSubmit} className="space-y-4">
  <FormInput
    label="Título"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    required
  />
  
  <DateInput
    label="Data do Evento"
    value={eventDate}
    onChange={setEventDate}
    required
  />
  
  <FormInput
    type="time"
    label="Horário"
    value={time}
    onChange={(e) => setTime(e.target.value)}
  />
  
  <PrimaryButton type="submit">
    Salvar
  </PrimaryButton>
</form>
```

---

## 🎨 **Props Disponíveis**

### **DateInput:**

```tsx
interface DateInputProps {
  label?: string;           // Label do campo
  value: string;            // YYYY-MM-DD
  onChange: (value: string) => void;
  placeholder?: string;     // Default: "Selecione uma data"
  required?: boolean;       // Mostra asterisco
  disabled?: boolean;
  minDate?: Date;          // Data mínima selecionável
  maxDate?: Date;          // Data máxima selecionável
  className?: string;
}
```

### **MonthYearInput:**

```tsx
interface MonthYearInputProps {
  label?: string;
  value: string;            // YYYY-MM
  onChange: (value: string) => void;
  placeholder?: string;     // Default: "Selecione mês e ano"
  required?: boolean;
  disabled?: boolean;
  minYear?: number;        // Default: 2020
  maxYear?: number;        // Default: 2030
  className?: string;
}
```

---

## 💡 **Dicas**

### **✅ Conversão de Formatos:**

```tsx
// ISO para Display (DD/MM/YYYY)
const formatDate = (isoDate: string) => {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
};

// Display para ISO (YYYY-MM-DD)
const parseDate = (displayDate: string) => {
  const [day, month, year] = displayDate.split('/');
  return `${year}-${month}-${day}`;
};
```

---

### **✅ Validação:**

```tsx
// Verificar se data é válida
const isValidDate = (dateStr: string) => {
  return dateStr && /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
};

// Verificar se está no futuro
const isFutureDate = (dateStr: string) => {
  return new Date(dateStr + 'T00:00:00') > new Date();
};
```

---

### **✅ Integração com Backend:**

```tsx
// O valor já está no formato ISO, pode enviar direto!
const handleSubmit = async () => {
  await api.post('/events', {
    title,
    date: eventDate,  // Já em "YYYY-MM-DD"
    time,
  });
};
```

---

## 🔄 **Migração de Inputs Nativos**

### **Antes:**

```tsx
<input
  type="date"
  value={date}
  onChange={(e) => setDate(e.target.value)}
  className="..."
/>
```

### **Depois:**

```tsx
<DateInput
  value={date}
  onChange={setDate}
/>
```

**Benefícios:**
- ✅ Calendário visual
- ✅ Formato brasileiro no display
- ✅ Consistente com design system
- ✅ Dark mode automático

---

## 📍 **Onde Está Implementado**

✅ **CalendarioPage** - Criar/editar eventos  
✅ **AgendamentoSalasPage** - Filtros de período  
🔜 **ChamadosRHPage** - Datas de solicitação  
🔜 **ChamadosFinanceiroPage** - Data de pagamento  
🔜 **DashboardFinanceiro** - Filtros mensais  

---

## 🎯 **Quando Usar Cada Um**

### **Use DateInput se:**
- ✅ Precisa dia específico
- ✅ É um evento/prazo/entrega
- ✅ Precisa calendário visual
- ✅ Usuário deve escolher data exata

### **Use MonthYearInput se:**
- ✅ Precisa apenas mês/ano
- ✅ É filtro ou relatório mensal
- ✅ Não importa o dia
- ✅ Grid de meses é mais apropriado

### **Use input nativo se:**
- ❌ Nunca! Use os componentes customizados 😄

---

## 🎨 **Personalização**

### **Cores Customizadas:**

```tsx
<DateInput
  className="custom-class"
  // Os componentes respeitam suas classes
/>
```

### **Estilos Inline (se necessário):**

```tsx
<div style={{ maxWidth: '300px' }}>
  <DateInput ... />
</div>
```

---

## 🐛 **Troubleshooting**

### **Problema: Data não aparece**

```tsx
// ❌ Errado
value={date}  // date é Date object

// ✅ Correto  
value={dateStr}  // dateStr é string "YYYY-MM-DD"
```

### **Problema: onChange não funciona**

```tsx
// ❌ Errado
onChange={(e) => setDate(e.target.value)}

// ✅ Correto
onChange={setDate}  // Recebe string diretamente
```

### **Problema: minDate não funciona**

```tsx
// ❌ Errado
minDate={dateStr}  // String não funciona

// ✅ Correto
minDate={new Date(dateStr + 'T00:00:00')}  // Converte para Date
```

---

## ✅ **Checklist de Implementação**

Quando substituir um input de data:

- [ ] Importar DateInput ou MonthYearInput
- [ ] Trocar `<input type="date">` por `<DateInput>`
- [ ] Remover `(e) => setDate(e.target.value)` → usar `setDate` direto
- [ ] Adicionar `label` se não tinha antes
- [ ] Testar calendário abrindo
- [ ] Testar seleção de data
- [ ] Testar formato de exibição
- [ ] Testar dark mode
- [ ] Testar responsividade mobile

---

## 🎉 **Pronto para Usar!**

Agora você tem inputs de data modernos e intuitivos no portal TradeStars! 🚀

**Happy coding!** 💙💜💖
