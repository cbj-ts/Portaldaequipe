/**
 * ============================================================================
 * SERVICE: Evento Service
 * ============================================================================
 * 
 * Serviço para gerenciar eventos do calendário
 * 
 * ============================================================================
 */

import { ObjectId } from 'mongodb';
import { getDatabase } from '../lib/mongodb';
import type { Evento, CreateEventoDTO, UpdateEventoDTO } from '../models/Evento';

const COLLECTION = 'eventos';

/**
 * Criar novo evento
 */
export async function createEvento(data: CreateEventoDTO, organizadorNome: string): Promise<Evento> {
  const db = await getDatabase();
  
  const evento: Omit<Evento, '_id'> = {
    ...data,
    organizadorNome,
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  };
  
  const result = await db.collection<Evento>(COLLECTION).insertOne(evento as Evento);
  
  return {
    ...evento,
    _id: result.insertedId,
  };
}

/**
 * Buscar evento por ID
 */
export async function getEventoById(id: string | ObjectId): Promise<Evento | null> {
  const db = await getDatabase();
  const eventoId = typeof id === 'string' ? new ObjectId(id) : id;
  
  return db.collection<Evento>(COLLECTION).findOne({ _id: eventoId });
}

/**
 * Listar eventos por período
 */
export async function listEventos(filters?: {
  dataInicio?: Date;
  dataFim?: Date;
  tipo?: string;
  usuarioId?: ObjectId;
  setor?: string;
}): Promise<Evento[]> {
  const db = await getDatabase();
  
  const query: any = {};
  
  // Filtro por período
  if (filters?.dataInicio || filters?.dataFim) {
    query.$and = [];
    if (filters.dataInicio) {
      query.$and.push({ dataFim: { $gte: filters.dataInicio } });
    }
    if (filters.dataFim) {
      query.$and.push({ dataInicio: { $lte: filters.dataFim } });
    }
  }
  
  if (filters?.tipo) {
    query.tipo = filters.tipo;
  }
  
  // Eventos do usuário (como organizador ou participante)
  if (filters?.usuarioId) {
    query.$or = [
      { organizadorId: filters.usuarioId },
      { 'participantes.userId': filters.usuarioId }
    ];
  }
  
  // Eventos visíveis para o setor
  if (filters?.setor) {
    query.$or = [
      { privado: { $ne: true } },
      { setoresConvidados: filters.setor },
      { setoresConvidados: { $exists: false } },
      { setoresConvidados: { $size: 0 } }
    ];
  }
  
  return db.collection<Evento>(COLLECTION)
    .find(query)
    .sort({ dataInicio: 1 })
    .toArray();
}

/**
 * Listar eventos do mês
 */
export async function getEventosMes(ano: number, mes: number, usuarioId?: ObjectId): Promise<Evento[]> {
  const dataInicio = new Date(ano, mes - 1, 1);
  const dataFim = new Date(ano, mes, 0, 23, 59, 59);
  
  return listEventos({
    dataInicio,
    dataFim,
    usuarioId
  });
}

/**
 * Atualizar evento
 */
export async function updateEvento(id: string | ObjectId, data: UpdateEventoDTO): Promise<boolean> {
  const db = await getDatabase();
  const eventoId = typeof id === 'string' ? new ObjectId(id) : id;
  
  const result = await db.collection<Evento>(COLLECTION).updateOne(
    { _id: eventoId },
    { 
      $set: { 
        ...data, 
        atualizadoEm: new Date() 
      } 
    }
  );
  
  return result.modifiedCount > 0;
}

/**
 * Deletar evento
 */
export async function deleteEvento(id: string | ObjectId): Promise<boolean> {
  const db = await getDatabase();
  const eventoId = typeof id === 'string' ? new ObjectId(id) : id;
  
  const result = await db.collection<Evento>(COLLECTION).deleteOne({ _id: eventoId });
  
  return result.deletedCount > 0;
}

/**
 * Confirmar participação em evento
 */
export async function confirmarParticipacao(
  eventoId: string | ObjectId,
  usuarioId: ObjectId
): Promise<boolean> {
  const db = await getDatabase();
  const id = typeof eventoId === 'string' ? new ObjectId(eventoId) : eventoId;
  
  const result = await db.collection<Evento>(COLLECTION).updateOne(
    { 
      _id: id,
      'participantes.userId': usuarioId
    },
    {
      $set: {
        'participantes.$.confirmado': true,
        'participantes.$.confirmadoEm': new Date(),
        atualizadoEm: new Date()
      }
    }
  );
  
  return result.modifiedCount > 0;
}

/**
 * Buscar próximos eventos do usuário
 */
export async function getProximosEventos(usuarioId: ObjectId, limite: number = 5): Promise<Evento[]> {
  const db = await getDatabase();
  const agora = new Date();
  
  return db.collection<Evento>(COLLECTION)
    .find({
      dataInicio: { $gte: agora },
      $or: [
        { organizadorId: usuarioId },
        { 'participantes.userId': usuarioId }
      ]
    })
    .sort({ dataInicio: 1 })
    .limit(limite)
    .toArray();
}

/**
 * Contar eventos por tipo
 */
export async function countEventosPorTipo(): Promise<Record<string, number>> {
  const db = await getDatabase();
  
  const result = await db.collection<Evento>(COLLECTION)
    .aggregate([
      { $group: { _id: '$tipo', count: { $sum: 1 } } }
    ])
    .toArray();
  
  return result.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {} as Record<string, number>);
}
