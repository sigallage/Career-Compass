import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { useEffect } from "react";
import JobPredictor from "./JobPredictor/JobPredictor.jsx";
import MainPage from './MainPage/MainPage.jsx';
import InterviewQuestions from './InterviewQuestions/InterviewQuestions.jsx';
import Contact from './Contact/Contact.jsx';
import FAQ from './faq/faq.jsx';
import Header from './Header/Header.jsx';
import Footer from './Footer/Footer.jsx';
import './CustomPointer.css'; // Make sure this file exists
import SignUp from "./SignUp.jsx";

// Layout component that includes the header and footer
function Layout() {
  useEffect(() => {
    const pointer = document.getElementById("custom-pointer");
    if (!pointer) {
      console.warn("Custom pointer element not found");
      return;
    }
    const movePointer = (e) => {
      if (pointer) {
        pointer.style.left = `${e.clientX}px`;
        pointer.style.top = `${e.clientY}px`;
      }
    };
    document.addEventListener("mousemove", movePointer);
    return () => {
      document.removeEventListener("mousemove", movePointer);
    };
  }, []);
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <div id="custom-pointer"></div>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
  <Route index element={<MainPage />} />
  <Route path="job-predictor" element={<JobPredictor />} />
  <Route path="recommendations" element={<JobPredictor />} />
        <Route path="interview-questions" element={<InterviewQuestions />} />
        <Route path="contact" element={<Contact />} />
  <Route path="faq" element={<FAQ />} />
  <Route path="videos" element={<div style={{padding:'2rem', color:'#ffd700'}}>Videos page coming soon.</div>} />
  <Route path="dashboard" element={<div style={{padding:'2rem', color:'#ffd700'}}>Dashboard coming soon.</div>} />
  <Route path="signup" element={<SignUp />} />
  {/* Fallback redirect to home */}
  <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="contact us" element={<Contact />} />
      </Route>
    </Routes>
  );
}

export default App;
