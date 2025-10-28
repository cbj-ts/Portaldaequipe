/**
 * ============================================================================
 * CHAMADOS RH - VERSÃO REFATORADA
 * ============================================================================
 * Solicitações para Recursos Humanos com componentes reutilizáveis
 * 
 * TIPOS DE SOLICITAÇÃO:
 * 1. 🏖️ Solicitação de Férias
 * 2. 📝 Atualização de Dados Cadastrais
 * 3. 💰 Comprovante de Rendimentos / Holerite
 * 4. 🎁 Solicitação de Benefícios
 * 5. 📄 Declaração de Vínculo ou Frequência
 * 6. ❓ Dúvidas Gerais / Outros Assuntos
 * ============================================================================
 */

import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { FileText, Calendar as CalendarIcon, User, DollarSign, Award, FileCheck, HelpCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Card, CardContent } from './ui/card';
import { 
  PageHeader, 
  TabButton, 
  FilterButton, 
  SectionCard, 
  FileUploadArea, 
  EmptyState,
  StatusBadge,
  FormFieldGroup,
  FormField,
  FileData,
  MetricsButton,
  SearchBar
} from './common';
import { PrimaryButton } from './PrimaryButton';
import { FormSelect } from './FormSelect';
import { FormInput } from './FormInput';
import { FormTextarea } from './FormTextarea';
import { SimpleDateInput } from './SimpleDateInput';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';

// ============================================================================
// TIPOS
// ============================================================================

type TipoChamadoRH = 
  | 'ferias'
  | 'atualizacao-dados'
  | 'holerite'
  | 'beneficios'
  | 'declaracao'
  | 'duvidas';

interface ChamadoRH {
  id: string;
  tipoChamado: TipoChamadoRH;
  status: 'Pendente' | 'Em análise' | 'Concluído';
  dataCriacao: string;
  dataAtualizacao: string;
  
  // Férias
  dataInicio?: string;
  diasFerias?: string;
  vender13?: string;
  alinhadoGestor?: string;
  observacoes?: string;
  
  // Atualização de Dados
  dadosAtualizar?: string;
  documentos?: FileData[];
  
  // Holerite
  mesAno?: string;
  tipoDocumento?: string;
  
  // Benefícios
  tipoBeneficio?: string;
  descricaoBeneficio?: string;
  
  // Declaração
  tipoDeclaracao?: string;
  finalidade?: string;
  prazoNecessario?: string;
  
  // Dúvidas
  descricaoDetalhada?: string;
  
  // Resposta do RH
  respostaRH?: {
    status: 'Aprovado' | 'Recusado' | 'Em análise';
    texto: string;
    data: string;
    autor: string;
  } | null;
}

type ViewMode = 'form' | 'history';
type StatusFilter = 'todos' | 'Pendente' | 'Em análise' | 'Concluído';

