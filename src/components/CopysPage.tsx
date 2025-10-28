/**
 * ============================================================================
 * COPYS - Modelos de Mensagens Prontas por Perfil
 * ============================================================================
 * 
 * FUNCIONALIDADES:
 * - Sistema de copys organizadas por perfil (Leads, Aldeia, Tribo)
 * - Acordeão para categorias de mensagens
 * - Botão de copiar com feedback visual
 * - Substituição automática do nome do usuário
 * - Detecção automática de perfis disponíveis
 * - Seletor de perfil para usuários com múltiplas tags
 * 
 * ============================================================================
 */

import { useState, useEffect } from 'react';
import { Copy, Check, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from './common/PageHeader';
import { BackButton } from './common/BackButton';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { toast } from 'sonner@2.0.3';
import { useUser } from '../contexts/UserContext';

// ============================================================================
// TIPOS
// ============================================================================

interface CopyMessage {
  id: string;
  title: string;
  icon: string;
  content: string;
}

interface CopyProfile {
  id: 'leads' | 'aldeia' | 'tribo';
  name: string;
  messages: CopyMessage[];
}

// ============================================================================
// DADOS DAS COPYS
// ============================================================================

const COPYS_DATA: CopyProfile[] = [
  {
    id: 'leads',
    name: 'Leads',
    messages: [
      {
        id: 'l1',
        title: 'CONTATO INICIAL',
        icon: '👋',
        content: 'Olá, tudo bem? Aqui é o {{user.username}} da *Equipe de Suporte*! Vou te ajudar com *todos os passos* para você estar com *tudo pronto para lucrar* junto com a *nossa equipe*! 🚀\n\nMe diz uma coisa, qual seria sua *principal dúvida* para seguirmos em frente? 👊'
      },
      {
        id: 'l2',
        title: 'EXPLICAÇÃO DE DEPÓSITO',
        icon: '💰',
        content: 'Para realizar seu depósito, pode fazer o processo pelo site da sua corretora:\n\n- Clique nos *três traços* da parte superior do lado esquerdo\n\n- Vá em *"Depósitos/Saques"*\n\n- Clique em *"Depósito"*\n\n- Selecione o método de depósito e clique em "Continuar"\n\n- Coloque o valor que deseja depositar e *siga as instruções* que aparecerá na tela.\n\nMe chame assim que concluir ou se tiver dificuldade!'
      },
      {
        id: 'l3',
        title: 'RESPOSTA SOBRE CONFIANÇA',
        icon: '🛡️',
        content: 'Entendo *perfeitamente* sua preocupação, é *muito importante ter segurança*, especialmente quando se trata dos seus investimentos.\n\nQuero te assegurar que *levamos a segurança dos nossos alunos muito a sério*. 🛡️\n\nA plataforma é *regulamentada* e investimos constantemente nas mais recentes tecnologias para *proteger todos os seus dados e o seu capital*.\n\nEu, {{user.username}}, e toda a *Equipe de Suporte* estamos à disposição para esclarecer *qualquer dúvida* que você tenha sobre isso, para que você se sinta *totalmente confortável e seguro conosco*. ✅'
      },
      {
        id: 'l4',
        title: 'RESPOSTA SOBRE BÔNUS',
        icon: '🎁',
        content: 'Que *ótima pergunta* sobre o bônus! 😊 Funciona assim:\n\nA corretora oferece um *bônus de 100%* no seu *depósito de ativação* (a partir de *30 dólares*), que pode dobrar seu capital inicial para operar.\n\nAlém disso, mesmo com a conta já ativa, você receberá um *bônus de 100%* para *novos depósitos* (também a partir de *30 dólares*).\n\nMe diga qual situação se aplica a você ou se tem interesse, e eu, {{user.username}}, posso *verificar as condições atuais* e te passar *todos os detalhes*! 💪'
      },
      {
        id: 'l5',
        title: 'FEEDBACK - ATENDIMENTO CONCLUÍDO',
        icon: '👍',
        content: '*Maravilha!* Estarei finalizando nosso atendimento e antes disso gostaria de aprimorar nossos serviços para atender *melhor* às suas necessidades.\n\nCompartilhe conosco sua opinião agora preenchendo o formulário abaixo e nos ajude a continuar oferecendo a *excelência* que você merece. Sua voz é *crucial* para nós!\n\n🌟 https://bit.ly/Feedback-Do-Atendimento\n\n#SuaOpiniãoImporta'
      },
      {
        id: 'l6',
        title: 'FEEDBACK - SEM RETORNO DO ALUNO',
        icon: '💬',
        content: 'Lamentamos a *falta de comunicação* durante sua experiência conosco. Sua opinião é *crucial* para melhorarmos. Compartilhe seus comentários em nosso formulário de avaliação:\n\nhttps://bit.ly/Feedback-Do-Atendimento\n\nQueremos garantir que futuros atendimentos sejam mais *claros* e *eficazes*. Agradecemos por ajudar a moldar nossa *qualidade de serviço*. Seu feedback é *valorizado*! 🤝'
      },
      {
        id: 'l7',
        title: 'LOGIN MT5 - CELULAR',
        icon: '📱',
        content: 'Para logar sua conta na plataforma MetaTrader 5 no seu Android, siga essas instruções:\n\n- Entre no App *MetaTrader 5*\n\n- Clique nos *três traços* da parte superior do lado esquerdo\n\n- Vá em *Gerenciar Contas* (ou *Controle de Contas*)\n\n- Clique no ícone *+*\n\n- Digite o nome da sua corretora e selecione ela\n\n- Por último coloque seu *Login (ID da conta)*, *Senha* e *Servidor* corretos e clique em *Login*.\n\nMe avise caso tenha dificuldade!'
      },
      {
        id: 'l8',
        title: 'VALIDAÇÃO DE CONTA',
        icon: '✅',
        content: 'Para validar sua conta, siga os passos simples abaixo:\n\n*Documento de Identificação:* Tenha em mãos um dos seguintes documentos: *RG*, *Carteira de Motorista* ou *Passaporte*.\n\n*Comprovante de Residência:* Prepare um comprovante de residência *recente*, como uma conta de água, luz, gás, internet, telefone residencial, carta bancária ou extrato bancário.\n\n*No site da corretora:* Acesse o menu esquerdo clicando nos *três traços*, em seguida, clique em *"Perfil"* e depois em *"SumSub Verification"*.\n\n*Carregue os documentos:* Selecione o documento que deseja carregar e *siga as instruções* fornecidas pela corretora.\n\n*Importante:* Verifique se o documento de identificação está dentro do *prazo de validade* e se o comprovante de residência está em *seu nome* e ter, no máximo, *3 meses de emissão* em formato *PDF*.'
      }
    ]
  },
  {
    id: 'aldeia',
    name: 'Aldeia',
    messages: [
      {
        id: 'a1',
        title: 'BOAS-VINDAS',
        icon: '🌱',
        content: 'Olá, tudo bem? Sou da equipe de suporte, e queria te dar as **boas-vindas à Aldeia!** 🌱\n\nJá salve este número, pois estamos disponíveis **24h por dia** para te ajudar no que precisar por aqui.\n\nVocê está disponível para falarmos sobre todos os seus acessos e benefícios agora que faz parte da Aldeia?'
      },
      {
        id: 'a2',
        title: 'BÔNUS DEPOSITADO',
        icon: '🥳',
        content: 'Olá, tudo bem?\n\nTenho uma ótima notícia para você. Seu bônus de adesão já está disponível na sua conta! 🥳\n\nQualquer dúvida, estamos aqui para te ajudar! Te desejo um excelente dia e sucesso nas suas operações! 📈🚀'
      },
      {
        id: 'a3',
        title: 'ATENDIMENTO - DÚVIDA NÃO INFORMADA',
        icon: '💬',
        content: 'Olá, como você está? Sou o(a) {{user.username}}, da equipe de suporte da Aldeia e estarei te auxiliando neste momento. Como posso lhe ajudar?'
      },
      {
        id: 'a4',
        title: 'ATENDIMENTO - DÚVIDA EXPOSTA',
        icon: '💬',
        content: 'Olá, como você está? Sou o(a) {{user.username}}, da equipe de suporte da Aldeia e estarei te auxiliando neste momento. Referente a sua dúvida, [prosseguir com a resposta].'
      },
      {
        id: 'a5',
        title: 'ATENDIMENTO - TRANSFERÊNCIA',
        icon: '💬',
        content: 'Olá [NOME DO ALUNO], sou o(a) {{user.username}}, da equipe de suporte da Aldeia e vou dar continuidade no seu atendimento sobre [ASSUNTO]…'
      },
      {
        id: 'a6',
        title: 'ACOMP. - 15 MIN SEM RETORNO',
        icon: '⏳',
        content: 'Lembrando que estou aqui para ajudar no que precisar!'
      },
      {
        id: 'a7',
        title: 'ACOMP. - 1H+ SEM RETORNO',
        icon: '⏳',
        content: 'Por falta de retorno, estarei finalizando nosso atendimento, mas estamos sempre à disposição para te ajudar! Fique à vontade para nos procurar novamente caso surjam mais dúvidas.'
      },
      {
        id: 'a8',
        title: 'ACOMP. - AGUARDANDO RETORNO',
        icon: '⏳',
        content: 'Assim que possível, entre em contato para podermos resolver isso. Ficamos de prontidão para te ajudar!'
      },
      {
        id: 'a9',
        title: 'ABERTURA DE CHAMADO',
        icon: '✅',
        content: '**Chamado aberto com sucesso!** ✅\n\nRecebemos sua solicitação e já abrimos um chamado com a nossa equipe técnica.\n\n⏳ **Agora é só aguardar!** Assim que o problema for solucionado, entraremos em contato diretamente com você, ok?'
      },
      {
        id: 'a10',
        title: 'FINALIZAÇÃO DE ATENDIMENTO',
        icon: '👍',
        content: 'Fico feliz em saber que suas dúvidas foram solucionadas! Gostaria de contar com sua ajuda para podermos melhorar ainda mais nossos serviços.\n\n**É muito importante que você avalie o atendimento através do formulário abaixo:**\nhttps://bit.ly/AtendAldeia\n\n*Seu feedback é fundamental e nos ajuda a oferecer uma experiência cada vez melhor!*\n\n**Antes de encerrarmos, um aviso importante:**\n🚨 Estão circulando e-mails falsos em nome da *TradeStars* oferecendo prêmios em dinheiro.\n\n⚠️ **Isso é golpe!** Nunca oferecemos premiações em reais, e todos os nossos comunicados acontecem somente pelos canais oficiais da Aldeia.'
      },
      {
        id: 'a11',
        title: 'AGENDAMENTO - MENSAGEM INICIAL',
        icon: '🗓️',
        content: 'Olá, tudo bem?\n\nEstou entrando em contato referente ao seu agendamento.\n\nAproveito para lembrar que é fundamental ter o AnyDesk instalado no seu **computador**. Caso ainda não tenha, segue o link: https://anydesk.com/pt/downloads/\n\nPosso confirmar seu agendamento?'
      },
      {
        id: 'a12',
        title: 'AGENDAMENTO - SEM RETORNO',
        icon: '🗓️',
        content: 'Tendo em vista que o tempo de tolerância de espera é de 15 minutos após o horário combinado e não tive retorno, acredito que esteja indisponível neste momento, então estarei encerrando este atendimento.\n\nCaso tenha interesse em reagendar, permanecemos à disposição.'
      },
      {
        id: 'a13',
        title: 'RECONTATO - DIA 2 (SEM BOAS-VINDAS)',
        icon: '🔄',
        content: 'Olá, aqui é do Suporte da Aldeia.\nPreciso te apresentar todos os benefícios que você tem fazendo parte da Aldeia. Lembrando que assim que se torna um aluno da Aldeia você ganha 100$ para iniciar suas operações.\nQuando podemos conversar?'
      },
      {
        id: 'a14',
        title: 'RECONTATO - 1º DIA EM ATRASO',
        icon: '🔄',
        content: 'Ei, você desistiu da gente? 😢\nOlá, tudo bem? Eu realmente não quero acreditar que você está prestes a perder tudo isso: mentorias exclusivas, operações ao vivo e ferramentas que podem transformar seus resultados no mercado.\nVamos conversar antes que essa oportunidade passe de vez? 📞'
      },
      {
        id: 'a15',
        title: 'RECONTATO - FINALIZAÇÃO (15 DIAS)',
        icon: '🔄',
        content: 'Olá, tudo bem? Aqui é da equipe de Suporte da Aldeia!\nNotei que não estou tendo retorno, então vou te enviar o Guia Essencial da Aldeia com todas as informações sobre seus acessos:\n📄 https://bit.ly/GuiaEssencialAldeia\nQualquer dúvida, estamos disponíveis 24h por dia neste número.'
      },
      {
        id: 'a16',
        title: 'PROCESSO - ABERTURA DE CONTA',
        icon: '🛠️',
        content: 'Perfeito, vamos seguir em frente com a sua inscrição, primeiro preciso que clique no link abaixo:\n\nhttps://bit.ly/AbCnT-RI\n\nMas caso precise eu estarei aqui a disposição para te ajudar em todos os passos necessários, basta mandar uma foto da parte do processo de abertura de conta em que está que irei lhe auxiliar!'
      },
      {
        id: 'a17',
        title: 'PROCESSO - VALIDAÇÃO DE CONTA',
        icon: '🛠️',
        content: 'Para conseguir validar seu cadastro, precisaria apenas entrar no site da sua corretora e enviar dois documentos:\n\n1 - *Comprovante de Identidade* (RG, CARTEIRA DE MOTORISTA ou PASSAPORTE);\n\n2 - *Comprovante de Residência* (COMPROVANTE DE ÁGUA/LUZ/INTERNET/GÁS ou EXTRATO BANCÁRIO)\n\n_Lembrando que pode levar até 24h úteis para validar a conta, qualquer dúvida estarei à disposição!_'
      },
      {
        id: 'a18',
        title: 'LINKS ÚTEIS',
        icon: '🔗',
        content: '**Guia Essencial do Aluno:**\nhttps://bit.ly/GuiaEssencialAldeia\n\n**Comunidade de Avisos:**\nhttps://bit.ly/Com-Aldeia\n\n**Grupo AldeiaStart:**\nhttps://bit.ly/GP-AldeiaStart\n\n**Plataforma Aldeia:**\nhttps://minhaaldeia.com/start'
      }
    ]
  },
  {
    id: 'tribo',
    name: 'Tribo',
    messages: [
      {
        id: 't1',
        title: 'BOAS-VINDAS (TITULAR)',
        icon: '🚀',
        content: 'Olá, [NOME]! Tudo certo? Sou o {{user.username}}, e queria te dar as boas-vindas à Tribo! 🚀\n\nJá salve este número, pois estamos disponíveis *24h por dia* para te ajudar no que precisar por aqui.\n\nVocê está disponível para falarmos sobre todos os seus acessos e benefícios agora que faz parte da Tribo?'
      },
      {
        id: 't2',
        title: 'BOAS-VINDAS (ADICIONAL)',
        icon: '🤗',
        content: 'Ei! Talvez você já tenha assistido uma live ou outra... talvez até já nos conheça. 👀\n\nMas se é a sua primeira vez por aqui, seja muito bem-vindo à Tribo! 🤗\n\nA gente separou algo especial só para os que chegaram agora, e quero te mostrar tudo que você tem acesso como membro da Tribo.\n\nInclusive, tem novidade rolando AGORA que pode ser o seu ponto de virada.\nQuer que eu te conte mais? \n\nMe responde aqui com #QUERO e eu te mostro como começar com o pé direito!'
      },
      {
        id: 't3',
        title: 'ATENDIMENTO - DÚVIDA NÃO INFORMADA',
        icon: '💬',
        content: 'Olá, como você está? Sou o {{user.username}}, da equipe de Gestores da Tribo e estarei te auxiliando neste momento. Como posso lhe ajudar?'
      },
      {
        id: 't4',
        title: 'ATENDIMENTO - DÚVIDA EXPOSTA',
        icon: '💬',
        content: 'Olá, como você está? Sou o {{user.username}}, da equipe de Gestores da Tribo e estarei te auxiliando neste momento. Referente a sua dúvida,'
      },
      {
        id: 't5',
        title: 'ATENDIMENTO - TRANSFERÊNCIA',
        icon: '💬',
        content: 'Olá [NOME], sou o {{user.username}}, da equipe de Gestores da Tribo e vou dar continuidade no seu atendimento sobre [ASSUNTO]…'
      },
      {
        id: 't6',
        title: 'SEM RETORNO (30 MIN)',
        icon: '⏳',
        content: 'Lembrando que estou aqui para ajudar no que precisar!\n\nE um último aviso importante:\n🚨 Estão circulando e-mails falsos em nome da TradeStars oferecendo prêmios em dinheiro.\n⚠️ Isso é golpe! Nunca oferecemos premiações em reais, e todos os nossos comunicados acontecem apenas pelos canais oficiais da Tribo.\nConfira nossos contatos oficiais aqui: https://tradestars.com.br/nossos-contatos/'
      },
      {
        id: 't7',
        title: 'SEM RETORNO (1H+)',
        icon: '⏳',
        content: 'Por falta de retorno, estarei finalizando nosso atendimento por aqui, mas estamos sempre à disposição para te ajudar! Fique à vontade para nos procurar novamente caso surjam mais dúvidas.\n\nE um último aviso importante:\n🚨 Estão circulando e-mails falsos em nome da TradeStars oferecendo prêmios em dinheiro.\n⚠️ Isso é golpe! Nunca oferecemos premiações em reais, e todos os nossos comunicados acontecem apenas pelos canais oficiais da Tribo.\nConfira nossos contatos oficiais aqui: https://tradestars.com.br/nossos-contatos/\nSe receber algo suspeito, não clique em nenhum link, ok?'
      },
      {
        id: 't8',
        title: 'FINALIZAÇÃO DE ATENDIMENTO',
        icon: '👍',
        content: 'Fico feliz em saber que suas dúvidas foram resolvidas! Sou da equipe da Tribo e gostaria de contar com sua ajuda para que possamos melhorar ainda mais nossos serviços.\nÉ muito importante que você avalie o atendimento através do formulário abaixo: https://bit.ly/AvAtendimento\nSeu feedback é fundamental e nos ajuda a oferecer uma experiência cada vez melhor!\nAntes de encerrarmos, um aviso importante:\n🚨 Estão circulando e-mails falsos em nome da TradeStars oferecendo prêmios em dinheiro.\n⚠️ Isso é golpe! Nunca oferecemos premiações em reais, e todos os nossos comunicados acontecem somente pelos canais oficiais da Tribo.\nConfira nossos contatos oficiais aqui: https://tradestars.com.br/nossos-contatos/'
      },
      {
        id: 't9',
        title: 'AGENDAMENTO - INICIAL',
        icon: '🗓️',
        content: 'Olá, [NOME]! Tudo bem? Aqui é o {{user.username}}, da equipe de Gestores da Tribo!\n\nTemos um atendimento de [ASSUNTO] às [HORA] (horário de Brasília).\n\nAproveito para lembrar que é fundamental ter o AnyDesk instalado no seu *computador*. Caso ainda não tenha, segue o link: https://anydesk.com/pt/downloads/\n\nPosso confirmar seu agendamento?'
      },
      {
        id: 't10',
        title: 'AGENDAMENTO - SEM RETORNO',
        icon: '🗓️',
        content: 'Tendo em vista que o tempo de tolerância de espera é de 15 minutos após o horário combinado e não tive retorno, acredito que esteja indisponível neste momento, então estarei encerrando este atendimento.\n\nCaso tenha interesse em reagendar nosso contato, estarei lhe enviando o link para reagendar!\n\nhttps://calendly.com/suportetradestars\n\nEm caso de qualquer dúvida permanecemos à disposição.'
      },
      {
        id: 't11',
        title: 'BÔNUS DE ADESÃO DEPOSITADO',
        icon: '🥳',
        content: 'Olá, tudo bem? Aqui é o {{user.username}} da equipe de Gestores da Tribo.\n\nTenho uma ótima notícia para você. Seu bônus de adesão já está disponível na sua conta! 🥳\n\nQualquer dúvida, estamos aqui para te ajudar! Te desejo um excelente dia e sucesso nas suas operações! 📈🚀'
      },
      {
        id: 't12',
        title: 'LINKS ÚTEIS',
        icon: '🔗',
        content: '**Guia Essencial do Membro:**\nhttps://www.tradestars.live/guiadoaluno\n\n**Grupos:**\nhttps://bit.ly/m/TradeStarsGrupo\n\n**Plataforma de Cursos:**\nhttps://bit.ly/Login-Tribo\n\n**Neovalor:**\nhttps://queroneovalor.com.br/\n\n**App Arena:**\nhttps://apparena.com.br/download/\n\n**Agendamentos (Calendly):**\nhttps://calendly.com/suportetradestars'
      },
      {
        id: 't13',
        title: 'PROCESSO - GERAR BOLETO',
        icon: '🛠️',
        content: '**Como Gerar um Boleto (Nubank):**\nComprovante de endereço por boleto:\n\n1) Abra o aplicativo do seu banco;\n2) Clique em Depositar;\n3) Selecione a opção "Depositar em Dinheiro";\n4) Coloque o valor mínimo;\n5) Selecione a opção "Enviar boleto por email";\n6) Entre no seu email e localize o boleto que você gerou. Faça o Download e envie no site da corretora.\n\n💡 *OBS: Não precisa pagar o boleto.*'
      }
    ]
  }
];

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export function CopysPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [activeProfile, setActiveProfile] = useState<'leads' | 'aldeia' | 'tribo'>('leads');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [availableProfiles, setAvailableProfiles] = useState<('leads' | 'aldeia' | 'tribo')[]>([]);

  // ============================================================================
  // DETECÇÃO DE PERFIS DISPONÍVEIS
  // ============================================================================

  useEffect(() => {
    const userTags = user?.tags || [];
    const profiles: ('leads' | 'aldeia' | 'tribo')[] = [];

    if (userTags.includes('leads')) profiles.push('leads');
    if (userTags.includes('aldeia')) profiles.push('aldeia');
    if (userTags.includes('tribo')) profiles.push('tribo');

    // Se não tiver tags, mostra todos
    if (profiles.length === 0) {
      profiles.push('leads', 'aldeia', 'tribo');
    }

    setAvailableProfiles(profiles);
    
    // Define o perfil ativo como o primeiro disponível
    if (profiles.length > 0 && !profiles.includes(activeProfile)) {
      setActiveProfile(profiles[0]);
    }
  }, [user?.tags, activeProfile]);

  // ============================================================================
  // SUBSTITUIÇÃO DE VARIÁVEIS
  // ============================================================================

  const replaceVariables = (text: string): string => {
    return text.replace(/\{\{user\.username\}\}/g, user?.nome || 'Suporte');
  };

  // ============================================================================
  // COPIAR MENSAGEM
  // ============================================================================

  const handleCopy = (message: CopyMessage) => {
    const textToCopy = replaceVariables(message.content);
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(message.id);
    toast.success('Copy copiada com sucesso!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ============================================================================
  // RENDERIZAÇÃO
  // ============================================================================

  const currentProfileData = COPYS_DATA.find(p => p.id === activeProfile);

  return (
    <div className="space-y-6">
      {/* Botão Voltar */}
      <BackButton onClick={() => navigate('/ferramentas')} />

      {/* Header */}
      <PageHeader
        title="Copys Padrão"
        description="Modelos de mensagens prontas para agilizar sua comunicação"
        icon={<MessageSquare className="w-5 h-5 text-[#000aff]" />}
      />

      {/* Seletor de Perfil */}
      {availableProfiles.length > 1 && (
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <MessageSquare className="w-5 h-5 text-[#000aff]" />
              <h3 className="text-gray-900 dark:text-white">Selecione o Perfil</h3>
            </div>
            <Tabs value={activeProfile} onValueChange={(v) => setActiveProfile(v as any)}>
              <TabsList className="grid w-full grid-cols-3">
                {availableProfiles.includes('leads') && (
                  <TabsTrigger value="leads">Leads</TabsTrigger>
                )}
                {availableProfiles.includes('aldeia') && (
                  <TabsTrigger value="aldeia">Aldeia</TabsTrigger>
                )}
                {availableProfiles.includes('tribo') && (
                  <TabsTrigger value="tribo">Tribo</TabsTrigger>
                )}
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Mensagens do Perfil Ativo */}
      {currentProfileData && (
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#000aff] rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-gray-900 dark:text-white">Copys {currentProfileData.name}</h2>
                <small className="text-gray-600 dark:text-gray-400">
                  {currentProfileData.messages.length} mensagens disponíveis
                </small>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Accordion type="single" collapsible className="space-y-3">
              {currentProfileData.messages.map((message) => (
                <AccordionItem
                  key={message.id}
                  value={message.id}
                  className="border-2 border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800/50"
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#000aff]/10 dark:bg-[#000aff]/20 rounded-lg flex items-center justify-center">
                        <span className="text-xl">{message.icon}</span>
                      </div>
                      <h4 className="text-gray-900 dark:text-white text-left">{message.title}</h4>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-0">
                    <div className="space-y-4 mt-4">
                      {/* Box com a mensagem */}
                      <div className="p-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg">
                        <p className="whitespace-pre-wrap text-gray-900 dark:text-white">{replaceVariables(message.content)}</p>
                      </div>

                      {/* Botão copiar */}
                      <Button
                        onClick={() => handleCopy(message)}
                        className={`w-full gap-2 ${
                          copiedId === message.id
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-[#000aff] hover:bg-[#0008cc]'
                        }`}
                      >
                        {copiedId === message.id ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copiado!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copiar Mensagem
                          </>
                        )}
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
