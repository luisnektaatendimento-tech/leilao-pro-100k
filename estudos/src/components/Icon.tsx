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
}

export function Icon({ name, size = 16, stroke = 1.4 }: { name: keyof typeof P | string; size?: number; stroke?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={P[name]} />
    </svg>
  )
}
