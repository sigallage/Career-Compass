import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useEffect } from 'react';
import JobPredictor from "./JobPredictor/JobPredictor.jsx";
import './CustomPointer.css'; // Make sure this file exists

// Setup the routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <JobPredictor />,
  },
  {
    path: "/job-predictor",
    element: <JobPredictor />,
  }
]);

function App() {
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
      <RouterProvider router={router} />
      <div id="custom-pointer"></div>
    </>
  );
}

export default App;
