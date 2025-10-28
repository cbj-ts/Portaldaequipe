/**
 * ============================================================================
 * STAT CARD - Card de Estatística Padronizado
 * ============================================================================
 * 
 * Card usado para exibir métricas e estatísticas em dashboards
 * Inclui ícone, título, valor e descrição opcional
 * 
 * ============================================================================
 */

import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

interface StatCardProps {
  icon: LucideIcon;
  iconColor?: string;
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function StatCard({ 
  icon: Icon, 
  iconColor = 'text-[#000aff]',
  title, 
  value, 
  description,
  trend 
}: StatCardProps) {
  return (
    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center ${iconColor}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-gray-600 dark:text-gray-400">{title}</p>
            </div>
            <h2 className="text-gray-900 dark:text-white mb-1">{value}</h2>
            {description && (
              <small className="text-gray-500 dark:text-gray-500">{description}</small>
            )}
          </div>
          {trend && (
            <div className={`px-2 py-1 rounded-lg ${trend.isPositive ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'}`}>
              <small>{trend.value}</small>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
