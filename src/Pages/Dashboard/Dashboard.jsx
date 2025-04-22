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

  const barData = {
    labels: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн"],
    datasets: [
      {
        label: "Продажи",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const lineData = {
    labels: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
    datasets: [
      {
        label: "Пользователи",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: "rgba(255, 99, 132, 1)",
        tension: 0.4,
      },
    ],
  };

  const pieData = {
    labels: ["Красный", "Синий", "Жёлтый"],
    datasets: [
      {
        label: "Категории",
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
        labels: { color: "#e5e7eb" },
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
        {/* Приветствие */}
        <motion.div variants={itemVariants}>
          <h1 className="text-5xl font-bold text-center">
            Добро пожаловать,{" "}
            <span className="">
              {user || "Гость"}
            </span>
          </h1>
        </motion.div>

        {/* Сетка с графиками */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Гистограмма */}
          <motion.div
            className="card bg-base-100 shadow-xl p-4 h-96"
            variants={itemVariants}
          >
            <h2 className="text-xl font-semibold text-base-content mb-4">
              Продажи по месяцам
            </h2>
            <div className="relative h-full">
              <Bar
                data={barData}
                options={{ ...chartOptions, title: { text: "Продажи по месяцам" } }}
              />
            </div>
          </motion.div>

          {/* Линейный график */}
          <motion.div
            className="card bg-base-100 shadow-xl p-4 h-96"
            variants={itemVariants}
          >
            <h2 className="text-xl font-semibold text-base-content mb-4">
              Пользователи за неделю
            </h2>
            <div className="relative h-full">
              <Line
                data={lineData}
                options={{ ...chartOptions, title: { text: "Пользователи за неделю" } }}
              />
            </div>
          </motion.div>

          {/* Круговая диаграмма */}
          <motion.div
            className="card bg-base-100 shadow-xl p-4 h-96"
            variants={itemVariants}
          >
            <h2 className="text-xl font-semibold text-base-content mb-4">
              Категории продуктов
            </h2>
            <div className="relative h-full">
              <Pie
                data={pieData}
                options={{ ...chartOptions, title: { text: "Категории продуктов" } }}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;