const P: Record<string, string> = {
  left: 'M15 6l-6 6 6 6',
  right: 'M9 6l6 6-6 6',
  back: 'M19 12H5m0 0l6-6m-6 6l6 6',
  map: 'M3 7h4v10H3zM10 7h4v10h-4zM17 7h4v10h-4z',
  soundOn: 'M4 10v4h4l5 4V6L8 10H4zm12-1.5a4 4 0 010 7M18.5 6a7.5 7.5 0 010 12',
  soundOff: 'M4 10v4h4l5 4V6L8 10H4zm12 0l5 5m0-5l-5 5',
  full: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
  present: 'M3 5h18v11H3zM8 20h8M12 16v4',
  snap: 'M5 4v7a7 7 0 0014 0V4h-4v7a3 3 0 01-6 0V4H5zM5 8h4M15 8h4',
  lock: 'M7 11V8a5 5 0 0110 0v3M5 11h14v9H5z',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  help: 'M9.5 9a2.5 2.5 0 115 .5c0 1.5-2.5 2-2.5 4M12 17.5v.01',
  close: 'M6 6l12 12M18 6L6 18',
  swatch: 'M12 3a9 9 0 100 18 9 9 0 000-18zm0 0v18',
  spark: 'M12 3v4m0 10v4M3 12h4m10 0h4M6 6l2.5 2.5m7 7L18 18M18 6l-2.5 2.5m-7 7L6 18',
  pin: 'M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0113 0c0 5.4-6.5 11-6.5 11zm0-8.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
  area: 'M4 4h16v16H4zM4 9h5V4M15 20v-5h5',
  bed: 'M3 18v-7a2 2 0 012-2h14a2 2 0 012 2v7M3 15h18M7 9V6h4v3M3 18v2M21 18v2',
  bath: 'M4 12h16v2a5 5 0 01-5 5H9a5 5 0 01-5-5v-2zM6 12V6a2 2 0 014 0M7 19l-1 2M17 19l1 2',
  car: 'M5 16V11l2-5h10l2 5v5M5 16h14M5 16v2M19 16v2M7.5 13h.01M16.5 13h.01',
  coin: 'M12 3a9 9 0 100 18 9 9 0 000-18zm2.5 6.5c-.4-.9-1.4-1.5-2.5-1.5-1.5 0-2.5.8-2.5 2s1.1 1.6 2.5 2 2.5.9 2.5 2-1 2-2.5 2c-1.1 0-2.1-.6-2.5-1.5M12 6.5V8m0 8v1.5',
  bolt: 'M13 3L5 13.5h6L10 21l8-10.5h-6L13 3z',
  shield: 'M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3zm-3 9l2 2 4-4',
  arrowRight: 'M5 12h14m0 0l-6-6m6 6l-6 6',
  play: 'M8 5.5v13l11-6.5-11-6.5z',
  pause: 'M8 5v14M16 5v14',
  route: 'M5 19a2 2 0 100-4 2 2 0 000 4zM19 9a2 2 0 100-4 2 2 0 000 4zM7 17h7a3 3 0 000-6h-4a3 3 0 010-6h7',
}

export function Icon({ name, size = 16, stroke = 1.4 }: { name: keyof typeof P | string; size?: number; stroke?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={P[name]} />
    </svg>
  )
}
