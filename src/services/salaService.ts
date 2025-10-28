/**
 * ============================================================================
 * SERVICE: Salas e Reservas
 * ============================================================================
 */

import { ObjectId } from 'mongodb';
import { getDatabase } from '../lib/mongodb';
import type { Sala, Reserva, CreateReservaDTO, UpdateReservaDTO } from '../models/Sala';

/**
 * Buscar todas as salas ativas
 */
export async function getSalas(): Promise<Sala[]> {
  const db = await getDatabase();
  return db.collection<Sala>('salas')
    .find({ ativa: true })
    .sort({ nome: 1 })
    .toArray();
}

/**
 * Buscar sala por ID
 */
export async function getSalaById(id: string): Promise<Sala | null> {
  const db = await getDatabase();
  return db.collection<Sala>('salas').findOne({ _id: new ObjectId(id) });
}

/**
 * Buscar reservas de uma sala em um período
 */
export async function getReservasBySala(
  salaId: string,
  dataInicio: Date,
  dataFim: Date
): Promise<Reserva[]> {
  const db = await getDatabase();
  
  return db.collection<Reserva>('reservas')
    .find({
      salaId: new ObjectId(salaId),
      status: { $ne: 'Cancelada' },
      $or: [
        { dataInicio: { $gte: dataInicio, $lte: dataFim } },
        { dataFim: { $gte: dataInicio, $lte: dataFim } },
        {
          dataInicio: { $lte: dataInicio },
          dataFim: { $gte: dataFim }
        }
      ]
    })
    .sort({ dataInicio: 1 })
    .toArray();
}

/**
 * Buscar todas as reservas de um usuário
 */
export async function getReservasByUsuario(usuarioId: string): Promise<Reserva[]> {
  const db = await getDatabase();
  
  return db.collection<Reserva>('reservas')
    .find({ usuarioId: new ObjectId(usuarioId) })
    .sort({ dataInicio: -1 })
    .toArray();
}

/**
 * Buscar todas as reservas (com filtros opcionais)
 */
export async function getReservas(filters?: {
  salaId?: string;
  usuarioId?: string;
  status?: string;
  dataInicio?: Date;
  dataFim?: Date;
}): Promise<Reserva[]> {
  const db = await getDatabase();
  const query: any = {};
  
  if (filters?.salaId) query.salaId = new ObjectId(filters.salaId);
  if (filters?.usuarioId) query.usuarioId = new ObjectId(filters.usuarioId);
  if (filters?.status) query.status = filters.status;
  if (filters?.dataInicio && filters?.dataFim) {
    query.$or = [
      { dataInicio: { $gte: filters.dataInicio, $lte: filters.dataFim } },
      { dataFim: { $gte: filters.dataInicio, $lte: filters.dataFim } }
    ];
  }
  
  return db.collection<Reserva>('reservas')
    .find(query)
    .sort({ dataInicio: -1 })
    .toArray();
}

/**
 * Criar reserva
 */
export async function createReserva(
  data: CreateReservaDTO,
  usuarioNome: string,
  usuarioSetor: string
): Promise<Reserva> {
  const db = await getDatabase();
  
  // Buscar nome da sala
  const sala = await getSalaById(data.salaId.toString());
  if (!sala) throw new Error('Sala não encontrada');
  
  // Verificar conflito de horários
  const conflitos = await getReservasBySala(
    data.salaId.toString(),
    data.dataInicio,
    data.dataFim
  );
  
  if (conflitos.length > 0) {
    throw new Error('Já existe uma reserva neste horário');
  }
  
  const reserva: Reserva = {
    salaId: data.salaId,
    salaNome: sala.nome,
    usuarioId: data.usuarioId,
    usuarioNome,
    usuarioSetor,
    dataInicio: data.dataInicio,
    dataFim: data.dataFim,
    titulo: data.titulo,
    descricao: data.descricao,
    participantes: data.participantes,
    recursosNecessarios: data.recursosNecessarios,
    status: 'Confirmada',
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  };
  
  const result = await db.collection<Reserva>('reservas').insertOne(reserva);
  return { ...reserva, _id: result.insertedId };
}

/**
 * Atualizar reserva
 */
export async function updateReserva(
  id: string,
  data: UpdateReservaDTO
): Promise<boolean> {
  const db = await getDatabase();
  
  // Se estiver alterando horário, verificar conflitos
  if (data.dataInicio || data.dataFim) {
    const reservaAtual = await db.collection<Reserva>('reservas')
      .findOne({ _id: new ObjectId(id) });
    
    if (!reservaAtual) return false;
    
    const novoInicio = data.dataInicio || reservaAtual.dataInicio;
    const novoFim = data.dataFim || reservaAtual.dataFim;
    
    const conflitos = await getReservasBySala(
      reservaAtual.salaId.toString(),
      novoInicio,
      novoFim
    );
    
    // Ignorar a própria reserva
    const temConflito = conflitos.some(r => r._id?.toString() !== id);
    if (temConflito) {
      throw new Error('Já existe uma reserva neste horário');
    }
  }
  
  const result = await db.collection<Reserva>('reservas').updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...data,
        atualizadoEm: new Date(),
      }
    }
  );
  
  return result.modifiedCount > 0;
}

/**
 * Cancelar reserva
 */
export async function cancelReserva(
  id: string,
  motivo?: string
): Promise<boolean> {
  const db = await getDatabase();
  
  const result = await db.collection<Reserva>('reservas').updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        status: 'Cancelada',
        canceladaEm: new Date(),
        motivoCancelamento: motivo,
        atualizadoEm: new Date(),
      }
    }
  );
  
  return result.modifiedCount > 0;
}

/**
 * Deletar reserva
 */
export async function deleteReserva(id: string): Promise<boolean> {
  const db = await getDatabase();
  
  const result = await db.collection<Reserva>('reservas').deleteOne({
    _id: new ObjectId(id)
  });
  
  return result.deletedCount > 0;
}
