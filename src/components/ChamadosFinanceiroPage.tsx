/**
 * ============================================================================
 * CHAMADOS FINANCEIRO - Sistema de Solicitações Financeiras
 * ============================================================================
 * 
 * FUNCIONALIDADES GERAIS:
 * - Solicitações de compra e contratações
 * - Upload de orçamentos (arrastar, ctrl+c/ctrl+v, selecionar)
 * - Histórico de chamados com filtros
 * - Sistema de aprovação do time Financeiro
 * - Modal de detalhes com formulário de resposta
 * 
 * CAMPOS DO FORMULÁRIO:
 * - Data da solicitação, Nome completo, Setor/Departamento
 * - Centro de custo, Descrição da despesa
 * - Detalhamento do que será adquirido/contratado
 * - Justificativa, Valor, Forma de Pagamento
 * - Arquivo do Orçamento (anexos)
 * - Observações Adicionais
 * 
 * SISTEMA DE RESPOSTAS (APENAS TIME FINANCEIRO):
 * - Formulário de resposta visível apenas para colaboradores do setor Financeiro
 * - Dropdown para status: Aprovar / Recusar / Em análise
 * - Campo de justificativa (obrigatório ao recusar)
 * - Validação de campos obrigatórios
 * - Mensagens de feedback personalizadas
 * - Indicadores visuais (semáforo): ✅ Aprovado, ❌ Recusado, ⏳ Em análise
 * 
 * PARA TESTAR A VISÃO DO FINANCEIRO:
 * 1. Acesse /contexts/UserContext.tsx
 * 2. Altere setor: 'TEI' para setor: 'Financeiro'
 * 3. Recarregue a página
 * 4. Acesse: Chamados → Financeiro → Ver detalhes
 * 5. O formulário de resposta aparecerá no topo do modal
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
import { 
  FileText, 
  Upload,
  X,
  Paperclip,
  DollarSign,
  Calendar,
  Building2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';
import { FormTextarea } from './FormTextarea';
import { CurrencyInput } from './CurrencyInput';
import { DateInput } from './DateInput';
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

interface ChamadoFinanceiro {
  id: string;
  dataSolicitacao: string;
  nomeCompleto: string;
  setorDepartamento: string;
  centroCusto: string;
  descricaoDespesa: string;
  detalhamento: string;
  justificativa: string;
  valor: string;
  formaPagamento: string;
  orcamentos: FileData[];
  observacoes: string;
  
  // Controle
  status: 'Pendente' | 'Em análise' | 'Aprovado' | 'Recusado';
  dataCriacao: string;
  dataAtualizacao: string;
  
  // Resposta do Financeiro
  respostaFinanceiro?: {
    texto: string;
    autor: string;
    data: string;
    status: 'Aprovado' | 'Recusado' | 'Em análise';
  } | null;
}

type ViewMode = 'form' | 'history';
type StatusFilter = 'todos' | 'Pendente' | 'Em análise' | 'Aprovado' | 'Recusado';

interface Props {
  onBack: () => void;
  onShowMetrics?: () => void;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export function ChamadosFinanceiroPage({ onBack, onShowMetrics }: Props) {
  const { user, isSetor } = useUser();
  const isFinanceiro = isSetor('Financeiro');
  
  const [viewMode, setViewMode] = useState<ViewMode>('form');
  const [chamados, setChamados] = useState<ChamadoFinanceiro[]>([
    // Mock de dados para demonstração
    {
      id: 'FIN000001',
      dataSolicitacao: '2025-01-15',
      nomeCompleto: 'Maria Silva',
      setorDepartamento: 'Marketing',
      centroCusto: 'MKT-001',
      descricaoDespesa: 'Licença Adobe Creative Cloud',
      detalhamento: 'Renovação anual da licença Adobe Creative Cloud para equipe de design (5 usuários)',
      justificativa: 'Necessário para produção de materiais de marketing e campanhas publicitárias',
      valor: '850000', // R$ 8.500,00
      formaPagamento: 'Cartão Corporativo',
      orcamentos: [],
      observacoes: 'Urgente - licença vence em 10 dias',
      status: 'Aprovado',
      dataCriacao: '2025-01-15T10:00:00',
      dataAtualizacao: '2025-01-16T14:30:00',
      respostaFinanceiro: {
        texto: 'Solicitação aprovada. A renovação já foi processada e as licenças estarão ativas a partir de amanhã. O valor será debitado do centro de custo MKT-001 conforme solicitado.',
        autor: 'Carlos Mendes - Financeiro',
        data: '2025-01-16T14:30:00',
        status: 'Aprovado'
      }
    },
    {
      id: 'FIN000002',
      dataSolicitacao: '2025-01-14',
      nomeCompleto: 'João Santos',
      setorDepartamento: 'TEI',
      centroCusto: 'TEI-002',
      descricaoDespesa: 'Equipamento de TI',
      detalhamento: '3 notebooks Dell Inspiron 15 para novos colaboradores',
      justificativa: 'Equipamentos para novos analistas que iniciam na próxima semana',
      valor: '1200000', // R$ 12.000,00
      formaPagamento: 'Boleto Bancário',
      orcamentos: [],
      observacoes: '',
      status: 'Recusado',
      dataCriacao: '2025-01-14T09:20:00',
      dataAtualizacao: '2025-01-14T16:45:00',
      respostaFinanceiro: {
        texto: 'Solicitação recusada. Já temos 5 notebooks em estoque que podem ser utilizados. Por favor, coordene com o setor de TI para receber os equipamentos disponíveis. Caso seja necessário alguma configuração específica, favor abrir novo chamado detalhando as especificações.',
        autor: 'Ana Paula - Financeiro',
        data: '2025-01-14T16:45:00',
        status: 'Recusado'
      }
    },
    {
      id: 'FIN000003',
      dataSolicitacao: '2025-01-18',
      nomeCompleto: 'Pedro Lima',
      setorDepartamento: 'Comercial',
      centroCusto: 'COM-005',
      descricaoDespesa: 'Assinatura CRM',
      detalhamento: 'Assinatura mensal do CRM Salesforce para equipe comercial',
      justificativa: 'Ferramenta essencial para gestão de leads e pipeline de vendas',
      valor: '450000', // R$ 4.500,00
      formaPagamento: 'Débito em Conta',
      orcamentos: [],
      observacoes: '',
      status: 'Pendente',
      dataCriacao: '2025-01-18T11:00:00',
      dataAtualizacao: '2025-01-18T11:00:00',
      respostaFinanceiro: null
    }
  ]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChamado, setSelectedChamado] = useState<ChamadoFinanceiro | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [orcamentos, setOrcamentos] = useState<FileData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Estados para resposta do financeiro
  const [respostaTexto, setRespostaTexto] = useState('');
  const [respostaStatus, setRespostaStatus] = useState<'Aprovado' | 'Recusado' | 'Em análise'>('Em análise');
  const [respostaErro, setRespostaErro] = useState(false);

  // Form Data
  const [dataSolicitacao, setDataSolicitacao] = useState(''); // ✅ DateInput preenche automaticamente
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [setorDepartamento, setSetorDepartamento] = useState('');
  const [centroCusto, setCentroCusto] = useState('');
  const [descricaoDespesa, setDescricaoDespesa] = useState('');
  const [detalhamento, setDetalhamento] = useState('');
  const [justificativa, setJustificativa] = useState('');
  const [valor, setValor] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('');
  const [observacoes, setObservacoes] = useState('');

  // ============================================================================
  // FUNÇÕES DE UPLOAD DE ORÇAMENTOS
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
      setOrcamentos(prev => [...prev, fileData]);
      toast.success(`Orçamento "${file.name}" adicionado`);
    };
    reader.readAsDataURL(file);
  };

  const removeOrcamento = (index: number) => {
    setOrcamentos(prev => prev.filter((_, i) => i !== index));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (orcamentos.length === 0) {
      toast.error('É obrigatório anexar pelo menos um orçamento');
      return;
    }

    const novoChamado: ChamadoFinanceiro = {
      id: 'FIN' + Date.now().toString().slice(-6),
      dataSolicitacao,
      nomeCompleto,
      setorDepartamento,
      centroCusto,
      descricaoDespesa,
      detalhamento,
      justificativa,
      valor,
      formaPagamento,
      orcamentos,
      observacoes,
      status: 'Pendente',
      dataCriacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
      respostaFinanceiro: null,
    };

    setChamados([novoChamado, ...chamados]);
    toast.success('Solicitação financeira criada com sucesso!');
    handleClearForm();
  };

  const handleClearForm = () => {
    setDataSolicitacao(new Date().toISOString().split('T')[0]);
    setNomeCompleto('');
    setSetorDepartamento('');
    setCentroCusto('');
    setDescricaoDespesa('');
    setDetalhamento('');
    setJustificativa('');
    setValor('');
    setFormaPagamento('');
    setOrcamentos([]);
    setObservacoes('');
  };

  // ============================================================================
  // FUNÇÃO DE RESPOSTA DO FINANCEIRO
  // ============================================================================

  const handleEnviarResposta = () => {
    if (!selectedChamado || !user) return;

    // Validação: comentário obrigatório
    if (!respostaTexto.trim()) {
      setRespostaErro(true);
      toast.error('Por favor, escreva uma resposta/justificativa antes de enviar');
      return;
    }

    // Validação especial: comentário obrigatório ao recusar
    if (respostaStatus === 'Recusado' && !respostaTexto.trim()) {
      setRespostaErro(true);
      toast.error('O comentário é obrigatório ao recusar um chamado');
      return;
    }

    // Remove o erro se a validação passar
    setRespostaErro(false);

    const agora = new Date().toISOString();
    
    const chamadosAtualizados = chamados.map(chamado => {
      if (chamado.id === selectedChamado.id) {
        return {
          ...chamado,
          status: respostaStatus,
          dataAtualizacao: agora,
          respostaFinanceiro: {
            texto: respostaTexto,
            autor: `${user.nome} (Financeiro)`,
            data: agora,
            status: respostaStatus
          }
        };
      }
      return chamado;
    });

    setChamados(chamadosAtualizados);
    
    // Atualizar o chamado selecionado
    const chamadoAtualizado = chamadosAtualizados.find(c => c.id === selectedChamado.id);
    if (chamadoAtualizado) {
      setSelectedChamado(chamadoAtualizado);
    }

    // Limpar formulário de resposta
    setRespostaTexto('');
    setRespostaStatus('Em análise');

    // Mensagem de sucesso personalizada
    const mensagens = {
      'Aprovado': 'Chamado aprovado com sucesso! O solicitante será notificado.',
      'Recusado': 'Chamado recusado. O solicitante será notificado com a justificativa.',
      'Em análise': 'Status atualizado para "Em análise". O solicitante será notificado.'
    };

    toast.success(mensagens[respostaStatus]);
  };

  // ============================================================================
  // FILTROS E BUSCA
  // ============================================================================

  const filteredChamados = chamados.filter(chamado => {
    const matchStatus = statusFilter === 'todos' || chamado.status === statusFilter;
    const matchSearch = !searchTerm || 
      chamado.detalhamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chamado.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chamado.centroCusto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chamado.setorDepartamento.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const openDetailsModal = (chamado: ChamadoFinanceiro) => {
    setSelectedChamado(chamado);
    setDetailsModalOpen(true);
    // Reset form de resposta
    setRespostaTexto('');
    setRespostaStatus('Em análise');
    setRespostaErro(false);
  };

  // ============================================================================
  // FUNÇÕES AUXILIARES
  // ============================================================================

  const getStatusColor = (status: string) => {
    const colors = {
      'Pendente': 'bg-yellow-500',
      'Em análise': 'bg-blue-500',
      'Aprovado': 'bg-green-500',
      'Recusado': 'bg-red-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatCurrency = (value: string) => {
    if (!value) return '';
    const num = parseFloat(value.replace(/[^\d]/g, '')) / 100;
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Chamados Financeiro" 
        description="Solicitações de compra e contratações"
        onBack={onBack}
        actions={
          onShowMetrics && isFinanceiro && <MetricsButton onClick={onShowMetrics} />
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
          Nova Solicitação
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

      {/* FORMULÁRIO */}
      {viewMode === 'form' && (
        <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informações Básicas */}
              <div className="space-y-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-900">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <h3 className="text-green-900 dark:text-green-100">Informações do Solicitante</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <DateInput
                    label="Data da Solicitação"
                    value={dataSolicitacao}
                    onChange={setDataSolicitacao}
                    required
                  />
                  <div>
                    <Label>Nome Completo <span className="required-asterisk">*</span></Label>
                    <FormInput
                      value={nomeCompleto}
                      onChange={(e) => setNomeCompleto(e.target.value)}
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>
                  <div>
                    <Label>Centro de Custo <span className="required-asterisk">*</span></Label>
                    <FormInput
                      type="text"
                      value={centroCusto}
                      onChange={(e) => setCentroCusto(e.target.value)}
                      placeholder="Ex: Evento X, Projeto Y"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>Setor/Departamento <span className="required-asterisk">*</span></Label>
                  <FormSelect
                    value={setorDepartamento}
                    onChange={(e) => setSetorDepartamento(e.target.value)}
                    options={[
                      { value: '', label: 'Selecione o setor' },
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
                    className="w-full"
                  />
                </div>
              </div>

              {/* Detalhes da Despesa */}
              <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-900">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-blue-900 dark:text-blue-100">Detalhes da Despesa</h3>
                </div>

                <div>
                  <Label>Descrição da Despesa</Label>
                  <FormInput
                    value={descricaoDespesa}
                    onChange={(e) => {
                      if (e.target.value.length <= 50) {
                        setDescricaoDespesa(e.target.value);
                      }
                    }}
                    placeholder="Título resumido da despesa"
                    maxLength={50}
                  />
                  <small className="text-gray-500 dark:text-gray-400">
                    {descricaoDespesa.length}/50 caracteres
                  </small>
                </div>

                <div>
                  <Label>Detalhamento do que será Adquirido/Contratado <span className="required-asterisk">*</span></Label>
                  <FormTextarea
                    value={detalhamento}
                    onChange={(e) => {
                      if (e.target.value.length <= 500) {
                        setDetalhamento(e.target.value);
                      }
                    }}
                    placeholder="Descreva em detalhes o que será comprado ou contratado..."
                    rows={2}
                    maxLength={500}
                    required
                  />
                  <small className="text-gray-500 dark:text-gray-400">
                    {detalhamento.length}/500 caracteres
                  </small>
                </div>

                <div>
                  <Label>Justificativa</Label>
                  <FormTextarea
                    value={justificativa}
                    onChange={(e) => {
                      if (e.target.value.length <= 500) {
                        setJustificativa(e.target.value);
                      }
                    }}
                    placeholder="Por que essa despesa é necessária?"
                    rows={3}
                    maxLength={500}
                  />
                  <small className="text-gray-500 dark:text-gray-400">
                    {justificativa.length}/500 caracteres
                  </small>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CurrencyInput
                    value={valor}
                    onChange={setValor}
                    label="Valor"
                    required
                  />

                  <div>
                    <Label>Forma de Pagamento <span className="required-asterisk">*</span></Label>
                    <FormSelect
                      value={formaPagamento}
                      onChange={(e) => setFormaPagamento(e.target.value)}
                      options={[
                        { value: '', label: 'Selecione a forma de pagamento' },
                        { value: 'Dinheiro', label: 'Dinheiro' },
                        { value: 'PIX', label: 'PIX' },
                        { value: 'Cartão de Crédito', label: 'Cartão de Crédito' },
                        { value: 'Cartão de Débito', label: 'Cartão de Débito' },
                        { value: 'Boleto', label: 'Boleto' },
                        { value: 'Transferência Bancária', label: 'Transferência Bancária' },
                        { value: 'Cheque', label: 'Cheque' },
                        { value: 'Parcelado', label: 'Parcelado' }
                      ]}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* ÁREA DE UPLOAD DE ORÇAMENTOS */}
              <div>
                <Label>Arquivo do Orçamento <span className="required-asterisk">*</span></Label>
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="mt-2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center bg-gray-50 dark:bg-gray-900/50 hover:border-[#000aff] dark:hover:border-[#000aff] transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-900 dark:text-white mb-2">
                    Arraste orçamentos aqui ou clique para selecionar
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
                  accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.doc,.docx"
                  className="hidden"
                />

                {/* Lista de Orçamentos */}
                {orcamentos.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {orcamentos.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg"
                      >
                        {file.preview ? (
                          <img src={file.preview} alt={file.name} className="w-12 h-12 object-cover rounded" />
                        ) : (
                          <Paperclip className="w-5 h-5 text-gray-400" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900 dark:text-white truncate">{file.name}</p>
                          <small className="text-gray-500">{formatFileSize(file.size)}</small>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeOrcamento(index)}
                          className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Observações */}
              <div>
                <Label>Observações Adicionais</Label>
                <FormInput
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Informações complementares"
                />
              </div>

              {/* Botões */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <PrimaryButton type="submit" className="w-full sm:w-auto">
                  Enviar Solicitação
                </PrimaryButton>
                <PrimaryButton type="button" variant="outline" onClick={handleClearForm} className="w-full sm:w-auto">
                  Limpar Formulário
                </PrimaryButton>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* HISTÓRICO */}
      {viewMode === 'history' && (
        <div className="space-y-4">
          {/* Aviso de Permissões */}
          {!isFinanceiro && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-900">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-blue-900 dark:text-blue-100 mb-1">Informação sobre Respostas</h4>
                  <small className="text-blue-700 dark:text-blue-300">
                    Apenas colaboradores do time Financeiro podem responder e aprovar/recusar solicitações. 
                    Você pode acompanhar o status das suas solicitações nesta página.
                  </small>
                </div>
              </div>
            </div>
          )}

          {/* Filtros */}
          <div className="flex flex-wrap gap-2">
            {(['todos', 'Pendente', 'Em análise', 'Aprovado', 'Recusado'] as StatusFilter[]).map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
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
            placeholder="Buscar por Centro de Custo, Setor ou ID..."
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
                        <TableHead className="text-gray-900 dark:text-white">Centro de Custo</TableHead>
                        <TableHead className="text-gray-900 dark:text-white">Valor</TableHead>
                        <TableHead className="text-gray-900 dark:text-white">Status</TableHead>
                        <TableHead className="text-gray-900 dark:text-white"></TableHead>
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
                            <small className="text-gray-600 dark:text-gray-400">{chamado.dataSolicitacao}</small>
                          </TableCell>
                          <TableCell>
                            <p className="text-gray-900 dark:text-white">{chamado.nomeCompleto}</p>
                            <small className="text-gray-600 dark:text-gray-400">{chamado.setorDepartamento}</small>
                          </TableCell>
                          <TableCell>
                            <small className="text-gray-900 dark:text-white">{chamado.centroCusto}</small>
                          </TableCell>
                          <TableCell>
                            <p className="text-green-600 dark:text-green-400">
                              {chamado.valor ? formatCurrency(chamado.valor) : '-'}
                            </p>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(chamado.status)} text-white border-0`}>
                              {chamado.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <button
                              onClick={() => openDetailsModal(chamado)}
                              className="text-[#000aff] hover:underline"
                            >
                              <small>Ver detalhes</small>
                            </button>
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
                <p className="text-gray-600 dark:text-gray-400">Nenhuma solicitação encontrada</p>
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
                <div className="flex items-center justify-between gap-4 pr-8">
                  <DialogTitle className="text-gray-900 dark:text-white">
                    Solicitação #{selectedChamado.id}
                  </DialogTitle>
                  <Badge className={`${getStatusColor(selectedChamado.status)} text-white border-0`}>
                    {selectedChamado.status}
                  </Badge>
                </div>
                <DialogDescription>
                  Detalhes completos da solicitação financeira
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">

                {/* Formulário de Resposta - Destaque para time Financeiro */}
                {isFinanceiro && !selectedChamado.respostaFinanceiro && (
                  <div className="p-5 bg-blue-50 dark:bg-blue-950/20 rounded-xl border-2 border-blue-500 dark:border-blue-600">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">💼</span>
                      <h4 className="text-blue-900 dark:text-blue-100">Análise Financeira Pendente</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label>Status da Decisão <span className="required-asterisk">*</span></Label>
                        <FormSelect
                          value={respostaStatus}
                          onChange={(e) => setRespostaStatus(e.target.value as 'Aprovado' | 'Recusado' | 'Em análise')}
                          options={[
                            { value: 'Em análise', label: 'Em Análise' },
                            { value: 'Aprovado', label: 'Aprovar' },
                            { value: 'Recusado', label: 'Recusar' }
                          ]}
                        />
                      </div>

                      <div>
                        <Label>
                          Resposta / Justificativa <span className="required-asterisk">*</span>
                          {respostaStatus === 'Recusado' && (
                            <span className="text-red-600 dark:text-red-400 ml-2">
                              (obrigatório ao recusar)
                            </span>
                          )}
                        </Label>
                        <FormTextarea
                          value={respostaTexto}
                          onChange={(e) => {
                            setRespostaTexto(e.target.value);
                            if (respostaErro) setRespostaErro(false);
                          }}
                          placeholder={
                            respostaStatus === 'Aprovado' 
                              ? 'Digite aqui a resposta de aprovação para o solicitante...'
                              : respostaStatus === 'Recusado'
                              ? 'Digite a justificativa detalhada da recusa (OBRIGATÓRIO)...'
                              : 'Digite aqui a resposta para o solicitante...'
                          }
                          rows={4}
                          className={respostaErro ? 'border-2 border-red-500 dark:border-red-500' : ''}
                        />
                        {respostaErro && (
                          <small className="text-red-600 dark:text-red-400 mt-1 block">
                            Este campo é obrigatório
                          </small>
                        )}
                      </div>

                      <PrimaryButton
                        onClick={handleEnviarResposta}
                        variant="primary"
                        icon={<FileText className="w-4 h-4" />}
                      >
                        Enviar Resposta
                      </PrimaryButton>
                    </div>
                  </div>
                )}

                {/* Resposta do Financeiro - Destaque com cores semafóricas */}
                {selectedChamado.respostaFinanceiro && (
                  <div className={`p-5 rounded-xl border-2 ${
                    selectedChamado.respostaFinanceiro.status === 'Aprovado'
                      ? 'bg-green-50 dark:bg-green-950/20 border-green-500 dark:border-green-600'
                      : selectedChamado.respostaFinanceiro.status === 'Recusado'
                      ? 'bg-red-50 dark:bg-red-950/20 border-red-500 dark:border-red-600'
                      : 'bg-orange-50 dark:bg-orange-950/20 border-orange-500 dark:border-orange-600'
                  }`}>
                    <div className="flex items-start gap-3 mb-4">
                      <span className="text-3xl leading-none mt-0.5 flex-shrink-0">
                        {selectedChamado.respostaFinanceiro.status === 'Aprovado' 
                          ? '✅' 
                          : selectedChamado.respostaFinanceiro.status === 'Recusado'
                          ? '❌'
                          : '⏳'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className={`mb-1 ${
                          selectedChamado.respostaFinanceiro.status === 'Aprovado'
                            ? 'text-green-900 dark:text-green-100'
                            : selectedChamado.respostaFinanceiro.status === 'Recusado'
                            ? 'text-red-900 dark:text-red-100'
                            : 'text-orange-900 dark:text-orange-100'
                        }`}>Resposta do Financeiro</h4>
                        <small className="text-gray-600 dark:text-gray-400">
                          {selectedChamado.respostaFinanceiro.autor} • {new Date(selectedChamado.respostaFinanceiro.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </small>
                      </div>
                    </div>
                    <div className="pl-12">
                      <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                        {selectedChamado.respostaFinanceiro.texto}
                      </p>
                    </div>
                  </div>
                )}



                {/* Mensagem para quem não é do financeiro */}
                {!isFinanceiro && !selectedChamado.respostaFinanceiro && selectedChamado.status === 'Pendente' && (
                  <div className="p-5 bg-orange-50 dark:bg-orange-950/20 rounded-xl border-2 border-orange-200 dark:border-orange-800">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">⏳</span>
                      <div>
                        <h4 className="text-orange-900 dark:text-orange-100">Em Análise</h4>
                        <small className="text-orange-700 dark:text-orange-300">
                          Aguardando análise do time Financeiro
                        </small>
                      </div>
                    </div>
                  </div>
                )}

                {/* Informações do Solicitante */}
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                  <h4 className="text-gray-900 dark:text-white mb-3">Informações do Solicitante</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <small className="text-gray-500">Nome</small>
                      <p className="text-gray-900 dark:text-white">{selectedChamado.nomeCompleto}</p>
                    </div>
                    <div>
                      <small className="text-gray-500">Data</small>
                      <p className="text-gray-900 dark:text-white">{selectedChamado.dataSolicitacao}</p>
                    </div>
                    <div>
                      <small className="text-gray-500">Setor</small>
                      <p className="text-gray-900 dark:text-white">{selectedChamado.setorDepartamento}</p>
                    </div>
                    <div>
                      <small className="text-gray-500">Centro de Custo</small>
                      <p className="text-gray-900 dark:text-white">{selectedChamado.centroCusto}</p>
                    </div>
                  </div>
                </div>

                {/* Detalhes da Despesa */}
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                  <h4 className="text-gray-900 dark:text-white mb-3">Detalhes da Despesa</h4>
                  
                  {selectedChamado.descricaoDespesa && (
                    <div className="mb-3">
                      <small className="text-gray-500">Descrição</small>
                      <p className="text-gray-900 dark:text-white">{selectedChamado.descricaoDespesa}</p>
                    </div>
                  )}

                  <div className="mb-3">
                    <small className="text-gray-500">Detalhamento</small>
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{selectedChamado.detalhamento}</p>
                  </div>

                  {selectedChamado.justificativa && (
                    <div className="mb-3">
                      <small className="text-gray-500">Justificativa</small>
                      <p className="text-gray-900 dark:text-white">{selectedChamado.justificativa}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    {selectedChamado.valor && (
                      <div>
                        <small className="text-gray-500">Valor</small>
                        <p className="text-green-600 dark:text-green-400">{formatCurrency(selectedChamado.valor)}</p>
                      </div>
                    )}
                    <div>
                      <small className="text-gray-500">Forma de Pagamento</small>
                      <p className="text-gray-900 dark:text-white">{selectedChamado.formaPagamento}</p>
                    </div>
                  </div>
                </div>

                {/* Orçamentos */}
                {selectedChamado.orcamentos && selectedChamado.orcamentos.length > 0 && (
                  <div>
                    <small className="text-gray-500 dark:text-gray-500">Orçamentos Anexados ({selectedChamado.orcamentos.length})</small>
                    <div className="mt-2 space-y-2">
                      {selectedChamado.orcamentos.map((file, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg group">
                          {file.preview ? (
                            <a 
                              href={file.data} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex-shrink-0 hover:opacity-80 transition-opacity"
                            >
                              <img src={file.preview} alt={file.name} className="w-12 h-12 object-cover rounded cursor-pointer" />
                            </a>
                          ) : (
                            <Paperclip className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-900 dark:text-white truncate">{file.name}</p>
                            <small className="text-gray-500">{formatFileSize(file.size)}</small>
                          </div>
                          <a
                            href={file.data}
                            download={file.name}
                            className="px-3 py-1.5 bg-[#000aff] text-white rounded-lg hover:bg-[#0008dd] transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <small>Baixar</small>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Observações */}
                {selectedChamado.observacoes && (
                  <div>
                    <small className="text-gray-500 dark:text-gray-500">Observações Adicionais</small>
                    <p className="text-gray-900 dark:text-white mt-1">{selectedChamado.observacoes}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
