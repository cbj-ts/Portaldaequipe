/**
 * ============================================================================
 * EVENTOS DE EXEMPLO - Para Popular o Calendário
 * ============================================================================
 * 
 * Use estas funções para adicionar eventos de exemplo ao calendário.
 * Útil para demonstração e testes.
 * 
 * ============================================================================
 */

import { createEvento, clearAllEventos } from './localStorage';

/**
 * Popula o calendário com eventos de exemplo
 */
export function popularEventosExemplo() {
  // Limpar eventos existentes (opcional)
  // clearAllEventos();

  const hoje = new Date();
  const amanha = new Date(hoje);
  amanha.setDate(amanha.getDate() + 1);
  
  const proximaSemana = new Date(hoje);
  proximaSemana.setDate(proximaSemana.getDate() + 7);

  const proximoMes = new Date(hoje);
  proximoMes.setMonth(proximoMes.getMonth() + 1);

  // Formatar datas para YYYY-MM-DD
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Evento 1: Reunião de hoje
  createEvento({
    title: 'Reunião Geral de Equipe',
    date: formatDate(hoje),
    time: '10:00',
    category: 'reuniao',
    description: 'Reunião mensal de alinhamento com todos os setores da empresa.',
    location: 'Sala de Reuniões 1 - 3º Andar',
  });

  // Evento 2: Treinamento amanhã
  createEvento({
    title: 'Treinamento de Vendas',
    date: formatDate(amanha),
    time: '14:00',
    category: 'treinamento',
    description: 'Workshop sobre técnicas avançadas de vendas e negociação.',
    location: 'Auditório Principal',
  });

  // Evento 3: Live próxima semana
  createEvento({
    title: 'Live: Novos Produtos Q1',
    date: formatDate(proximaSemana),
    time: '16:00',
    category: 'live',
    description: 'Apresentação dos lançamentos do primeiro trimestre.',
    location: 'Online - Link será enviado',
  });

  // Evento 4: Workshop próximo mês
  createEvento({
    title: 'Workshop de Inovação',
    date: formatDate(proximoMes),
    time: '09:00',
    category: 'workshop',
    description: 'Brainstorming e ideias para melhorias nos processos internos.',
    location: 'Sala de Criatividade - 2º Andar',
  });

  // Evento 5: Aniversário
  const dataAniversario = new Date(hoje.getFullYear(), hoje.getMonth(), 15);
  createEvento({
    title: 'Aniversário - João Silva',
    date: formatDate(dataAniversario),
    time: null,
    category: 'aniversario',
    description: 'Parabéns ao nosso colaborador João Silva!',
    location: 'Copa - 1º Andar',
  });

  // Evento 6: Feriado
  const feriado = new Date(hoje.getFullYear(), 3, 21); // 21 de Abril
  createEvento({
    title: 'Tiradentes',
    date: formatDate(feriado),
    time: null,
    category: 'feriado',
    description: 'Feriado nacional - Empresa fechada',
    location: null,
  });

  // Evento 7: Evento sem local (para testar)
  const eventoSemLocal = new Date(hoje);
  eventoSemLocal.setDate(eventoSemLocal.getDate() + 3);
  createEvento({
    title: 'Almoço de Integração',
    date: formatDate(eventoSemLocal),
    time: '12:00',
    category: 'evento',
    description: 'Confraternização mensal da equipe',
    location: null, // Sem local definido
  });

  console.log('✅ 7 eventos de exemplo criados com sucesso!');
  console.log('📍 6 eventos com local, 1 sem local');
}

/**
 * Remove todos os eventos de exemplo
 */
export function limparEventosExemplo() {
  clearAllEventos();
  console.log('🗑️ Todos os eventos foram removidos');
}

/**
 * Instrução de uso:
 * 
 * 1. Abra o Console do navegador (F12)
 * 2. Cole este código:
 * 
 *    import { popularEventosExemplo } from './utils/eventosExemplo';
 *    popularEventosExemplo();
 * 
 * 3. Recarregue a página
 * 4. ✅ Eventos aparecerão no calendário!
 * 
 * Para limpar:
 * 
 *    import { limparEventosExemplo } from './utils/eventosExemplo';
 *    limparEventosExemplo();
 */
