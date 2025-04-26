//
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import FastingForm from "./FastingForm";
import FastingHistory from "./Getfasting";
import FastingDurationChart from "./Fastingdurationchart";
import api from "../utils/axios";

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [newFullname, setNewFullname] = useState("");
  const [averageFastingDuration, setAverageFastingDuration] = useState(0);
  const [profilePicture, setProfilePicture] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await api.get("/users/profile");
        console.log("User Profile:", res.data);
        setUserName(res.data.fullname);
        setNewFullname(res.data.fullname); // Pre-fill the input
        setProfilePicture(res.data.avatar);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };

    const fetchAverage = async () => {
      try {
        const res = await api.get("/users/history");
        const fastingData = res.data.data;

        if (fastingData.length > 0) {
          const totalDuration = fastingData.reduce((acc, item) => {
            const start = new Date(item.startTime);
            const end = new Date(item.endTime);
            const duration = (end - start) / (1000 * 60 * 60);
            return acc + duration;
          }, 0);

          setAverageFastingDuration((totalDuration / fastingData.length).toFixed(2));
        }
      } catch (err) {
        console.error("Failed to fetch history for average calculation:", err);
      }
    };

    fetchUserProfile();
    fetchAverage();
  }, []);

  const handleProfilePictureChange = async (e) => {
    const formData = new FormData();
    formData.append("avatar", e.target.files[0]);

    try {
      setUploading(true);
      const res = await api.put("/users/update-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(res.data.message);
      // Refresh profile data after upload
      const profileRes = await api.get("/users/profile");
      setUserName(profileRes.data.fullname);
      setProfilePicture(profileRes.data.avatar);
    } catch (err) {
      console.error("Failed to upload profile picture:", err);
      alert("Failed to upload profile picture");
    } finally {
      setUploading(false);
    }
  };

  const handleFullnameUpdate = async () => {
    try {
      const res = await api.put("/users/update", {
        fullname: newFullname,
        // If email required, you can also pass existing email here
      });

      alert(res.data.message || "Fullname updated successfully!");
      setUserName(newFullname); // Update UI immediately
    } catch (err) {
      console.error("Failed to update fullname:", err);
      alert("Failed to update fullname.");
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleLogout = async () => {
    try {
      await api.post("/users/logout");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
      alert("Logout failed. Try again!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Top Section with Logout */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600">
          Welcome, {userName || "User"} 👋
        </h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Profile Picture Section */}
      <div className="text-center mb-6">
        <div className="relative inline-block">
          {profilePicture ? (
            <img
              src={profilePicture}
              alt="Profile"
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-blue-300"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-300 mx-auto mb-4"></div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-full">
              <div className="loader ease-linear rounded-full border-4 border-t-4 border-blue-500 h-12 w-12"></div>
            </div>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleProfilePictureChange}
          className="hidden"
        />

        {/* Change Photo Button */}
        <button
          onClick={triggerFileSelect}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Change Profile Picture
        </button>

        {/* Update Fullname Section */}
        <div className="mt-6">
          <input
            type="text"
            value={newFullname}
            onChange={(e) => setNewFullname(e.target.value)}
            placeholder="Enter new fullname"
            className="px-4 py-2 border rounded-lg w-full mb-2"
          />
          <button
            onClick={handleFullnameUpdate}
            className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Update Fullname
          </button>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Enter Fasting Window
          </h2>
          <FastingForm />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Fasting History
          </h2>
          <FastingHistory />
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Summary</h2>
        <p className="text-lg text-gray-600">
          Average Fasting Duration:{" "}
          <span className="font-bold">{averageFastingDuration} hours</span>
        </p>
      </div>

      <div className="mt-8">
        <FastingDurationChart />
      </div>
    </div>
  );
};

export default Dashboard;
