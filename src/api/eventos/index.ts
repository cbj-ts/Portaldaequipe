/**
 * ============================================================================
 * API ROUTE: Eventos
 * ============================================================================
 * 
 * GET /api/eventos - Listar eventos
 * POST /api/eventos - Criar evento
 * 
 * ============================================================================
 */

import { ObjectId } from 'mongodb';
import { listEventos, createEvento, getEventosMes } from '../../services/eventoService';
import { getUserById } from '../../services/userService';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const mes = url.searchParams.get('mes');
    const ano = url.searchParams.get('ano');
    const usuarioId = url.searchParams.get('usuarioId');
    const tipo = url.searchParams.get('tipo');

    // Se tem mês e ano, retornar eventos do mês
    if (mes && ano) {
      const eventos = await getEventosMes(
        parseInt(ano),
        parseInt(mes),
        usuarioId ? new ObjectId(usuarioId) : undefined
      );
      return new Response(JSON.stringify(eventos), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Caso contrário, listar com filtros
    const filters: any = {};
    if (usuarioId) filters.usuarioId = new ObjectId(usuarioId);
    if (tipo) filters.tipo = tipo;

    const eventos = await listEventos(filters);

    return new Response(JSON.stringify(eventos), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro ao listar eventos:', error);
    return new Response(
      JSON.stringify({ error: 'Erro ao listar eventos' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Buscar informações do organizador
    const organizador = await getUserById(data.organizadorId);
    if (!organizador) {
      return new Response(
        JSON.stringify({ error: 'Organizador não encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const evento = await createEvento(data, organizador.nome);

    return new Response(JSON.stringify(evento), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    return new Response(
      JSON.stringify({ error: 'Erro ao criar evento' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
