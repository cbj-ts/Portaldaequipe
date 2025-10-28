/**
 * ============================================================================
 * DASHBOARD RH - Métricas e KPIs do RH
 * ============================================================================
 */

import { useState } from 'react';
import { Users, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { PageHeader } from '../common';

export function DashboardRH() {
  const [periodo, setPeriodo] = useState<'semana' | 'mes' | 'trimestre'>('semana');

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Users className="w-8 h-8" />}
        title="Dashboard RH"
        description="Métricas e indicadores do time de Recursos Humanos"
      />

      {/* Filtro de Período */}
      <div className="flex gap-2">
        <button
          onClick={() => setPeriodo('semana')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            periodo === 'semana'
              ? 'bg-[#000aff] text-white'
              : 'bg-white dark:bg-black border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          Última Semana
        </button>
        <button
          onClick={() => setPeriodo('mes')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            periodo === 'mes'
              ? 'bg-[#000aff] text-white'
              : 'bg-white dark:bg-black border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          Último Mês
        </button>
        <button
          onClick={() => setPeriodo('trimestre')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            periodo === 'trimestre'
              ? 'bg-[#000aff] text-white'
              : 'bg-white dark:bg-black border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          Último Trimestre
        </button>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <small className="text-gray-600 dark:text-gray-400">Chamados RH</small>
              <Users className="w-5 h-5 text-[#000aff]" />
            </div>
            <h2 className="text-gray-900 dark:text-white">48</h2>
            <small className="text-green-600 dark:text-green-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +15% vs. semana anterior
            </small>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <small className="text-gray-600 dark:text-gray-400">Tempo Médio</small>
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <h2 className="text-gray-900 dark:text-white">2.5h</h2>
            <small className="text-green-600 dark:text-green-400">
              Abaixo da meta
            </small>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <small className="text-gray-600 dark:text-gray-400">Satisfação</small>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <h2 className="text-gray-900 dark:text-white">4.8/5</h2>
            <small className="text-gray-600 dark:text-gray-400">
              Avaliação média
            </small>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <small className="text-gray-600 dark:text-gray-400">Taxa Resolução</small>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <h2 className="text-gray-900 dark:text-white">92%</h2>
            <small className="text-green-600 dark:text-green-400">
              Acima da meta
            </small>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
        <CardContent className="p-6">
          <h3 className="text-gray-900 dark:text-white mb-4">Solicitações Mais Frequentes</h3>
          <div className="space-y-3">
            {['Férias', 'Atualização de Dados', 'Holerite', 'Benefícios', 'Declarações'].map((tipo, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                <p className="text-gray-700 dark:text-gray-300">{tipo}</p>
                <small className="text-gray-600 dark:text-gray-400">{Math.floor(Math.random() * 20) + 5} solicitações</small>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
