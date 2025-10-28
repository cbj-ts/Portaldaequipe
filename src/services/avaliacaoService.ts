/**
 * ============================================================================
 * SERVICE: Avaliações de Desempenho
 * ============================================================================
 */

import { ObjectId } from 'mongodb';
import { getDatabase } from '../lib/mongodb';
import type { 
  Avaliacao, 
  CreateAvaliacaoDTO, 
  SubmitAvaliacaoDTO,
  AvaliacaoLog,
  TipoAvaliacao 
} from '../models/Avaliacao';

/**
 * Buscar avaliações pendentes de um usuário (como avaliador)
 */
export async function getAvaliacoesPendentes(avaliadorId: string): Promise<Avaliacao[]> {
  const db = await getDatabase();
  
  return db.collection<Avaliacao>('avaliacoes')
    .find({
      avaliadorId: new ObjectId(avaliadorId),
      status: 'Pendente'
    })
    .sort({ criadoEm: -1 })
    .toArray();
}

/**
 * Buscar avaliações recebidas (como avaliado)
 */
export async function getAvaliacoesRecebidas(avaliadoId: string): Promise<Avaliacao[]> {
  const db = await getDatabase();
  
  return db.collection<Avaliacao>('avaliacoes')
    .find({
      avaliadoId: new ObjectId(avaliadoId),
      status: 'Concluída'
    })
    .sort({ concluidaEm: -1 })
    .toArray();
}

/**
 * Buscar avaliação por ID
 */
export async function getAvaliacaoById(id: string): Promise<Avaliacao | null> {
  const db = await getDatabase();
  return db.collection<Avaliacao>('avaliacoes').findOne({ _id: new ObjectId(id) });
}

/**
 * Criar avaliação
 */
export async function createAvaliacao(
  data: CreateAvaliacaoDTO,
  avaliadorNome: string,
  avaliadorSetor: string,
  avaliadoNome: string,
  avaliadoSetor: string,
  avaliadoCargo: string
): Promise<Avaliacao> {
  const db = await getDatabase();
  
  const avaliacao: Avaliacao = {
    tipo: data.tipo,
    avaliadorId: data.avaliadorId,
    avaliadorNome,
    avaliadorSetor,
    avaliadoId: data.avaliadoId,
    avaliadoNome,
    avaliadoSetor,
    avaliadoCargo,
    criterios: [],
    notaFinal: 0,
    status: 'Pendente',
    dataLimite: data.dataLimite,
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  };
  
  const result = await db.collection<Avaliacao>('avaliacoes').insertOne(avaliacao);
  
  // Registrar log
  await createAvaliacaoLog({
    avaliacaoId: result.insertedId,
    tipo: data.tipo,
    avaliadorId: data.avaliadorId,
    avaliadorNome,
    avaliadoId: data.avaliadoId,
    avaliadoNome,
    acao: 'criada',
    descricao: `Avaliação de ${data.tipo} criada`,
    criadoEm: new Date(),
  });
  
  return { ...avaliacao, _id: result.insertedId };
}

/**
 * Submeter avaliação (preencher)
 */
export async function submitAvaliacao(
  id: string,
  data: SubmitAvaliacaoDTO
): Promise<boolean> {
  const db = await getDatabase();
  
  // Calcular nota final
  const notaFinal = data.criterios.reduce((acc, c) => acc + c.nota, 0) / data.criterios.length;
  
  const result = await db.collection<Avaliacao>('avaliacoes').updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        criterios: data.criterios,
        pontosFortesGerais: data.pontosFortesGerais,
        pontosAMelhorarGerais: data.pontosAMelhorarGerais,
        sugestoesGerais: data.sugestoesGerais,
        notaFinal,
        status: 'Concluída',
        concluidaEm: new Date(),
        atualizadoEm: new Date(),
      }
    }
  );
  
  // Registrar log
  if (result.modifiedCount > 0) {
    const avaliacao = await getAvaliacaoById(id);
    if (avaliacao) {
      await createAvaliacaoLog({
        avaliacaoId: new ObjectId(id),
        tipo: avaliacao.tipo,
        avaliadorId: avaliacao.avaliadorId,
        avaliadorNome: avaliacao.avaliadorNome,
        avaliadoId: avaliacao.avaliadoId,
        avaliadoNome: avaliacao.avaliadoNome,
        acao: 'concluída',
        descricao: `Avaliação concluída com nota ${notaFinal.toFixed(1)}`,
        criadoEm: new Date(),
      });
    }
  }
  
  return result.modifiedCount > 0;
}

/**
 * Buscar logs de avaliação
 */
export async function getAvaliacaoLogs(filters?: {
  avaliacaoId?: string;
  avaliadorId?: string;
  avaliadoId?: string;
  tipo?: TipoAvaliacao;
}): Promise<AvaliacaoLog[]> {
  const db = await getDatabase();
  const query: any = {};
  
  if (filters?.avaliacaoId) query.avaliacaoId = new ObjectId(filters.avaliacaoId);
  if (filters?.avaliadorId) query.avaliadorId = new ObjectId(filters.avaliadorId);
  if (filters?.avaliadoId) query.avaliadoId = new ObjectId(filters.avaliadoId);
  if (filters?.tipo) query.tipo = filters.tipo;
  
  return db.collection<AvaliacaoLog>('avaliacaoLogs')
    .find(query)
    .sort({ criadoEm: -1 })
    .limit(100)
    .toArray();
}

/**
 * Criar log de avaliação
 */
async function createAvaliacaoLog(log: AvaliacaoLog): Promise<void> {
  const db = await getDatabase();
  await db.collection<AvaliacaoLog>('avaliacaoLogs').insertOne(log);
}

/**
 * Deletar avaliação
 */
export async function deleteAvaliacao(id: string): Promise<boolean> {
  const db = await getDatabase();
  
  const result = await db.collection<Avaliacao>('avaliacoes').deleteOne({
    _id: new ObjectId(id)
  });
  
  return result.deletedCount > 0;
}

/**
 * Buscar estatísticas de avaliações
 */
export async function getAvaliacaoStats(usuarioId: string) {
  const db = await getDatabase();
  
  const [pendentesCount, recebidasCount, mediaGeral] = await Promise.all([
    // Avaliações pendentes (como avaliador)
    db.collection<Avaliacao>('avaliacoes').countDocuments({
      avaliadorId: new ObjectId(usuarioId),
      status: 'Pendente'
    }),
    
    // Avaliações recebidas (como avaliado)
    db.collection<Avaliacao>('avaliacoes').countDocuments({
      avaliadoId: new ObjectId(usuarioId),
      status: 'Concluída'
    }),
    
    // Média geral das avaliações recebidas
    db.collection<Avaliacao>('avaliacoes').aggregate([
      {
        $match: {
          avaliadoId: new ObjectId(usuarioId),
          status: 'Concluída'
        }
      },
      {
        $group: {
          _id: null,
          media: { $avg: '$notaFinal' }
        }
      }
    ]).toArray()
  ]);
  
  return {
    pendentes: pendentesCount,
    recebidas: recebidasCount,
    mediaGeral: mediaGeral[0]?.media || 0
  };
}
