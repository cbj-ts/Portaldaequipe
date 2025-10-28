# 🎬 Integração com Vimeo PRO - TradeStars Portal

## 📚 Por que Vimeo PRO?

### ✅ **Vantagens do Vimeo PRO para Corporativo**

| Recurso | Vimeo PRO | YouTube | Google Drive |
|---------|-----------|---------|--------------|
| **Privacidade** | ✅ Controle total | ⚠️ Pode vazar | ⚠️ Permissões |
| **Sem anúncios** | ✅ Sempre | ❌ Só Business | ✅ Sim |
| **Player profissional** | ✅ Customizável | ⚠️ Limitado | ❌ Básico |
| **Analytics** | ✅ Detalhado | ⚠️ Limitado | ❌ Não |
| **API completa** | ✅ Sim | ✅ Sim | ⚠️ Limitada |
| **Controle de acesso** | ✅ Domínio/senha | ⚠️ Não listado | ⚠️ Links |
| **Marca branca** | ✅ Sim | ❌ Não | ❌ Não |
| **Qualidade adaptativa** | ✅ Automática | ✅ Automática | ⚠️ Limitada |
| **Download controlado** | ✅ Sim | ❌ Não | ✅ Sim |
| **Custo mensal** | 💰 $20/mês | ✅ Grátis | ✅ Incluído G Suite |

---

## 🎯 Planos Recomendados

### **Vimeo PRO** - $20/mês (Recomendado para TradeStars)
- ✅ 1 TB de armazenamento
- ✅ Upload semanal ilimitado
- ✅ Privacidade avançada (domínio/senha)
- ✅ Analytics básico
- ✅ Player customizável
- ✅ Até 5 TB de largura de banda/mês

### **Vimeo Business** - $50/mês (Se precisar de mais)
- ✅ Tudo do PRO +
- ✅ 5 TB de armazenamento
- ✅ Analytics avançado
- ✅ Showcase de marca
- ✅ 10+ usuários na conta

### **Vimeo Premium** - $75/mês (Para escala)
- ✅ Tudo do Business +
- ✅ 7 TB de armazenamento
- ✅ Suporte prioritário
- ✅ Unlimited viewers

---

## 🚀 Setup Inicial

### **1. Criar Conta Vimeo PRO**

1. Acesse: https://vimeo.com/upgrade
2. Escolha **Vimeo PRO** ($20/mês)
3. Use email corporativo: `ti@tradestars.com`
4. Configure perfil da empresa

### **2. Configurações de Privacidade**

**No Vimeo Dashboard → Settings → Privacy:**

```
✅ Hide from Vimeo.com
✅ Only people with a password can view
✅ Only on sites I choose (domínio whitelist)
✅ Disable embedding everywhere except: portal.tradestars.com
```

**Domínios permitidos:**
```
portal.tradestars.com
localhost:5173
```

### **3. Configurar Player**

**Settings → Embed:**

```json
{
  "color": "#000aff",           // Azul TradeStars
  "title": false,               // Ocultar título
  "byline": false,              // Ocultar autor
  "portrait": false,            // Ocultar avatar
  "autoplay": false,            // Não iniciar automático
  "controls": true,             // Mostrar controles
  "loop": false,                // Não repetir
  "muted": false,               // Não silenciar
  "playsinline": true,          // Mobile inline
  "speed": true,                // Controle de velocidade
  "pip": true,                  // Picture-in-picture
  "quality_selector": true      // Seletor de qualidade
}
```

---

## 📹 Como Fazer Upload de Vídeos

### **Método 1: Via Interface Web**

1. **Acesse:** https://vimeo.com/upload
2. **Arraste o vídeo** ou clique para selecionar
3. **Preencha:**
   - **Título:** "Segurança da Informação - Aula 1"
   - **Descrição:** "Introdução aos conceitos de segurança"
   - **Privacidade:** "Privado" ou "Oculto do Vimeo"
   - **Categoria:** "Education"
4. **Configurar Privacidade:**
   - ✅ Where can this be embedded: "Specific domains"
   - ✅ Domains: `portal.tradestars.com`
5. **Aguardar processamento** (5-30 min dependendo do tamanho)
6. **Copiar URL** para usar no portal

### **Método 2: Via API (Automação)**

