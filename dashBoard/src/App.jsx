import Dashboard from "./admin";
import LoginComponent from "./login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/" element={<LoginComponent />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
