/**
 * ============================================================================
 * AGENDAMENTO DE SALAS - TradeStars Portal
 * ============================================================================
 * 
 * Sistema completo de agendamento de salas de reunião com:
 * - 3 etapas: Sala/Data → Horários → Confirmação
 * - Visualização de todos os agendamentos
 * - Filtros avançados
 * - Persistência local
 * - Relógio 24h visual
 * - Responsivo
 * 
 * ============================================================================
 */

import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Building2, Filter, Check, X, ArrowLeft, ArrowRight, History, ChevronDown, Crown, Briefcase, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Calendar as CalendarUI } from './ui/calendar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { PageHeader, SectionCard, EmptyState, StatusBadge } from './common';
import { DateInput } from './DateInput';

// Configuração das salas
const SALAS = [
  { id: 'sala-branca-ts', name: 'Sala Branca (TS)', icon: Crown, capacidade: 8 },
  { id: 'sala-reuniao-ts', name: 'Sala de Reunião (TS)', icon: Users, capacidade: 6 },
  { id: 'sala-one-one-mn', name: 'Sala One-a-One (MN)', icon: Briefcase, capacidade: 2 },
  { id: 'sala-reuniao-mn', name: 'Sala de Reunião (MN)', icon: Users, capacidade: 6 },
];

// Gerar horários de 30 em 30 minutos
const HORARIOS = (() => {
  const horarios = [];
  for (let h = 7; h <= 21; h++) {
    horarios.push(`${h.toString().padStart(2, '0')}:00`);
    if (h < 21) {
      horarios.push(`${h.toString().padStart(2, '0')}:30`);
    }
  }
  return horarios;
})();

interface Agendamento {
  id: string;
  sala: string;
  data: string;
  horaInicio: string;
  horaFim: string;
  nome: string;
  email: string;
  telefone: string;
  status: 'confirmado' | 'cancelado';
}

