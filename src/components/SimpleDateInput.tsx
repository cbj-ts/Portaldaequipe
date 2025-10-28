/**
 * ============================================================================
 * SIMPLE DATE INPUT - Input de Data Nativo Ultra Leve
 * ============================================================================
 * 
 * Versão super leve do DateInput usando input nativo do HTML.
 * Ideal para formulários que precisam carregar rápido.
 * 
 * COMPORTAMENTO: Sempre inicia com a data de hoje.
 * 
 * USO:
 * <SimpleDateInput
 *   label="Data"
 *   value={date}
 *   onChange={setDate}
 *   required
 * />
 * 
 * VANTAGENS:
 * - ✅ Ultra leve (sem dependências pesadas)
 * - ✅ Rápido de carregar
 * - ✅ Calendário nativo do navegador
 * - ✅ Mesmo comportamento padronizado (hoje por padrão)
 * 
 * QUANDO USAR:
 * - Formulários que precisam de performance máxima
 * - Páginas com muitos inputs de data
 * - Mobile (calendário nativo é otimizado)
 * 
 * ============================================================================
 */

import { CalendarIcon } from "lucide-react";
import { useEffect } from "react";

interface SimpleDateInputProps {
  label?: string;
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  minDate?: string; // YYYY-MM-DD
  maxDate?: string; // YYYY-MM-DD
  className?: string;
  defaultToToday?: boolean;
}

export function SimpleDateInput({
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
}: SimpleDateInputProps) {
  
  // ✅ PADRONIZAÇÃO: Inicializa com data de hoje se estiver vazio
  useEffect(() => {
    if (!value && defaultToToday && !disabled) {
      const today = new Date().toISOString().split('T')[0];
      onChange(today);
    }
  }, [value, defaultToToday, disabled, onChange]);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="required-asterisk ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          min={minDate}
          max={maxDate}
          className={`
            w-full px-4 py-2.5 pr-10 rounded-lg
            bg-white dark:bg-gray-800
            border border-gray-200 dark:border-gray-700
            text-gray-900 dark:text-white
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            hover:border-gray-300 dark:hover:border-gray-600
            focus:outline-none focus:ring-2 focus:ring-[#000aff]/20
            transition-all duration-200
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />
        <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}
