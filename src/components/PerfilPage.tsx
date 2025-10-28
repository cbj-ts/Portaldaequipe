/**
 * ============================================================================
 * PERFIL - Informações do Usuário
 * ============================================================================
 * 
 * ESTRUTURA:
 * 1. Header (h1 + descrição)
 * 2. Card de perfil (avatar + informações principais)
 * 3. Tabs: Configurações | Histórico | Metas Pessoais
 * 
 * ABAS:
 * - Configurações: Formulário de edição de dados pessoais
 * - Histórico: Timeline de atividades recentes
 * - Metas: Progresso de metas de desenvolvimento
 * 
 * INFORMAÇÕES EXIBIDAS:
 * - Nome, cargo, departamento (h2 + p + badges)
 * - Email, ramal, data de admissão
 * - Foto de perfil com ícone espacial
 * 
 * FORMULÁRIO:
 * - Grid 2 colunas (responsivo para 1 em mobile)
 * - Labels com componente Label
 * - Inputs com bg adaptável ao dark mode
 * 
 * ============================================================================
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Settings, History, Target, Edit, Mail, Phone, Calendar } from 'lucide-react';
import { AstronautIcon } from './SpaceIcons';

export function PerfilPage() {
  const atividades = [
    { acao: 'Concluiu o curso "Segurança da Informação"', data: '14/10/2025', tipo: 'Curso' },
    { acao: 'Abriu chamado #1234 - TEI', data: '10/10/2025', tipo: 'Chamado' },
    { acao: 'Participou da Live "Novidades do Produto"', data: '08/10/2025', tipo: 'Evento' },
    { acao: 'Atualizou informações pessoais', data: '05/10/2025', tipo: 'Perfil' },
  ];

  const metas = [
    { meta: 'Completar 5 cursos obrigatórios', progresso: '4/5', status: 'Em andamento' },
    { meta: 'Participar de 10 eventos', progresso: '6/10', status: 'Em andamento' },
    { meta: 'Obter 2 certificações', progresso: '2/2', status: 'Concluída' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-gray-900 dark:text-white mb-2">Meu Perfil</h1>
        <p className="text-gray-600 dark:text-gray-400">Gerencie suas informações e configurações</p>
      </div>

      {/* Cartão de Perfil */}
      <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black border-gray-200/50 dark:border-gray-800/50 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-[#000aff] ring-4 ring-[#000aff]/20 shadow-xl flex items-center justify-center">
              <AstronautIcon className="w-16 h-16 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-gray-900 dark:text-white">João Silva</h2>
                  <p className="text-gray-600 dark:text-gray-400">Desenvolvedor Sênior</p>
                  <div className="flex gap-2 mt-2">
                    <Badge className="bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400">
                      Tecnologia
                    </Badge>
                    <Badge className="bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400">
                      São Paulo - SP
                    </Badge>
                  </div>
                </div>
                <Button variant="outline" className="text-blue-600 dark:text-blue-400 border-gray-200 dark:border-gray-800">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Perfil
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div>
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <Mail className="w-3 h-3 text-gray-400" />
                    <span className="text-meta text-gray-500 dark:text-gray-400">Email</span>
                  </div>
                  <small className="text-gray-900 dark:text-white block">joao.silva@tradestars.com</small>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <Phone className="w-3 h-3 text-gray-400" />
                    <span className="text-meta text-gray-500 dark:text-gray-400">Ramal</span>
                  </div>
                  <small className="text-gray-900 dark:text-white block">3025</small>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span className="text-meta text-gray-500 dark:text-gray-400">Data de Admissão</span>
                  </div>
                  <small className="text-gray-900 dark:text-white block">01/03/2020</small>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="configuracoes" className="w-full">
        <TabsList className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-900 dark:to-black p-1 rounded-xl border border-gray-200/50 dark:border-gray-800/50">
          <TabsTrigger value="configuracoes" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-lg rounded-lg transition-all">
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </TabsTrigger>
          <TabsTrigger value="atividades" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-lg rounded-lg transition-all">
            <History className="w-4 h-4 mr-2" />
            Histórico
          </TabsTrigger>
          <TabsTrigger value="metas" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-lg rounded-lg transition-all">
            <Target className="w-4 h-4 mr-2" />
            Metas Pessoais
          </TabsTrigger>
        </TabsList>

        <TabsContent value="configuracoes" className="mt-6">
          <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black border-gray-200/50 dark:border-gray-800/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Informações Pessoais</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Atualize suas informações de perfil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input id="nome" defaultValue="João Silva" className="bg-white dark:bg-gray-900" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="joao.silva@tradestars.com" className="bg-white dark:bg-gray-900" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" defaultValue="(11) 98765-4321" className="bg-white dark:bg-gray-900" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ramal">Ramal</Label>
                  <Input id="ramal" defaultValue="3025" className="bg-white dark:bg-gray-900" />
                </div>
              </div>
              <Button className="bg-[#000aff] hover:bg-[#0008dd] text-white shadow-lg rounded-xl">
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="atividades" className="mt-6">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Histórico de Atividades</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Suas ações recentes no portal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {atividades.map((atividade, index) => (
                  <div key={index} className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-800 last:border-0">
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
                      <History className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <small className="text-gray-900 dark:text-white block">{atividade.acao}</small>
                      <span className="text-meta text-gray-600 dark:text-gray-400 block">{atividade.data}</span>
                    </div>
                    <Badge className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
                      {atividade.tipo}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metas" className="mt-6">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Metas Pessoais</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Acompanhe suas metas de desenvolvimento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metas.map((meta, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-4">
                      <Target className="w-5 h-5 text-blue-600" />
                      <div>
                        <small className="text-gray-900 dark:text-white block">{meta.meta}</small>
                        <span className="text-meta text-gray-600 dark:text-gray-400 block">
                          Progresso: {meta.progresso}
                        </span>
                      </div>
                    </div>
                    <Badge className={
                      meta.status === 'Concluída'
                        ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400'
                        : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400'
                    }>
                      {meta.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
