/**
 * ============================================================================
 * PÁGINA DE FERRAMENTAS ÚTEIS - Time de Atendimento
 * ============================================================================
 * 
 * FUNCIONALIDADES:
 * - Cards de acesso rápido a ferramentas essenciais organizadas por categoria
 * - Links para guias, copys, checklists e eventos
 * - Layout responsivo com seções categorizadas
 * - Ícones personalizados por ferramenta
 * - Visual clean e hierárquico
 * 
 * ============================================================================
 */

import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { 
  TrendingUp, 
  Calendar, 
  CheckCircle, 
  MessageSquare,
  FileText,
  PackageSearch,
  ExternalLink,
  ArrowRight,
  Calculator,
  BookOpen,
  Wrench
} from 'lucide-react';

interface Ferramenta {
  id: string;
  titulo: string;
  descricao: string;
  icone: React.ComponentType<{ className?: string }>;
  link: string;
  cor: string;
  categoria: 'guia' | 'recurso' | 'ferramenta' | 'comunicacao';
}

export function FerramentasPage() {
  const navigate = useNavigate();
  
  const ferramentas: Ferramenta[] = [
    {
      id: '1',
      titulo: 'Calculadora de Gestão',
      descricao: 'Ferramenta para cálculo de gestão financeira e projeções de trading',
      icone: TrendingUp,
      link: '/calculadora-gestao',
      cor: '#000aff',
      categoria: 'ferramenta'
    },
    {
      id: '2',
      titulo: 'Calculadora de Investimento',
      descricao: 'Calcule seus investimentos com juros compostos e visualize projeções',
      icone: TrendingUp,
      link: '/calculadora-investimento',
      cor: '#000aff',
      categoria: 'ferramenta'
    },
    {
      id: '3',
      titulo: 'Calculadora de Lote',
      descricao: 'Calcule o lote ideal para suas operações baseado em loss e pontuação',
      icone: TrendingUp,
      link: '/calculadora-lote',
      cor: '#000aff',
      categoria: 'ferramenta'
    },
    {
      id: '4',
      titulo: 'Checklist do Atendimento',
      descricao: 'Sistema completo de checklist para acompanhamento estratégico de alunos',
      icone: CheckCircle,
      link: '/checklist-atendimento',
      cor: '#000aff',
      categoria: 'guia'
    },
    {
      id: '5',
      titulo: 'Copys',
      descricao: 'Modelos de mensagens prontas organizadas por perfil (Leads, Aldeia, Tribo)',
      icone: MessageSquare,
      link: '/copys',
      cor: '#000aff',
      categoria: 'recurso'
    },
    {
      id: '6',
      titulo: 'Eventos',
      descricao: 'Calendário de eventos, webinars e treinamentos para o time',
      icone: Calendar,
      link: '/eventos',
      cor: '#000aff',
      categoria: 'comunicacao'
    },
    {
      id: '7',
      titulo: 'Guia de Produtos',
      descricao: 'Informações detalhadas sobre todos os produtos e serviços oferecidos',
      icone: PackageSearch,
      link: '/guia-produtos',
      cor: '#000aff',
      categoria: 'guia'
    },
    {
      id: '8',
      titulo: 'Guia do Histórico de Transações',
      descricao: 'Aprenda a consultar e interpretar o histórico completo de transações dos clientes',
      icone: FileText,
      link: '/guia-historico-transacoes',
      cor: '#000aff',
      categoria: 'guia'
    }
  ];

  const getCategoriaLabel = (categoria: string) => {
    const labels = {
      'guia': 'Guia',
      'recurso': 'Recurso',
      'ferramenta': 'Ferramenta',
      'comunicacao': 'Comunicação'
    };
    return labels[categoria as keyof typeof labels] || categoria;
  };

  // Organizar ferramentas por categoria
  const calculadoras = ferramentas.filter(f => f.categoria === 'ferramenta');
  const guias = ferramentas.filter(f => f.categoria === 'guia');
  const recursos = ferramentas.filter(f => f.categoria === 'recurso' || f.categoria === 'comunicacao');

  const renderFerramentaCard = (ferramenta: Ferramenta) => {
    const Icon = ferramenta.icone;
    
    return (
      <Card
        key={ferramenta.id}
        className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300 overflow-hidden group"
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
              style={{ backgroundColor: `${ferramenta.cor}15` }}
            >
              <Icon 
                className="w-6 h-6" 
                style={{ color: ferramenta.cor }}
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-gray-900 dark:text-white mb-1">
                {ferramenta.titulo}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                <small>{ferramenta.descricao}</small>
              </p>
              
              {ferramenta.link.startsWith('/') ? (
                <Button
                  onClick={() => navigate(ferramenta.link)}
                  className="rounded-lg transition-all duration-300 h-10"
                  style={{
                    backgroundColor: ferramenta.cor,
                    color: 'white',
                  }}
                  onMouseEnter={(e) => {
                    const target = e.currentTarget;
                    target.style.transform = 'scale(1.02)';
                    target.style.boxShadow = `0 4px 12px ${ferramenta.cor}40`;
                  }}
                  onMouseLeave={(e) => {
                    const target = e.currentTarget;
                    target.style.transform = 'scale(1)';
                    target.style.boxShadow = '';
                  }}
                >
                  Acessar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <a
                  href={ferramenta.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    className="rounded-lg transition-all duration-300 h-10"
                    style={{
                      backgroundColor: ferramenta.cor,
                      color: 'white',
                    }}
                    onMouseEnter={(e) => {
                      const target = e.currentTarget;
                      target.style.transform = 'scale(1.02)';
                      target.style.boxShadow = `0 4px 12px ${ferramenta.cor}40`;
                    }}
                    onMouseLeave={(e) => {
                      const target = e.currentTarget;
                      target.style.transform = 'scale(1)';
                      target.style.boxShadow = '';
                    }}
                  >
                    Acessar
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 dark:text-white mb-2">Ferramentas Úteis</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Acesso rápido às ferramentas essenciais para o time de atendimento
        </p>
      </div>

      {/* Seção: Calculadoras */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#000aff]/10 dark:bg-[#000aff]/20 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-[#000aff]" />
          </div>
          <div>
            <h2 className="text-gray-900 dark:text-white">Calculadoras</h2>
            <p className="text-gray-600 dark:text-gray-400">
              <small>Ferramentas de cálculo para gestão financeira e operações</small>
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {calculadoras.map(renderFerramentaCard)}
        </div>
      </div>

      {/* Seção: Guias */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#000aff]/10 dark:bg-[#000aff]/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-[#000aff]" />
          </div>
          <div>
            <h2 className="text-gray-900 dark:text-white">Guias</h2>
            <p className="text-gray-600 dark:text-gray-400">
              <small>Documentação e manuais de procedimentos</small>
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {guias.map(renderFerramentaCard)}
        </div>
      </div>

      {/* Seção: Recursos */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#000aff]/10 dark:bg-[#000aff]/20 flex items-center justify-center">
            <Wrench className="w-5 h-5 text-[#000aff]" />
          </div>
          <div>
            <h2 className="text-gray-900 dark:text-white">Recursos</h2>
            <p className="text-gray-600 dark:text-gray-400">
              <small>Materiais de apoio e comunicação</small>
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {recursos.map(renderFerramentaCard)}
        </div>
      </div>

      {/* Seção de Ajuda */}
      <Card className="bg-[#000aff]/5 dark:bg-[#000aff]/10 border-[#000aff]/20 dark:border-[#000aff]/30">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-gray-900 dark:text-white mb-2">
                Precisa de Ajuda?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Entre em contato com o time de suporte interno para tirar suas dúvidas
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="rounded-xl border-gray-200 dark:border-gray-800 h-10"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Suporte
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
