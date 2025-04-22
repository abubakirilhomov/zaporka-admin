import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { toast } from "react-toastify";
import { MdOutlineAddBox, MdExpandMore, MdExpandLess } from "react-icons/md";
import { motion } from "framer-motion";
import Loading from "../../Components/Loading/Loading";
import CustomTable from "../../Components/CustomTable/CustomTable";
import CustomPagination from "../../Components/CustomPagination/CustomPagination";

const StockManager = () => {
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const token = localStorage.getItem("token");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("groups"); // "groups" или "items"
  const [expandedRows, setExpandedRows] = useState({});
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
    }
  }, [currentPage, token, viewMode]);

  const data = receiptsData?.data && Array.isArray(receiptsData.data) ? receiptsData.data : [];
  const total = receiptsData?.total || 0;

  if (!token) {
    return <div className="text-error text-center">Пожалуйста, войдите, чтобы просмотреть поступления на склад.</div>;
  }
  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <div className="text-error text-center">Ошибка: {error}</div>;
  }

  const toggleRow = (rowId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
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
        const total = row.items?.reduce((sum, item) => sum + item.costPrice * item.amount, 0) || 0;
        return `${total.toFixed(2)} UZS`;
      },
    },
    {
      key: "actions",
      label: "Действия",
      render: (value, row) => (
        <button
          className="btn btn-sm btn-primary"
          onClick={() => toggleRow(row._id)}
        >
          {expandedRows[row._id] ? <MdExpandLess /> : <MdExpandMore />}
        </button>
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
      render: (value) => `${value.toFixed(2)} UZS`,
    },
    {
      key: "sellingPrice",
      label: "Цена продажи",
      render: (value) => `${value.toFixed(2)} UZS`,
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
      render: (value) => `${value.toFixed(2)} UZS`,
    },
    {
      key: "sellingPrice",
      label: "Цена продажи",
      render: (value) => `${value.toFixed(2)} UZS`,
    },
    {
      key: "addedBy",
      label: "Добавил",
      render: (value) => value || "Неизвестно",
    },
  ];

  const renderNestedTable = (row) => {
    if (!expandedRows[row._id] || !row.items?.length) return null;
    return (
      <div className="p-4 bg-base-200 rounded-lg mt-2">
        <CustomTable
          data={row.items}
          columns={nestedColumns}
          actions={[]}
          emptyMessage="Товары отсутствуют"
        />
      </div>
    );
  };

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
              onClick={() => setViewMode("groups")}
            >
              Группы
            </button>
            <button
              className={`tab tab-bordered ${viewMode === "items" ? "tab-active" : ""}`}
              onClick={() => setViewMode("items")}
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
          <CustomTable
            data={data}
            columns={viewMode === "groups" ? groupColumns : itemColumns}
            actions={[]}
            emptyMessage={viewMode === "groups" ? "Накладные не найдены" : "Товары не найдены"}
            renderNestedRow={viewMode === "groups" ? renderNestedTable : undefined}
          />
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
    </motion.div>
  );
};

export default StockManager;