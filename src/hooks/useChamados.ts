/**
 * ============================================================================
 * HOOK: useChamados
 * ============================================================================
 * 
 * Hook customizado para gerenciar chamados usando localStorage
 * 
 * ============================================================================
 */

import { useState, useEffect } from 'react';

type SetorChamado = 'TEI' | 'RH' | 'Financeiro';

interface Chamado {
  id: string;
  numero: string;
  setor: SetorChamado;
  titulo: string;
  descricao: string;
  status: string;
  prioridade: string;
  solicitanteNome: string;
  solicitanteSetor: string;
  dataCriacao: string;
  dataAtualizacao: string;
}

interface UseChamadosOptions {
  setor?: SetorChamado;
  status?: string;
  usuarioId?: string;
  autoLoad?: boolean;
}

export function useChamados(options: UseChamadosOptions = {}) {
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadChamados = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Carregar do localStorage
      const storedChamados = localStorage.getItem('tradestars_chamados');
      let allChamados: Chamado[] = storedChamados ? JSON.parse(storedChamados) : [];
      
      // Aplicar filtros
      if (options.setor) {
        allChamados = allChamados.filter(c => c.setor === options.setor);
      }
      if (options.status) {
        allChamados = allChamados.filter(c => c.status === options.status);
      }
      
      setChamados(allChamados);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao carregar chamados:', err);
    } finally {
      setLoading(false);
    }
  };

  const createChamado = async (data: any) => {
    try {
      const storedChamados = localStorage.getItem('tradestars_chamados');
      const allChamados: Chamado[] = storedChamados ? JSON.parse(storedChamados) : [];
      
      const novoChamado: Chamado = {
        id: Date.now().toString(),
        numero: `${data.setor}-${new Date().getFullYear()}-${String(allChamados.length + 1).padStart(3, '0')}`,
        ...data,
        dataCriacao: new Date().toISOString(),
        dataAtualizacao: new Date().toISOString(),
      };
      
      const updatedChamados = [novoChamado, ...allChamados];
      localStorage.setItem('tradestars_chamados', JSON.stringify(updatedChamados));
      setChamados(prev => [novoChamado, ...prev]);
      
      return novoChamado;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar chamado');
      throw err;
    }
  };

  const updateChamado = async (id: string, data: any) => {
    try {
      const storedChamados = localStorage.getItem('tradestars_chamados');
      const allChamados: Chamado[] = storedChamados ? JSON.parse(storedChamados) : [];
      
      const updatedChamados = allChamados.map(c => 
        c.id === id 
          ? { ...c, ...data, dataAtualizacao: new Date().toISOString() }
          : c
      );
      
      localStorage.setItem('tradestars_chamados', JSON.stringify(updatedChamados));
      await loadChamados();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar chamado');
      throw err;
    }
  };

  const addResposta = async (chamadoId: string, mensagem: string, anexos?: any[]) => {
    try {
      // Implementação simplificada
      await updateChamado(chamadoId, {
        ultimaResposta: mensagem,
        dataAtualizacao: new Date().toISOString(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar resposta');
      throw err;
    }
  };

  useEffect(() => {
    if (options.autoLoad !== false) {
      loadChamados();
    }
  }, [options.setor, options.status, options.usuarioId]);

  return {
    chamados,
    loading,
    error,
    loadChamados,
    createChamado,
    updateChamado,
    addResposta,
  };
}