```typescript
// Upload via API do Vimeo
import { Vimeo } from 'vimeo';

const client = new Vimeo(
  'CLIENT_ID',
  'CLIENT_SECRET',
  'ACCESS_TOKEN'
);

client.upload(
  './video.mp4',
  {
    name: 'Segurança da Informação - Aula 1',
    description: 'Introdução aos conceitos',
    privacy: {
      view: 'disable',
      embed: 'whitelist',
    },
    embed: {
      color: '#000aff',
      buttons: {
        like: false,
        share: false,
        watchlater: false,
      },
    },
  },
  (uri) => {
    console.log('Vídeo enviado:', uri);
    // uri = "/videos/123456789"
  },
  (bytesUploaded, bytesTotal) => {
    const percentage = (bytesUploaded / bytesTotal * 100).toFixed(2);
    console.log(`Upload: ${percentage}%`);
  },
  (error) => {
    console.error('Erro:', error);
  }
);
```

---

## 🔗 URLs do Vimeo

### **Formato das URLs**

**URL Original (para compartilhar):**
```
https://vimeo.com/987654321
```

**URL de Embed (para iframe):**
```
https://player.vimeo.com/video/987654321
```

**URL com parâmetros personalizados:**
```
https://player.vimeo.com/video/987654321?color=000aff&title=0&byline=0&portrait=0
```

### **Parâmetros Úteis**

| Parâmetro | Valores | Descrição |
|-----------|---------|-----------|
| `color` | HEX sem # | Cor do player |
| `autoplay` | 0, 1 | Auto iniciar |
| `loop` | 0, 1 | Repetir vídeo |
| `muted` | 0, 1 | Silenciar áudio |
| `title` | 0, 1 | Mostrar título |
| `byline` | 0, 1 | Mostrar autor |
| `portrait` | 0, 1 | Mostrar avatar |
| `speed` | 0, 1 | Controle de velocidade |
| `quality` | auto, 240p, 360p, 540p, 720p, 1080p | Qualidade inicial |
| `texttrack` | pt-BR | Legendas |

### **Exemplo Completo**

```
https://player.vimeo.com/video/987654321?color=000aff&title=0&byline=0&portrait=0&speed=1&quality=auto
```

---

## 💻 Implementação no Portal

### **1. Estrutura Atual (Já Implementada)**

O sistema já está pronto para Vimeo! Veja em `/components/CursoViewer.tsx`:

```typescript
const getVideoEmbedUrl = (url: string) => {
  // Converter URLs do Vimeo para embed
  if (url.includes('vimeo.com/')) {
    const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
    return `https://player.vimeo.com/video/${videoId}`;
  }
  return url;
};
```

### **2. Adicionar Curso com Vimeo**

```typescript
const novoCurso: Curso = {
  id: '7',
  titulo: 'Segurança da Informação',
  // ... outros campos
  modulos: [
    {
      id: 'mod-1',
      titulo: 'Introdução',
      ordem: 1,
      aulas: [
        {
          id: 'aula-1',
          titulo: 'O que é Segurança?',
          tipo: 'video',
          video_url: 'https://vimeo.com/987654321', // ← URL do Vimeo
          duracao: 900,
          ordem: 1,
        }
      ]
    }
  ]
};
```

### **3. Player com Parâmetros Customizados**

Se quiser controle total, crie um componente específico:

```typescript
// /components/VimeoPlayer.tsx
interface VimeoPlayerProps {
  videoId: string;
  autoplay?: boolean;
  controls?: boolean;
  className?: string;
}

export function VimeoPlayer({ 
  videoId, 
  autoplay = false, 
  controls = true,
  className = '' 
}: VimeoPlayerProps) {
  const embedUrl = `https://player.vimeo.com/video/${videoId}?` + new URLSearchParams({
    color: '000aff',
    title: '0',
    byline: '0',
    portrait: '0',
    autoplay: autoplay ? '1' : '0',
    speed: '1',
    quality: 'auto',
  }).toString();

  return (
    <div className={`aspect-video ${className}`}>
      <iframe
        src={embedUrl}
        className="w-full h-full rounded-xl"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title="Vimeo Player"
      />
    </div>
  );
}
```

**Uso:**
```tsx
<VimeoPlayer videoId="987654321" autoplay={false} />
```

---

## 📊 Analytics do Vimeo

### **Métricas Disponíveis no PRO**

**No Dashboard do Vimeo:**
- ✅ Total de visualizações
- ✅ Tempo médio assistido
- ✅ Taxa de conclusão
- ✅ Pico de audiência
- ✅ Dispositivos (desktop/mobile)
- ✅ Localização geográfica
- ✅ Fontes de tráfego

**Via API (para integrar no portal):**

```typescript
// Buscar estatísticas de um vídeo
const stats = await fetch(
  `https://api.vimeo.com/videos/987654321`,
  {
    headers: {
      'Authorization': 'Bearer ACCESS_TOKEN'
    }
  }
);

