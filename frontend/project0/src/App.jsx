// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register"
import Login from "./components/Login";
import FastingForm from "./components/FastingForm";
import FastingHistory from "./components/Getfasting";
import FastingDurationChart from "./components/Fastingdurationchart";
import Dashboard from "./components/Dashboarduser";
import ProtectedRoute from "./components/ProtectedRoute";
import './index.css'
import Home from "./components/Home";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
       
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
           
            
             
      </Routes>
    </Router>
  );
}

export default App;
