import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home'; 
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* The Landing Page */}
        <Route path="/" element={<Home />} />
        
        {/* The Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}