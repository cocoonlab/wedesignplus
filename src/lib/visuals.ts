const EDITORIAL_PALETTES = [
  {
    accent: '#715574',
    outline: '#b39ab6',
    paper: '#faf9f7',
    secondary: '#1b6d24',
  },
  {
    accent: '#2f5d62',
    outline: '#93b5b9',
    paper: '#f8faf9',
    secondary: '#b2642f',
  },
  {
    accent: '#485273',
    outline: '#a5b0d6',
    paper: '#f6f7fb',
    secondary: '#1f7a8c',
  },
];

export function buildEditorialImage(seed: string, label: string) {
  const palette = EDITORIAL_PALETTES[hashSeed(seed) % EDITORIAL_PALETTES.length];
  const safeLabel = escapeSvgText(label);
  const safeSeed = escapeSvgText(seed.toUpperCase().slice(0, 18));

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" role="img" aria-label="${safeLabel}">
      <rect width="1200" height="800" fill="${palette.paper}" />
      <rect x="44" y="44" width="1112" height="712" rx="34" fill="none" stroke="${palette.outline}" stroke-width="2" stroke-opacity="0.35" />
      <rect x="92" y="104" width="260" height="18" rx="9" fill="${palette.outline}" fill-opacity="0.35" />
      <rect x="92" y="146" width="420" height="22" rx="11" fill="${palette.accent}" fill-opacity="0.16" />
      <path d="M92 564C232 428 356 372 470 372C602 372 694 482 822 482C934 482 1020 434 1108 320V682H92Z" fill="${palette.accent}" fill-opacity="0.10" />
      <path d="M92 602C228 522 350 486 468 486C602 486 712 554 830 554C944 554 1034 508 1108 446V682H92Z" fill="${palette.secondary}" fill-opacity="0.12" />
      <circle cx="908" cy="226" r="108" fill="${palette.accent}" fill-opacity="0.10" />
      <circle cx="980" cy="184" r="38" fill="${palette.secondary}" fill-opacity="0.16" />
      <rect x="92" y="640" width="148" height="20" rx="10" fill="${palette.secondary}" fill-opacity="0.22" />
      <text x="92" y="96" fill="${palette.accent}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="26" letter-spacing="6">WEDESIGN+</text>
      <text x="92" y="724" fill="#1c1917" font-family="ui-serif, Georgia, serif" font-size="58">${safeLabel}</text>
      <text x="92" y="760" fill="#57534e" font-family="ui-sans-serif, system-ui, sans-serif" font-size="18" letter-spacing="4">${safeSeed}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function hashSeed(seed: string) {
  let hash = 0;

  for (const character of seed) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }

  return hash;
}

function escapeSvgText(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
