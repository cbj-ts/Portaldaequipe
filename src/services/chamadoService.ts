/**
 * ============================================================================
 * SERVICE: Chamado Service
 * ============================================================================
 * 
 * Serviço para gerenciar chamados (tickets)
 * 
 * ============================================================================
 */

import { ObjectId } from 'mongodb';
import { getDatabase } from '../lib/mongodb';
import type { 
  Chamado, 
  CreateChamadoDTO, 
  UpdateChamadoDTO,
  AddRespostaDTO,
  SetorChamado 
} from '../models/Chamado';

const COLLECTION = 'chamados';

/**
 * Gerar número único para o chamado (ex: TEI-2025-001)
 */
async function gerarNumeroChamado(setor: SetorChamado): Promise<string> {
  const db = await getDatabase();
  const ano = new Date().getFullYear();
  
  // Buscar último número do setor neste ano
  const ultimoChamado = await db.collection<Chamado>(COLLECTION)
    .find({ setor, numero: { $regex: `^${setor}-${ano}` } })
    .sort({ numero: -1 })
    .limit(1)
    .toArray();
  
  let proximoNumero = 1;
  
  if (ultimoChamado.length > 0) {
    const match = ultimoChamado[0].numero.match(/\d+$/);
    if (match) {
      proximoNumero = parseInt(match[0]) + 1;
    }
  }
  
  return `${setor}-${ano}-${String(proximoNumero).padStart(3, '0')}`;
}

/**
 * Criar novo chamado
 */
export async function createChamado(data: CreateChamadoDTO, solicitanteNome: string, solicitanteSetor: string, solicitanteEmail: string): Promise<Chamado> {
  const db = await getDatabase();
  
  const numero = await gerarNumeroChamado(data.setor);
  
  const chamado: Omit<Chamado, '_id'> = {
    numero,
    setor: data.setor,
    solicitanteId: data.solicitanteId,
    solicitanteNome,
    solicitanteSetor,
    solicitanteEmail,
    titulo: data.titulo,
    descricao: data.descricao,
    categoria: data.categoria,
    prioridade: data.prioridade,
    status: 'Aberto',
    anexos: data.anexos || [],
    respostas: [],
    dadosEspecificos: data.dadosEspecificos,
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  };
  
  const result = await db.collection<Chamado>(COLLECTION).insertOne(chamado as Chamado);
  
  return {
    ...chamado,
    _id: result.insertedId,
  };
}

/**
 * Buscar chamado por ID
 */
export async function getChamadoById(id: string | ObjectId): Promise<Chamado | null> {
  const db = await getDatabase();
  const chamadoId = typeof id === 'string' ? new ObjectId(id) : id;
  
  return db.collection<Chamado>(COLLECTION).findOne({ _id: chamadoId });
}

/**
 * Listar chamados com filtros
 */
export async function listChamados(filters?: {
  setor?: SetorChamado;
  status?: string;
  solicitanteId?: ObjectId;
  atribuidoParaId?: ObjectId;
}): Promise<Chamado[]> {
  const db = await getDatabase();
  
  const query: any = {};
  if (filters?.setor) query.setor = filters.setor;
  if (filters?.status) query.status = filters.status;
  if (filters?.solicitanteId) query.solicitanteId = filters.solicitanteId;
  if (filters?.atribuidoParaId) query.atribuidoParaId = filters.atribuidoParaId;
  
  return db.collection<Chamado>(COLLECTION)
    .find(query)
    .sort({ criadoEm: -1 })
    .toArray();
}

/**
 * Atualizar chamado
 */
export async function updateChamado(id: string | ObjectId, data: UpdateChamadoDTO): Promise<boolean> {
  const db = await getDatabase();
  const chamadoId = typeof id === 'string' ? new ObjectId(id) : id;
  
  const updateData: any = {
    ...data,
    atualizadoEm: new Date(),
  };
  
  // Se status foi mudado para Resolvido ou Fechado, registrar data
  if (data.status === 'Resolvido' || data.status === 'Fechado') {
    if (data.status === 'Resolvido' && !updateData.dataResolucao) {
      updateData.dataResolucao = new Date();
    }
    if (data.status === 'Fechado' && !updateData.fechadoEm) {
      updateData.fechadoEm = new Date();
    }
  }
  
  const result = await db.collection<Chamado>(COLLECTION).updateOne(
    { _id: chamadoId },
    { $set: updateData }
  );
  
  return result.modifiedCount > 0;
}

/**
 * Adicionar resposta ao chamado
 */
export async function addResposta(data: AddRespostaDTO, autorNome: string): Promise<boolean> {
  const db = await getDatabase();
  
  const resposta = {
    _id: new ObjectId(),
    autorId: data.autorId,
    autorNome,
    mensagem: data.mensagem,
    anexos: data.anexos || [],
    criadoEm: new Date(),
    isInterno: data.isInterno || false,
  };
  
  const result = await db.collection<Chamado>(COLLECTION).updateOne(
    { _id: data.chamadoId },
    { 
      $push: { respostas: resposta },
      $set: { atualizadoEm: new Date() }
    }
  );
  
  return result.modifiedCount > 0;
}

/**
 * Atribuir chamado para alguém
 */
export async function atribuirChamado(
  chamadoId: string | ObjectId, 
  usuarioId: ObjectId, 
  usuarioNome: string
): Promise<boolean> {
  const db = await getDatabase();
  const id = typeof chamadoId === 'string' ? new ObjectId(chamadoId) : chamadoId;
  
  const result = await db.collection<Chamado>(COLLECTION).updateOne(
    { _id: id },
    { 
      $set: { 
        atribuidoParaId: usuarioId,
        atribuidoParaNome: usuarioNome,
        status: 'Em Andamento',
        atualizadoEm: new Date()
      } 
    }
  );
  
  return result.modifiedCount > 0;
}

/**
 * Estatísticas de chamados
 */
export async function getChamadoStats(setor?: SetorChamado) {
  const db = await getDatabase();
  
  const match: any = {};
  if (setor) match.setor = setor;
  
  const stats = await db.collection<Chamado>(COLLECTION)
    .aggregate([
      { $match: match },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])
    .toArray();
  
  return stats.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Avaliar chamado
 */
export async function avaliarChamado(
  chamadoId: string | ObjectId,
  nota: number,
  comentario?: string
): Promise<boolean> {
  const db = await getDatabase();
  const id = typeof chamadoId === 'string' ? new ObjectId(chamadoId) : chamadoId;
  
  const result = await db.collection<Chamado>(COLLECTION).updateOne(
    { _id: id },
    {
      $set: {
        avaliacao: {
          nota,
          comentario,
          avaliadoEm: new Date()
        },
        atualizadoEm: new Date()
      }
    }
  );
  
  return result.modifiedCount > 0;
}
