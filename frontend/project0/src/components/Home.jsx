//
import React from "react";

const Home = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-green-100 to-blue-200">
      <div className="text-center p-10 bg-white rounded-2xl shadow-2xl">
        <h1 className="text-4xl font-bold text-gray-700 mb-6">Welcome to the Intermittent Fasting Tracker!</h1>
        <p className="text-gray-600 text-lg">
          Track your fasting journey, visualize your progress, and stay motivated.
        </p>
      </div>
    </div>
  );
};

export default Home;
