/**
 * ============================================================================
 * API: /api/avaliacoes
 * ============================================================================
 * 
 * GET  /api/avaliacoes          - Lista avaliações (pendentes ou recebidas)
 * POST /api/avaliacoes          - Cria nova avaliação
 * GET  /api/avaliacoes/logs     - Busca logs de avaliações
 * GET  /api/avaliacoes/stats    - Estatísticas do usuário
 * 
 * ============================================================================
 */

import type { APIRoute } from 'astro';
import { 
  getAvaliacoesPendentes, 
  getAvaliacoesRecebidas,
  createAvaliacao,
  getAvaliacaoLogs,
  getAvaliacaoStats
} from '../../services/avaliacaoService';
import { ObjectId } from 'mongodb';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // GET /api/avaliacoes/logs
    if (path.includes('/logs')) {
      const avaliacaoId = url.searchParams.get('avaliacaoId');
      const avaliadorId = url.searchParams.get('avaliadorId');
      const avaliadoId = url.searchParams.get('avaliadoId');
      const tipo = url.searchParams.get('tipo') as any;
      
      const logs = await getAvaliacaoLogs({
        avaliacaoId: avaliacaoId || undefined,
        avaliadorId: avaliadorId || undefined,
        avaliadoId: avaliadoId || undefined,
        tipo: tipo || undefined,
      });
      
      return new Response(JSON.stringify(logs), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // GET /api/avaliacoes/stats
    if (path.includes('/stats')) {
      const usuarioId = url.searchParams.get('usuarioId');
      
      if (!usuarioId) {
        return new Response(JSON.stringify({ error: 'usuarioId é obrigatório' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      const stats = await getAvaliacaoStats(usuarioId);
      
      return new Response(JSON.stringify(stats), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // GET /api/avaliacoes
    const tipo = url.searchParams.get('tipo'); // 'pendentes' ou 'recebidas'
    const usuarioId = url.searchParams.get('usuarioId');
    
    if (!usuarioId) {
      return new Response(JSON.stringify({ error: 'usuarioId é obrigatório' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const avaliacoes = tipo === 'recebidas'
      ? await getAvaliacoesRecebidas(usuarioId)
      : await getAvaliacoesPendentes(usuarioId);
    
    return new Response(JSON.stringify(avaliacoes), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Erro ao buscar avaliações:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    // Validação básica
    if (!body.tipo || !body.avaliadorId || !body.avaliadoId) {
      return new Response(
        JSON.stringify({ error: 'Campos obrigatórios faltando' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const avaliacao = await createAvaliacao(
      {
        tipo: body.tipo,
        avaliadorId: new ObjectId(body.avaliadorId),
        avaliadoId: new ObjectId(body.avaliadoId),
        dataLimite: body.dataLimite ? new Date(body.dataLimite) : undefined,
      },
      body.avaliadorNome,
      body.avaliadorSetor,
      body.avaliadoNome,
      body.avaliadoSetor,
      body.avaliadoCargo
    );
    
    return new Response(JSON.stringify(avaliacao), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Erro ao criar avaliação:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
