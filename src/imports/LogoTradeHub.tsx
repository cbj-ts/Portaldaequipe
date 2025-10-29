/**
 * ============================================================================
 * LOGO TRADEHUB
 * ============================================================================
 * 
 * Logo oficial da TradeHub importada do Figma
 * 
 * CORES:
 * - Modo claro: Preto (#000000)
 * - Modo escuro: Branco (#FFFFFF)
 * - Adapta automaticamente ao tema dark/light
 * 
 * USO:
 * <LogoTradeHub /> - Logo com cor adaptativa (preta/branca)
 * 
 * ============================================================================
 */

import svgPaths from "./svg-sjystmba7h";

export default function LogoTradeHub() {
  return (
    <div className="relative size-full [&_path]:fill-black dark:[&_path]:fill-white">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1043 167">
        <g clipPath="url(#clip0_221_47)" id="Group 1">
          <path d={svgPaths.p37f6be80} id="Vector" />
          <path d={svgPaths.p3b92f900} id="Vector_2" />
          <path d={svgPaths.p13572980} id="Vector_3" />
          <path d={svgPaths.p10ab5500} id="Vector_4" />
          <path d={svgPaths.p1e784980} id="Vector_5" />
          <path d={svgPaths.pd456bf0} id="Vector_6" />
          <path d={svgPaths.p2656e400} id="Vector_7" />
          <path d={svgPaths.p1e0846f2} id="Vector_8" />
          <path d={svgPaths.p2f7f6f0} id="Vector_9" />
        </g>
        <defs>
          <clipPath id="clip0_221_47">
            <rect fill="white" height="167" width="1043" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}
