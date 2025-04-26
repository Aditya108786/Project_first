//
// pages/Register.jsx
import React, { useState } from "react";
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";
function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
    fullname: "",
  });
  const navigate = useNavigate()
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = new FormData();
    for (let key in form) {
      data.append(key, form[key]);
    }
    data.append("avatar", avatar);
    data.append("coverimage", coverImage);

    const formDataObj = {};
    for (let [key, value] of data.entries()) {
      formDataObj[key] = value;
    }

    try {
      const res = await api.post("/users/register", formDataObj, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-100 to-purple-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-5"
      >
        <h2 className="text-2xl font-bold text-center text-gray-700">Create Account</h2>

        <input
          type="text"
          name="fullname"
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        
        <div className="flex flex-col gap-2">
          <label className="text-gray-600 text-sm">Avatar (Profile Picture)</label>
          <input
            type="file"
            onChange={(e) => setAvatar(e.target.files[0])}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-gray-600 text-sm">Cover Image</label>
          <input
            type="file"
            onChange={(e) => setCoverImage(e.target.files[0])}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all"
        >
          Register
        </button>
        <p className="text-center text-sm text-gray-600">
  Already have an account?{" "}
  <span
    className="text-blue-600 font-semibold cursor-pointer hover:underline"
    onClick={() => navigate("/login")}
  >
    Login
  </span>
</p>

      </form>
    </div>
  );
}

export default Register;
