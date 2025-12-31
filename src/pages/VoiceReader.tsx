import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Settings,
  FileText,
  Mic,
  Sparkles
} from 'lucide-react'
import { Link } from 'react-router-dom'

interface Voice {
  voice: SpeechSynthesisVoice
  name: string
  lang: string
}

function VoiceReader() {
  const [text, setText] = useState<string>('')
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [voices, setVoices] = useState<Voice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string>('')
  const [rate, setRate] = useState<number>(1)
  const [pitch, setPitch] = useState<number>(1)
  const [volume, setVolume] = useState<number>(1)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [currentWord, setCurrentWord] = useState<string>('')
  const [showSettings, setShowSettings] = useState<boolean>(false)
  const [wordCount, setWordCount] = useState<number>(0)
  const [estimatedTime, setEstimatedTime] = useState<string>('0:00')

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const textRef = useRef<string>('')

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices()
      const voiceList: Voice[] = availableVoices.map((voice) => ({
        voice,
        name: voice.name,
        lang: voice.lang
      }))
      setVoices(voiceList)

      // Set default voice (prefer English voices)
      const englishVoice = voiceList.find(v => v.lang.startsWith('en'))
      if (englishVoice && !selectedVoice) {
        setSelectedVoice(englishVoice.name)
      }
    }

    loadVoices()
    speechSynthesis.onvoiceschanged = loadVoices

    return () => {
      speechSynthesis.cancel()
    }
  }, [selectedVoice])

  // Calculate word count and estimated time
  useEffect(() => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0)
    setWordCount(words.length)

    // Average reading speed at current rate
    const wordsPerMinute = 150 * rate
    const minutes = words.length / wordsPerMinute
    const mins = Math.floor(minutes)
    const secs = Math.round((minutes - mins) * 60)
    setEstimatedTime(`${mins}:${secs.toString().padStart(2, '0')}`)
  }, [text, rate])

  const speak = useCallback(() => {
    if (!text.trim()) return

    speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utteranceRef.current = utterance
    textRef.current = text

    // Set voice
    const voice = voices.find(v => v.name === selectedVoice)
    if (voice) {
      utterance.voice = voice.voice
    }

    // Set properties
    utterance.rate = rate
    utterance.pitch = pitch
    utterance.volume = isMuted ? 0 : volume

    // Track progress
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const word = text.substring(event.charIndex, event.charIndex + event.charLength)
        setCurrentWord(word)
        const progressPercent = (event.charIndex / text.length) * 100
        setProgress(progressPercent)
      }
    }

    utterance.onend = () => {
      setIsPlaying(false)
      setIsPaused(false)
      setProgress(100)
      setCurrentWord('')
      setTimeout(() => setProgress(0), 1000)
    }

    utterance.onerror = () => {
      setIsPlaying(false)
      setIsPaused(false)
      setProgress(0)
    }

    speechSynthesis.speak(utterance)
    setIsPlaying(true)
    setIsPaused(false)
  }, [text, voices, selectedVoice, rate, pitch, volume, isMuted])

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

  const stop = () => {
    speechSynthesis.cancel()
    setIsPlaying(false)
    setIsPaused(false)
    setProgress(0)
    setCurrentWord('')
  }

  const skipForward = () => {
    // Increase rate temporarily for skip effect
    const currentRate = rate
    setRate(Math.min(rate + 0.5, 2))
    setTimeout(() => setRate(currentRate), 100)
  }

  const skipBackward = () => {
    // Restart from beginning
    stop()
    setTimeout(() => speak(), 100)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (utteranceRef.current) {
      utteranceRef.current.volume = isMuted ? volume : 0
    }
  }

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText()
      setText(clipboardText)
    } catch (err) {
      console.error('Failed to read clipboard:', err)
    }
  }

  const sampleTexts = [
    "Welcome to VoiceFlow, your personal text-to-speech reader. Simply paste any text, article, or document, and let me read it aloud for you. Perfect for learning, accessibility, or multitasking.",
    "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once.",
    "In a world where technology continues to advance at an unprecedented pace, the way we consume information has fundamentally changed. Text-to-speech technology bridges the gap between written content and auditory learning."
  ]

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
        <div className="header-tagline">
          <Sparkles size={14} />
          <span>Listen to any text, anywhere</span>
        </div>
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
            <div className="text-actions">
              <button className="action-btn" onClick={handlePaste}>
                Paste from Clipboard
              </button>
              <button
                className="action-btn secondary"
                onClick={() => setText('')}
              >
                Clear
              </button>
            </div>
          </div>

          <div className="textarea-container">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type the text you want to hear..."
              className="text-input"
            />
            {currentWord && isPlaying && (
              <div className="current-word-highlight">
                Speaking: <span>{currentWord}</span>
              </div>
            )}
          </div>

          {/* Text Stats */}
          <div className="text-stats">
            <div className="stat">
              <span className="stat-value">{wordCount}</span>
              <span className="stat-label">words</span>
            </div>
            <div className="stat">
              <span className="stat-value">{estimatedTime}</span>
              <span className="stat-label">est. time</span>
            </div>
            <div className="stat">
              <span className="stat-value">{text.length}</span>
              <span className="stat-label">characters</span>
            </div>
          </div>

          {/* Sample Texts */}
          <div className="sample-texts">
            <span className="sample-label">Try a sample:</span>
            <div className="sample-buttons">
              {sampleTexts.map((sample, index) => (
                <button
                  key={index}
                  className="sample-btn"
                  onClick={() => setText(sample)}
                >
                  Sample {index + 1}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Player Controls */}
        <section className="player-section">
          {/* Progress Bar */}
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            />
            <div
              className="progress-indicator"
              style={{ left: `${progress}%` }}
            />
          </div>

          {/* Main Controls */}
          <div className="controls">
            <button
              className="control-btn secondary"
              onClick={skipBackward}
              disabled={!text.trim()}
              title="Restart"
            >
              <SkipBack size={20} />
            </button>

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

            <button
              className="control-btn secondary"
              onClick={stop}
              disabled={!isPlaying && !isPaused}
              title="Stop"
            >
              <Square size={18} />
            </button>

            <button
              className="control-btn secondary"
              onClick={skipForward}
              disabled={!isPlaying}
              title="Speed Boost"
            >
              <SkipForward size={20} />
            </button>
          </div>

          {/* Volume & Settings */}
          <div className="secondary-controls">
            <div className="volume-control">
              <button className="icon-btn" onClick={toggleMute}>
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value))
                  if (isMuted) setIsMuted(false)
                }}
                className="slider volume-slider"
              />
            </div>

            <button
              className={`icon-btn settings-btn ${showSettings ? 'active' : ''}`}
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings size={18} />
            </button>
          </div>
        </section>

        {/* Settings Panel */}
        {showSettings && (
          <section className="settings-section">
            <h3>Settings</h3>

            {/* Voice Selection */}
            <div className="setting-group">
              <label>Voice</label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="voice-select"
              >
                {voices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>

            {/* Speed Control */}
            <div className="setting-group">
              <label>Speed: {rate}x</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="slider"
              />
              <div className="slider-labels">
                <span>0.5x</span>
                <span>1x</span>
                <span>2x</span>
              </div>
            </div>

            {/* Pitch Control */}
            <div className="setting-group">
              <label>Pitch: {pitch}</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="slider"
              />
              <div className="slider-labels">
                <span>Low</span>
                <span>Normal</span>
                <span>High</span>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>Built with Web Speech API • Works best in Chrome & Edge</p>
      </footer>
    </div>
  )
}

export default VoiceReader

