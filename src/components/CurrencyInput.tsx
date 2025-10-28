/**
 * ============================================================================
 * TRADESTARS - INPUT DE MOEDA
 * ============================================================================
 * Componente de input para valores monetários com formatação em tempo real
 * 
 * USO:
 * <CurrencyInput 
 *   value={valor}
 *   onChange={setValor}
 *   label="Valor"
 *   required
 * />
 * 
 * FUNCIONAMENTO:
 * - Armazena apenas números no state (ex: "12345" = R$ 123,45)
 * - Exibe formatado no input (R$ 123,45)
 * - Remove todos os caracteres não numéricos ao digitar
 * ============================================================================
 */

import { DollarSign } from 'lucide-react';
import { FormInput } from './FormInput';

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

const formatCurrency = (value: string) => {
  if (!value) return '';
  const num = parseFloat(value.replace(/[^\d]/g, '')) / 100;
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export function CurrencyInput({ 
  value, 
  onChange, 
  label = 'Valor',
  placeholder = 'R$ 0,00',
  required = false,
  className = ''
}: CurrencyInputProps) {
  return (
    <div className={className}>
      {label && (
        <label className="text-gray-700 dark:text-gray-300 block mb-1.5">
          {label} {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      <FormInput
        type="text"
        value={value ? formatCurrency(value) : ''}
        onChange={(e) => {
          const numbers = e.target.value.replace(/[^\d]/g, '');
          onChange(numbers);
        }}
        placeholder={placeholder}
        icon={<DollarSign className="w-4 h-4" />}
      />
    </div>
  );
}
