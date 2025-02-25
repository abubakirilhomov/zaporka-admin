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
  console.log(process.env.REACT_APP_API_URL)
  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await postData({ username, password });
      console.table(response)
      if (response?.token) {
        dispatch(login(response.token));
        toast.success("Login successful!");
  
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("token", response.token);
  
        navigate("/dashboard");
      } else {
        toast.error(response?.message || "Login failed");//
        console.log(response)
      }
    } catch (err) {
      console.error("Login Error:", err);
      toast.error("An error occurred while logging in.");
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
