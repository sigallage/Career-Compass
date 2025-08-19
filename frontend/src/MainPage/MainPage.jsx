import React from 'react';
import './MainPage.css';
import analyzer from './analyzer.jpg';
import howItWorks from './how it works.jpg';
import wallpaper from './wallpaper.jpg';
import { Link } from 'react-router-dom';

const MainPage = () => {
  return (
    <div className="main-page">

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Find Your Perfect Career Path</h1>
          <p>AI-powered recommendations based on your skills and interests.</p>

          {/* Blurry Card */}
          <div className="hero-card">
            <div className="hero-description">
              <p>
                Welcome to Career Pilot - your personalized guide to discovering the right career path.<br></br> 
                Leveraging AI-driven insights, we match your skills, interests, and qualifications with<br></br> 
                opportunities that fit you best. 
                Explore, plan, and take confident steps toward a<br></br> fulfilling professional journey.
              </p>
            </div>
          </div>
          <br></br>

          <div className="hero-buttons">
            <Link to="/signup" className="btn primary">Get Started</Link>
            <Link to="/faq" className="btn secondary">Read More</Link>
          </div>

      </div>
    </section>

    <section className="wallpaper">
      <section className="card-section">
        <div className="card card-flex">
          <div className="card-text">
            <h2>How It Works</h2>
            <div className="steps">
              <div className="step">1. Enter your skills, marks, or interests.</div>
              <div className="step">2. Get recommended career paths.</div>
              <div className="step">3. View demand, salaries, and required skills.</div>
            </div>
          </div>
          <div className="card-image">
            <img src={howItWorks} alt="How it works illustration" />
          </div>
        </div>
      </section>


      {/* Why Career Compass */}
    <section className="card-section">
        <div className="card card-flex">
          <div className="card-text">
            <h2>Why Career Compass?</h2>
            <ul>
              <li>📊 Data-driven decisions using real job board data</li>
              <li>🧠 Smart AI-based recommendations</li>
              <li>💼 Dashboard to track in-demand roles and salaries</li>
              <li>🌍 Personalized based on your input and goals</li>
            </ul>
          </div>
          <div className="card-image">
            <img src={analyzer} alt="Why Career Compass illustration" />
          </div>
            </div>
      </section>
    </section>  

      {/* Join Section */}
      <section className="join">
        <h2>Ready to discover your path?</h2>
        <div className="join-buttons">
          <a href="/recommendations" className="btn primary">Start Now</a>
        </div>
      </section>

    </div>
  );
};

export default MainPage;
  