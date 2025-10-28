/**
 * ============================================================================
 * TAB BUTTON - Botão de Navegação por Abas
 * ============================================================================
 * Componente reutilizável para sistemas de tabs
 * 
 * USO:
 * <TabButton 
 *   active={viewMode === 'form'}
 *   onClick={() => setViewMode('form')}
 *   icon={<FileText />}
 * >
 *   Novo Formulário
 * </TabButton>
 * ============================================================================
 */

import { ReactNode } from 'react';

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon?: ReactNode;
  children: ReactNode;
  count?: number;
}

export function TabButton({ active, onClick, icon, children, count }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`h-10 px-6 rounded-xl transition-colors ${
        active
          ? 'bg-[#000aff] text-white'
          : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800'
      }`}
    >
      {icon && <span className="inline-flex items-center mr-2">{icon}</span>}
      {children}
      {count !== undefined && ` (${count})`}
    </button>
  );
}
