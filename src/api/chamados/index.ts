/**
 * ============================================================================
 * API ROUTE: Chamados
 * ============================================================================
 * 
 * Endpoints para gerenciar chamados
 * 
 * GET /api/chamados - Listar chamados
 * POST /api/chamados - Criar chamado
 * 
 * ============================================================================
 */

import { ObjectId } from 'mongodb';
import { listChamados, createChamado } from '../../services/chamadoService';
import { getUserById } from '../../services/userService';
import type { SetorChamado } from '../../models/Chamado';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const setor = url.searchParams.get('setor') as SetorChamado | null;
    const status = url.searchParams.get('status');
    const solicitanteId = url.searchParams.get('usuarioId');
    const atribuidoParaId = url.searchParams.get('atribuidoParaId');

    const filters: any = {};
    if (setor) filters.setor = setor;
    if (status) filters.status = status;
    if (solicitanteId) filters.solicitanteId = new ObjectId(solicitanteId);
    if (atribuidoParaId) filters.atribuidoParaId = new ObjectId(atribuidoParaId);

    const chamados = await listChamados(filters);

    return new Response(JSON.stringify(chamados), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro ao listar chamados:', error);
    return new Response(
      JSON.stringify({ error: 'Erro ao listar chamados' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Buscar informações do solicitante
    const solicitante = await getUserById(data.solicitanteId);
    if (!solicitante) {
      return new Response(
        JSON.stringify({ error: 'Solicitante não encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const chamado = await createChamado(
      data,
      solicitante.nome,
      solicitante.setor,
      solicitante.email
    );

    return new Response(JSON.stringify(chamado), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro ao criar chamado:', error);
    return new Response(
      JSON.stringify({ error: 'Erro ao criar chamado' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
