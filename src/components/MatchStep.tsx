import React, { useMemo, useState } from 'react'
import { load, save, svgAvatarDataURL } from '../utils'

// Ordem-cânone para manter o grid estável (e validar respostas)
const ORDER = [
  'Alexandra-Costa',
  'Geovanna-Ferreira',
  'Henrique-Dias',
  'Karine-Stecker',
  'Nicolas-Yanase',
  'Pedro-Ferreira',
  'Rayssa-Miwa',
  'Sara-Santos',
  'Tatiana-Silva',
  'Vitoria-Barros'
] as const

type Key = typeof ORDER[number]
type Person = { key: Key; name: string; url: string }
type Assignments = Record<Key, string | null>
type Props = { onComplete: () => void }

// carrega todas as imagens da pasta (Vite 5+)
const files = import.meta.glob('../assets/people/*.{png,jpg,jpeg,webp,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const baseFromPath = (p: string) => {
  const filename = p.split('/').pop() || ''
  return filename.replace(/\.[^.]+$/, '') // sem extensão
}

const norm = (s: string) =>
  s
    .normalize('NFD')                  // separa acentos
    .replace(/\p{Diacritic}/gu, '')    // remove acentos
    .replace(/\s+/g, ' ')              // colapsa espaços
    .trim()
    .toLowerCase()

const displayFromKey = (key: string) => key.replace(/-/g, ' ')

// fallback se algum arquivo faltar
const hueFromKey = (key: string) => {
  let h = 0
  for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) % 360
  return h
}
const initialsFromName = (name: string) =>
  name.split(/\s+/).map(p => p[0]).slice(0, 2).join('').toUpperCase()

export default function MatchStep({ onComplete }: Props) {
  // monta a lista de pessoas na ordem desejada + URL
  const PEOPLE: Person[] = useMemo(() => {
    const urlByBase: Record<string, string> = {}
    for (const [path, url] of Object.entries(files)) {
      urlByBase[baseFromPath(path)] = url
    }
    return ORDER.map((key) => {
      const name = displayFromKey(key)
      const url = urlByBase[key] || svgAvatarDataURL(initialsFromName(name), hueFromKey(key)) // fallback
      return { key, name, url }
    })
  }, [])

  // shape inicial no localStorage com todas as chaves
  const EMPTY: Assignments = useMemo(
    () => ORDER.reduce((acc, k) => { acc[k] = null; return acc }, {} as Assignments),
    []
  )

  const [selectedName, setSelectedName] = useState<string | null>(null)
  const [assign, setAssign] = useState<Assignments>(() => {
    const loaded = load<Partial<Assignments>>('step2Assignments', EMPTY)
    return { ...EMPTY, ...loaded }
  })

  const setNameToPhoto = (photoKey: Key, name: string) => {
    const next = { ...assign, [photoKey]: name }
    setAssign(next)
    save('step2Assignments', next)
    // se o nome selecionado foi usado, limpa a seleção automaticamente
    if (selectedName === name) setSelectedName(null)
  }

  const clearPhoto = (photoKey: Key) => {
    const next = { ...assign, [photoKey]: null }
    setAssign(next)
    save('step2Assignments', next)
  }

  // completo e correto = cada foto casada exatamente com seu nome
  const emptyCount = ORDER.filter(k => !assign[k]).length
  const isAllAssigned = emptyCount === 0
  const isCorrect =
  isAllAssigned &&
  PEOPLE.every(p => assign[p.key] && norm(assign[p.key]!) === norm(p.name))


  const tryFinish = () => {
    if (isCorrect) {
      save('step2Done', true)
      onComplete()
    } else {
      alert('Ainda não está correto. Verifique as ligações.')
    }
  }

  const shuffledAllNames = useMemo(() => {
    const arr = PEOPLE.map(p => p.name)
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }, [])
  
  const used = new Set(
    Object.values(assign).filter(Boolean).map(n => norm(n as string))
  )
  const availableNames = shuffledAllNames.filter(n => !used.has(norm(n)))

  return (
    <div className="card">
      <h2>Passo 2 — Relacione nomes e fotos</h2>
      <p className="muted">
        Toque em um nome e depois toque na foto correspondente. Quando todos
        estiverem corretos, conclua.
      </p>

      <div className="match-grid">
        {PEOPLE.map((p) => (
          <div key={p.key} className="avatar-card">
            <div
              className="avatar"
              style={{ backgroundImage: `url('${p.url}')` }}
              aria-label={p.name}
            />
            <div className="slot">
              {assign[p.key] ? (
                <div className="row" style={{ justifyContent: 'space-between', width: '100%', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <strong>{assign[p.key]}</strong>
                  <button className="btn ghost" onClick={() => clearPhoto(p.key)}>Limpar</button>
                </div>
              ) : (
                <span>Aguardando nome…</span>
              )}
            </div>

            {!assign[p.key] && selectedName && (
              <button
                className="btn"
                style={{ marginTop: 8 }}
                onClick={() => setNameToPhoto(p.key, selectedName!)}
              >
                Usar “{selectedName}” aqui
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="names" aria-label="Lista de nomes" style={{ marginTop: 12 }}>
        {availableNames.map((name) => (
          <button
            key={name}
            className={`chip ${selectedName === name ? 'selected' : ''}`}
            onClick={() => setSelectedName(prev => (prev === name ? null : name))}
          >
            {name}
          </button>
        ))}
        {/* indicação quando todos os nomes foram usados */}
        {availableNames.length === 0 && <span className="muted">Todos os nomes já foram usados.</span>}
      </div>

      <div className="row" style={{ marginTop: 12 }}>
        <button className="btn" disabled={emptyCount > 0} onClick={tryFinish}>
          Concluir passo 2
        </button>
        {emptyCount > 0 && (
          <span className="muted">Falta(m) {emptyCount} atribuição(ões).</span>
        )}
        {!isCorrect && isAllAssigned && (
          <span className="muted">Há ligações incorretas.</span>
        )}
      </div>
    </div>
  )
}
