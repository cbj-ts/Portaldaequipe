/**
 * ============================================================================
 * CALCULADORA DE INVESTIMENTO - TradeStars
 * ============================================================================
 * 
 * Ferramenta para cálculo de investimento com juros compostos
 * Design integrado com o sistema da plataforma
 * 
 * ============================================================================
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, TrendingUp, Lightbulb, Target, Clock, DollarSign, PiggyBank } from 'lucide-react';
import { PageHeader } from './common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import Chart from 'chart.js/auto';

interface CalculoResult {
  totalInvestido: number;
  totalGanho: number;
  total: number;
  periodo: number;
}

export function CalculadoraInvestimentoPage() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  // Estados
  const [valorInicial, setValorInicial] = useState<string>('10000');
  const [valorMensal, setValorMensal] = useState<string>('500');
  const [taxaJuros, setTaxaJuros] = useState<string>('1.00');
  const [periodo, setPeriodo] = useState<string>('10');
  const [tipoPeriodo, setTipoPeriodo] = useState<string>('a');

  // Resultados
  const [resultados, setResultados] = useState<CalculoResult>({
    totalInvestido: 0,
    totalGanho: 0,
    total: 0,
    periodo: 0
  });

  const calc = (vlrMensal: number, vlrInicial: number, taxaJuros: number, qtdPeriodo: number): CalculoResult => {
    const totalInvestido = (qtdPeriodo * vlrMensal) + vlrInicial;
    const jurosCompostosA = vlrInicial * (Math.pow(1 + taxaJuros, qtdPeriodo));
    const jurosCompostosB = vlrMensal * (Math.pow(1 + taxaJuros, qtdPeriodo) - 1);
    const jurosCompostosC = jurosCompostosA + jurosCompostosB / taxaJuros;
    const total = jurosCompostosC - totalInvestido;

    return {
      totalInvestido: +(totalInvestido.toFixed(2)),
      totalGanho: +(jurosCompostosC ? jurosCompostosC.toFixed(2) : 0),
      total: +(total ? total.toFixed(2) : 0),
      periodo: +qtdPeriodo
    };
  };

  const gerarGrafico = (vlrMensal: number, vlrInicial: number, taxaJuros: number, qtdPeriodo: number) => {
    let count = 0;
    const array: CalculoResult[] = [];
    
    while (count < qtdPeriodo) {
      array.push(calc(vlrMensal, vlrInicial, taxaJuros, count));
      count += 12;
    }
    array.push(calc(vlrMensal, vlrInicial, taxaJuros, qtdPeriodo));

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        chartRef.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: array.map(x => x.periodo),
            datasets: [
              {
                label: 'Dinheiro acumulado',
                backgroundColor: '#000aff',
                borderColor: '#000aff',
                data: array.map(x => x.totalGanho),
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#000aff',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverBackgroundColor: '#000aff',
                pointHoverBorderColor: '#fff',
                backgroundColor: (context: any) => {
                  const ctx = context.chart.ctx;
                  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                  gradient.addColorStop(0, 'rgba(0, 10, 255, 0.3)');
                  gradient.addColorStop(1, 'rgba(0, 10, 255, 0.0)');
                  return gradient;
                }
              },
              {
                label: 'Dinheiro Investido',
                backgroundColor: '#ac2aff',
                borderColor: '#ac2aff',
                data: array.map(x => x.totalInvestido),
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#ac2aff',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverBackgroundColor: '#ac2aff',
                pointHoverBorderColor: '#fff',
                backgroundColor: (context: any) => {
                  const ctx = context.chart.ctx;
                  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                  gradient.addColorStop(0, 'rgba(172, 42, 255, 0.2)');
                  gradient.addColorStop(1, 'rgba(172, 42, 255, 0.0)');
                  return gradient;
                }
              },
              {
                label: 'Total de Juros',
                backgroundColor: '#ff00ed',
                borderColor: '#ff00ed',
                data: array.map(x => x.total),
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#ff00ed',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverBackgroundColor: '#ff00ed',
                pointHoverBorderColor: '#fff',
                backgroundColor: (context: any) => {
                  const ctx = context.chart.ctx;
                  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                  gradient.addColorStop(0, 'rgba(255, 0, 237, 0.2)');
                  gradient.addColorStop(1, 'rgba(255, 0, 237, 0.0)');
                  return gradient;
                }
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              mode: 'index',
              intersect: false,
            },
            plugins: {
              title: {
                display: true,
                text: 'Projeção de Investimento',
                font: {
                  size: 18,
                  weight: 'bold'
                },
                color: '#1f2937',
                padding: {
                  top: 10,
                  bottom: 20
                }
              },
              legend: {
                display: true,
                position: 'bottom',
                labels: {
                  padding: 15,
                  font: {
                    size: 12,
                    weight: '500'
                  },
                  usePointStyle: true,
                  pointStyle: 'circle',
                  color: '#6b7280'
                }
              },
              tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                padding: 12,
                displayColors: true,
                titleFont: {
                  size: 14,
                  weight: 'bold'
                },
                bodyFont: {
                  size: 13
                },
                callbacks: {
                  title: function(tooltipItems) {
                    return tooltipItems[0].label + ' meses';
                  },
                  label: function(context) {
                    const value = Number(context.parsed.y);
                    const formatValue = value.toLocaleString('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL', 
                      minimumFractionDigits: 2 
                    });
                    return context.dataset.label + ': ' + formatValue;
                  }
                }
              }
            },
            scales: {
              x: {
                display: true,
                grid: {
                  display: true,
                  color: 'rgba(0, 0, 0, 0.05)',
                  drawBorder: false
                },
                ticks: {
                  color: '#6b7280',
                  font: {
                    size: 11
                  }
                },
                title: {
                  display: true,
                  text: 'Meses',
                  color: '#374151',
                  font: {
                    size: 12,
                    weight: 'bold'
                  }
                }
              },
              y: {
                display: true,
                grid: {
                  display: true,
                  color: 'rgba(0, 0, 0, 0.05)',
                  drawBorder: false
                },
                ticks: {
                  color: '#6b7280',
                  font: {
                    size: 11
                  },
                  callback: function(value) {
                    return 'R$ ' + Number(value).toLocaleString('pt-BR', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    });
                  }
                },
                title: {
                  display: true,
                  text: 'Valor (R$)',
                  color: '#374151',
                  font: {
                    size: 12,
                    weight: 'bold'
                  }
                }
              }
            }
          }
        });
      }
    }
  };

  const calcular = () => {
    const vlrInicialValue = parseFloat(valorInicial) || 0;
    const vlrMensalValue = parseFloat(valorMensal) || 0;
    const taxaValue = parseFloat(taxaJuros) / 100 || 0;
    const periodoValue = parseFloat(periodo) || 0;
    const qtdPeriodo = tipoPeriodo === 'a' ? (12 * periodoValue) : periodoValue;

    const result = calc(vlrMensalValue, vlrInicialValue, taxaValue, qtdPeriodo);
    setResultados(result);

    if (vlrMensalValue > 0 && vlrInicialValue > 0 && taxaValue > 0 && qtdPeriodo > 0) {
      gerarGrafico(vlrMensalValue, vlrInicialValue, taxaValue, qtdPeriodo);
    }
  };

  useEffect(() => {
    calcular();
    
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [valorInicial, valorMensal, taxaJuros, periodo, tipoPeriodo]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calculadora de Investimento"
        description="Ferramenta para cálculo de investimento com juros compostos"
        onBack={() => navigate('/ferramentas')}
        icon={<Calculator className="w-5 h-5 text-[#000aff]" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário de Entrada */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#000aff]" />
                Parâmetros do Investimento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Valor Inicial */}
              <div className="space-y-2">
                <Label htmlFor="valorInicial">Valor Inicial</Label>
                <small className="text-gray-600 dark:text-gray-400">Quanto você tem?</small>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                  <Input
                    id="valorInicial"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={valorInicial}
                    onChange={(e) => setValorInicial(e.target.value)}
                    className="text-right pl-12"
                  />
                </div>
              </div>

              {/* Valor Mensal */}
              <div className="space-y-2">
                <Label htmlFor="valorMensal">Valor Mensal</Label>
                <small className="text-gray-600 dark:text-gray-400">Quanto você pode investir por mês?</small>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                  <Input
                    id="valorMensal"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={valorMensal}
                    onChange={(e) => setValorMensal(e.target.value)}
                    className="text-right pl-12"
                  />
                </div>
              </div>

              {/* Taxa de Juros */}
              <div className="space-y-2">
                <Label htmlFor="taxaJuros">Taxa de Juros</Label>
                <small className="text-gray-600 dark:text-gray-400">Mensal</small>
                <div className="relative">
                  <Input
                    id="taxaJuros"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={taxaJuros}
                    onChange={(e) => setTaxaJuros(e.target.value)}
                    className="text-right pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                </div>
              </div>

              {/* Período */}
              <div className="space-y-2">
                <Label htmlFor="periodo">Período em</Label>
                <small className="text-gray-600 dark:text-gray-400">Em quanto tempo você quer investir?</small>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    id="periodo"
                    type="number"
                    placeholder="10"
                    value={periodo}
                    onChange={(e) => setPeriodo(e.target.value)}
                  />
                  <Select value={tipoPeriodo} onValueChange={setTipoPeriodo}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a">Anos</SelectItem>
                      <SelectItem value="m">Meses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={calcular} 
                className="w-full bg-[#000aff] hover:bg-[#0008e6] text-white"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Calcular
              </Button>
            </CardContent>
          </Card>

          {/* Gráfico */}
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#000aff]" />
                Gráfico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                <canvas ref={canvasRef} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Simulação e Resultados */}
        <div className="space-y-6">
          <Card className="bg-white dark:bg-gray-900 border-[#000aff] dark:border-[#000aff]">
            <CardHeader className="bg-[#000aff] text-white rounded-t-[10px] rounded-b-[0px]">
              <CardTitle className="mt-[0px] mr-[0px] mb-[8px] ml-[0px]">Simulação</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Dinheiro Investido */}
                <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                  <small className="text-gray-600 dark:text-gray-400 block mb-2">Dinheiro Investido</small>
                  <h3 className="text-[#000aff] dark:text-[#3b82f6]">
                    {resultados.totalInvestido.toLocaleString('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    })}
                  </h3>
                </div>

                {/* Total ganho em juros */}
                <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                  <small className="text-gray-600 dark:text-gray-400 block mb-2">Total ganho em juros</small>
                  <h3 className="text-[#000aff] dark:text-[#3b82f6]">
                    {resultados.total.toLocaleString('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    })}
                  </h3>
                </div>

                {/* Dinheiro acumulado */}
                <div className="p-4 bg-[#000aff]/10 dark:bg-[#000aff]/20 rounded-lg border-2 border-[#000aff]">
                  <small className="text-[#000aff] dark:text-[#3b82f6] block mb-2">Dinheiro acumulado</small>
                  <h2 className="text-[#000aff] dark:text-[#3b82f6]">
                    {resultados.totalGanho.toLocaleString('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    })}
                  </h2>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dicas Importantes */}
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-[#000aff]" />
                Dicas de Investimento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {/* Dica 1 */}
                <div className="flex gap-3 p-4 bg-[#000aff]/5 dark:bg-[#000aff]/10 rounded-lg border-l-4 border-[#000aff]">
                  <Clock className="w-5 h-5 text-[#000aff] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-900 dark:text-white mb-1">
                      <strong>Tempo é seu aliado</strong>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <small>Quanto mais tempo você mantiver seu dinheiro investido, maior será o efeito dos juros compostos. Comece cedo!</small>
                    </p>
                  </div>
                </div>

                {/* Dica 2 */}
                <div className="flex gap-3 p-4 bg-[#ac2aff]/5 dark:bg-[#ac2aff]/10 rounded-lg border-l-4 border-[#ac2aff]">
                  <Target className="w-5 h-5 text-[#ac2aff] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-900 dark:text-white mb-1">
                      <strong>Consistência importa</strong>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <small>Aportes mensais regulares, mesmo que pequenos, fazem uma grande diferença no longo prazo devido aos juros sobre juros.</small>
                    </p>
                  </div>
                </div>

                {/* Dica 3 */}
                <div className="flex gap-3 p-4 bg-[#ff00ed]/5 dark:bg-[#ff00ed]/10 rounded-lg border-l-4 border-[#ff00ed]">
                  <DollarSign className="w-5 h-5 text-[#ff00ed] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-900 dark:text-white mb-1">
                      <strong>Taxas realistas</strong>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <small>Use taxas de juros conservadoras nas suas projeções. É melhor ser surpreendido positivamente do que criar expectativas irreais.</small>
                    </p>
                  </div>
                </div>

                {/* Dica 4 */}
                <div className="flex gap-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <PiggyBank className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-900 dark:text-white mb-1">
                      <strong>Diversificação</strong>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <small>Esta calculadora é uma ferramenta de projeção. Na prática, diversifique seus investimentos para reduzir riscos.</small>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
