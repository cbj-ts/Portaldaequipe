/**
 * ============================================================================
 * MONTH YEAR INPUT - Seletor de Mês e Ano
 * ============================================================================
 * 
 * Input customizado para selecionar mês e ano com interface intuitiva.
 * COMPORTAMENTO PADRÃO: Sempre inicia com o mês/ano atual se não houver valor.
 * 
 * USO:
 * <MonthYearInput
 *   label="Período"
 *   value={monthYear}
 *   onChange={setMonthYear}
 *   placeholder="Selecione mês e ano"
 * />
 * 
 * IMPORTANTE: O componente inicializa automaticamente com mês/ano atual.
 * No seu estado, use: useState('') - o MonthYearInput preencherá automaticamente.
 * 
 * PROPS:
 * - label: Texto do label
 * - value: Data no formato YYYY-MM (vazio = usa mês/ano atual)
 * - onChange: Callback quando mês/ano muda
 * - placeholder: Texto quando vazio (não usado, sempre tem valor)
 * - required: Campo obrigatório
 * - disabled: Desabilita o input
 * - minYear: Ano mínimo selecionável
 * - maxYear: Ano máximo selecionável
 * - defaultToCurrentMonth: Se true, preenche com mês atual (padrão: true)
 * 
 * ============================================================================
 */

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

interface MonthYearInputProps {
  label?: string;
  value: string; // YYYY-MM
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  minYear?: number;
  maxYear?: number;
  className?: string;
  defaultToCurrentMonth?: boolean; // Padrão: true
}

const MESES = [
  { numero: 1, nome: "Janeiro", abrev: "Jan" },
  { numero: 2, nome: "Fevereiro", abrev: "Fev" },
  { numero: 3, nome: "Março", abrev: "Mar" },
  { numero: 4, nome: "Abril", abrev: "Abr" },
  { numero: 5, nome: "Maio", abrev: "Mai" },
  { numero: 6, nome: "Junho", abrev: "Jun" },
  { numero: 7, nome: "Julho", abrev: "Jul" },
  { numero: 8, nome: "Agosto", abrev: "Ago" },
  { numero: 9, nome: "Setembro", abrev: "Set" },
  { numero: 10, nome: "Outubro", abrev: "Out" },
  { numero: 11, nome: "Novembro", abrev: "Nov" },
  { numero: 12, nome: "Dezembro", abrev: "Dez" },
];

export function MonthYearInput({
  label,
  value,
  onChange,
  placeholder = "Selecione mês e ano",
  required = false,
  disabled = false,
  minYear = 2020,
  maxYear = 2030,
  className = "",
  defaultToCurrentMonth = true,
}: MonthYearInputProps) {
  const [open, setOpen] = useState(false);

  // ✅ PADRONIZAÇÃO: Inicializa com mês/ano atual se estiver vazio
  useEffect(() => {
    if (!value && defaultToCurrentMonth && !disabled) {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      onChange(`${year}-${month}`);
    }
  }, [value, defaultToCurrentMonth, disabled, onChange]);

  // Extrair ano e mês do value
  const [currentYear, currentMonth] = value 
    ? value.split('-').map(Number)
    : [new Date().getFullYear(), new Date().getMonth() + 1];

  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Formatar para exibição (Mês/Ano)
  const formatDisplay = (valueStr: string) => {
    if (!valueStr) return "";
    const [year, month] = valueStr.split('-');
    const mes = MESES.find(m => m.numero === Number(month));
    return `${mes?.nome || ''} ${year}`;
  };

  // Handler quando seleciona mês
  const handleSelectMonth = (monthNum: number) => {
    const monthStr = String(monthNum).padStart(2, '0');
    onChange(`${selectedYear}-${monthStr}`);
    setOpen(false);
  };

  // Navegar ano anterior
  const handlePrevYear = () => {
    if (selectedYear > minYear) {
      setSelectedYear(selectedYear - 1);
    }
  };

  // Navegar próximo ano
  const handleNextYear = () => {
    if (selectedYear < maxYear) {
      setSelectedYear(selectedYear + 1);
    }
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
              w-full flex items-center justify-between
              px-4 py-2.5 rounded-lg
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

        <PopoverContent className="w-80 p-4" align="start">
          {/* Header com navegação de ano */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handlePrevYear}
              disabled={selectedYear <= minYear}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <h3 className="font-medium text-gray-900 dark:text-white">
              {selectedYear}
            </h3>

            <button
              type="button"
              onClick={handleNextYear}
              disabled={selectedYear >= maxYear}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Grid de meses */}
          <div className="grid grid-cols-3 gap-2">
            {MESES.map((mes) => {
              const isSelected = currentMonth === mes.numero && currentYear === selectedYear;
              
              return (
                <button
                  key={mes.numero}
                  type="button"
                  onClick={() => handleSelectMonth(mes.numero)}
                  className={`
                    px-3 py-2.5 rounded-lg
                    transition-all duration-200
                    ${
                      isSelected
                        ? 'bg-[#000aff] text-white font-medium'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  {mes.abrev}
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
