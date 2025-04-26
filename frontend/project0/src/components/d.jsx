//
import React, { useEffect, useRef, useState } from "react";
import FastingForm from "./FastingForm";
import FastingHistory from "./Getfasting";
import FastingDurationChart from "./Fastingdurationchart";
import api from "../utils/axios";

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [averageFastingDuration, setAverageFastingDuration] = useState(0);
  const [profilePicture, setProfilePicture] = useState("");
  const [uploading, setUploading] = useState(false); // ⬅️ New state
  const fileInputRef = useRef(null); // ⬅️ Ref to hidden file input

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await api.get("/users/profile");
        console.log("User Profile:", res.data);
        setUserName(res.data.fullname);
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
      await fetchUserProfile();
    } catch (err) {
      console.error("Failed to upload profile picture:", err);
      alert("Failed to upload profile picture");
    } finally {
      setUploading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* User Welcome Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600">Welcome, {userName || "User"} 👋</h1>
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
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Enter Fasting Window</h2>
          <FastingForm />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Fasting History</h2>
          <FastingHistory />
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Summary</h2>
        <p className="text-lg text-gray-600">
          Average Fasting Duration: <span className="font-bold">{averageFastingDuration} hours</span>
        </p>
      </div>

      <div className="mt-8">
        <FastingDurationChart />
      </div>
    </div>
  );
};

export default Dashboard;




const updateuseravatar = async function(req, res) {
    try {
      const avatarlocalpath = req.file?.path;
         
      if (!avatarlocalpath) {
        return res.status(400).json({ message: "Avatar file is missing" });
      }
  
      const avatar = await uploadcloudinary(avatarlocalpath);
      
      if (!avatar.url) {
        return res.status(400).json({ message: "Failed to upload avatar to cloud" });
      }
  
      const updatedUser = await usermodel.findByIdAndUpdate(
        req.user?._id,
        {
          $set: {
            avatar: avatar.url
          }
        },
        {
          new: true // return updated user
        }
      ).select("-password"); // exclude password from result
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({
        message: "Avatar updated successfully",
        user: updatedUser
      });
  
    } catch (error) {
      console.error("Error updating avatar:", error);
      res.status(500).json({ message: "Something went wrong", error: error.message });
    }
  };