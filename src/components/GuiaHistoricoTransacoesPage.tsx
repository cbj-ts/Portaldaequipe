/**
 * ============================================================================
 * GUIA DO HISTÓRICO DE TRANSAÇÕES
 * ============================================================================
 * 
 * Página de orientação passo a passo para ensinar alunos a capturar
 * corretamente o print do histórico de transações da corretora.
 * 
 * ESTRUTURA:
 * - PageHeader com navegação
 * - Card informativo inicial
 * - 7 passos em cards com layout alternado
 * - Alertas (info, warning, success)
 * - Botões de ação no final
 * 
 * ============================================================================
 */

import { useNavigate } from 'react-router-dom';
import { TrendingUp, AlertCircle, AlertTriangle, Send, Printer, ArrowLeft } from 'lucide-react';
import { PageHeader } from './common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';

interface Step {
  number: number;
  title: string;
  description: string;
  image: string;
  details?: React.ReactNode;
}

export function GuiaHistoricoTransacoesPage() {
  const navigate = useNavigate();

  const steps: Step[] = [
    {
      number: 1,
      title: 'Verifique o Idioma e Corretora',
      description: 'Acesse o site da sua corretora. Primeiro, confira se ele está em Português. Caso não esteja, procure a opção de trocar o idioma. Geralmente, essa opção fica no canto superior direito, representada por uma bandeira (provavelmente a do Reino Unido 🇬🇧). Clique nela e altere para a bandeira de Portugal 🇵🇹 (Português).',
      image: 'https://i.imgur.com/R4t2xW7.png'
    },
    {
      number: 2,
      title: 'Acesse o Menu (Celular)',
      description: 'Se estiver no celular, clique nos três traços (menu) que geralmente ficam no canto superior esquerdo da tela. Este ícone é fundamental para acessar todas as funcionalidades da plataforma mobile.',
      image: 'https://i.imgur.com/OAc32l6.png'
    },
    {
      number: 3,
      title: 'Navegue para Depósitos/Saques',
      description: 'No menu que se abriu, procure e clique na opção "Depósitos/Saques". Esta seção concentra todas as operações financeiras da sua conta na corretora.',
      image: 'https://i.imgur.com/pJdUdQb.png'
    },
    {
      number: 4,
      title: 'Acesse o Histórico de Transações',
      description: 'Dentro da seção "Depósitos/Saques", localize e clique em "Histórico de Transações". Aqui você encontrará o registro completo de todas as suas movimentações financeiras.',
      image: 'https://i.imgur.com/kMAH8fZ.png'
    },
    {
      number: 5,
      title: 'Visualize Melhor (Celular)',
      description: 'Se o menu lateral ainda estiver aberto no celular, clique novamente nos três traços (geralmente verdes ou da cor de destaque) para fechar o menu e ter uma visão completa da tela.',
      image: 'https://i.imgur.com/OAc32l6.png'
    },
    {
      number: 6,
      title: 'Localize a Lista de Transações',
      description: 'Desça a tela até encontrar o título "Histórico de Transações". Abaixo dele, você verá a lista completa dos seus depósitos e saques anteriores, organizados por data mais recente.',
      image: 'https://i.imgur.com/GfKuN1Q.png'
    },
    {
      number: 7,
      title: 'Tire o Print Detalhado',
      description: 'Localize a última transação realizada. Tire um print da tela onde apareçam claramente todos os detalhes importantes:',
      image: 'https://i.imgur.com/zGJJtkU.png',
      details: (
        <div className="space-y-3 mt-4">
          <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <span className="text-green-600 dark:text-green-400 flex-shrink-0">✓</span>
            <div>
              <p className="text-gray-900 dark:text-white">
                A palavra <strong className="text-green-600 dark:text-green-400">"Aprovado"</strong> (ou status similar de sucesso)
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <span className="flex-shrink-0">📅</span>
            <div>
              <p className="text-gray-900 dark:text-white">
                A <strong className="text-[#000aff]">data completa</strong> da transação (o ID deve estar ao lado)
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <span className="flex-shrink-0">💰</span>
            <div>
              <p className="text-gray-900 dark:text-white">
                O <strong className="text-yellow-600 dark:text-yellow-400">valor exato</strong> depositado
              </p>
            </div>
          </div>
          <Alert className="border-[#000aff]/20 bg-[#000aff]/5 dark:bg-[#000aff]/10">
            <AlertCircle className="w-4 h-4 text-[#000aff]" />
            <AlertDescription className="text-gray-700 dark:text-gray-300">
              <strong>Dica:</strong> O ID da transação geralmente aparece ao lado da data, 
              e é importante que esteja visível no print.
            </AlertDescription>
          </Alert>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Guia do Histórico de Transações"
        description="Orientação passo a passo para capturar o print do histórico de transações"
        onBack={() => navigate('/ferramentas')}
        icon={<TrendingUp className="w-5 h-5 text-[#000aff]" />}
        actions={
          <Button
            variant="outline"
            onClick={() => window.print()}
            className="gap-2"
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </Button>
        }
      />

      {/* Card Introdutório */}
      <Card className="bg-gradient-to-br from-[#000aff]/5 to-[#ac2aff]/5 dark:from-[#000aff]/10 dark:to-[#ac2aff]/10 border-[#000aff]/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#000aff] rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-gray-900 dark:text-white mb-2">Objetivo do Guia</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Este guia foi criado para ajudar você a orientar os alunos a capturarem 
                corretamente as evidências necessárias do histórico de transações da corretora.
                Siga cada passo na ordem para garantir que todas as informações importantes sejam capturadas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Steps */}
      <div className="space-y-6">
        {steps.map((step, index) => {
          const isEven = index % 2 === 0;
          
          return (
            <Card 
              key={step.number}
              className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <CardHeader className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <Badge 
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#000aff] text-white hover:bg-[#000aff]"
                  >
                    {step.number}
                  </Badge>
                  <CardTitle className="text-gray-900 dark:text-white">
                    {step.title}
                  </CardTitle>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className={`grid md:grid-cols-2 ${isEven ? '' : 'md:grid-flow-dense'}`}>
                  {/* Texto */}
                  <div className={`p-6 flex flex-col justify-center space-y-4 ${isEven ? 'md:order-1' : 'md:order-2'}`}>
                    <p className="text-gray-900 dark:text-white leading-relaxed">
                      {step.description}
                    </p>
                    {step.details}
                  </div>
                  
                  {/* Imagem */}
                  <div className={`bg-gray-50 dark:bg-gray-800/50 p-6 flex items-center justify-center ${isEven ? 'md:order-2' : 'md:order-1'}`}>
                    <div className="relative w-full">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-auto rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alertas Importantes */}
      <div className="space-y-4">
        {/* Alert Info */}
        <Alert className="border-[#000aff]/20 bg-[#000aff]/5 dark:bg-[#000aff]/10">
          <AlertCircle className="w-4 h-4 text-[#000aff]" />
          <AlertDescription>
            <div className="space-y-2">
              <h4 className="text-[#000aff] dark:text-[#ac2aff] mb-2">
                Recomendações Importantes
              </h4>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0">📱</span>
                  <p>
                    Se estiver usando o celular, oriente o aluno a <strong>deitar o aparelho</strong> (modo paisagem) 
                    para que todos os dados fiquem visíveis no print.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0">📋</span>
                  <p>
                    Caso não caiba tudo em um só print, <strong>pode tirar mais de um</strong>, sem problemas.
                  </p>
                </div>
              </div>
            </div>
          </AlertDescription>
        </Alert>

        {/* Alert Warning */}
        <Alert className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
          <AlertDescription>
            <div className="text-gray-700 dark:text-gray-300">
              <h4 className="text-red-600 dark:text-red-400 mb-2">Atenção!</h4>
              <p>
                <strong>Não mencione o ID da transação</strong> ao aluno. Ele deve aparecer naturalmente no print, 
                mas não precisa ser solicitado explicitamente para evitar qualquer desconforto.
              </p>
            </div>
          </AlertDescription>
        </Alert>

        {/* Alert Success - Frase Final */}
        <Alert className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
          <Send className="w-4 h-4 text-green-600 dark:text-green-400" />
          <AlertDescription>
            <div className="text-gray-700 dark:text-gray-300">
              <h4 className="text-green-600 dark:text-green-400 mb-2">Frase Final para o Aluno</h4>
              <p className="italic">
                "Assim que tiver o(s) print(s), me envia aqui, e eu já faço a validação certinha pra você. 😉"
              </p>
            </div>
          </AlertDescription>
        </Alert>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <button
          onClick={() => navigate('/ferramentas')}
          className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <Button
          onClick={() => window.print()}
          className="bg-[#000aff] hover:bg-[#0008cc] text-white gap-2"
        >
          <Printer className="w-4 h-4" />
          Imprimir Guia
        </Button>
      </div>
    </div>
  );
}
