# 📊 Dashboards por Setor - TradeStars Portal

## 🎯 Visão Geral

Sistema de dashboards personalizadas por setor que exibe métricas e KPIs específicos para cada time da empresa.

**📍 Localização:** As dashboards estão integradas dentro da página de **Chamados**, acessíveis através de um botão "Métricas" no canto superior direito de cada departamento.

## 🏢 Setores Implementados

### ✅ TEI (Tecnologia e Integração)
**Dashboard:** `/components/dashboards/DashboardTEI.tsx`

**Métricas Principais:**
- Total de chamados
- Tempo médio de resolução
- Chamados de alta prioridade
- Taxa de conclusão

**Gráficos:**
- Distribuição por status (Pizza)
- Distribuição por prioridade (Barras)
- Histórico semanal (Linha)
- Performance individual do time

**Dados Exibidos:**
- Últimos chamados com detalhes completos
- Tempo decorrido/resolução
- Solicitantes
- Prioridades

### ✅ RH (Recursos Humanos)
**Dashboard:** `/components/dashboards/DashboardRH.tsx`

**Métricas Principais:**
- Total de chamados RH
- Tempo médio de atendimento
- Satisfação dos colaboradores
- Taxa de resolução

**Dados Exibidos:**
- Solicitações mais frequentes (Férias, Holerite, etc.)
- Estatísticas gerais

### ✅ Financeiro
**Dashboard:** `/components/dashboards/DashboardFinanceiro.tsx`

**Métricas Principais:**
- Total de chamados
- Tempo médio de processamento
- Chamados pendentes
- Chamados concluídos

**Dados Exibidos:**
- Tipos de solicitação (Reembolso, Adiantamento, etc.)
- Estatísticas gerais

## 🔧 Como Funciona

### 1. Navegação Integrada em Chamados
As dashboards estão integradas na página de **Chamados** (`/components/ChamadosPage.tsx`):

**Fluxo de Navegação:**
1. Usuário acessa **Chamados** no menu
2. Seleciona um departamento (TEI, RH ou Financeiro)
3. Clica no botão **"Métricas"** no canto superior direito
4. Visualiza a dashboard em tela inteira
5. Clica em **"Voltar"** para retornar aos chamados

**Vantagens:**
✅ Contexto preservado (usuário está no departamento correto)  
✅ Acesso rápido sem trocar de página  
✅ Interface limpa em tela inteira  
✅ Navegação intuitiva com breadcrumb visual  

### 2. Context API (UserContext)
Arquivo: `/contexts/UserContext.tsx`

Gerencia informações do usuário (para funcionalidades futuras):
```typescript
interface User {
  id: string;
  nome: string;
  email: string;
  foto?: string;
  setor: 'TEI' | 'RH' | 'Financeiro' | 'Comercial' | 'BI' | 'Tecnologia' | 'Marketing' | 'Admin';
  cargo: string;
  isGestor: boolean;
}
```

### 3. Componentes das Dashboards
Localizados em `/components/dashboards/`:
- `DashboardTEI.tsx` - Métricas do TEI
- `DashboardRH.tsx` - Métricas do RH
- `DashboardFinanceiro.tsx` - Métricas do Financeiro

### 4. Integração
O `ChamadosPage.tsx` controla:
- Estado do departamento selecionado
- Estado de visualização (chamados ou métricas)
- Navegação entre views
- Botões de ação contextuais

## 🚀 Como Usar

### Acessar as Dashboards

1. **Acesse Chamados:**
   - Clique em "Chamados" no menu lateral
   - Selecione um departamento (TEI, RH ou Financeiro)

2. **Visualize as Métricas:**
   - Clique no botão **"Métricas"** no canto superior direito
   - A dashboard será exibida em tela inteira

3. **Retorne aos Chamados:**
   - Clique no botão **"← Voltar"** no topo da dashboard

### Dashboards Disponíveis