const data = await stats.json();

console.log({
  plays: data.stats.plays,
  duration: data.duration,
  created: data.created_time,
  link: data.link,
});
```

---

## 🔐 Segurança e Controle de Acesso

### **Nível 1: Domínio Whitelisting** (Recomendado)

Configurar no Vimeo para permitir embed apenas em:
```
portal.tradestars.com
```

**Prós:**
- ✅ Simples de implementar
- ✅ Funciona automaticamente
- ✅ Não requer código extra

**Contras:**
- ⚠️ Qualquer pessoa com acesso ao domínio pode ver

### **Nível 2: Senha no Vídeo**

Cada vídeo tem senha única:

```
https://vimeo.com/987654321/ABC123DEF
```

**Prós:**
- ✅ Segurança adicional
- ✅ Fácil de compartilhar

**Contras:**
- ⚠️ Precisa gerenciar senhas
- ⚠️ Usuário precisa inserir senha

### **Nível 3: API com Token** (Máxima Segurança)

```typescript
// Backend gera URL temporária
const getSecureVideoUrl = async (videoId: string, userId: string) => {
  // Validar permissão do usuário
  const hasAccess = await checkUserAccess(userId, videoId);
  if (!hasAccess) throw new Error('Acesso negado');

  // Gerar token temporário (expira em 1h)
  const token = generateToken(userId, videoId);
  
  return `https://player.vimeo.com/video/${videoId}?h=${token}`;
};
```

---

## 📁 Organização de Vídeos no Vimeo

### **Estrutura de Pastas Recomendada**

```
TradeStars Academy/
├── 01 - Cursos Obrigatórios/
│   ├── Segurança da Informação/
│   │   ├── Módulo 1 - Introdução/
│   │   │   ├── Aula 1 - O que é Segurança.mp4
│   │   │   ├── Aula 2 - Principais Ameaças.mp4
│   │   │   └── Aula 3 - Políticas de Segurança.mp4
│   │   └── Módulo 2 - Proteção de Dados/
│   │       ├── Aula 1 - LGPD na Prática.mp4
│   │       └── Aula 2 - Criptografia.mp4
│   └── Compliance e Ética/
│       └── ...
├── 02 - Desenvolvimento/
│   ├── Excel Avançado/
│   └── Power BI/
└── 03 - Liderança/
    └── Gestão de Equipes/
```

### **Nomenclatura de Vídeos**

**Padrão:**
```
[SETOR] - [CURSO] - M[XX]A[XX] - [TÍTULO]

Exemplos:
TEI - Segurança - M01A01 - O que é Segurança
RH - Compliance - M01A01 - Introdução ao Compliance
BI - Power BI - M02A03 - Criando Dashboards
```

---

## 🎨 Customização do Player

### **Cores da TradeStars**

```typescript
const vimeoColors = {
  primary: '000aff',   // Azul elétrico
  secondary: 'ac2aff', // Roxo vibrante
  accent: 'ff00ed',    // Magenta/rosa
};
```

### **Configuração Completa do Embed**

```html
<iframe
  src="https://player.vimeo.com/video/987654321?color=000aff&title=0&byline=0&portrait=0&speed=1"
  className="w-full h-full rounded-xl"
  frameBorder="0"
  allow="autoplay; fullscreen; picture-in-picture"
  allowFullScreen
  title="Curso TradeStars"
></iframe>
```

### **Player com Marca TradeStars**

Para adicionar logo sobreposta (via código):

```tsx
<div className="relative">
  <iframe src={embedUrl} className="w-full h-full" />
  <div className="absolute top-4 right-4 opacity-50">
    <img src="/logo-tradestars.png" alt="TradeStars" className="h-8" />
  </div>
</div>
```

---

## 🔄 Migração do YouTube para Vimeo

### **Passo a Passo**

**1. Exportar vídeos do YouTube:**
```
YouTube Studio → Conteúdo → Selecionar vídeos → Download
```

**2. Re-upload no Vimeo:**
```
Vimeo Upload → Arraste os arquivos → Configure privacidade
```

**3. Atualizar URLs no banco:**
```typescript
// De:
video_url: 'https://youtube.com/watch?v=ABC123'

