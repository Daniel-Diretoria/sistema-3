import React from 'react'

interface PromoEmblemProps {
  className?: string
  size?: number
}

export const PromoEmblem: React.FC<PromoEmblemProps> = ({ className = '', size = 56 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Emblema da Diretoria de Promoções"
      role="img"
    >
      <defs>
        <linearGradient id="emblemGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5D77F" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#AA820A" />
        </linearGradient>
        <linearGradient id="shieldBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0A3C74" />
          <stop offset="100%" stopColor="#001F42" />
        </linearGradient>
      </defs>

      {/* Outer shield outline */}
      <path
        d="M32 4L52 11V29C52 43 43.5 54 32 59C20.5 54 12 43 12 29V11L32 4Z"
        fill="url(#shieldBg)"
        stroke="url(#emblemGold)"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Inner thin decorative contour */}
      <path
        d="M32 8L48 13.5V28C48 39.5 41 48.5 32 53C23 48.5 16 39.5 16 28V13.5L32 8Z"
        stroke="url(#emblemGold)"
        strokeWidth="0.8"
        strokeOpacity="0.4"
        fill="none"
      />

      {/* Central Star of Promotion / Merit */}
      <path
        d="M32 17L35.2 24.3L43 25L37.2 30.2L38.9 38L32 33.9L25.1 38L26.8 30.2L21 25L28.8 24.3L32 17Z"
        fill="url(#emblemGold)"
      />

      {/* Double chevron / stripes of advancement/promotion */}
      <path
        d="M24 43L32 38.5L40 43"
        stroke="url(#emblemGold)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M26 47L32 43L38 47"
        stroke="url(#emblemGold)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.85"
      />
    </svg>
  )
}
