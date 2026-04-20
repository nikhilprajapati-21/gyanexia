import React from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const ClassGraph = () => {
  const data = {
    labels: [
      "Class 5",
      "Class 6",
      "Class 7",
      "Class 8",
      "Class 9",
      "Class 10",
      "Class 11",
      "Class 12",
    ],
    datasets: [
      {
        label: "Students",
        data: [28, 26, 29, 32, 11, 24, 6, 6],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4CAF50",
          "#9966FF",
          "#FF9F40",
          "#00BCD4",
          "#8BC34A",
        ],
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // 🔥 important for mobile
    animation: {
      duration: 1500,
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,   // 🔥 stop tilt
          minRotation: 45,
          autoSkip: false,   // 🔥 skip labels on small screens
          maxTicksLimit: 6, // 🔥 limit labels (fix merging)
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div
      style={{
        width: "100%",          // 🔥 full width
        maxWidth: "900px",      // 🔥 limit on large screens
        margin: "50px auto",
        padding: "10px",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "20px",
          fontSize: "clamp(18px, 4vw, 28px)", // 🔥 responsive text
        }}
      >
        Class-wise Participation in Competitions 📊
      </h2>

      {/* 🔥 fixed height container */}
      <div style={{ height: "300px" }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default ClassGraph;