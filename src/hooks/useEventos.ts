/**
 * ============================================================================
 * HOOK: useEventos
 * ============================================================================
 * 
 * Hook customizado para gerenciar eventos do calendário
 * 
 * ============================================================================
 */

import { useState, useEffect } from 'react';
import type { Evento } from '../models/Evento';

interface UseEventosOptions {
  mes?: number;
  ano?: number;
  usuarioId?: string;
  autoLoad?: boolean;
}

export function useEventos(options: UseEventosOptions = {}) {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEventos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (options.mes) params.append('mes', options.mes.toString());
      if (options.ano) params.append('ano', options.ano.toString());
      if (options.usuarioId) params.append('usuarioId', options.usuarioId);
      
      const response = await fetch(`/api/eventos?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar eventos');
      }
      
      const data = await response.json();
      setEventos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao carregar eventos:', err);
    } finally {
      setLoading(false);
    }
  };

  const createEvento = async (data: any) => {
    try {
      const response = await fetch('/api/eventos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Erro ao criar evento');
      }
      
      const novoEvento = await response.json();
      setEventos(prev => [...prev, novoEvento]);
      return novoEvento;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar evento');
      throw err;
    }
  };

  const updateEvento = async (id: string, data: any) => {
    try {
      const response = await fetch(`/api/eventos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Erro ao atualizar evento');
      }
      
      await loadEventos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar evento');
      throw err;
    }
  };

  const deleteEvento = async (id: string) => {
    try {
      const response = await fetch(`/api/eventos/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Erro ao deletar evento');
      }
      
      setEventos(prev => prev.filter(e => e._id?.toString() !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar evento');
      throw err;
    }
  };

  useEffect(() => {
    if (options.autoLoad !== false) {
      loadEventos();
    }
  }, [options.mes, options.ano, options.usuarioId]);

  return {
    eventos,
    loading,
    error,
    loadEventos,
    createEvento,
    updateEvento,
    deleteEvento,
  };
}
