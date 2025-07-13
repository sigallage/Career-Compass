import React from "react";
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer-glow">
            <div className="footer-content-glow">
                <nav className="footer-links-glow">
                    <a href="/job-predictor">Job Predictor</a>
                    <a href="/interview-questions">Interview Questions</a>
                    <a href="/contact">Contact</a>
                </nav>
                <div className="footer-socials">
                    <a href="https://github.com/sigallage" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.32 6.84 9.67.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.38 9.38 0 0 1 12 6.84c.85.004 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2z"/></svg>
                    </a>
                    <span className="footer-social-gap"></span>
                    <a href="https://www.linkedin.com/in/gethmi-goonewardena-688a2b332/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.88v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"/></svg>
                    </a>
                    <span className="footer-social-gap"></span>
                    <a href="https://x.com/OGooneward71032" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M24 4.56c-.89.39-1.84.65-2.84.77a4.93 4.93 0 0 0 2.16-2.72c-.95.56-2 .97-3.13 1.19a4.92 4.92 0 0 0-8.39 4.48c-4.09-.2-7.72-2.17-10.15-5.15-.45.77-.71 1.66-.71 2.61 0 1.8.92 3.39 2.32 4.32-.85-.03-1.65-.26-2.35-.65v.07c0 2.51 1.78 4.6 4.15 5.08-.43.12-.89.18-1.36.18-.33 0-.65-.03-.96-.09.65 2.03 2.54 3.51 4.77 3.55a9.87 9.87 0 0 1-6.1 2.1c-.4 0-.79-.02-1.18-.07a13.94 13.94 0 0 0 7.56 2.21c9.05 0 14-7.5 14-14 0-.21 0-.42-.02-.63.96-.7 1.8-1.56 2.46-2.54z"/></svg>
                    </a>
                </div>
                <p className="footer-copy">© {new Date().getFullYear()} Career Compass. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
