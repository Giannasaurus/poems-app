import { useState, useRef, useEffect } from 'react'

// Uses free Web Audio API to synthesize ambient sound — no external files needed
function createRainNode(ctx) {
  const bufferSize = 4096
  const node = ctx.createScriptProcessor(bufferSize, 1, 1)
  node.onaudioprocess = (e) => {
    const out = e.outputBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      out[i] = (Math.random() * 2 - 1) * 0.12
    }
  }
  // Low-pass filter to make it sound like rain
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 600
  node.connect(filter)
  return { source: node, output: filter }
}

function createFireNode(ctx) {
  const bufferSize = 4096
  const node = ctx.createScriptProcessor(bufferSize, 1, 1)
  let phase = 0
  node.onaudioprocess = (e) => {
    const out = e.outputBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      phase += 0.003
      out[i] = (Math.random() * 2 - 1) * 0.07 * (0.6 + 0.4 * Math.sin(phase))
    }
  }
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 300
  filter.Q.value = 0.5
  node.connect(filter)
  return { source: node, output: filter }
}

const MODES = [
  { id: 'off',      label: '—',   title: 'Silence' },
  { id: 'rain',     label: '🌧',  title: 'Rain' },
  { id: 'fire',     label: '🔥',  title: 'Fireplace' },
]

export default function AmbientPlayer() {
  const [mode, setMode] = useState('off')
  const ctxRef = useRef(null)
  const nodesRef = useRef({ source: null, output: null })

  const stop = () => {
    try {
      nodesRef.current.source?.disconnect()
      nodesRef.current.output?.disconnect()
    } catch { /* silent */ }
    nodesRef.current = { source: null, output: null }
  }

  useEffect(() => {
    stop()
    if (mode === 'off') return

    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    const ctx = ctxRef.current
    if (ctx.state === 'suspended') ctx.resume()

    const { source, output } = mode === 'rain'
      ? createRainNode(ctx)
      : createFireNode(ctx)

    const gain = ctx.createGain()
    gain.gain.value = 0.5
    output.connect(gain)
    gain.connect(ctx.destination)
    nodesRef.current = { source, output: gain }

    return stop
  }, [mode])

  // Cleanup on unmount
  useEffect(() => () => { stop(); ctxRef.current?.close() }, [])

  return (
    <div className="ambient-player" aria-label="Ambient sound">
      {MODES.map(m => (
        <button
          key={m.id}
          className={`ambient-btn ${mode === m.id ? 'active' : ''}`}
          onClick={() => setMode(m.id)}
          title={m.title}
          aria-label={m.title}
          aria-pressed={mode === m.id}
        >
          {m.label}
        </button>
      ))}
    </div>
  )
}
