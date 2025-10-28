/**
 * ============================================================================
 * CHECKLIST DE ATENDIMENTO - Sistema de Acompanhamento Estratégico
 * ============================================================================
 * 
 * FUNCIONALIDADES:
 * - Gerenciamento de alunos (criar, editar, excluir)
 * - Checklist personalizado por aluno
 * - Categorias: Pré, Durante, Pós (Depósito ou Indicação), Finalização
 * - Progresso inteligente baseado em categorias completas
 * - Persistência em localStorage
 * - Exportação de dados
 * - Alertas de status
 * 
 * ============================================================================
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardCheck, Plus, Trash2, Download, X, Check, 
  AlertCircle, CheckCircle2, User, ChevronDown, RotateCcw
} from 'lucide-react';
import { PageHeader } from './common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { toast } from 'sonner@2.0.3';

// ============================================================================
// TIPOS
// ============================================================================

interface ChecklistItem {
  id: string;
  category: string;
  subCategory?: string;
  label: string;
}

interface Student {
  id: string;
  name: string;
  phone: string;
  checklist: Record<string, boolean>;
  selectedPostType: 'deposito' | 'indicacao';
  createdAt: string;
}

interface ProgressData {
  percentage: number;
  allCoreCompleted: boolean;
  preCompleted: boolean;
  duringCompleted: boolean;
  postCompleted: boolean;
  finalCompleted: boolean;
  depositCompleted: boolean;
  referralCompleted: boolean;
}

// ============================================================================
// DADOS DO CHECKLIST
// ============================================================================

const CHECKLIST_ITEMS: ChecklistItem[] = [
  // Pré-Atendimento
  { id: 'pre-1', category: 'Pré-Atendimento', label: 'Conferi se o aluno é novo ou já possui conta.' },
  { id: 'pre-2', category: 'Pré-Atendimento', label: 'Confirmei se já fez algum depósito anterior.' },
  { id: 'pre-3', category: 'Pré-Atendimento', label: 'Verifiquei se o aluno entende o que é trading.' },
  
  // Durante o Atendimento
  { id: 'during-1', category: 'Durante o Atendimento', label: 'Classifiquei o tipo de aluno (iniciante, curioso, avançado).' },
  { id: 'during-2', category: 'Durante o Atendimento', label: 'Identifiquei a objeção real do aluno.' },
  { id: 'during-3', category: 'Durante o Atendimento', label: 'Usei argumento adaptado e personalizado.' },
  { id: 'during-4', category: 'Durante o Atendimento', label: 'Ofereci alternativa caso o aluno esteja sem verba.' },
  { id: 'during-5', category: 'Durante o Atendimento', label: 'Expliquei os benefícios reais da ativação ou novo depósito.' },
  { id: 'during-6', category: 'Durante o Atendimento', label: 'Confirmei se a solução ajudou o aluno.' },
  
  // Pós-Atendimento - Depósito
  { id: 'post-dep-1', category: 'Pós-Atendimento', subCategory: 'deposito', label: 'Verifiquei se o depósito foi realizado com sucesso.' },
  { id: 'post-dep-2', category: 'Pós-Atendimento', subCategory: 'deposito', label: 'Solicitei o print correto do histórico de transações.' },
  { id: 'post-dep-3', category: 'Pós-Atendimento', subCategory: 'deposito', label: 'Salvei as informações necessárias do aluno.' },
  { id: 'post-dep-4', category: 'Pós-Atendimento', subCategory: 'deposito', label: 'Atualizei minha planilha de RCC (caso necessário).' },
  
  // Pós-Atendimento - Indicação
  { id: 'post-ind-1', category: 'Pós-Atendimento', subCategory: 'indicacao', label: 'Fiz o aluno se interessar no Aldeia/Tribo.' },
  { id: 'post-ind-2', category: 'Pós-Atendimento', subCategory: 'indicacao', label: 'Falei que iria indicar ele ao assessor.' },
  { id: 'post-ind-3', category: 'Pós-Atendimento', subCategory: 'indicacao', label: 'Enviei o interesse dele no grupo do WhatsApp.' },
  { id: 'post-ind-4', category: 'Pós-Atendimento', subCategory: 'indicacao', label: 'Preenchi o formulário de indicação.' },
  { id: 'post-ind-5', category: 'Pós-Atendimento', subCategory: 'indicacao', label: 'Mandei a copy finalizando a indicação.' },
  { id: 'post-ind-6', category: 'Pós-Atendimento', subCategory: 'indicacao', label: 'Salvei os dados de indicação dele.' },
  
  // Finalização
  { id: 'final-1', category: 'Finalização', label: 'Perguntei se havia mais alguma dúvida.' },
  { id: 'final-2', category: 'Finalização', label: 'Agradeci o contato.' },
  { id: 'final-3', category: 'Finalização', label: 'Me coloquei à disposição para futuros atendimentos.' },
  { id: 'final-4', category: 'Finalização', label: 'Finalizei o atendimento.' }
];

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export function ChecklistAtendimentoPage() {
  const navigate = useNavigate();
  
  const [students, setStudents] = useState<Record<string, Student>>({});
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Pré-Atendimento']));

  // ============================================================================
  // PERSISTÊNCIA
  // ============================================================================

  useEffect(() => {
    const saved = localStorage.getItem('attendanceStudents');
    if (saved) {
      const parsed = JSON.parse(saved);
      setStudents(parsed);
      const studentsArray = Object.values(parsed);
      if (studentsArray.length > 0) {
        setCurrentStudentId(studentsArray[0].id);
      }
    }
  }, []);

  const saveData = (data: Record<string, Student>) => {
    localStorage.setItem('attendanceStudents', JSON.stringify(data));
    setStudents(data);
  };

  // ============================================================================
  // CÁLCULO DE PROGRESSO
  // ============================================================================

  const calculateProgress = (student: Student): ProgressData => {
    const checklistState = student.checklist;
    
    const preItems = CHECKLIST_ITEMS.filter(item => item.category === 'Pré-Atendimento');
    const duringItems = CHECKLIST_ITEMS.filter(item => item.category === 'Durante o Atendimento');
    const finalItems = CHECKLIST_ITEMS.filter(item => item.category === 'Finalização');
    const depositItems = CHECKLIST_ITEMS.filter(item => item.subCategory === 'deposito');
    const referralItems = CHECKLIST_ITEMS.filter(item => item.subCategory === 'indicacao');

    const preCompleted = preItems.every(item => checklistState[item.id]);
    const duringCompleted = duringItems.every(item => checklistState[item.id]);
    const finalCompleted = finalItems.every(item => checklistState[item.id]);
    const depositCompleted = depositItems.every(item => checklistState[item.id]);
    const referralCompleted = referralItems.every(item => checklistState[item.id]);
    const postCompleted = depositCompleted || referralCompleted;
    const allCoreCompleted = preCompleted && duringCompleted && finalCompleted && postCompleted;

    let completedSections = 0;
    const totalSections = 4;

    if (preCompleted) completedSections++;
    if (duringCompleted) completedSections++;
    if (postCompleted) completedSections++;
    if (finalCompleted) completedSections++;

    const percentage = Math.round((completedSections / totalSections) * 100);

    return {
      percentage,
      allCoreCompleted,
      preCompleted,
      duringCompleted,
      postCompleted,
      finalCompleted,
      depositCompleted,
      referralCompleted
    };
  };

  // ============================================================================
  // FORMATAÇÃO
  // ============================================================================

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) {
      return `(${numbers}`;
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  // ============================================================================
  // CRUD DE ALUNOS
  // ============================================================================

  const createStudent = () => {
    if (!formName.trim() || !formPhone.trim()) {
      toast.error('Preencha todos os campos');
      return;
    }

    const studentId = `student_${Date.now()}`;
    const checklist: Record<string, boolean> = {};
    CHECKLIST_ITEMS.forEach(item => {
      checklist[item.id] = false;
    });

    const newStudent: Student = {
      id: studentId,
      name: formName.trim(),
      phone: formPhone.trim(),
      checklist,
      selectedPostType: 'deposito',
      createdAt: new Date().toISOString()
    };

    const newStudents = { ...students, [studentId]: newStudent };
    saveData(newStudents);
    setCurrentStudentId(studentId);
    setShowForm(false);
    setFormName('');
    setFormPhone('');
    toast.success('Aluno criado com sucesso!');
  };

  const deleteStudent = () => {
    if (!currentStudentId) return;
    
    const student = students[currentStudentId];
    if (confirm(`Excluir "${student.name}" e todos os seus dados?`)) {
      const newStudents = { ...students };
      delete newStudents[currentStudentId];
      saveData(newStudents);
      setCurrentStudentId(null);
      toast.success('Aluno excluído!');
    }
  };

  const exportData = () => {
    const studentsArray = Object.values(students);
    if (studentsArray.length === 0) {
      toast.error('Nenhum dado para exportar');
      return;
    }

    let text = 'DADOS DOS ALUNOS - CHECKLIST DE ATENDIMENTO\n';
    text += '='.repeat(50) + '\n\n';

    studentsArray.forEach(student => {
      const progress = calculateProgress(student);
      text += `ALUNO: ${student.name}\n`;
      text += `WHATSAPP: ${student.phone}\n`;
      text += `PROGRESSO: ${progress.percentage}% ${progress.allCoreCompleted ? '(COMPLETO)' : '(INCOMPLETO)'}\n`;
      text += `CADASTRADO EM: ${new Date(student.createdAt).toLocaleString('pt-BR')}\n`;
      text += '\nITENS CONCLUÍDOS:\n';

      CHECKLIST_ITEMS.forEach(item => {
        if (student.checklist[item.id]) {
          text += `✓ ${item.category}: ${item.label}\n`;
        }
      });

      text += '\n' + '-'.repeat(50) + '\n\n';
    });

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `checklist-alunos-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Dados exportados!');
  };

  // ============================================================================
  // CHECKLIST
  // ============================================================================

  const toggleItem = (itemId: string) => {
    if (!currentStudentId) return;

    const newStudents = { ...students };
    newStudents[currentStudentId].checklist[itemId] = !newStudents[currentStudentId].checklist[itemId];
    saveData(newStudents);
  };

  const resetChecklist = () => {
    if (!currentStudentId) return;

    const student = students[currentStudentId];
    if (confirm(`Resetar todo o checklist de "${student.name}"?`)) {
      const newStudents = { ...students };
      CHECKLIST_ITEMS.forEach(item => {
        newStudents[currentStudentId].checklist[item.id] = false;
      });
      saveData(newStudents);
      toast.success('Checklist resetado!');
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      newSet.has(category) ? newSet.delete(category) : newSet.add(category);
      return newSet;
    });
  };

  const changePostType = (type: 'deposito' | 'indicacao') => {
    if (!currentStudentId) return;
    const newStudents = { ...students };
    newStudents[currentStudentId].selectedPostType = type;
    saveData(newStudents);
  };

  // ============================================================================
  // RENDERIZAÇÃO
  // ============================================================================

  const studentsArray = Object.values(students);
  const currentStudent = currentStudentId ? students[currentStudentId] : null;
  const progress = currentStudent ? calculateProgress(currentStudent) : null;

  const categoriesOrder = ['Pré-Atendimento', 'Durante o Atendimento', 'Pós-Atendimento', 'Finalização'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Checklist do Atendimento"
        description="Checklist estratégico para atendimento completo e eficaz"
        onBack={() => navigate('/ferramentas')}
        icon={<ClipboardCheck className="w-5 h-5 text-[#000aff]" />}
      />

      {/* Alertas Informativos */}
      <div className="space-y-3">
        <Alert className="border-[#000aff]/20 bg-[#000aff]/5 dark:bg-[#000aff]/10">
          <AlertCircle className="w-4 h-4 text-[#000aff]" />
          <AlertDescription>
            <strong>ATENÇÃO!</strong> Este checklist é interno para garantir um suporte completo. 
            Nenhuma dessas informações é compartilhada com o aluno.
          </AlertDescription>
        </Alert>

        <Alert className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
          <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
          <AlertDescription>
            <strong>IMPORTANTE!</strong> NÃO preencha este checklist para todos os alunos. Use apenas para aqueles que são potencial depósito ou potencial indicação. Foque nos atendimentos estratégicos que podem gerar resultados.
          </AlertDescription>
        </Alert>
      </div>

      {/* Gerenciar Alunos */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-gray-900 dark:text-white">Gerenciar Alunos</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowForm(!showForm)}
                className="bg-green-600 hover:bg-green-700 gap-2"
              >
                <Plus className="w-4 h-4" />
                Novo Aluno
              </Button>
              <Button
                variant="outline"
                onClick={exportData}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Formulário */}
          {showForm && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Aluno</Label>
                  <Input
                    id="name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Digite o nome completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">WhatsApp (Celular)</Label>
                  <Input
                    id="phone"
                    value={formPhone}
                    onChange={(e) => setFormPhone(formatPhone(e.target.value))}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button onClick={createStudent} className="bg-[#000aff] hover:bg-[#0008cc]">
                  Salvar Aluno
                </Button>
              </div>
            </div>
          )}

          {/* Lista de Alunos */}
          {studentsArray.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>Nenhum aluno cadastrado ainda.</p>
              <p>Clique em "Novo Aluno" para começar.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {studentsArray.map(student => {
                const studentProgress = calculateProgress(student);
                const isActive = currentStudentId === student.id;

                return (
                  <div
                    key={student.id}
                    onClick={() => setCurrentStudentId(student.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isActive
                        ? 'border-[#000aff] bg-[#000aff]/5 dark:bg-[#000aff]/10'
                        : 'border-gray-200 dark:border-gray-800 hover:border-[#000aff]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="text-gray-900 dark:text-white">{student.name}</h4>
                        <small className="text-gray-600 dark:text-gray-400">{student.phone}</small>
                      </div>
                      <Badge
                        className={`${
                          studentProgress.allCoreCompleted
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {studentProgress.percentage}%
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Checklist do Aluno Selecionado */}
      {currentStudent && progress && (
        <div className="space-y-6">
          {/* Card Principal do Checklist */}
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#000aff] rounded-lg flex items-center justify-center">
                    <ClipboardCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-gray-900 dark:text-white">
                      {currentStudent.name}
                    </CardTitle>
                    <small className="text-gray-600 dark:text-gray-400">
                      {progress.percentage}% concluído - {progress.allCoreCompleted ? 'Atendimento completo!' : 'Atendimento inteligente'}
                    </small>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetChecklist}
                    className="gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Resetar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={deleteStudent}
                    className="text-red-600 hover:text-red-700 gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Excluir
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Barra de Progresso */}
              <div className="space-y-2">
                <Progress value={progress.percentage} className="h-3" />
              </div>

              {/* Categorias do Checklist */}
              <div className="space-y-4">
                {categoriesOrder.map(category => {
                  const isExpanded = expandedCategories.has(category);
                  let categoryCompleted = false;

                  if (category === 'Pré-Atendimento') categoryCompleted = progress.preCompleted;
                  else if (category === 'Durante o Atendimento') categoryCompleted = progress.duringCompleted;
                  else if (category === 'Pós-Atendimento') categoryCompleted = progress.postCompleted;
                  else if (category === 'Finalização') categoryCompleted = progress.finalCompleted;

                  const categoryItems = CHECKLIST_ITEMS.filter(item => item.category === category);

                  return (
                    <Card key={category} className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
                      <CardHeader
                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => toggleCategory(category)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <h4 className="text-gray-900 dark:text-white">{category}</h4>
                            {categoryCompleted && (
                              <Badge className="bg-green-600 hover:bg-green-700">
                                <Check className="w-3 h-3 mr-1" />
                                Completo
                              </Badge>
                            )}
                          </div>
                          <ChevronDown
                            className={`w-5 h-5 transition-transform text-gray-600 dark:text-gray-400 ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                      </CardHeader>

                      {isExpanded && (
                        <CardContent className="pt-0 space-y-4">
                          {/* Botões de Pós-Atendimento */}
                          {category === 'Pós-Atendimento' && (
                            <div className="flex gap-2 flex-wrap">
                              <Button
                                variant={currentStudent.selectedPostType === 'deposito' ? 'default' : 'outline'}
                                onClick={() => changePostType('deposito')}
                                className={`gap-2 ${
                                  currentStudent.selectedPostType === 'deposito'
                                    ? 'bg-[#000aff] hover:bg-[#0008cc]'
                                    : ''
                                }`}
                              >
                                Depósito
                                {progress.depositCompleted && <Check className="w-4 h-4" />}
                              </Button>
                              <Button
                                variant={currentStudent.selectedPostType === 'indicacao' ? 'default' : 'outline'}
                                onClick={() => changePostType('indicacao')}
                                className={`gap-2 ${
                                  currentStudent.selectedPostType === 'indicacao'
                                    ? 'bg-[#000aff] hover:bg-[#0008cc]'
                                    : ''
                                }`}
                              >
                                Indicação
                                {progress.referralCompleted && <Check className="w-4 h-4" />}
                              </Button>
                            </div>
                          )}

                          {/* Items */}
                          <div className="space-y-2">
                            {categoryItems
                              .filter(item => {
                                if (category !== 'Pós-Atendimento') return true;
                                return item.subCategory === currentStudent.selectedPostType;
                              })
                              .map(item => {
                                const isChecked = currentStudent.checklist[item.id];

                                return (
                                  <div
                                    key={item.id}
                                    onClick={() => toggleItem(item.id)}
                                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                      isChecked
                                        ? 'border-green-600 bg-green-50 dark:bg-green-900/20'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-[#000aff]/50'
                                    }`}
                                  >
                                    <div className="flex items-start gap-3">
                                      <div
                                        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                          isChecked
                                            ? 'bg-[#000aff] border-[#000aff]'
                                            : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                      >
                                        {isChecked && <Check className="w-3 h-3 text-white" />}
                                      </div>
                                      <p
                                        className={`${
                                          isChecked
                                            ? 'line-through text-gray-500 dark:text-gray-400'
                                            : 'text-gray-900 dark:text-white'
                                        }`}
                                      >
                                        {item.label}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Alertas de Status */}
          {progress.percentage > 0 && !progress.allCoreCompleted && (
            <Alert className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
              <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <AlertDescription>
                <strong>ATENÇÃO!</strong> Parece que ainda há etapas pendentes. Complete todas as seções 
                essenciais ou finalize completamente uma das opções pós-atendimento (Depósito OU Indicação) 
                para garantir o melhor suporte ao aluno.
              </AlertDescription>
            </Alert>
          )}

          {progress.allCoreCompleted && (
            <Alert className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
              <AlertDescription>
                <strong>PARABÉNS!</strong> Atendimento completo realizado! Você finalizou todas as etapas 
                essenciais e demonstrou excelência no suporte ao aluno.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}
