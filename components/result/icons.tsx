import React from 'react';
import { ElementType } from '../../types';

// Outlined natural-image icons for the ten stems / twelve branches.
// Salvaged unchanged from the original chart display — pure SVG, no theming.
export const ElementIcon: React.FC<{ type: string } & React.SVGProps<SVGSVGElement>> = ({ type, className, ...props }) => {
  const iconProps = {
    className: className || 'w-5 h-5',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    ...props,
  };

  switch (type) {
    case 'tree':
      return (
        <svg {...iconProps}>
          <path d="M12 3L16 9H14L18 15H15L19 21H5L9 15H6L10 9H8L12 3Z" strokeLinejoin="round" />
          <path d="M12 21V23" />
        </svg>
      );
    case 'sprout':
      return (
        <svg {...iconProps}>
          <path d="M12 22V12" />
          <path d="M12 12C12 12 6 10 6 6C6 3 9 2 12 6" />
          <path d="M12 12C12 12 18 10 18 6C18 3 15 2 12 6" />
        </svg>
      );
    case 'sun':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="5" />
          <path d="M12 2V4" /><path d="M12 20V22" />
          <path d="M4.93 4.93L6.34 6.34" /><path d="M17.66 17.66L19.07 19.07" />
          <path d="M2 12H4" /><path d="M20 12H22" />
          <path d="M4.93 19.07L6.34 17.66" /><path d="M17.66 6.34L19.07 4.93" />
        </svg>
      );
    case 'lantern':
      return (
        <svg {...iconProps}>
          <path d="M6 14 H18 V20 A2 2 0 0 1 16 22 H8 A2 2 0 0 1 6 20 Z" />
          <path d="M12 2C12 2 15 6 15 9C15 10.66 13.66 12 12 12C10.34 12 9 10.66 9 9C9 6 12 2 12 2Z" />
          <path d="M12 14V12" />
        </svg>
      );
    case 'rock':
      return (
        <svg {...iconProps}>
          <path d="M3 20H21" />
          <path d="M3 20L8 10L12 16L16 6L21 20" />
        </svg>
      );
    case 'field':
      return (
        <svg {...iconProps}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <line x1="12" y1="4" x2="12" y2="20" />
          <line x1="4" y1="12" x2="20" y2="12" />
        </svg>
      );
    case 'sword':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="20" r="1.5" />
          <path d="M12 18.5V15" />
          <path d="M8 15H16" />
          <path d="M9 15L10.5 5L12 2L13.5 5L15 15" strokeLinejoin="miter" />
          <path d="M12 15V7" opacity="0.5" />
        </svg>
      );
    case 'gem':
      return (
        <svg {...iconProps}>
          <circle cx="6" cy="8" r="2" /><circle cx="4" cy="13" r="2" /><circle cx="6" cy="18" r="2" />
          <circle cx="12" cy="20" r="2" /><circle cx="18" cy="18" r="2" /><circle cx="20" cy="13" r="2" /><circle cx="18" cy="8" r="2" />
        </svg>
      );
    case 'river':
      return (
        <svg {...iconProps}>
          <path d="M2 6C4 6 5 8 7 8C9 8 10 6 12 6C14 6 15 8 17 8C19 8 20 6 22 6" />
          <path d="M2 12C4 12 5 14 7 14C9 14 10 12 12 12C14 12 15 14 17 14C19 14 20 12 22 12" />
          <path d="M2 18C4 18 5 20 7 20C9 20 10 18 12 18C14 18 15 20 17 20C19 20 20 18 22 18" />
        </svg>
      );
    case 'rain':
      return (
        <svg {...iconProps}>
          <path d="M12 2C12 2 10 5 10 7C10 8.1 10.9 9 12 9C13.1 9 14 8.1 14 7C14 5 12 2 12 2Z" />
          <path d="M7 12C7 12 5 15 5 17C5 18.1 5.9 19 7 19C8.1 19 9 18.1 9 17C9 15 7 12 7 12Z" />
          <path d="M17 12C17 12 15 15 15 17C15 18.1 15.9 19 17 19C18.1 19 19 18.1 19 17C19 15 17 12 17 12Z" />
        </svg>
      );
    default:
      return null;
  }
};

export const ElementGlyph: React.FC<{ type: ElementType; className?: string }> = ({ type, className }) => {
  switch (type) {
    case ElementType.WOOD:
      return (
        <svg viewBox="0 0 100 100" className={className || 'w-12 h-12 stroke-wood fill-none'}>
          <line x1="50" y1="10" x2="50" y2="90" strokeWidth="4" />
          <line x1="30" y1="30" x2="70" y2="30" strokeWidth="2" opacity="0.5" />
          <line x1="20" y1="50" x2="80" y2="50" strokeWidth="2" opacity="0.3" />
        </svg>
      );
    case ElementType.FIRE:
      return (
        <svg viewBox="0 0 100 100" className={className || 'w-12 h-12 stroke-fire fill-none'}>
          <path d="M50 10L90 90H10L50 10Z" strokeWidth="4" />
          <circle cx="50" cy="55" r="15" strokeWidth="2" opacity="0.5" />
        </svg>
      );
    case ElementType.EARTH:
      return (
        <svg viewBox="0 0 100 100" className={className || 'w-12 h-12 stroke-earth fill-none'}>
          <rect x="20" y="20" width="60" height="60" strokeWidth="4" />
          <rect x="35" y="35" width="30" height="30" strokeWidth="2" opacity="0.5" />
        </svg>
      );
    case ElementType.METAL:
      return (
        <svg viewBox="0 0 100 100" className={className || 'w-12 h-12 stroke-metal fill-none'}>
          <circle cx="50" cy="50" r="40" strokeWidth="4" />
          <circle cx="50" cy="50" r="25" strokeWidth="2" opacity="0.6" />
          <circle cx="50" cy="50" r="10" strokeWidth="1" opacity="0.3" />
        </svg>
      );
    case ElementType.WATER:
      return (
        <svg viewBox="0 0 100 100" className={className || 'w-12 h-12 stroke-water fill-none'}>
          <path d="M10 50 Q30 20 50 50 T90 50" strokeWidth="4" />
          <path d="M10 70 Q30 40 50 70 T90 70" strokeWidth="2" opacity="0.5" />
        </svg>
      );
    default:
      return null;
  }
};

// Plain-English nature label for each of the five elements.
export const ELEMENT_NATURE: Record<ElementType, { label: string; note: string }> = {
  [ElementType.WOOD]: { label: 'Growth', note: 'reaching, expanding, becoming' },
  [ElementType.FIRE]: { label: 'Warmth', note: 'light, expression, vitality' },
  [ElementType.EARTH]: { label: 'Ground', note: 'stability, holding, belonging' },
  [ElementType.METAL]: { label: 'Structure', note: 'clarity, edges, decisions' },
  [ElementType.WATER]: { label: 'Flow', note: 'feeling, depth, movement' },
};
