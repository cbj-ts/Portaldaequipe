/**
 * ============================================================================
 * GUIA DE PRODUTOS - Informações Detalhadas
 * ============================================================================
 * 
 * FUNCIONALIDADES:
 * - Catálogo completo de produtos e serviços
 * - Informações detalhadas de cada produto
 * - Planos, preços e benefícios
 * - Comparativo entre planos
 * - Material de apoio para vendas
 * 
 * ============================================================================
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PackageSearch, 
  Star, 
  Check, 
  X, 
  TrendingUp, 
  Users, 
  Crown,
  Rocket,
  Shield,
  Zap,
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import { PageHeader } from './common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

interface Produto {
  id: string;
  nome: string;
  categoria: 'planos' | 'cursos' | 'ferramentas' | 'servicos';
  descricao: string;
  preco?: string;
  beneficios: string[];
  destaques?: string[];
  publico: string;
  icone: React.ReactNode;
  cor: string;
}

interface Comparativo {
  recurso: string;
  leads: boolean | string;
  aldeia: boolean | string;
  tribo: boolean | string;
}

export function GuiaProdutosPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('planos');

  const produtos: Produto[] = [
    // PLANOS
    {
      id: 'leads',
      nome: 'Leads (Gratuito)',
      categoria: 'planos',
      descricao: 'Plano de entrada gratuito para conhecer a TradeStars e começar a jornada no trading',
      preco: 'R$ 0,00/mês',
      beneficios: [
        'Acesso à comunidade básica',
        'Conteúdos introdutórios gratuitos',
        'Webinars quinzenais',
        'Suporte via chat (horário comercial)',
        'Materiais educativos básicos'
      ],
      destaques: ['Ideal para iniciantes', 'Sem compromisso', 'Acesso imediato'],
      publico: 'Pessoas interessadas em começar no trading sem investimento inicial',
      icone: <Users className="w-6 h-6" />,
      cor: '#6b7280'
    },
    {
      id: 'aldeia',
      nome: 'Aldeia',
      categoria: 'planos',
      descricao: 'Plano intermediário com acesso completo aos cursos e suporte ampliado',
      preco: 'R$ 497,00/mês',
      beneficios: [
        'Todos os benefícios do Leads',
        'Acesso completo a todos os cursos',
        'Grupo de estudos exclusivo',
        'Análises de mercado semanais',
        'Suporte prioritário 24/7',
        'Material didático avançado',
        'Certificados de conclusão'
      ],
      destaques: ['Mais popular', 'Melhor custo-benefício', 'Suporte 24/7'],
      publico: 'Traders que querem se aprofundar e ter acesso completo ao conteúdo',
      icone: <TrendingUp className="w-6 h-6" />,
      cor: '#000aff'
    },
    {
      id: 'tribo',
      nome: 'Tribo',
      categoria: 'planos',
      descricao: 'Plano premium com mentorias personalizadas e acesso VIP',
      preco: 'R$ 997,00/mês',
      beneficios: [
        'Todos os benefícios da Aldeia',
        'Mentorias 1:1 semanais',
        'Sala de análise ao vivo diária',
        'Sinais de trading em tempo real',
        'Robôs de trading automatizados',
        'Grupo VIP exclusivo',
        'Suporte prioritário com WhatsApp direto',
        'Relatórios personalizados de performance'
      ],
      destaques: ['VIP', 'Mentorias 1:1', 'Resultados acelerados'],
      publico: 'Traders sérios que buscam resultados profissionais e acompanhamento próximo',
      icone: <Crown className="w-6 h-6" />,
      cor: '#ac2aff'
    },

    // CURSOS
    {
      id: 'fundamentos',
      nome: 'Fundamentos do Trading',
      categoria: 'cursos',
      descricao: 'Curso completo para iniciantes aprenderem os conceitos básicos do mercado financeiro',
      beneficios: [
        '20 módulos com vídeo-aulas',
        'Introdução ao mercado financeiro',
        'Análise técnica e fundamentalista',
        'Gestão de risco básica',
        'Psicologia do trader',
        'Exercícios práticos',
        'Certificado de conclusão'
      ],
      publico: 'Iniciantes sem experiência prévia',
      icone: <Rocket className="w-6 h-6" />,
      cor: '#000aff'
    },
    {
      id: 'avancado',
      nome: 'Estratégias Avançadas',
      categoria: 'cursos',
      descricao: 'Curso avançado com estratégias profissionais e técnicas de trading de alta performance',
      beneficios: [
        '15 módulos avançados',
        'Estratégias de scalping e day trade',
        'Automação de trading',
        'Análise de fluxo de ordens',
        'Gestão de risco avançada',
        'Backtesting de estratégias',
        'Casos reais e estudos de caso'
      ],
      publico: 'Traders com experiência que buscam se profissionalizar',
      icone: <Zap className="w-6 h-6" />,
      cor: '#ac2aff'
    },

    // FERRAMENTAS
    {
      id: 'robo',
      nome: 'Robô de Trading',
      categoria: 'ferramentas',
      descricao: 'Sistema automatizado de trading com estratégias pré-programadas',
      beneficios: [
        'Trading 24/7 automatizado',
        'Estratégias testadas e validadas',
        'Configuração personalizada',
        'Relatórios de performance',
        'Atualizações constantes',
        'Suporte técnico incluído'
      ],
      publico: 'Traders que querem automatizar operações',
      icone: <Shield className="w-6 h-6" />,
      cor: '#ff00ed'
    },

    // SERVIÇOS
    {
      id: 'mentoria',
      nome: 'Mentoria Personalizada',
      categoria: 'servicos',
      descricao: 'Acompanhamento individual com trader profissional',
      preco: 'Incluso no plano Tribo',
      beneficios: [
        'Sessões semanais de 1 hora',
        'Análise de operações realizadas',
        'Plano de desenvolvimento individual',
        'Acompanhamento de metas',
        'Suporte via WhatsApp',
        'Acesso ao trader mentor'
      ],
      publico: 'Traders que buscam evolução acelerada',
      icone: <Star className="w-6 h-6" />,
      cor: '#000aff'
    }
  ];

  const comparativo: Comparativo[] = [
    { recurso: 'Acesso à comunidade', leads: true, aldeia: true, tribo: true },
    { recurso: 'Webinars', leads: 'Quinzenal', aldeia: 'Semanal', tribo: 'Semanal + VIP' },
    { recurso: 'Cursos completos', leads: false, aldeia: true, tribo: true },
    { recurso: 'Análises de mercado', leads: false, aldeia: 'Semanal', tribo: 'Diária' },
    { recurso: 'Suporte', leads: 'Chat (horário comercial)', aldeia: '24/7', tribo: 'Prioritário + WhatsApp' },
    { recurso: 'Mentorias 1:1', leads: false, aldeia: false, tribo: 'Semanal' },
    { recurso: 'Sala ao vivo', leads: false, aldeia: false, tribo: 'Diária' },
    { recurso: 'Sinais de trading', leads: false, aldeia: false, tribo: true },
    { recurso: 'Robôs automatizados', leads: false, aldeia: false, tribo: true },
    { recurso: 'Certificados', leads: false, aldeia: true, tribo: true }
  ];

  const filteredProdutos = produtos.filter(p => p.categoria === activeTab);

  const renderComparativoValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto" />
      ) : (
        <X className="w-5 h-5 text-gray-300 dark:text-gray-700 mx-auto" />
      );
    }
    return <span className="text-gray-900 dark:text-white">{value}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Guia de Produtos"
        description="Informações completas sobre todos os produtos e serviços da TradeStars"
        onBack={() => navigate('/ferramentas')}
        icon={<PackageSearch className="w-5 h-5 text-[#000aff]" />}
      />

      {/* Tabs de Categoria */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <PackageSearch className="w-5 h-5 text-[#000aff]" />
            <h3 className="text-gray-900 dark:text-white">Selecione a Categoria</h3>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-2">
              <TabsTrigger value="planos">Planos</TabsTrigger>
              <TabsTrigger value="cursos">Cursos</TabsTrigger>
              <TabsTrigger value="ferramentas">Ferramentas</TabsTrigger>
              <TabsTrigger value="servicos">Serviços</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Grid de Produtos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProdutos.map((produto) => (
          <Card
            key={produto.id}
            className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:shadow-xl transition-shadow"
          >
            <CardHeader>
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: produto.cor }}
                >
                  {produto.icone}
                </div>
                {produto.destaques && produto.destaques.length > 0 && (
                  <Badge className="bg-[#ff00ed] text-white">
                    {produto.destaques[0]}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-gray-900 dark:text-white">
                {produto.nome}
              </CardTitle>
              {produto.preco && (
                <p className="text-gray-900 dark:text-white mt-2">
                  <strong>{produto.preco}</strong>
                </p>
              )}
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {produto.descricao}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Benefícios */}
              <div>
                <h4 className="text-gray-900 dark:text-white mb-3">Benefícios:</h4>
                <ul className="space-y-2">
                  {produto.beneficios.map((beneficio, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                      <small className="text-gray-700 dark:text-gray-300">{beneficio}</small>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Público Alvo */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <h4 className="text-gray-900 dark:text-white mb-2">Público-alvo:</h4>
                <small className="text-gray-600 dark:text-gray-400">{produto.publico}</small>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparativo de Planos */}
      {activeTab === 'planos' && (
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-[#000aff]" />
              Comparativo de Planos
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              Veja todas as diferenças entre os planos lado a lado
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    <th className="text-left p-4 text-gray-900 dark:text-white">Recurso</th>
                    <th className="text-center p-4 text-gray-600 dark:text-gray-400">Leads</th>
                    <th className="text-center p-4 text-[#000aff]">Aldeia</th>
                    <th className="text-center p-4 text-[#ac2aff]">Tribo</th>
                  </tr>
                </thead>
                <tbody>
                  {comparativo.map((item, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="p-4">
                        <p className="text-gray-900 dark:text-white">{item.recurso}</p>
                      </td>
                      <td className="p-4 text-center">
                        {renderComparativoValue(item.leads)}
                      </td>
                      <td className="p-4 text-center">
                        {renderComparativoValue(item.aldeia)}
                      </td>
                      <td className="p-4 text-center">
                        {renderComparativoValue(item.tribo)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Material de Apoio */}
      <Card className="bg-gradient-to-br from-[#000aff]/5 to-[#ac2aff]/5 dark:from-[#000aff]/10 dark:to-[#ac2aff]/10 border-[#000aff]/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#000aff] rounded-lg flex items-center justify-center flex-shrink-0">
              <PackageSearch className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-gray-900 dark:text-white mb-2">
                Material de Apoio para Vendas
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Precisa de mais informações sobre os produtos? Acesse nossa biblioteca de materiais ou fale com o time comercial.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => navigate('/recursos')}
                  className="bg-[#000aff] hover:bg-[#0008cc] gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Ver Recursos
                </Button>
                <Button
                  onClick={() => navigate('/time')}
                  variant="outline"
                  className="gap-2"
                >
                  <Users className="w-4 h-4" />
                  Falar com Comercial
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
