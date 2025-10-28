/**
 * ============================================================================
 * TRADESTARS - TEXTAREA PADRONIZADO
 * ============================================================================
 * Componente de textarea com estilização consistente
 * 
 * USO:
 * <FormTextarea 
 *   placeholder="Digite sua mensagem..."
 *   value={mensagem}
 *   onChange={(e) => setMensagem(e.target.value)}
 *   rows={5}
 * />
 * ============================================================================
 */

import { Textarea } from './ui/textarea';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function FormTextarea({ className = '', ...props }: FormTextareaProps) {
  return (
    <Textarea
      className={`mt-2 bg-white dark:bg-gray-900 rounded-xl border-gray-200 dark:border-gray-800 hover:border-[#000aff] dark:hover:border-[#000aff] transition-colors ${className}`}
      {...props}
    />
  );
}
