/**
 * ============================================================================
 * SETORES - Definições Centralizadas
 * ============================================================================
 *
 * Este arquivo centraliza todas as informações dos setores da TradeStars.
 * Use este arquivo como fonte única de verdade para dados de setores.
 *
 * ESTRUTURA:
 * - Nome completo
 * - Sigla
 * - Ícone espacial
 * - Cor
 * - Descrição
 * - Áreas de atuação
 *
 * ============================================================================
 */

export interface Setor {
  id: string;
  nome: string;
  sigla: string;
  cor: string; // Cor HEX
  descricao: string;
  areas: string[];
}

/**
 * PALETA DE CORES DOS SETORES
 * Cores harmoniosas que combinam com roxo (#ac2aff), azul (#000aff) e rosa (#ff00ed)
 */
export const SETORES: Setor[] = [
  {
    id: "administracao",
    nome: "Administração",
    sigla: "ADM",
    cor: "#64748b", // Slate - neutro, profissional
    descricao: "Gestão administrativa e suporte operacional",
    areas: ["Gestão", "Processos Internos", "Facilities"],
  },
  {
    id: "bi",
    nome: "Business Inteligence",
    sigla: "BI",
    cor: "#f59e0b", // Amber - insights, iluminação de dados
    descricao: "Análise de dados e relatórios estratégicos",
    areas: [
      "Análise de Dados",
      "Dashboards",
      "KPIs",
      "Relatórios",
    ],
  },
  {
    id: "cobranca",
    nome: "Cobrança",
    sigla: "Cobrança",
    cor: "#f97316", // Orange - urgência, ação
    descricao: "Gestão de cobranças e recuperação de crédito",
    areas: ["Negociação", "Acordo", "Recuperação"],
  },
  {
    id: "comunicacao",
    nome: "Comunicação",
    sigla: "Comunicação",
    cor: "#a855f7", // Purple - criatividade, comunicação
    descricao: "Marketing, comunicação interna e externa",
    areas: [
      "Marketing Digital",
      "Eventos",
      "Comunicação Interna",
    ],
  },
  {
    id: "contratos",
    nome: "Contratos",
    sigla: "Contratos",
    cor: "#06b6d4", // Cyan - profissional, legal
    descricao: "Gestão e análise de contratos",
    areas: ["Elaboração", "Análise", "Compliance"],
  },
  {
    id: "financeiro",
    nome: "Financeiro",
    sigla: "Financeiro",
    cor: "#10b981", // Emerald - crescimento, dinheiro
    descricao: "Gestão financeira e contábil",
    areas: ["Contas", "Contabilidade", "Planejamento"],
  },
  {
    id: "live",
    nome: "Live",
    sigla: "Live",
    cor: "#ff00ed", // Magenta/Rosa - energia, transmissão ao vivo
    descricao: "Transmissões ao vivo e eventos online",
    areas: ["Produção", "Engajamento", "Conteúdo"],
  },
  {
    id: "rh",
    nome: "Recursos Humanos",
    sigla: "RH",
    cor: "#3b82f6", // Blue - confiança, pessoas
    descricao:
      "Gestão de pessoas, recrutamento e desenvolvimento",
    areas: ["Recrutamento", "Benefícios", "Folha de Pagamento"],
  },
  {
    id: "sdr",
    nome: "SDR",
    sigla: "SDR",
    cor: "#6366f1", // Indigo - prospecção, vendas
    descricao: "Sales Development Representative - Prospecção e qualificação",
    areas: ["Qualificação", "Prospecção", "Pré-vendas"],
  },
  {
    id: "suporte-aldeia",
    nome: "Suporte Aldeia",
    sigla: "Aldeia",
    cor: "#14b8a6", // Teal - coordenação, operação
    descricao: "Suporte e atendimento aos alunos Aldeia",
    areas: ["Atendimento", "Suporte", "Cliente"],
  },
  {
    id: "suporte-tribo",
    nome: "Suporte Tribo",
    sigla: "Tribo",
    cor: "#8b5cf6", // Violet - liderança, gestão
    descricao: "Suporte e atendimento aos alunos Tribo",
    areas: ["Atendimento", "Suporte", "Cliente"],
  },
  {
    id: "tei",
    nome: "Time de Experiência e Inovação",
    sigla: "TEI",
    cor: "#ec4899", // Pink - inovação, criatividade
    descricao: "Tecnologia, Experiência e Inovação",
    areas: [
      "Experiência do Usuário",
      "Desenvolvimento",
      "Inovação",
    ],
  },
  {
    id: "vendas",
    nome: "Vendas",
    sigla: "Vendas",
    cor: "#ef4444", // Red - fechamento, resultados
    descricao: "Fechamento de vendas e negociações",
    areas: ["Vendas", "Negociação", "Fechamento"],
  },
];

// Mapa de ícones espaciais por setor
export const SETOR_ICONS: Record<string, string> = {
  administracao: "satellite",
  bi: "telescope",
  cobranca: "meteor",
  comunicacao: "constellation",
  contratos: "scroll",
  financeiro: "planet",
  live: "starburst",
  rh: "astronaut",
  sdr: "radar",
  "suporte-aldeia": "nebula",
  "suporte-tribo": "galaxy",
  tei: "comet",
  vendas: "rocket",
};

// Helper functions
export function getSetorById(id: string): Setor | undefined {
  return SETORES.find((s) => s.id === id);
}

export function getSetorBySigla(
  sigla: string,
): Setor | undefined {
  return SETORES.find(
    (s) => s.sigla.toLowerCase() === sigla.toLowerCase(),
  );
}

export function getSetorByNome(
  nome: string,
): Setor | undefined {
  return SETORES.find(
    (s) => s.nome.toLowerCase() === nome.toLowerCase(),
  );
}