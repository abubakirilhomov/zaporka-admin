import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { login } from "../../store/slices/AuthSlice";
import useFetch from "../../hooks/useFetch";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loading, error, postData } = useFetch(
    `${process.env.REACT_APP_API_URL}/api/v1/auth/login`,
    {},
    false
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login data:", { username, password });

    try {
      const response = await postData(
        `${process.env.REACT_APP_API_URL}/api/v1/auth/login`,
        { username, password }
      );

      console.table(response);
      console.log(response);

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
        console.log("Login response:", response);
      }
    } catch (err) {
      console.error("Login Error:", err);
      toast.error("Произошла ошибка при входе.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-300">
      <ToastContainer />
      <div className="bg-base-100 shadow-xl rounded-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
