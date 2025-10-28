/**
 * ============================================================================
 * SIDEBAR - Menu de Navegação Lateral
 * ============================================================================
 * 
 * COMPORTAMENTO:
 * - Desktop: Fixa à esquerda (w-64)
 * - Mobile: Overlay com backdrop (hamburguer)
 * - Dark mode toggle no rodapé
 * 
 * ESTRUTURA:
 * 1. Logo TradeStars no topo
 * 2. Menu organizado por seções:
 *    - DASHBOARD
 *    - CENTRAL DE AÇÃO (Chamados, Calendário)
 *    - DESENVOLVIMENTO (Cursos, Avaliação)
 *    - EMPRESA (Setores, Time)
 *    - RECURSOS
 * 3. Toggle Dark/Light mode
 * 
 * NAVEGAÇÃO:
 * - Links com react-router-dom
 * - Destaque visual da página ativa
 * - Hover states com transições
 * - Ícones do lucide-react
 * 
 * TEMA:
 * - Background: Branco/Preto com transparência
 * - Glassmorphism: backdrop-blur
 * - Cores oficiais nos hovers
 * 
 * MOBILE:
 * - Fecha automaticamente ao clicar em link
 * - Overlay escuro no background
 * - Animação de slide
 * 
 * ============================================================================
 */

import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Zap, BookOpen, Building2, FolderOpen,
  Headphones, Calendar, GraduationCap, Award, Users, 
  BarChart3, Moon, Sun, DoorOpen, Wrench, BookText, Mail
} from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import Vector from '../imports/Vector';
import LogoTradeHub from '../imports/LogoTradeHub';

interface SidebarProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
}

export function Sidebar({ darkMode, setDarkMode, sidebarOpen, setSidebarOpen }: SidebarProps) {
  const location = useLocation();

  const menuItems = [
    { 
      section: 'DASHBOARD',
      icon: Home,
      path: '/',
      items: []
    },
    { 
      section: 'CENTRAL DE AÇÃO',
      icon: Zap,
      items: [
        { label: 'Agendamento de Salas', icon: DoorOpen, path: '/salas' },
        { label: 'Calendário', icon: Calendar, path: '/calendario' },
        { label: 'Chamados', icon: Headphones, path: '/chamados' },
      ]
    },
    { 
      section: 'DESENVOLVIMENTO',
      icon: BookOpen,
      items: [
        { label: 'Avaliação de Desempenho', icon: Award, path: '/avaliacao' },
        { label: 'Cursos & Treinamentos', icon: GraduationCap, path: '/cursos' },
      ]
    },
    { 
      section: 'EMPRESA',
      icon: Building2,
      items: [
        { label: 'Conheça os Setores', icon: BarChart3, path: '/setores' },
        { label: 'Nossa Equipe', icon: Users, path: '/time' },
      ]
    },
    { 
      section: 'RECURSOS',
      icon: FolderOpen,
      items: [
        { label: 'Ferramentas', icon: Wrench, path: '/ferramentas' },
        { label: 'Playbooks', icon: BookText, path: 'https://coda.io/@tradestars', external: true },
      ]
    },
  ];

  return (
    <>
      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <aside className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-white to-gray-50 dark:from-[#0a0a0a] dark:to-black border-r border-gray-200/50 dark:border-gray-800/50 overflow-y-auto backdrop-blur-xl z-50 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
      <div className="px-[24px] p-[16px]">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-[8px] bg-[#000aff] shadow-lg">
              <div className="w-5 h-5" style={{ '--fill-0': 'white' } as React.CSSProperties}>
                <Vector />
              </div>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="w-32 h-4">
                <LogoTradeHub />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Portal da Equipe</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
            className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-xl transition-all"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>

        <nav className="space-y-6">
          {menuItems.map((item, index) => (
            <div key={index} className="mt-[0px] mr-[0px] mb-[8px] ml-[0px]">
              {item.items.length === 0 ? (
                <Link to={item.path || '/'} onClick={() => setSidebarOpen(false)} className="no-underline">
                  <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'bg-[#000aff] text-white shadow-lg scale-105'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 hover:scale-105'
                  }`}>
                    <item.icon className="w-5 h-5" />
                    <span className="text-[14px]">{item.section}</span>
                  </div>
                </Link>
              ) : (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    <item.icon className="w-4 h-4" />
                    <span>{item.section}</span>
                  </div>
                  <div className="space-y-1 ml-2">
                    {item.items.map((subItem, subIndex) => {
                      const isExternal = subItem.external;
                      const linkProps = isExternal 
                        ? { href: subItem.path, target: '_blank', rel: 'noopener noreferrer' }
                        : { to: subItem.path };
                      
                      const LinkComponent = isExternal ? 'a' : Link;
                      
                      return (
                        <LinkComponent 
                          key={subIndex} 
                          {...linkProps} 
                          onClick={() => setSidebarOpen(false)} 
                          className="no-underline"
                        >
                          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                            !isExternal && location.pathname === subItem.path
                              ? 'bg-[#000aff] text-white shadow-lg scale-105'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 hover:scale-105'
                          }`}>
                            <subItem.icon className="w-4 h-4" />
                            <span className="text-[12px]">{subItem.label}</span>
                          </div>
                        </LinkComponent>
                      );
                    })}
                  </div>
                </>
              )}
              {index < menuItems.length - 1 && (
                <Separator className="my-4 bg-gray-200 dark:bg-gray-800" />
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
    </>
  );
}