// Para:
video_url: 'https://vimeo.com/987654321'
```

**4. Testar:**
- ✅ Player carrega corretamente
- ✅ Controles funcionam
- ✅ Qualidade adaptativa
- ✅ Mobile responsivo

---

## 🚨 Troubleshooting

### **Problema: Vídeo não carrega**

**Causa 1:** Domínio não está na whitelist
```
Solução: Vimeo → Settings → Privacy → Allowed domains → Adicionar
```

**Causa 2:** Vídeo ainda processando
```
Solução: Aguardar processamento completo (5-30 min)
```

**Causa 3:** URL incorreta
```
Solução: Usar formato: https://vimeo.com/VIDEO_ID
```

### **Problema: Player mostra logo do Vimeo**

```
Solução: Vimeo PRO remove automaticamente
Se ainda aparecer: Settings → Player → Branding → Ocultar
```

### **Problema: Qualidade ruim**

```
Solução: 
1. Upload em HD (1080p mínimo)
2. Aguardar processamento de todas as qualidades
3. Configurar quality=auto no embed
```

---

## 💰 Estimativa de Custos

### **Cenário TradeStars**

**Assumindo:**
- 50 cursos
- Média de 5 vídeos por curso = 250 vídeos
- Duração média: 10 min/vídeo
- Qualidade: 1080p
- Tamanho médio: 500MB/vídeo

**Armazenamento:**
```
250 vídeos × 500MB = 125 GB
Vimeo PRO: 1 TB disponível
Uso: 12.5% ✅ Tranquilo
```

**Largura de Banda (mensal):**
```
100 funcionários × 2 cursos/mês × 5 vídeos × 500MB = 500 GB/mês
Vimeo PRO: 5 TB/mês disponível
Uso: 10% ✅ Tranquilo
```

**Custo:**
```
Vimeo PRO: $20/mês = R$ 100/mês
Retorno: Economiza tempo de TI + Melhor UX
```

---

## 📈 Roadmap de Implementação

### **Fase 1: Setup (Semana 1)**
- [ ] Criar conta Vimeo PRO
- [ ] Configurar privacidade e domínios
- [ ] Fazer upload de 3 vídeos teste
- [ ] Testar embed no portal

### **Fase 2: Migração (Semana 2-3)**
- [ ] Upload dos cursos obrigatórios
- [ ] Organizar em pastas por setor
- [ ] Atualizar URLs no código
- [ ] Teste com usuários piloto

### **Fase 3: Produção (Semana 4)**
- [ ] Upload de todos os cursos
- [ ] Documentar processo de upload
- [ ] Treinar equipe de RH/TI
- [ ] Monitorar analytics

### **Fase 4: Otimização (Ongoing)**
- [ ] Adicionar legendas
- [ ] Criar thumbnails personalizadas
- [ ] Implementar API para analytics
- [ ] A/B testing de player configs

---

## 🎯 Checklist de Lançamento

### **Antes de Publicar**

- [ ] ✅ Todos os vídeos em HD (1080p mínimo)
- [ ] ✅ Privacidade configurada (domínio whitelist)
- [ ] ✅ Player customizado (cores TradeStars)
- [ ] ✅ Thumbnails profissionais
- [ ] ✅ Títulos e descrições padronizados
- [ ] ✅ Organização em pastas/showcases
- [ ] ✅ Teste em desktop e mobile
- [ ] ✅ Velocidade de carregamento < 3s
- [ ] ✅ Analytics configurado
- [ ] ✅ Backup dos vídeos originais

---

## 📞 Recursos e Suporte

**Documentação Oficial:**
- Vimeo Developer: https://developer.vimeo.com
- API Reference: https://developer.vimeo.com/api/reference
- Player SDK: https://github.com/vimeo/player.js

**Suporte Vimeo PRO:**
- Email: support@vimeo.com
- Chat: Disponível no dashboard
- Tempo de resposta: 24-48h

**Comunidade:**
- Vimeo Help Center: https://vimeo.com/help
- Forum: https://vimeo.com/forums

---

**Última atualização:** 16 de outubro de 2025  
**Plano recomendado:** Vimeo PRO ($20/mês)  
**Status:** ✅ Sistema pronto para integração
