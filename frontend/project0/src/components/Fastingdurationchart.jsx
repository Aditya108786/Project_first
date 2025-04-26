//
import React, { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import api from "../utils/axios";
import { Chart as ChartJS } from "chart.js/auto";
import html2canvas from "html2canvas";
import axios from "axios";

const FastingDurationChart = () => {
  const [fastingData, setFastingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    api.get("/users/history")
      .then((response) => {
        if (Array.isArray(response.data.data) && response.data.data.length > 0) {
          setFastingData(response.data.data);
        } else {
          setError("No fasting data available.");
        }
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to load data.");
        setLoading(false);
      });
  }, []);

  const chartData = {
    labels: fastingData.map((data) =>
      new Date(data.startTime).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Fasting Duration (hours)",
        data: fastingData.map((data) => {
          const start = new Date(data.startTime);
          const end = new Date(data.endTime);
          const duration = (end - start) / (1000 * 60 * 60);
          return duration.toFixed(2);
        }),
        fill: false,
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6",
        tension: 0.2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.parsed.y} hours`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Fasting Duration (hours)",
        },
        ticks: {
          beginAtZero: true,
        },
      },
    },
  };

  const handleShare = () => {
    if (chartRef.current) {
      setUploading(true);
      html2canvas(chartRef.current).then((canvas) => {
        const imageURL = canvas.toDataURL();

        const formData = new FormData();
        formData.append("file", imageURL);
        formData.append("upload_preset", "ml_default"); // Use ml_default

        axios.post("https://api.cloudinary.com/v1_1/ddf9wul98/image/upload", formData)
          .then((response) => {
            const imageUrl = response.data.secure_url;
            setUploadedUrl(imageUrl);
            setUploading(false);
          })
          .catch((error) => {
            console.error("Error uploading to Cloudinary:", error);
            alert("Failed to upload the image.");
            setUploading(false);
          });
      });
    }
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(uploadedUrl)}`, "_blank");
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(uploadedUrl)}`, "_blank");
  };

  const shareOnWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(uploadedUrl)}`, "_blank");
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">
        Fasting Duration Chart
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading chart...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : fastingData.length === 0 ? (
        <p className="text-center text-gray-500">No data to display.</p>
      ) : (
        <div ref={chartRef}>
          <Line data={chartData} options={chartOptions} />
        </div>
      )}

      <div className="mt-6 text-center">
        {uploading ? (
          <p className="text-gray-500">Uploading chart... Please wait.</p>
        ) : uploadedUrl ? (
          <>
            <p className="text-green-600 font-semibold mb-4">Chart uploaded! 🎉 Choose where to share:</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <button
                onClick={shareOnFacebook}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Share on Facebook
              </button>
              <button
                onClick={shareOnTwitter}
                className="px-4 py-2 bg-sky-400 text-white rounded-md hover:bg-sky-500"
              >
                Share on Twitter
              </button>
              <button
                onClick={shareOnWhatsApp}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Share on WhatsApp
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={handleShare}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Share Progress
          </button>
        )}
      </div>
    </div>
  );
};

export default FastingDurationChart;
