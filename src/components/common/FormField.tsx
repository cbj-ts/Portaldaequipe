/**
 * ============================================================================
 * FORM FIELD - Campo de Formulário Completo (Label + Input)
 * ============================================================================
 * Componente que combina Label e Input para simplificar formulários
 * 
 * USO:
 * <FormField 
 *   label="Nome Completo"
 *   value={nome}
 *   onChange={(e) => setNome(e.target.value)}
 *   required
 * />
 * 
 * NOTA: Campos de data (type="date") automaticamente ganham ícone de calendário à direita
 * ============================================================================
 */

import { ReactNode } from 'react';
import { Calendar } from 'lucide-react';
import { Label } from '../ui/label';
import { FormInput } from '../FormInput';
import { FormSelect } from '../FormSelect';
import { FormTextarea } from '../FormTextarea';

interface FormFieldProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'url' | 'tel' | 'select' | 'textarea';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  icon?: ReactNode;
  options?: Array<string | { value: string; label: string }>;
  rows?: number;
  className?: string;
}

export function FormField({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required, 
  icon,
  options = [],
  rows = 4,
  className = ''
}: FormFieldProps) {
  // Adiciona ícone de calendário automaticamente para campos de data
  const fieldIcon = type === 'date' ? <Calendar className="w-4 h-4" /> : icon;
  const iconPosition = type === 'date' ? 'right' : 'left';

  return (
    <div className={className}>
      <Label>{label} {required && <span className="required-asterisk">*</span>}</Label>
      {type === 'select' ? (
        <FormSelect
          value={value}
          onChange={onChange as any}
          options={options}
          className="w-full"
        />
      ) : type === 'textarea' ? (
        <FormTextarea
          value={value}
          onChange={onChange as any}
          placeholder={placeholder}
          rows={rows}
          required={required}
        />
      ) : (
        <FormInput
          type={type}
          value={value}
          onChange={onChange as any}
          placeholder={placeholder}
          required={required}
          icon={fieldIcon}
          iconPosition={iconPosition}
        />
      )}
    </div>
  );
}
