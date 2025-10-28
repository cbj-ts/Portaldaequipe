/**
 * ============================================================================
 * API: /api/salas
 * ============================================================================
 * 
 * GET    /api/salas          - Lista todas as salas
 * POST   /api/salas/reservas - Cria nova reserva
 * GET    /api/salas/reservas - Lista reservas (com filtros)
 * 
 * ============================================================================
 */

import type { APIRoute } from 'astro';
import { getSalas, getReservas, createReserva } from '../../services/salaService';
import { ObjectId } from 'mongodb';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // GET /api/salas/reservas
    if (path.includes('/reservas')) {
      const salaId = url.searchParams.get('salaId');
      const usuarioId = url.searchParams.get('usuarioId');
      const status = url.searchParams.get('status');
      const dataInicio = url.searchParams.get('dataInicio');
      const dataFim = url.searchParams.get('dataFim');
      
      const filters: any = {};
      if (salaId) filters.salaId = salaId;
      if (usuarioId) filters.usuarioId = usuarioId;
      if (status) filters.status = status;
      if (dataInicio) filters.dataInicio = new Date(dataInicio);
      if (dataFim) filters.dataFim = new Date(dataFim);
      
      const reservas = await getReservas(filters);
      
      return new Response(JSON.stringify(reservas), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // GET /api/salas
    const salas = await getSalas();
    
    return new Response(JSON.stringify(salas), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Erro ao buscar salas:', error);
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
    if (!body.salaId || !body.usuarioId || !body.dataInicio || !body.dataFim || !body.titulo) {
      return new Response(
        JSON.stringify({ error: 'Campos obrigatórios faltando' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const reserva = await createReserva(
      {
        salaId: new ObjectId(body.salaId),
        usuarioId: new ObjectId(body.usuarioId),
        dataInicio: new Date(body.dataInicio),
        dataFim: new Date(body.dataFim),
        titulo: body.titulo,
        descricao: body.descricao,
        participantes: body.participantes,
        recursosNecessarios: body.recursosNecessarios,
      },
      body.usuarioNome,
      body.usuarioSetor
    );
    
    return new Response(JSON.stringify(reserva), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Erro ao criar reserva:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
