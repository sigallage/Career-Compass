import React from "react";
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer-glow">
            <div className="footer-content-glow">
                <span className="footer-title">Career Compass</span>
                <nav className="footer-links-glow">
                    <a href="/job-predictor">Job Predictor</a>
                    <a href="/interview-questions">Interview Questions</a>
                    <a href="/about">About</a>
                    <a href="/contact">Contact</a>
                </nav>
                <p className="footer-copy">© {new Date().getFullYear()} Career Compass. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
