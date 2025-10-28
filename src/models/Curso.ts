/**
 * ============================================================================
 * MODEL: Curso (Treinamentos)
 * ============================================================================
 * 
 * Schema para cursos e treinamentos
 * 
 * ============================================================================
 */

import { ObjectId } from 'mongodb';

export type CategoriaCurso = 
  | 'Técnico'
  | 'Vendas'
  | 'Gestão'
  | 'Compliance'
  | 'Produto'
  | 'Soft Skills'
  | 'Onboarding';

export type TipoCurso = 'Vídeo' | 'Presencial' | 'Online ao Vivo' | 'Documento';

export interface ModuloCurso {
  ordem: number;
  titulo: string;
  descricao?: string;
  videoUrl?: string; // Vimeo ID
  duracao?: number; // em minutos
  conteudo?: string; // Markdown
  obrigatorio?: boolean;
}

export interface ProgressoCurso {
  _id?: ObjectId;
  cursoId: ObjectId;
  usuarioId: ObjectId;
  
  // Progresso
  iniciado: boolean;
  concluido: boolean;
  dataInicio?: Date;
  dataConclusao?: Date;
  
  // Módulos
  modulosConcluidos: number[];
  ultimoModuloVisto?: number;
  tempoTotal?: number; // minutos assistidos
  
  // Avaliação
  notaAvaliacao?: number;
  aprovado?: boolean;
  tentativas?: number;
  
  // Metadados
  atualizadoEm: Date;
}

export interface Curso {
  _id?: ObjectId;
  titulo: string;
  descricao: string;
  categoria: CategoriaCurso;
  tipo: TipoCurso;
  
  // Conteúdo
  capa?: string;
  modulos: ModuloCurso[];
  duracaoTotal?: number; // em minutos
  
  // Visibilidade
  setoresPermitidos?: string[]; // Vazio = todos
  obrigatorio?: boolean;
  prazoMaximo?: number; // dias para conclusão
  
  // Instrutor
  instrutor?: string;
  instrutorFoto?: string;
  
  // Status
  publicado: boolean;
  arquivado?: boolean;
  
  // Metadados
  criadoEm: Date;
  atualizadoEm: Date;
  criadoPor?: ObjectId;
}

export interface CreateCursoDTO {
  titulo: string;
  descricao: string;
  categoria: CategoriaCurso;
  tipo: TipoCurso;
  capa?: string;
  modulos: ModuloCurso[];
  setoresPermitidos?: string[];
  obrigatorio?: boolean;
  prazoMaximo?: number;
  instrutor?: string;
  instrutorFoto?: string;
  publicado?: boolean;
  criadoPor?: ObjectId;
}

export interface UpdateProgressoDTO {
  cursoId: ObjectId;
  usuarioId: ObjectId;
  modulosConcluidos?: number[];
  concluido?: boolean;
  notaAvaliacao?: number;
}

/**
 * Índices recomendados
 */
export const cursoIndexes = [
  { key: { categoria: 1 } },
  { key: { publicado: 1 } },
  { key: { setoresPermitidos: 1 } },
  { key: { criadoEm: -1 } },
];

export const progressoIndexes = [
  { key: { cursoId: 1, usuarioId: 1 }, unique: true },
  { key: { usuarioId: 1 } },
  { key: { concluido: 1 } },
];
