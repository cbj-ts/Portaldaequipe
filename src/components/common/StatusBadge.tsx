/**
 * ============================================================================
 * STATUS BADGE - Badge de Status
 * ============================================================================
 * Componente reutilizável para badges de status com cores automáticas
 * 
 * USO:
 * <StatusBadge status="Pendente" />
 * <StatusBadge status="Aprovado" />
 * ============================================================================
 */

import { Badge } from '../ui/badge';

interface StatusBadgeProps {
  status: string;
  colorMap?: Record<string, string>;
}

const DEFAULT_COLOR_MAP: Record<string, string> = {
  'Pendente': 'bg-yellow-500',
  'Em análise': 'bg-blue-500',
  'Aprovado': 'bg-green-500',
  'Recusado': 'bg-red-500',
  'Concluído': 'bg-green-500',
  'Cancelado': 'bg-gray-500',
  'Baixa': 'bg-green-500',
  'Média': 'bg-yellow-500',
  'Alta': 'bg-orange-500',
  'Urgente': 'bg-red-500'
};

export function StatusBadge({ status, colorMap = DEFAULT_COLOR_MAP }: StatusBadgeProps) {
  const color = colorMap[status] || 'bg-gray-500';
  
  return (
    <Badge className={`${color} text-white border-0`}>
      {status}
    </Badge>
  );
}
