/**
 * ============================================================================
 * NEWSLETTER ADD - Adicionar/Editar Newsletter
 * ============================================================================
 * 
 * Tela completa para criar e editar newsletters da TradeStars.
 * Disponível apenas para RH e Comunicação.
 * 
 * FUNCIONALIDADES:
 * - Editor de texto com formatação
 * - Upload de PDF
 * - Categorização
 * - Marcar como destaque
 * 
 * ============================================================================
 */

import { 
  Mail, 
  ArrowLeft, 
  Upload, 
  X, 
  Save,
  Eye,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Quote,
  Image as ImageIcon
} from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { useState, useRef, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner@2.0.3';
import { parseMarkdown } from '../utils/markdownParser';

export function NewsletterAddPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Form state para nova newsletter
  const [novaNewsletter, setNovaNewsletter] = useState({
    titulo: '',
    descricao: '',
    conteudo: '',
    categoria: 'Geral',
    destaque: false
  });

  const [isPreview, setIsPreview] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<{ id: string; name: string; url: string }[]>([]);

  // Verifica se usuário pode adicionar newsletter (RH ou Comunicação)
  const podeAdicionar = user?.setor === 'RH' || user?.setor === 'Comunicação';

  // Se não pode adicionar, redireciona
  useEffect(() => {
    if (!podeAdicionar) {
      navigate('/newsletter');
      toast.error('Você não tem permissão para acessar esta página');
    }
  }, [podeAdicionar, navigate]);

  const processImageFile = (file: File) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (file.size > maxSize) {
      toast.error('Imagem muito grande. Máximo: 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Apenas imagens são aceitas (JPG, PNG, GIF, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      const imageId = `img-${Date.now()}`;
      const newImage = {
        id: imageId,
        name: file.name,
        url: imageUrl
      };
      
      setUploadedImages([...uploadedImages, newImage]);
      toast.success(`"${file.name}" adicionada`);
    };
    reader.readAsDataURL(file);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) processImageFile(file);
  };

  const removeImage = (imageId: string) => {
    setUploadedImages(uploadedImages.filter(img => img.id !== imageId));
    toast.success('Imagem removida');
  };

  const insertImageIntoContent = (imageId: string) => {
    const image = uploadedImages.find(img => img.id === imageId);
    if (!image) return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    const imageMarkdown = `![${image.name}](${image.url})`;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const newContent = 
      novaNewsletter.conteudo.substring(0, start) +
      imageMarkdown +
      novaNewsletter.conteudo.substring(end);

    setNovaNewsletter({ ...novaNewsletter, conteudo: newContent });

    // Restaura o foco
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + imageMarkdown.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);

    toast.success('Imagem inserida no conteúdo');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aqui você adicionaria a lógica para salvar no backend
    console.log('Nova newsletter:', novaNewsletter);
    
    toast.success('Newsletter publicada com sucesso!', {
      description: `"${novaNewsletter.titulo}" está agora disponível para toda a equipe.`
    });
    
    // Redireciona para a página de newsletters
    navigate('/newsletter');
  };

  // Funções de formatação de texto
  const insertFormatting = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = novaNewsletter.conteudo.substring(start, end);
    const newText = 
      novaNewsletter.conteudo.substring(0, start) +
      before + selectedText + after +
      novaNewsletter.conteudo.substring(end);

    setNovaNewsletter({ ...novaNewsletter, conteudo: newText });

    // Restaura o foco e a seleção
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        end + before.length
      );
    }, 0);
  };

  const formatBold = () => insertFormatting('**', '**');
  const formatItalic = () => insertFormatting('_', '_');
  const formatH1 = () => insertFormatting('# ', '');
  const formatH2 = () => insertFormatting('## ', '');
  const formatH3 = () => insertFormatting('### ', '');
  const formatList = () => insertFormatting('- ', '');
  const formatOrderedList = () => insertFormatting('1. ', '');
  const formatQuote = () => insertFormatting('> ', '');
  const formatLink = () => insertFormatting('[', '](url)');

  if (!podeAdicionar) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0a0a0a] dark:to-[#1d1d1d]">
      {/* Header Fixo */}
      <div className="sticky top-0 z-10 bg-white dark:bg-[#1d1d1d] border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <button
                onClick={() => navigate('/newsletter')}
                className="w-10 h-10 flex-shrink-0 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                aria-label="Voltar"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <Separator orientation="vertical" className="h-6 hidden sm:block" />
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-[#000aff] flex-shrink-0">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-gray-900 dark:text-white truncate">Nova Newsletter</h1>
                  <small className="text-gray-500 hidden sm:block">
                    Crie e publique conteúdo para toda a equipe
                  </small>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreview(!isPreview)}
                className="gap-2 flex-1 sm:flex-initial"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">{isPreview ? 'Editar' : 'Visualizar'}</span>
                <span className="sm:hidden">{isPreview ? 'Editar' : 'Preview'}</span>
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-[#000aff] hover:bg-[#000aff]/90 text-white gap-2 flex-1 sm:flex-initial"
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Publicar Newsletter</span>
                <span className="sm:hidden">Publicar</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <Card className="bg-white dark:bg-[#1d1d1d] border-gray-200 dark:border-gray-800">
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-gray-900 dark:text-white mb-4">Informações Básicas</h3>
              </div>

              {/* Título */}
              <div className="space-y-2">
                <Label htmlFor="titulo" className="text-gray-900 dark:text-white">
                  Título <span className="required-asterisk">*</span>
                </Label>
                <Input
                  id="titulo"
                  value={novaNewsletter.titulo}
                  onChange={(e) => setNovaNewsletter({ ...novaNewsletter, titulo: e.target.value })}
                  placeholder="Ex: Novidades da Semana - Janeiro 2025"
                  required
                  className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                />
              </div>

              {/* Categoria e Destaque */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categoria" className="text-gray-900 dark:text-white">
                    Categoria <span className="required-asterisk">*</span>
                  </Label>
                  <Select 
                    value={novaNewsletter.categoria}
                    onValueChange={(value) => setNovaNewsletter({ ...novaNewsletter, categoria: value })}
                  >
                    <SelectTrigger className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Geral">Geral</SelectItem>
                      <SelectItem value="Resultados">Resultados</SelectItem>
                      <SelectItem value="Desenvolvimento">Desenvolvimento</SelectItem>
                      <SelectItem value="RH">RH</SelectItem>
                      <SelectItem value="Eventos">Eventos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <div className="flex items-center space-x-2 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 w-full">
                    <Checkbox
                      id="destaque"
                      checked={novaNewsletter.destaque}
                      onCheckedChange={(checked) => 
                        setNovaNewsletter({ ...novaNewsletter, destaque: checked as boolean })
                      }
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor="destaque"
                        className="cursor-pointer text-gray-900 dark:text-white"
                      >
                        Marcar como destaque
                      </Label>
                      <small className="text-gray-600 dark:text-gray-400 block">
                        Aparece no topo da lista
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Descrição Resumida */}
              <div className="space-y-2">
                <Label htmlFor="descricao" className="text-gray-900 dark:text-white">
                  Descrição Resumida <span className="required-asterisk">*</span>
                </Label>
                <Textarea
                  id="descricao"
                  value={novaNewsletter.descricao}
                  onChange={(e) => setNovaNewsletter({ ...novaNewsletter, descricao: e.target.value })}
                  placeholder="Resumo que aparecerá no card da newsletter (máx. 200 caracteres)"
                  required
                  rows={3}
                  maxLength={200}
                  className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 resize-none"
                />
                <small className="text-gray-500">
                  {novaNewsletter.descricao.length}/200 caracteres
                </small>
              </div>
            </CardContent>
          </Card>

          {/* Editor de Conteúdo */}
          {!isPreview ? (
            <Card className="bg-white dark:bg-[#1d1d1d] border-gray-200 dark:border-gray-800">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-900 dark:text-white">Conteúdo da Newsletter</h3>
                  <Badge variant="outline" className="border-gray-200 dark:border-gray-800">
                    Editor de Texto
                  </Badge>
                </div>

                {/* Toolbar de Formatação */}
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={formatBold}
                      title="Negrito (Ctrl+B)"
                      className="h-8 w-8 p-0"
                    >
                      <Bold className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={formatItalic}
                      title="Itálico (Ctrl+I)"
                      className="h-8 w-8 p-0"
                    >
                      <Italic className="w-4 h-4" />
                    </Button>
                  </div>

                  <Separator orientation="vertical" className="h-8" />

                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={formatH1}
                      title="Título 1"
                      className="h-8 w-8 p-0"
                    >
                      <Heading1 className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={formatH2}
                      title="Título 2"
                      className="h-8 w-8 p-0"
                    >
                      <Heading2 className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={formatH3}
                      title="Título 3"
                      className="h-8 w-8 p-0"
                    >
                      <Heading3 className="w-4 h-4" />
                    </Button>
                  </div>

                  <Separator orientation="vertical" className="h-8" />

                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={formatList}
                      title="Lista com marcadores"
                      className="h-8 w-8 p-0"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={formatOrderedList}
                      title="Lista numerada"
                      className="h-8 w-8 p-0"
                    >
                      <ListOrdered className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={formatQuote}
                      title="Citação"
                      className="h-8 w-8 p-0"
                    >
                      <Quote className="w-4 h-4" />
                    </Button>
                  </div>

                  <Separator orientation="vertical" className="h-8" />

                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={formatLink}
                      title="Inserir link"
                      className="h-8 w-8 p-0"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </Button>
                  </div>

                  <Separator orientation="vertical" className="h-8" />

                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      title="Adicionar imagem"
                      className="h-8 w-8 p-0"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex-1"></div>

                  <small className="text-gray-500 flex items-center">
                    Use Markdown para formatar
                  </small>
                </div>

                {/* Área de Texto */}
                <Textarea
                  ref={textareaRef}
                  id="conteudo"
                  value={novaNewsletter.conteudo}
                  onChange={(e) => setNovaNewsletter({ ...novaNewsletter, conteudo: e.target.value })}
                  placeholder="Escreva aqui o conteúdo completo da newsletter...&#10;&#10;Use os botões acima para formatar ou digite:&#10;**negrito** ou _itálico_&#10;# Título Grande&#10;## Subtítulo&#10;- Lista com marcadores&#10;1. Lista numerada&#10;> Citação&#10;[texto do link](url)"
                  rows={20}
                  className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 resize-y font-mono"
                />
                <div className="flex items-center justify-between">
                  <small className="text-gray-500">
                    Use este campo para criar a newsletter diretamente ou anexe um PDF abaixo
                  </small>
                  <small className="text-[#000aff] dark:text-[#ac2aff]">
                    Clique em "Visualizar" para ver a formatação
                  </small>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Preview */
            <Card className="bg-white dark:bg-[#1d1d1d] border-gray-200 dark:border-gray-800">
              <CardContent className="p-6 sm:p-8 md:p-12">
                <div className="max-w-3xl mx-auto space-y-6">
                  {/* Header do Preview */}
                  <div className="text-center border-b border-gray-200 dark:border-gray-800 pb-6">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Badge className="bg-[#000aff] text-white">
                        {novaNewsletter.categoria}
                      </Badge>
                      {novaNewsletter.destaque && (
                        <Badge className="bg-yellow-500 text-white">
                          Destaque
                        </Badge>
                      )}
                    </div>
                    <h1 className="text-gray-900 dark:text-white mb-3">
                      {novaNewsletter.titulo || 'Título da Newsletter'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                      {novaNewsletter.descricao || 'Descrição resumida da newsletter'}
                    </p>
                    <small className="text-gray-500 block mt-4">
                      Publicado por {user?.nome} • {new Date().toLocaleDateString('pt-BR')}
                    </small>
                  </div>

                  {/* Conteúdo do Preview */}
                  <div className="max-w-none">
                    {novaNewsletter.conteudo ? (
                      parseMarkdown(novaNewsletter.conteudo)
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 italic text-center py-8">
                        O conteúdo da newsletter aparecerá aqui...
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Galeria de Imagens */}
          <Card className="bg-white dark:bg-[#1d1d1d] border-gray-200 dark:border-gray-800">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h3 className="text-gray-900 dark:text-white">Imagens</h3>
                  <Badge variant="outline" className="border-gray-200 dark:border-gray-800">
                    {uploadedImages.length} {uploadedImages.length === 1 ? 'imagem' : 'imagens'}
                  </Badge>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2 border-gray-200 dark:border-gray-800"
                >
                  <ImageIcon className="w-4 h-4" />
                  Adicionar Imagem
                </Button>
              </div>
              
              <div
                onDrop={handleImageDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center bg-gray-50 dark:bg-gray-900/50 hover:border-[#000aff] dark:hover:border-[#000aff] transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-900 dark:text-white mb-2">
                  Arraste imagens aqui ou clique para selecionar
                </p>
                <small className="text-gray-600 dark:text-gray-400">
                  Suporta JPG, PNG, GIF e WebP
                </small>
                <small className="block text-gray-500 dark:text-gray-500 mt-2">
                  Tamanho máximo: 5MB por imagem
                </small>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
              />

              {/* Galeria de imagens adicionadas */}
              {uploadedImages.length > 0 && (
                <div className="space-y-3">
                  <small className="text-gray-600 dark:text-gray-400">
                    Clique em uma imagem para inseri-la no conteúdo
                  </small>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {uploadedImages.map((image) => (
                      <div
                        key={image.id}
                        className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                      >
                        <div
                          onClick={() => insertImageIntoContent(image.id)}
                          className="aspect-square"
                        >
                          <img
                            src={image.url}
                            alt={image.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-2 bg-white dark:bg-gray-900">
                          <p className="text-gray-900 dark:text-white truncate">
                            {image.name}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(image.id);
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
