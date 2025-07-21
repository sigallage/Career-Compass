import { Routes, Route, Outlet } from "react-router-dom";
import { useEffect } from "react";
import JobPredictor from "./JobPredictor/JobPredictor.jsx";
import InterviewQuestions from './InterviewQuestions/InterviewQuestions.jsx';
import Contact from './Contact/Contact.jsx';
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
        <Route index element={<JobPredictor />} />
        <Route path="job-predictor" element={<JobPredictor />} />
        <Route path="interview-questions" element={<InterviewQuestions />} />
        <Route path="contact" element={<Contact />} />
        <Route path="SignUp" element={<SignUp />} />
      </Route>
    </Routes>
  );
}

export default App;
