import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiRefreshCcw, FiUsers, FiEdit, FiTrash2, FiUserPlus } from "react-icons/fi";
import { toast } from "react-toastify";
import CustomPagination from "../../../Components/CustomPagination/CustomPagination";
import CustomTable from "../../../Components/CustomTable/CustomTable";
import Loading from "../../../Components/Loading/Loading";

const AllUsers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortedBy, setSortedBy] = useState(null);
  const [data, setData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          ...options.headers,
        },
      });
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
      await fetchUsers();
      closeModal();
    } catch (err) {
      setError(err.message);
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
      await fetchUsers();
      closeModal();
    } catch (err) {
      setError(err.message);
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

  if (loading) return <Loading />;
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-error text-lg mb-4">Ошибка: {error}</p>
        <button className="btn btn-primary" onClick={fetchUsers}>
          Попробовать снова
        </button>
      </div>
    );
  }

  const columns = [
    {
      key: "number",
      label: "№",
      sortable: false,
      render: (_, index) => (currentPage - 1) * usersPerPage + index + 1,
    },
    { key: "username", label: "Имя пользователя", sortable: true },
    {
      key: "actions",
      label: "Действия",
      render: (user) => (
        <div className="flex gap-2 justify-center">
          <button
            className="btn btn-ghost btn-xs tooltip tooltip-primary"
            data-tip="Изменить"
            onClick={() => openEditModal(user)}
            disabled={!user?._id}
          >
            <FiEdit size={14} />
          </button>
          <button
            className="btn btn-ghost btn-xs tooltip tooltip-error"
            data-tip="Удалить"
            onClick={() => openDeleteModal(user)}
            disabled={!user?._id}
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full min-h-screen flex flex-col p-2 sm:p-4 md:p-6 lg:p-8 bg-base-100 shadow-lg rounded-lg">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 md:mb-6 text-base-content flex items-center justify-center">
        <FiUsers className="mr-2 text-primary" size={24} /> Все пользователи
      </h2>

      <div className="flex flex-col sm:flex-row justify-between w-full mb-4 items-center gap-4">
        <div className="relative w-full sm:w-1/2 md:w-1/3">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Поиск..."
            className="input input-bordered w-full pl-10 text-sm focus:ring focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <select
            className="select select-bordered text-sm w-full sm:w-auto"
            value={usersPerPage}
            onChange={(e) => setUsersPerPage(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          <motion.button
            className="btn btn-primary btn-sm flex items-center w-full sm:w-auto"
            onClick={openAddModal}
            initial={{ scale: 1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiUserPlus size={14} className="mr-1" /> Добавить
          </motion.button>
          <motion.button
            className="btn btn-primary btn-sm flex items-center w-full sm:w-auto"
            onClick={handleRefresh}
            initial={{ scale: 1 }}
            whileTap={{ scale: 0.9 }}
            animate={isRefreshing ? { y: [-3, 3, -3] } : {}}
            transition={{ duration: 0.4, repeat: isRefreshing ? Infinity : 0, repeatType: "mirror" }}
          >
            <FiRefreshCcw size={14} className="mr-1" /> Обновить
          </motion.button>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <CustomTable
          data={filteredAndSortedUsers}
          columns={columns}
          emptyMessage="Пользователи не найдены"
          onSort={setSortedBy}
        />
      </div>

      <div className="mt-4 flex justify-center">
        <CustomPagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredAndSortedUsers.length / usersPerPage)}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Модалка для добавления пользователя */}
      {modalState.isAddOpen && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-md">
            <h3 className="font-bold text-lg">Добавить пользователя</h3>
            <div className="py-4 space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Имя пользователя</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={modalState.newUsername}
                  onChange={(e) => setModalState((prev) => ({ ...prev, newUsername: e.target.value }))}
                  disabled={modalState.isActionLoading}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Пароль</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  value={modalState.newPassword}
                  onChange={(e) => setModalState((prev) => ({ ...prev, newPassword: e.target.value }))}
                  disabled={modalState.isActionLoading}
                />
              </div>
            </div>
            <div className="modal-action flex justify-end gap-2">
              <button
                className="btn btn-primary btn-sm"
                onClick={handleAddUser}
                disabled={modalState.isActionLoading}
              >
                {modalState.isActionLoading ? <span className="loading loading-spinner" /> : "Добавить"}
              </button>
              <button
                className="btn btn-sm"
                onClick={closeModal}
                disabled={modalState.isActionLoading}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модалка для редактирования */}
      {modalState.isEditOpen && modalState.selectedUser && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-md">
            <h3 className="font-bold text-lg">Изменить пользователя</h3>
            <div className="py-4 space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Новое имя пользователя</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={modalState.newUsername}
                  onChange={(e) => setModalState((prev) => ({ ...prev, newUsername: e.target.value }))}
                  disabled={modalState.isActionLoading}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Новый пароль (опционально)</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  value={modalState.newPassword}
                  onChange={(e) => setModalState((prev) => ({ ...prev, newPassword: e.target.value }))}
                  disabled={modalState.isActionLoading}
                />
              </div>
            </div>
            <div className="modal-action flex justify-end gap-2">
              <button
                className="btn btn-primary btn-sm"
                onClick={handleEditUser}
                disabled={modalState.isActionLoading}
              >
                {modalState.isActionLoading ? <span className="loading loading-spinner" /> : "Сохранить"}
              </button>
              <button
                className="btn btn-sm"
                onClick={closeModal}
                disabled={modalState.isActionLoading}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модалка для удаления */}
      {modalState.isDeleteOpen && modalState.selectedUser && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-sm">
            <h3 className="font-bold text-lg">Удаление пользователя</h3>
            <p className="py-4">Вы действительно хотите удалить пользователя?</p>
            <div className="modal-action flex justify-end gap-2">
              <button
                className="btn btn-error btn-sm"
                onClick={handleDeleteUser}
                disabled={modalState.isActionLoading}
              >
                {modalState.isActionLoading ? <span className="loading loading-spinner" /> : "Да, удалить"}
              </button>
              <button
                className="btn btn-sm"
                onClick={closeModal}
                disabled={modalState.isActionLoading}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;