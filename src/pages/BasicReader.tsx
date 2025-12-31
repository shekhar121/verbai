import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Play,
  Pause,
  FileText,
  Mic,
  Code,
  Braces
} from 'lucide-react'
import { Link } from 'react-router-dom'
import '../App.css'

function BasicReader() {
  const [text, setText] = useState<string>('')
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null)

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Load English voice
  useEffect(() => {
    const loadVoice = () => {
      const voices = speechSynthesis.getVoices()
      const englishVoice = voices.find(v => v.lang.startsWith('en'))
      if (englishVoice) {
        setVoice(englishVoice)
      }
    }

    loadVoice()
    speechSynthesis.onvoiceschanged = loadVoice

    return () => {
      speechSynthesis.cancel()
    }
  }, [])

  const speak = useCallback(() => {
    if (!text.trim()) return

    speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utteranceRef.current = utterance

    if (voice) {
      utterance.voice = voice
    }

    // Default settings
    utterance.rate = 1
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onend = () => {
      setIsPlaying(false)
      setIsPaused(false)
    }

    utterance.onerror = () => {
      setIsPlaying(false)
      setIsPaused(false)
    }

    speechSynthesis.speak(utterance)
    setIsPlaying(true)
    setIsPaused(false)
  }, [text, voice])

  const togglePlayPause = () => {
    if (!isPlaying && !isPaused) {
      speak()
    } else if (isPlaying && !isPaused) {
      speechSynthesis.pause()
      setIsPaused(true)
    } else if (isPaused) {
      speechSynthesis.resume()
      setIsPaused(false)
    }
  }

  const sampleTexts = {
    text: `Hello, this is a simple plain text example. VoiceFlow can read any text you paste here. Try it with articles, books, or any content you want to listen to.`,
    html: `<html>
  <head>
    <title>Sample Page</title>
  </head>
  <body>
    <h1>Welcome</h1>
    <p>This is a paragraph.</p>
    <a href="#">Click here</a>
  </body>
</html>`,
    json: `{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "skills": ["JavaScript", "React", "TypeScript"],
  "active": true
}`
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <Link to="/" className="logo">
          <div className="logo-icon">
            <Mic size={24} />
          </div>
          <span className="logo-text">VoiceFlow</span>
        </Link>
        <span className="header-badge">Basic Reader</span>
      </header>

      {/* Main Content */}
      <main className="main">
        {/* Text Input Section */}
        <section className="text-section">
          <div className="section-header">
            <div className="section-title">
              <FileText size={20} />
              <h2>Your Text</h2>
            </div>
            <button
              className="action-btn secondary"
              onClick={() => setText('')}
            >
              Clear
            </button>
          </div>

          <div className="textarea-container">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type the text you want to hear..."
              className="text-input"
            />
          </div>

          {/* Sample Texts */}
          <div className="sample-texts">
            <span className="sample-label">Try a sample:</span>
            <div className="sample-buttons">
              <button
                className="sample-btn"
                onClick={() => setText(sampleTexts.text)}
              >
                <FileText size={14} />
                Plain Text
              </button>
              <button
                className="sample-btn"
                onClick={() => setText(sampleTexts.html)}
              >
                <Code size={14} />
                HTML
              </button>
              <button
                className="sample-btn"
                onClick={() => setText(sampleTexts.json)}
              >
                <Braces size={14} />
                JSON
              </button>
            </div>
          </div>
        </section>

        {/* Player Controls */}
        <section className="player-section basic-player">
          <div className="controls">
            <button
              className="control-btn primary"
              onClick={togglePlayPause}
              disabled={!text.trim()}
            >
              {isPlaying && !isPaused ? (
                <Pause size={28} />
              ) : (
                <Play size={28} style={{ marginLeft: '3px' }} />
              )}
            </button>
          </div>
          <p className="player-hint">
            {!text.trim()
              ? 'Enter some text to start'
              : isPlaying && !isPaused
                ? 'Playing...'
                : isPaused
                  ? 'Paused'
                  : 'Press play to listen'}
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>Built with Web Speech API • Works best in Chrome & Edge</p>
      </footer>
    </div>
  )
}

export default BasicReader
