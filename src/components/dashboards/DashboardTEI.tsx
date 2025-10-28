/**
 * ============================================================================
 * DASHBOARD TEI - Métricas e KPIs do Time TEI
 * ============================================================================
 * 
 * Dashboard exclusiva para o time de TEI com:
 * - Métricas de chamados TEI
 * - Tempo médio de resolução
 * - Chamados por status
 * - Chamados por prioridade
 * - Histórico de atendimentos
 * - Performance do time
 * 
 * ============================================================================
 */

import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Clock, TrendingUp, AlertCircle, CheckCircle, Users, Calendar, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { PageHeader, SectionCard, StatusBadge } from '../common';
import { Badge } from '../ui/badge';

// Mock de dados - substituir por dados reais da API/Supabase
const mockChamadosTEI = [
  { id: 1, titulo: 'Erro no sistema de integração', prioridade: 'alta', status: 'em_andamento', solicitante: 'Maria Santos', dataAbertura: '2025-01-10', tempoDecorrido: '2h' },
  { id: 2, titulo: 'Atualização de ferramenta', prioridade: 'media', status: 'concluido', solicitante: 'Pedro Lima', dataAbertura: '2025-01-08', tempoConclusao: '4h' },
  { id: 3, titulo: 'Bug na API de dados', prioridade: 'alta', status: 'concluido', solicitante: 'Ana Costa', dataAbertura: '2025-01-05', tempoConclusao: '6h' },
  { id: 4, titulo: 'Configuração de ambiente', prioridade: 'baixa', status: 'pendente', solicitante: 'Carlos Dias', dataAbertura: '2025-01-12', tempoDecorrido: '1h' },
  { id: 5, titulo: 'Integração com novo sistema', prioridade: 'media', status: 'em_andamento', solicitante: 'Juliana Alves', dataAbertura: '2025-01-11', tempoDecorrido: '3h' },
];

