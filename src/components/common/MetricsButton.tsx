/**
 * ============================================================================
 * METRICS BUTTON - Botão de Métricas Padronizado
 * ============================================================================
 * 
 * Botão azul elétrico usado em todas as páginas de chamados
 * Para abrir visualização de métricas e estatísticas
 * 
 * ============================================================================
 */

import { BarChart3 } from 'lucide-react';

interface MetricsButtonProps {
  onClick: () => void;
  label?: string;
}

export function MetricsButton({ onClick, label = 'Métricas' }: MetricsButtonProps) {
  return (
    <button
      onClick={onClick}
      className="h-10 px-4 rounded-xl bg-[#000aff] text-white hover:bg-[#0008dd] transition-colors flex items-center gap-2"
    >
      <BarChart3 className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );
}
