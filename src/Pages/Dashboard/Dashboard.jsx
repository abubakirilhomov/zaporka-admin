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
  const user = useSelector((state) => state?.auth?.user?.username || "Гость");

  const [usersData, setUsersData] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorUsers, setErrorUsers] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);

  const [categoriesData, setCategoriesData] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState(null);

  const token = localStorage.getItem("token");

  const fetchUsersData = () => {
    setLoadingUsers(true);
    fetch("https://zaporka-backend.onrender.com/api/v1/users", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 403) throw new Error("Доступ запрещён. Проверьте токен.");
        if (!res.ok) throw new Error("Ошибка при получении пользователей");
        return res.json();
      })
      .then((data) => {
        setTotalUsers(data.length);
        const weekData = Array(7).fill(0);
        const today = new Date();

        data.forEach((user) => {
          const createdDate = new Date(user.createdAt);
          if (isNaN(createdDate)) return;
          const daysDiff = Math.floor((today - createdDate) / (1000 * 60 * 60 * 24));
          if (daysDiff >= 0 && daysDiff < 7) {
            weekData[6 - daysDiff]++;
          }
        });

        setUsersData(weekData);
        setErrorUsers(null);
      })
      .catch((err) => setErrorUsers(err.message))
      .finally(() => setLoadingUsers(false));
  };

  const fetchCategoriesData = () => {
    setLoadingCategories(true);
    fetch("https://zaporka-backend.onrender.com/api/v1/categories")
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка при получении категорий");
        return res.json();
      })
      .then((data) => {
        setCategoriesData(data);
        setErrorCategories(null);
      })
      .catch((err) => setErrorCategories(err.message))
      .finally(() => setLoadingCategories(false));
  };

  useEffect(() => {
    if (!token) {
      setErrorUsers("Отсутствует токен авторизации.");
      setLoadingUsers(false);
      return;
    }

    fetchUsersData();
    fetchCategoriesData();
  }, [token]);

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

  const categoriesChartData = {
    labels: categoriesData.map((category) => category.name),
    datasets: [
      {
        label: "Продажа по категориям",
        data: categoriesData.map((category) => category.sales || 0),
        backgroundColor: categoriesData.map((_, index) => `rgba(${index * 50}, ${index * 30}, 200, 0.6)`),
        borderColor: categoriesData.map((_, index) => `rgba(${index * 50}, ${index * 30}, 200, 1)`),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { color: "#1f2937", font: { size: 14 } } },
      title: { display: true, color: "#1f2937", font: { size: 16, weight: "bold" } },
    },
    scales: {
      x: { ticks: { color: "#1f2937", font: { size: 12 } }, grid: { display: false } },
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
