import { useEffect, useRef } from 'react'

export default function ParticleCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    let particles = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Spawn particles (floating ink dots / letters)
    const CHARS = ['✦', '·', '∘', '◦', '✧', '⋆']
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        char: CHARS[Math.floor(Math.random() * CHARS.length)],
        size: Math.random() * 10 + 6,
        opacity: Math.random() * 0.25 + 0.05,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -(Math.random() * 0.25 + 0.05),
        drift: Math.random() * Math.PI * 2,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.drift += 0.008
        p.x += p.vx + Math.sin(p.drift) * 0.12
        p.y += p.vy
        if (p.y < -20) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width }
        if (p.x < -20) p.x = canvas.width + 10
        if (p.x > canvas.width + 20) p.x = -10

        ctx.save()
        ctx.globalAlpha = p.opacity
        ctx.fillStyle = '#c9a84c'
        ctx.font = `${p.size}px serif`
        ctx.fillText(p.char, p.x, p.y)
        ctx.restore()
      })
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} id="particle-canvas" aria-hidden="true" />
}
