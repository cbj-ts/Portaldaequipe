/**
 * ============================================================================
 * HEADER - Barra Superior Fixa
 * ============================================================================
 * 
 * POSICIONAMENTO:
 * - Fixo no topo (fixed top-0)
 * - Desktop: left-64 (após sidebar)
 * - Mobile: left-0 (fullwidth)
 * - Z-index: 40 (acima do conteúdo)
 * 
 * COMPONENTES:
 * - Botão hamburger (mobile only)
 * - Notificações com popover
 * - Dropdown de perfil com avatar
 * 
 * NOTIFICAÇÕES:
 * - Badge com contador de não lidas
 * - Animação pulse em vermelho
 * - Lista com hover states
 * - Marcação visual de lidas/não lidas
 * 
 * PERFIL:
 * - Avatar com ícone espacial
 * - Nome e cargo (hidden em mobile)
 * - Menu: Perfil | Configurações | Sair
 * 
 * GLASSMORPHISM:
 * - Background semi-transparente
 * - Backdrop blur
 * - Border sutil
 * 
 * ============================================================================
 */

import { Bell, Menu } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AstronautIcon } from './SpaceIcons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
}

export function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const navigate = useNavigate();

  const notificacoes = [
    { id: 1, texto: 'Novo curso disponível: Power BI', lida: false, tempo: '5 min atrás' },
    { id: 2, texto: 'Chamado #1234 foi atualizado', lida: false, tempo: '1 hora atrás' },
    { id: 3, texto: 'Avaliação de desempenho disponível', lida: true, tempo: '2 horas atrás' },
    { id: 4, texto: 'Live: Novidades do Produto amanhã às 16h', lida: true, tempo: '1 dia atrás' },
  ];

  const notificacoesNaoLidas = notificacoes.filter(n => !n.lida).length;

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 z-40">
      <div className="h-full px-4 md:px-8 flex items-center justify-between lg:justify-end gap-4">
        {/* Botão de menu mobile */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-xl transition-all"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <div className="flex items-center gap-4">
        {/* Notificações */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-xl transition-all">
              <Bell className="w-5 h-5" />
              {notificacoesNaoLidas > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white shadow-lg">
                  <small>{notificacoesNaoLidas}</small>
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800" align="end">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-900 dark:text-white">Notificações</h3>
                {notificacoesNaoLidas > 0 && (
                  <Badge className="bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400">
                    {notificacoesNaoLidas} novas
                  </Badge>
                )}
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notificacoes.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 border-b border-gray-200 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${
                    !notif.lida ? 'bg-blue-50 dark:bg-blue-950/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!notif.lida && (
                      <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-white">{notif.texto}</p>
                      <small className="text-meta text-gray-500 dark:text-gray-400 mt-1">{notif.tempo}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-gray-200 dark:border-gray-800">
              <Button variant="ghost" className="w-full text-blue-600 dark:text-blue-400">
                Ver todas as notificações
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Perfil */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 h-auto py-2 px-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-all">
              <div className="text-right hidden sm:block">
                <p className="text-gray-900 dark:text-white">João Silva</p>
                <small className="text-meta text-gray-500 dark:text-gray-400">Desenvolvedor Sênior</small>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#000aff] ring-2 ring-[#000aff]/20 flex items-center justify-center shadow-lg">
                <AstronautIcon className="w-6 h-6 text-white" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800" align="end">
            <DropdownMenuLabel className="text-gray-900 dark:text-white">
              <div>
                <p>João Silva</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">joao.silva@tradestars.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-800" />
            <DropdownMenuItem 
              onClick={() => navigate('/perfil')}
              className="text-gray-700 dark:text-gray-300 cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-800"
            >
              Meu Perfil
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-700 dark:text-gray-300 cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-800">
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-800" />
            <DropdownMenuItem className="text-red-600 dark:text-red-400 cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-800">
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
