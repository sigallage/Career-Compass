import React, { useState } from "react";
import './Contact.css';
import ParticlesBackground from '../ParticlesBackground';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Prefer environment variable, fallback to default backend port 3001
  const API_BASE = import.meta.env.VITE_API_BASE_URL; // optional
  const url = API_BASE ? `${API_BASE}/api/contact` : '/api/contact';
  console.log('Submitting contact form to:', url);
  const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const text = await response.text();
      let json;
      try {
        json = text ? JSON.parse(text) : {};
      } catch (parseErr) {
        console.warn('Non-JSON response from contact endpoint:', text);
        if (response.ok) {
          json = { success: true };
        } else {
          throw new Error('Invalid JSON returned from server');
        }
      }

      if (response.ok) {
        console.log('Contact form submitted successfully:', json);
        setSubmitted(true);
        setForm({ name: '', email: '', message: '' }); // Reset form
      } else {
        setError(json.error || `Failed to submit contact form (status ${response.status})`);
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
  if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
        setError('Unable to connect to server. Please check if the backend service is running.');
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ParticlesBackground />
      <div className="contact-container">
        <h2 className="contact-title">Contact Us</h2>
        <p className="contact-desc">Have questions, feedback, or want to collaborate? Fill out the form below and we'll get back to you soon!</p>
        
        {error && (
          <div className="contact-error" style={{
            color: '#ff6b6b',
            background: '#ff6b6b33',
            borderRadius: '8px',
            padding: '18px 10px',
            fontSize: '1.1rem',
            marginBottom: '18px',
            boxShadow: '0 0 8px #ff6b6b55'
          }}>
            {error}
          </div>
        )}
        
        {submitted ? (
          <div className="contact-success">
            Thank you for reaching out! We'll respond as soon as possible.
            <button 
              onClick={() => { setSubmitted(false); setError(''); }} 
              style={{
                background: 'transparent',
                border: '1px solid #ffd700',
                color: '#ffd700',
                padding: '8px 16px',
                borderRadius: '6px',
                marginTop: '12px',
                cursor: 'pointer',
                display: 'block',
                margin: '12px auto 0'
              }}
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <button type="submit" className="contact-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default Contact;