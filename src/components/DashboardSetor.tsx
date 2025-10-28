/**
 * ============================================================================
 * DASHBOARD SETOR - Roteador de Dashboards por Setor
 * ============================================================================
 * 
 * Componente que renderiza a dashboard específica do setor do usuário:
 * - TEI → DashboardTEI
 * - RH → DashboardRH
 * - Financeiro → DashboardFinanceiro
 * - Outros → Dashboard Padrão
 * 
 * ============================================================================
 */

import { useUser } from '../contexts/UserContext';
import { DashboardTEI } from './dashboards/DashboardTEI';
import { DashboardRH } from './dashboards/DashboardRH';
import { DashboardFinanceiro } from './dashboards/DashboardFinanceiro';
import { Dashboard } from './Dashboard';
import { Alert, AlertDescription } from './ui/alert';
import { Info } from 'lucide-react';

export function DashboardSetor() {
  const { user, isSetor } = useUser();

  // Renderizar dashboard específica baseado no setor
  if (isSetor('TEI')) {
    return (
      <div className="space-y-6">
        <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-700 dark:text-blue-300">
            Você está visualizando a <strong>Dashboard TEI</strong> com métricas específicas do seu setor.
          </AlertDescription>
        </Alert>
        <DashboardTEI />
      </div>
    );
  }

  if (isSetor('RH')) {
    return (
      <div className="space-y-6">
        <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-700 dark:text-blue-300">
            Você está visualizando a <strong>Dashboard RH</strong> com métricas específicas do seu setor.
          </AlertDescription>
        </Alert>
        <DashboardRH />
      </div>
    );
  }

  if (isSetor('Financeiro')) {
    return (
      <div className="space-y-6">
        <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-700 dark:text-blue-300">
            Você está visualizando a <strong>Dashboard Financeiro</strong> com métricas específicas do seu setor.
          </AlertDescription>
        </Alert>
        <DashboardFinanceiro />
      </div>
    );
  }

  // Dashboard padrão para outros setores
  return (
    <div className="space-y-6">
      <Alert className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <Info className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <AlertDescription className="text-gray-700 dark:text-gray-300">
          Você está visualizando a <strong>Dashboard Geral</strong>. 
          {user?.setor && ` Setor: ${user.setor}`}
        </AlertDescription>
      </Alert>
      <Dashboard />
    </div>
  );
}
