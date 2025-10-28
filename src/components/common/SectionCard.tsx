/**
 * ============================================================================
 * SECTION CARD - Card de Seção com Título e Ícone
 * ============================================================================
 * Componente reutilizável para seções coloridas em formulários
 * 
 * USO:
 * <SectionCard 
 *   title="Informações do Solicitante"
 *   icon={<Building2 />}
 *   variant="green"
 * >
 *   <div>Conteúdo da seção</div>
 * </SectionCard>
 * ============================================================================
 */

import { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  icon?: ReactNode;
  variant?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  children: ReactNode;
  className?: string;
}

export function SectionCard({ title, icon, variant = 'blue', children, className = '' }: SectionCardProps) {
  const variants = {
    blue: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-100',
    green: 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900 text-green-900 dark:text-green-100',
    purple: 'bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900 text-purple-900 dark:text-purple-100',
    orange: 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900 text-orange-900 dark:text-orange-100',
    red: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900 text-red-900 dark:text-red-100'
  };

  const iconColors = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    purple: 'text-purple-600 dark:text-purple-400',
    orange: 'text-orange-600 dark:text-orange-400',
    red: 'text-red-600 dark:text-red-400'
  };

  return (
    <div className={`space-y-4 p-4 rounded-xl border ${variants[variant]} ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon && <span className={iconColors[variant]}>{icon}</span>}
        <h3 className={variants[variant].split(' ').find(c => c.startsWith('text-'))}>{title}</h3>
      </div>
      {children}
    </div>
  );
}
