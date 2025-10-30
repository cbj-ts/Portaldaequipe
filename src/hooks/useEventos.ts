/**
 * ============================================================================
 * HOOK: useEventos
 * ============================================================================
 * 
 * Hook customizado para gerenciar eventos do calendário usando localStorage
 * 
 * ============================================================================
 */

import { useState, useEffect } from 'react';

interface Evento {
  _id?: string;
  id: string;
  titulo: string;
  descricao?: string;
  dataInicio: string;
  dataFim?: string;
  tipo: string;
  local?: string;
  participantes?: string[];
  criadorId: string;
  criadorNome: string;
}

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
      // Carregar do localStorage
      const storedEventos = localStorage.getItem('tradestars_eventos');
      let allEventos: Evento[] = storedEventos ? JSON.parse(storedEventos) : [];
      
      // Aplicar filtros
      if (options.mes !== undefined && options.ano !== undefined) {
        allEventos = allEventos.filter(e => {
          const data = new Date(e.dataInicio);
          return data.getMonth() === options.mes && data.getFullYear() === options.ano;
        });
      }
      
      setEventos(allEventos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao carregar eventos:', err);
    } finally {
      setLoading(false);
    }
  };

  const createEvento = async (data: any) => {
    try {
      const storedEventos = localStorage.getItem('tradestars_eventos');
      const allEventos: Evento[] = storedEventos ? JSON.parse(storedEventos) : [];
      
      const novoEvento: Evento = {
        id: Date.now().toString(),
        _id: Date.now().toString(),
        ...data,
      };
      
      const updatedEventos = [...allEventos, novoEvento];
      localStorage.setItem('tradestars_eventos', JSON.stringify(updatedEventos));
      setEventos(prev => [...prev, novoEvento]);
      
      return novoEvento;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar evento');
      throw err;
    }
  };

  const updateEvento = async (id: string, data: any) => {
    try {
      const storedEventos = localStorage.getItem('tradestars_eventos');
      const allEventos: Evento[] = storedEventos ? JSON.parse(storedEventos) : [];
      
      const updatedEventos = allEventos.map(e => 
        (e.id === id || e._id === id) ? { ...e, ...data } : e
      );
      
      localStorage.setItem('tradestars_eventos', JSON.stringify(updatedEventos));
      await loadEventos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar evento');
      throw err;
    }
  };

  const deleteEvento = async (id: string) => {
    try {
      const storedEventos = localStorage.getItem('tradestars_eventos');
      const allEventos: Evento[] = storedEventos ? JSON.parse(storedEventos) : [];
      
      const updatedEventos = allEventos.filter(e => e.id !== id && e._id !== id);
      localStorage.setItem('tradestars_eventos', JSON.stringify(updatedEventos));
      setEventos(prev => prev.filter(e => e._id?.toString() !== id && e.id !== id));
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
