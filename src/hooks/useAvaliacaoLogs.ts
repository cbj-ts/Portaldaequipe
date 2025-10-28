/**
 * ============================================================================
 * HOOK - Logs de Avaliação
 * ============================================================================
 * 
 * Hook customizado para gerenciar logs de avaliação de desempenho
 * 
 * FUNCIONALIDADES:
 * - Registrar nova avaliação no log
 * - Registrar nova anotação no log
 * - Buscar logs com filtros
 * - Exportar logs
 * 
 * ============================================================================
 */

import { useState, useEffect } from 'react';

export type TipoLog = 
  | 'avaliacao_colaborador' 
  | 'avaliacao_lider' 
  | 'anotacao_adicionada'
  | 'anotacao_editada'
  | 'anotacao_removida';

export interface LogItem {
  id: string;
  tipo: TipoLog;
  avaliador: {
    id: string;
    nome: string;
    setor: string;
  };
  alvo: {
    id: string;
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
    observacoes?: string;
  };
}

interface LogAvaliacaoParams {
  tipo: 'avaliacao_colaborador' | 'avaliacao_lider';
  avaliadorId: string;
  avaliadorNome: string;
  avaliadorSetor: string;
  alvoId: string;
  alvoNome: string;
  alvoSetor: string;
  media: number;
  mediaAnterior?: number;
  criteriosAvaliados: number;
  observacoes?: string;
}

interface LogAnotacaoParams {
  tipo: 'anotacao_adicionada' | 'anotacao_editada' | 'anotacao_removida';
  avaliadorId: string;
  avaliadorNome: string;
  avaliadorSetor: string;
  alvoId: string;
  alvoNome: string;
  alvoSetor: string;
  tituloAnotacao: string;
  descricaoAnotacao: string;
}

export function useAvaliacaoLogs() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Registrar uma avaliação no log
   */
  const registrarAvaliacao = async (params: LogAvaliacaoParams) => {
    try {
      const agora = new Date();
      const data = agora.toLocaleDateString('pt-BR');
      const hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

      const novoLog: LogItem = {
        id: `log-${Date.now()}`,
        tipo: params.tipo,
        avaliador: {
          id: params.avaliadorId,
          nome: params.avaliadorNome,
          setor: params.avaliadorSetor
        },
        alvo: {
          id: params.alvoId,
          nome: params.alvoNome,
          setor: params.alvoSetor
        },
        data,
        hora,
        detalhes: {
          media: params.media,
          mediaAnterior: params.mediaAnterior,
          criteriosAvaliados: params.criteriosAvaliados,
          observacoes: params.observacoes
        }
      };

      // Em produção: salvar no Supabase/MongoDB
      // await supabase.from('avaliacao_logs').insert(novoLog)
      
      // Por enquanto: adicionar ao estado local
      setLogs(prev => [novoLog, ...prev]);
      
      // Também salvar no localStorage para persistência
      const logsAtuais = JSON.parse(localStorage.getItem('avaliacaoLogs') || '[]');
      logsAtuais.unshift(novoLog);
      localStorage.setItem('avaliacaoLogs', JSON.stringify(logsAtuais));

      return novoLog;
    } catch (err) {
      setError('Erro ao registrar avaliação no log');
      console.error(err);
      return null;
    }
  };

  /**
   * Registrar uma anotação no log
   */
  const registrarAnotacao = async (params: LogAnotacaoParams) => {
    try {
      const agora = new Date();
      const data = agora.toLocaleDateString('pt-BR');
      const hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

      const novoLog: LogItem = {
        id: `log-${Date.now()}`,
        tipo: params.tipo,
        avaliador: {
          id: params.avaliadorId,
          nome: params.avaliadorNome,
          setor: params.avaliadorSetor
        },
        alvo: {
          id: params.alvoId,
          nome: params.alvoNome,
          setor: params.alvoSetor
        },
        data,
        hora,
        detalhes: {
          tituloAnotacao: params.tituloAnotacao,
          descricaoAnotacao: params.descricaoAnotacao
        }
      };

      // Em produção: salvar no Supabase/MongoDB
      // await supabase.from('avaliacao_logs').insert(novoLog)
      
      // Por enquanto: adicionar ao estado local
      setLogs(prev => [novoLog, ...prev]);
      
      // Também salvar no localStorage para persistência
      const logsAtuais = JSON.parse(localStorage.getItem('avaliacaoLogs') || '[]');
      logsAtuais.unshift(novoLog);
      localStorage.setItem('avaliacaoLogs', JSON.stringify(logsAtuais));

      return novoLog;
    } catch (err) {
      setError('Erro ao registrar anotação no log');
      console.error(err);
      return null;
    }
  };

  /**
   * Buscar logs (com filtros opcionais)
   */
  const buscarLogs = async (filtros?: {
    tipo?: TipoLog;
    avaliadorId?: string;
    alvoId?: string;
    dataInicio?: string;
    dataFim?: string;
  }) => {
    try {
      setLoading(true);
      
      // Em produção: buscar do Supabase/MongoDB com filtros
      // const { data } = await supabase.from('avaliacao_logs').select('*').match(filtros)
      
      // Por enquanto: buscar do localStorage
      const logsStorage = JSON.parse(localStorage.getItem('avaliacaoLogs') || '[]');
      
      let logsFiltrados = logsStorage;

      if (filtros?.tipo) {
        logsFiltrados = logsFiltrados.filter((log: LogItem) => log.tipo === filtros.tipo);
      }

      if (filtros?.avaliadorId) {
        logsFiltrados = logsFiltrados.filter((log: LogItem) => log.avaliador.id === filtros.avaliadorId);
      }

      if (filtros?.alvoId) {
        logsFiltrados = logsFiltrados.filter((log: LogItem) => log.alvo.id === filtros.alvoId);
      }

      setLogs(logsFiltrados);
      return logsFiltrados;
    } catch (err) {
      setError('Erro ao buscar logs');
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carregar logs do localStorage ao montar
   */
  useEffect(() => {
    const logsStorage = JSON.parse(localStorage.getItem('avaliacaoLogs') || '[]');
    setLogs(logsStorage);
  }, []);

  /**
   * Exportar logs para CSV
   */
  const exportarLogs = (logsParaExportar: LogItem[]) => {
    try {
      const csv = [
        // Cabeçalho
        ['Data', 'Hora', 'Tipo', 'Avaliador', 'Setor Avaliador', 'Alvo', 'Setor Alvo', 'Detalhes'].join(','),
        // Linhas
        ...logsParaExportar.map(log => {
          const detalhes = log.tipo.includes('avaliacao')
            ? `Média: ${log.detalhes.media}`
            : `Título: ${log.detalhes.tituloAnotacao}`;
          
          return [
            log.data,
            log.hora,
            log.tipo,
            log.avaliador.nome,
            log.avaliador.setor,
            log.alvo.nome,
            log.alvo.setor,
            detalhes
          ].join(',');
        })
      ].join('\n');

      // Criar blob e download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `logs-avaliacao-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return true;
    } catch (err) {
      setError('Erro ao exportar logs');
      console.error(err);
      return false;
    }
  };

  return {
    logs,
    loading,
    error,
    registrarAvaliacao,
    registrarAnotacao,
    buscarLogs,
    exportarLogs
  };
}
