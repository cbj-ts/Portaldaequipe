import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

export function CursosAddPageTest() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/cursos')}
          className="h-10 w-10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-gray-900 dark:text-white">Teste - Novo Curso</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Se você está vendo esta tela, a rota está funcionando!
          </p>
        </div>
      </div>
      
      <div className="bg-green-100 dark:bg-green-900/20 border border-green-500 p-6 rounded-lg">
        <h3 className="text-green-800 dark:text-green-300">✅ Sucesso!</h3>
        <p className="text-green-700 dark:text-green-400">
          A rota /cursos/add está funcionando corretamente.
        </p>
      </div>
    </div>
  );
}
