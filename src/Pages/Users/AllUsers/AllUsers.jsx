import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, RefreshCcw, Users } from "react-feather";
import CustomPagination from "../../../Components/CustomPagination/CustomPagination";
import CustomTable from "../../../Components/CustomTable/CustomTable";
import Loading from "../../../Components/Loading/Loading";

const AllUsers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortedBy, setSortedBy] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://zaporka-backend.onrender.com/api/v1/users", {
        method: "GET",
        headers: { "Accept": "*/*" },
      });
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }
      const result = await response.json();
      console.log("Данные пользователей:", result);
      setData(result);
    } catch (err) {
      console.error("Ошибка загрузки данных:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, usersPerPage]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchUsers();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  if (loading) return <Loading />;
  if (error) return <p className="text-error text-lg">Ошибка: {error}</p>;

  let filteredUsers = data.filter((user) =>
    [user._id, user.username.toLowerCase()].some((field) => field.includes(searchTerm.toLowerCase()))
  );

  if (sortedBy) {
    filteredUsers.sort((a, b) => (a[sortedBy] > b[sortedBy] ? 1 : -1));
  }

  const columns = [
    { key: "_id", label: "ID", sortable: true },
    { key: "username", label: "Имя пользователя", sortable: true },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center p-5 bg-base-100 shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-6 text-base-content flex items-center">
        <Users className="mr-2 text-primary" size={30} /> Все пользователи
      </h2>

      <div className="flex justify-between w-full mb-4 items-center">
        <div className="relative w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Поиск..."
            className="input input-bordered w-full pl-10 text-sm focus:ring focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="select select-bordered text-sm"
          value={usersPerPage}
          onChange={(e) => setUsersPerPage(Number(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>

        <motion.button
          className="btn btn-primary flex items-center text-sm"
          onClick={handleRefresh}
          initial={{ scale: 1 }}
          whileTap={{ scale: 0.9 }}
          animate={isRefreshing ? { y: [-3, 3, -3] } : {}}
          transition={{ duration: 0.4, repeat: isRefreshing ? Infinity : 0, repeatType: "mirror" }}
        >
          <RefreshCcw size={16} className="mr-1" /> Обновить
        </motion.button>
      </div>

      <div className="w-full">
        <CustomTable data={filteredUsers} columns={columns} emptyMessage="Пользователи не найдены" onSort={setSortedBy} />
      </div>

      <div className="mt-4">
        <CustomPagination currentPage={currentPage} totalPages={Math.ceil(data.length / usersPerPage)} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
};

export default AllUsers;
