/**
 * ============================================================================
 * DATE INPUT - Input de Data com Calendário
 * ============================================================================
 * 
 * Input customizado que abre um calendário embaixo quando clicado.
 * COMPORTAMENTO PADRÃO: Sempre inicia com a data de hoje se não houver valor.
 * 
 * USO:
 * <DateInput
 *   label="Data do Evento"
 *   value={date}
 *   onChange={setDate}
 *   placeholder="Selecione uma data"
 *   required
 * />
 * 
 * IMPORTANTE: O componente inicializa automaticamente com a data de hoje.
 * No seu estado, use: useState('') - o DateInput preencherá automaticamente.
 * 
 * PROPS:
 * - label: Texto do label
 * - value: Data no formato YYYY-MM-DD (vazio = usa hoje)
 * - onChange: Callback quando data muda
 * - placeholder: Texto quando vazio (não usado, sempre tem data)
 * - required: Campo obrigatório
 * - disabled: Desabilita o input
 * - minDate: Data mínima selecionável
 * - maxDate: Data máxima selecionável
 * - defaultToToday: Se true, preenche com hoje automaticamente (padrão: true)
 * 
 * ============================================================================
 */

import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import { useState, useEffect } from "react";

interface DateInputProps {
  label?: string;
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  defaultToToday?: boolean; // Padrão: true
}

export function DateInput({
  label,
  value,
  onChange,
  placeholder = "Selecione uma data",
  required = false,
  disabled = false,
  minDate,
  maxDate,
  className = "",
  defaultToToday = true,
}: DateInputProps) {
  const [open, setOpen] = useState(false);

  // ✅ PADRONIZAÇÃO: Inicializa com data de hoje se estiver vazio
  useEffect(() => {
    if (!value && defaultToToday && !disabled) {
      const today = new Date().toISOString().split('T')[0];
      onChange(today);
    }
  }, [value, defaultToToday, disabled, onChange]);

  // Converter string YYYY-MM-DD para Date
  const dateValue = value ? new Date(value + 'T00:00:00') : undefined;

  // Formatar data para exibição (DD/MM/YYYY)
  const formatDisplay = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr + 'T00:00:00');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Handler quando seleciona data no calendário
  const handleSelect = (date: Date | undefined) => {
    if (!date) {
      onChange("");
      setOpen(false);
      return;
    }

    // Converter Date para YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formatted = `${year}-${month}-${day}`;
    
    onChange(formatted);
    setOpen(false);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="required-asterisk ml-1">*</span>}
        </label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={`
              w-full h-10 flex items-center justify-between
              px-4 rounded-lg
              bg-white dark:bg-gray-800
              border border-gray-200 dark:border-gray-700
              hover:border-gray-300 dark:hover:border-gray-600
              focus:outline-none focus:ring-2 focus:ring-[#000aff]/20
              transition-all duration-200
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              ${!value ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'}
            `}
          >
            <span>
              {value ? formatDisplay(value) : placeholder}
            </span>
            <CalendarIcon className="w-5 h-5 text-gray-400" />
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dateValue}
            onSelect={handleSelect}
            disabled={(date) => {
              if (disabled) return true;
              if (minDate && date < minDate) return true;
              if (maxDate && date > maxDate) return true;
              return false;
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
