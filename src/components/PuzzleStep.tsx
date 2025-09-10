
import React, { useEffect, useMemo, useState } from 'react'
import { load, save } from '../utils'
import puzzleImgURL from '../assets/puzzle.png'

type Props = {
  onComplete: () => void
}

const N = 4 // 4x4
const ZOOM = 1.5 // ajuste se necessário (>= 1) para evitar fundos pretos

function shuffledIndices(): number[] {
  const arr = Array.from({length: N*N}, (_,i) => i)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function isSolved(order: number[]) {
  return order.every((v, i) => v === i)
}

export default function PuzzleStep({ onComplete }: Props) {
  const [order, setOrder] = useState<number[]>(() => load<number[]>('step3Order', []))
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const bg = useMemo(() => puzzleImgURL, [])

  useEffect(() => {
    if (order.length === 0) {
      const initial = shuffledIndices()
      setOrder(initial)
      save('step3Order', initial)
    }
  }, [])

  useEffect(() => {
    if (order.length && isSolved(order)) {
      save('step3Done', true)
      onComplete()
    }
  }, [order, onComplete])

  const onTilePointerDown = (i: number, e: React.PointerEvent<HTMLButtonElement>) => {
    setDragIdx(i)
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onContainerPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragIdx === null) return
    const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
    const tileEl = el?.closest('[data-tile="1"]') as HTMLElement | null
    if (tileEl && tileEl.dataset.index) {
      const idx = Number(tileEl.dataset.index)
      if (!Number.isNaN(idx)) setHoverIdx(idx)
    }
  }

  const onContainerPointerUp = () => {
    if (dragIdx !== null && hoverIdx !== null && dragIdx !== hoverIdx) {
      const next = order.slice()
      ;[next[dragIdx], next[hoverIdx]] = [next[hoverIdx], next[dragIdx]]
      setOrder(next)
      save('step3Order', next)
    }
    setDragIdx(null)
    setHoverIdx(null)
  }

  const shuffle = () => {
    const next = shuffledIndices()
    setOrder(next)
    save('step3Order', next)
    setDragIdx(null)
    setHoverIdx(null)
  }

  return (
    <div className="card">
      <h2>Passo 3 — Quebra-cabeça 4×4</h2>
      <p className="muted">Arraste uma peça por cima de outra e solte para trocá-las. Complete a imagem para finalizar.</p>

      <div
        className="puzzle"
        role="grid"
        aria-label="Quebra-cabeça 4x4"
        onPointerMove={onContainerPointerMove}
        onPointerUp={onContainerPointerUp}
      >
        {order.map((tileIndex, i) => {
          const row = Math.floor(tileIndex / N)
          const col = tileIndex % N
          const offset = ((ZOOM - 1) / (2 * ZOOM)) * 100
          const posX = (col / (N - 1)) * (100 / ZOOM) + offset
          const posY = (row / (N - 1)) * (100 / ZOOM) + offset
          const dragging = dragIdx === i
          const selected = hoverIdx === i && dragIdx !== null && hoverIdx !== dragIdx
          return (
            <button
              key={i}
              data-tile="1"
              data-index={i}
              type="button"
              role="gridcell"
              aria-label={`Peça ${i+1}`}
              className={`tile ${dragging ? 'dragging' : ''} ${selected ? 'selected' : ''}`}
              style={{
                backgroundImage: `url('${bg}')`,
                backgroundSize: `${N * 100 * ZOOM}% ${N * 100 * ZOOM}%`,
                backgroundPosition: `${posX}% ${posY}%`,
                backgroundRepeat: 'no-repeat',
              }}
              onPointerDown={(e) => onTilePointerDown(i, e)}
            />
          )
        })}
      </div>

      <div className="row" style={{marginTop: 12, justifyContent: 'space-between'}}>
        <button className="btn secondary" onClick={shuffle}>Embaralhar</button>
      </div>
    </div>
  )
}
