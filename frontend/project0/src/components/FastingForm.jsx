//
// pages/FastingForm.jsx
import React, { useState } from "react";
import api from "../utils/axios";

function FastingForm() {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [eatingWindowHours, setEatingWindowHours] = useState(""); // ➡️ New State

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/users/add", {
        startTime,
        endTime,
        eatingWindowHours, // ➡️ Include eating window
      });
      alert(res.data.message || "Fasting data saved!");
      
      // Reset form after successful submit
      setStartTime("");
      setEndTime("");
      setEatingWindowHours("");
    } catch (err) {
      console.error(err);
      alert("Failed to save data");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      {/* Start Time */}
      <div>
        <label className="block text-gray-700 mb-1">Fasting Start Time</label>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
      </div>

      {/* End Time */}
      <div>
        <label className="block text-gray-700 mb-1">Fasting End Time</label>
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
      </div>

      {/* Eating Window */}
      <div>
        <label className="block text-gray-700 mb-1">Eating Window (in hours)</label>
        <input
          type="number"
          value={eatingWindowHours}
          onChange={(e) => setEatingWindowHours(e.target.value)}
          placeholder="e.g., 8"
          min="1"
          max="24"
          className="w-full border rounded p-2"
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
      >
        Save
      </button>
    </form>
  );
}

export default FastingForm;