export function AgendamentoSalasPage() {
  const [view, setView] = useState<'agendar' | 'lista'>('agendar');
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [formData, setFormData] = useState({ nome: '', email: '', telefone: '' });
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [filteredAgendamentos, setFilteredAgendamentos] = useState<Agendamento[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Filtros
  const [filterRoom, setFilterRoom] = useState('');
  const [filterDateStart, setFilterDateStart] = useState('');
  const [filterDateEnd, setFilterDateEnd] = useState('');

  // Carregar agendamentos do localStorage (mock)
  useEffect(() => {
    const saved = localStorage.getItem('agendamentos-salas');
    if (saved) {
      setAgendamentos(JSON.parse(saved));
    }
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...agendamentos];
    
    if (filterRoom) {
      filtered = filtered.filter(a => a.sala === filterRoom);
    }
    
    if (filterDateStart) {
      filtered = filtered.filter(a => a.data >= filterDateStart);
    }
    
    if (filterDateEnd) {
      filtered = filtered.filter(a => a.data <= filterDateEnd);
    }
    
    // Ordenar por data
    filtered.sort((a, b) => {
      const dateA = new Date(a.data + 'T' + a.horaInicio);
      const dateB = new Date(b.data + 'T' + b.horaInicio);
      return dateA.getTime() - dateB.getTime();
    });
    
    setFilteredAgendamentos(filtered);
  }, [agendamentos, filterRoom, filterDateStart, filterDateEnd]);

  // Verificar horários disponíveis
  const getHorariosDisponiveis = () => {
    if (!selectedDate || !selectedRoom) return HORARIOS;
    
    const dateStr = selectedDate.toISOString().split('T')[0];
    const ocupados = agendamentos
      .filter(a => a.sala === selectedRoom && a.data === dateStr && a.status === 'confirmado')
      .flatMap(a => {
        // Converter string de hora para minutos
        const [hIni, mIni] = a.horaInicio.split(':').map(Number);
        const [hFim, mFim] = a.horaFim.split(':').map(Number);
        const inicioMin = hIni * 60 + mIni;
        const fimMin = hFim * 60 + mFim;
        
        const horarios = [];
        for (let min = inicioMin; min < fimMin; min += 30) {
          const h = Math.floor(min / 60);
          const m = min % 60;
          horarios.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
        }
        return horarios;
      });
    
    // Bloquear horários passados se for hoje
    const hoje = new Date().toISOString().split('T')[0];
    const now = new Date();
    const horaAtual = now.getHours();
    const minutoAtual = now.getMinutes();
    const minAtual = horaAtual * 60 + minutoAtual;
    
    return HORARIOS.map(h => {
      const [hora, minuto] = h.split(':').map(Number);
      const minHorario = hora * 60 + minuto;
      const isOcupado = ocupados.includes(h);
      const isPassado = dateStr === hoje && minHorario <= minAtual;
      return { hora: h, disponivel: !isOcupado && !isPassado };
    });
  };

  const handleTimeToggle = (hora: string) => {
    setSelectedTimes(prev => 
      prev.includes(hora) 
        ? prev.filter(h => h !== hora)
        : [...prev, hora].sort()
    );
  };

  const handleConfirmarAgendamento = () => {
    if (!selectedDate || !selectedRoom || selectedTimes.length === 0) return;
    
    const dateStr = selectedDate.toISOString().split('T')[0];
    
    // Detectar grupos de horários consecutivos
    const horariosQuebrados = [];
    let grupoAtual = [selectedTimes[0]];
    
    for (let i = 1; i < selectedTimes.length; i++) {
      const [hAtual, mAtual] = selectedTimes[i].split(':').map(Number);
      const [hAnt, mAnt] = selectedTimes[i - 1].split(':').map(Number);
      const minAtual = hAtual * 60 + mAtual;
      const minAnt = hAnt * 60 + mAnt;
      
      if (minAtual - minAnt === 30) {
        grupoAtual.push(selectedTimes[i]);
      } else {
        horariosQuebrados.push([...grupoAtual]);
        grupoAtual = [selectedTimes[i]];
      }
    }
    horariosQuebrados.push(grupoAtual);
    
    // Criar um agendamento para cada grupo de horários consecutivos
    const novosAgendamentosArray = horariosQuebrados.map((grupo, idx) => {
      const horaInicio = grupo[0];
      
      // Calcular hora fim do grupo
      const [ultimaH, ultimaM] = grupo[grupo.length - 1].split(':').map(Number);
      const fimMin = (ultimaH * 60 + ultimaM) + 30;
      const horaFim = `${Math.floor(fimMin / 60).toString().padStart(2, '0')}:${(fimMin % 60).toString().padStart(2, '0')}`;
      
      return {
        id: `AGN-${Date.now()}-${idx}`,
        sala: selectedRoom,
        data: dateStr,
        horaInicio,
        horaFim,
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        status: 'confirmado' as const
      };
    });
    
    const novosAgendamentos = [...agendamentos, ...novosAgendamentosArray];
    setAgendamentos(novosAgendamentos);
    localStorage.setItem('agendamentos-salas', JSON.stringify(novosAgendamentos));
    
    setShowSuccessModal(true);
    resetForm();
  };

  const resetForm = () => {
    setStep(1);
    setSelectedDate(new Date());
    setSelectedRoom('');
    setSelectedTimes([]);
    setFormData({ nome: '', email: '', telefone: '' });
  };

  const handleCancelarAgendamento = (id: string) => {
    if (confirm('Deseja cancelar este agendamento?')) {
      const novosAgendamentos = agendamentos.map(a => 
        a.id === id ? { ...a, status: 'cancelado' as const } : a
      );
      setAgendamentos(novosAgendamentos);
      localStorage.setItem('agendamentos-salas', JSON.stringify(novosAgendamentos));
    }
  };

  const limparFiltros = () => {
    setFilterRoom('');
    setFilterDateStart('');
    setFilterDateEnd('');
  };

  // Renderizar etapa 1
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div className="w-10 h-10 rounded-full bg-[#000aff] text-white flex items-center justify-center">
          <span>1</span>
        </div>
        <h3 className="text-gray-900 dark:text-white">Escolha a sala e data</h3>
      </div>

      {/* Seleção de Sala */}
      <div>
        <label className="text-gray-900 dark:text-white mb-3 block">
          Sala <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SALAS.map(sala => {
            const IconComponent = sala.icon;
            return (
              <label
                key={sala.id}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedRoom === sala.id
                    ? 'border-[#000aff] bg-blue-50 dark:bg-blue-950/20'
                    : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name="room"
                  value={sala.id}
                  checked={selectedRoom === sala.id}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  className="sr-only"
                />
                <div className={`p-3 rounded-lg ${
                  selectedRoom === sala.id ? 'bg-[#000aff]' : 'bg-gray-100 dark:bg-gray-800'
                }`}>
                  <IconComponent 
                    className="w-8 h-8" 
                    style={{ color: selectedRoom === sala.id ? 'white' : '#000aff' }}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-gray-900 dark:text-white">{sala.name}</h4>
                  <small className="text-gray-600 dark:text-gray-400">Capacidade: {sala.capacidade} pessoas</small>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Seleção de Data + Informações do Solicitante */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Seleção de Data */}
        <div>
          <label className="text-gray-900 dark:text-white mb-3 block">
            Data <span className="text-red-500">*</span>
          </label>
          <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 w-full sm:w-fit">
            <CardContent className="p-4">
              <CalendarUI
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                className="rounded-lg"
              />
            </CardContent>
          </Card>
        </div>

        {/* Informações do Solicitante */}
        <div>
          <h4 className="text-gray-900 dark:text-white mb-4">Informações do Solicitante</h4>
          <div className="space-y-4">
            <div>
              <label className="text-gray-700 dark:text-gray-300 mb-2 block">Nome <span className="required-asterisk">*</span></label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full px-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-gray-900 dark:text-white"
                placeholder="Seu nome completo"
              />
            </div>
            <div>
              <label className="text-gray-700 dark:text-gray-300 mb-2 block">Telefone <span className="required-asterisk">*</span></label>
              <input
                type="tel"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                className="w-full px-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-gray-900 dark:text-white"
                placeholder="(11) 99999-9999"
              />
            </div>
            <div>
              <label className="text-gray-700 dark:text-gray-300 mb-2 block">Email <span className="required-asterisk">*</span></label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-gray-900 dark:text-white"
                placeholder="seu.email@empresa.com"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-800">
        <Button
          onClick={() => setStep(2)}
          disabled={!selectedRoom || !selectedDate || !formData.nome || !formData.email || !formData.telefone}
          className="bg-[#000aff] hover:bg-[#0008e6] text-white w-full sm:w-auto"
        >
          Próximo: Escolher Horários <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  // Renderizar etapa 2
  const renderStep2 = () => {
    const horarios = getHorariosDisponiveis();
    const salaInfo = SALAS.find(s => s.id === selectedRoom);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div className="w-10 h-10 rounded-full bg-[#000aff] text-white flex items-center justify-center">
            <span>2</span>
          </div>
          <div className="flex-1">
            <h3 className="text-gray-900 dark:text-white">Escolha os horários</h3>
            <small className="text-gray-600 dark:text-gray-400">
              {salaInfo?.name} • {selectedDate?.toLocaleDateString('pt-BR')}
            </small>
          </div>
        </div>

        <div>
          <div className="mb-4">
            <h4 className="text-gray-900 dark:text-white">Horários Disponíveis</h4>
            <small className="text-gray-600 dark:text-gray-400">Funcionamento: 07:00 às 22:00 • Intervalos de 30 minutos</small>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
            {horarios.map(({ hora, disponivel }) => (
              <button
                key={hora}
                onClick={() => disponivel && handleTimeToggle(hora)}
                disabled={!disponivel}
                className={`p-2 sm:p-3 rounded-lg border-2 transition-all text-center ${
                  selectedTimes.includes(hora)
                    ? 'border-[#000aff] bg-blue-50 dark:bg-blue-950/20'
                    : disponivel
                    ? 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                    : 'border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 cursor-not-allowed opacity-50'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className={`text-xs sm:text-base ${disponivel ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}>
                    {hora}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedTimes.length > 0 && (() => {
          // Detectar se os horários são consecutivos
          const horariosQuebrados = [];
          let grupoAtual = [selectedTimes[0]];
          
          for (let i = 1; i < selectedTimes.length; i++) {
            const [hAtual, mAtual] = selectedTimes[i].split(':').map(Number);
            const [hAnt, mAnt] = selectedTimes[i - 1].split(':').map(Number);
            const minAtual = hAtual * 60 + mAtual;
            const minAnt = hAnt * 60 + mAnt;
            
            if (minAtual - minAnt === 30) {
              grupoAtual.push(selectedTimes[i]);
            } else {
              horariosQuebrados.push([...grupoAtual]);
              grupoAtual = [selectedTimes[i]];
            }
          }
          horariosQuebrados.push(grupoAtual);
          
          const isQuebrado = horariosQuebrados.length > 1;
          
          // Calcular duração total em minutos
          const duracaoMin = selectedTimes.length * 30;
          const duracaoH = Math.floor(duracaoMin / 60);
          const duracaoM = duracaoMin % 60;
          const duracaoTexto = duracaoH > 0 
            ? (duracaoM > 0 ? `${duracaoH}h${duracaoM}min` : `${duracaoH}h`)
            : `${duracaoM}min`;
          
          // Calcular hora fim
          const [ultimaH, ultimaM] = selectedTimes[selectedTimes.length - 1].split(':').map(Number);
          const fimMin = (ultimaH * 60 + ultimaM) + 30;
          const horaFim = `${Math.floor(fimMin / 60).toString().padStart(2, '0')}:${(fimMin % 60).toString().padStart(2, '0')}`;
          
          return (
            <>
              <Card className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                <CardContent className="p-4 space-y-2">
                  <h4 className="text-gray-900 dark:text-white mb-2">Horários Selecionados</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedTimes[0]} - {horaFim}
                    <small className="ml-2 text-gray-600 dark:text-gray-400">
                      ({duracaoTexto})
                    </small>
                  </p>
                </CardContent>
              </Card>
              
              {isQuebrado && (
                <Card className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-yellow-900 dark:text-yellow-200 mb-2">Atenção: Horários Separados</h4>
                        <p className="text-yellow-800 dark:text-yellow-300 mb-2">
                          Você selecionou horários não consecutivos. Serão criados {horariosQuebrados.length} agendamentos separados:
                        </p>
                        <div className="space-y-1">
                          {horariosQuebrados.map((grupo, idx) => {
                            const [iniH, iniM] = grupo[0].split(':').map(Number);
                            const [ultH, ultM] = grupo[grupo.length - 1].split(':').map(Number);
                            const fimGrupoMin = (ultH * 60 + ultM) + 30;
                            const fimGrupo = `${Math.floor(fimGrupoMin / 60).toString().padStart(2, '0')}:${(fimGrupoMin % 60).toString().padStart(2, '0')}`;
                            const durGrupoMin = grupo.length * 30;
                            const durGrupoH = Math.floor(durGrupoMin / 60);
                            const durGrupoM = durGrupoMin % 60;
                            const durGrupoTexto = durGrupoH > 0 
                              ? (durGrupoM > 0 ? `${durGrupoH}h${durGrupoM}min` : `${durGrupoH}h`)
                              : `${durGrupoM}min`;
                            
                            return (
                              <small key={idx} className="text-yellow-700 dark:text-yellow-400 block">
                                • {grupo[0]} - {fimGrupo} ({durGrupoTexto})
                              </small>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          );
        })()}

        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 pt-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setStep(1)}
            className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <Button
            onClick={() => setStep(3)}
            disabled={selectedTimes.length === 0}
            className="bg-[#000aff] hover:bg-[#0008e6] text-white w-full sm:w-auto"
          >
            Próximo: Confirmar <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  // Renderizar etapa 3
  const renderStep3 = () => {
    const salaInfo = SALAS.find(s => s.id === selectedRoom);
    const horaInicio = selectedTimes[0];
    
    // Calcular hora fim
    const [ultimaH, ultimaM] = selectedTimes[selectedTimes.length - 1].split(':').map(Number);
    const fimMin = (ultimaH * 60 + ultimaM) + 30;
    const horaFim = `${Math.floor(fimMin / 60).toString().padStart(2, '0')}:${(fimMin % 60).toString().padStart(2, '0')}`;
    
    // Calcular duração
    const duracaoMin = selectedTimes.length * 30;
    const duracaoH = Math.floor(duracaoMin / 60);
    const duracaoM = duracaoMin % 60;
    const duracaoTexto = duracaoH > 0 
      ? (duracaoM > 0 ? `${duracaoH}h${duracaoM}min` : `${duracaoH}h`)
      : `${duracaoM}min`;
    
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div className="w-10 h-10 rounded-full bg-[#000aff] text-white flex items-center justify-center">
            <span>3</span>
          </div>
          <h3 className="text-gray-900 dark:text-white">Confirmar agendamento</h3>
        </div>

        <Card className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h4 className="text-gray-900 dark:text-white">Resumo do Agendamento</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <small className="text-gray-600 dark:text-gray-400 block mb-1">Sala:</small>
                <p className="text-gray-900 dark:text-white">{salaInfo?.name}</p>
              </div>
              <div>
                <small className="text-gray-600 dark:text-gray-400 block mb-1">Data:</small>
                <p className="text-gray-900 dark:text-white">{selectedDate?.toLocaleDateString('pt-BR')}</p>
              </div>
              <div>
                <small className="text-gray-600 dark:text-gray-400 block mb-1">Horário:</small>
                <p className="text-gray-900 dark:text-white">{horaInicio} - {horaFim} ({duracaoTexto})</p>
              </div>
              <div>
                <small className="text-gray-600 dark:text-gray-400 block mb-1">Solicitante:</small>
                <p className="text-gray-900 dark:text-white">{formData.nome}</p>
              </div>
              <div>
                <small className="text-gray-600 dark:text-gray-400 block mb-1">Email:</small>
                <p className="text-gray-900 dark:text-white">{formData.email}</p>
              </div>
              <div>
                <small className="text-gray-600 dark:text-gray-400 block mb-1">Telefone:</small>
                <p className="text-gray-900 dark:text-white">{formData.telefone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 pt-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setStep(2)}
            className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <Button
            onClick={handleConfirmarAgendamento}
            className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
          >
            <Check className="w-4 h-4 mr-2" /> Confirmar Agendamento
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Building2 className="w-8 h-8" />}
        title="Agendamento de Salas"
        description="Gerencie reservas de salas de reunião"
      />

      {/* Navegação */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          onClick={() => setView('agendar')}
          variant={view === 'agendar' ? 'default' : 'outline'}
          className={view === 'agendar' ? 'bg-[#000aff] text-white w-full sm:w-auto' : 'w-full sm:w-auto'}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Agendar Sala
        </Button>
        <Button
          onClick={() => setView('lista')}
          variant={view === 'lista' ? 'default' : 'outline'}
          className={view === 'lista' ? 'bg-[#000aff] text-white w-full sm:w-auto' : 'w-full sm:w-auto'}
        >
          <History className="w-4 h-4 mr-2" />
          Todos os Agendamentos
        </Button>
      </div>

      {/* Tela de Agendamento */}
      {view === 'agendar' && (
        <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </CardContent>
        </Card>
      )}

      {/* Tela de Lista de Agendamentos */}
      {view === 'lista' && (
        <>
          {/* Filtros */}
          <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-gray-700 dark:text-gray-300 mb-2 block">Sala</label>
                  <div className="relative">
                    <select
                      value={filterRoom}
                      onChange={(e) => setFilterRoom(e.target.value)}
                      className="w-full px-4 pr-10 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-gray-900 dark:text-white appearance-none cursor-pointer"
                    >
                      <option value="">Todas as salas</option>
                      {SALAS.map(sala => (
                        <option key={sala.id} value={sala.id}>{sala.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <DateInput
                  label="Data Inicial"
                  value={filterDateStart}
                  onChange={setFilterDateStart}
                  placeholder="Início"
                  maxDate={filterDateEnd ? new Date(filterDateEnd + 'T00:00:00') : undefined}
                />
                <DateInput
                  label="Data Final"
                  value={filterDateEnd}
                  onChange={setFilterDateEnd}
                  placeholder="Fim"
                  minDate={filterDateStart ? new Date(filterDateStart + 'T00:00:00') : undefined}
                />
                <div className="flex items-end">
                  <Button
                    onClick={limparFiltros}
                    variant="outline"
                    className="border-gray-300 dark:border-gray-700 w-full"
                  >
                    <X className="w-4 h-4 mr-2" /> Limpar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Agendamentos */}
          {filteredAgendamentos.length === 0 ? (
            <EmptyState
              icon={<Calendar className="w-16 h-16" />}
              title="Nenhum agendamento encontrado"
              description="Não há agendamentos para os filtros selecionados"
            />
          ) : (
            <div className="space-y-4">
              {filteredAgendamentos.map(agendamento => {
                const salaInfo = SALAS.find(s => s.id === agendamento.sala);
                const isPast = new Date(agendamento.data + 'T' + agendamento.horaInicio) < new Date();
                
                return (
                  <Card
                    key={agendamento.id}
                    className={`bg-white dark:bg-black border-l-4 ${
                      agendamento.status === 'cancelado'
                        ? 'border-l-red-500'
                        : 'border-l-[#000aff]'
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-gray-900 dark:text-white">{salaInfo?.name}</h4>
                            <StatusBadge
                              status={agendamento.status === 'confirmado' ? 'success' : 'error'}
                              label={agendamento.status === 'confirmado' ? 'Confirmado' : 'Cancelado'}
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <small className="text-gray-600 dark:text-gray-400">
                                {new Date(agendamento.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                              </small>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <small className="text-gray-600 dark:text-gray-400">
                                {agendamento.horaInicio} - {agendamento.horaFim}
                              </small>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-gray-500" />
                              <small className="text-gray-600 dark:text-gray-400">
                                {agendamento.nome}
                              </small>
                            </div>
                          </div>
                        </div>
                        
                        {!isPast && agendamento.status === 'confirmado' && (
                          <Button
                            onClick={() => handleCancelarAgendamento(agendamento.id)}
                            variant="outline"
                            className="border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                          >
                            <X className="w-4 h-4 mr-2" /> Cancelar
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Modal de Sucesso */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <Check className="w-6 h-6" />
              Agendamento Realizado!
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Sua sala foi agendada com sucesso. Você receberá uma confirmação por email em breve.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              onClick={() => setShowSuccessModal(false)}
              className="bg-[#000aff] hover:bg-[#0008e6] text-white"
            >
              Entendi
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
