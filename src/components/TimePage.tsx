/**
 * ============================================================================
 * TIME - Diretório de Colaboradores
 * ============================================================================
 * 
 * FUNCIONALIDADES:
 * - Lista completa de colaboradores
 * - Filtros por nome e setor
 * - Modal de visualização detalhada
 * - Modal de edição/criação (RH ou próprio perfil)
 * - Upload de fotos
 * - Sistema de permissões baseado em tags
 * - Design em lista (rows) clean e moderno
 * 
 * RESPONSIVIDADE:
 * - Mobile: Layout vertical compacto
 * - Desktop: Lista horizontal com todos os dados
 * 
 * INFORMAÇÕES EXIBIDAS:
 * - Dados básicos: nome, cargo, setor, email, telefone
 * - Dados pessoais: nascimento, admissão, formação, hobby
 * - Favoritos: música, filme, livro
 * - Tamanho de camiseta
 * 
 * ============================================================================
 */

import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';
import { PrimaryButton } from './PrimaryButton';
import { 
  Mail, 
  Phone, 
  Search, 
  Music, 
  Film, 
  BookOpen, 
  User, 
  Calendar, 
  Briefcase,
  GraduationCap,
  Heart,
  Shirt,
  Edit,
  Plus,
  X,
  Trash2,
  Upload,
  Info
} from 'lucide-react';
import { 
  AstronautIcon, 
  RocketIcon, 
  TelescopeIcon, 
  PlanetIcon,
  StarburstIcon,
  CometIcon,
  SatelliteIcon,
  ConstellationIcon
} from './SpaceIcons';
import { SETORES, SETOR_ICONS } from '../types/setores';

interface Colaborador {
  id?: string;
  nome: string;
  email: string;
  cargo?: string;
  setor: string;
  telefone?: string;
  foto?: string;
  dataNascimento?: string;
  dataAdmissao?: string;
  formacao?: string;
  hobby?: string;
  sobre?: string;
  filme?: string;
  livro?: string;
  musica?: string;
  tamanho_camiseta?: string;
}

// Mock de usuário logado - Em produção viria do contexto/autenticação
const CURRENT_USER = {
  email: 'maria.oliveira@tradestars.com.br',
  tags: 'RH' // Tags do usuário (RH = admin)
};

