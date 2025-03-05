import { useState } from "react";
import useFetch from "./useFetch";

const CreateUser = () => {
  const { fetchData, loading, error } = useFetch("https://api.example.com/register");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Пароли не совпадают!");
      return;
    }
    await fetchData({ email, password });
    alert("Аккаунт успешно создан!");
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4 border rounded-lg shadow-lg max-w-sm mx-auto">
      <h2 className="text-xl font-bold">Создать аккаунт</h2>
      <form onSubmit={handleSubmit} className="w-full">
        <input
          type="email"
          placeholder="Email"
          className="p-2 border rounded w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          className="p-2 border rounded w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Подтвердите пароль"
          className="p-2 border rounded w-full"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button 
          type="submit" 
          className="bg-green-500 text-white px-4 py-2 rounded w-full mt-2"
          disabled={loading}
        >
          {loading ? "Создание..." : "Создать аккаунт"}
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default CreateUser;