**🔵 TEI (Tecnologia e Integração)**
- Acesse: Chamados → TEI → Métricas
- Cor do botão: Azul (#000aff)
- Métricas: Total de chamados, Tempo médio, Alta prioridade, Taxa de conclusão
- Gráficos: Status, Prioridade, Histórico, Performance do time

**🟣 RH (Recursos Humanos)**
- Acesse: Chamados → RH → Métricas
- Cor do botão: Roxo (#ac2aff)
- Métricas: Total de chamados, Tempo médio, Satisfação, Taxa de resolução
- Dados: Solicitações mais frequentes

**🟣 Financeiro**
- Acesse: Chamados → Financeiro → Métricas
- Cor do botão: Magenta (#ff00ed)
- Métricas: Total, Tempo médio, Pendentes, Concluídos
- Dados: Tipos de solicitação

## 📈 Adicionando Dashboards para Novos Setores

### Passo 1: Criar a Dashboard
Crie um novo arquivo em `/components/dashboards/DashboardCOMERCIAL.tsx`:

```typescript
import { PageHeader } from '../common';
import { Card, CardContent } from '../ui/card';
import { TrendingUp } from 'lucide-react';

export function DashboardComercial() {
  return (
    <div className="space-y-6">
      {/* Não precisa do PageHeader aqui - já vem do ChamadosPage */}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <small className="text-gray-600 dark:text-gray-400">Vendas</small>
              <TrendingUp className="w-5 h-5 text-[#000aff]" />
            </div>
            <h2 className="text-gray-900 dark:text-white">R$ 250k</h2>
            <small className="text-green-600 dark:text-green-400">+15%</small>
          </CardContent>
        </Card>
        {/* Adicione mais cards de métricas */}
      </div>
    </div>
  );
}
```

### Passo 2: Adicionar Página de Chamados
Crie `/components/ChamadosComercialPage.tsx`:

```typescript
interface Props {
  onBack: () => void;
  onShowMetrics?: () => void;
}

export function ChamadosComercialPage({ onBack, onShowMetrics }: Props) {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Chamados Comercial"
        description="Solicitações comerciais"
        onBack={onBack}
        actions={
          onShowMetrics && (
            <button
              onClick={onShowMetrics}
              className="px-4 py-2 rounded-xl bg-[#000aff] text-white hover:bg-[#0008e6] transition-colors flex items-center gap-2"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Métricas</span>
            </button>
          )
        }
      />
      {/* Resto do componente */}
    </div>
  );
}
```

### Passo 3: Adicionar ao ChamadosPage
Edite `/components/ChamadosPage.tsx`:

**1. Adicione o import:**
```typescript
import { DashboardComercial } from './dashboards/DashboardComercial';
import { ChamadosComercialPage } from './ChamadosComercialPage';
```

**2. Adicione o tipo:**
```typescript
type DepartmentType = 'financeiro' | 'tei' | 'rh' | 'comercial' | null;
```

**3. Adicione ao array de departamentos:**
```typescript
{
  id: 'comercial' as DepartmentType,
  nome: 'Comercial',
  descricao: 'Solicitações comerciais e vendas',
  icon: TrendingUp,
  cor: '#000aff',
}
```

**4. Adicione a renderização condicional:**
```typescript
// No bloco de métricas
if (showMetrics) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Métricas"
        description={
          selectedDepartment === 'comercial' ? 'Dashboard Comercial' :
          // ... resto
        }
        onBack={() => setShowMetrics(false)}
      />
      {selectedDepartment === 'comercial' && <DashboardComercial />}
      {/* ... resto */}
    </div>
  );
}

// No bloco de chamados
if (selectedDepartment === 'comercial') {
  return (
    <ChamadosComercialPage 
      onBack={() => setSelectedDepartment(null)}
      onShowMetrics={() => setShowMetrics(true)}
    />
  );
}
```

Pronto! Seu novo setor terá chamados e dashboard integrados! 🎉

## 🎨 Componentes Utilizados

### Gráficos (Recharts)
```typescript
import { BarChart, LineChart, PieChart } from 'recharts';
```

**Tipos disponíveis:**
- `BarChart` - Gráfico de barras
- `LineChart` - Gráfico de linhas
- `PieChart` - Gráfico de pizza
- `AreaChart` - Gráfico de área

### Componentes Comuns
```typescript
import { PageHeader, SectionCard, StatusBadge, EmptyState } from './common';
```

### UI Components (ShadCN)
```typescript
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
```

## 🔐 Integração com Supabase (Próximos Passos)

### 1. Autenticação Real
Substituir o mock no `UserContext.tsx`:

```typescript
useEffect(() => {
  // Buscar usuário do Supabase
  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser();
    // Buscar informações adicionais (setor, cargo)
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    setUser({
      id: data.user.id,
      nome: profile.nome,
      email: data.user.email,
      setor: profile.setor,
      cargo: profile.cargo,
      isGestor: profile.is_gestor
    });
  };
  
  fetchUser();
}, []);
```

### 2. Dados Reais dos Chamados
Substituir os mocks nas dashboards:

```typescript
useEffect(() => {
  const fetchChamados = async () => {
    const { data } = await supabase
      .from('chamados')
      .select('*')
      .eq('setor', user.setor)
      .order('created_at', { ascending: false });
    
    setChamados(data);
  };
  
  fetchChamados();
}, [user]);
```

## 📊 Métricas Calculadas

### Tempo Médio
```typescript
const tempoMedio = chamados
  .filter(c => c.status === 'concluido')
  .reduce((acc, c) => acc + c.tempo_resolucao, 0) / concluidos.length;
```

### Taxa de Conclusão
```typescript
const taxaConclusao = (concluidos / totalChamados) * 100;
```

### Distribuição por Status
```typescript
const porStatus = {
  concluidos: chamados.filter(c => c.status === 'concluido').length,
  emAndamento: chamados.filter(c => c.status === 'em_andamento').length,
  pendentes: chamados.filter(c => c.status === 'pendente').length,
};
```

## 🎯 Benefícios

### Para o Time
✅ **Visibilidade clara** das próprias métricas  
✅ **Foco no que importa** para cada setor  
✅ **Acompanhamento em tempo real** do desempenho  
✅ **Identificação rápida** de gargalos  

### Para Gestores
✅ **Comparação** entre times  
✅ **Análise de tendências** por setor  
✅ **Tomada de decisão** baseada em dados  
✅ **Identificação** de melhores práticas  

### Para a Empresa
✅ **Dados segmentados** por área  
✅ **KPIs específicos** de cada setor  
✅ **Visão holística** e detalhada  
✅ **Escalável** para novos setores  

## 🔄 Fluxo Completo

```
Usuário acessa Chamados
    ↓
Seleciona departamento (TEI/RH/Financeiro)
    ↓
Página específica de chamados é exibida
    ↓
Usuário clica no botão "Métricas"
    ↓
Estado showMetrics = true
    ↓
ChamadosPage renderiza a Dashboard correspondente
    ↓
Dashboard busca/exibe dados mockados do setor
    ↓
Usuário clica "Voltar"
    ↓
Retorna para a página de chamados
```

## 📝 Notas Importantes

1. **Mock de Dados:** Atualmente usando dados mockados - substituir por API real
2. **Permissões:** Implementar controle de acesso por setor
3. **Cache:** Considerar cache de dados para performance
4. **Real-time:** Implementar updates em tempo real com Supabase subscriptions
5. **Exportação:** Adicionar funcionalidade de exportar relatórios

## 🎨 Customização Visual

Todas as dashboards seguem o sistema de design do portal:
- ✅ Cores oficiais TradeStars (#000aff, #ac2aff, #ff00ed)
- ✅ Modo escuro completo
- ✅ Tipografia semântica (h1, h2, h3, p, small)
- ✅ Espaçamentos consistentes (space-y-6, gap-6)
- ✅ Componentes reutilizáveis
- ✅ Responsivo mobile/desktop

## 🚀 Próximas Evoluções

- [ ] Dashboard para Comercial
- [ ] Dashboard para BI
- [ ] Dashboard para Marketing
- [ ] Dashboard para Tecnologia
- [ ] Comparativo entre setores (Admin)
- [ ] Exportação de relatórios PDF
- [ ] Alertas personalizados por métrica
- [ ] Metas e objetivos por setor
- [ ] Timeline de evolução mensal
