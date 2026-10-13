// Decorative, low-contrast Istanbul scene for the header background:
// contour lines, the Bosphorus, a suspension bridge, the Galata Tower,
// and a mosque skyline. It is purely decorative: hidden from screen readers
// and from the mouse. preserveAspectRatio "slice" fills the header at any width.
export default function IstanbulSkyline() {
  const fill = '#e4f0f8'
  const stroke = '#d3e2ee'

  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 1440 96"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      {/* Topographic contour lines */}
      <g fill="none" stroke="#dce5ed" strokeWidth="1" opacity="0.8">
        <path d="M0 26 C200 6 420 48 660 26 S1100 4 1440 30" />
        <path d="M0 40 C220 22 430 60 670 40 S1110 18 1440 44" />
        <path d="M0 54 C240 38 440 72 680 54 S1120 34 1440 58" />
      </g>

      {/* Bosphorus Bridge: two towers, deck, and main cables */}
      <g fill={fill} stroke={stroke} strokeWidth="1.5">
        <rect x="217" y="20" width="7" height="76" />
        <rect x="417" y="20" width="7" height="76" />
        <rect x="213" y="38" width="15" height="3" />
        <rect x="413" y="38" width="15" height="3" />
      </g>
      <g fill="none" stroke={stroke} strokeWidth="1.5">
        <path d="M110 66 H530" strokeWidth="3" />
        <path d="M110 66 Q165 66 220 22 Q320 74 420 22 Q475 66 530 66" />
      </g>

      {/* Galata Tower */}
      <g fill={fill} stroke={stroke} strokeWidth="1">
        <rect x="849" y="44" width="22" height="52" />
        <rect x="844" y="39" width="32" height="6" />
        <rect x="850" y="27" width="20" height="12" />
        <path d="M847 27 L860 5 L873 27 Z" />
      </g>

      {/* Mosque skyline: main dome, semi-domes, and pencil minarets */}
      <g fill={fill} stroke={stroke} strokeWidth="1">
        <path d="M1118 96 V70 A42 42 0 0 1 1202 70 V96 Z" />
        <path d="M1083 96 V82 A24 24 0 0 1 1131 82 V96 Z" />
        <path d="M1189 96 V82 A24 24 0 0 1 1237 82 V96 Z" />
        <path d="M1160 28 V16" fill="none" />
        <rect x="1068" y="32" width="5" height="64" />
        <path d="M1065 32 L1070.5 16 L1076 32 Z" />
        <rect x="1247" y="32" width="5" height="64" />
        <path d="M1244 32 L1249.5 16 L1255 32 Z" />
        <path d="M1318 96 V82 A20 20 0 0 1 1358 82 V96 Z" />
        <rect x="1372" y="44" width="4" height="52" />
        <path d="M1369.5 44 L1374 30 L1378.5 44 Z" />
      </g>

      {/* Bosphorus water */}
      <g fill="none" stroke={stroke} strokeWidth="1.5">
        <path d="M0 86 Q60 80 120 86 T240 86 T360 86 T480 86 T600 86 T720 86 T840 86 T960 86 T1080 86 T1200 86 T1320 86 T1440 86" />
        <path d="M0 92 Q60 87 120 92 T240 92 T360 92 T480 92 T600 92 T720 92 T840 92 T960 92 T1080 92 T1200 92 T1320 92 T1440 92" />
      </g>
    </svg>
  )
}