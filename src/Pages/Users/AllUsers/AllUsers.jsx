import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiRefreshCcw, FiUsers, FiEdit, FiTrash2 } from "react-icons/fi"; // Используем react-icons
import CustomPagination from "../../../Components/CustomPagination/CustomPagination";
import CustomTable from "../../../Components/CustomTable/CustomTable";
import Loading from "../../../Components/Loading/Loading";

/**
 * @typedef {Object} User
 * @property {string} _id - Уникальный идентификатор пользователя
 * @property {string} username - Имя пользователя
 * @property {string} password - Хэшированный пароль
 * @property {string} [createdAt] - Дата создания
 * @property {string} updatedAt - Дата последнего обновления
 * @property {number} __v - Версия документа
 */

/**
 * Компонент для отображения и управления списком пользователей.
 * @returns {JSX.Element} Компонент AllUsers
 */
const AllUsers = () => {
  // Состояния для пагинации, поиска и сортировки
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortedBy, setSortedBy] = useState(null);

  // Состояния для данных и их загрузки
  const [data, setData] = useState(/** @type {User[]} */ ([]));
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Состояния для модалок
  const [modalState, setModalState] = useState({
    isEditOpen: false,
    isDeleteOpen: false,
    selectedUser: /** @type {User | null} */ (null),
    newUsername: "",
    newPassword: "",
    isActionLoading: false,
  });

  /**
   * Функция для выполнения API-запросов.
   * @template T
   * @param {string} url - URL запроса
   * @param {RequestInit} options - Опции запроса
   * @returns {Promise<T>} Результат запроса
   */
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
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      console.error(`Ошибка API-запроса (${url}):`, err);
      throw err;
    }
  };

  // Функция для получения списка пользователей
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiRequest("https://zaporka-backend.onrender.com/api/v1/users", { method: "GET" });
      const users = Array.isArray(result) ? result : [];
      setData(users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Функция для обновления данных с анимацией
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchUsers().finally(() => setTimeout(() => setIsRefreshing(false), 1000));
  }, [fetchUsers]);

  // Функция для открытия модалки редактирования
  const openEditModal = useCallback((user) => {
    if (!user?._id) {
      console.error("Пользователь не определен или не имеет _id:", user);
      return;
    }
    setModalState((prev) => ({
      ...prev,
      isEditOpen: true,
      selectedUser: user,
      newUsername: user.username || "",
      newPassword: "",
    }));
  }, []);

  // Функция для открытия модалки удаления
  const openDeleteModal = useCallback((user) => {
    if (!user?._id) {
      console.error("Пользователь не определен или не имеет _id:", user);
      return;
    }
    setModalState((prev) => ({
      ...prev,
      isDeleteOpen: true,
      selectedUser: user,
    }));
  }, []);

  // Функция для закрытия модалок
  const closeModal = useCallback(() => {
    setModalState((prev) => ({
      ...prev,
      isEditOpen: false,
      isDeleteOpen: false,
      selectedUser: null,
      newUsername: "",
      newPassword: "",
      isActionLoading: false,
    }));
  }, []);

  // Функция для редактирования пользователя
  const handleEditUser = useCallback(async () => {
    const { selectedUser, newUsername, newPassword } = modalState;
    if (!selectedUser?._id) return;

    setModalState((prev) => ({ ...prev, isActionLoading: true }));
    try {
      await apiRequest(`https://zaporka-backend.onrender.com/api/v1/users/${selectedUser._id}`, {
        method: "PUT",
        body: JSON.stringify({
          username: newUsername,
          password: newPassword || undefined,
        }),
      });
      await fetchUsers();
      closeModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setModalState((prev) => ({ ...prev, isActionLoading: false }));
    }
  }, [modalState, fetchUsers, closeModal]);

  // Функция для удаления пользователя
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

  // Мемоизация отфильтрованных и отсортированных данных
  const filteredAndSortedUsers = useMemo(() => {
    let result = [...data];

    // Фильтрация
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter((user) =>
        [user._id, user.username?.toLowerCase()].some((field) =>
          field?.toString().includes(lowerSearchTerm)
        )
      );
    }

    // Сортировка
    if (sortedBy) {
      result.sort((a, b) => {
        const aValue = a[sortedBy]?.toString() || "";
        const bValue = b[sortedBy]?.toString() || "";
        return aValue > bValue ? 1 : -1;
      });
    }

    return result;
  }, [data, searchTerm, sortedBy]);

  // Обработка загрузки и ошибок
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

  // Определение колонок таблицы
  const columns = [
    { key: "_id", label: "ID", sortable: true },
    { key: "username", label: "Имя пользователя", sortable: true },
    {
      key: "actions",
      label: "Действия",
      render: (user) => (
        <div className="flex gap-2 justify-center">
          <button
            className="btn btn-ghost btn-sm tooltip tooltip-primary"
            data-tip="Изменить"
            onClick={() => openEditModal(user)}
            disabled={!user?._id}
          >
            <FiEdit size={16} />
          </button>
          <button
            className="btn btn-ghost btn-sm tooltip tooltip-error"
            data-tip="Удалить"
            onClick={() => openDeleteModal(user)}
            disabled={!user?._id}
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center p-5 bg-base-100 shadow-lg rounded-lg">
      {/* Заголовок */}
      <h2 className="text-3xl font-bold text-center mb-6 text-base-content flex items-center">
        <FiUsers className="mr-2 text-primary" size={30} /> Все пользователи
      </h2>

      {/* Панель управления */}
      <div className="flex justify-between w-full mb-4 items-center">
        <div className="relative w-1/3">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
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
          <FiRefreshCcw size={16} className="mr-1" /> Обновить
        </motion.button>
      </div>

      {/* Таблица */}
      <div className="w-full">
        <CustomTable
          data={filteredAndSortedUsers}
          columns={columns}
          emptyMessage="Пользователи не найдены"
          onSort={setSortedBy}
        />
      </div>

      {/* Пагинация */}
      <div className="mt-4">
        <CustomPagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredAndSortedUsers.length / usersPerPage)}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Модалка для редактирования */}
      {modalState.isEditOpen && modalState.selectedUser && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Изменить пользователя</h3>
            <div className="py-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Новое имя пользователя</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
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
                  className="input input-bordered"
                  value={modalState.newPassword}
                  onChange={(e) => setModalState((prev) => ({ ...prev, newPassword: e.target.value }))}
                  disabled={modalState.isActionLoading}
                />
              </div>
            </div>
            <div className="modal-action">
              <button
                className="btn btn-primary"
                onClick={handleEditUser}
                disabled={modalState.isActionLoading}
              >
                {modalState.isActionLoading ? (
                  <span className="loading loading-spinner" />
                ) : (
                  "Сохранить"
                )}
              </button>
              <button
                className="btn"
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
          <div className="modal-box">
            <h3 className="font-bold text-lg">Удаление пользователя</h3>
            <p className="py-4">Вы действительно хотите удалить пользователя?</p>
            <div className="modal-action">
              <button
                className="btn btn-error"
                onClick={handleDeleteUser}
                disabled={modalState.isActionLoading}
              >
                {modalState.isActionLoading ? (
                  <span className="loading loading-spinner" />
                ) : (
                  "Да, удалить"
                )}
              </button>
              <button
                className="btn"
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