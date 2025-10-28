/**
 * ============================================================================
 * FILE UPLOAD AREA - Área de Upload de Arquivos
 * ============================================================================
 * Componente reutilizável para upload de arquivos com drag&drop, paste e click
 * 
 * USO:
 * <FileUploadArea 
 *   files={files}
 *   onFilesChange={setFiles}
 *   accept=".pdf,.jpg,.png"
 *   maxSize={10}
 *   label="Anexar Documentos"
 * />
 * ============================================================================
 */

import { useRef, useEffect } from 'react';
import { Upload, X, Paperclip } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Label } from '../ui/label';

export interface FileData {
  name: string;
  type: string;
  size: number;
  data: string;
  preview?: string;
}

interface FileUploadAreaProps {
  files: FileData[];
  onFilesChange: (files: FileData[]) => void;
  accept?: string;
  maxSize?: number; // em MB
  label?: string;
  required?: boolean;
}

export function FileUploadArea({ 
  files, 
  onFilesChange, 
  accept = '.pdf,.jpg,.jpeg,.png,.xlsx,.xls,.doc,.docx',
  maxSize = 10,
  label = 'Anexar Arquivos',
  required = false
}: FileUploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`Arquivo muito grande. Máximo: ${maxSize}MB`);
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
      onFilesChange([...files, fileData]);
      toast.success(`"${file.name}" adicionado`);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      Array.from(selectedFiles).forEach(processFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles) {
      Array.from(droppedFiles).forEach(processFile);
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

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  useEffect(() => {
    const handlePasteEvent = (e: ClipboardEvent) => handlePaste(e);
    document.addEventListener('paste', handlePasteEvent);
    return () => document.removeEventListener('paste', handlePasteEvent);
  }, [files]);

  return (
    <div>
      <Label>{label} {required && <span className="required-asterisk">*</span>}</Label>
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
          Tamanho máximo: {maxSize}MB por arquivo
        </small>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        accept={accept}
        className="hidden"
      />

      {/* Lista de Arquivos */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
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
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
