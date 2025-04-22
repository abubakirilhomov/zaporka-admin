import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { toast } from "react-toastify";
import { MdOutlineAddBox, MdDelete, MdClose, MdOpenInNew } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "../../Components/Loading/Loading";
import CustomTable from "../../Components/CustomTable/CustomTable";
import CustomPagination from "../../Components/CustomPagination/CustomPagination";

const StockManager = () => {
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("groups");
  const [isDeleting, setIsDeleting] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const limit = 10;

  const authHeaders = token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    : { "Content-Type": "application/json" };

  const fetchUrl =
    viewMode === "groups"
      ? `${apiUrl}/api/v1/stock/history?page=${currentPage}&limit=${limit}`
      : `${apiUrl}/api/v1/stock/history-items?page=${currentPage}&limit=${limit}`;

  const { data: receiptsData, loading, error, revalidate } = useFetch(
    fetchUrl,
    { headers: authHeaders },
    false
  );

  useEffect(() => {
    if (token) {
      revalidate();
    } else {
      toast.error("Пожалуйста, войдите в систему");
      navigate("/login");
    }
  }, [currentPage, token, viewMode, navigate]);

  useEffect(() => {
    if (receiptsData) {
      console.log("Receipts data:", receiptsData);
    }
  }, [receiptsData]);

  useEffect(() => {
    if (error && error.includes("401")) {
      toast.error("Сессия истекла. Пожалуйста, войдите снова.");
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [error, navigate]);

  const data = receiptsData?.data && Array.isArray(receiptsData.data) ? receiptsData.data : [];
  const total = receiptsData?.total || 0;

  const handleDeleteInvoice = async (invoiceId) => {


    setIsDeleting(invoiceId);
    try {
      const response = await fetch(`${apiUrl}/api/v1/stock/invoice/${invoiceId}`, {
        method: "DELETE",
        headers: authHeaders,
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Не удалось удалить накладную");
      }

      toast.success("Накладная успешно удалена");
      revalidate();
    } catch (err) {
      toast.error(err.message || "Ошибка при удалении накладной");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleRowClick = (row) => {
    setSelectedInvoice(row);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInvoice(null);
  };

  const groupColumns = [
    {
      key: "source",
      label: "Источник",
      render: (value) => value || "Не указано",
    },
    {
      key: "date",
      label: "Дата",
      render: (value) =>
        value
          ? new Date(value).toLocaleString("ru-RU", {
              timeZone: "Asia/Tashkent",
              hour12: false,
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
          : "Н/Д",
    },
    {
      key: "itemsCount",
      label: "Количество товаров",
      render: (value, row) => `${row.items?.length || 0} товаров`,
    },
    {
      key: "totalCost",
      label: "Общая стоимость",
      render: (value, row) => {
        const total = row.items?.reduce((sum, item) => sum + (item.costPrice || 0) * (item.amount || 0), 0) || 0;
        return `${total.toFixed(2)} UZS`;
      },
    },
    {
      key: "actions",
      label: "Действия",
      render: (value, row) => (
        <div className="flex gap-2">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => handleRowClick(row)}
          >
            Открыть <MdOpenInNew />
          </button>
        </div>
      ),
    },
  ];

  const itemColumns = [
    {
      key: "productTitle",
      label: "Продукт",
      render: (value, row) => row.product?.title || "Н/Д",
    },
    { key: "amount", label: "Количество" },
    {
      key: "costPrice",
      label: "Себестоимость",
      render: (value) => (value ? `${value.toFixed(2)} UZS` : "Н/Д"),
    },
    {
      key: "sellingPrice",
      label: "Цена продажи",
      render: (value) => (value ? `${value.toFixed(2)} UZS` : "Н/Д"),
    },
    {
      key: "addedBy",
      label: "Добавил",
      render: (value) => value || "Неизвестно",
    },
    {
      key: "invoiceSource",
      label: "Источник",
      render: (value, row) => row.invoice?.source || "Не указано",
    },
    {
      key: "createdAt",
      label: "Дата",
      render: (value) =>
        value
          ? new Date(value).toLocaleString("ru-RU", {
              timeZone: "Asia/Tashkent",
              hour12: false,
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
          : "Н/Д",
    },
  ];

  const nestedColumns = [
    {
      key: "productTitle",
      label: "Продукт",
      render: (value, row) => row.product?.title || "Н/Д",
    },
    { key: "amount", label: "Количество" },
    {
      key: "costPrice",
      label: "Себестоимость",
      render: (value) => (value ? `${value.toFixed(2)} UZS` : "Н/Д"),
    },
    {
      key: "sellingPrice",
      label: "Цена продажи",
      render: (value) => (value ? `${value.toFixed(2)} UZS` : "Н/Д"),
    },
    {
      key: "addedBy",
      label: "Добавил",
      render: (value) => value || "Неизвестно",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } },
  };

  if (!token) {
    return <div className="text-error text-center">Пожалуйста, войдите, чтобы просмотреть поступления на склад.</div>;
  }

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-error text-center">
        <p>Ошибка: {error}</p>
        <button className="btn btn-primary mt-4" onClick={() => revalidate()}>
          Повторить
        </button>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-base-100 to-base-300 p-4 sm:p-6 lg:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="max-w-7xl mx-auto bg-base-100/50 backdrop-blur-xl rounded-3xl shadow-2xl p-6"
        variants={itemVariants}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-6 text-center">
          Поступления на склад
        </h2>

        <div className="flex justify-between mb-4">
          <div className="tabs">
            <button
              className={`tab tab-bordered ${viewMode === "groups" ? "tab-active" : ""}`}
              onClick={() => {
                setViewMode("groups");
                setCurrentPage(1);
              }}
            >
              Группы
            </button>
            <button
              className={`tab tab-bordered ${viewMode === "items" ? "tab-active" : ""}`}
              onClick={() => {
                setViewMode("items");
                setCurrentPage(1);
              }}
            >
              Отдельные товары
            </button>
          </div>

          <Link to="/add-invoice">
            <motion.button
              className="btn btn-primary flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MdOutlineAddBox className="text-xl" />
              Новое поступление
            </motion.button>
          </Link>
        </div>

        <motion.div variants={itemVariants}>
          {data.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg text-base-content/70">
                {viewMode === "groups" ? "Накладные не найдены" : "Товары не найдены"}
              </p>
              <p className="text-sm text-base-content/50 mt-2">
                Попробуйте добавить новое поступление, чтобы начать.
              </p>
            </div>
          ) : (
            <CustomTable
              data={data}
              columns={viewMode === "groups" ? groupColumns : itemColumns}
              actions={[]}
              emptyMessage={viewMode === "groups" ? "Накладные не найдены" : "Товары не найдены"}
              onRowClick={viewMode === "groups" ? handleRowClick : undefined}
            />
          )}
        </motion.div>

        {total > 0 && (
          <motion.div variants={itemVariants}>
            <CustomPagination
              currentPage={currentPage}
              totalPages={Math.ceil(total / limit)}
              onPageChange={setCurrentPage}
            />
          </motion.div>
        )}
      </motion.div>

      {/* Модальное окно */}
      <AnimatePresence>
        {isModalOpen && selectedInvoice && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeModal}
          >
            <motion.div
              className="bg-base-100 rounded-3xl shadow-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-primary">Детали накладной</h3>
                <button className="btn btn-sm btn-circle btn-ghost" onClick={closeModal}>
                  <MdClose className="text-xl" />
                </button>
              </div>

              <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg shadow-inner">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-base-content/70">ID накладной:</p>
                    <p className="text-base-content">{selectedInvoice._id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-base-content/70">Источник:</p>
                    <p className="text-base-content">{selectedInvoice.source || "Не указано"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-base-content/70">Дата:</p>
                    <p className="text-base-content">
                      {selectedInvoice.date
                        ? new Date(selectedInvoice.date).toLocaleString("ru-RU", {
                            timeZone: "Asia/Tashkent",
                            hour12: false,
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })
                        : "Н/Д"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-base-content/70">Общее количество товаров:</p>
                    <p className="text-base-content">{selectedInvoice.items?.length || 0} товаров</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-base-content/70">Общая стоимость:</p>
                    <p className="text-base-content">
                      {(selectedInvoice.items?.reduce((sum, item) => sum + (item.costPrice || 0) * (item.amount || 0), 0) || 0).toFixed(2)} UZS
                    </p>
                  </div>
                </div>
              </div>

              <h4 className="text-lg font-semibold text-primary mb-2">Товары в накладной</h4>
              <CustomTable
                data={selectedInvoice.items || []}
                columns={nestedColumns}
                actions={[]}
                emptyMessage="Товары отсутствуют"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StockManager;