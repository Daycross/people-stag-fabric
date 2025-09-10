
import React from 'react'

type Props = {
  step1Done: boolean
  step2Done: boolean
  step3Done: boolean
  currentStep: 1 | 2 | 3 | 4
  onGoToStep?: (s: 1 | 2 | 3) => void
}

export default function StepMap({ step1Done, step2Done, step3Done, currentStep, onGoToStep }: Props) {
  const maxUnlocked: 1 | 2 | 3 = (step3Done ? 3 : step2Done ? 2 : 1)
  const canGo = (s: 1 | 2 | 3) => s <= maxUnlocked

  const status = (idx: 1|2|3) => {
    if ((idx === 1 && step1Done) || (idx === 2 && step2Done) || (idx === 3 && step3Done))
      return 'checkpoint done'
    if (currentStep === idx) return 'checkpoint active'
    return 'checkpoint'
  }

  const handleClick = (s: 1 | 2 | 3) => {
    if (!onGoToStep) return
    if (canGo(s)) onGoToStep(s)
  }

  return (
    <div className="map-card" aria-label="Progresso do mapa">
      <svg className="map-svg" viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <mask id="cut">
            <rect x="0" y="0" width="400" height="120" fill="white" />
            <circle cx="30" cy="60" r="28" fill="black" />
            <circle cx="200" cy="60" r="28" fill="black" />
            <circle cx="370" cy="60" r="28" fill="black" />
          </mask>
        </defs>
        <path className="map-path" mask="url(#cut)"
          d="M 30 80 C 110 10, 170 110, 210 70 S 320 25, 370 60" />
        <g className="map-x" transform="translate(360,60) rotate(-10)">
          <line x1="-8" y1="-8" x2="8" y2="8" />
          <line x1="-8" y1="8"  x2="8" y2="-8" />
        </g>
      </svg>

      <div className="checkpoint-row">
        <button type="button" className={status(1) + (canGo(1) ? ' clickable' : ' disabled')} onClick={() => handleClick(1)}>1</button>
        <button type="button" className={status(2) + (canGo(2) ? ' clickable' : ' disabled')} onClick={() => handleClick(2)}>2</button>
        <button type="button" className={status(3) + (canGo(3) ? ' clickable' : ' disabled')} onClick={() => handleClick(3)}>3</button>
      </div>
    </div>
  )
}
