/**
 * ============================================================================
 * CALCULADORA DE GESTÃO - TradeStars
 * ============================================================================
 *
 * Ferramenta para cálculo de gestão financeira de trading
 * Design integrado com o sistema da plataforma
 *
 * ============================================================================
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calculator,
  Info,
  Lightbulb,
  Shield,
  TrendingDown,
  AlertCircle,
  BarChart3,
} from "lucide-react";
import { PageHeader } from "./common/PageHeader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export function CalculadoraGestaoPage() {
  const navigate = useNavigate();

  // Estados
  const [capital, setCapital] = useState<string>("");
  const [assertividade, setAssertividade] =
    useState<string>("");
  const [meses, setMeses] = useState<string>("1");
  const [dias, setDias] = useState<string>("1");
  const [semanas, setSemanas] = useState<string>("1");
  const [operacoes, setOperacoes] = useState<string>("");
  const [payoff, setPayoff] = useState<string>("Positivo");

  // Resultados
  const [resultados, setResultados] = useState({
    slOperacao: 0,
    slDiario: 0,
    slSemanal: 0,
    slMensal: 0,
    lossTotalTabela: 0,
    tpOperacao: 0,
    tpDiario: 0,
    tpSemanal: 0,
    tpMensal: 0,
    gainTotalTabela: 0,
    gainTotal: 0,
    lossTotal: 0,
    projecao: 0,
  });

  const calcular = () => {
    const capitalValue = parseFloat(capital) || 0;
    const assertividadeValue =
      parseFloat(assertividade) / 100 || 0;
    const mesesValue = parseInt(meses) || 1;
    const diasValue = parseInt(dias) || 1;
    const semanasValue = parseInt(semanas) || 1;
    const operacoesValue = parseInt(operacoes) || 1;

    // Cálculos base para Loss Mensal
    const lossMensal = capitalValue / mesesValue;
    const lossSemanal = lossMensal / semanasValue;
    const lossDiario = lossSemanal / diasValue;
    const lossOperacao = lossDiario / operacoesValue;

    let gainOperacao,
      gainDiario,
      gainSemanal,
      gainMensal,
      lossTotal,
      gainTotal;

    if (payoff === "Negativo") {
      gainOperacao = lossOperacao / 2;
      gainDiario = lossDiario / 2;
      gainSemanal = lossSemanal / 2;
      gainMensal = lossMensal / 2;

      lossTotal =
        operacoesValue *
        diasValue *
        semanasValue *
        mesesValue *
        lossOperacao *
        (1 - assertividadeValue);
      gainTotal =
        mesesValue *
        semanasValue *
        diasValue *
        operacoesValue *
        gainOperacao *
        assertividadeValue;
    } else if (payoff === "Neutro") {
      gainOperacao = lossOperacao;
      gainDiario = lossDiario;
      gainSemanal = lossSemanal;
      gainMensal = lossMensal;

      lossTotal =
        mesesValue *
        semanasValue *
        diasValue *
        operacoesValue *
        lossOperacao *
        (1 - assertividadeValue);
      gainTotal =
        mesesValue *
        semanasValue *
        diasValue *
        operacoesValue *
        gainOperacao;
    } else {
      gainOperacao = lossOperacao * 2;
      gainDiario = lossDiario * 2;
      gainSemanal = lossSemanal * 2;
      gainMensal = lossMensal * 2;

      lossTotal =
        mesesValue *
        semanasValue *
        diasValue *
        operacoesValue *
        lossOperacao *
        (1 - assertividadeValue);
      gainTotal =
        mesesValue *
        semanasValue *
        diasValue *
        operacoesValue *
        gainOperacao *
        assertividadeValue;
    }

    const lossMensalTotal = lossMensal * mesesValue;
    const gainMensalTotal = gainMensal * mesesValue;

    setResultados({
      slOperacao: lossOperacao,
      slDiario: lossDiario,
      slSemanal: lossSemanal,
      slMensal: lossMensal,
      lossTotalTabela: lossMensalTotal,
      tpOperacao: gainOperacao,
      tpDiario: gainDiario,
      tpSemanal: gainSemanal,
      tpMensal: gainMensal,
      gainTotalTabela: gainMensalTotal,
      gainTotal: gainTotal,
      lossTotal: lossTotal,
      projecao: gainTotal - lossTotal,
    });
  };

  useEffect(() => {
    if (capital && assertividade && operacoes) {
      calcular();
    }
  }, [
    capital,
    assertividade,
    meses,
    dias,
    semanas,
    operacoes,
    payoff,
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calculadora de Gestão"
        description="Ferramenta para cálculo de gestão financeira e projeções de trading"
        onBack={() => navigate("/ferramentas")}
        icon={<Calculator className="w-5 h-5 text-[#000aff]" />}
      />

      {/* Grid superior: Formulário + Dicas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Formulário de Entrada */}
        <div className="lg:col-span-2">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#000aff]" />
                Parâmetros da Gestão
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-[0px] pr-[24px] pb-[24px] pl-[24px]">
              {/* Capital e Assertividade */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capital">Capital</Label>
                  <small className="text-gray-600 dark:text-gray-400">
                    Quanto capital você possui para investir
                    nessa gestão?
                  </small>
                  <Input
                    id="capital"
                    type="number"
                    placeholder="0.00"
                    value={capital}
                    onChange={(e) => setCapital(e.target.value)}
                    className="text-right"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="assertividade">
                      Assertividade
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Defina a taxa de assertividade com
                            base nos seus acertos.
                          </p>
                          <p>Se estiver em dúvida, use 50%</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <small className="text-gray-600 dark:text-gray-400">
                    Qual é sua porcentagem de assertividade?
                  </small>
                  <div className="relative">
                    <Input
                      id="assertividade"
                      type="number"
                      placeholder="0.00"
                      value={assertividade}
                      onChange={(e) =>
                        setAssertividade(e.target.value)
                      }
                      className="text-right pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                      %
                    </span>
                  </div>
                </div>
              </div>

              {/* Tempo de Operação */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-gray-900 dark:text-white mb-1">
                    Tempo de operação
                  </h3>
                  <small className="text-gray-600 dark:text-gray-400">
                    Por quanto tempo gostaria que fosse feita a
                    sua gestão?
                  </small>
                </div>

                {/* Linha 1: Meses do ano + Semanas no mês */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="meses">Meses do ano</Label>
                    <Select
                      value={meses}
                      onValueChange={setMeses}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(12)].map((_, i) => (
                          <SelectItem
                            key={i + 1}
                            value={String(i + 1)}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="semanas">
                      Semanas no mês
                    </Label>
                    <Select
                      value={semanas}
                      onValueChange={setSemanas}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(4)].map((_, i) => (
                          <SelectItem
                            key={i + 1}
                            value={String(i + 1)}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Linha 2: Dias da semana + Operações/dia */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dias">Dias da semana</Label>
                    <Select
                      value={dias}
                      onValueChange={setDias}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(7)].map((_, i) => (
                          <SelectItem
                            key={i + 1}
                            value={String(i + 1)}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="operacoes">
                      Operações/dia
                    </Label>
                    <Input
                      id="operacoes"
                      type="number"
                      placeholder="1"
                      value={operacoes}
                      onChange={(e) =>
                        setOperacoes(e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* PayOff */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div className="space-y-2">
                  <Label htmlFor="payoff">PayOff</Label>
                  <small className="text-gray-600 dark:text-gray-400">
                    Qual o risco x retorno? Quanto arrisca para
                    ganhar?
                  </small>
                  <Select
                    value={payoff}
                    onValueChange={setPayoff}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Positivo">
                        Positivo
                      </SelectItem>
                      <SelectItem value="Neutro">
                        Neutro
                      </SelectItem>
                      <SelectItem value="Negativo">
                        Negativo
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={calcular}
                  className="bg-[#000aff] hover:bg-[#0008e6] text-white"
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Calcular
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dicas de Gestão */}
        <div className="lg:col-span-1">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-[#000aff]" />
                Dicas de Gestão
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex flex-col justify-center">
              <div className="space-y-4">
                {/* Dica 1 */}
                <div className="flex gap-3 p-4 bg-[#000aff]/5 dark:bg-[#000aff]/10 rounded-lg border-l-4 border-[#000aff]">
                  <TrendingDown className="w-5 h-5 text-[#000aff] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-900 dark:text-white mb-1">
                      <strong>PayOff Adequado</strong>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <small className="text-sm">
                        Um payoff positivo aumenta suas chances
                        de rentabilidade mesmo com assertividade
                        abaixo de 50%.
                      </small>
                    </p>
                  </div>
                </div>

                {/* Dica 2 */}
                <div className="flex gap-3 p-4 bg-[#ac2aff]/5 dark:bg-[#ac2aff]/10 rounded-lg border-l-4 border-[#ac2aff]">
                  <AlertCircle className="w-5 h-5 text-[#ac2aff] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-900 dark:text-white mb-1">
                      <strong>Assertividade Realista</strong>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <small className="text-sm">
                        Se não souber sua assertividade real,
                        use 50%. É melhor ser conservador e
                        ajustar com base nos resultados reais.
                      </small>
                    </p>
                  </div>
                </div>

                {/* Dica 3 */}
                <div className="flex gap-3 p-4 bg-[#ff00ed]/5 dark:bg-[#ff00ed]/10 rounded-lg border-l-4 border-[#ff00ed]">
                  <BarChart3 className="w-5 h-5 text-[#ff00ed] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-900 dark:text-white mb-1">
                      <strong>Registre suas Operações</strong>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <small className="text-sm">
                        Mantenha um diário de trades para
                        acompanhar se está seguindo a gestão
                        calculada e identificar padrões de
                        sucesso ou erro.
                      </small>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Grid inferior: Resultados (Stop Loss, Stop Gain, Projeção) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {/* Stop Loss */}
        <Card className="bg-white dark:bg-gray-900 border-[#dc2626] dark:border-[#dc2626] h-full flex flex-col">
          <CardHeader className="bg-[#dc2626] text-white rounded-t-[10px] rounded-b-[0px]">
            <CardTitle className="mt-[0px] mr-[0px] mb-[8px] ml-[0px]">
              Stop Loss
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex-1">
            <div className="space-y-4 h-full flex flex-col">
              <div>
                <small className="text-gray-600 dark:text-gray-400">
                  SL Operação
                </small>
                <p className="text-[#dc2626] dark:text-[#ef4444]">
                  ${resultados.slOperacao.toFixed(2)}
                </p>
              </div>
              <div>
                <small className="text-gray-600 dark:text-gray-400">
                  SL Diário
                </small>
                <p className="text-[#dc2626] dark:text-[#ef4444]">
                  ${resultados.slDiario.toFixed(2)}
                </p>
              </div>
              <div>
                <small className="text-gray-600 dark:text-gray-400">
                  SL Semanal
                </small>
                <p className="text-[#dc2626] dark:text-[#ef4444]">
                  ${resultados.slSemanal.toFixed(2)}
                </p>
              </div>
              <div>
                <small className="text-gray-600 dark:text-gray-400">
                  SL Mensal
                </small>
                <p className="text-[#dc2626] dark:text-[#ef4444]">
                  ${resultados.slMensal.toFixed(2)}
                </p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <small className="text-gray-600 dark:text-gray-400">
                  Loss Total
                </small>
                <h3 className="text-[#dc2626] dark:text-[#ef4444]">
                  ${resultados.lossTotalTabela.toFixed(2)}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stop Gain */}
        <Card className="bg-white dark:bg-gray-900 border-[#16a34a] dark:border-[#16a34a] h-full flex flex-col">
          <CardHeader className="bg-[#16a34a] text-white rounded-t-[10px] rounded-b-[0px]">
            <CardTitle className="m-[0px] pt-[0px] pr-[0px] pb-[8px] pl-[0px]">
              Stop Gain
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex-1">
            <div className="space-y-4 h-full flex flex-col">
              <div>
                <small className="text-gray-600 dark:text-gray-400">
                  TP Operação
                </small>
                <p className="text-[#16a34a] dark:text-[#22c55e]">
                  ${resultados.tpOperacao.toFixed(2)}
                </p>
              </div>
              <div>
                <small className="text-gray-600 dark:text-gray-400">
                  TP Diário
                </small>
                <p className="text-[#16a34a] dark:text-[#22c55e]">
                  ${resultados.tpDiario.toFixed(2)}
                </p>
              </div>
              <div>
                <small className="text-gray-600 dark:text-gray-400">
                  TP Semanal
                </small>
                <p className="text-[#16a34a] dark:text-[#22c55e]">
                  ${resultados.tpSemanal.toFixed(2)}
                </p>
              </div>
              <div>
                <small className="text-gray-600 dark:text-gray-400">
                  TP Mensal
                </small>
                <p className="text-[#16a34a] dark:text-[#22c55e]">
                  ${resultados.tpMensal.toFixed(2)}
                </p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <small className="text-gray-600 dark:text-gray-400">
                  Gain Total
                </small>
                <h3 className="text-[#16a34a] dark:text-[#22c55e]">
                  ${resultados.gainTotalTabela.toFixed(2)}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projeção */}
        <Card className="bg-white dark:bg-gray-900 border-[#000aff] dark:border-[#000aff] h-full flex flex-col">
          <CardHeader className="bg-[#000aff] text-white rounded-t-[10px] rounded-b-[0px]">
            <CardTitle className="px-[0px] py-[8px] mt-[0px] mr-[0px] mb-[8px] ml-[0px] p-[0px]">
              Projeção
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex-1">
            <div className="space-y-4 h-full flex flex-col">
              <div>
                <small className="text-gray-600 dark:text-gray-400 block mb-2">
                  A projeção exibe a diferença entre o total de
                  Loss e Gain, considerando exclusivamente os
                  resultados do período operacional selecionado
                </small>
              </div>

              <div>
                <small className="text-green-700 dark:text-green-400">
                  Total Gain
                </small>
                <p className="text-green-600 dark:text-green-400">
                  ${resultados.gainTotal.toFixed(2)}
                </p>
              </div>

              <div>
                <small className="text-red-700 dark:text-red-400">
                  Total Loss
                </small>
                <p className="text-red-600 dark:text-red-400">
                  ${resultados.lossTotal.toFixed(2)}
                </p>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <small className="text-[#000aff] dark:text-[#3b82f6]">
                  Total
                </small>
                <h2 className="text-[#000aff] dark:text-[#3b82f6]">
                  ${resultados.projecao.toFixed(2)}
                </h2>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}