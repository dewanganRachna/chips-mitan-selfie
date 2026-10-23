import React from 'react';

/**
 * CHiPS Vector Emblem & Typography
 * Reusable emblem matching the CHiPS branding and the symbol on Mitan's shirt.
 */
export function ChipsEmblem({ size = 48, className = '' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="chipsGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fdf0b9" />
          <stop offset="50%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#9a7413" />
        </linearGradient>
        <radialGradient id="chipsInnerBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#145a32" />
          <stop offset="100%" stopColor="#0a3219" />
        </radialGradient>
      </defs>
      
      {/* Outer Golden Medallion */}
      <circle cx="50" cy="50" r="48" fill="url(#chipsGoldGrad)" stroke="#fdf0b9" strokeWidth="1.5" />
      
      {/* Inner Emerald Circle */}
      <circle cx="50" cy="50" r="41" fill="url(#chipsInnerBg)" stroke="#8f711e" strokeWidth="1" />
      
      {/* CHiPS Circuit Gateway - Symbol identical to Mitan's Shirt */}
      <path 
        d="M26 62 V38 H40 L50 28 L60 38 H74 V62 H62 V54 H38 V62 H26 Z" 
        stroke="url(#chipsGoldGrad)" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
      {/* 3 Rising Digital Nodes */}
      <line x1="36" y1="54" x2="36" y2="44" stroke="#fdf0b9" strokeWidth="3" strokeLinecap="round" />
      <circle cx="36" cy="42" r="3" fill="#fdf0b9" />

      <line x1="50" y1="54" x2="50" y2="35" stroke="#fdf0b9" strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="33" r="3.5" fill="#fdf0b9" />

      <line x1="64" y1="54" x2="64" y2="44" stroke="#fdf0b9" strokeWidth="3" strokeLinecap="round" />
      <circle cx="64" cy="42" r="3" fill="#fdf0b9" />
    </svg>
  );
}

export function ChipsBrandBadge() {
  return (
    <div className="chips-brand-badge">
      <ChipsEmblem size={44} />
      <div className="chips-brand-text">
        <span className="chips-hindi-sub">छत्तीसगढ़ इन्फोटेक प्रमोशन सोसाइटी</span>
        <span className="chips-brand-name">CHiPS <span className="chips-brand-sub">• Chhattisgarh</span></span>
      </div>
    </div>
  );
}
