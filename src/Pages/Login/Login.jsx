import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { login } from "../../store/slices/AuthSlice";
import useFetch from "../../hooks/useFetch";
import { motion } from "framer-motion";
import loginImage from "../../images/login-image.avif";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loading, postData } = useFetch(
    `${process.env.REACT_APP_API_URL}/api/v1/auth/login`,
    {},
    false
  );

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await postData(
        `${process.env.REACT_APP_API_URL}/api/v1/auth/login`,
        { username, password }
      );

      if (response?.token) {
        const userData = {
          id: response.id,
          username: response.username,
          token: response.token,
        };

        dispatch(login(userData));
        toast.success("Вход выполнен успешно!");

        localStorage.setItem("token", response.token);
        localStorage.setItem("id", response.id);
        localStorage.setItem("username", response.username);

        navigate("/dashboard");
      } else {
        const errorMessage = response?.message || "Не удалось войти";
        toast.error(errorMessage);
        console.log("Ответ при входе:", response);
      }
    } catch (err) {
      console.error("Ошибка входа:", err);
      toast.error("Произошла ошибка при входе.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.2 },
    },
  };

  const sideVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const buttonVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <motion.div
        className="flex flex-col md:flex-row w-full max-w-4xl bg-base-100 shadow-2xl rounded-xl overflow-hidden border border-base-300"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Form Section */}
        <motion.div
          className="w-full md:w-1/2 p-8 flex flex-col justify-center"
          variants={sideVariants}
        >
          <h2 className="text-3xl font-bold text-center mb-6 text-base-content">
            С возвращением
          </h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <motion.div variants={inputVariants}>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-base-content mb-1"
              >
                Имя пользователя
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input input-bordered w-full bg-base-100 focus:input-primary transition-all duration-300"
                placeholder="Введите имя пользователя"
                required
              />
            </motion.div>
            <motion.div variants={inputVariants}>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-base-content mb-1"
              >
                Пароль
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full bg-base-100 focus:input-primary transition-all duration-300"
                placeholder="Введите пароль"
                required
              />
            </motion.div>
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <button
                type="submit"
                className="btn btn-primary w-full flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <>
                    <span>Войти</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </>
                )}
              </button>
            </motion.div>
          </form>
        </motion.div>

        {/* Image Section */}
        <motion.div
          className="hidden md:block w-1/2 bg-base-300"
          variants={imageVariants}
        >
          <img
            className="w-full h-full object-cover"
            src={loginImage}
            alt="Вход Zaporka"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
