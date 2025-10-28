import React, { useState } from 'react'

const API =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:4000/api/message' : '/api/message')

export default function App() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Bem-vindo ao NeonChat. Digite uma mensagem para começar.' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const send = async () => {
    if (!input.trim()) return
    const userMsg = { from: 'user', text: input }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text }),
      })
      const body = await res.json()
      setMessages((m) => [...m, { from: 'bot', text: body.reply || 'Sem resposta' }])
    } catch (err) {
      setMessages((m) => [...m, { from: 'bot', text: 'Erro: não foi possível alcançar o bot' }])
    } finally {
      setLoading(false)
    }
  }

  const onKey = (e) => {
    if (e.key === 'Enter') send()
  }

  return (
    <div className="app">
      <header className="header">NEONCHAT</header>
      <div className="chat">
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.from}`}>
            {m.text}
          </div>
        ))}
      </div>
      <div className="composer">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          placeholder="Digite sua mensagem..."
          aria-label="input-mensagem"
        />
        <button onClick={send} disabled={loading} aria-label="botao-enviar">{loading ? '...' : 'Enviar'}</button>
      </div>
    </div>
  )
}