export function TimePage() {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [filteredColaboradores, setFilteredColaboradores] = useState<Colaborador[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [setorFilter, setSetorFilter] = useState('Todos os Setores');
  
  // Modais
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedColaborador, setSelectedColaborador] = useState<Colaborador | null>(null);
  const [editingColaborador, setEditingColaborador] = useState<Colaborador | null>(null);
  
  // Upload de foto
  const [fotoPreview, setFotoPreview] = useState('');
  const [fotoFile, setFotoFile] = useState<File | null>(null);

  const placeholderImage = 'https://ui-avatars.com/api/?size=200&background=000aff&color=fff&name=';

  // Dados mockados para demonstração
  useEffect(() => {
    setTimeout(() => {
      const mockData: Colaborador[] = [
        { 
          id: '1',
          nome: 'Ana Silva', 
          cargo: 'CEO', 
          setor: 'Administração', 
          email: 'ana.silva@tradestars.com',
          telefone: '(11) 98765-4321',
          foto: '',
          dataNascimento: '15/03/1985',
          dataAdmissao: '01/01/2020',
          formacao: 'MBA em Gestão Empresarial',
          hobby: 'Yoga e Meditação',
          sobre: 'Líder visionária com 15 anos de experiência em tecnologia e inovação.',
          musica: 'Imagine - John Lennon',
          filme: 'The Godfather',
          livro: 'Sapiens - Yuval Harari',
          tamanho_camiseta: 'M'
        },
        { 
          id: '2',
          nome: 'Carlos Santos', 
          cargo: 'CTO', 
          setor: 'Time de Experiência e Inovação', 
          email: 'carlos.santos@tradestars.com',
          telefone: '(11) 98765-4322',
          foto: '',
          dataNascimento: '22/07/1988',
          dataAdmissao: '15/02/2020',
          formacao: 'Engenharia de Software',
          hobby: 'Games e Programação',
          sobre: 'Especialista em arquitetura de sistemas e liderança técnica.',
          musica: 'Stairway to Heaven - Led Zeppelin',
          filme: 'Inception',
          livro: 'Clean Code - Robert Martin',
          tamanho_camiseta: 'G'
        },
        { 
          id: '3',
          nome: 'Maria Oliveira', 
          cargo: 'Diretora de RH', 
          setor: 'RH', 
          email: 'maria.oliveira@tradestars.com.br',
          telefone: '(11) 98765-4323',
          foto: '',
          dataNascimento: '10/05/1990',
          dataAdmissao: '01/03/2020',
          formacao: 'Psicologia Organizacional',
          hobby: 'Leitura e Viagens',
          sobre: 'Apaixonada por desenvolvimento humano e cultura organizacional.',
          musica: 'Respect - Aretha Franklin',
          filme: 'The Pursuit of Happyness',
          livro: 'Mindset - Carol Dweck',
          tamanho_camiseta: 'P'
        },
        { 
          id: '4',
          nome: 'João Pereira', 
          cargo: 'Gerente de Projetos', 
          setor: 'TEI', 
          email: 'joao.pereira@tradestars.com',
          telefone: '(21) 98765-4324',
          foto: '',
          dataNascimento: '18/11/1987',
          dataAdmissao: '10/04/2020',
          formacao: 'Administração com MBA em Projetos',
          hobby: 'Fotografia',
          sobre: 'Especialista em metodologias ágeis e gestão de equipes.',
          musica: 'Bohemian Rhapsody - Queen',
          filme: 'Interstellar',
          livro: 'The Lean Startup - Eric Ries',
          tamanho_camiseta: 'G'
        },
        { 
          id: '5',
          nome: 'Fernanda Costa', 
          cargo: 'Analista de BI', 
          setor: 'BI', 
          email: 'fernanda.costa@tradestars.com',
          telefone: '(31) 98765-4325',
          foto: '',
          dataNascimento: '05/09/1992',
          dataAdmissao: '20/05/2021',
          formacao: 'Estatística',
          hobby: 'Análise de Dados',
          sobre: 'Transformando dados em insights estratégicos para o negócio.',
          musica: 'Hey Jude - The Beatles',
          filme: 'A Beautiful Mind',
          livro: 'Storytelling with Data - Cole Knaflic',
          tamanho_camiseta: 'M'
        },
        { 
          id: '6',
          nome: 'Ricardo Souza', 
          cargo: 'Designer UX', 
          setor: 'Time de Experiência e Inovação', 
          email: 'ricardo.souza@tradestars.com',
          telefone: '(11) 98765-4326',
          foto: '',
          dataNascimento: '28/02/1991',
          dataAdmissao: '01/06/2021',
          formacao: 'Design Digital',
          hobby: 'Arte Digital',
          sobre: 'Criando experiências memoráveis e interfaces intuitivas.',
          musica: 'Cosmic Love - Florence + The Machine',
          filme: 'Blade Runner 2049',
          livro: 'The Design of Everyday Things - Don Norman',
          tamanho_camiseta: 'M'
        },
        { 
          id: '7',
          nome: 'Paula Rodrigues', 
          cargo: 'Analista Financeira', 
          setor: 'Financeiro', 
          email: 'paula.rodrigues@tradestars.com',
          telefone: '(11) 98765-4327',
          foto: '',
          dataNascimento: '12/08/1993',
          dataAdmissao: '05/07/2021',
          formacao: 'Ciências Contábeis',
          hobby: 'Investimentos',
          sobre: 'Especialista em planejamento financeiro e controle orçamentário.',
          musica: 'Money - Pink Floyd',
          filme: 'The Wolf of Wall Street',
          livro: 'Pai Rico, Pai Pobre - Robert Kiyosaki',
          tamanho_camiseta: 'M'
        },
        { 
          id: '8',
          nome: 'Lucas Martins', 
          cargo: 'SDR', 
          setor: 'Sales Development Representative', 
          email: 'lucas.martins@tradestars.com',
          telefone: '(11) 98765-4328',
          foto: '',
          dataNascimento: '20/04/1995',
          dataAdmissao: '15/08/2021',
          formacao: 'Marketing',
          hobby: 'Networking',
          sobre: 'Especialista em prospecção e qualificação de leads B2B.',
          musica: 'Eye of the Tiger - Survivor',
          filme: 'The Pursuit of Happyness',
          livro: 'Influence - Robert Cialdini',
          tamanho_camiseta: 'G'
        },
        { 
          id: '9',
          nome: 'Mariana Lima', 
          cargo: 'Closer', 
          setor: 'Closer', 
          email: 'mariana.lima@tradestars.com',
          telefone: '(11) 98765-4329',
          foto: '',
          dataNascimento: '30/11/1994',
          dataAdmissao: '20/09/2021',
          formacao: 'Administração',
          hobby: 'Leitura de Vendas',
          sobre: 'Especialista em fechamento de vendas e negociações complexas.',
          musica: 'We Are The Champions - Queen',
          filme: 'Glengarry Glen Ross',
          livro: 'Spin Selling - Neil Rackham',
          tamanho_camiseta: 'P'
        },
        { 
          id: '10',
          nome: 'Thiago Alves', 
          cargo: 'Comunicador', 
          setor: 'Comunicação', 
          email: 'thiago.alves@tradestars.com',
          telefone: '(11) 98765-4330',
          foto: '',
          dataNascimento: '08/06/1992',
          dataAdmissao: '10/10/2021',
          formacao: 'Jornalismo',
          hobby: 'Fotografia',
          sobre: 'Criador de conteúdo e estrategista de comunicação digital.',
          musica: 'Hallelujah - Leonard Cohen',
          filme: 'Almost Famous',
          livro: 'Contagious - Jonah Berger',
          tamanho_camiseta: 'M'
        }
      ];
      setColaboradores(mockData);
      setFilteredColaboradores(mockData);
      setLoading(false);
    }, 500);
  }, []);

  // Filtros
  useEffect(() => {
    let filtered = colaboradores;

    // Filtro de busca
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.cargo?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro de setor
    if (setorFilter !== 'Todos os Setores') {
      filtered = filtered.filter(c => c.setor === setorFilter);
    }

    setFilteredColaboradores(filtered);
  }, [searchTerm, setorFilter, colaboradores]);

  // Permissões
  const isAdmin = () => {
    return CURRENT_USER.tags?.includes('RH');
  };

  const canEdit = (colaborador: Colaborador) => {
    return isAdmin() || colaborador.email.toLowerCase() === CURRENT_USER.email.toLowerCase();
  };

  // Mapeamento de ícones espaciais
  const iconMap: Record<string, any> = {
    'astronaut': AstronautIcon,
    'rocket': RocketIcon,
    'telescope': TelescopeIcon,
    'planet': PlanetIcon,
    'starburst': StarburstIcon,
    'comet': CometIcon,
    'satellite': SatelliteIcon,
    'constellation': ConstellationIcon,
    'meteor': SatelliteIcon,
    'scroll': SatelliteIcon,
    'radar': TelescopeIcon,
    'galaxy': StarburstIcon,
    'nebula': ConstellationIcon,
  };

  // Ícones e cores por setor
  const getSetorIcon = (setorNome: string) => {
    const setor = SETORES.find(s => s.nome === setorNome);
    if (setor) {
      const iconKey = SETOR_ICONS[setor.id] || 'satellite';
      return iconMap[iconKey];
    }
    return ConstellationIcon;
  };

  const getSetorColor = (setorNome: string) => {
    const setor = SETORES.find(s => s.nome === setorNome);
    return setor?.cor || '#ac2aff'; // Cor específica do setor ou roxa como fallback
  };

  // Handlers
  const handleView = (colaborador: Colaborador) => {
    setSelectedColaborador(colaborador);
    setViewModalOpen(true);
  };

  const handleEdit = (colaborador: Colaborador) => {
    setEditingColaborador({ ...colaborador });
    setFotoPreview(colaborador.foto || '');
    setFotoFile(null);
    setEditModalOpen(true);
  };

  const handleAdd = () => {
    setEditingColaborador({
      nome: '',
      email: '',
      setor: '',
      cargo: '',
      telefone: '',
      foto: '',
      dataNascimento: '',
      dataAdmissao: '',
      formacao: '',
      hobby: '',
      sobre: '',
      filme: '',
      livro: '',
      musica: '',
      tamanho_camiseta: ''
    });
    setFotoPreview('');
    setFotoFile(null);
    setEditModalOpen(true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Salvar colaborador
    console.log('Salvando colaborador:', editingColaborador);
    alert('Colaborador salvo com sucesso!');
    setEditModalOpen(false);
  };

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja excluir este colaborador?')) {
      // Deletar colaborador
      console.log('Deletando colaborador:', editingColaborador);
      alert('Colaborador excluído com sucesso!');
      setEditModalOpen(false);
    }
  };

  // Setores únicos para o filtro - usando lista centralizada
  const setoresUnicos = ['Todos os Setores', ...SETORES.map(s => s.nome)];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 dark:text-white mb-2">Conheça o Time</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Todos os colaboradores da TradeStars
        </p>
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        {/* Filtro de Setor */}
        <div className="w-full sm:w-64">
          <Select value={setorFilter} onValueChange={setSetorFilter}>
            <SelectTrigger className="h-12 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-300">
              <SelectValue placeholder="Selecione o setor" />
            </SelectTrigger>
            <SelectContent>
              {setoresUnicos.map((setor) => (
                <SelectItem key={setor} value={setor}>
                  {setor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Busca */}
        <div className="flex-1">
          <FormInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, email ou cargo..."
            icon={<Search className="w-5 h-5" />}
          />
        </div>

        {/* Botão Adicionar (só admin) */}
        {isAdmin() && (
          <PrimaryButton
            onClick={handleAdd}
            icon={<Plus className="w-4 h-4" />}
          >
            Adicionar
          </PrimaryButton>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Carregando colaboradores...</p>
        </div>
      )}

      {/* Grid de Cards de Colaboradores */}
      {!loading && filteredColaboradores.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredColaboradores.map((colaborador) => {
            const Icon = getSetorIcon(colaborador.setor);
            const color = getSetorColor(colaborador.setor);
            const setor = SETORES.find(s => s.nome === colaborador.setor);
            const sigla = setor?.sigla || colaborador.setor;
            
            return (
              <Card 
                key={colaborador.id}
                className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative group"
              >
                {/* Botão de Edição (apenas se tiver permissão) */}
                {canEdit(colaborador) && (
                  <button
                    onClick={() => handleEdit(colaborador)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md hover:shadow-lg group/edit"
                    style={{
                      '--hover-bg': color,
                    } as React.CSSProperties}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = color;
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '';
                      e.currentTarget.style.color = '';
                    }}
                  >
                    <Edit className="w-4 h-4 transition-transform duration-300 group-hover/edit:scale-110" />
                  </button>
                )}

                <CardContent className="p-6 cursor-pointer" onClick={() => handleView(colaborador)}>
                  <div className="flex flex-col items-center text-center space-y-4">
                    {/* Avatar/Ícone */}
                    <div
                      className="w-20 h-20 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                      style={{ backgroundColor: `${color}20` }}
                    >
                      {colaborador.foto ? (
                        <img 
                          src={colaborador.foto} 
                          alt={colaborador.nome}
                          className="w-20 h-20 rounded-lg object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <Icon className={`w-10 h-10 ${colaborador.foto ? 'hidden' : ''}`} style={{ color }} />
                    </div>

                    {/* Informações */}
                    <div className="space-y-2 w-full">
                      <h3 className="text-gray-900 dark:text-white">{colaborador.nome}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{colaborador.cargo}</p>
                      <Badge 
                        className="text-white border-0"
                        style={{ backgroundColor: color }}
                      >
                        {sigla}
                      </Badge>
                    </div>

                    {/* Contatos */}
                    <div className="space-y-2 w-full pt-2 border-t border-gray-200 dark:border-gray-800">
                      {colaborador.email && (
                        <div className="flex items-center gap-2 justify-center">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <small className="text-gray-600 dark:text-gray-400 truncate">{colaborador.email}</small>
                        </div>
                      )}
                      {colaborador.telefone && (
                        <div className="flex items-center gap-2 justify-center">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <small className="text-gray-600 dark:text-gray-400">{colaborador.telefone}</small>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Nenhum resultado */}
      {!loading && filteredColaboradores.length === 0 && (
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardContent className="py-12 text-center">
            <h3 className="text-gray-900 dark:text-white mb-2">Nenhum colaborador encontrado</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Tente ajustar seus filtros de busca
            </p>
          </CardContent>
        </Card>
      )}

      {/* Modal de Visualização */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-[1000px] max-h-[90vh] overflow-y-auto">
          {selectedColaborador && (() => {
            const Icon = getSetorIcon(selectedColaborador.setor);
            const color = getSetorColor(selectedColaborador.setor);
            const setor = SETORES.find(s => s.nome === selectedColaborador.setor);
            const sigla = setor?.sigla || selectedColaborador.setor;
            
            return (
              <>
                <DialogHeader>
                  <div className="flex items-start gap-4">
                    <div
                      className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${color}20` }}
                    >
                      {selectedColaborador.foto ? (
                        <img 
                          src={selectedColaborador.foto} 
                          alt={selectedColaborador.nome}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      ) : (
                        <Icon className="w-8 h-8" style={{ color }} />
                      )}
                    </div>
                    <div className="flex-1">
                      <DialogTitle className="text-gray-900 dark:text-white mb-1">
                        {selectedColaborador.nome}
                      </DialogTitle>
                      <DialogDescription className="text-gray-600 dark:text-gray-400 mb-2">
                        {selectedColaborador.cargo}
                      </DialogDescription>
                      <div className="flex items-center gap-2">
                        <Badge 
                          className="text-white border-0"
                          style={{ backgroundColor: color }}
                        >
                          {sigla}
                        </Badge>
                        {setor && (
                          <small className="text-gray-600 dark:text-gray-400">
                            {setor.nome}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                </DialogHeader>

              <div className="space-y-6 mt-6">
                {/* Sobre */}
                {selectedColaborador.sobre && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <h4 className="text-gray-900 dark:text-white mb-2">Sobre</h4>
                    <small className="text-gray-600 dark:text-gray-400 block leading-relaxed">{selectedColaborador.sobre}</small>
                  </div>
                )}

                {/* Informações de Contato */}
                <div>
                  <h3 className="text-gray-900 dark:text-white mb-3">Contato</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedColaborador.email && (
                      <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <small className="text-gray-600 dark:text-gray-400">{selectedColaborador.email}</small>
                      </div>
                    )}
                    {selectedColaborador.telefone && (
                      <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <small className="text-gray-600 dark:text-gray-400">{selectedColaborador.telefone}</small>
                      </div>
                    )}
                  </div>
                </div>

                {/* Informações Profissionais e Pessoais - Grid 3 colunas */}
                <div>
                  <h3 className="text-gray-900 dark:text-white mb-3">Informações</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {selectedColaborador.dataAdmissao && (
                      <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <div className="flex items-start gap-2 mb-1">
                          <Briefcase className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 mt-0.5" />
                          <span className="text-meta text-gray-500 dark:text-gray-500">Admissão</span>
                        </div>
                        <small className="text-gray-900 dark:text-white block ml-5">{selectedColaborador.dataAdmissao}</small>
                      </div>
                    )}
                    {selectedColaborador.formacao && (
                      <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <div className="flex items-start gap-2 mb-1">
                          <GraduationCap className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 mt-0.5" />
                          <span className="text-meta text-gray-500 dark:text-gray-500">Formação</span>
                        </div>
                        <small className="text-gray-900 dark:text-white block ml-5">{selectedColaborador.formacao}</small>
                      </div>
                    )}
                    {selectedColaborador.dataNascimento && (
                      <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <div className="flex items-start gap-2 mb-1">
                          <Calendar className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 mt-0.5" />
                          <span className="text-meta text-gray-500 dark:text-gray-500">Nascimento</span>
                        </div>
                        <small className="text-gray-900 dark:text-white block ml-5">{selectedColaborador.dataNascimento}</small>
                      </div>
                    )}
                    {selectedColaborador.hobby && (
                      <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg sm:col-span-2">
                        <div className="flex items-start gap-2 mb-1">
                          <Heart className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 mt-0.5" />
                          <span className="text-meta text-gray-500 dark:text-gray-500">Hobby</span>
                        </div>
                        <small className="text-gray-900 dark:text-white block ml-5">{selectedColaborador.hobby}</small>
                      </div>
                    )}
                    {selectedColaborador.tamanho_camiseta && (
                      <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <div className="flex items-start gap-2 mb-1">
                          <Shirt className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 mt-0.5" />
                          <span className="text-meta text-gray-500 dark:text-gray-500">Camiseta</span>
                        </div>
                        <small className="text-gray-900 dark:text-white block ml-5">{selectedColaborador.tamanho_camiseta}</small>
                      </div>
                    )}
                  </div>
                </div>

                {/* Favoritos - Grid 3 colunas */}
                {(selectedColaborador.musica || selectedColaborador.filme || selectedColaborador.livro) && (
                  <div>
                    <h3 className="text-gray-900 dark:text-white mb-3">Favoritos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {selectedColaborador.musica && (
                        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <div className="flex items-start gap-2 mb-1">
                            <Music className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 mt-0.5" />
                            <span className="text-meta text-gray-500 dark:text-gray-500">Música</span>
                          </div>
                          <small className="text-gray-900 dark:text-white block ml-5">{selectedColaborador.musica}</small>
                        </div>
                      )}
                      {selectedColaborador.filme && (
                        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <div className="flex items-start gap-2 mb-1">
                            <Film className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 mt-0.5" />
                            <span className="text-meta text-gray-500 dark:text-gray-500">Filme</span>
                          </div>
                          <small className="text-gray-900 dark:text-white block ml-5">{selectedColaborador.filme}</small>
                        </div>
                      )}
                      {selectedColaborador.livro && (
                        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <div className="flex items-start gap-2 mb-1">
                            <BookOpen className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 mt-0.5" />
                            <span className="text-meta text-gray-500 dark:text-gray-500">Livro</span>
                          </div>
                          <small className="text-gray-900 dark:text-white block ml-5">{selectedColaborador.livro}</small>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          );
          })()}
        </DialogContent>
      </Dialog>

      {/* Modal de Edição/Criação */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-flex max-h-[90vh] overflow-y-auto">
          {editingColaborador && (
            <>
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-white">
                  {editingColaborador.id ? 'Editar Colaborador' : 'Adicionar Colaborador'}
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                  Preencha as informações do colaborador
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                {/* Upload de Foto */}
                <div className="flex flex-col items-center gap-4 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800">
                    {fotoPreview ? (
                      <img src={fotoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('foto-upload')?.click()}
                      className="rounded-xl border-gray-300 dark:border-gray-700"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Escolher Foto
                    </Button>
                    {fotoPreview && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFotoPreview('');
                          setFotoFile(null);
                        }}
                        className="rounded-xl border-gray-300 dark:border-gray-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <input
                    id="foto-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <small className="text-gray-500 dark:text-gray-500 text-center">
                    Ou cole uma URL de imagem abaixo
                  </small>
                  <Input
                    value={editingColaborador.foto || ''}
                    onChange={(e) => {
                      setEditingColaborador({ ...editingColaborador, foto: e.target.value });
                      setFotoPreview(e.target.value);
                    }}
                    placeholder="https://exemplo.com/foto.jpg"
                    className="rounded-xl bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                  />
                </div>

                {/* Grid de Campos - 3 colunas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Nome */}
                  <div>
                    <label className="text-gray-700 dark:text-gray-300 block mb-1.5">Nome <span className="required-asterisk">*</span></label>
                    <Input
                      value={editingColaborador.nome}
                      onChange={(e) => setEditingColaborador({ ...editingColaborador, nome: e.target.value })}
                      placeholder="Nome completo"
                      className="rounded-xl bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-gray-700 dark:text-gray-300 block mb-1.5">E-mail <span className="required-asterisk">*</span></label>
                    <Input
                      type="email"
                      value={editingColaborador.email}
                      onChange={(e) => setEditingColaborador({ ...editingColaborador, email: e.target.value })}
                      placeholder="email@tradestars.com"
                      className="rounded-xl bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                      required
                    />
                  </div>

                  {/* Cargo */}
                  <div>
                    <label className="text-gray-700 dark:text-gray-300 block mb-1.5">Cargo</label>
                    <Input
                      value={editingColaborador.cargo || ''}
                      onChange={(e) => setEditingColaborador({ ...editingColaborador, cargo: e.target.value })}
                      placeholder="Ex: Analista de BI"
                      className="rounded-xl bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                    />
                  </div>

                  {/* Setor */}
                  <div>
                    <label className="text-gray-700 dark:text-gray-300 block mb-1.5">Setor <span className="required-asterisk">*</span></label>
                    <Select 
                      value={editingColaborador.setor} 
                      onValueChange={(value) => setEditingColaborador({ ...editingColaborador, setor: value })}
                    >
                      <SelectTrigger className="rounded-xl bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                        <SelectValue placeholder="Selecione o setor" />
                      </SelectTrigger>
                      <SelectContent>
                        {SETORES.map((setor) => (
                          <SelectItem key={setor.id} value={setor.nome}>
                            {setor.sigla} - {setor.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Telefone */}
                  <div>
                    <label className="text-gray-700 dark:text-gray-300 block mb-1.5">Telefone</label>
                    <Input
                      value={editingColaborador.telefone || ''}
                      onChange={(e) => setEditingColaborador({ ...editingColaborador, telefone: e.target.value })}
                      placeholder="(11) 98765-4321"
                      className="rounded-xl bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                    />
                  </div>

                  {/* Data de Nascimento */}
                  <div>
                    <label className="text-gray-700 dark:text-gray-300 block mb-1.5">Data de Nascimento</label>
                    <div className="relative">
                      <Input
                        value={editingColaborador.dataNascimento || ''}
                        onChange={(e) => setEditingColaborador({ ...editingColaborador, dataNascimento: e.target.value })}
                        placeholder="DD/MM/AAAA"
                        className="rounded-xl bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 pr-10"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Data de Admissão */}
                  <div>
                    <label className="text-gray-700 dark:text-gray-300 block mb-1.5">Data de Admissão</label>
                    <div className="relative">
                      <Input
                        value={editingColaborador.dataAdmissao || ''}
                        onChange={(e) => setEditingColaborador({ ...editingColaborador, dataAdmissao: e.target.value })}
                        placeholder="DD/MM/AAAA"
                        className="rounded-xl bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 pr-10"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Formação */}
                  <div>
                    <label className="text-gray-700 dark:text-gray-300 block mb-1.5">Formação</label>
                    <Input
                      value={editingColaborador.formacao || ''}
                      onChange={(e) => setEditingColaborador({ ...editingColaborador, formacao: e.target.value })}
                      placeholder="Ex: Administração"
                      className="rounded-xl bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                    />
                  </div>

                  {/* Hobby */}
                  <div>
                    <label className="text-gray-700 dark:text-gray-300 block mb-1.5">Hobby</label>
                    <Input
                      value={editingColaborador.hobby || ''}
                      onChange={(e) => setEditingColaborador({ ...editingColaborador, hobby: e.target.value })}
                      placeholder="Ex: Fotografia"
                      className="rounded-xl bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                    />
                  </div>

                  {/* Tamanho de Camiseta */}
                  <div>
                    <label className="text-gray-700 dark:text-gray-300 block mb-1.5">Tamanho de Camiseta</label>
                    <select
                      value={editingColaborador.tamanho_camiseta || ''}
                      onChange={(e) => setEditingColaborador({ ...editingColaborador, tamanho_camiseta: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
                    >
                      <option value="">Selecione</option>
                      <option value="P">P</option>
                      <option value="M">M</option>
                      <option value="G">G</option>
                      <option value="GG">GG</option>
                    </select>
                  </div>

                  {/* Música Favorita */}
                  <div>
                    <label className="text-gray-700 dark:text-gray-300 block mb-1.5">Música Favorita</label>
                    <Input
                      value={editingColaborador.musica || ''}
                      onChange={(e) => setEditingColaborador({ ...editingColaborador, musica: e.target.value })}
                      placeholder="Artista - Nome da música"
                      className="rounded-xl bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                    />
                  </div>

                  {/* Filme Favorito */}
                  <div>
                    <label className="text-gray-700 dark:text-gray-300 block mb-1.5">Filme Favorito</label>
                    <Input
                      value={editingColaborador.filme || ''}
                      onChange={(e) => setEditingColaborador({ ...editingColaborador, filme: e.target.value })}
                      placeholder="Nome do filme"
                      className="rounded-xl bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                    />
                  </div>

                  {/* Livro Favorito */}
                  <div>
                    <label className="text-gray-700 dark:text-gray-300 block mb-1.5">Livro Favorito</label>
                    <Input
                      value={editingColaborador.livro || ''}
                      onChange={(e) => setEditingColaborador({ ...editingColaborador, livro: e.target.value })}
                      placeholder="Título - Autor"
                      className="rounded-xl bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                    />
                  </div>
                </div>

                {/* Sobre (full width) */}
                <div>
                  <label className="text-gray-700 dark:text-gray-300 block mb-1.5">Sobre</label>
                  <Textarea
                    value={editingColaborador.sobre || ''}
                    onChange={(e) => setEditingColaborador({ ...editingColaborador, sobre: e.target.value })}
                    placeholder="Breve descrição sobre o colaborador..."
                    className="rounded-xl min-h-[100px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                  />
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-3 justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div>
                    {editingColaborador.id && isAdmin() && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleDelete}
                        className="rounded-xl border-red-600 dark:border-red-500 text-red-600 dark:text-red-500 hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditModalOpen(false)}
                      className="rounded-xl border-gray-300 dark:border-gray-700"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSave}
                      className="bg-[#000aff] hover:bg-[#0008dd] text-white rounded-xl"
                    >
                      Salvar
                    </Button>
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
