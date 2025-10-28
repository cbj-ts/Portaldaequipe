/**
 * ============================================================================
 * ACTION BUTTON - Botão de Ação Genérico
 * ============================================================================
 * 
 * Botão reutilizável com várias variantes de cor
 * Para ações primárias, secundárias e destrutivas
 * 
 * ============================================================================
 */

import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  onClick?: () => void;
  label: string;
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function ActionButton({ 
  onClick, 
  label, 
  icon: Icon,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button'
}: ActionButtonProps) {
  
  const baseStyles = 'rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-[#000aff] text-white hover:bg-[#0008dd]',
    secondary: 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800',
    success: 'bg-green-500 text-white hover:bg-green-600',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    ghost: 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
  };
  
  const sizeStyles = {
    sm: 'h-8 px-3',
    md: 'h-10 px-4',
    lg: 'h-11 px-6'
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {Icon && <Icon className="w-5 h-5" />}
      <span>{label}</span>
    </button>
  );
}
