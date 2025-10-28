/**
 * ============================================================================
 * TRADESTARS - BOTÃO PRIMÁRIO PADRONIZADO
 * ============================================================================
 * Componente de botão com estilização consistente
 * 
 * VARIANTES:
 * - primary (azul #000aff) - padrão
 * - secondary (roxo #ac2aff)
 * - danger (vermelho)
 * - outline (transparente com borda)
 * 
 * USO:
 * <PrimaryButton onClick={handleClick} icon={<Plus />}>
 *   Adicionar
 * </PrimaryButton>
 * 
 * <PrimaryButton variant="secondary" icon={<Edit />}>
 *   Editar
 * </PrimaryButton>
 * ============================================================================
 */

import { ReactNode } from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
}

export function PrimaryButton({ 
  children, 
  icon, 
  variant = 'primary', 
  className = '', 
  ...props 
}: PrimaryButtonProps) {
  const variants = {
    primary: 'bg-[#000aff] hover:bg-[#0008dd] text-white',
    secondary: 'bg-[#ac2aff] hover:bg-[#9625e6] text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    outline: 'bg-transparent border-2 border-[#000aff] text-[#000aff] dark:text-white hover:bg-[#000aff] hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-gray-900'
  };

  return (
    <button
      className={`h-10 px-6 rounded-xl inline-flex items-center justify-center whitespace-nowrap transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}
