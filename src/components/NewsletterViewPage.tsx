/**
 * ============================================================================
 * NEWSLETTER VIEW - Visualização Completa da Newsletter
 * ============================================================================
 * 
 * Página para visualizar o conteúdo completo de uma newsletter específica.
 * 
 * FUNCIONALIDADES:
 * - Visualização do conteúdo formatado em Markdown
 * - Visualização do PDF embutido
 * - Download do arquivo
 * - Metadados completos
 * - Navegação de volta
 * 
 * ============================================================================
 */

import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, User, Mail } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { parseMarkdown } from '../utils/markdownParser';

interface Newsletter {
  id: number;
  titulo: string;
  descricao: string;
  conteudo: string;
  data: string;
  categoria: string;
  autor: string;
  destaque?: boolean;
}

export function NewsletterViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - substituir por dados reais do backend
  const newsletter: Newsletter = {
    id: Number(id),
    titulo: 'Novidades da Semana - Outubro 2025',
    descricao: 'Confira as principais atualizações, conquistas da equipe e próximos eventos.',
    conteudo: `# 🎉 Destaques da Semana

## 📈 Resultados e Conquistas

Esta semana alcançamos marcos importantes em diversas áreas:

- **Vendas:** Superamos a meta mensal em 15%, com destaque para a equipe de vendas que fechou contratos importantes com novos clientes.
- **Suporte:** Reduzimos o tempo médio de resposta em 30%, melhorando significativamente a satisfação dos clientes.
- **TEI:** Implementação bem-sucedida de 3 novas funcionalidades solicitadas pelos usuários.

## 🚀 Novos Projetos e Iniciativas

Estamos empolgados em anunciar o lançamento de novos projetos:

- **Portal do Colaborador:** A nova versão está em fase final de testes e será lançada na próxima semana.
- **Programa de Capacitação:** Novos cursos disponíveis na plataforma de treinamento.
- **Wellness Program:** Iniciativas de bem-estar para toda a equipe começam em novembro.

## 👥 Reconhecimento da Equipe

Parabéns aos colaboradores destaque desta semana:

- **Maria Silva (Vendas):** Melhor performance do mês com 120% da meta alcançada.
- **João Santos (TEI):** Resolução excepcional de bugs críticos e entrega antes do prazo.
- **Ana Costa (RH):** Excelente organização do evento de integração de novos colaboradores.

## 📅 Agenda da Próxima Semana

- **Segunda (21/10):** Reunião geral de alinhamento - 14h
- **Quarta (23/10):** Workshop de desenvolvimento pessoal - 10h
- **Sexta (25/10):** Happy hour da equipe - 18h

## 💡 Dicas e Recursos

Confira os novos materiais disponíveis no portal:

- Playbook atualizado de vendas
- Guia de boas práticas de atendimento
- Templates de relatórios e apresentações

## 📢 Comunicados Importantes

- Lembrete: Prazo para avaliação de desempenho encerra dia 31/10
- Novo horário de funcionamento do refeitório a partir de novembro
- Inscrições abertas para o programa de mentoria 2025

> Esta newsletter é enviada semanalmente para todos os colaboradores. Para dúvidas ou sugestões, entre em contato com a equipe de Comunicação.`,
    data: '21/10/2025',
    categoria: 'Geral',
    autor: 'Equipe de Comunicação',
    destaque: true
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-5xl mx-auto">
      {/* Botão Voltar */}
      <button
        onClick={() => navigate('/newsletter')}
        className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        aria-label="Voltar"
      >
        <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </button>

      {/* Header da Newsletter */}
      <Card className="bg-white dark:bg-[#1d1d1d] border-gray-200 dark:border-gray-800">
        <CardContent className="p-4 sm:p-6 md:p-8">
          <div className="space-y-3 sm:space-y-4">
            {/* Badges e Categoria */}
            <div className="flex items-center gap-2 flex-wrap">
              {newsletter.destaque && (
                <Badge className="bg-[#000aff] hover:bg-[#000aff]/90 text-white text-xs">
                  Destaque
                </Badge>
              )}
              <Badge variant="outline" className="border-gray-200 dark:border-gray-800 text-xs">
                <Tag className="w-3 h-3 mr-1" />
                {newsletter.categoria}
              </Badge>
            </div>

            {/* Título */}
            <div>
              <h1 className="text-gray-900 dark:text-white mb-2 sm:mb-3">
                {newsletter.titulo}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {newsletter.descricao}
              </p>
            </div>

            {/* Metadados */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 flex-wrap pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <small>{newsletter.data}</small>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <User className="w-4 h-4 flex-shrink-0" />
                <small>{newsletter.autor}</small>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conteúdo da Newsletter */}
      <Card className="bg-white dark:bg-[#1d1d1d] border-gray-200 dark:border-gray-800">
        <CardContent className="p-4 sm:p-6 md:p-8">
          <div className="newsletter-content max-w-none prose prose-sm sm:prose dark:prose-invert">
            {parseMarkdown(newsletter.conteudo)}
          </div>
        </CardContent>
      </Card>

      {/* Card de Ação */}
      <Card className="bg-gradient-to-br from-[#000aff]/10 to-[#ac2aff]/10 dark:from-[#000aff]/20 dark:to-[#ac2aff]/20 border-[#000aff]/20">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-3 sm:gap-4 flex-col sm:flex-row">
            <div className="p-2 sm:p-3 rounded-lg bg-[#000aff]/10 flex-shrink-0">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-[#000aff]" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-gray-900 dark:text-white mb-2">
                Gostou desta newsletter?
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
                Compartilhe com sua equipe e deixe seu feedback para a equipe de Comunicação.
              </p>
              <div className="flex gap-2 sm:gap-3 flex-wrap">
                <Button 
                  variant="outline"
                  size="sm"
                  className="border-[#000aff] text-[#000aff] hover:bg-[#000aff]/10 flex-1 sm:flex-initial"
                >
                  Compartilhar
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  className="border-gray-200 dark:border-gray-800 flex-1 sm:flex-initial"
                >
                  Enviar Feedback
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
