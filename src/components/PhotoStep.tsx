
import React, { useRef, useState } from 'react'
import { save } from '../utils'

type Props = {
  initialPhoto?: string | null
  onComplete: (photoDataURL: string) => void
}

export default function PhotoStep({ initialPhoto, onComplete }: Props) {
  const [open, setOpen] = useState(false)
  const [preview, setPreview] = useState<string | null>(initialPhoto ?? null)
  const inputRef = useRef<HTMLInputElement>(null)

  const onPick = () => inputRef.current?.click()
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPreview(String(reader.result))
    reader.readAsDataURL(file)
  }

  const confirm = () => {
    if (!preview) return
    save('step1Photo', preview)
    onComplete(preview)
    setOpen(false)
  }

  return (
    <div className="card">
      <h2>Passo 1 — Envie uma foto</h2>
      <p className="muted">Toque no botão abaixo para enviar uma foto. Após confirmar, o passo será concluído.</p>
      <div className="row" style={{marginTop: 10}}>
        <button className="btn" onClick={() => setOpen(true)}>Enviar foto</button>
        {preview && <button className="btn ghost" onClick={() => setOpen(true)}>Ver/alterar</button>}
      </div>

      {open && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Envio de foto">
          <div className="modal">
            <header>
              <strong>Upload da foto</strong>
              <button className="btn secondary" onClick={() => setOpen(false)}>Fechar</button>
            </header>
            <div className="body">
              <div className="preview" style={{marginTop: 10}}>
                {preview ? <img src={preview} alt="Pré-visualização" /> : <span className="muted">Sem imagem</span>}
              </div>
              <input ref={inputRef} type="file" accept="image/*" style={{display: 'none'}} onChange={onFile} />
              <div className="row" style={{marginTop: 12}}>
                <button className="btn secondary" onClick={onPick}>Selecionar foto</button>
                <button className="btn" disabled={!preview} onClick={confirm}>Confirmar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
