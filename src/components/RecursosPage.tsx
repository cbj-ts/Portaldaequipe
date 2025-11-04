/*
 * ============================================================================
 * RECURSOS - Documentações e Materiais
 * ============================================================================
 * 
 * ESTRUTURA:
 * 1. Header (h1 + descrição)
 * 2. Tabs por categoria (Gerais, RH, Comunicação, BI, Técnicos)
 * 3. Lista de documentos com botão de download
 * 
 * CATEGORIAS:
 * - Gerais: Políticas e manuais gerais
 * - RH: Documentos de recursos humanos
 * - Comunicação: Brand e templates
 * - BI: Dicionários e dashboards
 * - Técnicos: APIs e documentação técnica
 * 
 * INFORMAÇÕES POR DOCUMENTO:
 * - Nome e ícone
 * - Tipo de arquivo (badge)
 * - Tamanho
 * - Data de atualização
 * - Botão de download
 * 
 * ============================================================================
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { FileText, Download, FolderOpen, Book } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export function RecursosPage() {
  const documentosGerais = [
    { nome: 'Manual do Colaborador', tipo: 'PDF', tamanho: '2.5 MB', data: '01/01/2025' },
    { nome: 'Política de Segurança da Informação', tipo: 'PDF', tamanho: '1.8 MB', data: '15/01/2025' },
    { nome: 'Código de Ética e Conduta', tipo: 'PDF', tamanho: '1.2 MB', data: '10/02/2025' },
  ];

  const documentosRH = [
    { nome: 'Política de Férias', tipo: 'PDF', tamanho: '850 KB', data: '05/03/2025' },
    { nome: 'Guia de Benefícios', tipo: 'PDF', tamanho: '3.1 MB', data: '20/03/2025' },
    { nome: 'Formulário de Reembolso', tipo: 'DOCX', tamanho: '120 KB', data: '25/03/2025' },
  ];

  const documentosComunicacao = [
    { nome: 'Manual de Marca', tipo: 'PDF', tamanho: '15 MB', data: '01/04/2025' },
    { nome: 'Templates de Apresentação', tipo: 'PPTX', tamanho: '8.5 MB', data: '10/04/2025' },
    { nome: 'Guia de Comunicação Interna', tipo: 'PDF', tamanho: '2.2 MB', data: '15/04/2025' },
  ];

  const documentosBI = [
    { nome: 'Dicionário de Dados', tipo: 'XLSX', tamanho: '1.5 MB', data: '05/05/2025' },
    { nome: 'Guia de KPIs', tipo: 'PDF', tamanho: '2.8 MB', data: '10/05/2025' },
    { nome: 'Templates de Dashboards', tipo: 'PBIX', tamanho: '5.2 MB', data: '15/05/2025' },
  ];

  const documentosTecnicos = [
    { nome: 'Documentação da API', tipo: 'HTML', tamanho: '4.5 MB', data: '01/06/2025' },
    { nome: 'Guia de Arquitetura', tipo: 'PDF', tamanho: '3.2 MB', data: '05/06/2025' },
    { nome: 'Padrões de Desenvolvimento', tipo: 'MD', tamanho: '800 KB', data: '10/06/2025' },
  ];

  const renderDocumentList = (documentos: typeof documentosGerais) => (
    <div className="space-y-3">
      {documentos.map((doc, index) => (
        <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-gray-200/50 dark:border-gray-800/50 hover:bg-white dark:hover:bg-black hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#000aff] shadow-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-gray-900 dark:text-white mb-1">{doc.nome}</h3>
              <small className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Badge variant="outline" className="text-xs">{doc.tipo}</Badge>
                <span>•</span>
                <span>{doc.tamanho}</span>
                <span>•</span>
                <span>{doc.data}</span>
              </small>
            </div>
          </div>
          <Button variant="outline" size="sm" className="text-blue-600 dark:text-blue-400 border-gray-200 dark:border-gray-800 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-xl">
            <Download className="w-4 h-4 mr-2" />
            Baixar
          </Button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 dark:text-white mb-2">Recursos</h1>
        <p className="text-gray-600 dark:text-gray-400">Documentações e materiais de apoio</p>
      </div>

      <Tabs defaultValue="gerais" className="w-full">
        <TabsList className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-900 dark:to-black p-1 rounded-xl border border-gray-200/50 dark:border-gray-800/50">
          <TabsTrigger value="gerais" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-lg rounded-lg transition-all">
            <Book className="w-4 h-4 mr-2" />
            Gerais
          </TabsTrigger>
          <TabsTrigger value="rh" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-lg rounded-lg transition-all">
            RH
          </TabsTrigger>
          <TabsTrigger value="comunicacao" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-lg rounded-lg transition-all">
            Comunicação
          </TabsTrigger>
          <TabsTrigger value="bi" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-lg rounded-lg transition-all">
            BI
          </TabsTrigger>
          <TabsTrigger value="tecnicos" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-lg rounded-lg transition-all">
            Técnicos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gerais" className="mt-6">
          <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black border-gray-200/50 dark:border-gray-800/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Documentações Gerais</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Documentos importantes para todos os colaboradores
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderDocumentList(documentosGerais)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rh" className="mt-6">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Documentos de RH</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Políticas, formulários e guias de recursos humanos
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderDocumentList(documentosRH)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comunicacao" className="mt-6">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Comunicação</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Materiais de marca e comunicação
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderDocumentList(documentosComunicacao)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bi" className="mt-6">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Business Intelligence</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Documentação de dados e análises
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderDocumentList(documentosBI)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tecnicos" className="mt-6">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Documentação Técnica</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                APIs, arquitetura e padrões de desenvolvimento
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderDocumentList(documentosTecnicos)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
