import React, { useState } from 'react';
import './JobPredictor.css';
import ParticlesBackground from '../ParticlesBackground';
import heroImage from '../assets/job-illustration.svg'; 

function JobPredictor() {
  const [skills, setSkills] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const skillsArray = skills
      .split(',')
      .map(skill => skill.trim())
      .filter(Boolean);

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills: skillsArray })
      });

      const data = await response.json();

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
        <img src={heroImage} alt="Job Prediction" className="hero-image" />
        <h1 className="app-title"> AI Job Role Predictor</h1>
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder="Enter your skills (e.g., React, Python, SQL)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="input animated-input"
          />
          <button type="submit" className="button"> Predict</button>
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
