import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MdOutlineAddBox, MdClose } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Loading from "../../Components/Loading/Loading";
import CustomTable from "../../Components/CustomTable/CustomTable";
import CustomPagination from "../../Components/CustomPagination/CustomPagination";
import ErrorBoundary from "./ErrorBoundary";
import ViewModeTabs from "./ViewModeTabs";
import { itemVariants, modalVariants } from "./animationVariants";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const nestedColumns = [
  {
    label: "Product",
    key: "product.title",
    render: (value, row) => row?.product?.title,
  },
  { label: "Quantity", key: "amount" },
  {
    label: "Price",
    key: "sellingPrice",
    render: (value) =>
      value.toLocaleString("ru-RU", { minimumFractionDigits: 2 }) + " UZS",
  },
];

const SellDashboard = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("groups");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [salesData, setSalesData] = useState({ data: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const limit = 10;

  const token = localStorage.getItem("token");
  const authHeaders = token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };

  const fetchUrl =
    viewMode === "groups"
      ? `${API_URL}/api/v1/stock/sales?page=${currentPage}&limit=${limit}`
      : `${API_URL}/api/v1/stock/sale-logs?page=${currentPage}&limit=${limit}`;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    console.log("API Request:", {
      url: fetchUrl,
      method: "GET",
      headers: authHeaders,
    });

    try {
      const response = await axios.get(fetchUrl, { headers: authHeaders });
      console.log("API Response:", {
        url: fetchUrl,
        status: response.status,
        data: response.data,
      });
      setSalesData(response?.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      console.error("API Error:", {
        url: fetchUrl,
        status: err.response?.status,
        error: errorMessage,
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  useEffect(() => {
    if (!token) {
      console.log("Authentication Error: No token found");
      toast.error("Please log in to view sales.");
      navigate("/login");
      return;
    }

    fetchData();
  }, [token, navigate, viewMode, currentPage]);

  useEffect(() => {
    if (error?.includes("401")) {
      console.log("Authentication Error: Session expired");
      toast.error("Session expired. Please log in again.");
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [error, navigate]);

  const columns =
    viewMode === "groups"
      ? [
          { label: "Дата", key: "date" },
          { label: "Количество", key: "quantity" },
          { label: "Продукты", key: "products" },
          { label: "Общая стоимость", key: "total" },
          { label: "Цена продажи", key: "soldBy" },
        ]
      : [
          {
            label: "Продукт",
            key: "product",
            render: (value, row) => row?.product,
          },
          { label: "Количество", key: "quantity" },
          { label: "Цена", key: "price" },
        ];

  const handleRowClick = useCallback((row) => {
    console.log("Row Clicked:", { row });
    setSelectedInvoice(row);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    console.log("Closing Modal");
    setIsModalOpen(false);
    setSelectedInvoice(null);
  }, []);

  const data =
    viewMode === "groups"
      ? salesData?.data.map((sale) => {
          const mappedData = {
            id: sale._id,
            date: new Date(sale.date).toLocaleDateString("ru-RU"),
            quantity: sale.items.reduce((sum, item) => sum + item.amount, 0),
            products: sale.items
              .map((item) => item.product?.title || "Unknown")
              .join(", "),
            total: sale.items
              .reduce((sum, item) => sum + item.sellingPrice * item.amount, 0)
              .toLocaleString("ru-RU", { minimumFractionDigits: 2 }),
            soldBy: sale.soldBy,
            items: sale.items,
          };
          console.log("Mapped Sale Data:", mappedData);
          return mappedData;
        }) || []
      : salesData?.data.map((log) => {
          const mappedData = {
            id: log._id,
            product: log.product?.title || "Unknown",
            quantity: log.amount,
            price: Number(log.sellingPrice || 0).toLocaleString("ru-RU", {
              minimumFractionDigits: 2,
            }),
          };
          console.log("Mapped Sale Log Data:", mappedData);
          return mappedData;
        }) || [];

  const total = salesData?.total || 0;
  console.log(salesData.data);
  if (!token) {
    return (
      <div className="text-error text-center" role="alert">
        Please log in to view sales.
      </div>
    );
  }

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="text-error text-center" role="alert">
        <p>Error: {error}</p>
        <button
          className="btn btn-primary mt-4"
          onClick={() => {
            console.log("Retrying API Request");
            fetchData();
          }}
          aria-label="Retry fetching data"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <motion.div
        className="pr-8 py-5"
        initial="hidden"
        animate="visible"
        variants={itemVariants}
      >
        <div className="max-w-7xl mx-auto bg-base-100/50 backdrop-blur-xl rounded-3xl shadow-2xl p-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
            Sales Dashboard
          </h2>

          <div className="flex justify-between mb-4">
            <ViewModeTabs
              viewMode={viewMode}
              setViewMode={(mode) => {
                console.log("View Mode Changed:", { newMode: mode });
                setViewMode(mode);
                setCurrentPage(1);
                setSalesData({ data: [], total: 0 }); 
              }}
              setCurrentPage={setCurrentPage}
            />
            <Link to="/add-sell" aria-label="Add new sale">
              <motion.button
                className="btn btn-primary flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MdOutlineAddBox className="text-xl" />
                New Sale
              </motion.button>
            </Link>
          </div>

          {data.length > 0 ? (
            <motion.div variants={itemVariants}>
              <CustomTable
                columns={columns}
                data={data}
                onRowClick={viewMode === "groups" ? handleRowClick : undefined}
              />
              <CustomPagination
                currentPage={currentPage}
                totalPages={Math.ceil(total / limit)}
                onPageChange={(page) => {
                  console.log("Page Changed:", { newPage: page });
                  setCurrentPage(page);
                }}
              />
            </motion.div>
          ) : (
            <p className="text-center text-base-content/70">
              No sales data available.
            </p>
          )}
        </div>
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
                  <h3 className="text-2xl font-bold text-primary">
                    Детали продажи
                  </h3>
                  <button
                    className="btn btn-sm btn-circle btn-ghost"
                    onClick={closeModal}
                  >
                    <MdClose className="text-xl" />
                  </button>
                </div>

                <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg shadow-inner">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-base-content/70">
                        ID продажи:
                      </p>
                      <p className="text-base-content">{selectedInvoice.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-base-content/70">
                        Продавец:
                      </p>
                      <p className="text-base-content">
                        {selectedInvoice.soldBy || "Не указано"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-base-content/70">
                        Дата:
                      </p>
                      <p className="text-base-content">
                        {selectedInvoice.date || "Н/Д"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-base-content/70">
                        Общее количество товаров:
                      </p>
                      <p className="text-base-content">
                        {selectedInvoice.quantity || 0} товаров
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-base-content/70">
                        Общая стоимость:
                      </p>
                      <p className="text-base-content">
                        {selectedInvoice.total} UZS
                      </p>
                    </div>
                  </div>
                </div>

                <h4 className="text-lg font-semibold text-primary mb-2">
                  Товары в продаже
                </h4>
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
    </ErrorBoundary>
  );
};

export default SellDashboard;
