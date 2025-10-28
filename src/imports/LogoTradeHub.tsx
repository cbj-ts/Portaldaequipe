/**
 * ============================================================================
 * LOGO TRADEHUB
 * ============================================================================
 * 
 * Logo oficial da TradeHub importada do Figma
 * 
 * CORES:
 * - Por padrão: #0B0C0C (preto)
 * - Personalizável via CSS variable: --fill-0
 * 
 * USO:
 * <LogoTradeHub /> - Logo preta padrão
 * 
 * Com cor customizada:
 * <div style={{ '--fill-0': 'white' } as React.CSSProperties}>
 *   <LogoTradeHub />
 * </div>
 * 
 * ============================================================================
 */

import svgPaths from "./svg-sjystmba7h";

export default function LogoTradeHub() {
  return (
    <div className="relative size-full">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1043 167">
        <g clipPath="url(#clip0_221_47)" id="Group 1">
          <path d={svgPaths.p37f6be80} fill="var(--fill-0, #0B0C0C)" id="Vector" />
          <path d={svgPaths.p3b92f900} fill="var(--fill-0, #0B0C0C)" id="Vector_2" />
          <path d={svgPaths.p13572980} fill="var(--fill-0, #0B0C0C)" id="Vector_3" />
          <path d={svgPaths.p10ab5500} fill="var(--fill-0, #0B0C0C)" id="Vector_4" />
          <path d={svgPaths.p1e784980} fill="var(--fill-0, #0B0C0C)" id="Vector_5" />
          <path d={svgPaths.pd456bf0} fill="var(--fill-0, #0B0C0C)" id="Vector_6" />
          <path d={svgPaths.p2656e400} fill="var(--fill-0, #0B0C0C)" id="Vector_7" />
          <path d={svgPaths.p1e0846f2} fill="var(--fill-0, #0B0C0C)" id="Vector_8" />
          <path d={svgPaths.p2f7f6f0} fill="var(--fill-0, #0B0C0C)" id="Vector_9" />
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
