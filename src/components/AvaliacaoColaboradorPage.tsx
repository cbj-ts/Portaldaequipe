/**
 * ============================================================================
 * AVALIAÇÃO DE COLABORADOR - Sistema Completo
 * ============================================================================
 *
 * Sistema de avaliação específico para avaliar colaboradores com:
 * - Lista de colaboradores disponíveis
 * - Formulário de avaliação com critérios
 * - Perfil detalhado (para líderes)
 * - Sistema de anotações
 *
 * ============================================================================
 */

import { useEffect, useState } from "react";
import {
  Send,
  User,
  Users,
  Plus,
  AlertTriangle,
  Download,
  ChevronRight,
} from "lucide-react";
import { BackButton } from "./common/BackButton";
import { PrimaryButton } from "./PrimaryButton";
import { FormInput } from "./FormInput";
import { FormTextarea } from "./FormTextarea";
import { FormSelect } from "./FormSelect";
import { FileUploadArea, FileData } from "./common/FileUploadArea";
import { toast } from "sonner@2.0.3";

interface Colaborador {
  id: string;
  nome: string;
  email: string;
  funcao: string;
  setor: string;
  notaTotal: number;
  numAvaliacoesRecebidas: number;
  numAvaliacoes: number;
  notaTotalAntiga: number;
  tag: string;
  islider: boolean;
  feedback?: string;
}

interface Aviso {
  id: string;
  titulo: string;
  descricao: string;
  data_criacao: string;
  caminho_arquivo?: string;
}

interface AvaliacaoColaboradorPageProps {
  onBack: () => void;
}

type PageView = "lista" | "perfil" | "adicionar-aviso" | "avaliar";

