import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import ChartComponent from "../../Components/ChartComponent/ChartComponent";

const Loader = () => (
  <div className="flex items-center justify-center h-80">
    <span className="loading loading-spinner loading-lg text-primary"></span>
  </div>
);

const Dashboard = () => {
  const user = useSelector((state) => state?.auth?.user?.username || "Гость");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorUsers, setErrorUsers] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [categoriesData, setCategoriesData] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState(null);
  const token = localStorage.getItem("token");

  const serverUrl = `${process.env.REACT_APP_API_URL}/api/v1/users`;
  console.log("server url:", serverUrl)

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(darkModeMediaQuery.matches);
    const listener = (e) => setIsDarkMode(e.matches);
    darkModeMediaQuery.addEventListener("change", listener);
    return () => darkModeMediaQuery.removeEventListener("change", listener);
  }, []);

  const fetchUsersData = () => {
    setLoadingUsers(true);
    fetch("https://api.zaporka.uz/api/v1/users", {
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
        const todayDay = today.getDay();

        data.forEach((user) => {
          const createdDate = new Date(user.createdAt);
          if (isNaN(createdDate)) return;
          const daysDiff = Math.floor((today - createdDate) / (1000 * 60 * 60 * 24));
          if (daysDiff >= 0 && daysDiff < 7) {
            const index = (6 - daysDiff + todayDay) % 7;
            weekData[index]++;
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
    fetch("https://api.zaporka.uz/api/v1/categories")
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

  const handleRefresh = () => {
    fetchUsersData();
    fetchCategoriesData();
  };

  useEffect(() => {
    if (!token) {
      setErrorUsers("Отсутствует токен авторизации.");
      setErrorCategories("Отсутствует токен авторизации.");
      setLoadingUsers(false);
      setLoadingCategories(false);
      return;
    }

    fetchUsersData();
    fetchCategoriesData();
  }, [token]);

  const getWeekLabels = () => {
    const today = new Date();
    const todayDay = today.getDay();
    const days = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
    const labels = [];
    for (let i = 6; i >= 0; i--) {
      const dayIndex = (todayDay - i + 7) % 7;
      labels.push(days[dayIndex]);
    }
    return labels;
  };

  const usersChartData = useMemo(() => ({
    labels: getWeekLabels(),
    datasets: [
      {
        label: "Новые пользователи",
        data: usersData,
        backgroundColor: "rgba(34, 211, 238, 0.3)",
        borderColor: "#22d3ee",
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 9,
        fill: true,
      },
    ],
  }), [usersData]);

  const categoriesChartData = useMemo(() => ({
    labels: categoriesData.map(c => c.name),
    datasets: [
      {
        label: "Продажа по категориям",
        data: categoriesData.map(c => c.productsQuantity || 0),
        backgroundColor: "rgba(96, 165, 250, 0.4)",
        borderColor: "#3b82f6",
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 9,
        fill: true,
      },
    ],
  }), [categoriesData]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: isDarkMode ? "#fff" : "#000",
          font: { size: 14 },
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDarkMode ? "#fff" : "#000",
        },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: isDarkMode ? "#fff" : "#000",
        },
        grid: {
          color: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
        },
      },
    },
  }), [isDarkMode]);

  return (
    <div className="min-h-screen bg-base-100 text-base-content p-6 transition-colors duration-300">
      <motion.div
        className="max-w-6xl mx-auto space-y-10"
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
        <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
          <h1 className="text-3xl font-bold text-center">
            Добро пожаловать, <span className="text-primary">{user}</span>
          </h1>
          <p className="text-center mt-2 text-sm opacity-80">
            Всего пользователей: <strong>{totalUsers}</strong>
          </p>
          <div className="flex justify-center mt-4">
            <button
              className="btn btn-primary"
              onClick={handleRefresh}
            >
              Обновить
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            className="bg-base-200 rounded-xl shadow-xl p-6 h-96"
            variants={{ hidden: {}, visible: {} }}
          >
            <h2 className="text-xl font-semibold mb-4">Пользователи за неделю</h2>
            {loadingUsers ? (
              <Loader />
            ) : errorUsers ? (
              <p className="text-error">{errorUsers}</p>
            ) : (
              <div className="relative h-80">
                <ChartComponent type="line" data={usersChartData} options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: { text: "Пользователи", display: true },
                  }
                }} />
              </div>
            )}
          </motion.div>

          <motion.div
            className="bg-base-200 rounded-xl shadow-xl p-6 h-96"
            variants={{ hidden: {}, visible: {} }}
          >
            <h2 className="text-xl font-semibold mb-4">Продажа по категориям</h2>
            {loadingCategories ? (
              <Loader />
            ) : errorCategories ? (
              <p className="text-error">{errorCategories}</p>
            ) : (
              <div className="relative h-80">
                <ChartComponent type="line" data={categoriesChartData} options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: { text: "Категории", display: true },
                  }
                }} />
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
