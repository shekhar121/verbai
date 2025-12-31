import { Link } from 'react-router-dom'
import {
  Mic,
  Headphones,
  BookOpen,
  Zap,
  Globe,
  Volume2,
  ArrowRight,
  Sparkles,
  Play
} from 'lucide-react'
import './Home.css'

function Home() {
  const features = [
    {
      icon: <Headphones size={28} />,
      title: 'Listen Anywhere',
      description: 'Convert any text to natural-sounding speech and listen on the go'
    },
    {
      icon: <Zap size={28} />,
      title: 'Adjustable Speed',
      description: 'Control playback speed from 0.5x to 2x to match your preference'
    },
    {
      icon: <Globe size={28} />,
      title: 'Multiple Voices',
      description: 'Choose from various system voices in different languages'
    },
    {
      icon: <Volume2 size={28} />,
      title: 'Full Control',
      description: 'Play, pause, stop, and adjust pitch and volume as needed'
    }
  ]

  const useCases = [
    {
      icon: <BookOpen size={24} />,
      title: 'Students',
      description: 'Listen to textbooks and study materials while commuting'
    },
    {
      icon: <Sparkles size={24} />,
      title: 'Professionals',
      description: 'Review documents and emails hands-free'
    },
    {
      icon: <Headphones size={24} />,
      title: 'Accessibility',
      description: 'Make content accessible for visual impairments'
    }
  ]

  return (
    <div className="home">
      {/* Header */}
      <header className="home-header">
        <Link to="/" className="logo">
          <div className="logo-icon">
            <Mic size={24} />
          </div>
          <span className="logo-text">VoiceFlow</span>
        </Link>
        <Link to="/voice" className="nav-cta">
          Open App
          <ArrowRight size={16} />
        </Link>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-badge">
          <Sparkles size={14} />
          <span>Free Text-to-Speech</span>
        </div>
        <h1 className="hero-title">
          Transform Text Into
          <span className="gradient-text"> Natural Speech</span>
        </h1>
        <p className="hero-subtitle">
          Listen to articles, documents, and any text content with our powerful
          text-to-speech reader. Perfect for learning, accessibility, and multitasking.
        </p>
        <div className="hero-actions">
          <Link to="/voice" className="btn-primary">
            <Play size={20} />
            Start Listening
          </Link>
          <a href="#features" className="btn-secondary">
            Learn More
          </a>
        </div>

        {/* Hero Visual */}
        <div className="hero-visual">
          <div className="audio-wave">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="wave-bar"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  height: `${20 + Math.sin(i * 0.8) * 30}px`
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="section-label">Features</div>
        <h2 className="section-title">Everything you need to listen</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="use-cases">
        <div className="section-label">Use Cases</div>
        <h2 className="section-title">Who uses VoiceFlow?</h2>
        <div className="use-cases-grid">
          {useCases.map((useCase, index) => (
            <div key={index} className="use-case-card">
              <div className="use-case-icon">{useCase.icon}</div>
              <div className="use-case-content">
                <h3>{useCase.title}</h3>
                <p>{useCase.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to start listening?</h2>
          <p>No sign-up required. Just paste your text and press play.</p>
          <Link to="/voice" className="btn-primary large">
            <Mic size={22} />
            Try VoiceFlow Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo">
              <div className="logo-icon small">
                <Mic size={18} />
              </div>
              <span className="logo-text">VoiceFlow</span>
            </div>
            <p>Free text-to-speech reader powered by Web Speech API</p>
          </div>
          <div className="footer-links">
            <Link to="/voice">Voice Reader</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>Built with React & TypeScript • Works best in Chrome & Edge</p>
        </div>
      </footer>
    </div>
  )
}

export default Home

