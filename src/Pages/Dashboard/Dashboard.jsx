import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Bar,
  Line,
  Pie,
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const user = useSelector((state) => state?.auth?.user?.username);
  const store = useSelector((state) => state);
  console.log(store);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  };

  // Chart data and options
  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Sales",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const lineData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Users",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: "rgba(255, 99, 132, 1)",
        tension: 0.4,
      },
    ],
  };

  const pieData = {
    labels: ["Red", "Blue", "Yellow"],
    datasets: [
      {
        label: "Categories",
        data: [300, 50, 100],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#e5e7eb" }, // Adjust for theme if needed
      },
      title: {
        display: true,
        color: "#e5e7eb",
      },
    },
    scales: {
      x: { ticks: { color: "#e5e7eb" } },
      y: { ticks: { color: "#e5e7eb" } },
    },
  };

  return (
    <div className="min-h-screen p-6">
      <motion.div
        className="max-w-6xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Message */}
        <motion.div variants={itemVariants}>
          <h1 className="bg-clip-text text-transparent bg-gradient-to-r from-info via-secondary to-accent text-5xl font-bold text-center">
            Welcome{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-info">
              {user || "Guest"}
            </span>
          </h1>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Bar Chart */}
          <motion.div
            className="card bg-base-100 shadow-xl p-4 h-96"
            variants={itemVariants}
          >
            <h2 className="text-xl font-semibold text-base-content mb-4">
              Monthly Sales
            </h2>
            <div className="relative h-full">
              <Bar
                data={barData}
                options={{ ...chartOptions, title: { text: "Monthly Sales" } }}
              />
            </div>
          </motion.div>

          {/* Line Chart */}
          <motion.div
            className="card bg-base-100 shadow-xl p-4 h-96"
            variants={itemVariants}
          >
            <h2 className="text-xl font-semibold text-base-content mb-4">
              Weekly Users
            </h2>
            <div className="relative h-full">
              <Line
                data={lineData}
                options={{ ...chartOptions, title: { text: "Weekly Users" } }}
              />
            </div>
          </motion.div>

          {/* Pie Chart */}
          <motion.div
            className="card bg-base-100 shadow-xl p-4 h-96"
            variants={itemVariants}
          >
            <h2 className="text-xl font-semibold text-base-content mb-4">
              Product Categories
            </h2>
            <div className="relative h-full">
              <Pie
                data={pieData}
                options={{ ...chartOptions, title: { text: "Product Categories" } }}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;