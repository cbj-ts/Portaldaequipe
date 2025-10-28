/**
 * ============================================================================
 * CHAMADOS TEI - Tecnologia, Experiência e Inovação
 * ============================================================================
 * 
 * TIPOS DE CHAMADOS:
 * 1. Problemas de Alunos - Cadastro, senha, acesso
 * 2. Problemas Gerais na Plataforma - Erros, bugs, funcionalidades
 * 3. Novos Eventos/Mentorias - Criação de eventos
 * 4. Atualização Cadastral - Alteração de dados de alunos
 * 
 * FUNCIONALIDADES:
 * - Formulário dinâmico baseado no tipo de chamado
 * - Upload de anexos (arrastar, ctrl+c/ctrl+v, selecionar)
 * - Histórico de chamados com filtros
 * - Sistema de prioridades
 * - Modal de detalhes
 * 
 * ============================================================================
 */

import { useState, useRef, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Checkbox } from './ui/checkbox';
import { 
  FileText, 
  Upload,
  X,
  Paperclip,
  Calendar,
  Link as LinkIcon,
  User,
  Mail,
  Phone,
  AlertCircle,
  Megaphone,
  Download,
  Archive,
  Eye,
  MessageSquare,
  Plus,
  Check,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';
import { FormTextarea } from './FormTextarea';
import { PrimaryButton } from './PrimaryButton';
import { MetricsButton, BackButton, SearchBar, PageHeader } from './common';

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

interface FileData {
  name: string;
  type: string;
  size: number;
  data: string;
  preview?: string;
}

interface Mensagem {
  id: string;
  autor: string;
  setor: string;
  texto: string;
  data: string;
  anexos?: FileData[];
}

interface ChamadoTEI {
  id: string;
  data: string;
  tipo: 'alunos' | 'plataforma' | 'eventos' | 'atualizacao';
  
  // Campos comuns
  departamento: string;
  prioridade: string;
  assunto: string;
  descricaoDetalhada: string;
  produtoCurso: string;
  anexos: FileData[];
  
  // Solicitante (preenchido automaticamente)
  solicitanteNome: string;
  solicitanteSetor: string;
  
  // Atendimento (preenchido quando TEI responder)
  atendidoPor?: string;
  
  // Campos específicos - Problemas de Alunos
  nomeAluno?: string;
  emailAluno?: string;
  telefoneAluno?: string;
  
  // Campos específicos - Eventos/Mentorias
  nomeEvento?: string;
  fimCaptacao?: string;
  linkPlanilha?: string;
  linkDocumento?: string;
  
  // Campos específicos - Atualização Cadastral
  emailOriginal?: string;
  nomeAtual?: string;
  emailAtual?: string;
  telefoneAtual?: string;
  novoNome?: string;
  novoEmail?: string;
  novoTelefone?: string;
  
  // Controle
  status: 'Pendente' | 'Em andamento' | 'Respondido' | 'Resolvido';
  dataCriacao: string;
  dataAtualizacao: string;
  resposta: string | null; // Mantido para compatibilidade, mas usar mensagens[]
  mensagens: Mensagem[];
  arquivado?: boolean; // ✅ Campo para arquivamento
}

type ViewMode = 'form' | 'history' | 'resposta'; // ✅ Adicionado modo de resposta
type StatusFilter = 'todos' | 'Pendente' | 'Em andamento' | 'Respondido' | 'Resolvido' | 'Arquivados'; // ✅ Adicionados novos status

interface Props {
  onBack: () => void;
  onShowMetrics?: () => void;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

// ============================================================================
// TIPOS - AVISOS
// ============================================================================

type CategoriaAviso = 'prioridade' | 'alerta' | 'atualizacao';

interface Aviso {
  id: string;
  titulo: string;
  data: string;
  autor: string;
  conteudo: string;
  categoria: CategoriaAviso;
  anexos?: FileData[];
  arquivado?: boolean; // ✅ Campo para arquivamento
}

export function ChamadosTEIPage({ onBack, onShowMetrics }: Props) {
  const { user, isSetor } = useUser();
  const isTEI = isSetor('TEI');
  const [viewMode, setViewMode] = useState<ViewMode>('form');
  const [chamados, setChamados] = useState<ChamadoTEI[]>([
    // Exemplo 1: Problema de Aluno
    {
      id: '1001',
      data: '21/10/2025',
      tipo: 'alunos',
      departamento: 'Suporte Tribo',
      prioridade: 'Alta',
      assunto: 'Aluno sem acesso após pagamento',
      descricaoDetalhada: 'Aluno realizou o pagamento da Tribo há 3 dias mas ainda não consegue acessar a plataforma. Já verificamos o status do pagamento e está aprovado. Enviamos o comprovante em anexo.',
      produtoCurso: 'Tribo',
      solicitanteNome: 'Maria Santos',
      solicitanteSetor: 'Suporte Tribo',
      nomeAluno: 'Carlos Eduardo Silva',
      emailAluno: 'carlos.silva@email.com',
      telefoneAluno: '(11) 98765-4321',
      anexos: [],
      status: 'Pendente',
      dataCriacao: '2025-10-21T09:15:00',
      dataAtualizacao: '2025-10-21T09:15:00',
      resposta: null,
      mensagens: []
    },
    // Exemplo 2: Problema na Plataforma
    {
      id: '1002',
      data: '20/10/2025',
      tipo: 'plataforma',
      departamento: 'Suporte Aldeia',
      prioridade: 'Média',
      assunto: 'Erro ao carregar vídeos das aulas',
      descricaoDetalhada: 'Vários alunos reportaram que os vídeos do módulo 3 não estão carregando. A página fica em loading infinito e não reproduz. O problema começou hoje pela manhã por volta das 10h.',
      produtoCurso: 'Aldeia',
      solicitanteNome: 'Fernanda Costa',
      solicitanteSetor: 'Suporte Aldeia',
      atendidoPor: 'Leonardo Henrique',
      anexos: [],
      status: 'Respondido',
      dataCriacao: '2025-10-20T14:30:00',
      dataAtualizacao: '2025-10-20T16:45:00',
      resposta: null,
      mensagens: [
        {
          id: 'm1',
          autor: 'Fernanda Costa',
          setor: 'Suporte Aldeia',
          texto: 'Estamos acompanhando. Alguma previsão de solução?',
          data: '2025-10-20T15:20:00'
        },
        {
          id: 'm2',
          autor: 'Leonardo Henrique',
          setor: 'TEI',
          texto: 'Identificamos o problema no servidor de vídeos. Já estamos trabalhando na correção. Previsão de normalização: 17h.',
          data: '2025-10-20T16:45:00'
        }
      ]
    },
    // Exemplo 3: Novo Evento
    {
      id: '1003',
      data: '19/10/2025',
      tipo: 'eventos',
      departamento: 'Live',
      prioridade: 'Alta',
      assunto: 'Criar página para Mentoria de Bitcoin',
      descricaoDetalhada: 'Precisamos criar urgentemente a página de captação para a nova Mentoria de Bitcoin que será lançada semana que vem. Segue planilha com todos os dados e documento com o conteúdo.',
      produtoCurso: 'Mentoria (Especificar)',
      solicitanteNome: 'Roberto Lima',
      solicitanteSetor: 'Live',
      atendidoPor: 'Leonardo Henrique',
      nomeEvento: 'Mentoria Bitcoin: Do Zero ao Avançado',
      fimCaptacao: '2025-10-28',
      linkPlanilha: 'https://docs.google.com/spreadsheets/d/exemplo-planilha',
      linkDocumento: 'https://docs.google.com/document/d/exemplo-documento',
      anexos: [],
      status: 'Resolvido',
      dataCriacao: '2025-10-19T11:00:00',
      dataAtualizacao: '2025-10-19T17:30:00',
      resposta: null,
      mensagens: [
        {
          id: 'm3',
          autor: 'Leonardo Henrique',
          setor: 'TEI',
          texto: 'Página criada e já está no ar! Link: https://tradestars.com.br/mentoria-bitcoin\n\nRevisei todo o conteúdo da planilha e implementei conforme solicitado.',
          data: '2025-10-19T17:30:00'
        }
      ]
    },
    // Exemplo 4: Atualização Cadastral
    {
      id: '1004',
      data: '18/10/2025',
      tipo: 'atualizacao',
      departamento: 'SDR',
      prioridade: 'Baixa',
      assunto: 'Atualizar email do aluno',
      descricaoDetalhada: 'Aluno solicitou a alteração do e-mail cadastrado pois não tem mais acesso ao e-mail antigo. Já validamos a identidade dele por telefone.',
      produtoCurso: 'Aldeia',
      solicitanteNome: 'Ana Paula Rodrigues',
      solicitanteSetor: 'SDR',
      atendidoPor: 'Leonardo Henrique',
      emailOriginal: 'joao.antigo@email.com',
      nomeAtual: 'João Pedro Santos',
      emailAtual: 'joao.antigo@email.com',
      telefoneAtual: '(21) 99876-5432',
      novoEmail: 'joao.novo@email.com',
      anexos: [],
      status: 'Em andamento',
      dataCriacao: '2025-10-18T10:20:00',
      dataAtualizacao: '2025-10-18T14:15:00',
      resposta: null,
      mensagens: [
        {
          id: 'm4',
          autor: 'Leonardo Henrique',
          setor: 'TEI',
          texto: 'Recebi a solicitação. Vou processar a atualização ainda hoje.',
          data: '2025-10-18T14:15:00'
        }
      ]
    }
  ]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChamado, setSelectedChamado] = useState<ChamadoTEI | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [anexos, setAnexos] = useState<FileData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Estado do mural de avisos
  const [avisos, setAvisos] = useState<Aviso[]>([
    {
      id: '1',
      titulo: '🚨 Servidor em Manutenção Crítica',
      data: '2024-10-17T09:15:00',
      autor: 'Leonardo Henrique',
      conteudo: 'ATENÇÃO: O servidor principal estará em manutenção emergencial das 14h às 16h de hoje.\n\nServiços afetados:\n- Plataforma de cursos\n- Sistema de pagamentos\n- Área do aluno\n\nNÃO ABRIR CHAMADOS relacionados a estes serviços durante este período.',
      categoria: 'prioridade'
    },
    {
      id: '2',
      titulo: '⚠️ Problemas no App Arena',
      data: '2024-10-13T15:19:00',
      autor: 'Leonardo Henrique',
      conteudo: 'Foi lançada uma nova atualização hoje pela manhã, orientem os alunos a atualizar o app, caso continuem apresentando problema, podem continuar solicitando os chamados com prints e modelo do celular por favor.',
      categoria: 'alerta'
    },
    {
      id: '3',
      titulo: '🔧 Alunos Upgrade',
      data: '2024-10-09T10:35:00',
      autor: 'Leonardo Henrique',
      conteudo: 'Alguns alunos que fizeram upgrade da Aldeia para Tribo estão enfrentando alguns problemas de acesso, neste caso, podem continuar solicitando chamado para esses acessos, mas já estamos trabalhando para corrigir o quanto antes.',
      categoria: 'atualizacao'
    },
    {
      id: '4',
      titulo: '📢 Sistema de Chamados',
      data: '2024-07-15T13:41:00',
      autor: 'Leonardo Henrique',
      conteudo: 'Prazo máximo para resposta com base no grau de prioridade:\n\n- Baixa: 24h\n- Média: 12h\n- Alta: 4h\n\nObs.: Lembrando que o horário de atendimento é entre às 08h e 22h.',
      categoria: 'atualizacao'
    }
  ]);
  const [novoAvisoModalOpen, setNovoAvisoModalOpen] = useState(false);
  const [novoAvisoTitulo, setNovoAvisoTitulo] = useState('');
  const [novoAvisoConteudo, setNovoAvisoConteudo] = useState('');
  const [novoAvisoCategoria, setNovoAvisoCategoria] = useState<CategoriaAviso>('atualizacao');
  const [novoAvisoAnexos, setNovoAvisoAnexos] = useState<FileData[]>([]);
  const avisoFileInputRef = useRef<HTMLInputElement>(null);
  
  // ✅ Estados para arquivamento
  const [mostrarAvisosArquivados, setMostrarAvisosArquivados] = useState(false);
  
  // ✅ Estados para tela de resposta (não é mais modal)
  const [respostaChamado, setRespostaChamado] = useState<ChamadoTEI | null>(null);
  const [respostaStatus, setRespostaStatus] = useState<'Pendente' | 'Em andamento' | 'Respondido' | 'Resolvido'>('Pendente');
  const [respostaTexto, setRespostaTexto] = useState('');
  const [respostaAnexos, setRespostaAnexos] = useState<FileData[]>([]);
  const [comunicadoAoAluno, setComunicadoAoAluno] = useState(false);
  const respostaFileInputRef = useRef<HTMLInputElement>(null);

  // Form Data
  const [tipoChamado, setTipoChamado] = useState<'alunos' | 'plataforma' | 'eventos' | 'atualizacao' | ''>('');
  
  // Campos comuns
  const [departamento, setDepartamento] = useState('');
  const [prioridade, setPrioridade] = useState('');
  const [assunto, setAssunto] = useState('');
  const [descricaoDetalhada, setDescricaoDetalhada] = useState('');
  const [produtoCurso, setProdutoCurso] = useState('');
  
  // Campos específicos - Alunos
  const [nomeAluno, setNomeAluno] = useState('');
  const [emailAluno, setEmailAluno] = useState('');
  const [telefoneAluno, setTelefoneAluno] = useState('');
  
  // Estados de validação
  const [emailAlunoError, setEmailAlunoError] = useState('');
  const [emailOriginalError, setEmailOriginalError] = useState('');
  const [emailAtualError, setEmailAtualError] = useState('');
  const [novoEmailError, setNovoEmailError] = useState('');
  
  // Campos específicos - Eventos
  const [nomeEvento, setNomeEvento] = useState('');
  const [fimCaptacao, setFimCaptacao] = useState('');
  const [linkPlanilha, setLinkPlanilha] = useState('');
  const [linkDocumento, setLinkDocumento] = useState('');
  
  // Campos específicos - Atualização Cadastral
  const [emailOriginal, setEmailOriginal] = useState('');
  const [nomeAtual, setNomeAtual] = useState('');
  const [emailAtual, setEmailAtual] = useState('');
  const [telefoneAtual, setTelefoneAtual] = useState('');
  const [novoNome, setNovoNome] = useState('');
  const [novoEmail, setNovoEmail] = useState('');
  const [novoTelefone, setNovoTelefone] = useState('');

  // ============================================================================
  // FUNÇÕES DE UPLOAD DE ANEXOS
  // ============================================================================

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(processFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files) {
      Array.from(files).forEach(processFile);
    }
  };

  const handlePaste = (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (items) {
      Array.from(items).forEach((item) => {
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) processFile(file);
        }
      });
    }
  };

  const processFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Máximo: 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const fileData: FileData = {
        name: file.name,
        type: file.type,
        size: file.size,
        data: e.target?.result as string,
        preview: file.type.startsWith('image/') ? e.target?.result as string : undefined
      };
      setAnexos(prev => [...prev, fileData]);
      toast.success(`Arquivo "${file.name}" adicionado`);
    };
    reader.readAsDataURL(file);
  };

  const removeAnexo = (index: number) => {
    setAnexos(prev => prev.filter((_, i) => i !== index));
  };

  // Abrir imagem em nova aba
  const abrirImagemNovaAba = (file: FileData) => {
    if (file.preview || file.data) {
      const imageUrl = file.preview || file.data;
      window.open(imageUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Event listeners para paste
  useEffect(() => {
    const handlePasteEvent = (e: ClipboardEvent) => handlePaste(e);
    document.addEventListener('paste', handlePasteEvent);
    return () => document.removeEventListener('paste', handlePasteEvent);
  }, []);

  // ============================================================================
  // FUNÇÕES DE FORMULÁRIO
  // ============================================================================

  const handleClearForm = () => {
    setTipoChamado('');
    setDepartamento('');
    setPrioridade('');
    setAssunto('');
    setDescricaoDetalhada('');
    setProdutoCurso('');
    setAnexos([]);
    
    // Limpar campos específicos - Alunos
    setNomeAluno('');
    setEmailAluno('');
    setTelefoneAluno('');
    
    // Limpar campos específicos - Eventos
    setNomeEvento('');
    setFimCaptacao('');
    setLinkPlanilha('');
    setLinkDocumento('');
    
    // Limpar campos específicos - Atualização Cadastral
    setEmailOriginal('');
    setNomeAtual('');
    setEmailAtual('');
    setTelefoneAtual('');
    setNovoNome('');
    setNovoEmail('');
    setNovoTelefone('');
    
    // Limpar erros de validação
    setEmailAlunoError('');
    setEmailOriginalError('');
    setEmailAtualError('');
    setNovoEmailError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!tipoChamado) {
      toast.error('Selecione o tipo de chamado');
      return;
    }

    // Validar emails antes de submeter
    if (tipoChamado === 'alunos' && emailAlunoError) {
      toast.error('Corrija o e-mail do aluno antes de enviar');
      return;
    }

    if (tipoChamado === 'atualizacao') {
      if (emailOriginalError) {
        toast.error('Corrija o e-mail original antes de enviar');
        return;
      }
      if (emailAtualError) {
        toast.error('Corrija o e-mail atual antes de enviar');
        return;
      }
      if (novoEmailError) {
        toast.error('Corrija o novo e-mail antes de enviar');
        return;
      }
    }

    const novoChamado: ChamadoTEI = {
      id: 'TEI' + Date.now().toString().slice(-6),
      data: new Date().toISOString().split('T')[0],
      tipo: tipoChamado,
      departamento,
      prioridade,
      assunto,
      descricaoDetalhada,
      produtoCurso,
      anexos,
      solicitanteNome: user?.nome || 'Usuário Desconhecido', // ✅ Preenchido automaticamente
      solicitanteSetor: user?.setor || 'Não Informado', // ✅ Preenchido automaticamente
      status: 'Pendente',
      dataCriacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
      resposta: null,
      mensagens: [], // ✅ Sistema de comunicação interna
    };

    // Adicionar campos específicos baseado no tipo
    if (tipoChamado === 'alunos') {
      novoChamado.nomeAluno = nomeAluno;
      novoChamado.emailAluno = emailAluno;
      novoChamado.telefoneAluno = telefoneAluno;
    } else if (tipoChamado === 'eventos') {
      novoChamado.nomeEvento = nomeEvento;
      novoChamado.fimCaptacao = fimCaptacao;
      novoChamado.linkPlanilha = linkPlanilha;
      novoChamado.linkDocumento = linkDocumento;
    } else if (tipoChamado === 'atualizacao') {
      novoChamado.emailOriginal = emailOriginal;
      novoChamado.nomeAtual = nomeAtual;
      novoChamado.emailAtual = emailAtual;
      novoChamado.telefoneAtual = telefoneAtual;
      novoChamado.novoNome = novoNome;
      novoChamado.novoEmail = novoEmail;
      novoChamado.novoTelefone = novoTelefone;
    }

    setChamados([novoChamado, ...chamados]);
    toast.success('Chamado TEI criado com sucesso!');
    handleClearForm();
  };

  // ============================================================================
  // FUNÇÕES DO MURAL DE AVISOS
  // ============================================================================

  const handleAvisoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(processAvisoFile);
    }
  };

  const handleAvisoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files) {
      Array.from(files).forEach(processAvisoFile);
    }
  };

  const handleAvisoPaste = (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (items && novoAvisoModalOpen) {
      Array.from(items).forEach((item) => {
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) processAvisoFile(file);
        }
      });
    }
  };

  const processAvisoFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Máximo: 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const fileData: FileData = {
        name: file.name,
        type: file.type,
        size: file.size,
        data: e.target?.result as string,
        preview: file.type.startsWith('image/') ? e.target?.result as string : undefined
      };
      setNovoAvisoAnexos(prev => [...prev, fileData]);
      toast.success(`Arquivo "${file.name}" adicionado`);
    };
    reader.readAsDataURL(file);
  };

  const removeAvisoAnexo = (index: number) => {
    setNovoAvisoAnexos(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const handlePasteEvent = (e: ClipboardEvent) => handleAvisoPaste(e);
    document.addEventListener('paste', handlePasteEvent);
    return () => document.removeEventListener('paste', handlePasteEvent);
  }, [novoAvisoModalOpen]);

  const handleNovoAviso = () => {
    if (!novoAvisoTitulo.trim()) {
      toast.error('O título do aviso é obrigatório');
      return;
    }
    
    if (!novoAvisoConteudo.trim()) {
      toast.error('O conteúdo do aviso é obrigatório');
      return;
    }

    const novoAviso: Aviso = {
      id: Date.now().toString(),
      titulo: novoAvisoTitulo,
      data: new Date().toISOString(),
      autor: 'Leonardo Henrique', // Aqui você pode pegar do contexto de usuário
      conteudo: novoAvisoConteudo,
      categoria: novoAvisoCategoria,
      anexos: novoAvisoAnexos.length > 0 ? novoAvisoAnexos : undefined
    };

    setAvisos([novoAviso, ...avisos]);
    setNovoAvisoTitulo('');
    setNovoAvisoConteudo('');
    setNovoAvisoCategoria('atualizacao');
    setNovoAvisoAnexos([]);
    setNovoAvisoModalOpen(false);
    toast.success('Aviso publicado com sucesso!');
  };

  const getCategoriaStyles = (categoria: CategoriaAviso) => {
    const styles = {
      prioridade: {
        bg: 'bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30',
        border: 'border-red-400 dark:border-red-800',
        badge: 'bg-red-600 text-white'
      },
      alerta: {
        bg: 'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30',
        border: 'border-yellow-400 dark:border-yellow-800',
        badge: 'bg-yellow-600 text-white'
      },
      atualizacao: {
        bg: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30',
        border: 'border-blue-400 dark:border-blue-800',
        badge: 'bg-[#000aff] text-white'
      }
    };
    return styles[categoria];
  };

  const getCategoriaLabel = (categoria: CategoriaAviso) => {
    const labels = {
      prioridade: 'PRIORIDADE MÁXIMA',
      alerta: 'ALERTA',
      atualizacao: 'ATUALIZAÇÃO'
    };
    return labels[categoria];
  };

  const formatarDataAviso = (dataISO: string) => {
    const data = new Date(dataISO);
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    const hora = data.getHours().toString().padStart(2, '0');
    const minuto = data.getMinutes().toString().padStart(2, '0');
    return `${dia}/${mes}/${ano} às ${hora}:${minuto}`;
  };

  // ============================================================================
  // DETALHES DO CHAMADO
  // ============================================================================

  const openDetailsModal = (chamado: ChamadoTEI) => {
    setSelectedChamado(chamado);
    setDetailsModalOpen(true);
  };

  // ============================================================================
  // FUNÇÕES AUXILIARES
  // ============================================================================

  const getTipoLabel = (tipo: string) => {
    const labels = {
      'alunos': 'Problemas de Alunos',
      'plataforma': 'Problemas na Plataforma',
      'eventos': 'Novos Eventos/Mentorias',
      'atualizacao': 'Atualização Cadastral'
    };
    return labels[tipo as keyof typeof labels] || tipo;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Pendente': 'bg-yellow-500',
      'Em andamento': 'bg-blue-500',
      'Respondido': 'bg-purple-500',
      'Resolvido': 'bg-green-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getPrioridadeColor = (prioridade: string) => {
    const colors = {
      'Baixa': 'bg-green-500',
      'Média': 'bg-yellow-500',
      'Alta': 'bg-orange-500',
      'Urgente': 'bg-red-500'
    };
    return colors[prioridade as keyof typeof colors] || 'bg-gray-500';
  };

  const getProdutoColor = (produto: string) => {
    const colors = {
      'Tribo': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'Aldeia': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'App Arena': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'Mentoria (Especificar)': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      'Perpétuo': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300'
    };
    return colors[produto as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const truncateText = (text: string, maxLength: number = 35) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Validação de email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handler para validação de email do aluno
  const handleEmailAlunoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmailAluno(value);
    if (value && !validateEmail(value)) {
      setEmailAlunoError('E-mail inválido');
    } else {
      setEmailAlunoError('');
    }
  };

  // Handler para validação de telefone (apenas números)
  const handleTelefoneChange = (value: string, setter: (val: string) => void) => {
    // Remove tudo que não é número
    const onlyNumbers = value.replace(/\D/g, '');
    // Formata telefone
    let formatted = onlyNumbers;
    if (onlyNumbers.length > 10) {
      formatted = onlyNumbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (onlyNumbers.length > 6) {
      formatted = onlyNumbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (onlyNumbers.length > 2) {
      formatted = onlyNumbers.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    }
    setter(formatted);
  };

  // Handler para email original
  const handleEmailOriginalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmailOriginal(value);
    if (value && !validateEmail(value)) {
      setEmailOriginalError('E-mail inválido');
    } else {
      setEmailOriginalError('');
    }
  };

  // Handler para email atual
  const handleEmailAtualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmailAtual(value);
    if (value && !validateEmail(value)) {
      setEmailAtualError('E-mail inválido');
    } else {
      setEmailAtualError('');
    }
  };

  // Handler para novo email
  const handleNovoEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNovoEmail(value);
    if (value && !validateEmail(value)) {
      setNovoEmailError('E-mail inválido');
    } else {
      setNovoEmailError('');
    }
  };

  // Função para abrir/baixar imagem
  const handleImageClick = (file: FileData) => {
    if (file.preview || file.data) {
      const link = document.createElement('a');
      link.href = file.data;
      link.download = file.name;
      link.target = '_blank';
      link.click();
    }
  };

  // ============================================================================
  // FUNÇÕES DE ARQUIVAMENTO
  // ============================================================================

  // Arquivar/Desarquivar aviso
  const toggleArquivarAviso = (avisoId: string) => {
    setAvisos(prev => prev.map(aviso => 
      aviso.id === avisoId 
        ? { ...aviso, arquivado: !aviso.arquivado }
        : aviso
    ));
    toast.success('Aviso atualizado');
  };

  // Arquivar/Desarquivar chamado
  const toggleArquivarChamado = (chamadoId: string) => {
    setChamados(prev => prev.map(chamado => 
      chamado.id === chamadoId 
        ? { ...chamado, arquivado: !chamado.arquivado }
        : chamado
    ));
    toast.success('Chamado atualizado');
  };

  // Abrir tela de resposta/comunicação
  const abrirTelaResposta = (chamado: ChamadoTEI) => {
    setRespostaChamado(chamado);
    setRespostaStatus(chamado.status);
    setRespostaTexto(''); // Sempre começar com campo vazio para nova mensagem
    setRespostaAnexos([]);
    setComunicadoAoAluno(false); // Resetar checkbox
    setViewMode('resposta');
  };

  // Salvar resposta do chamado
  const salvarResposta = (tipo: 'mensagem' | 'responder' | 'resolver') => {
    if (!respostaChamado) return;
    
    if (!respostaTexto.trim()) {
      toast.error('Digite uma mensagem antes de enviar');
      return;
    }

    const novaMensagem: Mensagem = {
      id: Date.now().toString(),
      autor: user?.nome || 'Usuário',
      setor: user?.setor || 'Desconhecido',
      texto: respostaTexto,
      data: new Date().toISOString(),
      anexos: respostaAnexos.length > 0 ? respostaAnexos : undefined
    };

    // Definir novo status baseado no tipo de ação e checkbox
    let novoStatus: 'Pendente' | 'Em andamento' | 'Respondido' | 'Resolvido' = respostaChamado.status;
    let mensagemSucesso = 'Mensagem enviada com sucesso!';
    
    // ✅ Se checkbox "Comunicado ao Aluno" estiver marcado, sempre marca como Resolvido
    if (comunicadoAoAluno) {
      novoStatus = 'Resolvido';
      mensagemSucesso = 'Aluno comunicado! Chamado marcado como RESOLVIDO';
    } else if (tipo === 'mensagem') {
      // Apenas enviar mensagem sem mudar status (ou mudar para "Em andamento" se estiver Pendente)
      if (respostaChamado.status === 'Pendente') {
        novoStatus = 'Em andamento';
      }
      mensagemSucesso = 'Mensagem enviada com sucesso!';
    } else if (tipo === 'responder' && isTEI) {
      novoStatus = 'Respondido'; // TEI respondeu
      mensagemSucesso = 'Resposta enviada! Chamado marcado como RESPONDIDO';
    } else if (tipo === 'resolver' && !isTEI) {
      novoStatus = 'Resolvido'; // Setor que abriu marcou como resolvido
      mensagemSucesso = 'Chamado marcado como RESOLVIDO';
    }

    // Atualizar chamado com nova mensagem
    setChamados(prev => prev.map(chamado => 
      chamado.id === respostaChamado.id 
        ? { 
            ...chamado, 
            status: novoStatus,
            mensagens: [...chamado.mensagens, novaMensagem],
            dataAtualizacao: new Date().toISOString(),
            // ✅ Atribuir automaticamente ao colaborador do TEI na primeira resposta
            atendidoPor: chamado.atendidoPor || (isTEI && user?.nome ? user.nome : chamado.atendidoPor)
          }
        : chamado
    ));

    toast.success(mensagemSucesso);
    setViewMode('history'); // Voltar para o histórico
    setRespostaChamado(null);
    setRespostaTexto('');
    setRespostaAnexos([]);
    setComunicadoAoAluno(false);
  };

  // Cancelar resposta do chamado
  const cancelarResposta = () => {
    setViewMode('history');
    setRespostaChamado(null);
    setRespostaTexto('');
    setRespostaAnexos([]);
    setComunicadoAoAluno(false);
  };

  // ============================================================================
  // FUNÇÕES DE ANEXOS DE RESPOSTA
  // ============================================================================

  const handleRespostaFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(processRespostaFile);
    }
  };

  const handleRespostaDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files) {
      Array.from(files).forEach(processRespostaFile);
    }
  };

  const processRespostaFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Máximo: 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const fileData: FileData = {
        name: file.name,
        type: file.type,
        size: file.size,
        data: e.target?.result as string,
        preview: file.type.startsWith('image/') ? e.target?.result as string : undefined
      };
      setRespostaAnexos(prev => [...prev, fileData]);
      toast.success(`Arquivo "${file.name}" adicionado`);
    };
    reader.readAsDataURL(file);
  };

  const removeRespostaAnexo = (index: number) => {
    setRespostaAnexos(prev => prev.filter((_, i) => i !== index));
  };

  // Filtrar avisos (ativos ou arquivados)
  const getAvisosFiltrados = () => {
    return avisos.filter(aviso => 
      mostrarAvisosArquivados 
        ? aviso.arquivado === true 
        : !aviso.arquivado
    );
  };

  // Ordenar avisos por prioridade e depois por data
  const getAvisosOrdenados = () => {
    const avisosFiltrados = getAvisosFiltrados();
    const prioridadeOrdem = { prioridade: 0, alerta: 1, atualizacao: 2 };
    return [...avisosFiltrados].sort((a, b) => {
      // Primeiro por categoria
      const prioridadeA = prioridadeOrdem[a.categoria];
      const prioridadeB = prioridadeOrdem[b.categoria];
      if (prioridadeA !== prioridadeB) {
        return prioridadeA - prioridadeB;
      }
      // Depois por data (mais recente primeiro)
      return new Date(b.data).getTime() - new Date(a.data).getTime();
    });
  };

  // ============================================================================
  // CÁLCULOS DERIVADOS
  // ============================================================================

  // Filtrar chamados por status e termo de busca
  const filteredChamados = chamados.filter(chamado => {
    // Filtrar por status ou arquivados
    if (statusFilter === 'Arquivados') {
      if (!chamado.arquivado) return false;
    } else if (statusFilter !== 'todos') {
      if (chamado.status !== statusFilter) return false;
      if (chamado.arquivado) return false; // Não mostrar arquivados nos outros filtros
    } else {
      // Em 'todos', não mostrar arquivados
      if (chamado.arquivado) return false;
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      const termo = searchTerm.toLowerCase();
      return (
        chamado.assunto.toLowerCase().includes(termo) ||
        (chamado.produtoCurso && chamado.produtoCurso.toLowerCase().includes(termo)) ||
        chamado.id.toLowerCase().includes(termo)
      );
    }

    return true;
  });

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Chamados TEI" 
        description="Tecnologia, Experiência e Inovação"
        onBack={onBack}
        actions={
          onShowMetrics && isTEI && <MetricsButton onClick={onShowMetrics} />
        }
      />

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => setViewMode('form')}
          className={`h-10 px-6 rounded-xl transition-colors inline-flex items-center justify-center ${
            viewMode === 'form'
              ? 'bg-[#000aff] text-white'
              : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800'
          }`}
        >
          <FileText className="w-5 h-5 inline mr-2" />
          Novo Chamado
        </button>
        <button
          onClick={() => setViewMode('history')}
          className={`h-10 px-6 rounded-xl transition-colors inline-flex items-center justify-center ${
            viewMode === 'history'
              ? 'bg-[#000aff] text-white'
              : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800'
          }`}
        >
          Histórico ({chamados.length})
        </button>
      </div>

      {/* MURAL DE AVISOS */}
      {viewMode === 'form' && (
        <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#000aff] text-white flex items-center justify-center">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-gray-900 dark:text-white">
                    {mostrarAvisosArquivados ? 'Avisos Arquivados' : 'Avisos'}
                  </h3>
                  <small className="text-gray-600 dark:text-gray-400">
                    {mostrarAvisosArquivados 
                      ? `${getAvisosFiltrados().length} arquivados` 
                      : `${getAvisosFiltrados().length} ativos`
                    }
                  </small>
                </div>
              </div>
              {isTEI && (
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setMostrarAvisosArquivados(!mostrarAvisosArquivados)}
                    className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                  >
                    {mostrarAvisosArquivados ? 'Ver Ativos' : 'Ver Arquivados'}
                  </button>
                  {!mostrarAvisosArquivados && (
                    <PrimaryButton
                      type="button"
                      onClick={() => setNovoAvisoModalOpen(true)}
                      icon={<Plus className="w-4 h-4" />}
                    >
                      Novo Aviso
                    </PrimaryButton>
                  )}
                </div>
              )}
            </div>

            {avisos.length > 0 ? (
              <Accordion type="single" collapsible className="space-y-3">
                {getAvisosOrdenados().map((aviso) => {
                  const styles = getCategoriaStyles(aviso.categoria);
                  return (
                    <AccordionItem 
                      key={aviso.id} 
                      value={aviso.id}
                      className={`rounded-xl ${styles.bg} border-2 ${styles.border} overflow-hidden`}
                    >
                      <AccordionTrigger className="px-4 py-3 hover:no-underline [&[data-state=open]]:pb-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full pr-3">
                          <div className="flex flex-col items-start gap-2">
                            <div className="flex items-center gap-3 flex-wrap">
                              <h4 className="text-gray-900 dark:text-white text-left">{aviso.titulo}</h4>
                              <Badge className={`${styles.badge} border-0 shrink-0`}>
                                {getCategoriaLabel(aviso.categoria)}
                              </Badge>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                              <small className="text-gray-600 dark:text-gray-400">
                                {formatarDataAviso(aviso.data)}
                              </small>
                              <small className="text-gray-600 dark:text-gray-400 hidden sm:block">•</small>
                              <small className="text-gray-600 dark:text-gray-400">
                                Por: {aviso.autor}
                              </small>
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      
                      <AccordionContent className="px-4 pb-4">
                        <div className="pt-3 border-t border-gray-300 dark:border-gray-700">
                          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line mb-3">
                            {aviso.conteudo}
                          </p>

                          {aviso.anexos && aviso.anexos.length > 0 && (
                            <div className="pt-3 border-t border-gray-300 dark:border-gray-700">
                              <small className="text-gray-600 dark:text-gray-400 mb-2 block">
                                Anexos ({aviso.anexos.length})
                              </small>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {aviso.anexos.map((file, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-3 p-2 rounded-lg bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-gray-700"
                                  >
                                    {file.preview ? (
                                      <img src={file.preview} alt={file.name} className="w-10 h-10 rounded object-cover" />
                                    ) : (
                                      <Paperclip className="w-5 h-5 text-gray-400" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <small className="text-gray-900 dark:text-white block truncate">{file.name}</small>
                                      <caption className="text-gray-500">{formatFileSize(file.size)}</caption>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* ✅ Botão de Arquivar (apenas para TEI) */}
                          {isTEI && (
                            <div className="pt-3 border-t border-gray-300 dark:border-gray-700 mt-3">
                              <button
                                type="button"
                                onClick={() => toggleArquivarAviso(aviso.id)}
                                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                              >
                                {aviso.arquivado ? '📂 Desarquivar' : '📥 Arquivar'}
                              </button>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            ) : (
              <div className="text-center py-8">
                <Megaphone className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400">Nenhum aviso no momento</p>
                <small className="text-gray-500 dark:text-gray-500">
                  Clique em "Novo Aviso" para publicar um comunicado
                </small>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* FORMULÁRIO */}
      {viewMode === 'form' && (
        <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Alerta de Validação */}
              {(emailAlunoError || emailOriginalError || emailAtualError || novoEmailError) && (
                <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border-2 border-red-300 dark:border-red-900 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-red-900 dark:text-red-100 mb-1">Erros de Validação</h4>
                    <small className="text-red-700 dark:text-red-300">
                      Corrija os campos destacados em vermelho antes de enviar o formulário.
                    </small>
                  </div>
                </div>
              )}

              {/* Seleção do Tipo de Chamado */}
              <div>
                <Label className="text-gray-900 dark:text-white">Tipo de Chamado <span className="required-asterisk">*</span></Label>
                <FormSelect
                  value={tipoChamado}
                  onChange={(e) => setTipoChamado(e.target.value as any)}
                  options={[
                    { value: '', label: 'Selecione o tipo de chamado' },
                    { value: 'alunos', label: 'Problemas de Alunos' },
                    { value: 'plataforma', label: 'Problemas Gerais na Plataforma' },
                    { value: 'eventos', label: 'Novos Eventos/Mentorias' },
                    { value: 'atualizacao', label: 'Atualização Cadastral' }
                  ]}
                  className="w-full"
                />
              </div>

              {/* Campos específicos por tipo */}
              {tipoChamado && (
                <>
                  {/* PROBLEMAS DE ALUNOS */}
                  {tipoChamado === 'alunos' && (
                    <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-900">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h3 className="text-blue-900 dark:text-blue-100">Chamado: Problema do Aluno</h3>
                      </div>
                      
                      {/* Dados do Aluno */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Nome do Aluno <span className="required-asterisk">*</span></Label>
                          <FormInput
                            value={nomeAluno}
                            onChange={(e) => setNomeAluno(e.target.value)}
                            placeholder="Nome completo"
                            required
                          />
                        </div>
                        <div>
                          <Label>E-mail do Aluno <span className="required-asterisk">*</span></Label>
                          <FormInput
                            type="email"
                            value={emailAluno}
                            onChange={handleEmailAlunoChange}
                            placeholder="email@exemplo.com"
                            className={emailAlunoError ? 'border-red-500 dark:border-red-500' : ''}
                            required
                          />
                          {emailAlunoError && (
                            <small className="text-red-500 mt-1 block">{emailAlunoError}</small>
                          )}
                        </div>
                        <div>
                          <Label>Telefone do Aluno <span className="required-asterisk">*</span></Label>
                          <FormInput
                            value={telefoneAluno}
                            onChange={(e) => handleTelefoneChange(e.target.value, setTelefoneAluno)}
                            placeholder="(00) 00000-0000"
                            maxLength={15}
                            required
                          />
                          <small className="text-gray-500 dark:text-gray-500 mt-1 block">Apenas números</small>
                        </div>
                      </div>

                      {/* Departamento e Prioridade */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Departamento <span className="required-asterisk">*</span></Label>
                          <FormSelect
                            value={departamento}
                            onChange={(e) => setDepartamento(e.target.value)}
                            options={[
                              { value: '', label: 'Selecione o departamento' },
                              { value: 'Administração', label: 'Administração' },
                              { value: 'BI', label: 'BI' },
                              { value: 'Cobrança', label: 'Cobrança' },
                              { value: 'Comunicação', label: 'Comunicação' },
                              { value: 'Contratos', label: 'Contratos' },
                              { value: 'Financeiro', label: 'Financeiro' },
                              { value: 'Live', label: 'Live' },
                              { value: 'RH', label: 'RH' },
                              { value: 'SDR', label: 'SDR' },
                              { value: 'Suporte Aldeia', label: 'Suporte Aldeia' },
                              { value: 'Suporte Tribo', label: 'Suporte Tribo' },
                              { value: 'TEI', label: 'TEI' },
                              { value: 'Vendas', label: 'Vendas' }
                            ]}
                            required
                          />
                        </div>

                        <div>
                          <Label>Prioridade <span className="required-asterisk">*</span></Label>
                          <FormSelect
                            value={prioridade}
                            onChange={(e) => setPrioridade(e.target.value)}
                            options={[
                              { value: '', label: 'Selecione a prioridade' },
                              { value: 'Baixa', label: 'Baixa' },
                              { value: 'Média', label: 'Média' },
                              { value: 'Alta', label: 'Alta' },
                              { value: 'Urgente', label: 'Urgente' }
                            ]}
                            required
                          />
                        </div>
                      </div>

                      {/* Assunto */}
                      <div>
                        <Label>Assunto <span className="required-asterisk">*</span></Label>
                        <FormInput
                          value={assunto}
                          onChange={(e) => setAssunto(e.target.value)}
                          placeholder="Título resumido do chamado"
                          maxLength={35}
                          required
                        />
                        <small className="text-gray-500 dark:text-gray-500 mt-1 block">
                          {assunto.length}/35 caracteres
                        </small>
                      </div>

                      {/* Descrição Detalhada */}
                      <div>
                        <Label>Descrição Detalhada <span className="required-asterisk">*</span></Label>
                        <FormTextarea
                          value={descricaoDetalhada}
                          onChange={(e) => setDescricaoDetalhada(e.target.value)}
                          placeholder="Descreva o problema do aluno em detalhes..."
                          rows={5}
                          maxLength={500}
                          required
                        />
                        <small className="text-gray-500 dark:text-gray-500 mt-1 block">
                          {descricaoDetalhada.length}/500 caracteres
                        </small>
                      </div>

                      {/* Produto */}
                      <div>
                        <Label>Produto <span className="required-asterisk">*</span></Label>
                        <FormSelect
                          value={produtoCurso}
                          onChange={(e) => setProdutoCurso(e.target.value)}
                          options={[
                            { value: '', label: 'Selecione o produto' },
                            { value: 'Tribo', label: 'Tribo' },
                            { value: 'Aldeia', label: 'Aldeia' },
                            { value: 'App Arena', label: 'App Arena' },
                            { value: 'Mentoria (Especificar)', label: 'Mentoria (Especificar)' },
                            { value: 'Perpétuo', label: 'Perpétuo' }
                          ]}
                          required
                        />
                      </div>

                      {/* Anexos */}
                      <div>
                        <Label>Anexos</Label>
                        <div
                          onDrop={handleDrop}
                          onDragOver={(e) => e.preventDefault()}
                          className="mt-2 border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-xl p-8 text-center bg-white dark:bg-blue-950/50 hover:border-[#000aff] dark:hover:border-[#000aff] transition-colors cursor-pointer"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                          <p className="text-gray-900 dark:text-white mb-2">
                            Arraste arquivos aqui ou clique para selecionar
                          </p>
                          <small className="text-gray-600 dark:text-gray-400">
                            Você também pode usar Ctrl+C / Ctrl+V para colar arquivos
                          </small>
                          <small className="block text-gray-500 dark:text-gray-500 mt-2">
                            Tamanho máximo: 10MB por arquivo
                          </small>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          onChange={handleFileSelect}
                          className="hidden"
                        />

                        {/* Lista de Anexos */}
                        {anexos.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {anexos.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 border border-blue-200 dark:border-blue-800 rounded-lg"
                              >
                                {file.preview ? (
                                  <img src={file.preview} alt={file.name} className="w-12 h-12 object-cover rounded" />
                                ) : (
                                  <Paperclip className="w-5 h-5 text-blue-400" />
                                )}
                                <div className="flex-1">
                                  <p className="text-gray-900 dark:text-white">{file.name}</p>
                                  <small className="text-gray-500 dark:text-gray-500">
                                    {(file.size / 1024).toFixed(2)} KB
                                  </small>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeAnexo(index)}
                                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* NOVOS EVENTOS/MENTORIAS */}
                  {tipoChamado === 'eventos' && (
                    <div className="space-y-4 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-xl border border-purple-200 dark:border-purple-900">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <h3 className="text-purple-900 dark:text-purple-100">Informações do Evento/Mentoria</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Nome do Evento/Mentoria <span className="required-asterisk">*</span></Label>
                          <FormInput
                            value={nomeEvento}
                            onChange={(e) => setNomeEvento(e.target.value)}
                            placeholder="Nome do evento"
                            required
                          />
                        </div>
                        <div>
                          <Label>Fim de Captação <span className="required-asterisk">*</span></Label>
                          <FormInput
                            type="date"
                            value={fimCaptacao}
                            onChange={(e) => setFimCaptacao(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Link Planilha de Controle</Label>
                          <FormInput
                            type="url"
                            value={linkPlanilha}
                            onChange={(e) => setLinkPlanilha(e.target.value)}
                            placeholder="https://..."
                          />
                        </div>
                        <div>
                          <Label>Link Documento com Informações</Label>
                          <FormInput
                            type="url"
                            value={linkDocumento}
                            onChange={(e) => setLinkDocumento(e.target.value)}
                            placeholder="https://..."
                          />
                        </div>
                      </div>

                      {/* Descrição Detalhada */}
                      <div>
                        <Label>Descrição Detalhada <span className="required-asterisk">*</span></Label>
                        <FormTextarea
                          value={descricaoDetalhada}
                          onChange={(e) => setDescricaoDetalhada(e.target.value)}
                          placeholder="Descreva o evento/mentoria em detalhes..."
                          rows={5}
                          maxLength={500}
                          required
                        />
                        <small className="text-gray-500 dark:text-gray-500 mt-1 block">
                          {descricaoDetalhada.length}/500 caracteres
                        </small>
                      </div>
                    </div>
                  )}

                  {/* ATUALIZAÇÃO CADASTRAL */}
                  {tipoChamado === 'atualizacao' && (
                    <div className="space-y-4 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-xl border border-orange-200 dark:border-orange-900">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        <h3 className="text-orange-900 dark:text-orange-100">Atualização Cadastral</h3>
                      </div>

                      <div>
                        <Label>E-mail do Aluno (Original para Busca) <span className="required-asterisk">*</span></Label>
                        <FormInput
                          type="email"
                          value={emailOriginal}
                          onChange={handleEmailOriginalChange}
                          placeholder="email.atual@exemplo.com"
                          className={emailOriginalError ? 'border-red-500 dark:border-red-500' : ''}
                          required
                        />
                        {emailOriginalError && (
                          <small className="text-red-500 mt-1 block">{emailOriginalError}</small>
                        )}
                      </div>

                      <div className="border-t border-orange-200 dark:border-orange-800 pt-4 mt-4">
                        <h4 className="text-orange-900 dark:text-orange-100 mb-3">Dados Atuais do Aluno</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label>Nome Atual</Label>
                            <FormInput
                              value={nomeAtual}
                              onChange={(e) => setNomeAtual(e.target.value)}
                              placeholder="Nome atual"
                            />
                          </div>
                          <div>
                            <Label>E-mail Atual</Label>
                            <FormInput
                              type="email"
                              value={emailAtual}
                              onChange={handleEmailAtualChange}
                              placeholder="email.atual@exemplo.com"
                              className={emailAtualError ? 'border-red-500 dark:border-red-500' : ''}
                            />
                            {emailAtualError && (
                              <small className="text-red-500 mt-1 block">{emailAtualError}</small>
                            )}
                          </div>
                          <div>
                            <Label>Telefone Atual</Label>
                            <FormInput
                              value={telefoneAtual}
                              onChange={(e) => handleTelefoneChange(e.target.value, setTelefoneAtual)}
                              placeholder="(00) 00000-0000"
                              maxLength={15}
                            />
                            <small className="text-gray-500 dark:text-gray-500 mt-1 block">Apenas números</small>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-orange-200 dark:border-orange-800 pt-4 mt-4">
                        <h4 className="text-orange-900 dark:text-orange-100 mb-3">Novos Dados (Preencher apenas o que será alterado)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label>Novo Nome</Label>
                            <FormInput
                              value={novoNome}
                              onChange={(e) => setNovoNome(e.target.value)}
                              placeholder="Novo nome"
                            />
                          </div>
                          <div>
                            <Label>Novo E-mail</Label>
                            <FormInput
                              type="email"
                              value={novoEmail}
                              onChange={handleNovoEmailChange}
                              placeholder="novo.email@exemplo.com"
                              className={novoEmailError ? 'border-red-500 dark:border-red-500' : ''}
                            />
                            {novoEmailError && (
                              <small className="text-red-500 mt-1 block">{novoEmailError}</small>
                            )}
                          </div>
                          <div>
                            <Label>Novo Telefone</Label>
                            <FormInput
                              value={novoTelefone}
                              onChange={(e) => handleTelefoneChange(e.target.value, setNovoTelefone)}
                              placeholder="(00) 00000-0000"
                              maxLength={15}
                            />
                            <small className="text-gray-500 dark:text-gray-500 mt-1 block">Apenas números</small>
                          </div>
                        </div>
                      </div>

                      {/* Descrição Detalhada */}
                      <div>
                        <Label>Descrição Detalhada <span className="required-asterisk">*</span></Label>
                        <FormTextarea
                          value={descricaoDetalhada}
                          onChange={(e) => setDescricaoDetalhada(e.target.value)}
                          placeholder="Descreva o motivo da atualização cadastral e outras informações relevantes..."
                          rows={5}
                          maxLength={500}
                          required
                        />
                        <small className="text-gray-500 dark:text-gray-500 mt-1 block">
                          {descricaoDetalhada.length}/500 caracteres
                        </small>
                      </div>
                    </div>
                  )}

                  {/* PROBLEMAS NA PLATAFORMA */}
                  {tipoChamado === 'plataforma' && (
                    <div className="space-y-4 p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-900">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        <h3 className="text-red-900 dark:text-red-100">Problema na Plataforma</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Departamento <span className="required-asterisk">*</span></Label>
                          <FormSelect
                            value={departamento}
                            onChange={(e) => setDepartamento(e.target.value)}
                            options={[
                              { value: '', label: 'Selecione o departamento' },
                              { value: 'Administração', label: 'Administração' },
                              { value: 'BI', label: 'BI' },
                              { value: 'Cobrança', label: 'Cobrança' },
                              { value: 'Comunicação', label: 'Comunicação' },
                              { value: 'Contratos', label: 'Contratos' },
                              { value: 'Financeiro', label: 'Financeiro' },
                              { value: 'Live', label: 'Live' },
                              { value: 'RH', label: 'RH' },
                              { value: 'SDR', label: 'SDR' },
                              { value: 'Suporte Aldeia', label: 'Suporte Aldeia' },
                              { value: 'Suporte Tribo', label: 'Suporte Tribo' },
                              { value: 'TEI', label: 'TEI' },
                              { value: 'Vendas', label: 'Vendas' }
                            ]}
                            required
                          />
                        </div>

                        <div>
                          <Label>Prioridade <span className="required-asterisk">*</span></Label>
                          <FormSelect
                            value={prioridade}
                            onChange={(e) => setPrioridade(e.target.value)}
                            options={[
                              { value: '', label: 'Selecione a prioridade' },
                              { value: 'Baixa', label: 'Baixa' },
                              { value: 'Média', label: 'Média' },
                              { value: 'Alta', label: 'Alta' },
                              { value: 'Urgente', label: 'Urgente' }
                            ]}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Assunto <span className="required-asterisk">*</span></Label>
                        <FormInput
                          value={assunto}
                          onChange={(e) => setAssunto(e.target.value)}
                          placeholder="Título resumido do problema"
                          maxLength={35}
                          required
                        />
                        <small className="text-gray-500 dark:text-gray-500 mt-1 block">
                          {assunto.length}/35 caracteres
                        </small>
                      </div>

                      <div>
                        <Label>Descrição Detalhada <span className="required-asterisk">*</span></Label>
                        <FormTextarea
                          value={descricaoDetalhada}
                          onChange={(e) => setDescricaoDetalhada(e.target.value)}
                          placeholder="Descreva o problema da plataforma em detalhes..."
                          rows={5}
                          maxLength={500}
                          required
                        />
                        <small className="text-gray-500 dark:text-gray-500 mt-1 block">
                          {descricaoDetalhada.length}/500 caracteres
                        </small>
                      </div>

                      <div>
                        <Label>Produto <span className="required-asterisk">*</span></Label>
                        <FormSelect
                          value={produtoCurso}
                          onChange={(e) => setProdutoCurso(e.target.value)}
                          options={[
                            { value: '', label: 'Selecione o produto' },
                            { value: 'Tribo', label: 'Tribo' },
                            { value: 'Aldeia', label: 'Aldeia' },
                            { value: 'App Arena', label: 'App Arena' },
                            { value: 'Mentoria (Especificar)', label: 'Mentoria (Especificar)' },
                            { value: 'Perpétuo', label: 'Perpétuo' }
                          ]}
                          required
                        />
                      </div>

                      {/* Anexos */}
                      <div>
                        <Label>Anexos</Label>
                        <div
                          onDrop={handleDrop}
                          onDragOver={(e) => e.preventDefault()}
                          className="mt-2 border-2 border-dashed border-red-300 dark:border-red-700 rounded-xl p-8 text-center bg-white dark:bg-red-950/50 hover:border-[#000aff] dark:hover:border-[#000aff] transition-colors cursor-pointer"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="w-12 h-12 mx-auto mb-4 text-red-400" />
                          <p className="text-gray-900 dark:text-white mb-2">
                            Arraste arquivos aqui ou clique para selecionar
                          </p>
                          <small className="text-gray-600 dark:text-gray-400">
                            Você também pode usar Ctrl+C / Ctrl+V para colar arquivos
                          </small>
                          <small className="block text-gray-500 dark:text-gray-500 mt-2">
                            Tamanho máximo: 10MB por arquivo
                          </small>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          onChange={handleFileSelect}
                          className="hidden"
                        />

                        {/* Lista de Anexos */}
                        {anexos.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {anexos.map((file, index) => (
                              <div
                                key={index}
                                className="group flex items-center gap-3 p-3 bg-white dark:bg-gray-900 border border-red-200 dark:border-red-800 rounded-lg hover:border-[#000aff] dark:hover:border-[#000aff] transition-all"
                              >
                                {file.preview ? (
                                  <div 
                                    className="relative shrink-0 cursor-pointer"
                                    onClick={() => abrirImagemNovaAba(file)}
                                  >
                                    <img 
                                      src={file.preview} 
                                      alt={file.name} 
                                      className="w-12 h-12 object-cover rounded group-hover:opacity-80 transition-opacity" 
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded">
                                      <Eye className="w-4 h-4 text-white" />
                                    </div>
                                  </div>
                                ) : (
                                  <Paperclip className="w-5 h-5 text-red-400" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-gray-900 dark:text-white truncate">{file.name}</p>
                                  <small className="text-gray-500">{formatFileSize(file.size)}</small>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeAnexo(index)}
                                  className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* CAMPOS COMUNS PARA EVENTOS E ATUALIZAÇÃO (que não tem formulário próprio completo) */}
                  {(tipoChamado === 'eventos' || tipoChamado === 'atualizacao') && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Departamento <span className="required-asterisk">*</span></Label>
                          <FormSelect
                            value={departamento}
                            onChange={(e) => setDepartamento(e.target.value)}
                            options={[
                              { value: '', label: 'Selecione o departamento' },
                              { value: 'Administração', label: 'Administração' },
                              { value: 'BI', label: 'BI' },
                              { value: 'Cobrança', label: 'Cobrança' },
                              { value: 'Comunicação', label: 'Comunicação' },
                              { value: 'Contratos', label: 'Contratos' },
                              { value: 'Financeiro', label: 'Financeiro' },
                              { value: 'Live', label: 'Live' },
                              { value: 'RH', label: 'RH' },
                              { value: 'SDR', label: 'SDR' },
                              { value: 'Suporte Aldeia', label: 'Suporte Aldeia' },
                              { value: 'Suporte Tribo', label: 'Suporte Tribo' },
                              { value: 'TEI', label: 'TEI' },
                              { value: 'Vendas', label: 'Vendas' }
                            ]}
                            required
                          />
                        </div>

                        <div>
                          <Label>Prioridade <span className="required-asterisk">*</span></Label>
                          <FormSelect
                            value={prioridade}
                            onChange={(e) => setPrioridade(e.target.value)}
                            options={[
                              { value: '', label: 'Selecione a prioridade' },
                              { value: 'Baixa', label: 'Baixa' },
                              { value: 'Média', label: 'Média' },
                              { value: 'Alta', label: 'Alta' },
                              { value: 'Urgente', label: 'Urgente' }
                            ]}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Assunto <span className="required-asterisk">*</span></Label>
                        <FormInput
                          value={assunto}
                          onChange={(e) => setAssunto(e.target.value)}
                          placeholder="Título resumido do chamado"
                          maxLength={35}
                          required
                        />
                        <small className="text-gray-500 dark:text-gray-500 mt-1 block">
                          {assunto.length}/35 caracteres
                        </small>
                      </div>

                      <div>
                        <Label>Descrição Detalhada <span className="required-asterisk">*</span></Label>
                        <FormTextarea
                          value={descricaoDetalhada}
                          onChange={(e) => setDescricaoDetalhada(e.target.value)}
                          placeholder="Descreva o problema, solicitação ou situação em detalhes..."
                          rows={5}
                          required
                        />
                      </div>

                      <div>
                        <Label>Produto <span className="required-asterisk">*</span></Label>
                        <FormSelect
                          value={produtoCurso}
                          onChange={(e) => setProdutoCurso(e.target.value)}
                          options={[
                            { value: '', label: 'Selecione o produto' },
                            { value: 'Tribo', label: 'Tribo' },
                            { value: 'Aldeia', label: 'Aldeia' },
                            { value: 'App Arena', label: 'App Arena' },
                            { value: 'Mentoria (Especificar)', label: 'Mentoria (Especificar)' },
                            { value: 'Perpétuo', label: 'Perpétuo' }
                          ]}
                          required
                        />
                      </div>

                      {/* ÁREA DE UPLOAD DE ANEXOS */}
                      <div>
                        <Label>Anexos</Label>
                        <div
                          onDrop={handleDrop}
                          onDragOver={(e) => e.preventDefault()}
                          className="mt-2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center bg-gray-50 dark:bg-gray-900/50 hover:border-[#000aff] dark:hover:border-[#000aff] transition-colors cursor-pointer"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                          <p className="text-gray-900 dark:text-white mb-2">
                            Arraste arquivos aqui ou clique para selecionar
                          </p>
                          <small className="text-gray-600 dark:text-gray-400">
                            Você também pode usar Ctrl+C / Ctrl+V para colar arquivos
                          </small>
                          <small className="block text-gray-500 dark:text-gray-500 mt-2">
                            Tamanho máximo: 10MB por arquivo
                          </small>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          onChange={handleFileSelect}
                          className="hidden"
                        />

                        {/* Lista de Anexos */}
                        {anexos.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {anexos.map((file, index) => (
                              <div
                                key={index}
                                className="group flex items-center gap-3 p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-[#000aff] dark:hover:border-[#000aff] transition-all"
                              >
                                {file.preview ? (
                                  <div 
                                    className="relative shrink-0 cursor-pointer"
                                    onClick={() => abrirImagemNovaAba(file)}
                                  >
                                    <img 
                                      src={file.preview} 
                                      alt={file.name} 
                                      className="w-12 h-12 object-cover rounded group-hover:opacity-80 transition-opacity" 
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded">
                                      <Eye className="w-4 h-4 text-white" />
                                    </div>
                                  </div>
                                ) : (
                                  <Paperclip className="w-5 h-5 text-gray-400" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-gray-900 dark:text-white truncate">{file.name}</p>
                                  <small className="text-gray-500">{formatFileSize(file.size)}</small>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeAnexo(index)}
                                  className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* Botões */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                    <PrimaryButton type="submit" className="w-full sm:w-auto">
                      Enviar Chamado
                    </PrimaryButton>
                    <PrimaryButton type="button" variant="outline" onClick={handleClearForm} className="w-full sm:w-auto">
                      Limpar Formulário
                    </PrimaryButton>
                  </div>
                </>
              )}
            </form>
          </CardContent>
        </Card>
      )}

      {/* HISTÓRICO */}
      {viewMode === 'history' && (
        <div className="space-y-4">
          {/* Filtros */}
          <div className="flex flex-wrap gap-2">
            {(isTEI 
              ? ['todos', 'Pendente', 'Em andamento', 'Respondido', 'Resolvido', 'Arquivados'] 
              : ['todos', 'Pendente', 'Em andamento', 'Respondido', 'Resolvido']
            ).map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status as StatusFilter)}
                className={`px-4 py-2 rounded-xl transition-colors ${
                  statusFilter === status
                    ? 'bg-[#000aff] text-white'
                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800'
                }`}
              >
                {status === 'todos' ? 'Todos' : status}
              </button>
            ))}
          </div>

          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por Assunto, Produto ou ID..."
          />

          {filteredChamados.length > 0 ? (
            <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-gray-200 dark:border-gray-800">
                        <TableHead className="text-gray-900 dark:text-white">ID</TableHead>
                        <TableHead className="text-gray-900 dark:text-white">Data</TableHead>
                        <TableHead className="text-gray-900 dark:text-white">Solicitante</TableHead>
                        <TableHead className="text-gray-900 dark:text-white">Assunto</TableHead>
                        <TableHead className="text-gray-900 dark:text-white">Produto</TableHead>
                        <TableHead className="text-gray-900 dark:text-white">Prioridade</TableHead>
                        <TableHead className="text-gray-900 dark:text-white">Status</TableHead>
                        <TableHead className="text-gray-900 dark:text-white">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredChamados.map(chamado => (
                        <TableRow
                          key={chamado.id}
                          className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50"
                        >
                          <TableCell>
                            <small className="text-gray-900 dark:text-white">{chamado.id}</small>
                          </TableCell>
                          <TableCell>
                            <small className="text-gray-600 dark:text-gray-400">{chamado.data}</small>
                          </TableCell>
                          <TableCell>
                            <div className="cursor-default">
                              <p className="text-gray-900 dark:text-white">{chamado.solicitanteNome}</p>
                              <small className="text-gray-500 dark:text-gray-500">{chamado.solicitanteSetor}</small>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="cursor-default">
                              {/* Nome do Aluno em destaque (quando for do tipo alunos ou atualização cadastral) */}
                              {chamado.tipo === 'alunos' && chamado.nomeAluno && (
                                <p className="uppercase mb-1">
                                  <strong className="text-gray-900 dark:text-white">{chamado.nomeAluno}</strong>
                                </p>
                              )}
                              {chamado.tipo === 'atualizacao' && chamado.nomeAtual && (
                                <p className="uppercase mb-1">
                                  <strong className="text-gray-900 dark:text-white">{chamado.nomeAtual}</strong>
                                </p>
                              )}
                              <p 
                                className="text-gray-900 dark:text-white" 
                                title={chamado.assunto}
                              >
                                {truncateText(chamado.assunto)}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {chamado.produtoCurso ? (
                              <Badge className={`${getProdutoColor(chamado.produtoCurso)} border-0`}>
                                {chamado.produtoCurso}
                              </Badge>
                            ) : (
                              <small className="text-gray-400 dark:text-gray-600">-</small>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getPrioridadeColor(chamado.prioridade)} text-white border-0`}>
                              {chamado.prioridade}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(chamado.status)} text-white border-0`}>
                              {chamado.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openDetailsModal(chamado)}
                                className="p-2 rounded-lg text-gray-900 dark:text-white hover:text-[#000aff] dark:hover:text-[#000aff] hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all duration-200"
                                title="Ver detalhes"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {/* ✅ TODOS podem acessar a comunicação interna */}
                              <button
                                onClick={() => abrirTelaResposta(chamado)}
                                className="p-2 rounded-lg text-gray-900 dark:text-white hover:text-[#ac2aff] dark:hover:text-[#ac2aff] hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all duration-200"
                                title="Comunicação interna"
                              >
                                <MessageSquare className="w-4 h-4" />
                              </button>
                              {/* ✅ Apenas TEI pode arquivar */}
                              {isTEI && (
                                <button
                                  onClick={() => toggleArquivarChamado(chamado.id)}
                                  className="p-2 rounded-lg text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                                  title={chamado.arquivado ? 'Desarquivar' : 'Arquivar'}
                                >
                                  <Archive className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
              <CardContent className="p-12 text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400">Nenhum chamado encontrado</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* MODAL DE DETALHES */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="max-w-[800px] max-h-[90vh] overflow-y-auto">
          {selectedChamado && (
            <>
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-white">
                  Chamado #{selectedChamado.id}
                </DialogTitle>
                <DialogDescription>
                  Detalhes completos do chamado de tecnologia
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div className="flex gap-2">
                  <Badge className={`${getStatusColor(selectedChamado.status)} text-white border-0`}>
                    {selectedChamado.status}
                  </Badge>
                  <Badge className={`${getPrioridadeColor(selectedChamado.prioridade)} text-white border-0`}>
                    {selectedChamado.prioridade}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <small className="text-gray-500 dark:text-gray-500">Data</small>
                    <p className="text-gray-900 dark:text-white">{selectedChamado.data}</p>
                  </div>
                  {selectedChamado.produtoCurso && (
                    <div>
                      <small className="text-gray-500 dark:text-gray-500 block">Produto</small>
                      <Badge className={`${getProdutoColor(selectedChamado.produtoCurso)} border-0 mt-1`}>
                        {selectedChamado.produtoCurso}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <small className="text-gray-500 dark:text-gray-500">Solicitante</small>
                    <p className="text-gray-900 dark:text-white">{selectedChamado.solicitanteNome}</p>
                  </div>
                  <div>
                    <small className="text-gray-500 dark:text-gray-500">Setor</small>
                    <p className="text-gray-900 dark:text-white">{selectedChamado.solicitanteSetor}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <small className="text-gray-500 dark:text-gray-500">Atribuído para</small>
                    <p className="text-gray-900 dark:text-white">
                      {selectedChamado.atendidoPor || 'Aguardando atribuição'}
                    </p>
                  </div>
                </div>

                <div>
                  <small className="text-gray-500 dark:text-gray-500">Assunto</small>
                  {/* Nome do Aluno em destaque (quando for do tipo alunos ou atualização cadastral) */}
                  {selectedChamado.tipo === 'alunos' && selectedChamado.nomeAluno && (
                    <p className="uppercase mt-1 mb-2">
                      <strong className="text-gray-900 dark:text-white">{selectedChamado.nomeAluno}</strong>
                    </p>
                  )}
                  {selectedChamado.tipo === 'atualizacao' && selectedChamado.nomeAtual && (
                    <p className="uppercase mt-1 mb-2">
                      <strong className="text-gray-900 dark:text-white">{selectedChamado.nomeAtual}</strong>
                    </p>
                  )}
                  <h3 className="text-gray-900 dark:text-white">{selectedChamado.assunto}</h3>
                </div>

                <div>
                  <small className="text-gray-500 dark:text-gray-500">Descrição Detalhada</small>
                  <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{selectedChamado.descricaoDetalhada}</p>
                </div>

                {/* Campos específicos por tipo */}
                {selectedChamado.tipo === 'alunos' && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                    <h4 className="text-blue-900 dark:text-blue-100 mb-3">Dados do Aluno</h4>
                    <div className="space-y-2">
                      <div><small className="text-gray-500">Nome:</small> <p className="text-gray-900 dark:text-white">{selectedChamado.nomeAluno}</p></div>
                      <div><small className="text-gray-500">E-mail:</small> <p className="text-gray-900 dark:text-white">{selectedChamado.emailAluno}</p></div>
                      {selectedChamado.telefoneAluno && (
                        <div><small className="text-gray-500">Telefone:</small> <p className="text-gray-900 dark:text-white">{selectedChamado.telefoneAluno}</p></div>
                      )}
                    </div>
                  </div>
                )}

                {selectedChamado.tipo === 'eventos' && (
                  <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-900">
                    <h4 className="text-purple-900 dark:text-purple-100 mb-3">Informações do Evento</h4>
                    <div className="space-y-2">
                      <div><small className="text-gray-500">Nome:</small> <p className="text-gray-900 dark:text-white">{selectedChamado.nomeEvento}</p></div>
                      <div><small className="text-gray-500">Fim de Captação:</small> <p className="text-gray-900 dark:text-white">{selectedChamado.fimCaptacao}</p></div>
                      {selectedChamado.linkPlanilha && (
                        <div><small className="text-gray-500">Planilha:</small> <a href={selectedChamado.linkPlanilha} target="_blank" rel="noopener noreferrer" className="text-[#000aff] hover:underline">{selectedChamado.linkPlanilha}</a></div>
                      )}
                      {selectedChamado.linkDocumento && (
                        <div><small className="text-gray-500">Documento:</small> <a href={selectedChamado.linkDocumento} target="_blank" rel="noopener noreferrer" className="text-[#000aff] hover:underline">{selectedChamado.linkDocumento}</a></div>
                      )}
                    </div>
                  </div>
                )}

                {selectedChamado.tipo === 'atualizacao' && (
                  <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-900">
                    <h4 className="text-orange-900 dark:text-orange-100 mb-3">Atualização Cadastral</h4>
                    <div className="space-y-4">
                      <div>
                        <small className="text-gray-500">E-mail Original:</small>
                        <p className="text-gray-900 dark:text-white">{selectedChamado.emailOriginal}</p>
                      </div>
                      {(selectedChamado.nomeAtual || selectedChamado.emailAtual || selectedChamado.telefoneAtual) && (
                        <div>
                          <h4 className="text-orange-900 dark:text-orange-100 mb-2">Dados Atuais</h4>
                          {selectedChamado.nomeAtual && <div><small className="text-gray-500">Nome:</small> <p className="text-gray-900 dark:text-white">{selectedChamado.nomeAtual}</p></div>}
                          {selectedChamado.emailAtual && <div><small className="text-gray-500">E-mail:</small> <p className="text-gray-900 dark:text-white">{selectedChamado.emailAtual}</p></div>}
                          {selectedChamado.telefoneAtual && <div><small className="text-gray-500">Telefone:</small> <p className="text-gray-900 dark:text-white">{selectedChamado.telefoneAtual}</p></div>}
                        </div>
                      )}
                      {(selectedChamado.novoNome || selectedChamado.novoEmail || selectedChamado.novoTelefone) && (
                        <div>
                          <h4 className="text-orange-900 dark:text-orange-100 mb-2">Novos Dados</h4>
                          {selectedChamado.novoNome && <div><small className="text-gray-500">Nome:</small> <p className="text-gray-900 dark:text-white">{selectedChamado.novoNome}</p></div>}
                          {selectedChamado.novoEmail && <div><small className="text-gray-500">E-mail:</small> <p className="text-gray-900 dark:text-white">{selectedChamado.novoEmail}</p></div>}
                          {selectedChamado.novoTelefone && <div><small className="text-gray-500">Telefone:</small> <p className="text-gray-900 dark:text-white">{selectedChamado.novoTelefone}</p></div>}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Anexos */}
                {selectedChamado.anexos && selectedChamado.anexos.length > 0 && (
                  <div>
                    <small className="text-gray-500 dark:text-gray-500">Anexos ({selectedChamado.anexos.length})</small>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedChamado.anexos.map((file, index) => (
                        <div 
                          key={index} 
                          className="group relative flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-[#000aff] dark:hover:border-[#000aff] transition-all cursor-pointer"
                          onClick={() => abrirImagemNovaAba(file)}
                        >
                          {file.preview ? (
                            <div className="relative shrink-0">
                              <img 
                                src={file.preview} 
                                alt={file.name} 
                                className="w-16 h-16 object-cover rounded group-hover:opacity-80 transition-opacity" 
                              />
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded">
                                <Eye className="w-6 h-6 text-white" />
                              </div>
                            </div>
                          ) : (
                            <div className="w-16 h-16 shrink-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800 rounded group-hover:bg-gray-300 dark:group-hover:bg-gray-700 transition-colors">
                              <Paperclip className="w-6 h-6 text-gray-400 group-hover:text-[#000aff] transition-colors" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-900 dark:text-white truncate">{file.name}</p>
                            <small className="text-gray-500">{formatFileSize(file.size)}</small>
                            <div className="flex items-center gap-1 mt-1">
                              <Eye className="w-3 h-3 text-[#000aff]" />
                              <small className="text-[#000aff]">Clique para visualizar</small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resposta do TEI (se houver) */}
                {selectedChamado.resposta && (
                  <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
                    <h4 className="text-green-900 dark:text-green-100 mb-2">Resolução</h4>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedChamado.resposta}</p>
                    {selectedChamado.dataAtualizacao && (
                      <small className="text-gray-500 dark:text-gray-500 mt-2 block">
                        Atualizado em: {selectedChamado.dataAtualizacao}
                      </small>
                    )}
                  </div>
                )}

                {/* Botão de Responder (apenas para TEI) */}
                {isTEI && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                    <PrimaryButton
                      type="button"
                      onClick={() => {
                        setDetailsModalOpen(false);
                        abrirTelaResposta(selectedChamado);
                      }}
                      className="w-full"
                    >
                      💬 Responder Chamado
                    </PrimaryButton>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* TELA DE RESPOSTA */}
      {viewMode === 'resposta' && respostaChamado && (
        <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            {/* Header da Tela de Resposta */}
            <div className="mb-6">
              <BackButton onClick={cancelarResposta} />
              
              <div className="mt-4 flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#ac2aff] text-white flex items-center justify-center shrink-0">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h2 className="text-gray-900 dark:text-white">Comunicação Interna</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Chamado #{respostaChamado.id} • {getTipoLabel(respostaChamado.tipo)}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Informações do Chamado (Somente Leitura) */}
              <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 space-y-6">
                <div>
                  <h3 className="text-gray-900 dark:text-white mb-4">Informações do Chamado</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <small className="text-gray-500 dark:text-gray-500">Número do Chamado</small>
                    <p className="text-gray-900 dark:text-white mt-1">{respostaChamado.id}</p>
                  </div>
                  <div>
                    <small className="text-gray-500 dark:text-gray-500">Status Atual</small>
                    <div className="mt-2">
                      <Badge className={`${getStatusColor(respostaChamado.status)} text-white border-0`}>
                        {respostaChamado.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <small className="text-gray-500 dark:text-gray-500">Prioridade</small>
                    <div className="mt-2">
                      <Badge className={`${getPrioridadeColor(respostaChamado.prioridade)} text-white border-0`}>
                        {respostaChamado.prioridade}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {respostaChamado.produtoCurso && (
                    <div>
                      <small className="text-gray-500 dark:text-gray-500">Produto</small>
                      <div className="mt-2">
                        <Badge className={`${getProdutoColor(respostaChamado.produtoCurso)} border-0`}>
                          {respostaChamado.produtoCurso}
                        </Badge>
                      </div>
                    </div>
                  )}
                  <div>
                    <small className="text-gray-500 dark:text-gray-500 block">Atribuído para</small>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {respostaChamado.atendidoPor || 'Aguardando atribuição'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <small className="text-gray-500 dark:text-gray-500">Solicitante</small>
                    <p className="text-gray-900 dark:text-white mt-1">{respostaChamado.solicitanteNome}</p>
                  </div>
                  <div>
                    <small className="text-gray-500 dark:text-gray-500">Setor do Solicitante</small>
                    <p className="text-gray-900 dark:text-white mt-1">{respostaChamado.solicitanteSetor}</p>
                  </div>
                </div>

                <div>
                  <small className="text-gray-500 dark:text-gray-500">Assunto</small>
                  {/* Nome do Aluno em destaque (quando for do tipo alunos ou atualização cadastral) */}
                  {respostaChamado.tipo === 'alunos' && respostaChamado.nomeAluno && (
                    <p className="uppercase mt-1 mb-2">
                      <strong className="text-gray-900 dark:text-white">{respostaChamado.nomeAluno}</strong>
                    </p>
                  )}
                  {respostaChamado.tipo === 'atualizacao' && respostaChamado.nomeAtual && (
                    <p className="uppercase mt-1 mb-2">
                      <strong className="text-gray-900 dark:text-white">{respostaChamado.nomeAtual}</strong>
                    </p>
                  )}
                  <p className="text-gray-900 dark:text-white mt-1">{respostaChamado.assunto}</p>
                </div>

                <div>
                  <small className="text-gray-500 dark:text-gray-500">Descrição Detalhada</small>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mt-1">{respostaChamado.descricaoDetalhada}</p>
                </div>

                {/* Campos específicos por tipo */}
                {respostaChamado.tipo === 'alunos' && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                    <h4 className="text-blue-900 dark:text-blue-100 mb-3">Dados do Aluno</h4>
                    <div className="space-y-3">
                      <div>
                        <small className="text-gray-500">Nome:</small>
                        <p className="text-gray-900 dark:text-white">{respostaChamado.nomeAluno}</p>
                      </div>
                      <div>
                        <small className="text-gray-500">E-mail:</small>
                        <p className="text-gray-900 dark:text-white">{respostaChamado.emailAluno}</p>
                      </div>
                      {respostaChamado.telefoneAluno && (
                        <div>
                          <small className="text-gray-500">Telefone:</small>
                          <p className="text-gray-900 dark:text-white">{respostaChamado.telefoneAluno}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {respostaChamado.tipo === 'eventos' && (
                  <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-900">
                    <h4 className="text-purple-900 dark:text-purple-100 mb-3">Informações do Evento</h4>
                    <div className="space-y-3">
                      <div>
                        <small className="text-gray-500">Nome:</small>
                        <p className="text-gray-900 dark:text-white">{respostaChamado.nomeEvento}</p>
                      </div>
                      <div>
                        <small className="text-gray-500">Fim de Captação:</small>
                        <p className="text-gray-900 dark:text-white">{respostaChamado.fimCaptacao}</p>
                      </div>
                      {respostaChamado.linkPlanilha && (
                        <div>
                          <small className="text-gray-500">Planilha:</small>
                          <a href={respostaChamado.linkPlanilha} target="_blank" rel="noopener noreferrer" className="text-[#000aff] hover:underline block mt-1">
                            {respostaChamado.linkPlanilha}
                          </a>
                        </div>
                      )}
                      {respostaChamado.linkDocumento && (
                        <div>
                          <small className="text-gray-500">Documento:</small>
                          <a href={respostaChamado.linkDocumento} target="_blank" rel="noopener noreferrer" className="text-[#000aff] hover:underline block mt-1">
                            {respostaChamado.linkDocumento}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {respostaChamado.tipo === 'atualizacao' && (
                  <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-900">
                    <h4 className="text-orange-900 dark:text-orange-100 mb-3">Atualização Cadastral</h4>
                    <div className="space-y-4">
                      <div>
                        <small className="text-gray-500">E-mail Original:</small>
                        <p className="text-gray-900 dark:text-white mt-1">{respostaChamado.emailOriginal}</p>
                      </div>
                      {(respostaChamado.nomeAtual || respostaChamado.emailAtual || respostaChamado.telefoneAtual) && (
                        <div>
                          <h4 className="text-orange-900 dark:text-orange-100 mb-2">Dados Atuais</h4>
                          {respostaChamado.nomeAtual && (
                            <div className="mb-2">
                              <small className="text-gray-500">Nome:</small>
                              <p className="text-gray-900 dark:text-white">{respostaChamado.nomeAtual}</p>
                            </div>
                          )}
                          {respostaChamado.emailAtual && (
                            <div className="mb-2">
                              <small className="text-gray-500">E-mail:</small>
                              <p className="text-gray-900 dark:text-white">{respostaChamado.emailAtual}</p>
                            </div>
                          )}
                          {respostaChamado.telefoneAtual && (
                            <div>
                              <small className="text-gray-500">Telefone:</small>
                              <p className="text-gray-900 dark:text-white">{respostaChamado.telefoneAtual}</p>
                            </div>
                          )}
                        </div>
                      )}
                      {(respostaChamado.novoNome || respostaChamado.novoEmail || respostaChamado.novoTelefone) && (
                        <div>
                          <h4 className="text-orange-900 dark:text-orange-100 mb-2">Novos Dados</h4>
                          {respostaChamado.novoNome && (
                            <div className="mb-2">
                              <small className="text-gray-500">Nome:</small>
                              <p className="text-gray-900 dark:text-white">{respostaChamado.novoNome}</p>
                            </div>
                          )}
                          {respostaChamado.novoEmail && (
                            <div className="mb-2">
                              <small className="text-gray-500">E-mail:</small>
                              <p className="text-gray-900 dark:text-white">{respostaChamado.novoEmail}</p>
                            </div>
                          )}
                          {respostaChamado.novoTelefone && (
                            <div>
                              <small className="text-gray-500">Telefone:</small>
                              <p className="text-gray-900 dark:text-white">{respostaChamado.novoTelefone}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Anexos */}
                {respostaChamado.anexos && respostaChamado.anexos.length > 0 && (
                  <div>
                    <small className="text-gray-500 dark:text-gray-500 mb-3 block">Anexos ({respostaChamado.anexos.length})</small>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {respostaChamado.anexos.map((file, index) => (
                        <div 
                          key={index} 
                          className="group relative flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-[#000aff] dark:hover:border-[#000aff] transition-all cursor-pointer"
                          onClick={() => abrirImagemNovaAba(file)}
                        >
                          {file.preview ? (
                            <div className="relative shrink-0">
                              <img 
                                src={file.preview} 
                                alt={file.name} 
                                className="w-16 h-16 object-cover rounded group-hover:opacity-80 transition-opacity" 
                              />
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded">
                                <Eye className="w-6 h-6 text-white" />
                              </div>
                            </div>
                          ) : (
                            <div className="w-16 h-16 shrink-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800 rounded group-hover:bg-gray-300 dark:group-hover:bg-gray-700 transition-colors">
                              <Paperclip className="w-6 h-6 text-gray-400 group-hover:text-[#000aff] transition-colors" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-900 dark:text-white truncate">{file.name}</p>
                            <small className="text-gray-500">{formatFileSize(file.size)}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* HISTÓRICO DE COMUNICAÇÃO INTERNA */}
              {respostaChamado.mensagens && respostaChamado.mensagens.length > 0 && (
                <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
                  <h3 className="text-gray-900 dark:text-white mb-4">Histórico de Comunicação</h3>
                  <div className="space-y-4">
                    {respostaChamado.mensagens.map((mensagem, index) => (
                      <div 
                        key={mensagem.id}
                        className="p-4 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800"
                      >
                        {/* Header da Mensagem */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#000aff] text-white flex items-center justify-center">
                              <span className="text-xs font-medium">
                                {mensagem.autor.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </span>
                            </div>
                            <div>
                              <p className="text-gray-900 dark:text-white">{mensagem.autor}</p>
                              <small className="text-gray-500">
                                {mensagem.setor} • {new Date(mensagem.data).toLocaleString('pt-BR')}
                              </small>
                            </div>
                          </div>
                          <Badge className="bg-[#000aff] text-white border-0">
                            #{index + 1}
                          </Badge>
                        </div>

                        {/* Conteúdo da Mensagem */}
                        <div className="pl-10">
                          {/* Nome do Aluno em Destaque (quando for do tipo alunos ou atualização cadastral) */}
                          {respostaChamado.tipo === 'alunos' && respostaChamado.nomeAluno && (
                            <p className="uppercase mb-2">
                              <strong className="text-gray-900 dark:text-white">{respostaChamado.nomeAluno}</strong>
                            </p>
                          )}
                          {respostaChamado.tipo === 'atualizacao' && respostaChamado.nomeAtual && (
                            <p className="uppercase mb-2">
                              <strong className="text-gray-900 dark:text-white">{respostaChamado.nomeAtual}</strong>
                            </p>
                          )}
                          <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{mensagem.texto}</p>
                          
                          {/* Anexos da Mensagem */}
                          {mensagem.anexos && mensagem.anexos.length > 0 && (
                            <div className="mt-3 space-y-2">
                              <small className="text-gray-500">Anexos:</small>
                              {mensagem.anexos.map((file, fileIndex) => (
                                <div
                                  key={fileIndex}
                                  className="group flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-[#000aff] dark:hover:border-[#000aff] transition-all cursor-pointer"
                                  onClick={() => abrirImagemNovaAba(file)}
                                >
                                  {file.preview ? (
                                    <div className="relative shrink-0">
                                      <img 
                                        src={file.preview} 
                                        alt={file.name} 
                                        className="w-10 h-10 object-cover rounded group-hover:opacity-80 transition-opacity" 
                                      />
                                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded">
                                        <Eye className="w-4 h-4 text-white" />
                                      </div>
                                    </div>
                                  ) : (
                                    <Paperclip className="w-4 h-4 text-gray-400 group-hover:text-[#000aff] transition-colors" />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-gray-900 dark:text-white truncate">{file.name}</p>
                                    <small className="text-gray-500">{formatFileSize(file.size)}</small>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* NOVA MENSAGEM */}
              <div className="p-6 bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 space-y-4">
                <h3 className="text-gray-900 dark:text-white">Nova Mensagem</h3>

                {/* Campo de Texto */}
                <div>
                  <Label className="text-gray-900 dark:text-white">Mensagem</Label>
                  <FormTextarea
                    value={respostaTexto}
                    onChange={(e) => setRespostaTexto(e.target.value)}
                    placeholder={isTEI 
                      ? "Digite a resposta ou atualização para o chamado..." 
                      : "Digite sua mensagem, tire dúvidas ou adicione informações..."
                    }
                    rows={6}
                    maxLength={500}
                  />
                  <small className="text-gray-500 dark:text-gray-500 mt-1 block">
                    {respostaTexto.length}/500 caracteres
                  </small>
                </div>

                {/* Checkbox: Comunicado ao Aluno */}
                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800 rounded-xl">
                  <Checkbox
                    id="comunicadoAoAluno"
                    checked={comunicadoAoAluno}
                    onCheckedChange={(checked) => setComunicadoAoAluno(checked as boolean)}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <label 
                      htmlFor="comunicadoAoAluno" 
                      className="text-gray-900 dark:text-white cursor-pointer select-none flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <strong>Comunicado ao Aluno</strong>
                    </label>
                    <small className="block text-gray-600 dark:text-gray-400 mt-1">
                      Marque esta opção quando o problema já tiver sido comunicado diretamente ao aluno. 
                      Isso marcará automaticamente o chamado como <strong className="text-green-600 dark:text-green-400">RESOLVIDO</strong>.
                    </small>
                  </div>
                </div>

                {/* Área de Upload de Anexos */}
                <div>
                  <Label className="text-gray-900 dark:text-white">Anexos (opcional)</Label>
                  <div
                    onDrop={handleRespostaDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="mt-2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 text-center bg-gray-50 dark:bg-gray-900/50 hover:border-[#000aff] dark:hover:border-[#000aff] transition-colors cursor-pointer"
                    onClick={() => respostaFileInputRef.current?.click()}
                  >
                    <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                    <p className="text-gray-900 dark:text-white mb-1">
                      Arraste arquivos aqui ou clique para selecionar
                    </p>
                    <small className="text-gray-500">
                      Tamanho máximo: 10MB por arquivo
                    </small>
                  </div>
                  <input
                    ref={respostaFileInputRef}
                    type="file"
                    multiple
                    onChange={handleRespostaFileSelect}
                    className="hidden"
                  />

                  {/* Lista de Anexos */}
                  {respostaAnexos.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {respostaAnexos.map((file, index) => (
                        <div
                          key={index}
                          className="group flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-[#000aff] dark:hover:border-[#000aff] transition-all"
                        >
                          {file.preview ? (
                            <div 
                              className="relative shrink-0 cursor-pointer"
                              onClick={() => abrirImagemNovaAba(file)}
                            >
                              <img 
                                src={file.preview} 
                                alt={file.name} 
                                className="w-12 h-12 object-cover rounded group-hover:opacity-80 transition-opacity" 
                              />
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded">
                                <Eye className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          ) : (
                            <Paperclip className="w-5 h-5 text-gray-400" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-900 dark:text-white truncate">{file.name}</p>
                            <small className="text-gray-500">{formatFileSize(file.size)}</small>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeRespostaAnexo(index)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* BOTÕES DE AÇÃO */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  type="button"
                  onClick={cancelarResposta}
                  className="h-10 px-6 rounded-xl bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors inline-flex items-center justify-center"
                >
                  <X className="w-4 h-4 inline mr-2" />
                  Cancelar
                </button>
                
                {/* Botão de Enviar Mensagem Simples (todos podem usar) */}
                <button
                  type="button"
                  onClick={() => salvarResposta('mensagem')}
                  className="h-10 px-6 rounded-xl bg-[#000aff] hover:bg-[#0008dd] text-white transition-colors inline-flex items-center justify-center"
                >
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Enviar Mensagem
                </button>
                
                {/* Botões específicos por setor */}
                {isTEI ? (
                  <PrimaryButton
                    type="button"
                    onClick={() => salvarResposta('responder')}
                    className="w-full sm:w-auto bg-[#ac2aff] hover:bg-[#9018dd]"
                  >
                    <Check className="w-4 h-4 inline mr-2" />
                    Responder e Marcar RESPONDIDO
                  </PrimaryButton>
                ) : (
                  <PrimaryButton
                    type="button"
                    onClick={() => salvarResposta('resolver')}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 inline mr-2" />
                    Marcar como RESOLVIDO
                  </PrimaryButton>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* MODAL NOVO AVISO */}
      <Dialog open={novoAvisoModalOpen} onOpenChange={setNovoAvisoModalOpen}>
        <DialogContent className="max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              Novo Aviso
            </DialogTitle>
            <DialogDescription>
              Publique um aviso para a equipe ver antes de abrir chamados
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Categoria */}
            <div>
              <Label>Categoria do Aviso <span className="required-asterisk">*</span></Label>
              <FormSelect
                value={novoAvisoCategoria}
                onChange={(e) => setNovoAvisoCategoria(e.target.value as CategoriaAviso)}
                options={[
                  { value: 'atualizacao', label: 'ATUALIZAÇÃO' },
                  { value: 'alerta', label: 'ALERTA' },
                  { value: 'prioridade', label: 'PRIORIDADE MÁXIMA' }
                ]}
                required
              />
              <small className="text-gray-500 dark:text-gray-500 mt-1 block">
                {novoAvisoCategoria === 'prioridade' && 'Emojis sugeridos: 🚨 ⛔ 🔴 ❗'}
                {novoAvisoCategoria === 'alerta' && 'Emojis sugeridos: ⚠️ ⚡ 🔔 📍'}
                {novoAvisoCategoria === 'atualizacao' && 'Emojis sugeridos: 📢 ℹ️ 🔧 ✨'}
              </small>
            </div>

            {/* Título */}
            <div>
              <Label>Título do Aviso <span className="required-asterisk">*</span></Label>
              <FormInput
                value={novoAvisoTitulo}
                onChange={(e) => setNovoAvisoTitulo(e.target.value)}
                placeholder={
                  novoAvisoCategoria === 'prioridade' 
                    ? 'Ex: 🚨 Servidor em Manutenção Crítica'
                    : novoAvisoCategoria === 'alerta'
                    ? 'Ex: ⚠️ Problemas no App Arena'
                    : 'Ex: 📢 Sistema de Chamados'
                }
                required
              />
            </div>

            {/* Conteúdo */}
            <div>
              <Label>Conteúdo <span className="required-asterisk">*</span></Label>
              <FormTextarea
                value={novoAvisoConteudo}
                onChange={(e) => setNovoAvisoConteudo(e.target.value)}
                placeholder="Digite o conteúdo do aviso... Você pode usar emojis e quebras de linha."
                rows={5}
                maxLength={500}
                required
              />
              <small className="text-gray-500 dark:text-gray-500 mt-1 block">
                {novoAvisoConteudo.length}/500 caracteres
              </small>
            </div>

            {/* Upload de Arquivos */}
            <div>
              <Label>Anexos (Opcional)</Label>
              <div
                onDrop={handleAvisoDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 text-center hover:border-[#000aff] dark:hover:border-[#000aff] transition-colors cursor-pointer"
                onClick={() => avisoFileInputRef.current?.click()}
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400 mb-1">
                  Clique para selecionar ou arraste arquivos
                </p>
                <small className="text-gray-500 dark:text-gray-500">
                  Também funciona com Ctrl+C / Ctrl+V • Máximo: 10MB por arquivo
                </small>
                <input
                  ref={avisoFileInputRef}
                  type="file"
                  multiple
                  onChange={handleAvisoFileSelect}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                />
              </div>

              {/* Lista de Anexos */}
              {novoAvisoAnexos.length > 0 && (
                <div className="mt-3 space-y-2">
                  <small className="text-gray-600 dark:text-gray-400 block">
                    Arquivos anexados ({novoAvisoAnexos.length})
                  </small>
                  {novoAvisoAnexos.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                    >
                      {file.preview ? (
                        <img src={file.preview} alt={file.name} className="w-12 h-12 rounded object-cover" />
                      ) : (
                        <Paperclip className="w-5 h-5 text-gray-400" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 dark:text-white truncate">{file.name}</p>
                        <small className="text-gray-500">{formatFileSize(file.size)}</small>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeAvisoAnexo(index);
                        }}
                        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Botões */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
              <PrimaryButton
                type="button"
                variant="outline"
                onClick={() => {
                  setNovoAvisoModalOpen(false);
                  setNovoAvisoTitulo('');
                  setNovoAvisoConteudo('');
                  setNovoAvisoCategoria('atualizacao');
                  setNovoAvisoAnexos([]);
                }}
                className="w-full sm:w-auto"
              >
                Cancelar
              </PrimaryButton>
              <PrimaryButton
                type="button"
                onClick={handleNovoAviso}
                className="w-full sm:w-auto"
              >
                Publicar Aviso
              </PrimaryButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
