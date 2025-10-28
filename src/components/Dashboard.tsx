/**
 * ============================================================================
 * DASHBOARD - Página Principal
 * ============================================================================
 * 
 * ESTRUTURA:
 * 1. Header (h1 + saudação personalizada)
 * 2. Grid 2 colunas (Left: Pendências e Cursos | Right: Atalhos e Eventos)
 * 3. Cards com hover effects e micro-animações
 * 
 * RESPONSIVIDADE:
 * - Mobile: Coluna única empilhada
 * - Desktop (lg): Grid 1/3 (sidebar) + 2/3 (conteúdo principal)
 * 
 * HIERARQUIA DE TÍTULOS:
 * - h1: "Olá, João Silva 👋" (30px automático)
 * - h3: CardTitles (20px automático via CardTitle)
 * - h4: Títulos de cursos (18px automático)
 * 
 * ============================================================================
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  AlertCircle, TrendingUp, CheckCircle, Clock, 
  ArrowRight, Target, Award, Calendar, BookOpen,
  Users, FileText, Zap, Star, TrendingDown, Mail, Tag
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const navigate = useNavigate();

  const alerts = [
    { id: 1, tipo: 'Chamado', descricao: 'Chamado #1234 - TEI aguardando resposta', prioridade: 'alta', icon: AlertCircle },
    { id: 2, tipo: 'Treinamento', descricao: 'Curso "Segurança da Informação" expira em 3 dias', prioridade: 'media', icon: BookOpen },
    { id: 3, tipo: 'Avaliação', descricao: 'Avaliação de Desempenho disponível', prioridade: 'baixa', icon: Target },
  ];

  const proximosEventos = [
    { titulo: 'Treinamento de Compliance', data: '16/10/2025', hora: '14:00' },
    { titulo: 'Reunião de Equipe', data: '17/10/2025', hora: '10:00' },
    { titulo: 'Live: Novidades do Produto', data: '18/10/2025', hora: '16:00' },
  ];

  const cursosRecentes = [
    { titulo: 'Segurança da Informação', progresso: 75 },
    { titulo: 'Excel Avançado', progresso: 30 },
  ];

  const atalhos = [
    { titulo: 'Abrir Chamado', icon: Zap, path: '/chamados', cor: 'blue' },
    { titulo: 'Ver Cursos', icon: BookOpen, path: '/cursos', cor: 'green' },
    { titulo: 'Meu Time', icon: Users, path: '/time', cor: 'purple' },
    { titulo: 'Recursos', icon: FileText, path: '/recursos', cor: 'orange' },
  ];

  const newslettersDestaque = [
    {
      id: 1,
      titulo: 'Novidades da Semana - Dezembro 2024',
      descricao: 'Confira as principais atualizações, conquistas da equipe e próximos eventos.',
      data: '15/12/2024',
      categoria: 'Geral'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-900 dark:text-white mb-2">Olá, João Silva 👋</h1>
          <p className="text-gray-600 dark:text-gray-400">Aqui está o resumo das suas atividades</p>
        </div>
        <div className="text-left sm:text-right">
          <small className="text-gray-500 dark:text-gray-400">Última atualização</small>
          <p className="text-gray-900 dark:text-white">Hoje, 15:30</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Alertas & Pendências */}
          <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black border-gray-200/50 dark:border-gray-800/50 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-900 dark:text-white">Pendências Importantes</CardTitle>
                  <CardDescription className="text-[11px] text-gray-600 dark:text-gray-400">
                    Requer sua atenção
                  </CardDescription>
                </div>
                <Badge className="bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400">
                  {alerts.length} pendente{alerts.length > 1 ? 's' : ''}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {alerts.map((alert) => {
                const Icon = alert.icon;
                return (
                  <div key={alert.id} className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border-l-4 transition-all duration-200 hover:scale-105 cursor-pointer ${
                    alert.prioridade === 'alta' 
                      ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20 hover:bg-red-50 dark:hover:bg-red-950/30' 
                      : alert.prioridade === 'media' 
                      ? 'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20 hover:bg-yellow-50 dark:hover:bg-yellow-950/30'
                      : 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/30'
                  }`}>
                    <div className={`p-2 rounded-lg flex-shrink-0 ${
                      alert.prioridade === 'alta' ? 'bg-red-100 dark:bg-red-900' :
                      alert.prioridade === 'media' ? 'bg-yellow-100 dark:bg-yellow-900' :
                      'bg-blue-100 dark:bg-blue-900'
                    }`}>
                      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        alert.prioridade === 'alta' ? 'text-red-600' :
                        alert.prioridade === 'media' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {alert.tipo}
                        </Badge>
                        {alert.prioridade === 'alta' && (
                          <Badge className="text-xs bg-red-500 text-white">Urgente</Badge>
                        )}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{alert.descricao}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Mobile: Atalhos Rápidos - Aparece ANTES de Meus Cursos */}
          <div className="lg:hidden">
            <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black border-gray-200/50 dark:border-gray-800/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Atalhos Rápidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {atalhos.map((atalho, index) => {
                    const Icon = atalho.icon;
                    const colors = ['#000aff', '#ac2aff', '#ff00ed', '#6b7280'];
                    return (
                      <button
                        key={index}
                        onClick={() => navigate(atalho.path)}
                        className="group relative overflow-hidden rounded-2xl p-4 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                        style={{
                          backgroundImage: 'none',
                        }}
                        onMouseEnter={(e) => {
                          const isDark = document.documentElement.classList.contains('dark');
                          if (isDark) {
                            e.currentTarget.style.background = `linear-gradient(135deg, ${colors[index]}15 0%, ${colors[index]}08 100%)`;
                          } else {
                            e.currentTarget.style.background = `linear-gradient(135deg, ${colors[index]}10 0%, ${colors[index]}05 100%)`;
                          }
                          e.currentTarget.style.borderColor = `${colors[index]}40`;
                        }}
                        onMouseLeave={(e) => {
                          const isDark = document.documentElement.classList.contains('dark');
                          e.currentTarget.style.background = '';
                          e.currentTarget.style.borderColor = '';
                        }}
                      >
                        <div className="relative z-10">
                          <div 
                            className="icon-wrapper inline-flex p-2.5 rounded-xl mb-3 bg-gray-100 dark:bg-gray-800 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                            style={{ 
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = `${colors[index]}20`;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '';
                            }}
                          >
                            <Icon 
                              className="w-6 h-6 text-gray-600 dark:text-gray-400 transition-colors duration-300"
                              style={{ transition: 'color 0.3s ease' }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = colors[index];
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = '';
                              }}
                            />
                          </div>
                          <p className="text-xs text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                            {atalho.titulo}
                          </p>
                        </div>
                        <div 
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                          style={{
                            background: `radial-gradient(circle at top right, ${colors[index]}08, transparent 70%)`
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cursos em Andamento */}
          <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black border-gray-200/50 dark:border-gray-800/50 shadow-lg">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-gray-900 dark:text-white">Meus Cursos</CardTitle>
                  <CardDescription className="text-[11px] text-gray-600 dark:text-gray-400">
                    Continue de onde parou
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/cursos')} className="text-blue-600 dark:text-blue-400 self-start sm:self-auto">
                  Ver todos
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {cursosRecentes.map((curso, index) => (
                <div key={index} className="p-3 sm:p-4 rounded-xl border border-gray-200/50 dark:border-gray-800/50 hover:bg-white dark:hover:bg-black hover:shadow-lg transition-all duration-200">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950 flex-shrink-0">
                        <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-[#000aff]" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-gray-900 dark:text-white truncate">{curso.titulo}</h4>
                        <small className="text-gray-500 dark:text-gray-400">{curso.progresso}% concluído</small>
                      </div>
                    </div>
                    <Button size="sm" className="bg-[#000aff] text-white hover:bg-[#000aff]/90 w-full sm:w-auto">
                      Continuar
                    </Button>
                  </div>
                  <Progress value={curso.progresso} className="h-2 [&>div]:bg-gray-800 dark:[&>div]:bg-gray-700" />
                </div>
              ))}
            </CardContent>
          </Card>

        </div>

        {/* Right Column - 1/3 width - Desktop only */}
        <div className="hidden lg:flex lg:flex-col space-y-6">
          
          {/* Desktop: Atalhos Rápidos */}
          <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black border-gray-200/50 dark:border-gray-800/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Atalhos Rápidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {atalhos.map((atalho, index) => {
                  const Icon = atalho.icon;
                  const colors = ['#000aff', '#ac2aff', '#ff00ed', '#6b7280'];
                  return (
                    <button
                      key={index}
                      onClick={() => navigate(atalho.path)}
                      className="group relative overflow-hidden rounded-2xl p-4 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                      style={{
                        backgroundImage: 'none',
                      }}
                      onMouseEnter={(e) => {
                        const isDark = document.documentElement.classList.contains('dark');
                        if (isDark) {
                          e.currentTarget.style.background = `linear-gradient(135deg, ${colors[index]}15 0%, ${colors[index]}08 100%)`;
                        } else {
                          e.currentTarget.style.background = `linear-gradient(135deg, ${colors[index]}10 0%, ${colors[index]}05 100%)`;
                        }
                        e.currentTarget.style.borderColor = `${colors[index]}40`;
                      }}
                      onMouseLeave={(e) => {
                        const isDark = document.documentElement.classList.contains('dark');
                        e.currentTarget.style.background = '';
                        e.currentTarget.style.borderColor = '';
                      }}
                    >
                      <div className="relative z-10">
                        <div 
                          className="icon-wrapper inline-flex p-2.5 rounded-xl mb-3 bg-gray-100 dark:bg-gray-800 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                          style={{ 
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = `${colors[index]}20`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '';
                          }}
                        >
                          <Icon 
                            className="w-6 h-6 text-gray-600 dark:text-gray-400 transition-colors duration-300"
                            style={{ transition: 'color 0.3s ease' }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = colors[index];
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = '';
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                          {atalho.titulo}
                        </p>
                      </div>
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                        style={{
                          background: `radial-gradient(circle at top right, ${colors[index]}08, transparent 70%)`
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Próximos Eventos */}
          <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black border-gray-200/50 dark:border-gray-800/50 shadow-lg flex-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-900 dark:text-white">Próximos Eventos</CardTitle>
                  <CardDescription className="text-[11px] text-gray-600 dark:text-gray-400">
                    Sua agenda esta semana
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/calendario')} className="text-blue-600 dark:text-blue-400">
                  <Calendar className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {proximosEventos.map((evento, index) => (
                <div key={index} className="flex gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-black transition-all">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 flex flex-col items-center justify-center">
                      <span className="text-xs text-blue-600">
                        {evento.data.split('/')[0]}
                      </span>
                      <span className="text-[10px] text-blue-500">Out</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-gray-900 dark:text-white truncate">{evento.titulo}</h4>
                    <small className="text-gray-500 dark:text-gray-400">{evento.hora}</small>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Newsletter Section - Full Width Below Main Grid - Desktop only */}
      <div className="hidden lg:block">
        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black border-gray-200/50 dark:border-gray-800/50 shadow-lg">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-gray-900 dark:text-white">Última Newsletter</CardTitle>
                <CardDescription className="text-[11px] text-gray-600 dark:text-gray-400">
                  Novidades e comunicados mais recentes
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/newsletter')} className="text-blue-600 dark:text-blue-400 self-start sm:self-auto">
                Ver todas
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {newslettersDestaque.map((newsletter) => (
              <div 
                key={newsletter.id}
                className="p-4 sm:p-6 rounded-xl border border-gray-200/50 dark:border-gray-800/50 hover:bg-white dark:hover:bg-black hover:shadow-lg transition-all duration-200 cursor-pointer"
                onClick={() => navigate('/newsletter')}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-950 flex-shrink-0">
                    <Mail className="w-6 h-6 text-[#ac2aff]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="border-gray-200 dark:border-gray-800">
                        <Tag className="w-3 h-3 mr-1" />
                        {newsletter.categoria}
                      </Badge>
                      <small className="text-gray-500 dark:text-gray-400">
                        {newsletter.data}
                      </small>
                    </div>
                    <h3 className="text-gray-900 dark:text-white mb-2">
                      {newsletter.titulo}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {newsletter.descricao}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-[#000aff] hover:text-[#000aff]/80 hover:bg-[#000aff]/10 flex-shrink-0"
                  >
                    Ler mais →
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Mobile: Newsletter Section */}
      <div className="lg:hidden">
        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black border-gray-200/50 dark:border-gray-800/50 shadow-lg">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-gray-900 dark:text-white">Última Newsletter</CardTitle>
                <CardDescription className="text-[11px] text-gray-600 dark:text-gray-400">
                  Novidades e comunicados mais recentes
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/newsletter')} className="text-blue-600 dark:text-blue-400 self-start sm:self-auto">
                Ver todas
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {newslettersDestaque.map((newsletter) => (
              <div 
                key={newsletter.id}
                className="p-3 sm:p-4 rounded-xl border border-gray-200/50 dark:border-gray-800/50 hover:bg-white dark:hover:bg-black hover:shadow-lg transition-all duration-200 cursor-pointer"
                onClick={() => navigate('/newsletter')}
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950 flex-shrink-0">
                    <Mail className="w-4 h-4 text-[#ac2aff]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Badge variant="outline" className="border-gray-200 dark:border-gray-800 mb-2">
                      <Tag className="w-3 h-3 mr-1" />
                      {newsletter.categoria}
                    </Badge>
                    <h4 className="text-gray-900 dark:text-white mb-1 leading-tight">
                      {newsletter.titulo}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                      {newsletter.descricao}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200/50 dark:border-gray-800/50">
                  <small className="text-gray-500 dark:text-gray-400">
                    {newsletter.data}
                  </small>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-[#000aff] hover:text-[#000aff]/80 hover:bg-[#000aff]/10 -mr-2"
                  >
                    Ler mais →
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Mobile: Próximos Eventos - Aparece no final */}
      <div className="lg:hidden">
        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black border-gray-200/50 dark:border-gray-800/50 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-gray-900 dark:text-white">Próximos Eventos</CardTitle>
                <CardDescription className="text-[11px] text-gray-600 dark:text-gray-400">
                  Sua agenda esta semana
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/calendario')} className="text-blue-600 dark:text-blue-400">
                <Calendar className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {proximosEventos.map((evento, index) => (
              <div key={index} className="flex gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-black transition-all">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 flex flex-col items-center justify-center">
                    <span className="text-xs text-blue-600">
                      {evento.data.split('/')[0]}
                    </span>
                    <span className="text-[10px] text-blue-500">Out</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-gray-900 dark:text-white truncate">{evento.titulo}</h4>
                  <small className="text-gray-500 dark:text-gray-400">{evento.hora}</small>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
