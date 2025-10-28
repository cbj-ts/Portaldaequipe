/**
 * ============================================================================
 * MODEL: Chamado (Ticket/Solicitação)
 * ============================================================================
 * 
 * Schema para sistema de chamados (TEI, RH, Financeiro)
 * 
 * ============================================================================
 */

import { ObjectId } from 'mongodb';

export type SetorChamado = 'TEI' | 'RH' | 'Financeiro';

export type StatusChamado = 
  | 'Aberto'
  | 'Em Andamento'
  | 'Aguardando Resposta'
  | 'Resolvido'
  | 'Fechado'
  | 'Cancelado';

export type PrioridadeChamado = 
  | 'Baixa'
  | 'Normal'
  | 'Alta'
  | 'Urgente';

export type CategoriaTEI =
  | 'Hardware'
  | 'Software'
  | 'Rede'
  | 'Email'
  | 'Telefonia'
  | 'Sistema'
  | 'Outros';

export type CategoriaRH =
  | 'Férias'
  | 'Atestado'
  | 'Benefícios'
  | 'Folha de Pagamento'
  | 'Contratação'
  | 'Desligamento'
  | 'Treinamento'
  | 'Outros';

export type CategoriaFinanceiro =
  | 'Reembolso'
  | 'Nota Fiscal'
  | 'Pagamento'
  | 'Adiantamento'
  | 'Despesa'
  | 'Orçamento'
  | 'Outros';

export interface Anexo {
  nome: string;
  url: string;
  tipo: string; // MIME type
  tamanho: number; // em bytes
  uploadEm: Date;
}

export interface Resposta {
  _id?: ObjectId;
  autorId: ObjectId;
  autorNome: string;
  mensagem: string;
  anexos?: Anexo[];
  criadoEm: Date;
  isInterno?: boolean; // Resposta visível apenas para equipe
}

export interface Chamado {
  _id?: ObjectId;
  numero: string; // Número sequencial do chamado (ex: TEI-2025-001)
  setor: SetorChamado;
  
  // Quem abriu
  solicitanteId: ObjectId;
  solicitanteNome: string;
  solicitanteSetor: string;
  solicitanteEmail: string;
  
  // Dados do chamado
  titulo: string;
  descricao: string;
  categoria: CategoriaTEI | CategoriaRH | CategoriaFinanceiro;
  prioridade: PrioridadeChamado;
  status: StatusChamado;
  
  // Atribuição
  atribuidoParaId?: ObjectId;
  atribuidoParaNome?: string;
  
  // Anexos e respostas
  anexos?: Anexo[];
  respostas?: Resposta[];
  
  // Dados específicos por setor
  dadosEspecificos?: {
    // TEI
    local?: string; // Local do problema
    equipamento?: string; // Número patrimônio/nome equipamento
    
    // RH
    periodo?: { inicio: Date; fim: Date }; // Para férias, etc
    
    // Financeiro
    valor?: number;
    centroCusto?: string;
    fornecedor?: string;
  };
  
  // SLA e prazos
  prazoResolucao?: Date;
  dataResolucao?: Date;
  
  // Avaliação
  avaliacao?: {
    nota: number; // 1-5
    comentario?: string;
    avaliadoEm: Date;
  };
  
  // Metadados
  criadoEm: Date;
  atualizadoEm: Date;
  fechadoEm?: Date;
}

export interface CreateChamadoDTO {
  setor: SetorChamado;
  solicitanteId: ObjectId;
  titulo: string;
  descricao: string;
  categoria: CategoriaTEI | CategoriaRH | CategoriaFinanceiro;
  prioridade: PrioridadeChamado;
  anexos?: Anexo[];
  dadosEspecificos?: Chamado['dadosEspecificos'];
}

export interface UpdateChamadoDTO {
  titulo?: string;
  descricao?: string;
  categoria?: CategoriaTEI | CategoriaRH | CategoriaFinanceiro;
  prioridade?: PrioridadeChamado;
  status?: StatusChamado;
  atribuidoParaId?: ObjectId;
  prazoResolucao?: Date;
}

export interface AddRespostaDTO {
  chamadoId: ObjectId;
  autorId: ObjectId;
  mensagem: string;
  anexos?: Anexo[];
  isInterno?: boolean;
}

/**
 * Índices recomendados para a collection 'chamados'
 */
export const chamadoIndexes = [
  { key: { numero: 1 }, unique: true },
  { key: { setor: 1, status: 1 } },
  { key: { solicitanteId: 1 } },
  { key: { atribuidoParaId: 1 } },
  { key: { criadoEm: -1 } },
  { key: { status: 1, criadoEm: -1 } },
];
