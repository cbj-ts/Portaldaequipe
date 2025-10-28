// Ícones personalizados com tema espacial para TradeStars

interface IconProps {
  className?: string;
}

export function RocketIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C12 2 8 4 6 8C4 12 3 16 3 18C3 19.1046 3.89543 20 5 20H7L9 22L10 18H14L15 22L17 20H19C20.1046 20 21 19.1046 21 18C21 16 20 12 18 8C16 4 12 2 12 2Z" fill="currentColor" opacity="0.2"/>
      <path d="M12 2C12 2 8 4 6 8C4 12 3 16 3 18C3 19.1046 3.89543 20 5 20H7L9 22L10 18H14L15 22L17 20H19C20.1046 20 21 19.1046 21 18C21 16 20 12 18 8C16 4 12 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="10" r="2" fill="currentColor"/>
      <path d="M7 13L5 15M17 13L19 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function StarburstIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L13.5 8.5L20 7L15 12L20 17L13.5 15.5L12 22L10.5 15.5L4 17L9 12L4 7L10.5 8.5L12 2Z" fill="currentColor" opacity="0.2"/>
      <path d="M12 2L13.5 8.5L20 7L15 12L20 17L13.5 15.5L12 22L10.5 15.5L4 17L9 12L4 7L10.5 8.5L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
    </svg>
  );
}

export function AstronautIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="5" fill="currentColor" opacity="0.2"/>
      <circle cx="12" cy="8" r="5" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="2"/>
      <path d="M7 12V13C7 16.866 9.13401 20 12 20C14.866 20 17 16.866 17 13V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M9 20L8 22M15 20L16 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M4 10L6 9M20 10L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function PlanetIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="7" fill="currentColor" opacity="0.2"/>
      <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="2"/>
      <ellipse cx="12" cy="12" rx="10" ry="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" transform="rotate(-20 12 12)"/>
      <circle cx="9" cy="10" r="1.5" fill="currentColor"/>
      <circle cx="15" cy="13" r="1" fill="currentColor"/>
    </svg>
  );
}

export function SatelliteIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" width="8" height="8" fill="currentColor" opacity="0.2" transform="rotate(-45 12 12)"/>
      <rect x="8" y="8" width="8" height="8" stroke="currentColor" strokeWidth="2" transform="rotate(-45 12 12)"/>
      <path d="M3 3L7 7M21 21L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M3 21L7 17M21 3L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
    </svg>
  );
}

export function CometIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="17" cy="7" r="3" fill="currentColor" opacity="0.2"/>
      <circle cx="17" cy="7" r="3" stroke="currentColor" strokeWidth="2"/>
      <path d="M15 9L3 21M13 8L5 16M14 11L6 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      <circle cx="17" cy="7" r="1.5" fill="currentColor"/>
    </svg>
  );
}

export function GalaxyIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C12 2 8 6 8 12C8 18 12 22 12 22C12 22 16 18 16 12C16 6 12 2 12 2Z" fill="currentColor" opacity="0.1"/>
      <path d="M2 12C2 12 6 8 12 8C18 8 22 12 22 12C22 12 18 16 12 16C6 16 2 12 2 12Z" fill="currentColor" opacity="0.1"/>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
      <ellipse cx="12" cy="12" rx="9" ry="4" stroke="currentColor" strokeWidth="2"/>
      <ellipse cx="12" cy="12" rx="4" ry="9" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
    </svg>
  );
}

export function TelescopeIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 21L8 16L16 8L21 3L16 8L8 16L3 21Z" fill="currentColor" opacity="0.2"/>
      <path d="M3 21L8 16M8 16L16 8M16 8L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="16" cy="8" r="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M11 19L13 21M6 14L8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function ConstellationIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 5L9 9M9 9L15 7M15 7L19 11M19 11L17 17M17 17L11 19M11 19L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
      <circle cx="5" cy="5" r="2" fill="currentColor"/>
      <circle cx="9" cy="9" r="2" fill="currentColor"/>
      <circle cx="15" cy="7" r="2" fill="currentColor"/>
      <circle cx="19" cy="11" r="2" fill="currentColor"/>
      <circle cx="17" cy="17" r="2" fill="currentColor"/>
      <circle cx="11" cy="19" r="2" fill="currentColor"/>
      <circle cx="5" cy="15" r="2" fill="currentColor"/>
    </svg>
  );
}

export function OrbitIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
      <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.2"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
      <circle cx="12" cy="3" r="1.5" fill="currentColor"/>
      <circle cx="21" cy="12" r="1.5" fill="currentColor"/>
      <circle cx="12" cy="21" r="1.5" fill="currentColor"/>
      <circle cx="3" cy="12" r="1.5" fill="currentColor"/>
    </svg>
  );
}

export function SpaceStationIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="9" y="9" width="6" height="6" fill="currentColor" opacity="0.2"/>
      <rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="2"/>
      <path d="M9 12H3M15 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 9V3M12 15V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="3" cy="12" r="1.5" fill="currentColor"/>
      <circle cx="21" cy="12" r="1.5" fill="currentColor"/>
      <circle cx="12" cy="3" r="1.5" fill="currentColor"/>
      <circle cx="12" cy="21" r="1.5" fill="currentColor"/>
    </svg>
  );
}

export function MeteorIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2L22 10L12 20L4 12L14 2Z" fill="currentColor" opacity="0.2"/>
      <path d="M14 2L22 10L12 20L4 12L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 20L4 18M2 16L5 13M4 22L6 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      <circle cx="12" cy="10" r="1.5" fill="currentColor"/>
    </svg>
  );
}

export function LaunchpadIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L10 10H14L12 2Z" fill="currentColor" opacity="0.2"/>
      <path d="M12 2L10 10H14L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
      <path d="M4 18H20M6 18V20H8V18M16 18V20H18V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 18L10 12M16 18L14 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
