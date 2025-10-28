/**
 * ============================================================================
 * PAGE HEADER - Cabeçalho de Página com Botão Voltar
 * ============================================================================
 * Componente reutilizável para cabeçalhos de páginas com navegação
 * 
 * USO:
 * <PageHeader 
 *   title="Título da Página"
 *   description="Descrição opcional"
 *   onBack={() => navigate(-1)}
 *   actions={<button>Ação</button>}
 * />
 * ============================================================================
 */

import { ArrowLeft } from 'lucide-react';
import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  onBack?: () => void;
  actions?: ReactNode;
  icon?: ReactNode;
}

export function PageHeader({ title, description, onBack, actions, icon }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
        {onBack && (
          <button
            onClick={onBack}
            className="w-10 h-10 flex-shrink-0 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        )}
        {icon && (
          <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-[#000aff]/10 dark:bg-[#000aff]/20 flex items-center justify-center">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-gray-900 dark:text-white truncate m-[0px]">{title}</h1>
          {description && (
            <p className="text-gray-600 dark:text-gray-400 line-clamp-2 sm:line-clamp-none">{description}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">{actions}</div>}
    </div>
  );
}
