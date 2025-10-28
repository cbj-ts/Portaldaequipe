/**
 * ============================================================================
 * SETORES - Estrutura Organizacional
 * ============================================================================
 * 
 * ESTRUTURA:
 * 1. Header (h1 + descrição)
 * 2. Grid de cards de setores (1/2/3 colunas)
 * 3. Cada card tem: ícone espacial + sigla + nome + descrição + áreas
 * 
 * ÍCONES ESPACIAIS POR SETOR:
 * - RH: Astronauta
 * - Tecnologia (TEI): Cometa
 * - BI: Telescópio
 * - Financeiro: Planeta
 * - Comunicação: Constelação
 * - Vendas: Foguete
 * - Outros: Satélite, Starburst, etc.
 * 
 * RESPONSIVIDADE:
 * - Mobile: 1 coluna
 * - Tablet (md): 2 colunas
 * - Desktop (lg): 3 colunas
 * - Gap: 24px (gap-6)
 * 
 * ============================================================================
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  AstronautIcon, 
  RocketIcon, 
  TelescopeIcon, 
  PlanetIcon, 
  StarburstIcon,
  CometIcon,
  SatelliteIcon,
  ConstellationIcon
} from './SpaceIcons';
import { SETORES, SETOR_ICONS } from '../types/setores';

export function SetoresPage() {
  // Mapeamento de ícones
  const iconMap: Record<string, any> = {
    'astronaut': AstronautIcon,
    'rocket': RocketIcon,
    'telescope': TelescopeIcon,
    'planet': PlanetIcon,
    'starburst': StarburstIcon,
    'comet': CometIcon,
    'satellite': SatelliteIcon,
    'constellation': ConstellationIcon,
    'meteor': SatelliteIcon, // fallback
    'scroll': SatelliteIcon, // fallback
    'radar': TelescopeIcon, // fallback
    'galaxy': StarburstIcon, // fallback
    'nebula': ConstellationIcon, // fallback
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 dark:text-white mb-2">Conheça os Setores</h1>
        <p className="text-gray-600 dark:text-gray-400">Estrutura organizacional da TradeStars</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SETORES.map((setor) => {
          const iconKey = SETOR_ICONS[setor.id] || 'satellite';
          const Icon = iconMap[iconKey];
          
          return (
            <Card key={setor.id} className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="p-3 rounded-lg transition-all duration-300 group-hover:scale-110" 
                    style={{ backgroundColor: `${setor.cor}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: setor.cor }} />
                  </div>
                  <Badge 
                    className="text-white border-0"
                    style={{ backgroundColor: setor.cor }}
                  >
                    {setor.sigla}
                  </Badge>
                </div>
                <CardTitle className="text-gray-900 dark:text-white">{setor.nome}</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  {setor.descricao}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <small className="uppercase tracking-wider text-gray-500 dark:text-gray-400">Áreas de atuação:</small>
                  <div className="flex flex-wrap gap-2">
                    {setor.areas.map((area, areaIndex) => (
                      <span
                        key={areaIndex}
                        className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 p-[6px] text-[8px]"
                      >
                        <span className="text-meta text-gray-700 dark:text-gray-300 text-[10px]">{area}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
