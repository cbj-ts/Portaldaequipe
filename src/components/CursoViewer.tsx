/**
 * ============================================================================
 * VISUALIZADOR DE CURSO - Player de Vídeo e Navegação
 * ============================================================================
 */

import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { 
  ArrowLeft, 
  CheckCircle, 
  Circle, 
  PlayCircle, 
  Download, 
  FileText,
  Clock,
  Award,
  ChevronRight,
  ChevronDown,
  Lock,
  List,
  X
} from 'lucide-react';
import { Curso, Modulo, Aula, ProgressoAula } from '../types/curso';

interface Props {
  curso: Curso;
  onBack: () => void;
  progresso: ProgressoAula[];
  onProgressoUpdate: (aulaId: string, completado: boolean, segundos: number) => void;
}

export function CursoViewer({ curso, onBack, progresso, onProgressoUpdate }: Props) {
  const [aulaAtual, setAulaAtual] = useState<Aula | null>(null);
  const [moduloExpandido, setModuloExpandido] = useState<string | null>(null);
  const [sidebarAberta, setSidebarAberta] = useState(false);

  // Inicializar com a primeira aula não concluída ou primeira aula
  useEffect(() => {
    const primeiraAulaNaoConcluida = curso.modulos
      .flatMap(m => m.aulas)
      .find(a => !isAulaCompleta(a.id));
    
    if (primeiraAulaNaoConcluida) {
      setAulaAtual(primeiraAulaNaoConcluida);
    } else if (curso.modulos[0]?.aulas[0]) {
      setAulaAtual(curso.modulos[0].aulas[0]);
    }

    // Expandir módulo da aula atual
    const moduloDaAula = curso.modulos.find(m => 
      m.aulas.some(a => a.id === aulaAtual?.id)
    );
    if (moduloDaAula) {
      setModuloExpandido(moduloDaAula.id);
    }
  }, []);

  const isAulaCompleta = (aulaId: string) => {
    return progresso.find(p => p.aula_id === aulaId)?.completado || false;
  };

  const getProgressoAula = (aulaId: string) => {
    return progresso.find(p => p.aula_id === aulaId)?.progresso_segundos || 0;
  };

  const marcarAulaCompleta = (aulaId: string) => {
    const aula = curso.modulos
      .flatMap(m => m.aulas)
      .find(a => a.id === aulaId);
    
    if (aula) {
      onProgressoUpdate(aulaId, true, aula.duracao);
    }
  };

  const calcularProgressoCurso = () => {
    const totalAulas = curso.modulos.reduce((acc, m) => acc + m.aulas.length, 0);
    const aulasCompletas = progresso.filter(p => p.completado).length;
    return totalAulas > 0 ? Math.round((aulasCompletas / totalAulas) * 100) : 0;
  };

  const proximaAula = () => {
    if (!aulaAtual) return null;
    
    const todasAulas = curso.modulos.flatMap(m => 
      m.aulas.map(a => ({ ...a, moduloId: m.id }))
    );
    const indexAtual = todasAulas.findIndex(a => a.id === aulaAtual.id);
    
    if (indexAtual < todasAulas.length - 1) {
      return todasAulas[indexAtual + 1];
    }
    return null;
  };

  const aulaAnterior = () => {
    if (!aulaAtual) return null;
    
    const todasAulas = curso.modulos.flatMap(m => 
      m.aulas.map(a => ({ ...a, moduloId: m.id }))
    );
    const indexAtual = todasAulas.findIndex(a => a.id === aulaAtual.id);
    
    if (indexAtual > 0) {
      return todasAulas[indexAtual - 1];
    }
    return null;
  };

  const formatarDuracao = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos}:${segs.toString().padStart(2, '0')}`;
  };

  const formatarTamanho = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getVideoEmbedUrl = (url: string) => {
    // Converter URLs do YouTube para embed
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    // Converter URLs do Vimeo para embed
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  const progressoCurso = calcularProgressoCurso();
  const proxima = proximaAula();
  const anterior = aulaAnterior();

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6 max-w-full overflow-hidden">
      {/* Header com botão voltar */}
      <div className="flex flex-col gap-2 sm:gap-3 md:gap-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={onBack}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex-shrink-0 rounded-lg sm:rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-gray-900 dark:text-white truncate">{curso.titulo}</h1>
            <small className="text-gray-600 dark:text-gray-400 block truncate">{curso.instrutor.nome}</small>
          </div>
          <button
            onClick={() => setSidebarAberta(!sidebarAberta)}
            className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0 rounded-lg sm:rounded-xl bg-[#000aff] text-white flex items-center justify-center hover:bg-[#0008e6] transition-colors"
          >
            <List className="w-4 h-4 sm:w-4 sm:h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1 sm:mb-1.5">
              <small className="text-gray-600 dark:text-gray-400">Progresso</small>
              <small className="text-gray-900 dark:text-white font-medium">{progressoCurso}%</small>
            </div>
            <Progress value={progressoCurso} className="h-1.5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {/* Player de Vídeo e Conteúdo - 2/3 da tela */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-6">
          {aulaAtual && (
            <>
              {/* Player de Vídeo */}
              {aulaAtual.tipo === 'video' && aulaAtual.video_url && (
                <Card className="bg-black border-gray-800 overflow-hidden rounded-lg sm:rounded-xl">
                  <div className="relative aspect-video w-full">
                    <iframe
                      src={getVideoEmbedUrl(aulaAtual.video_url)}
                      className="absolute inset-0 w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={aulaAtual.titulo}
                    />
                  </div>
                </Card>
              )}

              {/* Informações da Aula */}
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-lg sm:rounded-xl">
                <CardContent className="p-3 sm:p-4 md:p-6 space-y-2.5 sm:space-y-3 md:space-y-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="text-gray-900 dark:text-white flex-1 min-w-0 leading-tight">{aulaAtual.titulo}</h2>
                      <div className="flex items-center gap-1 sm:gap-1.5 text-gray-600 dark:text-gray-400 flex-shrink-0">
                        <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                        <small className="whitespace-nowrap">{formatarDuracao(aulaAtual.duracao)}</small>
                      </div>
                    </div>
                    
                    {isAulaCompleta(aulaAtual.id) && (
                      <Badge className="bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 w-fit">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Concluída
                      </Badge>
                    )}
                    
                    {aulaAtual.descricao && (
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{aulaAtual.descricao}</p>
                    )}
                  </div>

                  {/* Conteúdo Texto (se houver) */}
                  {aulaAtual.conteudo_texto && (
                    <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {aulaAtual.conteudo_texto}
                      </p>
                    </div>
                  )}

                  {/* Botão Marcar como Concluída */}
                  {!isAulaCompleta(aulaAtual.id) && (
                    <Button
                      onClick={() => marcarAulaCompleta(aulaAtual.id)}
                      className="w-full bg-[#000aff] hover:bg-[#0008e6] text-white rounded-lg sm:rounded-xl h-9 sm:h-10"
                    >
                      <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                      <span className="hidden xs:inline">Marcar como Concluída</span>
                      <span className="xs:hidden">Concluir</span>
                    </Button>
                  )}

                  {/* Materiais para Download */}
                  {aulaAtual.materiais && aulaAtual.materiais.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
                        <h4 className="text-gray-900 dark:text-white flex items-center gap-1.5 sm:gap-2">
                          <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Materiais Complementares</span>
                          <span className="sm:hidden">Materiais</span>
                        </h4>
                        <div className="space-y-1.5 sm:space-y-2">
                          {aulaAtual.materiais.map((material) => (
                            <a
                              key={material.id}
                              href={material.url}
                              download
                              className="flex items-center justify-between p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                            >
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 rounded-lg bg-[#000aff]/10 flex items-center justify-center">
                                  <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#000aff]" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-gray-900 dark:text-white truncate leading-tight">{material.nome}</p>
                                  <small className="text-gray-600 dark:text-gray-400 block">
                                    {material.tipo.toUpperCase()} • {formatarTamanho(material.tamanho)}
                                  </small>
                                </div>
                              </div>
                              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-gray-400 group-hover:text-[#000aff] transition-colors ml-1.5 sm:ml-2" />
                            </a>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Navegação entre Aulas */}
                  <Separator />
                  <div className="flex items-stretch gap-2 sm:gap-3 md:gap-4">
                    <Button
                      variant="outline"
                      onClick={() => anterior && setAulaAtual(anterior)}
                      disabled={!anterior}
                      className="flex-1 rounded-lg sm:rounded-xl h-9 sm:h-10"
                    >
                      <span className="hidden sm:inline">Aula Anterior</span>
                      <span className="sm:hidden">Anterior</span>
                    </Button>
                    <Button
                      onClick={() => proxima && setAulaAtual(proxima)}
                      disabled={!proxima}
                      className="flex-1 bg-[#000aff] hover:bg-[#0008e6] text-white rounded-lg sm:rounded-xl h-9 sm:h-10"
                    >
                      <span className="hidden sm:inline">Próxima Aula</span>
                      <span className="sm:hidden">Próxima</span>
                      <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Sidebar - Módulos e Aulas - 1/3 da tela */}
        {/* Overlay para mobile */}
        {sidebarAberta && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarAberta(false)}
          />
        )}
        
        <div className={`
          lg:col-span-1
          fixed lg:relative
          inset-y-0 right-0
          w-full sm:w-96
          lg:w-auto
          transform lg:transform-none
          transition-transform duration-300
          z-50 lg:z-0
          ${sidebarAberta ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}>
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 lg:sticky lg:top-6 h-full lg:h-auto rounded-none lg:rounded-xl shadow-2xl lg:shadow-none">
            <CardContent className="p-3 sm:p-4 md:p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-gray-900 dark:text-white">Conteúdo do Curso</h3>
                <button
                  onClick={() => setSidebarAberta(false)}
                  className="lg:hidden w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              
              <ScrollArea className="flex-1 lg:h-[600px] pr-2 sm:pr-3 md:pr-4">
                <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
                  {curso.modulos.map((modulo) => (
                    <div key={modulo.id} className="space-y-1 sm:space-y-1.5 md:space-y-2">
                      {/* Header do Módulo */}
                      <button
                        onClick={() => setModuloExpandido(moduloExpandido === modulo.id ? null : modulo.id)}
                        className="w-full flex items-center justify-between p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-1 text-left min-w-0">
                          {moduloExpandido === modulo.id ? (
                            <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-gray-900 dark:text-white truncate leading-tight">{modulo.titulo}</p>
                            <small className="text-gray-600 dark:text-gray-400 block">
                              {modulo.aulas.length} aula{modulo.aulas.length !== 1 ? 's' : ''}
                            </small>
                          </div>
                        </div>
                      </button>

                      {/* Lista de Aulas */}
                      {moduloExpandido === modulo.id && (
                        <div className="ml-2 sm:ml-3 md:ml-4 space-y-1">
                          {modulo.aulas.map((aula) => {
                            const completa = isAulaCompleta(aula.id);
                            const atual = aulaAtual?.id === aula.id;
                            
                            return (
                              <button
                                key={aula.id}
                                onClick={() => {
                                  setAulaAtual(aula);
                                  setSidebarAberta(false);
                                }}
                                className={`w-full flex items-start gap-2 sm:gap-2.5 md:gap-3 p-2 sm:p-2.5 md:p-3 rounded-lg transition-colors text-left ${
                                  atual 
                                    ? 'bg-[#000aff] text-white' 
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                              >
                                <div className="mt-0.5 flex-shrink-0">
                                  {completa ? (
                                    <CheckCircle className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${atual ? 'text-white' : 'text-green-600 dark:text-green-400'}`} />
                                  ) : (
                                    <Circle className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${atual ? 'text-white' : 'text-gray-400'}`} />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`truncate leading-tight ${atual ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                                    {aula.titulo}
                                  </p>
                                  <small className={`block ${atual ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400'}`}>
                                    {formatarDuracao(aula.duracao)}
                                  </small>
                                </div>
                                {aula.tipo === 'video' && (
                                  <PlayCircle className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5 ${atual ? 'text-white' : 'text-gray-400'}`} />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Certificado (se concluído) */}
              {progressoCurso === 100 && (
                <div className="pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-800">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg sm:rounded-xl h-9 sm:h-10">
                    <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                    Baixar Certificado
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
