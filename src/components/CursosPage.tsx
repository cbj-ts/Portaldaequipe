/**
 * ============================================================================
 * PÁGINA DE CURSOS & TREINAMENTOS
 * ============================================================================
 * 
 * FUNCIONALIDADES:
 * - Listagem de cursos com filtro por setor
 * - Visualização completa de curso com player de vídeo
 * - Sistema de progresso por aula e curso
 * - Download de materiais complementares
 * - Certificados de conclusão
 * 
 * ============================================================================
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Clock, Award, PlayCircle, Users, Target, CheckCircle, Filter, ChevronDown, Plus } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  AstronautIcon, 
  RocketIcon, 
  TelescopeIcon, 
  CometIcon,
  StarburstIcon
} from './SpaceIcons';
import { CursoViewer } from './CursoViewer';
import { Curso, SetorType, ProgressoAula } from '../types/curso';

export function CursosPage() {
  const navigate = useNavigate();
  const [filtroSetor, setFiltroSetor] = useState<SetorType>('Todos');
  const [cursoSelecionado, setCursoSelecionado] = useState<Curso | null>(null);
  const [progressoUsuario, setProgressoUsuario] = useState<ProgressoAula[]>([
    // Mock: algumas aulas já concluídas
    { aula_id: '1-1', completado: true, progresso_segundos: 600, ultima_visualizacao: '2025-10-15T10:00:00Z' },
    { aula_id: '1-2', completado: true, progresso_segundos: 900, ultima_visualizacao: '2025-10-15T11:00:00Z' },
    { aula_id: '1-3', completado: false, progresso_segundos: 300, ultima_visualizacao: '2025-10-16T09:00:00Z' },
  ]);

  const setores = [
    { nome: 'Todos' as SetorType, icon: Filter, cor: 'gray' },
    { nome: 'Tecnologia' as SetorType, icon: RocketIcon, cor: 'blue' },
    { nome: 'RH' as SetorType, icon: AstronautIcon, cor: 'green' },
    { nome: 'BI' as SetorType, icon: TelescopeIcon, cor: 'yellow' },
    { nome: 'Experiência' as SetorType, icon: CometIcon, cor: 'orange' },
    { nome: 'Liderança' as SetorType, icon: StarburstIcon, cor: 'purple' },
    { nome: 'Financeiro' as SetorType, icon: Target, cor: 'indigo' },
  ];

  // Mock de cursos completos com módulos e aulas
  const cursos: Curso[] = [
    {
      id: '1',
      titulo: 'Segurança da Informação',
      descricao: 'Aprenda as melhores práticas de segurança e proteção de dados corporativos',
      categoria: 'Obrigatório',
      setor: 'Tecnologia',
      instrutor: {
        nome: 'Dr. Carlos Mendes',
        cargo: 'Especialista em Segurança',
        bio: 'Mais de 15 anos de experiência em cibersegurança'
      },
      thumbnail: 'https://images.unsplash.com/photo-1760199789455-49098afd02f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlciUyMHNlY3VyaXR5JTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjA1NTg1NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      duracao_total: 240,
      nivel: 'Básico',
      ativo: true,
      criado_em: '2025-01-01',
      modulos: [
        {
          id: 'mod-1',
          titulo: 'Introdução à Segurança',
          descricao: 'Conceitos fundamentais de segurança da informação',
          ordem: 1,
          aulas: [
            {
              id: '1-1',
              titulo: 'O que é Segurança da Informação?',
              descricao: 'Entenda os pilares da segurança: confidencialidade, integridade e disponibilidade',
              tipo: 'video',
              video_url: 'https://www.youtube.com/watch?v=inWWhr5tnEA',
              duracao: 600,
              ordem: 1,
            },
            {
              id: '1-2',
              titulo: 'Principais Ameaças Digitais',
              descricao: 'Conheça os tipos de ataques mais comuns',
              tipo: 'video',
              video_url: 'https://www.youtube.com/watch?v=rcDO8km6R6c',
              duracao: 900,
              ordem: 2,
            },
            {
              id: '1-3',
              titulo: 'Políticas de Segurança',
              descricao: 'Como criar e implementar políticas eficazes',
              tipo: 'video',
              video_url: 'https://www.youtube.com/watch?v=Z3SYDTMP3ME',
              duracao: 720,
              ordem: 3,
              materiais: [
                {
                  id: 'mat-1',
                  nome: 'Checklist de Segurança.pdf',
                  tipo: 'pdf',
                  url: '#',
                  tamanho: 524288
                },
                {
                  id: 'mat-2',
                  nome: 'Política de Senhas.docx',
                  tipo: 'doc',
                  url: '#',
                  tamanho: 102400
                }
              ]
            }
          ]
        },
        {
          id: 'mod-2',
          titulo: 'Proteção de Dados',
          descricao: 'Como proteger informações sensíveis',
          ordem: 2,
          aulas: [
            {
              id: '1-4',
              titulo: 'LGPD na Prática',
              descricao: 'Lei Geral de Proteção de Dados aplicada ao dia a dia',
              tipo: 'video',
              video_url: 'https://www.youtube.com/watch?v=Z3SYDTMP3ME',
              duracao: 1200,
              ordem: 1,
            },
            {
              id: '1-5',
              titulo: 'Criptografia Básica',
              tipo: 'video',
              video_url: 'https://www.youtube.com/watch?v=Z3SYDTMP3ME',
              duracao: 900,
              ordem: 2,
            }
          ]
        }
      ]
    },
    {
      id: '2',
      titulo: 'Excel Avançado',
      descricao: 'Domine fórmulas complexas, tabelas dinâmicas e análise de dados',
      categoria: 'Desenvolvimento',
      setor: 'BI',
      instrutor: {
        nome: 'Ana Paula Santos',
        cargo: 'Analista de BI Sênior'
      },
      thumbnail: 'https://images.unsplash.com/photo-1584472666879-7d92db132958?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleGNlbCUyMHNwcmVhZHNoZWV0JTIwZGF0YXxlbnwxfHx8fDE3NjA1OTczMjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      duracao_total: 360,
      nivel: 'Avançado',
      ativo: true,
      criado_em: '2025-01-15',
      modulos: [
        {
          id: 'mod-excel-1',
          titulo: 'Fórmulas Avançadas',
          descricao: 'PROCV, ÍNDICE, CORRESP e mais',
          ordem: 1,
          aulas: [
            {
              id: '2-1',
              titulo: 'PROCV e PROCH',
              tipo: 'video',
              video_url: 'https://www.youtube.com/watch?v=Z3SYDTMP3ME',
              duracao: 1800,
              ordem: 1,
            }
          ]
        }
      ]
    },
    {
      id: '3',
      titulo: 'Compliance e Ética',
      descricao: 'Fundamentos de compliance e conduta ética corporativa',
      categoria: 'Obrigatório',
      setor: 'RH',
      instrutor: {
        nome: 'Dra. Mariana Costa',
        cargo: 'Gerente de Compliance'
      },
      thumbnail: 'https://images.unsplash.com/photo-1695720247431-2790feab65c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wbGlhbmNlJTIwYnVzaW5lc3MlMjBldGhpY3N8ZW58MXx8fHwxNzYwNjE5NTU5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      duracao_total: 180,
      nivel: 'Básico',
      ativo: true,
      criado_em: '2025-02-01',
      modulos: [
        {
          id: 'mod-comp-1',
          titulo: 'Fundamentos de Compliance',
          descricao: 'O que é compliance e por que é importante',
          ordem: 1,
          aulas: [
            {
              id: '3-1',
              titulo: 'Introdução ao Compliance',
              tipo: 'video',
              video_url: 'https://www.youtube.com/watch?v=Z3SYDTMP3ME',
              duracao: 900,
              ordem: 1,
            }
          ]
        }
      ]
    },
    {
      id: '4',
      titulo: 'Liderança e Gestão de Equipes',
      descricao: 'Aprenda a liderar times de alta performance',
      categoria: 'Liderança',
      setor: 'Liderança',
      instrutor: {
        nome: 'Ricardo Oliveira',
        cargo: 'Coach Executivo'
      },
      thumbnail: 'https://images.unsplash.com/photo-1557734864-c78b6dfef1b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWFkZXJzaGlwJTIwdGVhbSUyMG1hbmFnZW1lbnR8ZW58MXx8fHwxNzYwNjE5NTYwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      duracao_total: 480,
      nivel: 'Intermediário',
      ativo: true,
      criado_em: '2025-02-10',
      modulos: [
        {
          id: 'mod-lid-1',
          titulo: 'Estilos de Liderança',
          descricao: 'Conheça diferentes abordagens de liderança',
          ordem: 1,
          aulas: [
            {
              id: '4-1',
              titulo: 'Liderança Situacional',
              tipo: 'video',
              video_url: 'https://www.youtube.com/watch?v=Z3SYDTMP3ME',
              duracao: 1200,
              ordem: 1,
            }
          ]
        }
      ]
    },
    {
      id: '5',
      titulo: 'Power BI para Análise de Dados',
      descricao: 'Crie dashboards e visualizações impactantes',
      categoria: 'Ferramentas',
      setor: 'BI',
      instrutor: {
        nome: 'Fernanda Lima',
        cargo: 'Especialista em BI'
      },
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJpJTIwZGF0YSUyMGFuYWx5dGljc3xlbnwxfHx8fDE3NjA2MTk1NjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      duracao_total: 300,
      nivel: 'Avançado',
      ativo: true,
      criado_em: '2025-03-01',
      modulos: [
        {
          id: 'mod-pbi-1',
          titulo: 'Primeiros Passos',
          descricao: 'Configuração e interface do Power BI',
          ordem: 1,
          aulas: [
            {
              id: '5-1',
              titulo: 'Instalação e Configuração',
              tipo: 'video',
              video_url: 'https://www.youtube.com/watch?v=Z3SYDTMP3ME',
              duracao: 600,
              ordem: 1,
            }
          ]
        }
      ]
    },
    {
      id: '6',
      titulo: 'Gestão Financeira Corporativa',
      descricao: 'Planejamento financeiro e análise de investimentos',
      categoria: 'Finanças',
      setor: 'Financeiro',
      instrutor: {
        nome: 'Luiz Fernando Costa',
        cargo: 'CFO'
      },
      thumbnail: 'https://images.unsplash.com/photo-1618667054276-690d5271d35d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNlJTIwYWNjb3VudGluZyUyMGJ1c2luZXNzfGVufDF8fHx8MTc2MDYxOTU2MXww&ixlib=rb-4.1.0&q=80&w=1080',
      duracao_total: 540,
      nivel: 'Avançado',
      ativo: true,
      criado_em: '2025-03-15',
      modulos: [
        {
          id: 'mod-fin-1',
          titulo: 'Planejamento Orçamentário',
          descricao: 'Como criar um orçamento eficaz',
          ordem: 1,
          aulas: [
            {
              id: '6-1',
              titulo: 'Fundamentos do Orçamento',
              tipo: 'video',
              video_url: 'https://www.youtube.com/watch?v=Z3SYDTMP3ME',
              duracao: 1500,
              ordem: 1,
            }
          ]
        }
      ]
    }
  ];

  const cursosFiltrados = filtroSetor === 'Todos' 
    ? cursos 
    : cursos.filter(curso => curso.setor === filtroSetor);

  const getNivelColor = (nivel: string) => {
    const colors: { [key: string]: string } = {
      'Básico': 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400',
      'Intermediário': 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400',
      'Avançado': 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400',
    };
    return colors[nivel] || 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300';
  };

  const calcularProgressoCurso = (curso: Curso) => {
    const totalAulas = curso.modulos.reduce((acc, m) => acc + m.aulas.length, 0);
    const aulasCompletas = curso.modulos
      .flatMap(m => m.aulas)
      .filter(a => progressoUsuario.find(p => p.aula_id === a.id && p.completado))
      .length;
    
    return totalAulas > 0 ? Math.round((aulasCompletas / totalAulas) * 100) : 0;
  };

  const handleProgressoUpdate = (aulaId: string, completado: boolean, segundos: number) => {
    setProgressoUsuario(prev => {
      const existing = prev.findIndex(p => p.aula_id === aulaId);
      const newProgresso: ProgressoAula = {
        aula_id: aulaId,
        completado,
        progresso_segundos: segundos,
        ultima_visualizacao: new Date().toISOString()
      };

      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = newProgresso;
        return updated;
      } else {
        return [...prev, newProgresso];
      }
    });
  };

  // Se um curso está selecionado, mostrar o visualizador
  if (cursoSelecionado) {
    return (
      <CursoViewer
        curso={cursoSelecionado}
        onBack={() => setCursoSelecionado(null)}
        progresso={progressoUsuario}
        onProgressoUpdate={handleProgressoUpdate}
      />
    );
  }

  // Caso contrário, mostrar a lista de cursos
  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 dark:text-white">Cursos & Treinamentos</h1>
          <p className="text-gray-600 dark:text-gray-400">Desenvolva suas habilidades profissionais</p>
        </div>
        <Button
          onClick={() => navigate('/cursos/add')}
          className="h-10 bg-[#000aff] hover:bg-[#000aff]/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Novo Curso</span>
          <span className="sm:hidden">Novo</span>
        </Button>
      </div>

      {/* Filtro por Setor - Dropdown no Mobile, Botões no Desktop */}
      <div>
        {/* Mobile: Dropdown */}
        <div className="sm:hidden">
          <label className="text-gray-700 dark:text-gray-300 mb-2 block">Filtrar por Setor</label>
          <div className="relative">
            <select
              value={filtroSetor}
              onChange={(e) => setFiltroSetor(e.target.value as SetorType)}
              className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-gray-900 dark:text-white appearance-none cursor-pointer"
            >
              {setores.map((setor) => (
                <option key={setor.nome} value={setor.nome}>
                  {setor.nome}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Desktop: Botões */}
        <div className="hidden sm:flex gap-3 flex-wrap">
          {setores.map((setor) => {
            const Icon = setor.icon;
            const isActive = filtroSetor === setor.nome;
            return (
              <button
                key={setor.nome}
                onClick={() => setFiltroSetor(setor.nome)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#000aff] text-white shadow-lg shadow-[#000aff]/30' 
                    : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{setor.nome}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid de Cursos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {cursosFiltrados.map((curso) => {
          const progresso = calcularProgressoCurso(curso);
          
          return (
            <Card 
              key={curso.id} 
              className="bg-white dark:bg-gray-900 border-gray-200/50 dark:border-gray-800/50 hover:shadow-xl transition-all duration-300 sm:hover:scale-[1.02] overflow-hidden group cursor-pointer"
              onClick={() => setCursoSelecionado(curso)}
            >
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <ImageWithFallback 
                  src={curso.thumbnail} 
                  alt={curso.titulo}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Badge de Categoria */}
                <Badge className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/90 dark:bg-black/90 text-gray-900 dark:text-white backdrop-blur-sm text-xs sm:text-sm">
                  {curso.categoria}
                </Badge>
                
                {/* Indicador de Conclusão */}
                {progresso === 100 && (
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 p-1.5 sm:p-2 rounded-full bg-green-500 shadow-lg">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                )}
              </div>

              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-gray-900 dark:text-white">{curso.titulo}</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 line-clamp-2">
                  {curso.descricao}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-2.5 sm:space-y-3 p-3 sm:p-6">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <small className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    {curso.duracao_total} min
                  </small>
                  <Badge className={getNivelColor(curso.nivel)}>
                    {curso.nivel}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                  <small className="text-gray-600 dark:text-gray-400 truncate">{curso.instrutor.nome}</small>
                </div>

                {/* Barra de Progresso */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <small className="text-gray-600 dark:text-gray-400">
                      {progresso === 100 ? 'Concluído' : progresso > 0 ? 'Em andamento' : 'Não iniciado'}
                    </small>
                    <small className="text-gray-900 dark:text-white font-medium">{progresso}%</small>
                  </div>
                  <Progress value={progresso} className="h-1.5" />
                </div>

                {/* Botão de Ação */}
                {progresso === 100 ? (
                  <Button variant="outline" className="w-full text-[#000aff] border-gray-200 dark:border-gray-800 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-xl h-9 sm:h-10">
                    <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                    Ver Certificado
                  </Button>
                ) : progresso > 0 ? (
                  <Button className="w-full bg-[#000aff] hover:bg-[#0008e6] text-white rounded-xl shadow-lg shadow-[#000aff]/30 h-9 sm:h-10">
                    <PlayCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                    Continuar Curso
                  </Button>
                ) : (
                  <Button className="w-full bg-[#000aff] hover:bg-[#0008e6] text-white rounded-xl shadow-lg shadow-[#000aff]/30 h-9 sm:h-10">
                    <PlayCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                    Iniciar Curso
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
