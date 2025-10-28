/**
 * ============================================================================
 * CALENDÁRIO - Eventos e Agendamentos
 * ============================================================================
 *
 * ESTRUTURA:
 * 1. Header (h1 + descrição + botão criar evento)
 * 2. Grid 2 colunas:
 *    - Esquerda: Calendário + Eventos de Hoje
 *    - Direita: Próximos Eventos
 * 3. Modal para criar/editar eventos (apenas RH e Comunicação)
 *
 * CONTROLE DE ACESSO:
 * - RH e Comunicação: Podem criar, editar e excluir eventos
 * - Outros usuários: Apenas visualização
 *
 * RESPONSIVIDADE:
 * - Mobile: Tudo empilhado verticalmente
 * - Desktop (lg): Grid lado a lado
 *
 * ============================================================================
 */

import { Card, CardContent } from "./ui/card";
import { Calendar } from "./ui/calendar";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Label } from "./ui/label";
import { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import {
  Video,
  Calendar as CalendarIcon,
  Users,
  GraduationCap,
  Clock,
  Sparkles,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import { SectionCard, EmptyState } from "./common";
import { FormInput } from "./FormInput";
import { FormSelect } from "./FormSelect";
import { FormTextarea } from "./FormTextarea";
import { DateInput } from "./DateInput";
import { PrimaryButton } from "./PrimaryButton";
import { toast } from "sonner@2.0.3";
import {
  loadEventos,
  createEvento,
  updateEvento,
  deleteEvento,
  type Evento,
} from '../utils/localStorage';

// ============================================================================
// ARMAZENAMENTO LOCAL
// ============================================================================
// Usando localStorage até migração para MongoDB
// Ver: /utils/localStorage.ts

type EventType = "Treinamento" | "Reunião" | "Live" | "Workshop" | "Evento" | "Aniversário" | "Feriado";

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export function CalendarioPage() {
  const { user, isSetor } = useUser();
  const isRH = isSetor('RH');
  const isComunicacao = isSetor('Comunicação');
  const canEdit = isRH || isComunicacao;

  // Estados principais
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [eventos, setEventos] = useState<Evento[]>([]);
  
  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Evento | null>(null);
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  
  // Form
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventCategory, setEventCategory] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventLocation, setEventLocation] = useState('');

  // ============================================================================
  // LIFECYCLE
  // ============================================================================

  useEffect(() => {
    loadEventsFromLocal();
  }, []);

  // ============================================================================
  // FUNÇÕES DE DADOS
  // ============================================================================

  const loadEventsFromLocal = () => {
    try {
      const eventos = loadEventos();
      // Ordenar por data
      const sorted = eventos.sort((a, b) => a.date.localeCompare(b.date));
      setEventos(sorted);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      toast.error('Erro ao carregar eventos');
    }
  };

  // ============================================================================
  // FUNÇÕES DE MODAL
  // ============================================================================

  const openModal = (event: Evento | null = null) => {
    if (!canEdit && !event) {
      toast.error('Você não tem permissão para criar eventos.');
      return;
    }

    if (event) {
      // Modo de edição ou visualização
      setEditingEvent(event);
      setEventTitle(event.title);
      setEventDate(event.date);
      setEventTime(event.time || '');
      setEventCategory(event.category);
      setEventDescription(event.description || '');
      setEventLocation(event.location || '');
    } else {
      // Modo de criação
      setEditingEvent(null);
      setEventTitle('');
      setEventDate(date ? formatDateToISO(date) : '');
      setEventTime('');
      setEventCategory('');
      setEventDescription('');
      setEventLocation('');
    }
    
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingEvent(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!canEdit) {
      toast.error('Você não tem permissão para modificar eventos.');
      return;
    }

    if (!eventTitle.trim() || !eventDate || !eventCategory) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const eventoData = {
        title: eventTitle.trim(),
        date: eventDate,
        time: eventTime.trim() || null,
        category: eventCategory,
        description: eventDescription.trim() || null,
        location: eventLocation.trim() || null, // ✅ Campo local incluído
      };

      if (editingEvent) {
        // Atualizar evento existente
        updateEvento(editingEvent.id, eventoData);
        toast.success('Evento atualizado com sucesso! 📍');
      } else {
        // Criar novo evento
        createEvento(eventoData);
        toast.success('Evento criado com sucesso! 📍');
      }

      loadEventsFromLocal();
      closeModal();
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
      toast.error('Erro ao salvar evento.');
    }
  };

  const handleDelete = () => {
    if (!canEdit || !editingEvent) {
      toast.error('Você não tem permissão para excluir eventos.');
      return;
    }

    try {
      deleteEvento(editingEvent.id);
      toast.success('Evento excluído com sucesso!');
      loadEventsFromLocal();
      setConfirmDeleteModalOpen(false);
      closeModal();
    } catch (error) {
      console.error('Erro ao excluir evento:', error);
      toast.error('Falha ao excluir evento.');
    }
  };

  // ============================================================================
  // FUNÇÕES AUXILIARES
  // ============================================================================

  const formatDateToISO = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const parseISODate = (dateStr: string): Date => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isFutureDate = (eventDate: Date, selectedDate: Date) => {
    const eventStart = new Date(eventDate);
    eventStart.setHours(0, 0, 0, 0);
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);
    return eventStart > selected;
  };

  const mapCategoryToType = (category: string): EventType => {
    const mapping: Record<string, EventType> = {
      'treinamento': 'Treinamento',
      'reuniao': 'Reunião',
      'live': 'Live',
      'workshop': 'Workshop',
      'evento': 'Evento',
      'aniversario': 'Aniversário',
      'feriado': 'Feriado',
    };
    return mapping[category.toLowerCase()] || 'Evento';
  };

  // Filtrar eventos de hoje (data selecionada)
  const eventosDeHoje = eventos
    .filter((evento) => date && isSameDay(parseISODate(evento.date), date))
    .sort((a, b) => (a.time || '').localeCompare(b.time || ''));

  // Filtrar próximos eventos (futuros, excluindo hoje)
  const proximosEventos = eventos
    .filter((evento) => date && isFutureDate(parseISODate(evento.date), date))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Função para pegar ícone do tipo
  const getEventIcon = (category: string) => {
    const tipo = mapCategoryToType(category);
    switch (tipo) {
      case "Treinamento":
        return GraduationCap;
      case "Reunião":
        return Users;
      case "Live":
        return Video;
      case "Workshop":
        return GraduationCap;
      case "Evento":
      case "Aniversário":
      case "Feriado":
        return Sparkles;
      default:
        return CalendarIcon;
    }
  };

  // Função para pegar cor do badge
  const getBadgeColor = (category: string) => {
    const tipo = mapCategoryToType(category);
    switch (tipo) {
      case "Treinamento":
        return "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "Reunião":
        return "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800";
      case "Live":
        return "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800";
      case "Workshop":
        return "bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800";
      case "Evento":
        return "bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-400 border-pink-200 dark:border-pink-800";
      case "Aniversário":
        return "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
      case "Feriado":
        return "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-700";
    }
  };

  // ============================================================================
  // COMPONENTES
  // ============================================================================

  const EventoCard = ({
    evento,
    showDate = false,
  }: {
    evento: Evento;
    showDate?: boolean;
  }) => {
    const Icon = getEventIcon(evento.category);
    const tipo = mapCategoryToType(evento.category);

    return (
      <div 
        className="flex flex-col sm:flex-row items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:shadow-lg transition-all duration-200 hover:scale-[1.01] cursor-pointer"
        onClick={() => openModal(evento)}
      >
        <div className="p-3 rounded-xl bg-[#000aff] shadow-md">
          <Icon className="w-5 h-5 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start gap-2 mb-2">
            <h4 className="text-gray-900 dark:text-white">
              {evento.title}
            </h4>
            <Badge className={`${getBadgeColor(evento.category)} border`}>
              {tipo}
            </Badge>
          </div>

          {evento.description && (
            <p className="text-gray-600 dark:text-gray-400 mb-1">
              {evento.description}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            {showDate && (
              <small className="text-gray-500 dark:text-gray-500 flex items-center gap-1">
                <CalendarIcon className="w-3 h-3" />
                {parseISODate(evento.date).toLocaleDateString("pt-BR")}
              </small>
            )}
            {evento.time && (
              <small className="text-gray-500 dark:text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {evento.time}
              </small>
            )}
            {evento.location && (
              <small className="text-gray-500 dark:text-gray-500 flex items-center gap-1">
                📍 {evento.location}
              </small>
            )}
          </div>
        </div>

        {canEdit && (
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                openModal(evento);
              }}
              className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      {/* Header com botão */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-gray-900 dark:text-white mb-2">
            Calendário
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Acompanhe eventos, treinamentos e reuniões
          </p>
        </div>
        
        {canEdit && (
          <PrimaryButton
            onClick={() => openModal()}
            icon={<Plus className="w-5 h-5" />}
          >
            Novo Evento
          </PrimaryButton>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLUNA ESQUERDA: Calendário + Eventos de Hoje */}
        <div className="lg:col-span-1 space-y-6">
          {/* Calendário */}
          <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
            <CardContent className="flex justify-center px-6 py-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-xl border border-gray-200 dark:border-gray-800"
              />
            </CardContent>
          </Card>

          {/* Eventos de Hoje */}
          <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-[#000aff] rounded-full"></div>
                <h4 className="text-gray-900 dark:text-white">
                  Eventos do Dia
                </h4>
              </div>

              {eventosDeHoje.length > 0 ? (
                <div className="space-y-1">
                  {eventosDeHoje.map((evento) => (
                    <div
                      key={evento.id}
                      className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer"
                      onClick={() => openModal(evento)}
                    >
                      <small className="text-[#000aff] dark:text-[#000aff] font-medium min-w-[45px]">
                        {evento.time || 'Dia todo'}
                      </small>
                      <small className="text-gray-700 dark:text-gray-300">
                        {evento.title}
                      </small>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <CalendarIcon className="w-8 h-8 text-gray-300 dark:text-gray-700 mx-auto mb-2" />
                  <small className="text-gray-500 dark:text-gray-500">
                    Nenhum evento hoje
                  </small>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* COLUNA DIREITA: Próximos Eventos */}
        <Card className="lg:col-span-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="mb-6">
              <h3 className="text-gray-900 dark:text-white mb-1">
                Próximos Eventos
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Eventos agendados para os próximos dias
              </p>
            </div>

            <div className="space-y-3">
              {proximosEventos.length > 0 ? (
                proximosEventos.map((evento) => (
                  <EventoCard
                    key={evento.id}
                    evento={evento}
                    showDate
                  />
                ))
              ) : (
                <EmptyState
                  icon={<Sparkles className="w-16 h-16" />}
                  title="Nenhum evento futuro"
                  description="Não há eventos agendados para os próximos dias"
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MODAL DE CRIAR/EDITAR */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              {editingEvent ? (canEdit ? 'Editar Evento' : editingEvent.title) : 'Novo Evento'}
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              {editingEvent ? (canEdit ? 'Atualize as informações do evento' : 'Detalhes do evento') : 'Preencha os dados do novo evento'}
            </DialogDescription>
          </DialogHeader>

          {canEdit || !editingEvent ? (
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label>Título do Evento <span className="required-asterisk">*</span></Label>
                <FormInput
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="Ex: Reunião de equipe"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <DateInput
                  label="Data"
                  value={eventDate}
                  onChange={setEventDate}
                  placeholder="Selecione a data"
                  required
                />

                <div>
                  <Label>Horário</Label>
                  <FormInput
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label>Categoria <span className="required-asterisk">*</span></Label>
                <FormSelect
                  value={eventCategory}
                  onChange={(e) => setEventCategory(e.target.value)}
                  options={[
                    { value: '', label: 'Selecione uma categoria' },
                    { value: 'evento', label: '🎉 Evento' },
                    { value: 'reuniao', label: '👥 Reunião' },
                    { value: 'treinamento', label: '📚 Treinamento' },
                    { value: 'workshop', label: '🛠️ Workshop' },
                    { value: 'live', label: '📹 Live' },
                    { value: 'aniversario', label: '🎂 Aniversário' },
                    { value: 'feriado', label: '🎊 Feriado' },
                  ]}
                  required
                />
              </div>



              <div>
                <Label>Descrição</Label>
                <FormTextarea
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="Adicione detalhes sobre o evento..."
                  rows={4}
                />
              </div>

              <div>
                <Label>Local</Label>
                <FormInput
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="Ex: Sala de reuniões 1"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="h-10 px-6 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors inline-flex items-center justify-center"
                >
                  Cancelar
                </button>
                {editingEvent && canEdit && (
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteModalOpen(true)}
                    className="h-10 px-6 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Excluir
                  </button>
                )}
                <PrimaryButton type="submit">
                  {editingEvent ? 'Salvar Alterações' : 'Criar Evento'}
                </PrimaryButton>
              </div>
            </form>
          ) : (
            // Visualização para usuários sem permissão
            <div className="space-y-4 mt-4">
              {editingEvent && (
                <>
                  <div>
                    <small className="text-gray-600 dark:text-gray-400">Data e Horário</small>
                    <p className="text-gray-900 dark:text-white">
                      {parseISODate(editingEvent.date).toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                      {editingEvent.time && ` às ${editingEvent.time}`}
                    </p>
                  </div>
                  
                  <div>
                    <small className="text-gray-600 dark:text-gray-400">Categoria</small>
                    <div className="mt-1">
                      <Badge className={`${getBadgeColor(editingEvent.category)} border`}>
                        {mapCategoryToType(editingEvent.category)}
                      </Badge>
                    </div>
                  </div>



                  {editingEvent.description && (
                    <div>
                      <small className="text-gray-600 dark:text-gray-400">Descrição</small>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {editingEvent.description}
                      </p>
                    </div>
                  )}

                  {editingEvent.location && (
                    <div>
                      <small className="text-gray-600 dark:text-gray-400">Local</small>
                      <p className="text-gray-900 dark:text-white flex items-center gap-2">
                        📍 {editingEvent.location}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-800">
                    <button
                      onClick={closeModal}
                      className="h-10 px-6 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors inline-flex items-center justify-center"
                    >
                      Fechar
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      <Dialog open={confirmDeleteModalOpen} onOpenChange={setConfirmDeleteModalOpen}>
        <DialogContent className="max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <p className="text-gray-700 dark:text-gray-300 text-center">
              Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setConfirmDeleteModalOpen(false)}
                className="h-10 px-6 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors inline-flex items-center justify-center"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="h-10 px-6 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Excluir
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
