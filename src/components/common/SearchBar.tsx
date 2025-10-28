/**
 * ============================================================================
 * SEARCH BAR - Barra de Busca Padronizada
 * ============================================================================
 * 
 * Input de busca com ícone de lupa usado em várias páginas
 * Design consistente em modo claro e escuro
 * 
 * ============================================================================
 */

import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ 
  value, 
  onChange, 
  placeholder = 'Buscar...', 
  className = '' 
}: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#000aff] focus:border-transparent transition-all"
      />
    </div>
  );
}
