/**
 * ============================================================================
 * AVALIAÇÃO DE LÍDER - Sistema Completo
 * ============================================================================
 * 
 * Sistema de avaliação específico para avaliar líderes com:
 * - Lista de líderes disponíveis
 * - Formulário de avaliação com critérios de liderança
 * - Escala 1-10 com descrições
 * - Feedback detalhado
 * 
 * ============================================================================
 */

import { useState, useEffect } from 'react';
import { Send, UserCheck, ChevronRight } from 'lucide-react';
import { BackButton } from './common/BackButton';
import { FormInput } from './FormInput';
import { FormTextarea } from './FormTextarea';
import { PrimaryButton } from './PrimaryButton';
import { toast } from 'sonner@2.0.3';

interface Lider {
  id: string;
  nome: string;
  email: string;
  funcao: string;
  setor: string;
  islider: boolean;
}

interface AvaliacaoLiderPageProps {
  onBack: () => void;
}

type PageView = 'lista' | 'avaliar';

export function AvaliacaoLiderPage({ onBack }: AvaliacaoLiderPageProps) {
  const [currentPage, setCurrentPage] = useState<PageView>('lista');
  const [lideres, setLideres] = useState<Lider[]>([]);
  const [liderSelecionado, setLiderSelecionado] = useState<Lider | null>(null);
  const [avaliacaoData, setAvaliacaoData] = useState({
    item1: 0, item2: 0, item3: 0, item4: 0, item5: 0,
    item6: 0, item7: 0, item8: 0, item9: 0, item10: 0,
    feedback: ''
  });

  // Simular dados (em produção viria do Supabase)
  useEffect(() => {
    const mockLideres: Lider[] = [
      {
        id: '1',
        nome: 'João Silva',
        email: 'joao.silva@tradestars.com.br',
        funcao: 'Gerente de TEI',
        setor: 'TEI',
        islider: true
      },
      {
        id: '2',
        nome: 'Ana Costa',
        email: 'ana.costa@tradestars.com.br',
        funcao: 'Diretora de RH',
        setor: 'RH',
        islider: true
      },
      {
        id: '3',
        nome: 'Carlos Mendes',
        email: 'carlos.mendes@tradestars.com.br',
        funcao: 'Coordenador de BI',
        setor: 'BI',
        islider: true
      },
      {
        id: '4',
        nome: 'Mariana Souza',
        email: 'mariana.souza@tradestars.com.br',
        funcao: 'Líder de Projetos',
        setor: 'TEI',
        islider: true
      }
    ];
    setLideres(mockLideres);
  }, []);

  const criteriosLider = [
    { 
      label: 'Planejamento', 
      desc: 'Entrega seus trabalhos conforme prioridades e prazos estabelecidos. Garante a organização da área junto à equipe.', 
      campo: 'item1' 
    },
    { 
      label: 'Planejamento', 
      desc: 'Planeja as atividades, definindo: metas, cronograma, plano de ação e indicadores chaves. Toma as decisões com base em fatos e dados.', 
      campo: 'item2' 
    },
    { 
      label: 'Organização', 
      desc: 'Treina sua equipe nas normas e procedimentos, facilitando a integração de novos colaboradores, garantindo os padrões de qualidade da área.', 
      campo: 'item3' 
    },
    { 
      label: 'Organização', 
      desc: 'Aplica melhorias no setor, evitando desperdícios e facilitando os processos de trabalho.', 
      campo: 'item4' 
    },
    { 
      label: 'Liderança', 
      desc: 'Concede autonomia para equipe, delegando as atividades, dando suporte e garantindo a entrega dos trabalhos.', 
      campo: 'item5' 
    },
    { 
      label: 'Liderança', 
      desc: 'Desenvolve a equipe através de feedbacks. Motiva e inspira as pessoas em um clima positivo para atingir os resultados.', 
      campo: 'item6' 
    },
    { 
      label: 'Trabalho em equipe', 
      desc: 'Relaciona-se de maneira positiva com todos os superiores, pares e equipe. Age de forma colaborativa e estimula o trabalho em equipe entre todos.', 
      campo: 'item7' 
    },
    { 
      label: 'Trabalho em equipe', 
      desc: 'Transmite as informações orais e escritas de forma clara e objetiva, garantindo sua compreensão.', 
      campo: 'item8' 
    },
    { 
      label: 'Foco em resultado', 
      desc: 'É ciente das necessidades de seus clientes e atende sempre que possível, com iniciativa para superar as expectativas.', 
      campo: 'item9' 
    },
    { 
      label: 'Foco em resultado', 
      desc: 'Realiza encontros ou reuniões com a equipe, pares ou superiores para alinhar procedimentos, resolver problemas e atingir objetivos.', 
      campo: 'item10' 
    },
  ];

  const handleAvaliar = (lider: Lider) => {
    setLiderSelecionado(lider);
    setCurrentPage('avaliar');
    // Resetar formulário
    setAvaliacaoData({
      item1: 0, item2: 0, item3: 0, item4: 0, item5: 0,
      item6: 0, item7: 0, item8: 0, item9: 0, item10: 0,
      feedback: ''
    });
  };

  const handleEnviarAvaliacao = () => {
    // Validação
    const valores = [
      avaliacaoData.item1, avaliacaoData.item2, avaliacaoData.item3,
      avaliacaoData.item4, avaliacaoData.item5, avaliacaoData.item6,
      avaliacaoData.item7, avaliacaoData.item8, avaliacaoData.item9,
      avaliacaoData.item10
    ];

    if (valores.some(v => v < 1 || v > 10 || isNaN(v))) {
      toast.error('Por favor, preencha todas as notas com valores entre 1 e 10.');
      return;
    }

    if (!avaliacaoData.feedback.trim()) {
      toast.error('Por favor, preencha o feedback detalhado.');
      return;
    }

    // Em produção: enviar para Supabase
    console.log('Avaliação de líder enviada:', {
      lider: liderSelecionado,
      dados: avaliacaoData
    });

    toast.success('Avaliação enviada com sucesso!');
    setCurrentPage('lista');
  };

  // Renderização da lista
  const renderLista = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <BackButton onClick={onBack} />
        <div>
          <h1 className="text-gray-900 dark:text-white">Avaliar Líder</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Selecione um líder para avaliar
          </p>
        </div>
      </div>

      {/* Lista de Líderes */}
      <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        {lideres.map((lider, index) => (
          <div key={lider.id}>
            <button
              onClick={() => handleAvaliar(lider)}
              className="w-full text-left px-6 py-5 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-900 flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 bg-blue-50 dark:bg-blue-950/20">
                <UserCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-gray-900 dark:text-white mb-1">{lider.nome}</h3>
                <div className="flex items-center gap-3 flex-wrap">
                  <small className="text-gray-600 dark:text-gray-400">{lider.funcao}</small>
                  <span className="text-gray-300 dark:text-gray-700">•</span>
                  <small className="text-gray-600 dark:text-gray-400">{lider.setor}</small>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-600 flex-shrink-0 transition-transform group-hover:translate-x-1" />
            </button>
            {index < lideres.length - 1 && (
              <div className="h-px bg-gray-200 dark:bg-gray-800"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Renderização do formulário de avaliação
  const renderAvaliar = () => {
    if (!liderSelecionado) return null;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <BackButton onClick={() => setCurrentPage('lista')} />
          <div>
            <h1 className="text-gray-900 dark:text-white">Avaliar {liderSelecionado.nome}</h1>
            <p className="text-gray-600 dark:text-gray-400">{liderSelecionado.funcao} • {liderSelecionado.setor}</p>
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
          
          {criteriosLider.map((criterio, index) => (
            <div key={index} className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl p-4">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 dark:text-blue-400 leading-none">{index + 1}</span>
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
                    value={avaliacaoData[criterio.campo as keyof typeof avaliacaoData] || ''}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value >= 0 && value <= 10) {
                        setAvaliacaoData({
                          ...avaliacaoData,
                          [criterio.campo]: value
                        });
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === '+' || e.key === '-' || e.key === 'e' || e.key === 'E') {
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
            onChange={(e) => setAvaliacaoData({ ...avaliacaoData, feedback: e.target.value })}
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
      {currentPage === 'lista' && renderLista()}
      {currentPage === 'avaliar' && renderAvaliar()}
    </div>
  );
}
