/**
 * ============================================================================
 * HOOK: useChamados
 * ============================================================================
 * 
 * Hook customizado para gerenciar chamados
 * 
 * ============================================================================
 */

import { useState, useEffect } from 'react';
import type { Chamado, SetorChamado } from '../models/Chamado';
import { ObjectId } from 'mongodb';

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
      const params = new URLSearchParams();
      if (options.setor) params.append('setor', options.setor);
      if (options.status) params.append('status', options.status);
      if (options.usuarioId) params.append('usuarioId', options.usuarioId);
      
      const response = await fetch(`/api/chamados?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar chamados');
      }
      
      const data = await response.json();
      setChamados(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao carregar chamados:', err);
    } finally {
      setLoading(false);
    }
  };

  const createChamado = async (data: any) => {
    try {
      const response = await fetch('/api/chamados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Erro ao criar chamado');
      }
      
      const novoChamado = await response.json();
      setChamados(prev => [novoChamado, ...prev]);
      return novoChamado;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar chamado');
      throw err;
    }
  };

  const updateChamado = async (id: string, data: any) => {
    try {
      const response = await fetch(`/api/chamados/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Erro ao atualizar chamado');
      }
      
      await loadChamados();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar chamado');
      throw err;
    }
  };

  const addResposta = async (chamadoId: string, mensagem: string, anexos?: any[]) => {
    try {
      const response = await fetch(`/api/chamados/${chamadoId}/respostas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagem, anexos })
      });
      
      if (!response.ok) {
        throw new Error('Erro ao adicionar resposta');
      }
      
      await loadChamados();
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
