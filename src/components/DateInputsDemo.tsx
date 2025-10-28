/**
 * ============================================================================
 * DEMONSTRAÇÃO - Inputs de Data
 * ============================================================================
 * 
 * Componente de demonstração para os novos inputs de data.
 * Use este componente como referência para implementar em outras páginas.
 * 
 * NOVOS COMPONENTES:
 * - DateInput: Input de data com calendário
 * - MonthYearInput: Seletor de mês e ano
 * 
 * ============================================================================
 */

import { useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { DateInput } from "./DateInput";
import { MonthYearInput } from "./MonthYearInput";

export function DateInputsDemo() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonthYear, setSelectedMonthYear] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1>Demonstração: Inputs de Data</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Exemplos de uso dos novos componentes de seleção de data
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: DateInput Simples */}
        <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
          <CardHeader>
            <h3>DateInput - Data Simples</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Input de data com calendário popup
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <DateInput
              label="Data do Evento"
              value={selectedDate}
              onChange={setSelectedDate}
              placeholder="Selecione uma data"
              required
            />

            {selectedDate && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <small className="text-gray-600 dark:text-gray-400">
                  Valor selecionado:
                </small>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedDate}
                </p>
              </div>
            )}

            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <small className="text-gray-600 dark:text-gray-400 block mb-2">
                Código:
              </small>
              <pre className="text-xs text-gray-800 dark:text-gray-300 overflow-x-auto">
{`<DateInput
  label="Data do Evento"
  value={selectedDate}
  onChange={setSelectedDate}
  placeholder="Selecione uma data"
  required
/>`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: MonthYearInput */}
        <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
          <CardHeader>
            <h3>MonthYearInput - Mês e Ano</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Seletor de mês e ano com grid visual
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <MonthYearInput
              label="Período"
              value={selectedMonthYear}
              onChange={setSelectedMonthYear}
              placeholder="Selecione mês e ano"
              required
            />

            {selectedMonthYear && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <small className="text-gray-600 dark:text-gray-400">
                  Valor selecionado:
                </small>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedMonthYear}
                </p>
              </div>
            )}

            <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
              <small className="text-gray-600 dark:text-gray-400 block mb-2">
                Código:
              </small>
              <pre className="text-xs text-gray-800 dark:text-gray-300 overflow-x-auto">
{`<MonthYearInput
  label="Período"
  value={selectedMonthYear}
  onChange={setSelectedMonthYear}
  placeholder="Selecione mês e ano"
  required
/>`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Range de Datas */}
        <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
          <CardHeader>
            <h3>Range de Datas</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Dois DateInputs para período
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <DateInput
                label="Data Inicial"
                value={startDate}
                onChange={setStartDate}
                placeholder="Início"
                maxDate={endDate ? new Date(endDate + 'T00:00:00') : undefined}
              />

              <DateInput
                label="Data Final"
                value={endDate}
                onChange={setEndDate}
                placeholder="Fim"
                minDate={startDate ? new Date(startDate + 'T00:00:00') : undefined}
              />
            </div>

            {startDate && endDate && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <small className="text-gray-600 dark:text-gray-400">
                  Período selecionado:
                </small>
                <p className="font-medium text-gray-900 dark:text-white">
                  {startDate} até {endDate}
                </p>
              </div>
            )}

            <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
              <small className="text-gray-600 dark:text-gray-400 block mb-2">
                Código:
              </small>
              <pre className="text-xs text-gray-800 dark:text-gray-300 overflow-x-auto">
{`<div className="grid grid-cols-2 gap-4">
  <DateInput
    label="Data Inicial"
    value={startDate}
    onChange={setStartDate}
    maxDate={endDate ? new Date(endDate) : undefined}
  />
  
  <DateInput
    label="Data Final"
    value={endDate}
    onChange={setEndDate}
    minDate={startDate ? new Date(startDate) : undefined}
  />
</div>`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Props Disponíveis */}
        <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
          <CardHeader>
            <h3>Props Disponíveis</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Todas as opções de customização
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-gray-900 dark:text-white mb-2">
                  DateInput
                </h4>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                  <li><code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">label</code> - Texto do label</li>
                  <li><code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">value</code> - Data (YYYY-MM-DD)</li>
                  <li><code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">onChange</code> - Callback de mudança</li>
                  <li><code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">placeholder</code> - Texto quando vazio</li>
                  <li><code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">required</code> - Campo obrigatório</li>
                  <li><code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">disabled</code> - Desabilita input</li>
                  <li><code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">minDate</code> - Data mínima</li>
                  <li><code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">maxDate</code> - Data máxima</li>
                </ul>
              </div>

              <div>
                <h4 className="text-gray-900 dark:text-white mb-2">
                  MonthYearInput
                </h4>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                  <li><code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">label</code> - Texto do label</li>
                  <li><code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">value</code> - Mês/Ano (YYYY-MM)</li>
                  <li><code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">onChange</code> - Callback de mudança</li>
                  <li><code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">placeholder</code> - Texto quando vazio</li>
                  <li><code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">required</code> - Campo obrigatório</li>
                  <li><code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">disabled</code> - Desabilita input</li>
                  <li><code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">minYear</code> - Ano mínimo (padrão: 2020)</li>
                  <li><code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">maxYear</code> - Ano máximo (padrão: 2030)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
