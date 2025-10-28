/**
 * ============================================================================
 * API: /api/avaliacoes/[id]
 * ============================================================================
 * 
 * GET    /api/avaliacoes/:id        - Busca avaliação por ID
 * PUT    /api/avaliacoes/:id        - Submete/Atualiza avaliação
 * DELETE /api/avaliacoes/:id        - Deleta avaliação
 * 
 * ============================================================================
 */

import type { APIRoute } from 'astro';
import { getAvaliacaoById, submitAvaliacao, deleteAvaliacao } from '../../services/avaliacaoService';

export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID não fornecido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const avaliacao = await getAvaliacaoById(id);
    
    if (!avaliacao) {
      return new Response(JSON.stringify({ error: 'Avaliação não encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify(avaliacao), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Erro ao buscar avaliação:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID não fornecido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const body = await request.json();
    
    // Validação básica
    if (!body.criterios || !Array.isArray(body.criterios)) {
      return new Response(
        JSON.stringify({ error: 'Critérios são obrigatórios' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const success = await submitAvaliacao(id, {
      criterios: body.criterios,
      pontosFortesGerais: body.pontosFortesGerais,
      pontosAMelhorarGerais: body.pontosAMelhorarGerais,
      sugestoesGerais: body.sugestoesGerais,
    });
    
    if (!success) {
      return new Response(JSON.stringify({ error: 'Avaliação não encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Erro ao submeter avaliação:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID não fornecido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const success = await deleteAvaliacao(id);
    
    if (!success) {
      return new Response(JSON.stringify({ error: 'Avaliação não encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Erro ao deletar avaliação:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
