/**
 * ============================================================================
 * CHAMADOS LAYOUT - Layout Base para Páginas de Chamados
 * ============================================================================
 * Componente de layout reutilizável para todas as páginas de chamados
 * Inclui: Header, Tabs, Formulário e Histórico
 * 
 * USO:
 * <ChamadosLayout
 *   title="Chamados TEI"
 *   description="Tecnologia, Experiência e Inovação"
 *   onBack={() => navigate(-1)}
 *   viewMode={viewMode}
 *   onViewModeChange={setViewMode}
 *   chamadosCount={chamados.length}
 *   formContent={<FormularioTEI />}
 *   historyContent={<HistoricoTEI />}
 * />
 * ============================================================================
 */

import { ReactNode } from 'react';
import { FileText } from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { TabButton } from '../common/TabButton';
import { Card, CardContent } from '../ui/card';

export type ViewMode = 'form' | 'history';

interface ChamadosLayoutProps {
  title: string;
  description?: string;
  onBack: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  chamadosCount: number;
  formContent: ReactNode;
  historyContent: ReactNode;
}

export function ChamadosLayout({
  title,
  description,
  onBack,
  viewMode,
  onViewModeChange,
  chamadosCount,
  formContent,
  historyContent
}: ChamadosLayoutProps) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} onBack={onBack} />

      {/* Tabs */}
      <div className="flex gap-2">
        <TabButton
          active={viewMode === 'form'}
          onClick={() => onViewModeChange('form')}
          icon={<FileText className="w-5 h-5" />}
        >
          Novo Chamado
        </TabButton>
        <TabButton
          active={viewMode === 'history'}
          onClick={() => onViewModeChange('history')}
          count={chamadosCount}
        >
          Histórico
        </TabButton>
      </div>

      {/* Formulário */}
      {viewMode === 'form' && (
        <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            {formContent}
          </CardContent>
        </Card>
      )}

      {/* Histórico */}
      {viewMode === 'history' && historyContent}
    </div>
  );
}
