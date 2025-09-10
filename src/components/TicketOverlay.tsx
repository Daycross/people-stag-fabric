
import React from 'react'

import ConfettiBurst from './ConfettiBurst'

type Props = {
  title: string
  description?: string
  ctaLabel?: string
  onCta?: () => void
  secondaryLabel?: string
  onSecondary?: () => void
  surprise?: boolean
}

export default function TicketOverlay({ title, description, ctaLabel, onCta, secondaryLabel, onSecondary, surprise }: Props) {
  return (
    <div className="overlay-backdrop" role="dialog" aria-modal="true">
      <div className="ticket pop-in">
        {surprise && <ConfettiBurst speed={2.5} />}
        <div className="ticket-inner">
          <h1 className="ticket-title">{title}</h1>
          {description && <p className="ticket-desc" dangerouslySetInnerHTML={{__html: description}}></p>}
          <div className="ticket-actions">
            {ctaLabel && <button className="btn black" onClick={onCta}>{ctaLabel}</button>}
            {secondaryLabel && <button className="btn secondary" onClick={onSecondary}>{secondaryLabel}</button>}
          </div>
        </div>
      </div>
    </div>
  )
}
