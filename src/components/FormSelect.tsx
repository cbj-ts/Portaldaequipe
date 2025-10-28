/**
 * ============================================================================
 * TRADESTARS - SELECT PADRONIZADO
 * ============================================================================
 * Componente de select com estilização consistente
 * 
 * USO:
 * <FormSelect 
 *   value={setor}
 *   onChange={(e) => setSetor(e.target.value)}
 *   options={['Todos', 'RH', 'TI']}
 * />
 * 
 * OU com objetos:
 * <FormSelect 
 *   value={setor}
 *   onChange={(e) => setSetor(e.target.value)}
 *   options={[
 *     { value: 'todos', label: 'Todos os Setores' },
 *     { value: 'rh', label: 'RH' }
 *   ]}
 * />
 * ============================================================================
 */

import { ChevronDown } from 'lucide-react';

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: (string | { value: string; label: string })[];
}

export function FormSelect({ options, className = '', ...props }: FormSelectProps) {
  return (
    <div className="relative mt-2">
      <select
        className={`h-10 px-4 pr-10 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-gray-300 appearance-none cursor-pointer hover:border-[#000aff] dark:hover:border-[#000aff] transition-colors ${className}`}
        {...props}
      >
        {options.map((option) => {
          const isObject = typeof option === 'object';
          const value = isObject ? option.value : option;
          const label = isObject ? option.label : option;
          
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
    </div>
  );
}
