import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalEmail, setModalEmail] = useState("");
  const [modalPassword, setModalPassword] = useState("");

  const handleSubmit = () => {
    setModalEmail(email);
    setModalPassword(password);
    setShowModal(true);
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4 border rounded-lg shadow-lg max-w-sm mx-auto">
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
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        onClick={handleSubmit}
      >
        Войти
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold">Введённые данные</h3>
            <p><strong>Email:</strong> {modalEmail}</p>
            <p><strong>Password:</strong> {modalPassword}</p>
            <button 
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setShowModal(false)}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
