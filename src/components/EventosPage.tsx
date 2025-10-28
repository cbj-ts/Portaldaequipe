/**
 * ============================================================================
 * EVENTOS - Central de Recursos e Links
 * ============================================================================
 * 
 * Sistema hierárquico de organização de eventos, links e recursos:
 * - Categorias por perfil (Leads, Aldeia, Tribo)
 * - Grupos com acordeão
 * - Items com conteúdo copiável
 * - CRUD completo para admins
 * 
 * ============================================================================
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Plus, Edit2, Trash2, Copy, Check, ChevronDown, 
  Folder, FileText, Link as LinkIcon, Sparkles
} from 'lucide-react';
import { PageHeader } from './common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

// ============================================================================
// TIPOS
// ============================================================================

interface EventItem {
  id: string;
  title: string;
  icon: string;
  text: string;
}

interface EventGroup {
  id: string;
  name: string;
  icon: string;
  items: EventItem[];
}

interface EventCategory {
  id: string;
  name: string;
  icon: string;
  targetTag: 'leads' | 'aldeia' | 'tribo';
  items: EventItem[];
  groups: EventGroup[];
}

// ============================================================================
// CONSTANTES
// ============================================================================

const SUGGESTED_EMOJIS = [
  '📅', '🎯', '🔗', '⚠️', '💡', '✅', '➡️', '❓', '⭐', 
  '🔴', '🔵', '🟢', '💰', '🔔', '💬', '📄', '📈', '🚀', 
  '🛠️', '🧠', '✨', '🚫', '📌', '🎉', '🎓', '💻', '📊'
];

const MOCK_DATA: EventCategory[] = [
  {
    id: '1',
    name: 'Webinars',
    icon: '📅',
    targetTag: 'leads',
    items: [
      {
        id: 'i1',
        title: 'Webinar de Boas-Vindas',
        icon: '🎯',
        text: 'https://zoom.us/j/123456789\nData: Toda Segunda às 19h\nSenha: welcome2025'
      }
    ],
    groups: [
      {
        id: 'g1',
        name: 'Próximos Eventos',
        icon: '🔔',
        items: [
          {
            id: 'i2',
            title: 'Introdução ao Trading',
            icon: '📊',
            text: 'https://zoom.us/j/987654321\nData: 25/10/2025 às 19h\nDuração: 2 horas'
          }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Treinamentos',
    icon: '🎓',
    targetTag: 'aldeia',
    items: [],
    groups: [
      {
        id: 'g2',
        name: 'Cursos Básicos',
        icon: '💻',
        items: [
          {
            id: 'i3',
            title: 'Plataforma de Trading',
            icon: '🚀',
            text: 'Link: https://learn.tradestars.com/basico\nDuração: 2 horas\nCertificado incluso'
          }
        ]
      }
    ]
  }
];

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export function EventosPage() {
  const navigate = useNavigate();
  
  // Estado
  const [categories, setCategories] = useState<EventCategory[]>(MOCK_DATA);
  const [activeProfile, setActiveProfile] = useState<'leads' | 'aldeia' | 'tribo'>('leads');
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  
  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'category' | 'group' | 'item'>('category');
  const [modalAction, setModalAction] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [parentId, setParentId] = useState<string | null>(null);
  const [grandparentId, setGrandparentId] = useState<string | null>(null);
  
  // Form
  const [formName, setFormName] = useState('');
  const [formIcon, setFormIcon] = useState('');
  const [formText, setFormText] = useState('');
  const [formTargetTag, setFormTargetTag] = useState<'leads' | 'aldeia' | 'tribo'>('leads');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  // Delete
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; ids: string[] } | null>(null);
  
  // Copy feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Permissão (adaptar conforme contexto do usuário)
  const userSector = 'Comunicação';
  const canEdit = ['Co-líder', 'Líder', 'Comunicação'].includes(userSector);

  // ============================================================================
  // EFEITOS
  // ============================================================================

  useEffect(() => {
    const filtered = getFilteredCategories();
    if (filtered.length > 0 && !activeCategoryId) {
      setActiveCategoryId(filtered[0].id);
    }
  }, [activeProfile, categories]);

  // ============================================================================
  // FUNÇÕES AUXILIARES
  // ============================================================================

  const getFilteredCategories = () => categories.filter(c => c.targetTag === activeProfile);
  const getActiveCategory = () => categories.find(c => c.id === activeCategoryId);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      newSet.has(groupId) ? newSet.delete(groupId) : newSet.add(groupId);
      return newSet;
    });
  };

  const toggleItem = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      newSet.has(itemId) ? newSet.delete(itemId) : newSet.add(itemId);
      return newSet;
    });
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Conteúdo copiado!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ============================================================================
  // CRUD - MODAL
  // ============================================================================

  const openModal = (
    mode: 'category' | 'group' | 'item',
    action: 'create' | 'edit',
    categoryId?: string,
    groupId?: string,
    itemId?: string
  ) => {
    setModalMode(mode);
    setModalAction(action);
    setFormName('');
    setFormIcon('');
    setFormText('');
    setFormTargetTag(activeProfile);
    setEditingId(null);
    setParentId(null);
    setGrandparentId(null);
    
    if (action === 'edit') {
      if (mode === 'category' && categoryId) {
        const cat = categories.find(c => c.id === categoryId);
        if (cat) {
          setFormName(cat.name);
          setFormIcon(cat.icon);
          setFormTargetTag(cat.targetTag);
          setEditingId(categoryId);
        }
      } else if (mode === 'group' && categoryId && groupId) {
        const cat = categories.find(c => c.id === categoryId);
        const group = cat?.groups.find(g => g.id === groupId);
        if (group) {
          setFormName(group.name);
          setFormIcon(group.icon);
          setEditingId(groupId);
          setParentId(categoryId);
        }
      } else if (mode === 'item' && categoryId && itemId) {
        const cat = categories.find(c => c.id === categoryId);
        let item: EventItem | undefined;
        
        if (groupId) {
          const group = cat?.groups.find(g => g.id === groupId);
          item = group?.items.find(i => i.id === itemId);
          setGrandparentId(categoryId);
          setParentId(groupId);
        } else {
          item = cat?.items.find(i => i.id === itemId);
          setParentId(categoryId);
        }
        
        if (item) {
          setFormName(item.title);
          setFormIcon(item.icon);
          setFormText(item.text);
          setEditingId(itemId);
        }
      }
    } else {
      setParentId(categoryId || null);
      setGrandparentId(groupId || null);
    }
    
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    const newCategories = [...categories];

    if (modalMode === 'category') {
      if (modalAction === 'create') {
        newCategories.push({
          id: `cat_${Date.now()}`,
          name: formName,
          icon: formIcon,
          targetTag: formTargetTag,
          items: [],
          groups: []
        });
        toast.success('Categoria criada com sucesso!');
      } else {
        const catIndex = newCategories.findIndex(c => c.id === editingId);
        if (catIndex !== -1) {
          newCategories[catIndex] = {
            ...newCategories[catIndex],
            name: formName,
            icon: formIcon,
            targetTag: formTargetTag
          };
          toast.success('Categoria atualizada!');
        }
      }
    } else if (modalMode === 'group') {
      const catIndex = newCategories.findIndex(c => c.id === parentId);
      if (catIndex !== -1) {
        if (modalAction === 'create') {
          newCategories[catIndex].groups.push({
            id: `grp_${Date.now()}`,
            name: formName,
            icon: formIcon,
            items: []
          });
          toast.success('Grupo criado com sucesso!');
        } else {
          const groupIndex = newCategories[catIndex].groups.findIndex(g => g.id === editingId);
          if (groupIndex !== -1) {
            newCategories[catIndex].groups[groupIndex] = {
              ...newCategories[catIndex].groups[groupIndex],
              name: formName,
              icon: formIcon
            };
            toast.success('Grupo atualizado!');
          }
        }
      }
    } else if (modalMode === 'item') {
      if (grandparentId) {
        const catIndex = newCategories.findIndex(c => c.id === grandparentId);
        if (catIndex !== -1) {
          const groupIndex = newCategories[catIndex].groups.findIndex(g => g.id === parentId);
          if (groupIndex !== -1) {
            if (modalAction === 'create') {
              newCategories[catIndex].groups[groupIndex].items.push({
                id: `itm_${Date.now()}`,
                title: formName,
                icon: formIcon,
                text: formText
              });
              toast.success('Item criado com sucesso!');
            } else {
              const itemIndex = newCategories[catIndex].groups[groupIndex].items.findIndex(i => i.id === editingId);
              if (itemIndex !== -1) {
                newCategories[catIndex].groups[groupIndex].items[itemIndex] = {
                  id: editingId!,
                  title: formName,
                  icon: formIcon,
                  text: formText
                };
                toast.success('Item atualizado!');
              }
            }
          }
        }
      } else {
        const catIndex = newCategories.findIndex(c => c.id === parentId);
        if (catIndex !== -1) {
          if (modalAction === 'create') {
            newCategories[catIndex].items.push({
              id: `itm_${Date.now()}`,
              title: formName,
              icon: formIcon,
              text: formText
            });
            toast.success('Item criado com sucesso!');
          } else {
            const itemIndex = newCategories[catIndex].items.findIndex(i => i.id === editingId);
            if (itemIndex !== -1) {
              newCategories[catIndex].items[itemIndex] = {
                id: editingId!,
                title: formName,
                icon: formIcon,
                text: formText
              };
              toast.success('Item atualizado!');
            }
          }
        }
      }
    }

    setCategories(newCategories);
    setIsModalOpen(false);
  };

  // ============================================================================
  // CRUD - DELETE
  // ============================================================================

  const confirmDelete = (type: string, categoryId: string, groupId?: string, itemId?: string) => {
    const ids = [categoryId];
    if (groupId) ids.push(groupId);
    if (itemId) ids.push(itemId);
    setDeleteTarget({ type, ids });
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;

    const newCategories = [...categories];
    const [categoryId, groupId, itemId] = deleteTarget.ids;

    if (deleteTarget.type === 'category') {
      setCategories(newCategories.filter(c => c.id !== categoryId));
      toast.success('Categoria excluída!');
    } else if (deleteTarget.type === 'group') {
      const catIndex = newCategories.findIndex(c => c.id === categoryId);
      if (catIndex !== -1) {
        newCategories[catIndex].groups = newCategories[catIndex].groups.filter(g => g.id !== groupId);
        setCategories(newCategories);
        toast.success('Grupo excluído!');
      }
    } else if (deleteTarget.type === 'item') {
      const catIndex = newCategories.findIndex(c => c.id === categoryId);
      if (catIndex !== -1) {
        if (itemId && groupId) {
          const groupIndex = newCategories[catIndex].groups.findIndex(g => g.id === groupId);
          if (groupIndex !== -1) {
            newCategories[catIndex].groups[groupIndex].items = 
              newCategories[catIndex].groups[groupIndex].items.filter(i => i.id !== itemId);
          }
        } else {
          newCategories[catIndex].items = newCategories[catIndex].items.filter(i => i.id !== groupId);
        }
        setCategories(newCategories);
        toast.success('Item excluído!');
      }
    }

    setDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  // ============================================================================
  // RENDERIZAÇÃO
  // ============================================================================

  const filteredCategories = getFilteredCategories();
  const activeCategory = getActiveCategory();

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Eventos"
        description="Central de recursos, links e informações importantes organizados por perfil"
        onBack={() => navigate('/ferramentas')}
        icon={<Calendar className="w-5 h-5 text-[#000aff]" />}
      />

      {/* Seletor de Perfil */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Sparkles className="w-5 h-5 text-[#000aff]" />
            <h3 className="text-gray-900 dark:text-white">Selecione o Perfil</h3>
          </div>
          <Tabs value={activeProfile} onValueChange={(v) => setActiveProfile(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="leads">Leads</TabsTrigger>
              <TabsTrigger value="aldeia">Aldeia</TabsTrigger>
              <TabsTrigger value="tribo">Tribo</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Grid de Categorias */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900 dark:text-white">Categorias</h3>
          {canEdit && (
            <Button
              size="sm"
              onClick={() => openModal('category', 'create')}
              className="bg-[#000aff] hover:bg-[#0008cc] gap-2"
            >
              <Plus className="w-4 h-4" />
              Nova Categoria
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCategories.map(cat => (
            <Card
              key={cat.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                activeCategoryId === cat.id
                  ? 'border-[#000aff] shadow-lg bg-[#000aff]/5 dark:bg-[#000aff]/10'
                  : 'border-gray-200 dark:border-gray-800 hover:border-[#000aff]/50'
              }`}
              onClick={() => setActiveCategoryId(cat.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    activeCategoryId === cat.id
                      ? 'bg-[#000aff]'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    <span className={`text-2xl ${
                      activeCategoryId === cat.id ? '' : 'opacity-70'
                    }`}>
                      {cat.icon || '📁'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-gray-900 dark:text-white mb-1 truncate">{cat.name}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {cat.items.length + cat.groups.reduce((acc, g) => acc + g.items.length, 0)} items
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredCategories.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma categoria encontrada para este perfil</p>
              {canEdit && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openModal('category', 'create')}
                  className="mt-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar primeira categoria
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo da Categoria */}
      {activeCategory && (
        <div className="space-y-6">
          {/* Header da Categoria */}
          <Card className="bg-gradient-to-br from-[#000aff]/5 to-[#ac2aff]/5 dark:from-[#000aff]/10 dark:to-[#ac2aff]/10 border-[#000aff]/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#000aff] rounded-lg flex items-center justify-center">
                    <span className="text-3xl">{activeCategory.icon}</span>
                  </div>
                  <div>
                    <h2 className="text-gray-900 dark:text-white">{activeCategory.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {activeCategory.items.length + activeCategory.groups.reduce((acc, g) => acc + g.items.length, 0)} recursos disponíveis
                    </p>
                  </div>
                </div>
                {canEdit && (
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openModal('item', 'create', activeCategory.id)}
                      className="gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Novo Item
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openModal('group', 'create', activeCategory.id)}
                      className="gap-2"
                    >
                      <Folder className="w-4 h-4" />
                      Novo Grupo
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openModal('category', 'edit', activeCategory.id)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => confirmDelete('category', activeCategory.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Items Standalone */}
          {activeCategory.items.map(item => (
            <Card key={item.id} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 overflow-hidden">
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-200 dark:border-gray-800"
                onClick={() => toggleItem(item.id)}
              >
                <div className="flex items-center gap-3">
                  {item.icon && (
                    <div className="w-10 h-10 bg-[#000aff]/10 dark:bg-[#000aff]/20 rounded-lg flex items-center justify-center">
                      <span className="text-xl">{item.icon}</span>
                    </div>
                  )}
                  <h4 className="text-gray-900 dark:text-white">{item.title}</h4>
                </div>
                <div className="flex items-center gap-2">
                  {canEdit && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal('item', 'edit', activeCategory.id, item.id);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDelete('item', activeCategory.id, item.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  <ChevronDown
                    className={`w-5 h-5 transition-transform text-[#000aff] ${
                      expandedItems.has(item.id) ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </div>
              {expandedItems.has(item.id) && (
                <CardContent className="p-6 space-y-4 bg-gray-50 dark:bg-gray-800/50">
                  <div className="p-4 bg-gradient-to-br from-[#000aff] to-[#0008cc] text-white rounded-lg whitespace-pre-wrap shadow-lg">
                    <p>{item.text}</p>
                  </div>
                  <Button
                    onClick={() => handleCopy(item.text, item.id)}
                    className={`w-full gap-2 ${
                      copiedId === item.id
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-[#000aff] hover:bg-[#0008cc]'
                    }`}
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copiar Conteúdo
                      </>
                    )}
                  </Button>
                </CardContent>
              )}
            </Card>
          ))}

          {/* Grupos */}
          {activeCategory.groups.map(group => (
            <Card key={group.id} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 overflow-hidden">
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-200 dark:border-gray-800"
                onClick={() => toggleGroup(group.id)}
              >
                <div className="flex items-center gap-3">
                  {group.icon && (
                    <div className="w-10 h-10 bg-[#ac2aff]/10 dark:bg-[#ac2aff]/20 rounded-lg flex items-center justify-center">
                      <span className="text-xl">{group.icon}</span>
                    </div>
                  )}
                  <div>
                    <h4 className="text-gray-900 dark:text-white">{group.name}</h4>
                    <small className="text-gray-600 dark:text-gray-400">
                      {group.items.length} {group.items.length === 1 ? 'item' : 'items'}
                    </small>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {canEdit && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal('item', 'create', activeCategory.id, group.id);
                        }}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal('group', 'edit', activeCategory.id, group.id);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDelete('group', activeCategory.id, group.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  <ChevronDown
                    className={`w-5 h-5 transition-transform text-[#ac2aff] ${
                      expandedGroups.has(group.id) ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </div>
              {expandedGroups.has(group.id) && (
                <CardContent className="p-6 bg-gray-50 dark:bg-gray-800/50">
                  {group.items.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <p>Nenhum item neste grupo</p>
                      {canEdit && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openModal('item', 'create', activeCategory.id, group.id)}
                          className="mt-3"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar item
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {group.items.map(item => (
                        <Card key={item.id} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                {item.icon && <span className="text-lg flex-shrink-0">{item.icon}</span>}
                                <h4 className="text-gray-900 dark:text-white truncate">{item.title}</h4>
                              </div>
                              {canEdit && (
                                <div className="flex gap-1 flex-shrink-0">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => openModal('item', 'edit', activeCategory.id, group.id, item.id)}
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-red-600 hover:text-red-700"
                                    onClick={() => confirmDelete('item', activeCategory.id, group.id, item.id)}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="p-3 bg-gradient-to-br from-[#000aff] to-[#0008cc] text-white rounded-lg whitespace-pre-wrap shadow-md">
                              <small>{item.text}</small>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleCopy(item.text, item.id)}
                              className={`w-full gap-2 ${
                                copiedId === item.id
                                  ? 'bg-green-600 hover:bg-green-700'
                                  : 'bg-[#000aff] hover:bg-[#0008cc]'
                              }`}
                            >
                              {copiedId === item.id ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <small>Copiado!</small>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <small>Copiar</small>
                                </>
                              )}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}

          {/* Estado vazio */}
          {activeCategory.items.length === 0 && activeCategory.groups.length === 0 && (
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardContent className="p-12 text-center">
                <Folder className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                <h3 className="text-gray-900 dark:text-white mb-2">Nenhum recurso ainda</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Comece adicionando items ou grupos a esta categoria
                </p>
                {canEdit && (
                  <div className="flex gap-3 justify-center">
                    <Button
                      variant="outline"
                      onClick={() => openModal('item', 'create', activeCategory.id)}
                      className="gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Adicionar Item
                    </Button>
                    <Button
                      onClick={() => openModal('group', 'create', activeCategory.id)}
                      className="bg-[#000aff] hover:bg-[#0008cc] gap-2"
                    >
                      <Folder className="w-4 h-4" />
                      Criar Grupo
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Modal de Criação/Edição */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {modalAction === 'create' ? 'Criar' : 'Editar'}{' '}
              {modalMode === 'category' ? 'Categoria' : modalMode === 'group' ? 'Grupo' : 'Item'}
            </DialogTitle>
            <DialogDescription>
              {modalAction === 'create' ? 'Adicione' : 'Edite'} as informações {modalMode === 'category' ? 'da categoria' : modalMode === 'group' ? 'do grupo' : 'do item'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder={`Nome ${modalMode === 'category' ? 'da categoria' : modalMode === 'group' ? 'do grupo' : 'do item'}`}
              />
            </div>

            {modalMode === 'category' && (
              <div className="space-y-2">
                <Label>Público Alvo</Label>
                <div className="flex gap-2">
                  {(['leads', 'aldeia', 'tribo'] as const).map(tag => (
                    <Button
                      key={tag}
                      type="button"
                      variant={formTargetTag === tag ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFormTargetTag(tag)}
                      className={formTargetTag === tag ? 'bg-[#000aff] hover:bg-[#0008cc]' : ''}
                    >
                      {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Ícone (Emoji)</Label>
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-16 text-3xl justify-center"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  {formIcon || 'Selecionar emoji'}
                </Button>
                {showEmojiPicker && (
                  <Card className="absolute z-50 mt-2 p-3 w-full max-h-48 overflow-y-auto shadow-xl">
                    <div className="grid grid-cols-7 gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-10"
                        onClick={() => {
                          setFormIcon('');
                          setShowEmojiPicker(false);
                        }}
                      >
                        <small>✕</small>
                      </Button>
                      {SUGGESTED_EMOJIS.map(emoji => (
                        <Button
                          key={emoji}
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-10 text-xl"
                          onClick={() => {
                            setFormIcon(emoji);
                            setShowEmojiPicker(false);
                          }}
                        >
                          {emoji}
                        </Button>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            </div>

            {modalMode === 'item' && (
              <div className="space-y-2">
                <Label htmlFor="text">Conteúdo (Link/Texto)</Label>
                <Textarea
                  id="text"
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  placeholder="Cole o link ou escreva o conteúdo..."
                  rows={6}
                  className="font-mono"
                />
                <small className="text-gray-600 dark:text-gray-400">
                  Pode incluir links, instruções ou qualquer texto que será copiado
                </small>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-[#000aff] hover:bg-[#0008cc]">
              {modalAction === 'create' ? 'Criar' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este{' '}
              {deleteTarget?.type === 'category' ? 'categoria' : 
               deleteTarget?.type === 'group' ? 'grupo' : 'item'}?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
