
//
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
      <div className="text-xl font-bold text-blue-600">
        Fasting Tracker
      </div>
      <div className="space-x-6">
        <Link to="/" className="text-gray-700 hover:text-blue-500">Home</Link>
        <Link to="/register" className="text-gray-700 hover:text-blue-500">Register</Link>
        <Link to="/login" className="text-gray-700 hover:text-blue-500">Login</Link>
        <Link to="/dashboard" className="text-gray-700 hover:text-blue-500">Dashboard</Link>
      </div>
    </nav>
  );
};

export default Navbar;
