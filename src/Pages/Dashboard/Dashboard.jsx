import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import ChartComponent from "../../Components/ChartComponent/ChartComponent";

const Loader = () => (
  <div className="flex items-center justify-center h-80">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-opacity-70"></div>
  </div>
);

const Dashboard = () => {
  const user = useSelector((state) => state?.auth?.user?.username);
  const store = useSelector((state) => state);
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  

  const [seaOrdersData, setSeaOrdersData] = useState({
    labels: [],
    datasets: [
      {
        label: "Морские заказы",
        data: [],
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)", // blue
          "rgba(75, 192, 192, 0.6)", // teal
          "rgba(255, 99, 132, 0.6)", // red
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  });

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

  const usersChartData = {
    labels: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
    datasets: [
      {
        label: "Новые пользователи",
        data: usersData,
        fill: true,
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "rgba(59, 130, 246, 1)",
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
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
        labels: {
          color: "#e5e7eb",
        },
      },
      title: {
        display: true,
        text: "Статусы заказов",
        color: "#e5e7eb",
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#e5e7eb",
        },
      },
      y: {
        ticks: { color: "#1f2937", font: { size: 12 } },
        beginAtZero: true,
        grid: { color: "rgba(0,0,0,0.1)" },
      },
    },
  };

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <motion.div
        className="max-w-6xl mx-auto space-y-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.2 },
          },
        }}
      >
        <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">
            Добро пожаловать, <span className="text-blue-600">{user}</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Всего пользователей: <strong>{totalUsers}</strong>
          </p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            onClick={fetchUsersData}
          >
            Обновить данные
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div className="bg-white rounded-xl shadow-lg p-6 h-96" variants={{ hidden: {}, visible: {} }}>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Пользователи за неделю</h2>
            {loadingUsers ? (
              <Loader />
            ) : errorUsers ? (
              <p className="text-red-500">{errorUsers}</p>
            ) : (
              <div className="relative h-80">
                <ChartComponent
                  type="line"
                  data={usersChartData}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        text: "Новые пользователи за неделю",
                        display: true,
                      },
                    },
                  }}
                />
              </div>
            )}
          </motion.div>

          <motion.div className="bg-white rounded-xl shadow-lg p-6 h-96" variants={{ hidden: {}, visible: {} }}>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Продажа по категориям</h2>
            {loadingCategories ? (
              <Loader />
            ) : errorCategories ? (
              <p className="text-red-500">{errorCategories}</p>
            ) : (
              <div className="relative h-80">
                <ChartComponent
                  type="bar"
                  data={categoriesChartData}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        text: "Продажа по категориям",
                        display: true,
                      },
                    },
                  }}
                />
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
