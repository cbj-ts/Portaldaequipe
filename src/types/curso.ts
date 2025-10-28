/**
 * ============================================================================
 * TIPOS DE DADOS - SISTEMA DE CURSOS
 * ============================================================================
 */

export type SetorType = 'Todos' | 'Tecnologia' | 'RH' | 'BI' | 'Experiência' | 'Liderança' | 'Financeiro';

export type NivelType = 'Básico' | 'Intermediário' | 'Avançado';

export type TipoAulaType = 'video' | 'quiz' | 'documento' | 'texto';

export type TipoMaterialType = 'pdf' | 'ppt' | 'doc' | 'xlsx' | 'zip';

export interface Instrutor {
  nome: string;
  foto?: string;
  cargo: string;
  bio?: string;
}

export interface Material {
  id: string;
  nome: string;
  tipo: TipoMaterialType;
  url: string;
  tamanho: number; // bytes
}

export interface Aula {
  id: string;
  titulo: string;
  descricao?: string;
  tipo: TipoAulaType;
  video_url?: string; // URL do YouTube/Vimeo
  duracao: number; // segundos
  materiais?: Material[];
  ordem: number;
  conteudo_texto?: string; // Para aulas tipo texto
}

export interface Modulo {
  id: string;
  titulo: string;
  descricao: string;
  ordem: number;
  aulas: Aula[];
}

export interface Curso {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  setor: SetorType;
  instrutor: Instrutor;
  thumbnail: string;
  duracao_total: number; // minutos
  nivel: NivelType;
  modulos: Modulo[];
  tags?: string[];
  ativo: boolean;
  criado_em: string;
}

export interface ProgressoAula {
  aula_id: string;
  completado: boolean;
  progresso_segundos: number;
  ultima_visualizacao: string;
}

export interface ProgressoCurso {
  usuario_id: string;
  curso_id: string;
  progresso_aulas: ProgressoAula[];
  percentual_conclusao: number;
  data_inicio?: string;
  data_conclusao?: string;
}
