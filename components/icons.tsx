// icons.tsx — set de iconos de línea (stroke, currentColor).

interface IconProps {
  name: string
  size?: number
  stroke?: number
  style?: React.CSSProperties
  className?: string
}

const ICON_PATHS: Record<string, string> = {
  // navegación
  home: '<path d="M3 10.5 12 4l9 6.5"/><path d="M5 9.5V20h14V9.5"/><path d="M9.5 20v-5h5v5"/>',
  chat: '<path d="M4 5.5h16v10H8l-4 3.5z"/><path d="M8 9h8M8 12h5"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4"/><path d="M12 8.5 13.4 11 16 12l-2.6 1L12 15.5 10.6 13 8 12l2.6-1z"/>',
  tools: '<path d="M14.5 6.5a3.5 3.5 0 0 1-4.9 4.2L5 15.3 8.7 19l4.6-4.6a3.5 3.5 0 0 0 4.2-4.9l-2 2-2-2z"/>',
  rocket: '<path d="M5.5 14.5c-1.5 1-2 4-2 4s3-.5 4-2"/><path d="M9 15l-3-3c1-4 4-7.5 9-8 .5 5-3.5 8-8 9z"/><circle cx="14" cy="10" r="1.4"/>',
  chart: '<path d="M4 20V4"/><path d="M4 20h16"/><rect x="7" y="11" width="3" height="6" rx="1"/><rect x="12.5" y="7" width="3" height="10" rx="1"/>',
  compass: '<circle cx="12" cy="12" r="8.5"/><path d="M14.8 9.2 13 13l-3.8 1.8L11 11z"/>',
  library: '<path d="M5 4h3v16H5zM10 4h3v16h-3z"/><path d="M16 5.2 18.6 4.6 21 19l-2.6.6z"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M12 3v2.5M12 18.5V21M21 12h-2.5M5.5 12H3M18 6l-1.8 1.8M7.8 16.2 6 18M18 18l-1.8-1.8M7.8 7.8 6 6"/>',
  // acciones
  send: '<path d="M5 12 20 5l-4 15-4-7z"/><path d="M9 13l3-1"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/>',
  mic: '<rect x="9.5" y="3.5" width="5" height="10" rx="2.5"/><path d="M6 11a6 6 0 0 0 12 0M12 17v3.5M9 20.5h6"/>',
  attach: '<path d="M19 11.5 12 18.5a4 4 0 0 1-5.6-5.6l7-7a2.6 2.6 0 0 1 3.7 3.7l-7 7a1.2 1.2 0 0 1-1.8-1.8L14.5 9"/>',
  arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  arrowLeft: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  arrowUp: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  arrowUpRight: '<path d="M7 17 17 7M9 7h8v8"/>',
  copy: '<rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>',
  refresh: '<path d="M4 12a8 8 0 0 1 13.7-5.6L20 8.5M20 4v4.5h-4.5"/><path d="M20 12a8 8 0 0 1-13.7 5.6L4 15.5M4 20v-4.5h4.5"/>',
  thumbUp: '<path d="M7 11v9H4v-9zM7 11l4-7a2 2 0 0 1 2 2v3h5a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 16.8 20H7z"/>',
  check: '<path d="M5 12.5 10 17.5 19.5 7"/>',
  checkCircle: '<circle cx="12" cy="12" r="8.5"/><path d="M8.5 12.2 11 14.7 15.7 9.5"/>',
  checkSquare: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 12.5 11 15.5 16 9.5"/>',
  lock: '<rect x="5" y="10.5" width="14" height="9.5" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
  bolt: '<path d="M13 3 5 13.5h6L10 21l8-10.5h-6z"/>',
  crown: '<path d="M4 8l3.5 3L12 5l4.5 6L20 8l-1.5 10H5.5z"/>',
  target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
  layers: '<path d="M12 4 21 9l-9 5-9-5z"/><path d="M3 14l9 5 9-5"/>',
  megaphone: '<path d="M4 10v4l3 .5V9.5zM7 14.5 18 19V5L7 9.5M18 9.5h2a2 2 0 0 1 0 4h-2"/>',
  scale: '<path d="M12 4v16M7 8h10"/><path d="M7 8 4.5 14h5zM17 8l-2.5 6h5z"/><path d="M3 20h18"/>',
  money: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v10M14.5 9.2c0-1.2-1.1-2-2.5-2s-2.5.8-2.5 2 1.1 1.8 2.5 1.8 2.5.7 2.5 1.9-1.1 2-2.5 2-2.5-.8-2.5-2"/>',
  bell: '<path d="M6 10a6 6 0 0 1 12 0c0 5 1.5 6 1.5 6h-15S6 15 6 10z"/><path d="M10 19a2 2 0 0 0 4 0"/>',
  flame: '<path d="M12 3c1 3.5 4.5 4.5 4.5 8.5a4.5 4.5 0 0 1-9 0c0-1.8 1-2.8 1.5-3.5.5 1 1.5 1.5 1.5 1.5C10 7 11 5 12 3z"/>',
  star: '<path d="m12 4 2.3 4.8 5.2.6-3.9 3.5 1 5.1L12 15.8 7.4 18.1l1-5.1L4.5 9.4l5.2-.6z"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 15.5h6M9 8.5h2"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  menuLeft: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  menuRight: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  chevronRight: '<path d="m9 6 6 6-6 6"/>',
  sliders: '<path d="M4 8h10M18 8h2M4 16h2M10 16h10"/><circle cx="16" cy="8" r="2"/><circle cx="8" cy="16" r="2"/>',
  filter: '<path d="M4 8h10M18 8h2M4 16h2M10 16h10"/><circle cx="16" cy="8" r="2"/><circle cx="8" cy="16" r="2"/>',
  trend: '<path d="M4 16 9.5 10.5 13 14l7-7"/><path d="M15 7h5v5"/>',
  users: '<circle cx="9" cy="8" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><path d="M16 5.5a3 3 0 0 1 0 5.5M16.5 14.5A5.5 5.5 0 0 1 20.5 19"/>',
  globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.3 2.5 14.7 0 17M12 3.5c-2.5 2.3-2.5 14.7 0 17"/>',
  edit: '<path d="M4 20v-3.5L15 5.5l3.5 3.5L7.5 20z"/><path d="M13 7.5 16.5 11"/>',
  trash: '<path d="M5 7h14M9 7V5h6v2M7 7l1 13h8l1-13"/>',
  more: '<circle cx="6" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="18" cy="12" r="1.4"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.5 5.5 7 7M17 17l1.5 1.5M18.5 5.5 17 7M7 17l-1.5 1.5"/>',
  logout: '<path d="M14 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8"/><path d="M16 12H9M16 12l-3-3M16 12l-3 3M20 12h-1"/>',
  mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="m4 7 8 6 8-6"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="M9.5 5.8A9 9 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a16 16 0 0 1-3 3.6M6.3 6.3A16 16 0 0 0 2.5 12S6 18.5 12 18.5a9 9 0 0 0 3.7-.8"/><path d="m10 10a2.8 2.8 0 0 0 4 4M3.5 3.5l17 17"/>',
  card: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3 9.5h18M6.5 14.5h4"/>',
  calendar: '<rect x="4" y="5" width="16" height="16" rx="2.5"/><path d="M4 9.5h16M8 3v4M16 3v4"/>',
  download: '<path d="M12 4v11M8 11l4 4 4-4M5 19h14"/>',
  upload: '<path d="M12 20V9M8 13l4-4 4 4M5 5h14"/>',
  image: '<rect x="3.5" y="5" width="17" height="14" rx="2.5"/><circle cx="9" cy="10" r="1.6"/><path d="m4 17 5-4 4 3 3-2 4 3"/>',
  file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/>',
  camera: '<path d="M4 8.5h3l1.5-2h7L17 8.5h3v10H4z"/><circle cx="12" cy="13" r="3.2"/>',
  user: '<circle cx="12" cy="8.5" r="3.7"/><path d="M5 20a7 7 0 0 1 14 0"/>',
  shield: '<path d="M12 3.5 19 6v5c0 5-3.5 8-7 9.5C8.5 19 5 16 5 11V6z"/><path d="M9 12l2 2 4-4"/>',
  pencil: '<path d="M4 20v-3.5L15 5.5l3.5 3.5L7.5 20z"/><path d="M13 7.5 16.5 11"/>',
  folder: '<path d="M3.5 7a2 2 0 0 1 2-2h3.5l2 2.5H19a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5.5a2 2 0 0 1-2-2z"/>',
  play: '<path d="M7 5v14l12-7z"/>',
  lightbulb: '<path d="M9 17h6M10 20.5h4"/><path d="M12 3a6 6 0 0 1 4 10.5c-.7.6-1 1.2-1 2h-6c0-.8-.3-1.4-1-2A6 6 0 0 1 12 3z"/>',
  briefcase: '<rect x="3.5" y="8" width="17" height="11" rx="2"/><path d="M8.5 8V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2M3.5 13h17"/>',
  zap: '<path d="M13 3 5 13.5h6L10 21l8-10.5h-6z"/>',
  pin: '<path d="M12 21s7-6.5 7-11a7 7 0 0 0-14 0c0 4.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  filePlus: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M12 11v6M9 14h6"/>',
  history: '<path d="M4 12a8 8 0 1 1 2.3 5.6"/><path d="M4 20v-4.5h4.5M12 8v4l3 2"/>',
  gift: '<rect x="4" y="9" width="16" height="11" rx="1.5"/><path d="M4 13h16M12 9v11M12 9S10.5 4 8 5s1 4 4 4S15.5 4 13 5"/>',
  infinity: '<path d="M7 9a3 3 0 1 0 0 6c2 0 3-3 5-3s4 3 5 3a3 3 0 1 0 0-6c-2 0-3 3-5 3s-3-3-5-3z"/>',
  // extra aliases
  code: '<path d="M7 8l-4 4 4 4M17 8l4 4-4 4M14 5l-4 14"/>',
  table: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>',
  list: '<path d="M9 7h11M9 12h11M9 17h11M5 7h.01M5 12h.01M5 17h.01"/>',
  share: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.3 13.2l7.4 4.3M15.7 6.5 8.3 10.8"/>',
  redo: '<path d="M20 4v4.5h-4.5M20 8.5A8 8 0 1 1 17.7 5.6"/>',
  undo: '<path d="M4 4v4.5h4.5M4 8.5A8 8 0 1 0 6.3 5.6"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.4l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/>',
  bookmark: '<path d="M19 20 12 15 5 20V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v16z"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7L11 5.5M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7L13 18.5"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 3a2 2 0 0 1-.4 2L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2-.5c1 .3 2 .6 3 .7a2 2 0 0 1 1.7 2z"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 8v.5M12 11v5"/>',
  warning: '<path d="M10.3 3.5l-8 14A1.7 1.7 0 0 0 3.7 20h16.6a1.7 1.7 0 0 0 1.4-2.5l-8-14a1.7 1.7 0 0 0-3 0z"/><path d="M12 9v4.5M12 16.5v.5"/>',
  success: '<circle cx="12" cy="12" r="8.5"/><path d="M8.5 12.2 11 14.7 15.7 9.5"/>',
  error: '<circle cx="12" cy="12" r="8.5"/><path d="M15 9l-6 6M9 9l6 6"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>',
  paperclip: '<path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
}

export function Icon({ name, size = 20, stroke = 1.6, className = '', style = {} }: IconProps) {
  const path = ICON_PATHS[name] || ''
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: path }}
    />
  )
}

export default Icon
