/**
 * ============================================================================
 * AVALIAÇÃO DE DESEMPENHO - Seleção de Tipo
 * ============================================================================
 * 
 * ESTRUTURA:
 * 1. Tela inicial com opções de avaliação
 * 2. Sistema completo de avaliação por tipo
 * 
 * TIPOS DE AVALIAÇÃO:
 * - Avaliar Líder: Avaliação específica do seu líder direto
 * - Avaliar Colaborador: Avaliação de colegas e equipe
 * - Minhas Avaliações: Ver avaliações recebidas
 * 
 * CORES OFICIAIS TRADESTARS:
 * - #000aff (Azul) - Avaliar Líder
 * - #ac2aff (Roxo) - Avaliar Colaborador
 * - #ff00ed (Magenta) - Minhas Avaliações
 * 
 * ============================================================================
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Users, FileText, ArrowLeft, ChevronRight, History } from 'lucide-react';
import { AvaliacaoLiderPage } from './AvaliacaoLiderPage';
import { AvaliacaoColaboradorPage } from './AvaliacaoColaboradorPage';
import { BackButton } from './common/BackButton';

type AvaliacaoType = 'lider' | 'colaborador' | 'minhas' | null;

export function AvaliacaoPage() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<AvaliacaoType>(null);

  const avaliacaoTypes = [
    {
      id: 'lider' as AvaliacaoType,
      nome: 'Avaliar Líder',
      descricao: 'Avalie o desempenho e liderança do seu líder direto',
      icon: UserCheck,
      corIcone: 'text-blue-600 dark:text-blue-400',
      corBg: 'bg-blue-50 dark:bg-blue-950/20',
    },
    {
      id: 'colaborador' as AvaliacaoType,
      nome: 'Avaliar Colaborador',
      descricao: 'Avalie colegas de equipe e colaboradores',
      icon: Users,
      corIcone: 'text-purple-600 dark:text-purple-400',
      corBg: 'bg-purple-50 dark:bg-purple-950/20',
    },
    {
      id: 'minhas' as AvaliacaoType,
      nome: 'Minhas Avaliações',
      descricao: 'Visualize suas avaliações recebidas e histórico',
      icon: FileText,
      corIcone: 'text-pink-600 dark:text-pink-400',
      corBg: 'bg-pink-50 dark:bg-pink-950/20',
    },
  ];

  if (selectedType === 'lider') {
    return <AvaliacaoLiderPage onBack={() => setSelectedType(null)} />;
  }

  if (selectedType === 'colaborador') {
    return <AvaliacaoColaboradorPage onBack={() => setSelectedType(null)} />;
  }

  if (selectedType === 'minhas') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <BackButton onClick={() => setSelectedType(null)} />
          <div>
            <h1 className="text-gray-900 dark:text-white">Minhas Avaliações</h1>
            <p className="text-gray-600 dark:text-gray-400">Visualize suas avaliações recebidas</p>
          </div>
        </div>

        <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl p-8 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
              <FileText className="w-8 h-8 text-gray-400 dark:text-gray-600" />
            </div>
            <div>
              <h3 className="text-gray-900 dark:text-white mb-2">Em Desenvolvimento</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Esta funcionalidade estará disponível em breve
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-900 dark:text-white mb-2">Avaliação de Desempenho</h1>
          <p className="text-gray-600 dark:text-gray-400">Selecione o tipo de avaliação que deseja realizar</p>
        </div>
        
        <button
          onClick={() => navigate('/avaliacao/logs')}
          className="h-10 px-4 rounded-xl bg-[#000aff] text-white hover:bg-[#0008dd] transition-colors flex items-center gap-2"
        >
          <History className="w-5 h-5" />
          <span className="hidden sm:inline">Ver Logs</span>
        </button>
      </div>

      {/* Lista de Tipos de Avaliação */}
      <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        {avaliacaoTypes.map((type, index) => {
          const Icon = type.icon;
          return (
            <div key={type.id}>
              <button
                onClick={() => setSelectedType(type.id)}
                className="w-full text-left px-6 py-5 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-900 flex items-center gap-4 group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${type.corBg}`}>
                  <Icon className={`w-6 h-6 ${type.corIcone}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 dark:text-white mb-1">{type.nome}</h3>
                  <small className="text-gray-600 dark:text-gray-400">{type.descricao}</small>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-600 flex-shrink-0 transition-transform group-hover:translate-x-1" />
              </button>
              {index < avaliacaoTypes.length - 1 && (
                <div className="h-px bg-gray-200 dark:bg-gray-800"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
