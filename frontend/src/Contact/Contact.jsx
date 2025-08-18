import React, { useState } from "react";
import './Contact.css';

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
      const response = await fetch('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Contact form submitted successfully:', data);
        setSubmitted(true);
        setForm({ name: '', email: '', message: '' }); // Reset form
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to submit contact form');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      if (error.message.includes('fetch')) {
        setError('Unable to connect to server. Please check if the backend service is running.');
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
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
  );
};

export default Contact;