/**
 * ============================================================================
 * FILTER BUTTON - Botão de Filtro
 * ============================================================================
 * Componente reutilizável para filtros de status, categoria, etc.
 * 
 * USO:
 * <FilterButton 
 *   active={filter === 'todos'}
 *   onClick={() => setFilter('todos')}
 * >
 *   Todos
 * </FilterButton>
 * ============================================================================
 */

import { ReactNode } from 'react';

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}

export function FilterButton({ active, onClick, children }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`h-10 px-4 rounded-xl transition-colors ${
        active
          ? 'bg-[#000aff] text-white'
          : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800'
      }`}
    >
      {children}
    </button>
  );
}
