/**
 * ============================================================================
 * NEWSLETTER - Newsletter Interna da TradeStars
 * ============================================================================
 * 
 * Central de newsletters e comunicados internos da empresa.
 * 
 * FUNCIONALIDADES:
 * - Visualização de newsletters recentes
 * - Arquivo de edições anteriores
 * - Assinatura de categorias de interesse
 * 
 * ============================================================================
 */

import { Mail, Calendar, Tag, Search, Filter, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

interface Newsletter {
  id: number;
  titulo: string;
  descricao: string;
  data: string;
  categoria: string;
  destaque?: boolean;
}

export function NewsletterPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Verifica se usuário pode adicionar newsletter (RH ou Comunicação)
  const podeAdicionar = user?.setor === 'RH' || user?.setor === 'Comunicação';

  // Dados de exemplo
  const newsletters: Newsletter[] = [
    {
      id: 1,
      titulo: 'Novidades da Semana - Dezembro 2024',
      descricao: 'Confira as principais atualizações, conquistas da equipe e próximos eventos.',
      data: '15/12/2024',
      categoria: 'Geral',
      destaque: true
    },
    {
      id: 2,
      titulo: 'Resultados do Mês - Novembro',
      descricao: 'Análise dos principais indicadores e metas alcançadas no mês de novembro.',
      data: '01/12/2024',
      categoria: 'Resultados'
    },
    {
      id: 3,
      titulo: 'Treinamentos e Desenvolvimento',
      descricao: 'Novos cursos disponíveis e cronograma de capacitações para o próximo trimestre.',
      data: '20/11/2024',
      categoria: 'Desenvolvimento'
    },
    {
      id: 4,
      titulo: 'Comunicados RH - Benefícios 2025',
      descricao: 'Informações sobre o pacote de benefícios e novidades para o próximo ano.',
      data: '10/11/2024',
      categoria: 'RH'
    }
  ];

  const categorias = ['Todos', 'Geral', 'Resultados', 'Desenvolvimento', 'RH', 'Eventos'];

  const filteredNewsletters = newsletters.filter(newsletter => {
    const matchesSearch = newsletter.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         newsletter.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || newsletter.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4 sm:space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 rounded-xl bg-[#000aff] flex-shrink-0">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-gray-900 dark:text-white">Newsletter</h1>
          </div>
          
          {/* Botão Adicionar - Apenas para RH e Comunicação */}
          {podeAdicionar && (
            <Button 
              onClick={() => navigate('/newsletter/add')}
              className="bg-[#000aff] hover:bg-[#000aff]/90 text-white w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Nova Newsletter</span>
              <span className="sm:hidden">Nova</span>
            </Button>
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Fique por dentro das novidades, comunicados e atualizações da TradeStars
        </p>
      </div>

      {/* Filtros */}
      <Card className="bg-white dark:bg-[#1d1d1d] border-gray-200 dark:border-gray-800">
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <Input
                placeholder="Buscar newsletters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 sm:pl-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
              />
            </div>

            {/* Categorias */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <small className="text-gray-500">Filtrar por categoria:</small>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {categorias.map((categoria) => (
                  <Button
                    key={categoria}
                    variant={selectedCategory === categoria ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(categoria)}
                    className={selectedCategory === categoria 
                      ? 'bg-[#000aff] hover:bg-[#000aff]/90 text-white h-8 text-xs sm:text-sm' 
                      : 'border-gray-200 dark:border-gray-800 h-8 text-xs sm:text-sm'
                    }
                  >
                    {categoria}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Newsletters */}
      <div className="space-y-3 sm:space-y-4">
        {filteredNewsletters.length === 0 ? (
          <Card className="bg-white dark:bg-[#1d1d1d] border-gray-200 dark:border-gray-800">
            <CardContent className="p-8 sm:p-12 text-center">
              <Mail className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-gray-900 dark:text-white mb-2">Nenhuma newsletter encontrada</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tente ajustar os filtros de busca
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNewsletters.map((newsletter) => (
            <Card 
              key={newsletter.id} 
              className={`bg-white dark:bg-[#1d1d1d] border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all cursor-pointer ${
                newsletter.destaque ? 'border-l-4 border-l-[#000aff]' : ''
              }`}
              onClick={() => navigate(`/newsletter/${newsletter.id}`)}
            >
              <CardHeader className="pb-2 sm:pb-3 p-4 sm:p-6">
                <div className="flex items-start justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {newsletter.destaque && (
                        <Badge className="bg-[#000aff] hover:bg-[#000aff]/90 text-white text-xs">
                          Destaque
                        </Badge>
                      )}
                      <Badge variant="outline" className="border-gray-200 dark:border-gray-800 text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {newsletter.categoria}
                      </Badge>
                    </div>
                    <h3 className="text-gray-900 dark:text-white mb-2">
                      {newsletter.titulo}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2 sm:line-clamp-none">
                      {newsletter.descricao}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <small>{newsletter.data}</small>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-[#000aff] hover:text-[#000aff]/80 hover:bg-[#000aff]/10 w-full sm:w-auto justify-center sm:justify-start"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/newsletter/${newsletter.id}`);
                    }}
                  >
                    Ler mais →
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Info Card */}
      <Card className="bg-gradient-to-br from-[#000aff]/10 to-[#ac2aff]/10 dark:from-[#000aff]/20 dark:to-[#ac2aff]/20 border-[#000aff]/20">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="p-2 rounded-lg bg-[#000aff]/10 flex-shrink-0">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#000aff]" />
            </div>
            <div className="min-w-0">
              <h4 className="text-gray-900 dark:text-white mb-1">
                Receba novidades por e-mail
              </h4>
              <small className="text-gray-600 dark:text-gray-400">
                Configure suas preferências de notificação para receber as newsletters diretamente no seu e-mail corporativo
              </small>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