interface Props {
  onBack: () => void;
  onShowMetrics?: () => void;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export function ChamadosRHPage({ onBack, onShowMetrics }: Props) {
  const { user, isSetor } = useUser();
  const isRH = isSetor('RH');
  const [viewMode, setViewMode] = useState<ViewMode>('form');
  const [chamados, setChamados] = useState<ChamadoRH[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChamado, setSelectedChamado] = useState<ChamadoRH | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Form State
  const [tipoChamado, setTipoChamado] = useState<TipoChamadoRH | ''>('');
  
  // Férias
  const [dataInicio, setDataInicio] = useState('');
  const [diasFerias, setDiasFerias] = useState('');
  const [vender13, setVender13] = useState('');
  const [alinhadoGestor, setAlinhadoGestor] = useState('');
  const [observacoes, setObservacoes] = useState('');
  
  // Atualização de Dados
  const [dadosAtualizar, setDadosAtualizar] = useState('');
  const [documentos, setDocumentos] = useState<FileData[]>([]);
  const [camposSelecionados, setCamposSelecionados] = useState<string[]>([]);
  const [dadosCadastrais, setDadosCadastrais] = useState({
    endereco: '',
    telefone: '',
    email: '',
    banco: '',
    agencia: '',
    conta: '',
    pix: '',
    estadoCivil: '',
    dependentes: '',
    outros: ''
  });
  
  // Holerite
  const [mesAno, setMesAno] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('');
  
  // Benefícios
  const [tipoBeneficio, setTipoBeneficio] = useState('');
  const [descricaoBeneficio, setDescricaoBeneficio] = useState('');
  
  // Declaração
  const [tipoDeclaracao, setTipoDeclaracao] = useState('');
  const [finalidade, setFinalidade] = useState('');
  const [prazoNecessario, setPrazoNecessario] = useState('');
  
  // Dúvidas
  const [descricaoDetalhada, setDescricaoDetalhada] = useState('');
  
  // Estados para resposta do RH
  const [respostaStatus, setRespostaStatus] = useState<'Aprovado' | 'Recusado' | 'Em análise'>('Em análise');
  const [respostaTexto, setRespostaTexto] = useState('');
  const [respostaErro, setRespostaErro] = useState(false);

  // Reset estados de resposta quando modal abre
  useEffect(() => {
    if (detailsModalOpen) {
      setRespostaStatus('Em análise');
      setRespostaTexto('');
      setRespostaErro(false);
    }
  }, [detailsModalOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!tipoChamado) {
      toast.error('Selecione o tipo de chamado');
      return;
    }

    // Validação específica de atualização de dados
    if (tipoChamado === 'atualizacao-dados') {
      if (camposSelecionados.length === 0) {
        toast.error('Selecione pelo menos um campo para atualizar');
        return;
      }
      
      // Validar se os campos selecionados foram preenchidos
      const camposVazios = camposSelecionados.filter(campo => {
        const valor = dadosCadastrais[campo as keyof typeof dadosCadastrais];
        return !valor || valor.trim() === '';
      });
      
      if (camposVazios.length > 0) {
        toast.error('Preencha todos os campos selecionados');
        return;
      }
      
      if (documentos.length === 0) {
        toast.error('É obrigatório anexar documentos comprobatórios');
        return;
      }
    }

    if (tipoChamado === 'beneficios' && documentos.length === 0) {
      toast.error('É obrigatório anexar documentos comprobatórios');
      return;
    }

    const novoChamado: ChamadoRH = {
      id: 'RH' + Date.now().toString().slice(-6),
      tipoChamado: tipoChamado as TipoChamadoRH,
      status: 'Pendente',
      dataCriacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
      respostaRH: null,
      
      // Campos específicos por tipo
      ...(tipoChamado === 'ferias' && {
        dataInicio,
        diasFerias,
        vender13,
        alinhadoGestor,
        observacoes
      }),
      ...(tipoChamado === 'atualizacao-dados' && {
        dadosAtualizar: JSON.stringify({
          camposSelecionados,
          dados: camposSelecionados.reduce((acc, campo) => {
            acc[campo] = dadosCadastrais[campo as keyof typeof dadosCadastrais];
            return acc;
          }, {} as Record<string, string>)
        }),
        documentos
      }),
      ...(tipoChamado === 'holerite' && {
        mesAno,
        tipoDocumento
      }),
      ...(tipoChamado === 'beneficios' && {
        tipoBeneficio,
        descricaoBeneficio,
        documentos
      }),
      ...(tipoChamado === 'declaracao' && {
        tipoDeclaracao,
        finalidade,
        prazoNecessario
      }),
      ...(tipoChamado === 'duvidas' && {
        descricaoDetalhada,
        documentos
      })
    };

    setChamados([novoChamado, ...chamados]);
    toast.success('Solicitação enviada com sucesso!');
    handleClearForm();
  };

  const handleClearForm = () => {
    setTipoChamado('');
    setDataInicio('');
    setDiasFerias('');
    setVender13('');
    setAlinhadoGestor('');
    setObservacoes('');
    setDadosAtualizar('');
    setDocumentos([]);
    setMesAno('');
    setTipoDocumento('');
    setTipoBeneficio('');
    setDescricaoBeneficio('');
    setTipoDeclaracao('');
    setFinalidade('');
    setPrazoNecessario('');
    setDescricaoDetalhada('');
    setCamposSelecionados([]);
    setDadosCadastrais({
      endereco: '',
      telefone: '',
      email: '',
      banco: '',
      agencia: '',
      conta: '',
      pix: '',
      estadoCivil: '',
      dependentes: '',
      outros: ''
    });
  };

  // Handler para enviar resposta do RH
  const handleEnviarResposta = () => {
    // Validação: comentário obrigatório para rejeição
    if (respostaStatus === 'Recusado' && !respostaTexto.trim()) {
      setRespostaErro(true);
      toast.error('Justificativa obrigatória ao recusar solicitação');
      return;
    }

    if (!selectedChamado) return;

    const respostaRH = {
      status: respostaStatus,
      texto: respostaTexto,
      data: new Date().toISOString(),
      autor: user?.nome || 'Sistema'
    };

    // Atualizar o chamado com a resposta
    const chamadosAtualizados = chamados.map(chamado => {
      if (chamado.id === selectedChamado.id) {
        return {
          ...chamado,
          respostaRH,
          status: respostaStatus === 'Aprovado' ? 'Concluído' : respostaStatus === 'Recusado' ? 'Concluído' : 'Em análise' as any,
          dataAtualizacao: new Date().toISOString()
        };
      }
      return chamado;
    });

    setChamados(chamadosAtualizados);
    setDetailsModalOpen(false);
    
    // Reset do formulário de resposta
    setRespostaStatus('Em análise');
    setRespostaTexto('');
    setRespostaErro(false);
    
    toast.success('Resposta enviada com sucesso!');
  };

  const filteredChamados = chamados.filter(chamado => {
    const matchStatus = statusFilter === 'todos' || chamado.status === statusFilter;
    const matchSearch = !searchTerm || 
      chamado.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getTipoLabel(chamado.tipoChamado).toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const getTipoLabel = (tipo: TipoChamadoRH) => {
    const labels = {
      'ferias': 'Férias',
      'atualizacao-dados': 'Atualização de Dados',
      'holerite': 'Holerite',
      'beneficios': 'Benefícios',
      'declaracao': 'Declaração',
      'duvidas': 'Dúvidas Gerais'
    };
    return labels[tipo] || tipo;
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Chamados RH" 
        description="Recursos Humanos"
        onBack={onBack}
        actions={
          onShowMetrics && isRH && <MetricsButton onClick={onShowMetrics} />
        }
      />

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row gap-2">
        <TabButton
          active={viewMode === 'form'}
          onClick={() => setViewMode('form')}
          icon={<FileText className="w-5 h-5" />}
        >
          Nova Solicitação
        </TabButton>
        <TabButton
          active={viewMode === 'history'}
          onClick={() => setViewMode('history')}
          count={chamados.length}
        >
          Histórico
        </TabButton>
      </div>

      {/* FORMULÁRIO */}
      {viewMode === 'form' && (
        <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Seleção do Tipo de Chamado */}
              <div>
                <Label>Tipo de Chamado <span className="required-asterisk">*</span></Label>
                <FormSelect
                  value={tipoChamado}
                  onChange={(e) => setTipoChamado(e.target.value as TipoChamadoRH | '')}
                  options={[
                    { value: '', label: 'Selecione o tipo de solicitação' },
                    { value: 'ferias', label: 'Solicitação de Férias' },
                    { value: 'atualizacao-dados', label: 'Atualização de Dados Cadastrais' },
                    { value: 'holerite', label: 'Comprovante de Rendimentos / Holerite' },
                    { value: 'beneficios', label: 'Solicitação de Benefícios' },
                    { value: 'declaracao', label: 'Declaração de Vínculo ou Frequência' },
                    { value: 'duvidas', label: 'Dúvidas Gerais / Outros Assuntos' }
                  ]}
                  className="w-full"
                />
              </div>

              {/* FÉRIAS */}
              {tipoChamado === 'ferias' && (
                <SectionCard title="Solicitação de Férias" icon={<CalendarIcon className="w-5 h-5" />} variant="blue">
                  <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                    <small className="text-orange-900 dark:text-orange-100">
                      🛑 Em caso de dúvidas, entre em contato com o seu supervisor ou com o RH
                    </small>
                  </div>

                  <FormFieldGroup columns={2}>
                    <SimpleDateInput
                      label="Data de Início"
                      value={dataInicio}
                      onChange={setDataInicio}
                      required
                    />
                    <FormField
                      label="Dias de férias"
                      type="select"
                      value={diasFerias}
                      onChange={(e) => setDiasFerias(e.target.value)}
                      options={[
                        { value: '', label: 'Selecione' },
                        { value: '10', label: '10 dias' },
                        { value: '15', label: '15 dias' },
                        { value: '20', label: '20 dias' },
                        { value: '30', label: '30 dias' }
                      ]}
                      required
                    />
                  </FormFieldGroup>

                  <FormFieldGroup columns={2}>
                    <FormField
                      label="Vender 1/3 das férias?"
                      type="select"
                      value={vender13}
                      onChange={(e) => setVender13(e.target.value)}
                      options={[
                        { value: '', label: 'Selecione' },
                        { value: 'sim', label: 'Sim' },
                        { value: 'nao', label: 'Não' }
                      ]}
                      required
                    />
                    <FormField
                      label="Já alinhado com gestor?"
                      type="select"
                      value={alinhadoGestor}
                      onChange={(e) => setAlinhadoGestor(e.target.value)}
                      options={[
                        { value: '', label: 'Selecione' },
                        { value: 'sim', label: 'Sim' },
                        { value: 'nao', label: 'Não' }
                      ]}
                      required
                    />
                  </FormFieldGroup>

                  <FormField
                    label="Observações adicionais"
                    type="textarea"
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Observações adicionais (opcional)"
                    rows={3}
                  />
                </SectionCard>
              )}

              {/* ATUALIZAÇÃO DE DADOS */}
              {tipoChamado === 'atualizacao-dados' && (
                <SectionCard title="Atualização de Dados Cadastrais" icon={<User className="w-5 h-5" />} variant="green">
                  <div>
                    <Label className="mb-3 block">Selecione os dados que deseja atualizar <span className="required-asterisk">*</span></Label>
                    <div className="space-y-3">
                      {/* Endereço */}
                      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id="campo-endereco"
                            checked={camposSelecionados.includes('endereco')}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setCamposSelecionados([...camposSelecionados, 'endereco']);
                              } else {
                                setCamposSelecionados(camposSelecionados.filter(c => c !== 'endereco'));
                                setDadosCadastrais({ ...dadosCadastrais, endereco: '' });
                              }
                            }}
                            className="mt-1"
                          />
                          <div className="flex-1 space-y-2">
                            <label htmlFor="campo-endereco" className="text-gray-900 dark:text-white cursor-pointer block">
                              Endereço Residencial
                            </label>
                            {camposSelecionados.includes('endereco') && (
                              <FormInput
                                placeholder="Digite o novo endereço completo"
                                value={dadosCadastrais.endereco}
                                onChange={(e) => setDadosCadastrais({ ...dadosCadastrais, endereco: e.target.value })}
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Telefone */}
                      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id="campo-telefone"
                            checked={camposSelecionados.includes('telefone')}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setCamposSelecionados([...camposSelecionados, 'telefone']);
                              } else {
                                setCamposSelecionados(camposSelecionados.filter(c => c !== 'telefone'));
                                setDadosCadastrais({ ...dadosCadastrais, telefone: '' });
                              }
                            }}
                            className="mt-1"
                          />
                          <div className="flex-1 space-y-2">
                            <label htmlFor="campo-telefone" className="text-gray-900 dark:text-white cursor-pointer block">
                              Telefone / Celular
                            </label>
                            {camposSelecionados.includes('telefone') && (
                              <FormInput
                                placeholder="(00) 00000-0000"
                                value={dadosCadastrais.telefone}
                                onChange={(e) => setDadosCadastrais({ ...dadosCadastrais, telefone: e.target.value })}
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* E-mail */}
                      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id="campo-email"
                            checked={camposSelecionados.includes('email')}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setCamposSelecionados([...camposSelecionados, 'email']);
                              } else {
                                setCamposSelecionados(camposSelecionados.filter(c => c !== 'email'));
                                setDadosCadastrais({ ...dadosCadastrais, email: '' });
                              }
                            }}
                            className="mt-1"
                          />
                          <div className="flex-1 space-y-2">
                            <label htmlFor="campo-email" className="text-gray-900 dark:text-white cursor-pointer block">
                              E-mail Pessoal
                            </label>
                            {camposSelecionados.includes('email') && (
                              <FormInput
                                type="email"
                                placeholder="seuemail@exemplo.com"
                                value={dadosCadastrais.email}
                                onChange={(e) => setDadosCadastrais({ ...dadosCadastrais, email: e.target.value })}
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Dados Bancários */}
                      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id="campo-banco"
                            checked={camposSelecionados.includes('banco')}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setCamposSelecionados([...camposSelecionados, 'banco']);
                              } else {
                                setCamposSelecionados(camposSelecionados.filter(c => c !== 'banco'));
                                setDadosCadastrais({ ...dadosCadastrais, banco: '', agencia: '', conta: '' });
                              }
                            }}
                            className="mt-1"
                          />
                          <div className="flex-1 space-y-3">
                            <label htmlFor="campo-banco" className="text-gray-900 dark:text-white cursor-pointer block">
                              Dados Bancários (Banco, Agência, Conta)
                            </label>
                            {camposSelecionados.includes('banco') && (
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <FormInput
                                  placeholder="Banco"
                                  value={dadosCadastrais.banco}
                                  onChange={(e) => setDadosCadastrais({ ...dadosCadastrais, banco: e.target.value })}
                                />
                                <FormInput
                                  placeholder="Agência"
                                  value={dadosCadastrais.agencia}
                                  onChange={(e) => setDadosCadastrais({ ...dadosCadastrais, agencia: e.target.value })}
                                />
                                <FormInput
                                  placeholder="Conta"
                                  value={dadosCadastrais.conta}
                                  onChange={(e) => setDadosCadastrais({ ...dadosCadastrais, conta: e.target.value })}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Chave PIX */}
                      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id="campo-pix"
                            checked={camposSelecionados.includes('pix')}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setCamposSelecionados([...camposSelecionados, 'pix']);
                              } else {
                                setCamposSelecionados(camposSelecionados.filter(c => c !== 'pix'));
                                setDadosCadastrais({ ...dadosCadastrais, pix: '' });
                              }
                            }}
                            className="mt-1"
                          />
                          <div className="flex-1 space-y-2">
                            <label htmlFor="campo-pix" className="text-gray-900 dark:text-white cursor-pointer block">
                              Chave PIX
                            </label>
                            {camposSelecionados.includes('pix') && (
                              <FormInput
                                placeholder="Digite sua chave PIX"
                                value={dadosCadastrais.pix}
                                onChange={(e) => setDadosCadastrais({ ...dadosCadastrais, pix: e.target.value })}
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Estado Civil */}
                      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id="campo-estadoCivil"
                            checked={camposSelecionados.includes('estadoCivil')}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setCamposSelecionados([...camposSelecionados, 'estadoCivil']);
                              } else {
                                setCamposSelecionados(camposSelecionados.filter(c => c !== 'estadoCivil'));
                                setDadosCadastrais({ ...dadosCadastrais, estadoCivil: '' });
                              }
                            }}
                            className="mt-1"
                          />
                          <div className="flex-1 space-y-2">
                            <label htmlFor="campo-estadoCivil" className="text-gray-900 dark:text-white cursor-pointer block">
                              Estado Civil
                            </label>
                            {camposSelecionados.includes('estadoCivil') && (
                              <FormSelect
                                value={dadosCadastrais.estadoCivil}
                                onChange={(e) => setDadosCadastrais({ ...dadosCadastrais, estadoCivil: e.target.value })}
                                options={[
                                  { value: '', label: 'Selecione' },
                                  { value: 'solteiro', label: 'Solteiro(a)' },
                                  { value: 'casado', label: 'Casado(a)' },
                                  { value: 'divorciado', label: 'Divorciado(a)' },
                                  { value: 'viuvo', label: 'Viúvo(a)' },
                                  { value: 'uniao-estavel', label: 'União Estável' }
                                ]}
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Dependentes */}
                      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id="campo-dependentes"
                            checked={camposSelecionados.includes('dependentes')}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setCamposSelecionados([...camposSelecionados, 'dependentes']);
                              } else {
                                setCamposSelecionados(camposSelecionados.filter(c => c !== 'dependentes'));
                                setDadosCadastrais({ ...dadosCadastrais, dependentes: '' });
                              }
                            }}
                            className="mt-1"
                          />
                          <div className="flex-1 space-y-2">
                            <label htmlFor="campo-dependentes" className="text-gray-900 dark:text-white cursor-pointer block">
                              Informações de Dependentes
                            </label>
                            {camposSelecionados.includes('dependentes') && (
                              <FormTextarea
                                placeholder="Liste os dependentes e suas informações (nome, data de nascimento, grau de parentesco)"
                                value={dadosCadastrais.dependentes}
                                onChange={(e) => setDadosCadastrais({ ...dadosCadastrais, dependentes: e.target.value })}
                                rows={3}
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Outros */}
                      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id="campo-outros"
                            checked={camposSelecionados.includes('outros')}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setCamposSelecionados([...camposSelecionados, 'outros']);
                              } else {
                                setCamposSelecionados(camposSelecionados.filter(c => c !== 'outros'));
                                setDadosCadastrais({ ...dadosCadastrais, outros: '' });
                              }
                            }}
                            className="mt-1"
                          />
                          <div className="flex-1 space-y-2">
                            <label htmlFor="campo-outros" className="text-gray-900 dark:text-white cursor-pointer block">
                              Outros dados
                            </label>
                            {camposSelecionados.includes('outros') && (
                              <FormTextarea
                                placeholder="Especifique outros dados que precisam ser atualizados"
                                value={dadosCadastrais.outros}
                                onChange={(e) => setDadosCadastrais({ ...dadosCadastrais, outros: e.target.value })}
                                rows={3}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <FileUploadArea
                    files={documentos}
                    onFilesChange={setDocumentos}
                    label="Documentos comprobatórios"
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                  />
                </SectionCard>
              )}

              {/* HOLERITE */}
              {tipoChamado === 'holerite' && (
                <SectionCard title="Comprovante de Rendimentos / Holerite" icon={<DollarSign className="w-5 h-5" />} variant="purple">
                  <FormFieldGroup columns={2}>
                    <div>
                      <Label>Mês/Ano <span className="required-asterisk">*</span></Label>
                      <FormInput
                        type="month"
                        value={mesAno}
                        onChange={(e) => setMesAno(e.target.value)}
                        required
                      />
                    </div>
                    <FormField
                      label="Tipo de documento"
                      type="select"
                      value={tipoDocumento}
                      onChange={(e) => setTipoDocumento(e.target.value)}
                      options={[
                        { value: '', label: 'Selecione' },
                        { value: 'holerite', label: 'Holerite' },
                        { value: 'comprovante-rendimentos', label: 'Comprovante de Rendimentos' },
                        { value: 'informe-ir', label: 'Informe de IR' }
                      ]}
                      required
                    />
                  </FormFieldGroup>
                </SectionCard>
              )}

              {/* BENEFÍCIOS */}
              {tipoChamado === 'beneficios' && (
                <SectionCard title="Solicitação de Benefícios" icon={<Award className="w-5 h-5" />} variant="orange">
                  <FormField
                    label="Tipo de benefício"
                    value={tipoBeneficio}
                    onChange={(e) => setTipoBeneficio(e.target.value)}
                    placeholder="Ex: Vale alimentação, plano de saúde, etc."
                    required
                  />

                  <FormField
                    label="Descrição da solicitação"
                    type="textarea"
                    value={descricaoBeneficio}
                    onChange={(e) => setDescricaoBeneficio(e.target.value)}
                    placeholder="Descreva detalhadamente sua solicitação"
                    rows={4}
                    required
                  />

                  <FileUploadArea
                    files={documentos}
                    onFilesChange={setDocumentos}
                    label="Documentos comprobatórios"
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                  />
                </SectionCard>
              )}

              {/* DECLARAÇÃO */}
              {tipoChamado === 'declaracao' && (
                <SectionCard title="Declaração de Vínculo ou Frequência" icon={<FileCheck className="w-5 h-5" />} variant="blue">
                  <FormField
                    label="Tipo de declaração"
                    value={tipoDeclaracao}
                    onChange={(e) => setTipoDeclaracao(e.target.value)}
                    placeholder="Ex: Declaração de vínculo empregatício"
                    required
                  />

                  <FormField
                    label="Finalidade"
                    type="textarea"
                    value={finalidade}
                    onChange={(e) => setFinalidade(e.target.value)}
                    placeholder="Para que será utilizada a declaração"
                    rows={3}
                    required
                  />

                  <SimpleDateInput
                    label="Prazo necessário"
                    value={prazoNecessario}
                    onChange={setPrazoNecessario}
                    required
                  />
                </SectionCard>
              )}

              {/* DÚVIDAS GERAIS */}
              {tipoChamado === 'duvidas' && (
                <SectionCard title="Dúvidas Gerais / Outros Assuntos" icon={<HelpCircle className="w-5 h-5" />} variant="green">
                  <FormField
                    label="Descrição detalhada"
                    type="textarea"
                    value={descricaoDetalhada}
                    onChange={(e) => setDescricaoDetalhada(e.target.value)}
                    placeholder="Descreva detalhadamente sua dúvida ou solicitação"
                    rows={5}
                    required
                  />

                  <FileUploadArea
                    files={documentos}
                    onFilesChange={setDocumentos}
                    label="Documentos relacionados"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                </SectionCard>
              )}

              {/* Botões */}
              {tipoChamado && (
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                  <PrimaryButton type="submit" className="w-full sm:w-auto">
                    Enviar Solicitação
                  </PrimaryButton>
                  <PrimaryButton type="button" variant="outline" onClick={handleClearForm} className="w-full sm:w-auto">
                    Limpar Formulário
                  </PrimaryButton>
                </div>
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
            {(['todos', 'Pendente', 'Em análise', 'Concluído'] as StatusFilter[]).map(status => (
              <FilterButton
                key={status}
                active={statusFilter === status}
                onClick={() => setStatusFilter(status)}
              >
                {status === 'todos' ? 'Todos' : status}
              </FilterButton>
            ))}
          </div>

          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por ID ou tipo de solicitação..."
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
                        <TableHead className="text-gray-900 dark:text-white">Tipo</TableHead>
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
                            <small className="text-gray-600 dark:text-gray-400">
                              {new Date(chamado.dataCriacao).toLocaleDateString('pt-BR')}
                            </small>
                          </TableCell>
                          <TableCell>
                            <p className="text-gray-900 dark:text-white">{getTipoLabel(chamado.tipoChamado)}</p>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={chamado.status} />
                          </TableCell>
                          <TableCell>
                            <button
                              onClick={() => {
                                setSelectedChamado(chamado);
                                setDetailsModalOpen(true);
                              }}
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
            <EmptyState
              icon={<FileText className="w-16 h-16" />}
              title="Nenhuma solicitação encontrada"
              description="Tente ajustar os filtros ou crie uma nova solicitação"
            />
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
                  <StatusBadge status={selectedChamado.status} />
                </div>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                  Detalhes completos da solicitação de RH
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">

                {/* Formulário de Resposta - Destaque para time RH */}
                {isRH && !selectedChamado.respostaRH && (
                  <div className="p-5 bg-purple-50 dark:bg-purple-950/20 rounded-xl border-2 border-purple-500 dark:border-purple-600">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">👥</span>
                      <h4 className="text-purple-900 dark:text-purple-100">Análise RH Pendente</h4>
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

                {/* Resposta do RH - Destaque com cores semafóricas */}
                {selectedChamado.respostaRH && (
                  <div className={`p-5 rounded-xl border-2 ${
                    selectedChamado.respostaRH.status === 'Aprovado'
                      ? 'bg-green-50 dark:bg-green-950/20 border-green-500 dark:border-green-600'
                      : selectedChamado.respostaRH.status === 'Recusado'
                      ? 'bg-red-50 dark:bg-red-950/20 border-red-500 dark:border-red-600'
                      : 'bg-orange-50 dark:bg-orange-950/20 border-orange-500 dark:border-orange-600'
                  }`}>
                    <div className="flex items-start gap-3 mb-4">
                      <span className="text-3xl leading-none mt-0.5 flex-shrink-0">
                        {selectedChamado.respostaRH.status === 'Aprovado' 
                          ? '✅' 
                          : selectedChamado.respostaRH.status === 'Recusado'
                          ? '❌'
                          : '⏳'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className={`mb-1 ${
                          selectedChamado.respostaRH.status === 'Aprovado'
                            ? 'text-green-900 dark:text-green-100'
                            : selectedChamado.respostaRH.status === 'Recusado'
                            ? 'text-red-900 dark:text-red-100'
                            : 'text-orange-900 dark:text-orange-100'
                        }`}>Resposta do RH</h4>
                        <small className="text-gray-600 dark:text-gray-400">
                          {selectedChamado.respostaRH.autor} • {new Date(selectedChamado.respostaRH.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </small>
                      </div>
                    </div>
                    <div className="pl-12">
                      <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                        {selectedChamado.respostaRH.texto}
                      </p>
                    </div>
                  </div>
                )}

                {/* Mensagem para quem não é do RH */}
                {!isRH && !selectedChamado.respostaRH && selectedChamado.status === 'Pendente' && (
                  <div className="p-5 bg-orange-50 dark:bg-orange-950/20 rounded-xl border-2 border-orange-500 dark:border-orange-600">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">⏳</span>
                      <h4 className="text-orange-900 dark:text-orange-100">Em análise</h4>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 pl-9">
                      Sua solicitação está aguardando análise do time de RH
                    </p>
                  </div>
                )}

                {/* Detalhes da Solicitação */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="space-y-4">
                    <div>
                      <small className="text-gray-600 dark:text-gray-400">Tipo</small>
                      <p className="text-gray-900 dark:text-white">{getTipoLabel(selectedChamado.tipoChamado)}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
                        <small className="text-gray-600 dark:text-gray-400">Data de criação</small>
                      </div>
                      <p className="text-gray-900 dark:text-white">
                        {new Date(selectedChamado.dataCriacao).toLocaleString('pt-BR')}
                      </p>
                    </div>

                    {/* Detalhes específicos por tipo */}
                    {selectedChamado.tipoChamado === 'ferias' && (
                      <>
                        {selectedChamado.dataInicio && (
                          <div>
                            <small className="text-gray-600 dark:text-gray-400">Data de Início</small>
                            <p className="text-gray-900 dark:text-white">
                              {new Date(selectedChamado.dataInicio + 'T00:00:00').toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        )}
                        {selectedChamado.diasFerias && (
                          <div>
                            <small className="text-gray-600 dark:text-gray-400">Dias de Férias</small>
                            <p className="text-gray-900 dark:text-white">{selectedChamado.diasFerias}</p>
                          </div>
                        )}
                      </>
                    )}

                    {selectedChamado.tipoChamado === 'atualizacao-dados' && selectedChamado.dadosAtualizar && (
                      <div>
                        <small className="text-gray-600 dark:text-gray-400 mb-3 block">Dados a serem atualizados</small>
                        <div className="space-y-2">
                          {(() => {
                            try {
                              const dados = JSON.parse(selectedChamado.dadosAtualizar);
                              const labelMap: Record<string, string> = {
                                'endereco': 'Endereço Residencial',
                                'telefone': 'Telefone / Celular',
                                'email': 'E-mail Pessoal',
                                'banco': 'Banco',
                                'agencia': 'Agência',
                                'conta': 'Conta',
                                'pix': 'Chave PIX',
                                'estadoCivil': 'Estado Civil',
                                'dependentes': 'Dependentes',
                                'outros': 'Outros'
                              };
                              
                              return Object.entries(dados.dados).map(([campo, valor]) => (
                                <div key={campo} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                                  <small className="text-gray-600 dark:text-gray-400 block mb-1">
                                    {labelMap[campo] || campo}
                                  </small>
                                  <p className="text-gray-900 dark:text-white">{valor as string}</p>
                                </div>
                              ));
                            } catch {
                              return (
                                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                                  <p className="text-gray-900 dark:text-white">{selectedChamado.dadosAtualizar}</p>
                                </div>
                              );
                            }
                          })()}
                        </div>
                      </div>
                    )}

                    {selectedChamado.tipoChamado === 'holerite' && (
                      <>
                        {selectedChamado.mesAno && (
                          <div>
                            <small className="text-gray-600 dark:text-gray-400">Mês/Ano</small>
                            <p className="text-gray-900 dark:text-white">{selectedChamado.mesAno}</p>
                          </div>
                        )}
                        {selectedChamado.tipoDocumento && (
                          <div>
                            <small className="text-gray-600 dark:text-gray-400">Tipo de Documento</small>
                            <p className="text-gray-900 dark:text-white">{selectedChamado.tipoDocumento}</p>
                          </div>
                        )}
                      </>
                    )}

                    {selectedChamado.documentos && selectedChamado.documentos.length > 0 && (
                      <div>
                        <small className="text-gray-600 dark:text-gray-400 mb-2 block">
                          Documentos Anexados ({selectedChamado.documentos.length})
                        </small>
                        <div className="space-y-2">
                          {selectedChamado.documentos.map((doc, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800"
                            >
                              <FileText className="w-5 h-5 text-gray-400" />
                              <div className="flex-1 min-w-0">
                                <p className="text-gray-900 dark:text-white truncate">{doc.name}</p>
                                <caption className="text-gray-500">{(doc.size / 1024).toFixed(2)} KB</caption>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
