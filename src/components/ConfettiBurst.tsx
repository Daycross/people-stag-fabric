import React, { useMemo } from 'react'

type Piece = { id: number; dx: number; dy: number; rot: number; delay: number; dur: number; color: string; size: number }
type Props = { count?: number; colors?: string[]; speed?: number }

/** Confete controlável por "speed" (1 = padrão, >1 = mais devagar) */
export default function ConfettiBurst({
  count = 120,
  colors = ['#FFD166','#EF476F','#06D6A0','#118AB2','#F7B801'],
  speed = 2.5, // <- confete mais devagar por padrão
}: Props) {
  const pieces: Piece[] = useMemo(() => {
    const arr: Piece[] = []
    const s = speed
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const dist = 80 + Math.random() * 220
      arr.push({
        id: i,
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist,
        rot: (Math.random() * 720 - 360),
        delay: Math.random() * 180 * s,        // antes ~0–120ms → agora mais espaçado
        dur: (1100 + Math.random() * 1400) * s, // antes ~700–1500ms → agora ~2750–6250ms c/ speed=2.5
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 6 + Math.floor(Math.random() * 7),
      })
    }
    return arr
  }, [count, colors, speed])

  return (
    <div className="confetti-burst" aria-hidden="true">
      {pieces.map(p => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            // @ts-ignore CSS vars
            '--dx': `${p.dx}px`,
            '--dy': `${p.dy}px`,
            '--rot': `${p.rot}deg`,
            '--delay': `${p.delay}ms`,
            '--dur': `${p.dur}ms`,
            background: p.color,
            width: p.size,
            height: p.size * (0.6 + Math.random()*0.8),
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}
