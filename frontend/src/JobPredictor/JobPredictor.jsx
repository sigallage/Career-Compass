import React, { useState } from 'react';
import './JobPredictor.css';
import ParticlesBackground from '../ParticlesBackground';
import heroImage from '../assets/interview.png'; 

function JobPredictor() {
  const [skills, setSkills] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const skillsArray = skills
      .split(',')
      .map(skill => skill.trim())
      .filter(Boolean);

    // Validate minimum skills requirement
    if (skillsArray.length < 3) {
      setResult({
        predicted_role: null,
        message: 'Please enter at least 3 skills for accurate predictions.',
        suggested_skills: []
      });
      return;
    }

    console.log('Sending skills:', skillsArray);
    console.log('Making request to: http://localhost:5001/predict');

    try {
      const response = await fetch('http://localhost:5001/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills: skillsArray })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (!data || !data.predicted_role || !Array.isArray(data.suggested_skills)) {
        setResult({
          predicted_role: null,
          message: data?.message || 'No prediction available.',
          suggested_skills: []
        });
        return;
      }

      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setResult({
        predicted_role: null,
        message: 'Something went wrong. Please try again.',
        suggested_skills: []
      });
    }
  };

  return (
    <div className="app-wrapper">
      <ParticlesBackground />
      <div className="app-container">
        {/* Hero Section */}
        <div className="hero-section">
          <img 
            src={heroImage} 
            alt="AI Job Role Predictor" 
            className="hero-image"
          />
          <div className="hero-content">
            <h1 className="app-title">🎯 AI Job Role Predictor</h1>
            <p className="hero-subtitle">
              Discover your ideal career path based on your skills
            </p>
          </div>
        </div>

        <p className="instruction-text">
          💡 Enter at least 3 skills separated by commas for better predictions
        </p>

        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder="Enter your skills (e.g., React, Python, SQL)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="input animated-input"
            required
          />
          <button type="submit" className="button">🔮 Predict Role</button>
        </form>

        {result && (
          <div className="result-container">
            <h3 className="result-title">🎯 Predicted Role:</h3>
            <p className="predicted-role">{result.predicted_role || "None"}</p>
            <p className="message">{result.message}</p>
            <h4 className="suggested-title">💡 Suggested Missing Skills:</h4>
            {Array.isArray(result.suggested_skills) && result.suggested_skills.length > 0 ? (
              <ul className="skills-list">
                {result.suggested_skills.map((skill, index) => (
                  <li key={index} className="skill-item">{skill}</li>
                ))}
              </ul>
            ) : (
              <p className="no-skills">No suggested skills available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default JobPredictor;
