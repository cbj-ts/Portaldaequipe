/**
 * ============================================================================
 * EMPTY STATE - Estado Vazio
 * ============================================================================
 * Componente reutilizável para exibir quando não há dados
 * 
 * USO:
 * <EmptyState 
 *   icon={<FileText />}
 *   title="Nenhum chamado encontrado"
 *   description="Tente ajustar os filtros"
 * />
 * ============================================================================
 */

import { ReactNode } from 'react';
import { Card, CardContent } from '../ui/card';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
      <CardContent className="p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
          {icon}
        </div>
        <p className="text-gray-600 dark:text-gray-400">{title}</p>
        {description && (
          <small className="text-gray-500 dark:text-gray-500 mt-2 block">{description}</small>
        )}
      </CardContent>
    </Card>
  );
}
