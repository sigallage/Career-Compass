import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import JobPredictor from "./JobPredictor/JobPredictor.jsx";


function App() {
  return (
    <Router>

        
        <Routes>
          <Route path="/JobPredictor" element={<JobPredictor />} />
          
        </Routes>
        
      
    </Router>
  );
}

export default App;
