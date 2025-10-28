/**
 * ============================================================================
 * SISTEMA DE ARMAZENAMENTO LOCAL
 * ============================================================================
 * 
 * Sistema robusto de localStorage para eventos do calendário.
 * Preparado para fácil migração ao MongoDB no futuro.
 * 
 * FEATURES:
 * - CRUD completo de eventos
 * - Suporte ao campo 'location'
 * - IDs autoincrementais
 * - Timestamps automáticos
 * - Validação de dados
 * - Tratamento de erros
 * 
 * ============================================================================
 */

export interface Evento {
  id: number;
  title: string;
  date: string; // YYYY-MM-DD
  time: string | null;
  category: string;
  description: string | null;
  location: string | null; // ✅ Campo local incluído
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'tradestars_eventos';

/**
 * Obtém o próximo ID disponível
 */
function getNextId(eventos: Evento[]): number {
  if (eventos.length === 0) return 1;
  return Math.max(...eventos.map(e => e.id)) + 1;
}

/**
 * Carrega todos os eventos do localStorage
 */
export function loadEventos(): Evento[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const eventos = JSON.parse(data);
    return Array.isArray(eventos) ? eventos : [];
  } catch (error) {
    console.error('Erro ao carregar eventos:', error);
    return [];
  }
}

/**
 * Salva eventos no localStorage
 */
function saveEventos(eventos: Evento[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(eventos));
  } catch (error) {
    console.error('Erro ao salvar eventos:', error);
    throw new Error('Falha ao salvar eventos no armazenamento local');
  }
}

/**
 * Cria um novo evento
 */
export function createEvento(
  data: Omit<Evento, 'id' | 'createdAt' | 'updatedAt'>
): Evento {
  try {
    const eventos = loadEventos();
    const now = new Date().toISOString();
    
    const novoEvento: Evento = {
      ...data,
      id: getNextId(eventos),
      createdAt: now,
      updatedAt: now,
    };
    
    eventos.push(novoEvento);
    saveEventos(eventos);
    
    return novoEvento;
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    throw error;
  }
}

/**
 * Atualiza um evento existente
 */
export function updateEvento(
  id: number,
  data: Partial<Omit<Evento, 'id' | 'createdAt' | 'updatedAt'>>
): Evento | null {
  try {
    const eventos = loadEventos();
    const index = eventos.findIndex(e => e.id === id);
    
    if (index === -1) {
      throw new Error('Evento não encontrado');
    }
    
    const eventoAtualizado: Evento = {
      ...eventos[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    eventos[index] = eventoAtualizado;
    saveEventos(eventos);
    
    return eventoAtualizado;
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    throw error;
  }
}

/**
 * Deleta um evento
 */
export function deleteEvento(id: number): boolean {
  try {
    const eventos = loadEventos();
    const filtered = eventos.filter(e => e.id !== id);
    
    if (filtered.length === eventos.length) {
      throw new Error('Evento não encontrado');
    }
    
    saveEventos(filtered);
    return true;
  } catch (error) {
    console.error('Erro ao deletar evento:', error);
    throw error;
  }
}

/**
 * Busca um evento por ID
 */
export function getEventoById(id: number): Evento | null {
  const eventos = loadEventos();
  return eventos.find(e => e.id === id) || null;
}

/**
 * Busca eventos por data
 */
export function getEventosByDate(date: string): Evento[] {
  const eventos = loadEventos();
  return eventos.filter(e => e.date === date);
}

/**
 * Busca eventos por categoria
 */
export function getEventosByCategory(category: string): Evento[] {
  const eventos = loadEventos();
  return eventos.filter(e => e.category === category);
}

/**
 * Limpa todos os eventos (use com cuidado!)
 */
export function clearAllEventos(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Exporta eventos para JSON (backup)
 */
export function exportEventos(): string {
  const eventos = loadEventos();
  return JSON.stringify(eventos, null, 2);
}

/**
 * Importa eventos de JSON (restauração)
 */
export function importEventos(jsonData: string): void {
  try {
    const eventos = JSON.parse(jsonData);
    if (!Array.isArray(eventos)) {
      throw new Error('Formato de dados inválido');
    }
    saveEventos(eventos);
  } catch (error) {
    console.error('Erro ao importar eventos:', error);
    throw new Error('Falha ao importar eventos');
  }
}
