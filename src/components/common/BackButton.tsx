/**
 * ============================================================================
 * BACK BUTTON - Botão de Voltar Padronizado
 * ============================================================================
 * 
 * Botão circular com ícone de seta para voltar à página anterior
 * Usado no header de todas as páginas internas
 * 
 * ============================================================================
 */

import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
}

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      aria-label="Voltar"
    >
      <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
    </button>
  );
}
