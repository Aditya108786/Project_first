import React from "react";
import ReactDOM from "react-dom/client"; // Import createRoot from 'react-dom/client'
import { BrowserRouter as Router } from "react-router-dom"; // If using React Router for routing
import App from "./App"; // Main app component
import { AuthProvider } from "./Context/AuthContext"; // Your custom Auth context provider

// Create a root using createRoot
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the app with AuthProvider and Router
root.render(
  <React.StrictMode>
    <AuthProvider> {/* Auth provider to manage user context */}
      
        <App />
      
    </AuthProvider>
  </React.StrictMode>
);
