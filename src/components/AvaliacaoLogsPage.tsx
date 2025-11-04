/**
 * ============================================================================
 * LOGS DA AVALIAÇÃO DE DESEMPENHO
 * ============================================================================
 * 
 * Sistema completo de registro de todas as ações realizadas no módulo de
 * avaliação de desempenho.
 * 
 * FUNCIONALIDADES:
 * - Histórico de avaliações enviadas
 * - Registro de anotações adicionadas
 * - Filtros por tipo de ação, avaliador, colaborador e período
 * - Timeline visual de atividades
 * - Detalhes completos de cada ação
 * - Exportação de relatórios
 * 
 * TIPOS DE LOG:
 * - Avaliação de colaborador enviada
 * - Avaliação de líder enviada
 * - Anotação adicionada
 * - Anotação editada
 * - Anotação removida
 * 
 * ============================================================================
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  ArrowLeft, 
  FileText, 
  MessageSquare, 
  Star, 
  AlertCircle, 
  CheckCircle,
  Calendar,
  Filter,
  Download,
  Search,
  Clock,
  User,
  TrendingUp,
  TrendingDown,
  Users
} from 'lucide-react';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';
import { DateInput } from './DateInput';

// Tipos de log
type TipoLog = 
  | 'avaliacao_colaborador' 
  | 'avaliacao_lider' 
  | 'anotacao_adicionada'
  | 'anotacao_editada'
  | 'anotacao_removida';

interface LogItem {
  id: string;
  tipo: TipoLog;
  avaliador: {
    nome: string;
    setor: string;
  };
  alvo: {
    nome: string;
    setor: string;
  };
  data: string;
  hora: string;
  detalhes: {
    media?: number;
    mediaAnterior?: number;
    tituloAnotacao?: string;
    descricaoAnotacao?: string;
    criteriosAvaliados?: number;
  };
}

export function AvaliacaoLogsPage() {
  const navigate = useNavigate();
  
  // Estados de filtro
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroAvaliador, setFiltroAvaliador] = useState<string>('');
  const [filtroAlvo, setFiltroAlvo] = useState<string>('');
  const [filtroDataInicio, setFiltroDataInicio] = useState<string>('');
  const [filtroDataFim, setFiltroDataFim] = useState<string>('');
  const [busca, setBusca] = useState<string>('');

  // Dados mockados para demonstração
  const logs: LogItem[] = [
    {
      id: '1',
      tipo: 'avaliacao_colaborador',
      avaliador: { nome: 'Carlos Mendes', setor: 'RH' },
      alvo: { nome: 'Ana Silva', setor: 'Vendas' },
      data: '20/10/2025',
      hora: '14:35',
      detalhes: {
        media: 4.2,
        mediaAnterior: 3.8,
        criteriosAvaliados: 8
      }
    },
    {
      id: '2',
      tipo: 'anotacao_adicionada',
      avaliador: { nome: 'Maria Santos', setor: 'RH' },
      alvo: { nome: 'João Pedro', setor: 'SDR' },
      data: '20/10/2025',
      hora: '11:20',
      detalhes: {
        tituloAnotacao: 'Entrega exemplar',
        descricaoAnotacao: 'Superou as expectativas na entrega do projeto de migração de dados.'
      }
    },
    {
      id: '3',
      tipo: 'avaliacao_lider',
      avaliador: { nome: 'Pedro Lima', setor: 'RH' },
      alvo: { nome: 'Fernanda Costa', setor: 'Vendas' },
      data: '19/10/2025',
      hora: '16:45',
      detalhes: {
        media: 4.5,
        criteriosAvaliados: 10
      }
    },
    {
      id: '4',
      tipo: 'anotacao_adicionada',
      avaliador: { nome: 'Carlos Mendes', setor: 'RH' },
      alvo: { nome: 'Roberto Alves', setor: 'TEI' },
      data: '19/10/2025',
      hora: '10:15',
      detalhes: {
        tituloAnotacao: 'Atraso de demanda',
        descricaoAnotacao: 'Entrega da sprint atrasada em 2 dias sem comunicação prévia.'
      }
    },
    {
      id: '5',
      tipo: 'avaliacao_colaborador',
      avaliador: { nome: 'Maria Santos', setor: 'RH' },
      alvo: { nome: 'Lucas Ferreira', setor: 'Suporte Aldeia' },
      data: '18/10/2025',
      hora: '15:30',
      detalhes: {
        media: 3.9,
        mediaAnterior: 4.1,
        criteriosAvaliados: 8
      }
    },
    {
      id: '6',
      tipo: 'anotacao_adicionada',
      avaliador: { nome: 'Pedro Lima', setor: 'RH' },
      alvo: { nome: 'Camila Souza', setor: 'Comunicação' },
      data: '18/10/2025',
      hora: '09:00',
      detalhes: {
        tituloAnotacao: 'Overdelivery',
        descricaoAnotacao: 'Entregou 3 campanhas acima do planejado com qualidade excepcional.'
      }
    },
    {
      id: '7',
      tipo: 'avaliacao_colaborador',
      avaliador: { nome: 'Carlos Mendes', setor: 'RH' },
      alvo: { nome: 'Rafael Costa', setor: 'BI' },
      data: '17/10/2025',
      hora: '13:25',
      detalhes: {
        media: 4.7,
        mediaAnterior: 4.5,
        criteriosAvaliados: 8
      }
    },
    {
      id: '8',
      tipo: 'anotacao_adicionada',
      avaliador: { nome: 'Maria Santos', setor: 'RH' },
      alvo: { nome: 'Juliana Martins', setor: 'Financeiro' },
      data: '17/10/2025',
      hora: '11:50',
      detalhes: {
        tituloAnotacao: 'Chegou atrasado',
        descricaoAnotacao: 'Terceiro atraso no mês sem justificativa.'
      }
    }
  ];

  // Função para obter ícone baseado no tipo
  const getIconeTipo = (tipo: TipoLog) => {
    switch (tipo) {
      case 'avaliacao_colaborador':
        return <Star className="w-5 h-5" />;
      case 'avaliacao_lider':
        return <Users className="w-5 h-5" />;
      case 'anotacao_adicionada':
        return <MessageSquare className="w-5 h-5" />;
      case 'anotacao_editada':
        return <FileText className="w-5 h-5" />;
      case 'anotacao_removida':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  // Função para obter label do tipo
  const getLabelTipo = (tipo: TipoLog) => {
    switch (tipo) {
      case 'avaliacao_colaborador':
        return 'Avaliação de Colaborador';
      case 'avaliacao_lider':
        return 'Avaliação de Líder';
      case 'anotacao_adicionada':
        return 'Anotação Adicionada';
      case 'anotacao_editada':
        return 'Anotação Editada';
      case 'anotacao_removida':
        return 'Anotação Removida';
      default:
        return tipo;
    }
  };

  // Função para obter cor do badge
  const getCorTipo = (tipo: TipoLog) => {
    switch (tipo) {
      case 'avaliacao_colaborador':
        return 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400';
      case 'avaliacao_lider':
        return 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400';
      case 'anotacao_adicionada':
        return 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400';
      case 'anotacao_editada':
        return 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400';
      case 'anotacao_removida':
        return 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-950 text-gray-700 dark:text-gray-400';
    }
  };

  // Filtrar logs
  const logsFiltrados = useMemo(() => {
    return logs.filter(log => {
      // Filtro por tipo
      if (filtroTipo !== 'todos' && log.tipo !== filtroTipo) return false;

      // Filtro por busca (avaliador ou alvo)
      if (busca) {
        const buscaLower = busca.toLowerCase();
        const matchAvaliador = log.avaliador.nome.toLowerCase().includes(buscaLower);
        const matchAlvo = log.alvo.nome.toLowerCase().includes(buscaLower);
        if (!matchAvaliador && !matchAlvo) return false;
      }

      // Filtro por data início
      if (filtroDataInicio) {
        const [diaLog, mesLog, anoLog] = log.data.split('/');
        const dataLog = new Date(parseInt(anoLog), parseInt(mesLog) - 1, parseInt(diaLog));
        const [diaInicio, mesInicio, anoInicio] = filtroDataInicio.split('/');
        const dataInicio = new Date(parseInt(anoInicio), parseInt(mesInicio) - 1, parseInt(diaInicio));
        if (dataLog < dataInicio) return false;
      }

      // Filtro por data fim
      if (filtroDataFim) {
        const [diaLog, mesLog, anoLog] = log.data.split('/');
        const dataLog = new Date(parseInt(anoLog), parseInt(mesLog) - 1, parseInt(diaLog));
        const [diaFim, mesFim, anoFim] = filtroDataFim.split('/');
        const dataFim = new Date(parseInt(anoFim), parseInt(mesFim) - 1, parseInt(diaFim));
        if (dataLog > dataFim) return false;
      }

      return true;
    });
  }, [logs, filtroTipo, busca, filtroDataInicio, filtroDataFim]);

  // Estatísticas
  const stats = useMemo(() => {
    const total = logsFiltrados.length;
    const avaliacoesColaborador = logsFiltrados.filter(l => l.tipo === 'avaliacao_colaborador').length;
    const avaliacoesLider = logsFiltrados.filter(l => l.tipo === 'avaliacao_lider').length;
    const anotacoes = logsFiltrados.filter(l => l.tipo.includes('anotacao')).length;

    return {
      total,
      avaliacoesColaborador,
      avaliacoesLider,
      anotacoes
    };
  }, [logsFiltrados]);

  // Função para exportar logs
  const handleExportar = () => {
    // Em produção: gerar CSV ou PDF
    console.log('Exportando logs...', logsFiltrados);
    alert('Funcionalidade de exportação em desenvolvimento');
  };

  // Função para limpar filtros
  const handleLimparFiltros = () => {
    setFiltroTipo('todos');
    setFiltroAvaliador('');
    setFiltroAlvo('');
    setFiltroDataInicio('');
    setFiltroDataFim('');
    setBusca('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/avaliacao')}
            className="h-10 w-10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-gray-900 dark:text-white">Logs de Avaliação</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Histórico completo de ações no sistema de avaliação
            </p>
          </div>
        </div>

        <button
          onClick={handleExportar}
          className="h-10 px-4 rounded-xl bg-[#000aff] text-white hover:bg-[#0008dd] transition-colors flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          <span className="hidden sm:inline">Exportar</span>
        </button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Total de Registros</p>
                <h2 className="text-gray-900 dark:text-white">{stats.total}</h2>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Avaliações</p>
                <h2 className="text-gray-900 dark:text-white">
                  {stats.avaliacoesColaborador + stats.avaliacoesLider}
                </h2>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Anotações</p>
                <h2 className="text-gray-900 dark:text-white">{stats.anotacoes}</h2>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-950 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Colaboradores</p>
                <h2 className="text-gray-900 dark:text-white">{stats.avaliacoesColaborador}</h2>
              </div>
              <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950 flex items-center justify-center">
                <User className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros
            </CardTitle>
            <button
              onClick={handleLimparFiltros}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Limpar filtros
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Busca */}
            <div>
              <label className="text-gray-900 dark:text-white mb-2 block">
                Buscar por nome
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <FormInput
                  placeholder="Avaliador ou colaborador..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Tipo de ação */}
            <div>
              <label className="text-gray-900 dark:text-white mb-2 block">
                Tipo de ação
              </label>
              <FormSelect
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                options={[
                  { value: 'todos', label: 'Todos os tipos' },
                  { value: 'avaliacao_colaborador', label: 'Avaliação de Colaborador' },
                  { value: 'avaliacao_lider', label: 'Avaliação de Líder' },
                  { value: 'anotacao_adicionada', label: 'Anotação Adicionada' },
                  { value: 'anotacao_editada', label: 'Anotação Editada' },
                  { value: 'anotacao_removida', label: 'Anotação Removida' }
                ]}
              />
            </div>

            {/* Data início */}
            <div>
              <label className="text-gray-900 dark:text-white mb-2 block">
                Data início
              </label>
              <DateInput
                value={filtroDataInicio}
                onChange={setFiltroDataInicio}
                placeholder="DD/MM/AAAA"
              />
            </div>

            {/* Data fim */}
            <div>
              <label className="text-gray-900 dark:text-white mb-2 block">
                Data fim
              </label>
              <DateInput
                value={filtroDataFim}
                onChange={setFiltroDataFim}
                placeholder="DD/MM/AAAA"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Logs */}
      <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">
            Histórico de Atividades ({logsFiltrados.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logsFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-gray-900 dark:text-white mb-2">Nenhum log encontrado</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Ajuste os filtros para ver mais resultados
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {logsFiltrados.map((log) => {
                const isAvaliacaoPositiva = log.detalhes.media && log.detalhes.mediaAnterior 
                  && log.detalhes.media > log.detalhes.mediaAnterior;
                const isAvaliacaoNegativa = log.detalhes.media && log.detalhes.mediaAnterior 
                  && log.detalhes.media < log.detalhes.mediaAnterior;
                const isAnotacaoPositiva = log.detalhes.tituloAnotacao === 'Entrega exemplar' 
                  || log.detalhes.tituloAnotacao === 'Overdelivery';

                return (
                  <div
                    key={log.id}
                    className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-4">
                      {/* Ícone */}
                      <div className={`w-10 h-10 rounded-xl ${getCorTipo(log.tipo)} flex items-center justify-center flex-shrink-0`}>
                        {getIconeTipo(log.tipo)}
                      </div>

                      {/* Conteúdo */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <Badge className={getCorTipo(log.tipo)}>
                                {getLabelTipo(log.tipo)}
                              </Badge>
                              {isAvaliacaoPositiva && (
                                <Badge className="bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400">
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                  Melhoria
                                </Badge>
                              )}
                              {isAvaliacaoNegativa && (
                                <Badge className="bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400">
                                  <TrendingDown className="w-3 h-3 mr-1" />
                                  Queda
                                </Badge>
                              )}
                              {isAnotacaoPositiva && (
                                <Badge className="bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Positivo
                                </Badge>
                              )}
                            </div>
                            <h3 className="text-gray-900 dark:text-white truncate">
                              <strong>{log.avaliador.nome}</strong> → {log.alvo.nome}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                              {log.avaliador.setor} → {log.alvo.setor}
                            </p>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 justify-end">
                              <Calendar className="w-4 h-4" />
                              <small>{log.data}</small>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 justify-end">
                              <Clock className="w-4 h-4" />
                              <small>{log.hora}</small>
                            </div>
                          </div>
                        </div>

                        {/* Detalhes da ação */}
                        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
                          {log.tipo.includes('avaliacao') && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <small className="text-gray-600 dark:text-gray-400">
                                  Média obtida:
                                </small>
                                <strong className="text-gray-900 dark:text-white">
                                  {log.detalhes.media?.toFixed(1)}
                                </strong>
                              </div>
                              {log.detalhes.mediaAnterior && (
                                <div className="flex items-center justify-between">
                                  <small className="text-gray-600 dark:text-gray-400">
                                    Média anterior:
                                  </small>
                                  <small className="text-gray-900 dark:text-white">
                                    {log.detalhes.mediaAnterior.toFixed(1)}
                                  </small>
                                </div>
                              )}
                              <div className="flex items-center justify-between">
                                <small className="text-gray-600 dark:text-gray-400">
                                  Critérios avaliados:
                                </small>
                                <small className="text-gray-900 dark:text-white">
                                  {log.detalhes.criteriosAvaliados}
                                </small>
                              </div>
                            </div>
                          )}

                          {log.tipo.includes('anotacao') && (
                            <div className="space-y-2">
                              <div>
                                <small className="text-gray-600 dark:text-gray-400 block mb-1">
                                  Título:
                                </small>
                                <p className="text-gray-900 dark:text-white">
                                  {log.detalhes.tituloAnotacao}
                                </p>
                              </div>
                              <div>
                                <small className="text-gray-600 dark:text-gray-400 block mb-1">
                                  Descrição:
                                </small>
                                <p className="text-gray-900 dark:text-white">
                                  {log.detalhes.descricaoAnotacao}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
