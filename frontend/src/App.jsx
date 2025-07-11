import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import JobPredictor from "./JobPredictor/JobPredictor.jsx";
import InterviewQuestions from './InterviewQuestions/InterviewQuestions.jsx';
import Header from './Header/Header.jsx';
import './CustomPointer.css'; // Make sure this file exists

// Layout component that includes the header
function Layout() {
  useEffect(() => {
    const pointer = document.getElementById("custom-pointer");
    const movePointer = (e) => {
      pointer.style.left = `${e.clientX}px`;
      pointer.style.top = `${e.clientY}px`;
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
      
      <div id="custom-pointer"></div>
    </>
  );
}

// Setup the routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <JobPredictor />,
      },
      {
        path: "/job-predictor",
        element: <JobPredictor />,
      },
      {
        path: "/interview-questions",
        element: <InterviewQuestions />,
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
