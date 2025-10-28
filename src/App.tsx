/**
 * ============================================================================
 * TRADESTARS PORTAL - Aplicação Principal
 * ============================================================================
 * 
 * Este é o componente raiz da aplicação.
 * 
 * DOCUMENTAÇÃO DO SISTEMA DE DESIGN:
 * - Ver /DESIGN_SYSTEM.md - Sistema completo de tipografia e espaçamentos
 * - Ver /GUIA_RAPIDO.md - Referência rápida para desenvolvimento
 * - Ver /EXEMPLO_COMPONENTE.md - Exemplos práticos de componentes
 * - Ver /APLICACAO_DO_GUIA.md - Status da aplicação do guia
 * 
 * ESTRUTURA:
 * - Sidebar fixa à esquerda (desktop) / hamburguer (mobile)
 * - Header fixo no topo
 * - Main content responsivo com padding adequado
 * - Sistema de roteamento com React Router
 * 
 * MODO ESCURO:
 * - Controlado pela classe 'dark' no elemento raiz
 * - Todas as cores devem usar o padrão: className="text-gray-900 dark:text-white"
 * 
 * ============================================================================
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import * as React from 'react';
import { UserProvider } from './contexts/UserContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ChamadosPage } from './components/ChamadosPage';
import { CalendarioPage } from './components/CalendarioPage';
import { CursosPage } from './components/CursosPage';
import { CursosAddPage } from './components/CursosAddPage';
import { CursosAddPageTest } from './components/CursosAddPageTest';
import { AvaliacaoPage } from './components/AvaliacaoPage';
import { AvaliacaoLogsPage } from './components/AvaliacaoLogsPage';
import { SetoresPage } from './components/SetoresPage';
import { TimePage } from './components/TimePage';
import { RecursosPage } from './components/RecursosPage';
import { PerfilPage } from './components/PerfilPage';
import { AgendamentoSalasPage } from './components/AgendamentoSalasPage';
import { FerramentasPage } from './components/FerramentasPage';
import { NewsletterPage } from './components/NewsletterPage';
import { NewsletterAddPage } from './components/NewsletterAddPage';
import { NewsletterViewPage } from './components/NewsletterViewPage';
import { GuiaHistoricoTransacoesPage } from './components/GuiaHistoricoTransacoesPage';
import { EventosPage } from './components/EventosPage';
import { ChecklistAtendimentoPage } from './components/ChecklistAtendimentoPage';
import { CopysPage } from './components/CopysPage';
import { GuiaProdutosPage } from './components/GuiaProdutosPage';
import { CalculadoraGestaoPage } from './components/CalculadoraGestaoPage';
import { CalculadoraInvestimentoPage } from './components/CalculadoraInvestimentoPage';
import { CalculadoraLotePage } from './components/CalculadoraLotePage';
import { Toaster } from './components/ui/sonner';

export default function App() {
  // Estado do modo escuro (dark mode)
  const [darkMode, setDarkMode] = useState(false);
  
  // Estado da sidebar mobile (aberta/fechada)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Aplicar classe dark no document.documentElement (html) para afetar os Portals
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <UserProvider>
      <Router>
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0a0a0a] dark:to-[#1d1d1d] transition-colors">
          <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 lg:ml-64 mt-16 p-3 sm:p-4 md:p-8 bg-[rgba(0,0,0,0)]">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/chamados" element={<ChamadosPage />} />
              <Route path="/calendario" element={<CalendarioPage />} />
              <Route path="/salas" element={<AgendamentoSalasPage />} />
              <Route path="/cursos" element={<CursosPage />} />
              <Route path="/cursos/add-test" element={<CursosAddPageTest />} />
              <Route path="/cursos/add" element={<CursosAddPage />} />
              <Route path="/avaliacao" element={<AvaliacaoPage />} />
              <Route path="/avaliacao/logs" element={<AvaliacaoLogsPage />} />
              <Route path="/setores" element={<SetoresPage />} />
              <Route path="/time" element={<TimePage />} />
              <Route path="/recursos" element={<RecursosPage />} />
              <Route path="/ferramentas" element={<FerramentasPage />} />
              <Route path="/newsletter" element={<NewsletterPage />} />
              <Route path="/newsletter/add" element={<NewsletterAddPage />} />
              <Route path="/newsletter/:id" element={<NewsletterViewPage />} />
              <Route path="/guia-historico-transacoes" element={<GuiaHistoricoTransacoesPage />} />
              <Route path="/eventos" element={<EventosPage />} />
              <Route path="/checklist-atendimento" element={<ChecklistAtendimentoPage />} />
              <Route path="/copys" element={<CopysPage />} />
              <Route path="/guia-produtos" element={<GuiaProdutosPage />} />
              <Route path="/calculadora-gestao" element={<CalculadoraGestaoPage />} />
              <Route path="/calculadora-investimento" element={<CalculadoraInvestimentoPage />} />
              <Route path="/calculadora-lote" element={<CalculadoraLotePage />} />
              <Route path="/perfil" element={<PerfilPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Toaster />
        </div>
      </Router>
    </UserProvider>
  );
}
