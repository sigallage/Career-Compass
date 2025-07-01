import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import JobPredictor from "./JobPredictor/JobPredictor.jsx";

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
  return <RouterProvider router={router} />;
}

export default App;
