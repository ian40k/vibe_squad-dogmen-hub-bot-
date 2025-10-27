'use client'
import { useState, useEffect } from 'react'
import '../styles/globals.css'

export default function Home() {
  const [step, setStep] = useState(1) // 1: Pairing, 2: QR, 3: Connected
  const [pairingCode, setPairingCode] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  const PAIRING_CODE = "DOGMEN"

  useEffect(() => {
    // Load connection status from localStorage
    const savedStatus = localStorage.getItem('whatsappConnected')
    if (savedStatus === 'true') {
      setIsConnected(true)
      setStep(3)
      setMessages([
        { type: 'bot', text: '✅ WhatsApp reconnected successfully!' },
        { type: 'bot', text: 'Type .menu for all commands' }
      ])
    }
  }, [])

  const handlePairing = () => {
    if (pairingCode.toUpperCase() === PAIRING_CODE) {
      setStep(2)
      // Simulate QR code generation
      setTimeout(() => {
        setStep(3)
        setIsConnected(true)
        localStorage.setItem('whatsappConnected', 'true')
        setMessages([
          { type: 'bot', text: '✅ WhatsApp connected successfully!' },
          { type: 'bot', text: '🤖 Welcome to WhatsApp Bot! Type commands starting with .' },
          { type: 'bot', text: 'Available commands: .movie .yt .gg .tt .ping .menu' }
        ])
      }, 3000)
    } else {
      alert('Invalid pairing code. Please enter DOGMEN')
    }
  }

  const processCommand = (command) => {
    const [cmd, ...args] = command.slice(1).split(' ')
    const query = args.join(' ')

    switch(cmd.toLowerCase()) {
      case 'movie':
        if (!query) return '🎬 Usage: .movie <query>\nExample: .movie avengers'
        return `🎬 Movie Search: "${query}"\n🔗 https://www.themoviedb.org/search?query=${encodeURIComponent(query)}`
      
      case 'yt':
        if (!query) return '📺 Usage: .yt <query>\nExample: .yt funny cats'
        return `📺 YouTube Search: "${query}"\n🔗 https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
      
      case 'gg':
        if (!query) return '🔍 Usage: .gg <query>\nExample: .gg weather today'
        return `🔍 Google Search: "${query}"\n🔗 https://www.google.com/search?q=${encodeURIComponent(query)}`
      
      case 'tt':
        if (!query) return '📱 Usage: .tt <query>\nExample: .tt dance tutorial'
        return `📱 TikTok Search: "${query}"\n🔗 https://www.tiktok.com/search?q=${encodeURIComponent(query)}`
      
      case 'ping':
        return `🏓 Bot is active!\n\n📢 WhatsApp Channel:\nhttps://whatsapp.com/channel/0029Vb71mgIElaglZCU0je0x\n\nType .menu for all commands`
      
      case 'menu':
        return `🤖 BOT MENU 🤖\n\n🎬 .movie <query> - Search movies\n📺 .yt <query> - Search YouTube\n🔍 .gg <query> - Search Google\n📱 .tt <query> - Search TikTok\n🏓 .ping - Bot status\n📖 .menu - Show this menu`
      
      default:
        return '❌ Unknown command. Type .menu for available commands.'
    }
  }

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage = { type: 'user', text: input }
    setMessages(prev => [...prev, userMessage])

    // Process command if it starts with .
    if (input.startsWith('.')) {
      const response = processCommand(input)
      const botMessage = { type: 'bot', text: response }
      setTimeout(() => {
        setMessages(prev => [...prev, botMessage])
      }, 1000)
    } else {
      const botMessage = { type: 'bot', text: '💡 Type commands starting with . (dot)\nTry .menu for all commands' }
      setTimeout(() => {
        setMessages(prev => [...prev, botMessage])
      }, 1000)
    }

    setInput('')
  }

  const quickCommands = [
    { cmd: '.movie avengers', label: '🎬 Movie' },
    { cmd: '.yt funny cats', label: '📺 YouTube' },
    { cmd: '.gg weather today', label: '🔍 Google' },
    { cmd: '.tt dance tutorial', label: '📱 TikTok' },
    { cmd: '.ping', label: '🏓 Status' },
    { cmd: '.menu', label: '📖 Menu' }
  ]

  const disconnectBot = () => {
    setIsConnected(false)
    setStep(1)
    setMessages([])
    localStorage.removeItem('whatsappConnected')
  }

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="header-info">
          <div className="avatar">🤖</div>
          <div>
            <h1>WhatsApp Bot</h1>
            <p>{isConnected ? 'Online • Connected' : 'Offline • Pair with DOGMEN'}</p>
          </div>
        </div>
        {isConnected && (
          <button className="disconnect-btn" onClick={disconnectBot}>
            Disconnect
          </button>
        )}
      </header>

      {/* Pairing Screen */}
      {!isConnected && step === 1 && (
        <div className="pairing-screen">
          <div className="pairing-card">
            <div className="pairing-icon">🔐</div>
            <h2>Enter Pairing Code</h2>
            <p>To connect to WhatsApp Bot, enter the pairing code below</p>
            
            <div className="code-input-container">
              <input
                type="text"
                className="code-input"
                placeholder="DOGMEN"
                value={pairingCode}
                onChange={(e) => setPairingCode(e.target.value.toUpperCase())}
                maxLength={6}
              />
            </div>

            <button className="pair-btn" onClick={handlePairing}>
              Connect to WhatsApp
            </button>

            <div className="hint">
              💡 Pairing code: <strong>DOGMEN</strong>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Screen */}
      {!isConnected && step === 2 && (
        <div className="qr-screen">
          <div className="qr-card">
            <div className="qr-icon">📱</div>
            <h2>Scan QR Code</h2>
            <p>Open WhatsApp → Settings → Linked Devices → Scan QR Code</p>
            
            <div className="qr-placeholder">
              <div className="qr-simulator">
                <div className="qr-animation"></div>
                <p>Simulating QR Code...</p>
              </div>
            </div>

            <div className="loading-status">
              <div className="spinner"></div>
              <p>Waiting for connection...</p>
            </div>
          </div>
        </div>
      )}

      {/* Chat Interface */}
      {isConnected && (
        <>
          {/* Quick Commands */}
          <div className="quick-commands">
            <h3>Quick Commands:</h3>
            <div className="command-buttons">
              {quickCommands.map((quick, index) => (
                <button
                  key={index}
                  className="cmd-btn"
                  onClick={() => setInput(quick.cmd)}
                >
                  {quick.label}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="chat-container">
            <div className="messages">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.type}`}>
                  <div className="message-bubble">
                    {msg.text.split('\n').map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="input-area">
            <div className="input-container">
              <input
                type="text"
                placeholder="Type command starting with . (e.g., .movie avengers)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="message-input"
              />
              <button onClick={handleSendMessage} disabled={!input.trim()}>
                Send
              </button>
            </div>
          </div>

          {/* Channel Info */}
          <div className="channel-info">
            <h3>📢 Join My WhatsApp Channel</h3>
            <a 
              href="https://whatsapp.com/channel/0029Vb71mgIElaglZCU0je0x" 
              target="_blank" 
              rel="noopener noreferrer"
              className="channel-link"
            >
              Join Channel →
            </a>
          </div>
        </>
      )}
    </div>
  )
  }
