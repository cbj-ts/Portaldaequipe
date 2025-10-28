/**
 * ============================================================================
 * FORM FIELD GROUP - Grupo de Campos de Formulário
 * ============================================================================
 * Componente para organizar campos de formulário em grid responsivo
 * 
 * USO:
 * <FormFieldGroup columns={2}>
 *   <FormField label="Nome" value={nome} onChange={setNome} />
 *   <FormField label="Email" value={email} onChange={setEmail} />
 * </FormFieldGroup>
 * ============================================================================
 */

import { ReactNode } from 'react';

interface FormFieldGroupProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function FormFieldGroup({ children, columns = 2, className = '' }: FormFieldGroupProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-4'
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4 ${className}`}>
      {children}
    </div>
  );
}
