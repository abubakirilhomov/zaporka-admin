import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
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

  useEffect(() => {
    const fetchSeaOrders = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/v1/orders`);
        const data = await response.json();
  
        let totalDelivered = 0;
        let totalCanceled = 0;
        let totalInProgress = 0;
  
        data.forEach(order => {
          if (order.status === "Доставлено") {
            totalDelivered += order.totalPrice;
          } else if (order.status === "Отменено") {
            totalCanceled += order.totalPrice;
          } else if (order.status === "В процессе") {
            totalInProgress += order.totalPrice;
          }
        });
  
        setSeaOrdersData({
          labels: ["Доставлено", "Отменено", "В процессе"],
          datasets: [
            {
              label: "Общая сумма заказов (₽)",
              data: [totalDelivered, totalCanceled, totalInProgress],
              backgroundColor: [
                "rgba(75, 192, 192, 0.6)",   
                "rgba(255, 99, 132, 0.6)", 
                "rgba(255, 206, 86, 0.6)"   
              ],
              borderColor: [
                "rgba(75, 192, 192, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(255, 206, 86, 1)"
              ],
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Ошибка при получении заказов:", error);
      }
    };
  
    fetchSeaOrders();
    const interval = setInterval(fetchSeaOrders, 10000);
    return () => clearInterval(interval);
  }, []);
  
  
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
        ticks: {
          color: "#e5e7eb",
        },
      },
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
        <motion.div variants={itemVariants}>
          <p className="text-5xl font-bold text-center">
            Добро пожаловать,{" "}
            <span>{user || "Гость"}</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            className="card bg-base-100 shadow-xl p-4 h-96"
            variants={itemVariants}
          >
            <h2 className="text-xl font-semibold text-base-content mb-4">
              Продажи по месяцам
            </h2>
            <div className="relative h-full">
              <Bar data={barData} options={chartOptions} />
            </div>
          </motion.div>

          <motion.div
            className="card bg-base-100 shadow-xl p-4 h-96"
            variants={itemVariants}
          >
            <h2 className="text-xl font-semibold text-base-content mb-4">
              Пользователи за неделю
            </h2>
            <div className="relative h-full">
              <Line data={lineData} options={chartOptions} />
            </div>
          </motion.div>

          <motion.div
            className="card bg-base-100 shadow-xl p-4 h-96"
            variants={itemVariants}
          >
            <h2 className="text-xl font-semibold text-base-content mb-4">
              Категории продуктов
            </h2>
            <div className="relative h-full">
              <Pie data={pieData} options={chartOptions} />
            </div>
          </motion.div>

          <motion.div
            className="card bg-base-100 shadow-xl p-4 h-96"
            variants={itemVariants}
          >
            <h2 className="text-xl font-semibold text-base-content mb-4">
              Статусы заказов
            </h2>
            <div className="relative h-full">
              <Doughnut data={seaOrdersData} options={chartOptions} />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;