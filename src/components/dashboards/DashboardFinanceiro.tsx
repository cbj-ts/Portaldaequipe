/**
 * ============================================================================
 * DASHBOARD FINANCEIRO - Métricas e KPIs do Financeiro
 * ============================================================================
 */

import { DollarSign, TrendingUp, Clock, FileText } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { PageHeader } from '../common';

export function DashboardFinanceiro() {
  return (
    <div className="space-y-6">
      <PageHeader
        icon={<DollarSign className="w-8 h-8" />}
        title="Dashboard Financeiro"
        description="Métricas e indicadores do time Financeiro"
      />

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <small className="text-gray-600 dark:text-gray-400">Chamados</small>
              <FileText className="w-5 h-5 text-[#000aff]" />
            </div>
            <h2 className="text-gray-900 dark:text-white">35</h2>
            <small className="text-green-600 dark:text-green-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +8% vs. semana anterior
            </small>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <small className="text-gray-600 dark:text-gray-400">Tempo Médio</small>
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <h2 className="text-gray-900 dark:text-white">3.2h</h2>
            <small className="text-gray-600 dark:text-gray-400">
              Dentro da meta
            </small>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <small className="text-gray-600 dark:text-gray-400">Pendentes</small>
              <FileText className="w-5 h-5 text-yellow-500" />
            </div>
            <h2 className="text-gray-900 dark:text-white">8</h2>
            <small className="text-gray-600 dark:text-gray-400">
              Aguardando análise
            </small>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <small className="text-gray-600 dark:text-gray-400">Concluídos</small>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h2 className="text-gray-900 dark:text-white">27</h2>
            <small className="text-green-600 dark:text-green-400">
              77% taxa resolução
            </small>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
        <CardContent className="p-6">
          <h3 className="text-gray-900 dark:text-white mb-4">Tipos de Solicitação</h3>
          <div className="space-y-3">
            {['Reembolso', 'Adiantamento', 'Pagamento Fornecedor', 'Notas Fiscais', 'Prestação de Contas'].map((tipo, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                <p className="text-gray-700 dark:text-gray-300">{tipo}</p>
                <small className="text-gray-600 dark:text-gray-400">{Math.floor(Math.random() * 15) + 3} solicitações</small>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
