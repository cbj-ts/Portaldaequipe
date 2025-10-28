/**
 * ============================================================================
 * PÁGINA DE ADICIONAR CURSO/VÍDEO
 * ============================================================================
 * 
 * FUNCIONALIDADES:
 * - Upload de cursos e vídeos
 * - Configuração de módulos e aulas
 * - Upload de materiais complementares
 * - Preview de thumbnail
 * - Controle de acesso por setor
 * 
 * ============================================================================
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { 
  ArrowLeft, 
  Upload, 
  Video, 
  FileText, 
  Plus, 
  Trash2, 
  GripVertical,
  PlayCircle,
  User,
  BookOpen,
  Clock,
  Target,
  Tag,
  Eye,
  Save
} from 'lucide-react';
import { FormInput } from './FormInput';
import { FormTextarea } from './FormTextarea';
import { FormSelect } from './FormSelect';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import { SetorType, NivelType, TipoAulaType, Aula, Modulo } from '../types/curso';

interface AulaForm {
  titulo: string;
  descricao: string;
  tipo: TipoAulaType;
  video_url: string;
  duracao: number;
}

interface ModuloForm {
  titulo: string;
  descricao: string;
  aulas: AulaForm[];
}

export function CursosAddPage() {
  const navigate = useNavigate();
  
  // Informações gerais do curso
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [setor, setSetor] = useState<SetorType>('Todos');
  const [nivel, setNivel] = useState<NivelType>('Básico');
  const [tags, setTags] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  
  // Informações do instrutor
  const [instrutorNome, setInstrutorNome] = useState('');
  const [instrutorCargo, setInstrutorCargo] = useState('');
  const [instrutorBio, setInstrutorBio] = useState('');
  const [instrutorFoto, setInstrutorFoto] = useState('');
  
  // Módulos e aulas
  const [modulos, setModulos] = useState<ModuloForm[]>([
    {
      titulo: '',
      descricao: '',
      aulas: []
    }
  ]);
  
  const [moduloExpandido, setModuloExpandido] = useState<number>(0);
  const [previewMode, setPreviewMode] = useState(false);

  // Adicionar novo módulo
  const adicionarModulo = () => {
    setModulos([...modulos, { titulo: '', descricao: '', aulas: [] }]);
    setModuloExpandido(modulos.length);
  };

  // Remover módulo
  const removerModulo = (index: number) => {
    if (modulos.length === 1) {
      toast.error('O curso precisa ter pelo menos um módulo');
      return;
    }
    const novosModulos = modulos.filter((_, i) => i !== index);
    setModulos(novosModulos);
    if (moduloExpandido >= novosModulos.length) {
      setModuloExpandido(novosModulos.length - 1);
    }
  };

  // Adicionar aula a um módulo
  const adicionarAula = (moduloIndex: number) => {
    const novosModulos = [...modulos];
    novosModulos[moduloIndex].aulas.push({
      titulo: '',
      descricao: '',
      tipo: 'video',
      video_url: '',
      duracao: 0
    });
    setModulos(novosModulos);
  };

  // Remover aula de um módulo
  const removerAula = (moduloIndex: number, aulaIndex: number) => {
    const novosModulos = [...modulos];
    novosModulos[moduloIndex].aulas = novosModulos[moduloIndex].aulas.filter((_, i) => i !== aulaIndex);
    setModulos(novosModulos);
  };

  // Atualizar dados do módulo
  const atualizarModulo = (index: number, campo: keyof ModuloForm, valor: string) => {
    const novosModulos = [...modulos];
    if (campo === 'titulo' || campo === 'descricao') {
      novosModulos[index][campo] = valor;
    }
    setModulos(novosModulos);
  };

  // Atualizar dados da aula
  const atualizarAula = (moduloIndex: number, aulaIndex: number, campo: keyof AulaForm, valor: any) => {
    const novosModulos = [...modulos];
    novosModulos[moduloIndex].aulas[aulaIndex] = {
      ...novosModulos[moduloIndex].aulas[aulaIndex],
      [campo]: valor
    };
    setModulos(novosModulos);
  };

  // Calcular duração total do curso
  const calcularDuracaoTotal = () => {
    let totalSegundos = 0;
    modulos.forEach(modulo => {
      modulo.aulas.forEach(aula => {
        totalSegundos += aula.duracao || 0;
      });
    });
    return Math.floor(totalSegundos / 60); // retorna em minutos
  };

  // Validar formulário
  const validarFormulario = () => {
    if (!titulo.trim()) {
      toast.error('Título do curso é obrigatório');
      return false;
    }
    if (!descricao.trim()) {
      toast.error('Descrição do curso é obrigatória');
      return false;
    }
    if (!instrutorNome.trim()) {
      toast.error('Nome do instrutor é obrigatório');
      return false;
    }
    if (modulos.length === 0) {
      toast.error('O curso precisa ter pelo menos um módulo');
      return false;
    }
    
    let modulosValidos = true;
    modulos.forEach((modulo, index) => {
      if (!modulo.titulo.trim()) {
        toast.error(`Módulo ${index + 1} precisa de um título`);
        modulosValidos = false;
      }
      if (modulo.aulas.length === 0) {
        toast.error(`Módulo ${index + 1} precisa ter pelo menos uma aula`);
        modulosValidos = false;
      }
      modulo.aulas.forEach((aula, aulaIndex) => {
        if (!aula.titulo.trim()) {
          toast.error(`Aula ${aulaIndex + 1} do módulo ${index + 1} precisa de um título`);
          modulosValidos = false;
        }
      });
    });
    
    return modulosValidos;
  };

  // Salvar curso
  const salvarCurso = () => {
    if (!validarFormulario()) return;

    // Simular salvamento
    toast.success('Curso criado com sucesso!', {
      description: `"${titulo}" foi adicionado à plataforma`
    });
    
    // Aguardar 1.5s e voltar para a lista
    setTimeout(() => {
      navigate('/cursos');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/cursos')}
            className="h-10 w-10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-gray-900 dark:text-white">Novo Curso</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Adicione um novo curso ou vídeo à plataforma
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
            className="h-10"
          >
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? 'Editar' : 'Preview'}
          </Button>
          <Button
            onClick={salvarCurso}
            className="h-10 bg-[#000aff] hover:bg-[#000aff]/90 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Publicar Curso
          </Button>
        </div>
      </div>

      {!previewMode ? (
        <>
          {/* Informações Gerais */}
          <Card className="border-blue-200 dark:border-blue-900">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-gray-900 dark:text-white">Informações Gerais</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Título do Curso <span className="required-asterisk">*</span></Label>
                  <FormInput
                    value={titulo}
                    onChange={(e) => {
                      if (e.target.value.length <= 100) {
                        setTitulo(e.target.value);
                      }
                    }}
                    placeholder="Ex: Introdução ao Python"
                    maxLength={100}
                    required
                  />
                  <small className="text-gray-500 dark:text-gray-400">
                    {titulo.length}/100 caracteres
                  </small>
                </div>

                <div>
                  <Label>Categoria</Label>
                  <FormInput
                    value={categoria}
                    onChange={(e) => {
                      if (e.target.value.length <= 50) {
                        setCategoria(e.target.value);
                      }
                    }}
                    placeholder="Ex: Desenvolvimento, Marketing"
                    maxLength={50}
                  />
                  <small className="text-gray-500 dark:text-gray-400">
                    {categoria.length}/50 caracteres
                  </small>
                </div>
              </div>

              <div>
                <Label>Descrição <span className="required-asterisk">*</span></Label>
                <FormTextarea
                  value={descricao}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setDescricao(e.target.value);
                    }
                  }}
                  placeholder="Descreva o que os alunos irão aprender neste curso..."
                  rows={3}
                  maxLength={500}
                  required
                />
                <small className="text-gray-500 dark:text-gray-400">
                  {descricao.length}/500 caracteres
                </small>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Setor <span className="required-asterisk">*</span></Label>
                  <FormSelect
                    value={setor}
                    onChange={(e) => setSetor(e.target.value as SetorType)}
                    options={[
                      { value: 'Todos', label: 'Todos os Setores' },
                      { value: 'Tecnologia', label: 'Tecnologia' },
                      { value: 'RH', label: 'RH' },
                      { value: 'BI', label: 'BI' },
                      { value: 'Experiência', label: 'Experiência' },
                      { value: 'Liderança', label: 'Liderança' },
                      { value: 'Financeiro', label: 'Financeiro' }
                    ]}
                    required
                  />
                </div>

                <div>
                  <Label>Nível <span className="required-asterisk">*</span></Label>
                  <FormSelect
                    value={nivel}
                    onChange={(e) => setNivel(e.target.value as NivelType)}
                    options={[
                      { value: 'Básico', label: 'Básico' },
                      { value: 'Intermediário', label: 'Intermediário' },
                      { value: 'Avançado', label: 'Avançado' }
                    ]}
                    required
                  />
                </div>

                <div>
                  <Label>Duração Total</Label>
                  <div className="flex items-center gap-2 h-10 px-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {calcularDuracaoTotal()} min
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <Label>Tags (separadas por vírgula)</Label>
                <FormInput
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Ex: python, programação, iniciante"
                />
                <small className="text-gray-500 dark:text-gray-400">
                  Use vírgulas para separar as tags
                </small>
              </div>

              <div>
                <Label>URL da Thumbnail</Label>
                <FormInput
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://exemplo.com/imagem.jpg"
                  type="url"
                />
                {thumbnailUrl && (
                  <div className="mt-3">
                    <small className="text-gray-600 dark:text-gray-400 mb-2 block">Preview:</small>
                    <ImageWithFallback
                      src={thumbnailUrl}
                      alt="Preview da thumbnail"
                      className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-700"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Informações do Instrutor */}
          <Card className="border-purple-200 dark:border-purple-900">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-gray-900 dark:text-white">Instrutor</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nome do Instrutor <span className="required-asterisk">*</span></Label>
                  <FormInput
                    value={instrutorNome}
                    onChange={(e) => {
                      if (e.target.value.length <= 100) {
                        setInstrutorNome(e.target.value);
                      }
                    }}
                    placeholder="Nome completo"
                    maxLength={100}
                    required
                  />
                  <small className="text-gray-500 dark:text-gray-400">
                    {instrutorNome.length}/100 caracteres
                  </small>
                </div>

                <div>
                  <Label>Cargo</Label>
                  <FormInput
                    value={instrutorCargo}
                    onChange={(e) => {
                      if (e.target.value.length <= 100) {
                        setInstrutorCargo(e.target.value);
                      }
                    }}
                    placeholder="Ex: Desenvolvedor Sênior"
                    maxLength={100}
                  />
                  <small className="text-gray-500 dark:text-gray-400">
                    {instrutorCargo.length}/100 caracteres
                  </small>
                </div>
              </div>

              <div>
                <Label>Biografia</Label>
                <FormTextarea
                  value={instrutorBio}
                  onChange={(e) => {
                    if (e.target.value.length <= 300) {
                      setInstrutorBio(e.target.value);
                    }
                  }}
                  placeholder="Breve descrição sobre o instrutor..."
                  rows={2}
                  maxLength={300}
                />
                <small className="text-gray-500 dark:text-gray-400">
                  {instrutorBio.length}/300 caracteres
                </small>
              </div>

              <div>
                <Label>URL da Foto do Instrutor</Label>
                <FormInput
                  value={instrutorFoto}
                  onChange={(e) => setInstrutorFoto(e.target.value)}
                  placeholder="https://exemplo.com/foto.jpg"
                  type="url"
                />
                {instrutorFoto && (
                  <div className="mt-3 flex items-center gap-3">
                    <small className="text-gray-600 dark:text-gray-400">Preview:</small>
                    <ImageWithFallback
                      src={instrutorFoto}
                      alt="Preview do instrutor"
                      className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Módulos e Aulas */}
          <Card className="border-pink-200 dark:border-pink-900">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                  <h3 className="text-gray-900 dark:text-white">Módulos e Aulas</h3>
                </div>
                <Button
                  onClick={adicionarModulo}
                  variant="outline"
                  className="h-10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Módulo
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {modulos.map((modulo, moduloIndex) => (
                <Card key={moduloIndex} className="border-gray-200 dark:border-gray-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                        <h4 className="text-gray-900 dark:text-white">
                          Módulo {moduloIndex + 1}
                        </h4>
                        <Badge variant="outline">
                          {modulo.aulas.length} {modulo.aulas.length === 1 ? 'aula' : 'aulas'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => setModuloExpandido(moduloExpandido === moduloIndex ? -1 : moduloIndex)}
                          variant="ghost"
                          size="sm"
                          className="h-8"
                        >
                          {moduloExpandido === moduloIndex ? 'Recolher' : 'Expandir'}
                        </Button>
                        <Button
                          onClick={() => removerModulo(moduloIndex)}
                          variant="ghost"
                          size="sm"
                          className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {moduloExpandido === moduloIndex && (
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Título do Módulo <span className="required-asterisk">*</span></Label>
                        <FormInput
                          value={modulo.titulo}
                          onChange={(e) => {
                            if (e.target.value.length <= 100) {
                              atualizarModulo(moduloIndex, 'titulo', e.target.value);
                            }
                          }}
                          placeholder="Ex: Fundamentos de Python"
                          maxLength={100}
                          required
                        />
                        <small className="text-gray-500 dark:text-gray-400">
                          {modulo.titulo.length}/100 caracteres
                        </small>
                      </div>

                      <div>
                        <Label>Descrição do Módulo</Label>
                        <FormTextarea
                          value={modulo.descricao}
                          onChange={(e) => {
                            if (e.target.value.length <= 300) {
                              atualizarModulo(moduloIndex, 'descricao', e.target.value);
                            }
                          }}
                          placeholder="O que será abordado neste módulo..."
                          rows={2}
                          maxLength={300}
                        />
                        <small className="text-gray-500 dark:text-gray-400">
                          {modulo.descricao.length}/300 caracteres
                        </small>
                      </div>

                      {/* Aulas do Módulo */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Aulas</Label>
                          <Button
                            onClick={() => adicionarAula(moduloIndex)}
                            variant="outline"
                            size="sm"
                            className="h-8"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Adicionar Aula
                          </Button>
                        </div>

                        {modulo.aulas.map((aula, aulaIndex) => (
                          <div
                            key={aulaIndex}
                            className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <PlayCircle className="w-4 h-4 text-gray-500" />
                                <small className="text-gray-700 dark:text-gray-300">
                                  Aula {aulaIndex + 1}
                                </small>
                              </div>
                              <Button
                                onClick={() => removerAula(moduloIndex, aulaIndex)}
                                variant="ghost"
                                size="sm"
                                className="h-6 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <Label>Título da Aula <span className="required-asterisk">*</span></Label>
                                <FormInput
                                  value={aula.titulo}
                                  onChange={(e) => {
                                    if (e.target.value.length <= 100) {
                                      atualizarAula(moduloIndex, aulaIndex, 'titulo', e.target.value);
                                    }
                                  }}
                                  placeholder="Título da aula"
                                  maxLength={100}
                                  required
                                />
                                <small className="text-gray-500 dark:text-gray-400">
                                  {aula.titulo.length}/100 caracteres
                                </small>
                              </div>

                              <div>
                                <Label>Tipo de Aula</Label>
                                <FormSelect
                                  value={aula.tipo}
                                  onChange={(e) => atualizarAula(moduloIndex, aulaIndex, 'tipo', e.target.value)}
                                  options={[
                                    { value: 'video', label: 'Vídeo' },
                                    { value: 'texto', label: 'Texto' },
                                    { value: 'quiz', label: 'Quiz' },
                                    { value: 'documento', label: 'Documento' }
                                  ]}
                                />
                              </div>
                            </div>

                            <div>
                              <Label>Descrição da Aula</Label>
                              <FormTextarea
                                value={aula.descricao}
                                onChange={(e) => {
                                  if (e.target.value.length <= 200) {
                                    atualizarAula(moduloIndex, aulaIndex, 'descricao', e.target.value);
                                  }
                                }}
                                placeholder="Breve descrição..."
                                rows={2}
                                maxLength={200}
                              />
                              <small className="text-gray-500 dark:text-gray-400">
                                {aula.descricao.length}/200 caracteres
                              </small>
                            </div>

                            {aula.tipo === 'video' && (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="md:col-span-2">
                                  <Label>URL do Vídeo (YouTube/Vimeo)</Label>
                                  <FormInput
                                    value={aula.video_url}
                                    onChange={(e) => atualizarAula(moduloIndex, aulaIndex, 'video_url', e.target.value)}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    type="url"
                                  />
                                </div>

                                <div>
                                  <Label>Duração (segundos)</Label>
                                  <FormInput
                                    value={aula.duracao || ''}
                                    onChange={(e) => atualizarAula(moduloIndex, aulaIndex, 'duracao', parseInt(e.target.value) || 0)}
                                    placeholder="600"
                                    type="number"
                                    min="0"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}

                        {modulo.aulas.length === 0 && (
                          <div className="text-center py-8 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                            <PlayCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>Nenhuma aula adicionada</p>
                            <small>Clique em "Adicionar Aula" para começar</small>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </CardContent>
          </Card>
        </>
      ) : (
        /* Preview Mode */
        <Card className="border-gray-200 dark:border-gray-700">
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Thumbnail */}
              {thumbnailUrl && (
                <ImageWithFallback
                  src={thumbnailUrl}
                  alt={titulo}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}

              {/* Header do Curso */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#000aff] text-white">{setor}</Badge>
                  <Badge variant="outline">{nivel}</Badge>
                  {categoria && <Badge variant="outline">{categoria}</Badge>}
                </div>
                <h1 className="text-gray-900 dark:text-white">{titulo || 'Título do Curso'}</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {descricao || 'Descrição do curso aparecerá aqui...'}
                </p>
              </div>

              {/* Instrutor */}
              {instrutorNome && (
                <div className="flex items-center gap-4 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-900">
                  {instrutorFoto ? (
                    <ImageWithFallback
                      src={instrutorFoto}
                      alt={instrutorNome}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-purple-200 dark:bg-purple-800 flex items-center justify-center">
                      <User className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-gray-900 dark:text-white">{instrutorNome}</h4>
                    {instrutorCargo && <p className="text-gray-600 dark:text-gray-400">{instrutorCargo}</p>}
                    {instrutorBio && <small className="text-gray-500 dark:text-gray-500">{instrutorBio}</small>}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">{calcularDuracaoTotal()} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">{modulos.length} módulos</span>
                </div>
                <div className="flex items-center gap-2">
                  <PlayCircle className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {modulos.reduce((acc, m) => acc + m.aulas.length, 0)} aulas
                  </span>
                </div>
              </div>

              {/* Tags */}
              {tags && (
                <div className="flex flex-wrap gap-2">
                  {tags.split(',').map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Módulos */}
              <div className="space-y-4">
                <h3 className="text-gray-900 dark:text-white">Conteúdo do Curso</h3>
                {modulos.map((modulo, index) => (
                  <Card key={index} className="border-gray-200 dark:border-gray-700">
                    <CardHeader>
                      <h4 className="text-gray-900 dark:text-white">
                        {modulo.titulo || `Módulo ${index + 1}`}
                      </h4>
                      {modulo.descricao && (
                        <p className="text-gray-600 dark:text-gray-400">{modulo.descricao}</p>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {modulo.aulas.map((aula, aulaIndex) => (
                          <div
                            key={aulaIndex}
                            className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                          >
                            <PlayCircle className="w-4 h-4 text-gray-500" />
                            <div className="flex-1">
                              <p className="text-gray-900 dark:text-white">
                                {aula.titulo || `Aula ${aulaIndex + 1}`}
                              </p>
                              {aula.descricao && (
                                <small className="text-gray-500 dark:text-gray-400">
                                  {aula.descricao}
                                </small>
                              )}
                            </div>
                            {aula.duracao > 0 && (
                              <small className="text-gray-500">
                                {Math.floor(aula.duracao / 60)}:{String(aula.duracao % 60).padStart(2, '0')}
                              </small>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bottom Actions (mobile) */}
      <div className="lg:hidden flex gap-3 pb-6">
        <Button
          variant="outline"
          onClick={() => setPreviewMode(!previewMode)}
          className="flex-1 h-10"
        >
          <Eye className="w-4 h-4 mr-2" />
          {previewMode ? 'Editar' : 'Preview'}
        </Button>
        <Button
          onClick={salvarCurso}
          className="flex-1 h-10 bg-[#000aff] hover:bg-[#000aff]/90 text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          Publicar
        </Button>
      </div>
    </div>
  );
}
