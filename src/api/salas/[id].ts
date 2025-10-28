/**
 * ============================================================================
 * API: /api/salas/[id]
 * ============================================================================
 * 
 * PUT    /api/salas/:id - Atualiza reserva
 * DELETE /api/salas/:id - Deleta/Cancela reserva
 * 
 * ============================================================================
 */

import type { APIRoute } from 'astro';
import { updateReserva, cancelReserva, deleteReserva } from '../../services/salaService';

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
    
    // Se for cancelamento
    if (body.status === 'Cancelada') {
      const success = await cancelReserva(id, body.motivoCancelamento);
      
      if (!success) {
        return new Response(JSON.stringify({ error: 'Reserva não encontrada' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Atualização normal
    const updateData: any = {};
    if (body.dataInicio) updateData.dataInicio = new Date(body.dataInicio);
    if (body.dataFim) updateData.dataFim = new Date(body.dataFim);
    if (body.titulo) updateData.titulo = body.titulo;
    if (body.descricao !== undefined) updateData.descricao = body.descricao;
    if (body.participantes !== undefined) updateData.participantes = body.participantes;
    if (body.recursosNecessarios) updateData.recursosNecessarios = body.recursosNecessarios;
    
    const success = await updateReserva(id, updateData);
    
    if (!success) {
      return new Response(JSON.stringify({ error: 'Reserva não encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Erro ao atualizar reserva:', error);
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
    
    const success = await deleteReserva(id);
    
    if (!success) {
      return new Response(JSON.stringify({ error: 'Reserva não encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Erro ao deletar reserva:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