export function DashboardTEI() {
  const [periodo, setPeriodo] = useState<'semana' | 'mes' | 'trimestre'>('semana');

  // Métricas calculadas
  const totalChamados = mockChamadosTEI.length;
  const emAndamento = mockChamadosTEI.filter(c => c.status === 'em_andamento').length;
  const concluidos = mockChamadosTEI.filter(c => c.status === 'concluido').length;
  const pendentes = mockChamadosTEI.filter(c => c.status === 'pendente').length;
  const altaPrioridade = mockChamadosTEI.filter(c => c.prioridade === 'alta').length;

  // Tempo médio de resolução (mock)
  const tempoMedio = '4.5h';

  // Dados para gráficos
  const dadosPorStatus = [
    { name: 'Concluídos', value: concluidos, color: '#22c55e' },
    { name: 'Em Andamento', value: emAndamento, color: '#eab308' },
    { name: 'Pendentes', value: pendentes, color: '#6b7280' },
  ];

  const dadosPorPrioridade = [
    { name: 'Alta', value: altaPrioridade, color: '#ef4444' },
    { name: 'Média', value: 2, color: '#f59e0b' },
    { name: 'Baixa', value: 1, color: '#3b82f6' },
  ];

  const dadosHistorico = [
    { dia: 'Seg', abertos: 4, concluidos: 3 },
    { dia: 'Ter', abertos: 6, concluidos: 5 },
    { dia: 'Qua', abertos: 3, concluidos: 4 },
    { dia: 'Qui', abertos: 5, concluidos: 6 },
    { dia: 'Sex', abertos: 4, concluidos: 4 },
  ];

  const dadosPerformance = [
    { nome: 'João Silva', atendimentos: 12, tempoMedio: '3.2h', taxa: 95 },
    { nome: 'Maria Santos', atendimentos: 15, tempoMedio: '2.8h', taxa: 98 },
    { nome: 'Pedro Costa', atendimentos: 10, tempoMedio: '4.1h', taxa: 92 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Activity className="w-8 h-8" />}
        title="Dashboard TEI"
        description="Métricas e indicadores do time de Tecnologia e Integração"
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

      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <small className="text-gray-600 dark:text-gray-400">Total de Chamados</small>
              <Activity className="w-5 h-5 text-[#000aff]" />
            </div>
            <h2 className="text-gray-900 dark:text-white">{totalChamados}</h2>
            <small className="text-green-600 dark:text-green-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +12% vs. semana anterior
            </small>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <small className="text-gray-600 dark:text-gray-400">Tempo Médio</small>
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <h2 className="text-gray-900 dark:text-white">{tempoMedio}</h2>
            <small className="text-green-600 dark:text-green-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              -8% vs. semana anterior
            </small>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <small className="text-gray-600 dark:text-gray-400">Alta Prioridade</small>
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <h2 className="text-gray-900 dark:text-white">{altaPrioridade}</h2>
            <small className="text-gray-600 dark:text-gray-400">
              Requerem atenção imediata
            </small>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <small className="text-gray-600 dark:text-gray-400">Taxa de Conclusão</small>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <h2 className="text-gray-900 dark:text-white">85%</h2>
            <small className="text-green-600 dark:text-green-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +5% vs. semana anterior
            </small>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chamados por Status */}
        <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-5 h-5 text-[#000aff]" />
              Distribuição por Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dadosPorStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dadosPorStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chamados por Prioridade */}
        <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#000aff]" />
              Distribuição por Prioridade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosPorPrioridade}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#000aff" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Histórico Semanal */}
      <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#000aff]" />
            Histórico de Atendimentos - Última Semana
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dadosHistorico}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="abertos" stroke="#ef4444" name="Abertos" strokeWidth={2} />
              <Line type="monotone" dataKey="concluidos" stroke="#22c55e" name="Concluídos" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance do Time */}
      <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#000aff]" />
            Performance Individual do Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dadosPerformance.map((membro) => (
              <div key={membro.nome} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#000aff] text-white flex items-center justify-center">
                    {membro.nome.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-gray-900 dark:text-white">{membro.nome}</h4>
                    <small className="text-gray-600 dark:text-gray-400">
                      {membro.atendimentos} atendimentos
                    </small>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <small className="text-gray-600 dark:text-gray-400 block">Tempo Médio</small>
                    <p className="text-gray-900 dark:text-white">{membro.tempoMedio}</p>
                  </div>
                  <div className="text-right">
                    <small className="text-gray-600 dark:text-gray-400 block">Taxa</small>
                    <Badge className="bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400">
                      {membro.taxa}%
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Últimos Chamados */}
      <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#000aff]" />
            Últimos Chamados TEI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockChamadosTEI.map((chamado) => (
              <div key={chamado.id} className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-gray-900 dark:text-white">{chamado.titulo}</h4>
                    <StatusBadge
                      status={
                        chamado.status === 'concluido' ? 'success' :
                        chamado.status === 'em_andamento' ? 'warning' :
                        'neutral'
                      }
                      label={
                        chamado.status === 'concluido' ? 'Concluído' :
                        chamado.status === 'em_andamento' ? 'Em Andamento' :
                        'Pendente'
                      }
                    />
                    <Badge
                      className={
                        chamado.prioridade === 'alta'
                          ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400'
                          : chamado.prioridade === 'media'
                          ? 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400'
                          : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400'
                      }
                    >
                      {chamado.prioridade === 'alta' ? 'Alta' :
                       chamado.prioridade === 'media' ? 'Média' : 'Baixa'}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <small className="text-gray-600 dark:text-gray-400">
                      Solicitante: {chamado.solicitante}
                    </small>
                    <small className="text-gray-600 dark:text-gray-400">
                      Aberto em: {new Date(chamado.dataAbertura).toLocaleDateString('pt-BR')}
                    </small>
                    <small className="text-gray-600 dark:text-gray-400">
                      {chamado.status === 'concluido' 
                        ? `Resolvido em: ${chamado.tempoConclusao}`
                        : `Tempo decorrido: ${chamado.tempoDecorrido}`
                      }
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
