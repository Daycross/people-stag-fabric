
export const save = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value))
}
export const load = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}
export function svgAvatarDataURL(initials: string, hue: number) {
  const bg = `hsl(${hue}, 70%, 45%)`
  const svg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='${bg}' />
          <stop offset='100%' stop-color='hsl(${(hue+40)%360}, 70%, 35%)' />
        </linearGradient>
      </defs>
      <rect width='200' height='200' rx='24' fill='url(#g)' />
      <text x='50%' y='54%' dominant-baseline='middle' text-anchor='middle'
            font-family='Inter, system-ui, Arial' font-size='88' fill='white' font-weight='800'>
        ${initials}
      </text>
    </svg>`
  )
  return `data:image/svg+xml,${svg}`
}
