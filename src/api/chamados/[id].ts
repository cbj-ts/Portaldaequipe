/**
 * ============================================================================
 * API ROUTE: Chamado Individual
 * ============================================================================
 * 
 * GET /api/chamados/:id - Buscar chamado
 * PATCH /api/chamados/:id - Atualizar chamado
 * 
 * ============================================================================
 */

import { ObjectId } from 'mongodb';
import { getChamadoById, updateChamado } from '../../services/chamadoService';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const chamado = await getChamadoById(params.id);

    if (!chamado) {
      return new Response(
        JSON.stringify({ error: 'Chamado não encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify(chamado), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro ao buscar chamado:', error);
    return new Response(
      JSON.stringify({ error: 'Erro ao buscar chamado' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const success = await updateChamado(params.id, data);

    if (!success) {
      return new Response(
        JSON.stringify({ error: 'Chamado não encontrado ou não atualizado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erro ao atualizar chamado:', error);
    return new Response(
      JSON.stringify({ error: 'Erro ao atualizar chamado' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
