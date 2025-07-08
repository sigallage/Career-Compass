import React, { useState } from 'react';
import './InterviewQuestions.css';
import ParticlesBackground from '../ParticlesBackground';
import interviewImage from '../assets/interview.png';

function InterviewQuestions() {
  const [topic, setTopic] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: topic }) // Key changed to 'role' to match backend
      });

      const data = await res.json();
      setResponse(data.answer || 'No questions generated.');
    } catch (error) {
      console.error('❌ Error:', error);
      setResponse('Failed to connect to the server. Check the console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-wrapper">
      <ParticlesBackground />
      <div className="app-container">
        {/* Hero Section */}
        <div className="hero-section">
          <img 
            src={interviewImage} 
            alt="AI Interview Assistant" 
            className="hero-image"
          />
          <div className="hero-content">
            <h1 className="app-title">💬 AI Interview Assistant</h1>
            <p className="hero-subtitle">
              Get personalized technical interview questions for any role
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder="Enter job title (e.g., Frontend Developer)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="input animated-input"
            required
          />
          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Generating...' : '🎤 Ask AI'}
          </button>
        </form>

        {response && (
          <div className="result-container">
            <h3 className="result-title">🧠 AI Response:</h3>
            <pre className="ai-answer">{response}</pre> {/* 'pre' preserves formatting */}
          </div>
        )}
      </div>
    </div>
  );
}

export default InterviewQuestions;