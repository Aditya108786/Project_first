//
// pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import { useAuth } from "../Context/AuthContext"; 

function Login() {
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/users/login", { email, password });
      console.log("Login Response:", res.data);

      // 🚀 After successful login, set the user in context
      if (res.data.success) {
        setUser(res.data.user);  // Set user to AuthContext

        alert(res.data.message || "Login successful");
        navigate("/dashboard");  // Redirect to dashboard
      } else {
        alert(res.data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };
  
  

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-green-100 to-blue-200">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-5"
      >
        <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <span
            className="text-green-600 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;
