/**
 * ============================================================================
 * TRADESTARS - INPUT PADRONIZADO
 * ============================================================================
 * Componente de input com estilização consistente
 * 
 * USO:
 * <FormInput 
 *   placeholder="Digite algo..."
 *   value={value}
 *   onChange={(e) => setValue(e.target.value)}
 *   icon={<Search />}
 *   iconPosition="left" // ou "right"
 * />
 * 
 * NOTA: Campos type="date" automaticamente ganham ícone de calendário à direita
 * ============================================================================
 */

import { Input } from './ui/input';
import { Calendar } from 'lucide-react';
import { ReactNode } from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

export function FormInput({ icon, iconPosition = 'left', className = '', type, ...props }: FormInputProps) {
  // Adiciona ícone de calendário automaticamente para campos de data
  const finalIcon = type === 'date' && !icon ? <Calendar className="w-4 h-4" /> : icon;
  const finalIconPosition = type === 'date' ? 'right' : iconPosition;

  if (finalIcon) {
    return (
      <div className="relative flex-1 mt-2">
        <div className={`absolute ${finalIconPosition === 'right' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none`}>
          {finalIcon}
        </div>
        <Input
          type={type}
          className={`h-10 ${finalIconPosition === 'right' ? 'pr-10' : 'pl-10'} bg-white dark:bg-gray-900 rounded-xl border-gray-200 dark:border-gray-800 hover:border-[#000aff] dark:hover:border-[#000aff] transition-colors ${className}`}
          {...props}
        />
      </div>
    );
  }

  return (
    <Input
      type={type}
      className={`mt-2 h-10 bg-white dark:bg-gray-900 rounded-xl border-gray-200 dark:border-gray-800 hover:border-[#000aff] dark:hover:border-[#000aff] transition-colors ${className}`}
      {...props}
    />
  );
}
