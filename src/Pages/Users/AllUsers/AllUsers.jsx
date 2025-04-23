import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiRefreshCcw, FiUsers, FiEdit, FiTrash2, FiUserPlus } from "react-icons/fi";
import { toast } from "react-toastify";
import CustomPagination from "../../../Components/CustomPagination/CustomPagination";
import CustomTable from "../../../Components/CustomTable/CustomTable";
import Loading from "../../../Components/Loading/Loading";
import { useSelector } from "react-redux";

const AllUsers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortedBy, setSortedBy] = useState(null);
  const [data, setData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.auth.user.token)

  const authHeaders = token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    : { "Content-Type": "application/json" };

  const [modalState, setModalState] = useState({
    isEditOpen: false,
    isDeleteOpen: false,
    isAddOpen: false,
    selectedUser: null,
    newUsername: "",
    newPassword: "",
    isActionLoading: false,
  });

  const apiRequest = async (url, options) => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: authHeaders});
      if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
      return await response.json();
    } catch (err) {
      console.error(`Ошибка API-запроса (${url}):`, err);
      throw err;
    }
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiRequest("https://zaporka-backend.onrender.com/api/v1/users", { method: "GET" });
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchUsers().finally(() => setTimeout(() => setIsRefreshing(false), 1000));
  }, [fetchUsers]);

  const openAddModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, isAddOpen: true, newUsername: "", newPassword: "" }));
  }, []);

  const closeModal = useCallback(() => {
    setModalState((prev) => ({
      ...prev,
      isEditOpen: false,
      isDeleteOpen: false,
      isAddOpen: false,
      selectedUser: null,
      newUsername: "",
      newPassword: "",
      isActionLoading: false,
    }));
  }, []);

  const handleAddUser = useCallback(async () => {
    const { newUsername, newPassword } = modalState;
    if (!newUsername || !newPassword) {
      toast.error("Логин и пароль обязательны!");
      return;
    }
    setModalState((prev) => ({ ...prev, isActionLoading: true }));
    try {
      await apiRequest("https://zaporka-backend.onrender.com/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify({ username: newUsername, password: newPassword }),
      });
      toast.success("Пользователь успешно добавлен!");
      await fetchUsers();
      closeModal();
    } catch (err) {
      toast.error(`Ошибка добавления: ${err.message}`);
    } finally {
      setModalState((prev) => ({ ...prev, isActionLoading: false }));
    }
  }, [modalState, fetchUsers, closeModal]);

  const openEditModal = useCallback((user) => {
    if (!user?._id) return;
    setModalState((prev) => ({
      ...prev,
      isEditOpen: true,
      selectedUser: user,
      newUsername: user.username || "",
      newPassword: "",
    }));
  }, []);

  const openDeleteModal = useCallback((user) => {
    if (!user?._id) return;
    setModalState((prev) => ({ ...prev, isDeleteOpen: true, selectedUser: user }));
  }, []);

  const handleEditUser = useCallback(async () => {
    const { selectedUser, newUsername, newPassword } = modalState;
    if (!selectedUser?._id) return;
    setModalState((prev) => ({ ...prev, isActionLoading: true }));
    try {
      await apiRequest(`https://zaporka-backend.onrender.com/api/v1/users/${selectedUser._id}`, {
        method: "PUT",
        body: JSON.stringify({ username: newUsername, password: newPassword || undefined }),
      });
      toast.success("Пользователь успешно обновлен!");
      await fetchUsers();
      closeModal();
    } catch (err) {
      toast.error(`Ошибка редактирования: ${err.message}`);
    } finally {
      setModalState((prev) => ({ ...prev, isActionLoading: false }));
    }
  }, [modalState, fetchUsers, closeModal]);

  const handleDeleteUser = useCallback(async () => {
    const { selectedUser } = modalState;
    if (!selectedUser?._id) return;
    setModalState((prev) => ({ ...prev, isActionLoading: true }));
    try {
      await apiRequest(`https://zaporka-backend.onrender.com/api/v1/users/${selectedUser._id}`, {
        method: "DELETE",
      });
      toast.success("Пользователь успешно удален!");
      await fetchUsers();
      closeModal();
    } catch (err) {
      toast.error(`Ошибка удаления: ${err.message}`);
    } finally {
      setModalState((prev) => ({ ...prev, isActionLoading: false }));
    }
  }, [modalState, fetchUsers, closeModal]);

  const filteredAndSortedUsers = useMemo(() => {
    let result = [...data];
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter((user) =>
        [user._id, user.username?.toLowerCase()].some((field) => field?.toString().includes(lowerSearchTerm))
      );
    }
    if (sortedBy) {
      result.sort((a, b) => {
        const aValue = a[sortedBy]?.toString() || "";
        const bValue = b[sortedBy]?.toString() || "";
        return aValue > bValue ? 1 : -1;
      });
    }
    return result;
  }, [data, searchTerm, sortedBy]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    return filteredAndSortedUsers.slice(startIndex, endIndex);
  }, [filteredAndSortedUsers, currentPage, usersPerPage]);

  if (loading) return <Loading />;
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-base-100">
        <p className="text-error text-lg mb-6 font-medium">Ошибка: {error}</p>
        <motion.button
          className="btn btn-primary"
          onClick={fetchUsers}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Попробовать снова
        </motion.button>
      </div>
    );
  }

  const columns = [
    {
      key: "number",
      label: "№",
      sortable: false,
      render: (_, __, index) => (currentPage - 1) * usersPerPage + index + 1,
    },
    { key: "username", label: "Имя пользователя", sortable: true },
  ];

  const actions = [
    {
      icon: <FiEdit className="text-info" />,
      onClick: (user) => openEditModal(user),
      className: "btn btn-ghost btn-sm tooltip tooltip-info",
    },
    {
      icon: <FiTrash2 className="text-error" />,
      onClick: (user) => openDeleteModal(user),
      className: "btn btn-ghost btn-sm tooltip tooltip-error",
    },
  ];

  return (
    <div className="container mx-auto min-h-screen p-4 md:p-6 bg-base-100 rounded-xl shadow-xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-base-content flex items-center">
          <FiUsers className="mr-2 text-primary" size={28} /> Все пользователи
        </h2>
      </motion.div>

      <div className="card bg-base-200 p-4 mb-6 shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-1/3">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/60" size={18} />
            <input
              type="text"
              placeholder="Поиск"
              className="input input-bordered w-full pl-10 pr-4 py-2 focus:ring-2 focus:ring-primary transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              className="select select-bordered w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-primary"
              value={usersPerPage}
              onChange={(e) => setUsersPerPage(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <motion.button
              className="btn btn-primary flex items-center gap-2"
              onClick={openAddModal}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiUserPlus size={16} /> Добавить
            </motion.button>
            <motion.button
              className="btn btn-outline flex items-center gap-2"
              onClick={handleRefresh}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={isRefreshing ? { rotate: 360 } : {}}
              transition={{ duration: 0.5 }}
            >
              <FiRefreshCcw size={16} /> Обновить
            </motion.button>
          </div>
        </div>
      </div>

      <div className=" bg-base-200 shadow-md">
        <CustomTable
          data={paginatedUsers}
          columns={columns}
          actions={actions}
          emptyMessage="Пользователи не найдены"
          onSort={setSortedBy}
          className="w-full"
        />
      </div>

      <div className="mt-6 flex justify-center">
        <CustomPagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredAndSortedUsers.length / usersPerPage)}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Add User Modal */}
      {modalState.isAddOpen && (
        <div className="modal modal-open">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="modal-box w-11/12 max-w-md bg-base-100 shadow-xl"
          >
            <h3 className="font-bold text-xl mb-4">Добавить пользователя</h3>
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Имя пользователя</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full focus:ring-2 focus:ring-primary"
                  value={modalState.newUsername}
                  onChange={(e) => setModalState((prev) => ({ ...prev, newUsername: e.target.value }))}
                  disabled={modalState.isActionLoading}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Пароль</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered w-full focus:ring-2 focus:ring-primary"
                  value={modalState.newPassword}
                  onChange={(e) => setModalState((prev) => ({ ...prev, newPassword: e.target.value } ))}
                  disabled={modalState.isActionLoading}
                />
              </div>
            </div>
            <div className="modal-action mt-6 flex justify-end gap-3">
              <motion.button
                className="btn btn-primary"
                onClick={handleAddUser}
                disabled={modalState.isActionLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {modalState.isActionLoading ? <span className="loading loading-spinner" /> : "Добавить"}
              </motion.button>
              <motion.button
                className="btn btn-ghost"
                onClick={closeModal}
                disabled={modalState.isActionLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Отмена
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit User Modal */}
      {modalState.isEditOpen && modalState.selectedUser && (
        <div className="modal modal-open">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="modal-box w-11/12 max-w-md bg-base-100 shadow-xl"
          >
            <h3 className="font-bold text-xl mb-4">Изменить пользователя</h3>
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Новое имя пользователя</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full focus:ring-2 focus:ring-primary"
                  value={modalState.newUsername}
                  onChange={(e) => setModalState((prev) => ({ ...prev, newUsername: e.target.value }))}
                  disabled={modalState.isActionLoading}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Новый пароль (опционально)</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered w-full focus:ring-2 focus:ring-primary"
                  value={modalState.newPassword}
                  onChange={(e) => setModalState((prev) => ({ ...prev, newPassword: e.target.value }))}
                  disabled={modalState.isActionLoading}
                />
              </div>
            </div>
            <div className="modal-action mt-6 flex justify-end gap-3">
              <motion.button
                className="btn btn-primary"
                onClick={handleEditUser}
                disabled={modalState.isActionLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {modalState.isActionLoading ? <span className="loading loading-spinner" /> : "Сохранить"}
              </motion.button>
              <motion.button
                className="btn btn-ghost"
                onClick={closeModal}
                disabled={modalState.isActionLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Отмена
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete User Modal */}
      {modalState.isDeleteOpen && modalState.selectedUser && (
        <div className="modal modal-open">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="modal-box w-11/12 max-w-sm bg-base-100 shadow-xl"
          >
            <h3 className="font-bold text-xl mb-4">Удаление пользователя</h3>
            <p className="py-2 text-base-content/80">Вы действительно хотите удалить пользователя <span className="font-medium">{modalState.selectedUser.username}</span>?</p>
            <div className="modal-action mt-6 flex justify-end gap-3">
              <motion.button
                className="btn btn-error"
                onClick={handleDeleteUser}
                disabled={modalState.isActionLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {modalState.isActionLoading ? <span className="loading loading-spinner" /> : "Удалить"}
              </motion.button>
              <motion.button
                className="btn btn-ghost"
                onClick={closeModal}
                disabled={modalState.isActionLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Отмена
              </motion.button>
            </div>
          </motion.div>
        </div> 
      )}
    </div>
  );
};

export default AllUsers;