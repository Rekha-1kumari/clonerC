import { useState } from 'react'
import axios from 'axios'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Brain, Activity, ShieldCheck, FileText } from 'lucide-react'
import './App.css'

function App() {
  const [inputText, setInputText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handlePredict = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // For local testing, ensure your FastAPI is running on port 8000
      const response = await axios.post('http://localhost:8000/predict', {
        input_text: inputText,
        model_used: 'distilbert'
      })
      setResult(response.data)
    } catch (error) {
      console.error('Error fetching prediction:', error)
      alert('Make sure the backend is running on http://localhost:8000')
    }
    setLoading(false)
  }

  return (
    <div className="app-container">
      <header className="header">
        <Brain className="logo-icon" size={40} />
        <h1>Explainable AI for Mental Health</h1>
        <p>A Transparent Approach to Clinical Sentiment Analysis</p>
      </header>

      <main className="main-content">
        <section className="input-section">
          <h2>Clinical Text Analysis</h2>
          <form onSubmit={handlePredict}>
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter patient statement or social media post here... (e.g., 'I have been feeling really sad and hopeless lately')"
              rows={5}
              required
            />
            <button type="submit" disabled={loading || !inputText}>
              {loading ? 'Analyzing...' : 'Analyze Text'}
            </button>
          </form>
        </section>

        {result && (
          <section className="results-section">
            <div className="classification-card">
              <Activity className="icon" size={30} />
              <div className="card-content">
                <h3>Prediction</h3>
                <h2 className={`label ${result.predicted_label.toLowerCase()}`}>
                  {result.predicted_label}
                </h2>
                <p>Confidence: {(result.confidence * 100).toFixed(1)}%</p>
              </div>
            </div>

            <div className="explanation-card">
              <div className="explanation-header">
                <ShieldCheck className="icon" size={24} />
                <h3>Explainability Layer ({result.explanation.method})</h3>
              </div>
              <p>The model focused heavily on the following terms to make its decision:</p>
              
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={result.explanation.features} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="word" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="importance" fill="#4f46e5" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <p>Built by Member C & D for the Final Project</p>
      </footer>
    </div>
  )
}

export default App
