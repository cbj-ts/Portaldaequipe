/**
 * ============================================================================
 * CHAMADOS - Seleção de Departamento
 * ============================================================================
 * 
 * ESTRUTURA:
 * 1. Header (h1 + descrição)
 * 2. Lista de departamentos clicáveis
 * 3. Navegação condicional para página específica
 * 4. Botão "Métricas" que abre modal com dashboard do setor
 * 
 * DEPARTAMENTOS DISPONÍVEIS:
 * - Financeiro: Despesas, orçamentos, reembolsos (Magenta)
 * - TEI: Suporte técnico, equipamentos (Azul)
 * - RH: Documentos, benefícios (Roxo)
 * 
 * FLUXO:
 * 1. Usuário seleciona departamento
 * 2. Navega para página específica (Financeiro/TEI/RH)
 * 3. Botão "Métricas" abre modal com dashboard do setor
 * 4. Botão voltar retorna para seleção
 * 
 * CORES OFICIAIS TRADESTARS:
 * - #ff00ed (Magenta) - Financeiro
 * - #000aff (Azul) - TEI
 * - #ac2aff (Roxo) - RH
 * 
 * ============================================================================
 */

import { useState } from 'react';
import { Card } from './ui/card';
import { DollarSign, Monitor, Users } from 'lucide-react';
import { ChamadosFinanceiroPage } from './ChamadosFinanceiroPage';
import { ChamadosTEIPage } from './ChamadosTEIPage';
import { ChamadosRHPage } from './ChamadosRHPage';
import { DashboardTEI } from './dashboards/DashboardTEI';
import { DashboardRH } from './dashboards/DashboardRH';
import { DashboardFinanceiro } from './dashboards/DashboardFinanceiro';
import { PageHeader } from './common';

type DepartmentType = 'financeiro' | 'tei' | 'rh' | null;

export function ChamadosPage() {
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentType>(null);
  const [showMetrics, setShowMetrics] = useState(false);

  const departments = [
    {
      id: 'financeiro' as DepartmentType,
      nome: 'Financeiro',
      descricao: 'Solicitações de despesas, orçamentos e reembolsos',
      icon: DollarSign,
      cor: '#ff00ed',
    },
    {
      id: 'tei' as DepartmentType,
      nome: 'Time de Experiência e Inovação',
      descricao: 'Suporte técnico, equipamentos e sistemas',
      icon: Monitor,
      cor: '#000aff',
    },
    {
      id: 'rh' as DepartmentType,
      nome: 'RH',
      descricao: 'Documentos, benefícios e solicitações de RH',
      icon: Users,
      cor: '#ac2aff',
    },
  ];

  // Se estiver visualizando métricas, mostrar dashboard em tela inteira
  if (showMetrics) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Métricas"
          description={
            selectedDepartment === 'tei' ? 'Dashboard TEI' :
            selectedDepartment === 'rh' ? 'Dashboard RH' :
            selectedDepartment === 'financeiro' ? 'Dashboard Financeiro' :
            'Dashboard'
          }
          onBack={() => setShowMetrics(false)}
        />
        {selectedDepartment === 'tei' && <DashboardTEI />}
        {selectedDepartment === 'rh' && <DashboardRH />}
        {selectedDepartment === 'financeiro' && <DashboardFinanceiro />}
      </div>
    );
  }

  // Renderizar páginas de chamados específicas
  if (selectedDepartment === 'financeiro') {
    return (
      <ChamadosFinanceiroPage 
        onBack={() => setSelectedDepartment(null)}
        onShowMetrics={() => setShowMetrics(true)}
      />
    );
  }

  if (selectedDepartment === 'tei') {
    return (
      <ChamadosTEIPage 
        onBack={() => setSelectedDepartment(null)}
        onShowMetrics={() => setShowMetrics(true)}
      />
    );
  }

  if (selectedDepartment === 'rh') {
    return (
      <ChamadosRHPage 
        onBack={() => setSelectedDepartment(null)}
        onShowMetrics={() => setShowMetrics(true)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 dark:text-white mb-2">Chamados</h1>
        <p className="text-gray-600 dark:text-gray-400">Selecione o departamento para abrir um chamado</p>
      </div>

      {/* Department List */}
      <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        {departments.map((dept, index) => {
          const Icon = dept.icon;
          return (
            <div key={dept.id}>
              <button
                onClick={() => setSelectedDepartment(dept.id)}
                className="w-full text-left px-6 py-5 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-900 flex items-center gap-4 group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${dept.cor}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: dept.cor }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 dark:text-white mb-1">{dept.nome}</h3>
                  <small className="text-gray-600 dark:text-gray-400">{dept.descricao}</small>
                </div>
                <div 
                  className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 group-hover:translate-x-1"
                  style={{ 
                    backgroundColor: `${dept.cor}15`,
                  }}
                >
                  <svg 
                    className="w-5 h-5 transition-transform duration-300" 
                    style={{ color: dept.cor }}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
              {index < departments.length - 1 && (
                <div className="h-px bg-gray-200 dark:bg-gray-800"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
