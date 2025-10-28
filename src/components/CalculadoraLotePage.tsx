/**
 * ============================================================================
 * CALCULADORA DE LOTE - TradeStars
 * ============================================================================
 * 
 * Ferramenta para cálculo de lote ideal em operações de trading
 * Design integrado com o sistema da plataforma
 * 
 * ============================================================================
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, Lightbulb, TrendingUp, AlertTriangle, Target } from 'lucide-react';
import { PageHeader } from './common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface TabelaLote {
  [key: string]: number;
}

export function CalculadoraLotePage() {
  const navigate = useNavigate();

  // Estados
  const [ativo, setAtivo] = useState<string>('GOLD');
  const [lossOp, setLossOp] = useState<string>('');
  const [pontosOp, setPontosOp] = useState<string>('');
  const [loteCalculado, setLoteCalculado] = useState<number>(0);
  const [tabelaLotes, setTabelaLotes] = useState<TabelaLote>({});

  const calc = (ativo: string, lossOp: number, pontosOp: number) => {
    let lot = 0;
    let table: TabelaLote = {};

    switch (ativo) {
      case 'GOLD':
      case 'EURUSD / GBPUSD / AUDUSD / NZDUSD':
        lot = lossOp / pontosOp;
        table = {
          '0.01': lossOp / 0.01,
          '0.02': lossOp / 0.02,
          '0.03': lossOp / 0.03,
          '0.04': lossOp / 0.04,
          '0.05': lossOp / 0.05,
          '0.06': lossOp / 0.06,
          '0.07': lossOp / 0.07,
          '0.08': lossOp / 0.08,
          '0.09': lossOp / 0.09,
          '0.10': lossOp / 0.10,
        };
        break;
      case 'ÍNDICES':
        lot = lossOp / pontosOp;
        table = {
          '0.1': (lossOp / 0.1) * 100,
          '0.2': (lossOp / 0.2) * 100,
          '0.3': (lossOp / 0.3) * 100,
          '0.4': (lossOp / 0.4) * 100,
          '0.5': (lossOp / 0.5) * 100,
          '0.6': (lossOp / 0.6) * 100,
          '0.7': (lossOp / 0.7) * 100,
          '0.8': (lossOp / 0.8) * 100,
          '0.9': (lossOp / 0.9) * 100,
          '1.0': (lossOp / 1) * 100,
        };
        break;
      case 'USDJPY':
        lot = (lossOp / pontosOp) / 0.754;
        table = {
          '0.01': (lossOp / 0.01) / 0.754,
          '0.02': (lossOp / 0.02) / 0.754,
          '0.03': (lossOp / 0.03) / 0.754,
          '0.04': (lossOp / 0.04) / 0.754,
          '0.05': (lossOp / 0.05) / 0.754,
          '0.06': (lossOp / 0.06) / 0.754,
          '0.07': (lossOp / 0.07) / 0.754,
          '0.08': (lossOp / 0.08) / 0.754,
          '0.09': (lossOp / 0.09) / 0.754,
          '0.10': (lossOp / 0.10) / 0.754,
        };
        break;
      case 'USDCHF':
        lot = (lossOp / pontosOp) / 1.125;
        table = {
          '0.01': (lossOp / 0.01) / 1.125,
          '0.02': (lossOp / 0.02) / 1.125,
          '0.03': (lossOp / 0.03) / 1.125,
          '0.04': (lossOp / 0.04) / 1.125,
          '0.05': (lossOp / 0.05) / 1.125,
          '0.06': (lossOp / 0.06) / 1.125,
          '0.07': (lossOp / 0.07) / 1.125,
          '0.08': (lossOp / 0.08) / 1.125,
          '0.09': (lossOp / 0.09) / 1.125,
          '0.10': (lossOp / 0.10) / 1.125,
        };
        break;
      case 'USDCAD':
        lot = (lossOp / pontosOp) / 0.739;
        table = {
          '0.01': (lossOp / 0.01) / 0.739,
          '0.02': (lossOp / 0.02) / 0.739,
          '0.03': (lossOp / 0.03) / 0.739,
          '0.04': (lossOp / 0.04) / 0.739,
          '0.05': (lossOp / 0.05) / 0.739,
          '0.06': (lossOp / 0.06) / 0.739,
          '0.07': (lossOp / 0.07) / 0.739,
          '0.08': (lossOp / 0.08) / 0.739,
          '0.09': (lossOp / 0.09) / 0.739,
          '0.10': (lossOp / 0.10) / 0.739,
        };
        break;
      default:
        lot = 0;
    }

    const decimais = 
      ativo === 'GOLD' ? 3 : 
      ativo === 'EURUSD / GBPUSD / AUDUSD / NZDUSD' ? 3 : 
      ativo === 'ÍNDICES' ? 6 : 
      ativo === 'USDJPY' ? 5 : 
      ativo === 'USDCAD' ? 5 : 
      ativo === 'USDCHF' ? 4 : 3;

    return {
      loteOp: parseFloat(lot.toFixed(decimais)),
      table: table
    };
  };

  const calcular = () => {
    const lossValue = parseFloat(lossOp) || 0;
    const pontosValue = parseFloat(pontosOp) || 0;

    if (lossValue > 0 && pontosValue > 0) {
      const result = calc(ativo, lossValue, pontosValue);
      setLoteCalculado(result.loteOp);
      setTabelaLotes(result.table);
    } else {
      setLoteCalculado(0);
      setTabelaLotes({});
    }
  };

  useEffect(() => {
    calcular();
  }, [ativo, lossOp, pontosOp]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calculadora de Lote"
        description="Ferramenta para cálculo de lote ideal em operações de trading"
        onBack={() => navigate('/ferramentas')}
        icon={<Calculator className="w-5 h-5 text-[#000aff]" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário de Entrada e Tabela */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#000aff]" />
                Parâmetros da Operação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Ativo */}
              <div className="space-y-2">
                <Label htmlFor="ativo">Ativo</Label>
                <small className="text-gray-600 dark:text-gray-400">Qual ativo você quer operar?</small>
                <Select value={ativo} onValueChange={setAtivo}>
                  <SelectTrigger className="bg-gray-100 dark:bg-gray-800 border-[#000aff]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GOLD">GOLD</SelectItem>
                    <SelectItem value="ÍNDICES">ÍNDICES</SelectItem>
                    <SelectItem value="EURUSD / GBPUSD / AUDUSD / NZDUSD">EURUSD / GBPUSD / AUDUSD / NZDUSD</SelectItem>
                    <SelectItem value="USDJPY">USDJPY</SelectItem>
                    <SelectItem value="USDCHF">USDCHF</SelectItem>
                    <SelectItem value="USDCAD">USDCAD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Loss por Operação */}
              <div className="space-y-2">
                <Label htmlFor="loss">Loss por Operação</Label>
                <small className="text-gray-600 dark:text-gray-400">Qual seu Loss máximo para esta operação?</small>
                <Input
                  id="loss"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={lossOp}
                  onChange={(e) => setLossOp(e.target.value)}
                  className="text-right"
                />
              </div>

              {/* Pontos */}
              <div className="space-y-2">
                <Label htmlFor="pontos">Pontos</Label>
                <small className="text-gray-600 dark:text-gray-400">Qual a pontuação desta operação?</small>
                <Input
                  id="pontos"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={pontosOp}
                  onChange={(e) => setPontosOp(e.target.value)}
                  className="text-right"
                />
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

          {/* Tabela de Sugestões */}
          {Object.keys(tabelaLotes).length > 0 && (
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle>Tabela de Referência</CardTitle>
                <small className="text-gray-600 dark:text-gray-400">Pontuação ideal para cada lote</small>
              </CardHeader>
              <CardContent>
                <div className="border border-[#000aff] rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#000aff] hover:bg-[#000aff]">
                        <TableHead className="text-white">Lote</TableHead>
                        <TableHead className="text-white text-right">Pontuação Ideal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(tabelaLotes).map(([lote, pontos]) => (
                        <TableRow key={lote}>
                          <TableCell className="text-[#000aff] dark:text-[#3b82f6]">{lote}</TableCell>
                          <TableCell className="text-right text-[#000aff] dark:text-[#3b82f6]">
                            {pontos.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Resultados e Dicas */}
        <div className="space-y-6">
          {/* Lote Calculado */}
          <Card className="bg-white dark:bg-gray-900 border-[#000aff] dark:border-[#000aff]">
            <CardHeader className="bg-[#000aff] text-white rounded-t-[10px] rounded-b-[0px]">
              <CardTitle className="mt-[0px] mr-[0px] mb-[8px] ml-[0px]">Lote Calculado</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center p-6 bg-[#000aff]/10 dark:bg-[#000aff]/20 rounded-lg">
                <small className="text-gray-600 dark:text-gray-400">Lote Ideal</small>
                <h1 className="text-[#000aff] dark:text-[#3b82f6]">{loteCalculado.toFixed(6)}</h1>
              </div>
            </CardContent>
          </Card>

          {/* Dicas Importantes */}
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-[#000aff]" />
                Dicas Importantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {/* Dica 1 */}
                <div className="flex gap-3 p-4 bg-[#000aff]/5 dark:bg-[#000aff]/10 rounded-lg border-l-4 border-[#000aff]">
                  <Target className="w-5 h-5 text-[#000aff] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-900 dark:text-white mb-1">
                      <strong>Gestão de Risco</strong>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <small>Nunca arrisque mais de 1-2% do seu capital total em uma única operação. O lote calculado deve respeitar essa regra fundamental.</small>
                    </p>
                  </div>
                </div>

                {/* Dica 2 */}
                <div className="flex gap-3 p-4 bg-[#ac2aff]/5 dark:bg-[#ac2aff]/10 rounded-lg border-l-4 border-[#ac2aff]">
                  <AlertTriangle className="w-5 h-5 text-[#ac2aff] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-900 dark:text-white mb-1">
                      <strong>Stop Loss Obrigatório</strong>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <small>Sempre defina seu stop loss antes de entrar na operação. O cálculo do lote pressupõe que você terá um limite de perda definido.</small>
                    </p>
                  </div>
                </div>

                {/* Dica 3 */}
                <div className="flex gap-3 p-4 bg-[#ff00ed]/5 dark:bg-[#ff00ed]/10 rounded-lg border-l-4 border-[#ff00ed]">
                  <TrendingUp className="w-5 h-5 text-[#ff00ed] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-900 dark:text-white mb-1">
                      <strong>Ajuste por Volatilidade</strong>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <small>Em mercados muito voláteis, considere reduzir o lote calculado para compensar movimentos bruscos de preço.</small>
                    </p>
                  </div>
                </div>

                {/* Dica 4 */}
                <div className="flex gap-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <Calculator className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-900 dark:text-white mb-1">
                      <strong>Verificação Dupla</strong>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <small>Sempre confira se o lote calculado está dentro dos limites permitidos pela sua corretora e se corresponde ao seu plano de trading.</small>
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
