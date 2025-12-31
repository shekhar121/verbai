import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import VoiceReader from './pages/VoiceReader'
import BasicReader from './pages/BasicReader'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/voice" element={<VoiceReader />} />
        <Route path="/basic-reader" element={<BasicReader />} />
      </Routes>
    </Router>
  )
}

export default App