export function AvaliacaoColaboradorPage({
  onBack,
}: AvaliacaoColaboradorPageProps) {
  const [currentPage, setCurrentPage] = useState<PageView>("lista");
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [colaboradorSelecionado, setColaboradorSelecionado] =
    useState<Colaborador | null>(null);
  const [avisos, setAvisos] = useState<Aviso[]>([]);

  // Estados do formulário de avaliação
  const [avaliacaoData, setAvaliacaoData] = useState({
    item1: 0,
    item2: 0,
    item3: 0,
    item4: 0,
    item5: 0,
    item6: 0,
    item7: 0,
    item8: 0,
    item9: 0,
    item10: 0,
    feedback: "",
  });

  // Estados de aviso
  const [novoAviso, setNovoAviso] = useState({
    titulo: "",
    descricao: "",
  });
  const [arquivosAviso, setArquivosAviso] = useState<FileData[]>([]);

  // Mock de sessão atual - em produção viria de um contexto de autenticação
  const sessaoAtual: Colaborador = {
    id: "1",
    nome: "João Silva",
    email: "joao@tradestars.com.br",
    funcao: "Desenvolvedor",
    setor: "TEI",
    notaTotal: 85,
    numAvaliacoesRecebidas: 3,
    numAvaliacoes: 5,
    notaTotalAntiga: 80,
    tag: "Líder",
    islider: true,
  };

  // Simular dados (em produção viria do Supabase)
  useEffect(() => {
    const mockColaboradores: Colaborador[] = [
      {
        id: "2",
        nome: "Maria Santos",
        email: "maria@tradestars.com.br",
        funcao: "Designer",
        setor: "TEI",
        notaTotal: 90,
        numAvaliacoesRecebidas: 2,
        numAvaliacoes: 5,
        notaTotalAntiga: 85,
        tag: "Colaborador",
        islider: false,
      },
      {
        id: "3",
        nome: "Pedro Costa",
        email: "pedro@tradestars.com.br",
        funcao: "Analista",
        setor: "BI",
        notaTotal: 88,
        numAvaliacoesRecebidas: 3,
        numAvaliacoes: 5,
        notaTotalAntiga: 82,
        tag: "Colaborador",
        islider: false,
      },
      {
        id: "4",
        nome: "Ana Silva",
        email: "ana@tradestars.com.br",
        funcao: "Desenvolvedora",
        setor: "TEI",
        notaTotal: 92,
        numAvaliacoesRecebidas: 4,
        numAvaliacoes: 5,
        notaTotalAntiga: 88,
        tag: "Colaborador",
        islider: false,
      },
    ];
    setColaboradores(mockColaboradores);
  }, []);

  // Funções auxiliares
  const calcularMedia = (colaborador: Colaborador) => {
    if (colaborador.numAvaliacoesRecebidas === 0) return 0;
    return colaborador.notaTotal / colaborador.numAvaliacoesRecebidas;
  };

  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handlers
  const handleSelecionarColaborador = (colaborador: Colaborador) => {
    setColaboradorSelecionado(colaborador);
    setCurrentPage("perfil");
    // Em produção: carregar avisos do Supabase
    const mockAvisos: Aviso[] = [
      {
        id: "1",
        titulo: "Entrega exemplar",
        descricao:
          "Projeto finalizado antes do prazo com excelente qualidade.",
        data_criacao: new Date().toISOString(),
      },
    ];
    setAvisos(mockAvisos);
  };

  const handleAvaliar = (colaborador: Colaborador) => {
    if (sessaoAtual.numAvaliacoes <= 0) {
      toast.error("Você já avaliou todos os colaboradores disponíveis.");
      return;
    }
    setColaboradorSelecionado(colaborador);
    setCurrentPage("avaliar");
    // Resetar formulário
    setAvaliacaoData({
      item1: 0,
      item2: 0,
      item3: 0,
      item4: 0,
      item5: 0,
      item6: 0,
      item7: 0,
      item8: 0,
      item9: 0,
      item10: 0,
      feedback: "",
    });
  };

  const handleEnviarAvaliacao = () => {
    // Validação
    const valores = [
      avaliacaoData.item1,
      avaliacaoData.item2,
      avaliacaoData.item3,
      avaliacaoData.item4,
      avaliacaoData.item5,
      avaliacaoData.item6,
      avaliacaoData.item7,
      avaliacaoData.item8,
      avaliacaoData.item9,
      avaliacaoData.item10,
    ];

    if (valores.some((v) => v < 1 || v > 10 || isNaN(v))) {
      toast.error("Por favor, preencha todas as notas com valores entre 1 e 10.");
      return;
    }

    if (!avaliacaoData.feedback.trim()) {
      toast.error("Por favor, preencha o feedback detalhado.");
      return;
    }

    // Em produção: enviar para Supabase
    console.log("Avaliação enviada:", {
      avaliado: colaboradorSelecionado,
      dados: avaliacaoData,
    });

    toast.success("Avaliação enviada com sucesso!");
    setCurrentPage("lista");
  };

  const handleEnviarAviso = () => {
    if (!novoAviso.titulo || !novoAviso.descricao) {
      toast.error("Preencha título e descrição.");
      return;
    }

    // Em produção: enviar para Supabase
    console.log("Aviso enviado:", {
      ...novoAviso,
      arquivos: arquivosAviso,
    });

    toast.success("Anotação adicionada com sucesso!");
    setNovoAviso({ titulo: "", descricao: "" });
    setArquivosAviso([]);
    setCurrentPage("perfil");
  };

  const criteriosColaborador = [
    {
      label: "Comunicação",
      desc: "Comunica-se de forma clara e objetiva, respondendo ao seu superior imediato, bem como colegas e pares, de forma educada e sincera.",
      campo: "item1",
    },
    {
      label: "Comunicação",
      desc: "Repassa informações importantes do seu trabalho para acompanhamento. Dá retorno sobre o andamento de suas atividades.",
      campo: "item2",
    },
    {
      label: "Trabalho em equipe",
      desc: "Cumpre as normas e regras internas. Demonstra iniciativa e disponibilidade para ajudar as pessoas.",
      campo: "item3",
    },
    {
      label: "Trabalho em equipe",
      desc: "Relaciona-se de maneira positiva e profissional com todas as pessoas, demonstrando empatia e respeito.",
      campo: "item4",
    },
    {
      label: "Responsabilidade",
      desc: "Cumpre a jornada de trabalho, conforme escala estabelecida sem faltas e/ou atrasos, contribuindo com horas extras quando necessário.",
      campo: "item5",
    },
    {
      label: "Responsabilidade",
      desc: "Assume plena responsabilidade do seu trabalho, informando possíveis erros ou falhas cometidas. Antecipando as dificuldades e sugere soluções.",
      campo: "item6",
    },
    {
      label: "Entrega",
      desc: "Realiza as atividades de sua função dentro do prazo programado, antecipando sempre que possível.",
      campo: "item7",
    },
    {
      label: "Entrega",
      desc: "Sugere melhorias e resolve problemas, fazendo seu trabalho com qualidade e agilidade.",
      campo: "item8",
    },
    {
      label: "Organização",
      desc: "Mantém o local de trabalho limpo e organizado, facilitando a localização de objetos e documentos, realizando as atividades de forma padronizada.",
      campo: "item9",
    },
    {
      label: "Organização",
      desc: "Realiza seu trabalho com atenção e organização, evitando erros, retrabalhos e desperdícios.",
      campo: "item10",
    },
  ];

  // Renderização da lista
  const renderLista = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <BackButton onClick={onBack} />
        <div>
          <h1 className="text-gray-900 dark:text-white">
            Avaliar Colaborador
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Selecione um colaborador para avaliar ou visualizar perfil
          </p>
        </div>
      </div>

      {/* Lista de Colaboradores */}
      <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        {colaboradores.map((colaborador, index) => (
          <div key={colaborador.id}>
            <div className="px-6 py-5 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-purple-50 dark:bg-purple-950/20">
                  <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 dark:text-white mb-1">
                    {colaborador.nome}
                  </h3>
                  <div className="flex items-center gap-3 flex-wrap">
                    <small className="text-gray-600 dark:text-gray-400">
                      {colaborador.funcao}
                    </small>
                    <span className="text-gray-300 dark:text-gray-700">•</span>
                    <small className="text-gray-600 dark:text-gray-400">
                      {colaborador.setor}
                    </small>
                    {sessaoAtual.islider && (
                      <>
                        <span className="text-gray-300 dark:text-gray-700">•</span>
                        <small className="text-gray-600 dark:text-gray-400">
                          Média: {calcularMedia(colaborador).toFixed(2)}
                        </small>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                  {(sessaoAtual.islider ||
                    sessaoAtual.tag === "Co-líder" ||
                    sessaoAtual.tag === "Coordenador") && (
                    <button
                      onClick={() => handleSelecionarColaborador(colaborador)}
                      className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-900 hover:bg-purple-600 dark:hover:bg-purple-600 text-gray-600 dark:text-gray-400 hover:text-white dark:hover:text-white border border-gray-200 dark:border-gray-800 hover:border-purple-600 flex items-center justify-center transition-all duration-200 group"
                      title="Ver perfil"
                    >
                      <User className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                    </button>
                  )}
                  <PrimaryButton
                    onClick={() => handleAvaliar(colaborador)}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Avaliar
                  </PrimaryButton>
                </div>
              </div>
            </div>
            {index < colaboradores.length - 1 && (
              <div className="h-px bg-gray-200 dark:bg-gray-800"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Renderização do perfil
  const renderPerfil = () => {
    if (!colaboradorSelecionado) return null;

    const mediaAtual = calcularMedia(colaboradorSelecionado);
    const mediaAnterior =
      colaboradorSelecionado.notaTotalAntiga /
      (colaboradorSelecionado.numAvaliacoesRecebidas - 1 || 1);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <BackButton onClick={() => setCurrentPage("lista")} />
            <div>
              <h1 className="text-gray-900 dark:text-white">
                Perfil de {colaboradorSelecionado.nome}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {colaboradorSelecionado.funcao} • {colaboradorSelecionado.setor}
              </p>
            </div>
          </div>

          {/* Botão de adicionar anotação */}
          <button
            onClick={() => setCurrentPage("adicionar-aviso")}
            className="h-10 px-4 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Adicionar Anotação</span>
            <span className="sm:hidden">Anotação</span>
          </button>
        </div>

        <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-6">
          {/* Informações do colaborador */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
              <h3 className="text-gray-900 dark:text-white mb-2">
                Média Atual
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {isNaN(mediaAtual) ? "–" : mediaAtual.toFixed(1)}
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
              <h3 className="text-gray-900 dark:text-white mb-2">
                Última Média
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {mediaAnterior.toFixed(1)}
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
              <h3 className="text-gray-900 dark:text-white mb-2">Nível</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {colaboradorSelecionado.tag}
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
              <h3 className="text-gray-900 dark:text-white mb-2">
                Setor Atual
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {colaboradorSelecionado.setor}
              </p>
            </div>
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-800"></div>

          {/* Anotações */}
          <div>
            <h3 className="text-gray-900 dark:text-white mb-4">
              Anotações de {colaboradorSelecionado.nome}
            </h3>
            {avisos.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                Nenhuma anotação encontrada para este colaborador.
              </p>
            ) : (
              <div className="space-y-4">
                {avisos.map((aviso) => {
                  const isPositivo =
                    aviso.titulo === "Entrega exemplar" ||
                    aviso.titulo === "Overdelivery";

                  return (
                    <div
                      key={aviso.id}
                      className={`border-l-4 p-4 rounded-xl ${
                        isPositivo
                          ? "border-l-green-500 bg-green-50 dark:bg-green-950/20"
                          : "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"
                      } border border-gray-200 dark:border-gray-800`}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        {isPositivo ? (
                          <span className="text-2xl">✅</span>
                        ) : (
                          <AlertTriangle
                            className={`w-5 h-5 mt-1 ${
                              isPositivo
                                ? "text-green-500"
                                : "text-yellow-500"
                            }`}
                          />
                        )}
                        <h4
                          className={
                            isPositivo
                              ? "text-green-700 dark:text-green-400"
                              : "text-gray-900 dark:text-white"
                          }
                        >
                          {aviso.titulo}
                        </h4>
                      </div>
                      <small className="text-gray-500 dark:text-gray-400 block mb-2">
                        {formatarData(aviso.data_criacao)}
                      </small>
                      <p className="text-gray-600 dark:text-gray-400">
                        {aviso.descricao}
                      </p>
                      {aviso.caminho_arquivo && (
                        <button className="mt-3 flex items-center gap-2 px-4 h-10 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white">
                          <Download className="w-4 h-4" />
                          <span>Baixar Arquivo</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Renderização de adicionar aviso
  const renderAdicionarAviso = () => (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <BackButton onClick={() => setCurrentPage("perfil")} />
        <div>
          <h1 className="text-gray-900 dark:text-white">
            Adicionar Anotação
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Registre uma anotação sobre o colaborador
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-6">
        <div>
          <label className="text-gray-900 dark:text-white mb-2 block">
            Título da Anotação
          </label>
          <FormSelect
            value={novoAviso.titulo}
            onChange={(e) =>
              setNovoAviso({ ...novoAviso, titulo: e.target.value })
            }
            options={[
              { value: "", label: "Selecione um título" },
              { value: "Chegou atrasado", label: "Chegou atrasado" },
              { value: "Atraso de demanda", label: "Atraso de demanda" },
              { value: "Advertência verbal", label: "Advertência verbal" },
              { value: "Advertência escrita", label: "Advertência escrita" },
              { value: "Suspensão", label: "Suspensão" },
              { value: "Entrega exemplar", label: "Entrega exemplar" },
              { value: "Overdelivery", label: "Overdelivery" },
            ]}
          />
        </div>

        <div>
          <label className="text-gray-900 dark:text-white mb-2 block">
            Descrição da Anotação
          </label>
          <FormTextarea
            placeholder="Descreva a anotação aqui..."
            value={novoAviso.descricao}
            onChange={(e) =>
              setNovoAviso({
                ...novoAviso,
                descricao: e.target.value,
              })
            }
            rows={5}
          />
        </div>

        <FileUploadArea
          files={arquivosAviso}
          onFilesChange={setArquivosAviso}
          accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.doc,.docx"
          maxSize={10}
          label="Arquivo (opcional)"
          required={false}
        />

        <div className="flex justify-end">
          <PrimaryButton
            onClick={handleEnviarAviso}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Send className="w-4 h-4 mr-2" />
            Enviar Anotação
          </PrimaryButton>
        </div>
      </div>
    </div>
  );

  // Renderização do formulário de avaliação
  const renderAvaliar = () => {
    if (!colaboradorSelecionado) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <BackButton onClick={() => setCurrentPage("lista")} />
          <div>
            <h1 className="text-gray-900 dark:text-white">
              Avaliar {colaboradorSelecionado.nome}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {colaboradorSelecionado.funcao} • {colaboradorSelecionado.setor}
            </p>
          </div>
        </div>

        {/* Escala de Avaliação */}
        <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <h3 className="text-gray-900 dark:text-white text-center mb-4">
            Escala de Avaliação
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-900/30 text-center">
              <div className="text-gray-900 dark:text-gray-100 mb-1">1-2</div>
              <small className="text-red-700 dark:text-red-400">Péssimo</small>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-xl border border-orange-200 dark:border-orange-900/30 text-center">
              <div className="text-gray-900 dark:text-gray-100 mb-1">3-5</div>
              <small className="text-orange-700 dark:text-orange-400">Ruim</small>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-xl border border-yellow-200 dark:border-yellow-900/30 text-center">
              <div className="text-gray-900 dark:text-gray-100 mb-1">6-7</div>
              <small className="text-yellow-700 dark:text-yellow-400">Bom</small>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-900/30 text-center">
              <div className="text-gray-900 dark:text-gray-100 mb-1">8-9</div>
              <small className="text-green-700 dark:text-green-400">Muito Bom</small>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-900/30 text-center">
              <div className="text-gray-900 dark:text-gray-100 mb-1">10</div>
              <small className="text-blue-700 dark:text-blue-400">Supera</small>
            </div>
          </div>
        </div>

        {/* Critérios de Avaliação */}
        <div className="space-y-3">
          <h3 className="text-gray-900 dark:text-white">Critérios de Avaliação</h3>
          
          {criteriosColaborador.map((criterio, index) => (
            <div key={index} className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl p-4">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 dark:text-purple-400 leading-none">{index + 1}</span>
                    </div>
                    <h4 className="text-gray-900 dark:text-white">{criterio.label}</h4>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 ml-10">
                    {criterio.desc}
                  </p>
                </div>
                <div className="sm:w-24 flex-shrink-0">
                  <label className="text-gray-900 dark:text-white mb-2 block text-center">Nota</label>
                  <FormInput
                    type="number"
                    min="1"
                    max="10"
                    value={
                      avaliacaoData[
                        criterio.campo as keyof typeof avaliacaoData
                      ] || ""
                    }
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value >= 0 && value <= 10) {
                        setAvaliacaoData({
                          ...avaliacaoData,
                          [criterio.campo]: value,
                        });
                      }
                    }}
                    onKeyDown={(e) => {
                      if (
                        e.key === "+" ||
                        e.key === "-" ||
                        e.key === "e" ||
                        e.key === "E"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className="text-center"
                    placeholder="1-10"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Feedback */}
        <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <h3 className="text-gray-900 dark:text-white mb-2">Feedback de Desenvolvimento</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Escolha pelo menos duas competências com a nota mais baixa e liste quais ações de desenvolvimento devem ser tomadas
          </p>
          <FormTextarea
            value={avaliacaoData.feedback}
            onChange={(e) =>
              setAvaliacaoData({
                ...avaliacaoData,
                feedback: e.target.value,
              })
            }
            placeholder="Digite seu feedback detalhado aqui..."
            rows={6}
          />
        </div>

        {/* Botão */}
        <div className="flex justify-end">
          <PrimaryButton
            onClick={handleEnviarAvaliacao}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Send className="w-4 h-4 mr-2" />
            Enviar Avaliação
          </PrimaryButton>
        </div>
      </div>
    );
  };

  // Renderização principal
  return (
    <div className="min-h-screen">
      {currentPage === "lista" && renderLista()}
      {currentPage === "perfil" && renderPerfil()}
      {currentPage === "adicionar-aviso" && renderAdicionarAviso()}
      {currentPage === "avaliar" && renderAvaliar()}
    </div>
  );
}
