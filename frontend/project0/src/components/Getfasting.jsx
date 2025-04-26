//
// pages/FastingHistory.jsx
import React, { useEffect, useState } from "react";
import api from "../utils/axios";

const FastingHistory = () => {
  const [history, setHistory] = useState([]);
  const [averageDuration, setAverageDuration] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/users/history");
        const data = res.data.data || [];
        setHistory(data);

        // ➡️ Calculate average fasting duration for the past 7 days
        const pastWeek = data.filter((item) => {
          const createdAt = new Date(item.createdAt);
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          return createdAt >= oneWeekAgo;
        });

        if (pastWeek.length > 0) {
          const totalDuration = pastWeek.reduce((acc, item) => {
            const start = new Date(item.startTime);
            const end = new Date(item.endTime);
            const durationHours = (end - start) / (1000 * 60 * 60);
            return acc + durationHours;
          }, 0);

          setAverageDuration((totalDuration / pastWeek.length).toFixed(2));
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-700">Fasting History</h2>

      {/* Average summary */}
      <div className="mb-6 p-4 bg-blue-100 rounded-lg text-blue-700 font-semibold">
        Average Fasting Duration (Past 7 days): {averageDuration} hours
      </div>

      {/* Historical Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Start Time</th>
              <th className="py-2 px-4">End Time</th>
              <th className="py-2 px-4">Eating Window (hours)</th>
              <th className="py-2 px-4">Fasting Duration (hours)</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No history available.
                </td>
              </tr>
            ) : (
              history.map((item, idx) => {
                const start = new Date(item.startTime);
                const end = new Date(item.endTime);
                const fastingDuration = ((end - start) / (1000 * 60 * 60)).toFixed(2);

                return (
                  <tr key={idx} className="border-b">
                    <td className="py-2 px-4 text-center">{start.toLocaleDateString()}</td>
                    <td className="py-2 px-4 text-center">{start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="py-2 px-4 text-center">{end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="py-2 px-4 text-center">{item.eatingWindowHours || "-"}</td>
                    <td className="py-2 px-4 text-center">{fastingDuration}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FastingHistory;
