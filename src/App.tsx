
import React, { useCallback, useEffect, useState } from 'react'
import StepMap from './components/StepMap'
import PhotoStep from './components/PhotoStep'
import MatchStep from './components/MatchStep'
import PuzzleStep from './components/PuzzleStep'
import TicketOverlay from './components/TicketOverlay'
import { load, save } from './utils'

type Progress = {
  introDone: boolean
  step: 1 | 2 | 3 | 4 // 4 = finished
  step1Photo: string | null
  step2Done: boolean
  step3Done: boolean
}

const DEFAULT: Progress = {
  introDone: false,
  step: 1,
  step1Photo: null,
  step2Done: false,
  step3Done: false,
}

export default function App() {
  const [progress, setProgress] = useState<Progress>(() => {
    const loaded = load<Partial<Progress>>('progress', DEFAULT as any)
    return { ...DEFAULT, ...loaded }
  })

  useEffect(() => {
    const step1Photo = load<string | null>('step1Photo', null)
    const step2Done = load<boolean>('step2Done', false)
    const step3Done = load<boolean>('step3Done', false)

    setProgress(prev => {
      let step: Progress['step'] = prev.step
      if (step1Photo && prev.step < 2) step = 2
      if (step2Done && step < 3) step = 3
      if (step3Done) step = 4
      const next = { ...prev, step1Photo, step2Done, step3Done, step }
      save('progress', next)
      return next
    })
  }, [])

  useEffect(() => { save('progress', progress) }, [progress])

  const onStep1Complete = useCallback((photo: string) => {
    setProgress(prev => ({ ...prev, step1Photo: photo, step: 2 }))
    save('step1Photo', photo)
  }, [])

  const onStep2Complete = useCallback(() => {
    setProgress(prev => ({ ...prev, step2Done: true, step: 3 }))
    save('step2Done', true)
  }, [])

  const onStep3Complete = useCallback(() => {
    setProgress(prev => ({ ...prev, step3Done: true, step: 4 }))
    save('step3Done', true)
  }, [])

  const finished = progress.step === 4

  const startJourney = () => {
    setProgress(prev => ({ ...prev, introDone: true }))
  }

  const resetAll = () => {
    localStorage.removeItem('progress')
    localStorage.removeItem('step1Photo')
    localStorage.removeItem('step2Assignments')
    localStorage.removeItem('step2Done')
    localStorage.removeItem('step3Order')
    localStorage.removeItem('step3Done')
    setProgress(DEFAULT)
  }

  return (
    <div className="container">
      <header>
        <div className="title"><span className="dot"></span> Trilha de 3 Etapas</div>
      </header>

      {!progress.introDone && (
        <TicketOverlay
          title=""
          description="Os portões da nossa Fantástica Fábrica de Performance foram abertos novamente e estamos animados em ter você aqui! <br> Para garantir seu bilhete premiado e ter acesso às novidades, siga as etapas a seguir."
          ctaLabel="Iniciar jornada"
          onCta={startJourney}
        />
      )}

      {progress.introDone && (
        <StepMap
          step1Done={!!progress.step1Photo}
          step2Done={progress.step2Done}
          step3Done={progress.step3Done}
          currentStep={progress.step}
          onGoToStep={(s) => {
            const max = progress.step3Done ? 3 : progress.step2Done ? 2 : 1
            if (s <= max) setProgress(prev => ({ ...prev, step: s }))
          }}
        />
      )}

      {progress.introDone && progress.step === 1 && (
        <PhotoStep initialPhoto={progress.step1Photo} onComplete={onStep1Complete} />
      )}

      {progress.introDone && progress.step === 2 && (
        <MatchStep onComplete={onStep2Complete} />
      )}

      {progress.introDone && progress.step === 3 && (
        <PuzzleStep onComplete={onStep3Complete} />
      )}

      {finished && (
        <TicketOverlay
          title="Parabéns!!"
          description="Esse bilhete premiado te dá acesso à nossa segunda fase do Programa de Estágio. <br> Seja muito bem-vindo(a)." 
          surprise
        />
      )}
    </div>
  )
}
