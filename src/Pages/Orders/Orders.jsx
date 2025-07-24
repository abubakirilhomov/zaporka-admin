import React, { useState, useEffect, useRef } from "react";
import { MdOutlinePlaylistAdd, MdClose, MdPayment } from "react-icons/md";
import CustomTable from "../../Components/CustomTable/CustomTable";
import Loading from "../../Components/Loading/Loading";
import CustomPagination from "../../Components/CustomPagination/CustomPagination";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from 'react-toastify';

const Orders = () => {
  
  const [orders, setOrders] = useState([]);
  const [ordersWithPayStatus, setOrdersWithPayStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPayStatus, setIsLoadingPayStatus] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(ordersWithPayStatus.length / itemsPerPage);
  const token = localStorage.getItem("token");
  const apiUrl = `${process.env.REACT_APP_API_URL}/api/v1/orders`;

  const fetchedOnce = useRef(false);

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = ordersWithPayStatus.slice(indexOfFirstItem, indexOfLastItem);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(apiUrl, { headers });
      if (!res.ok) throw new Error("Ошибка при загрузке заказов");
      const data = await res.json();
      setOrders((data || []).reverse());
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPayStatuses = async (ordersList) => {
    if (!Array.isArray(ordersList) || ordersList.length === 0) return;
    setIsLoadingPayStatus(true);
    try {
      const updated = await Promise.all(
        ordersList.map(async (order) => {
          try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/orders/${order._id}`, {
              headers,
            });
            const orderData = await res.json();
            return {
              ...order,
              firstName: order.firstName || "",
              lastName: order.lastName || "",
              phoneNumber: order.phoneNumber || "",
              address: order.address || "",
              totalPrice: order.totalPrice || 0,
              isPaid: orderData?.isPaid || false,
            };
          } catch {
            return {
              ...order,
              isPaid: false,
            };
          }
        })
      );
      setOrdersWithPayStatus(updated);
    } catch (err) {
      console.error("Ошибка статуса оплаты:", err);
    } finally {
      setIsLoadingPayStatus(false);
    }
  };

  const handleChangeStatus = async (order) => {
    if (!order || !order._id) {
      console.error("order yo'q");
      return;
    }

    setIsUpdatingStatus(true);
    try {
      const newStatus = !order.isPaid; // Toggle the current payment status
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/orders/${order._id}/pay`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPaid: newStatus }),
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Ruxsat yo‘q (403). Token noto‘g‘ri yoki yo‘q.");
        }
        throw new Error("Statusni yangilashda xatolik");
      }

      const updatedOrder = await response.json();

      setOrders(prev =>
        prev.map(o =>
          o._id === updatedOrder._id ? updatedOrder : o
        )
      );
      setOrdersWithPayStatus(prev =>
        prev.map(o =>
          o._id === updatedOrder._id ? updatedOrder : o
        )
      );

      toast.success("Status muvaffaqiyatli yangilandi");
    } catch (err) {
      console.error("PATCH xato:", err);
      toast.error(err.message);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const openModal = (order) => {
    setModalData(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModalData(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!fetchedOnce.current) {
      fetchedOnce.current = true;
      fetchOrders();
    }
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      fetchPayStatuses(orders);
    }
  }, [orders]);

  const columns = [
    {
      key: "firstName",
      label: "Имя",
      render: (val) => val || "-",
    },
    {
      key: "lastName",
      label: "Фамилия",
      render: (val) => val || "-",
    },
    {
      key: "phoneNumber",
      label: "Телефон",
      render: (val) => val || "-",
    },
    {
      key: "address",
      label: "Адрес",
      render: (val) => val || "-",
    },
    {
      key: "totalPrice",
      label: "Сумма",
      render: (val) => `${val.toLocaleString()} UZS`,
    },
    {
      key: "isPaid",
      label: "Оплата",
      render: (val) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-bold ${val ? "bg-success text-base-300" : "bg-error text-base-300"}`}
        >
          {val ? "Оплачено" : "Не оплачено"}
        </span>
      ),
    },
    {
      key: "updatePayment",
      label: "Обновить оплату",
      render: (_, order) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleChangeStatus(order);
          }}
          className={`btn btn-sm flex items-center gap-1 ${
            isUpdatingStatus || order.isPaid
              ? "btn-disabled bg-base-300 text-base-content cursor-not-allowed"
              : "btn-warning"
          }`}
          disabled={isUpdatingStatus || order.isPaid}
        >
          <MdPayment />
          Обновить
        </button>
      ),
    },
    
  ];

  const actions = [
    {
      label: "Посмотреть детали",
      icon: <MdOutlinePlaylistAdd />,
      onClick: (order) => openModal(order),
      className: "btn-primary",
    },
  ];

  const modalVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
  };

  if (isLoading || isLoadingPayStatus) return <Loading />;
  if (error) return <div className="text-error">{error}</div>;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-3xl font-bold">Заказы</p>
      </div>

      <CustomTable data={currentOrders} columns={columns} onRowClick={openModal} actions={actions} />

      <CustomPagination
        totalItems={ordersWithPayStatus.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalPages={totalPages}
      />

      <AnimatePresence>
        {isModalOpen && modalData && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            onClick={closeModal}
          >
            <motion.div
              className="bg-base-100 rounded-3xl shadow-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-primary">Детали заказа</h3>
                <button className="btn btn-sm btn-circle btn-ghost" onClick={closeModal}>
                  <MdClose className="text-xl" />
                </button>
              </div>
              <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-base-content/70">Имя:</p>
                    <p>{modalData.firstName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-base-content/70">Фамилия:</p>
                    <p>{modalData.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-base-content/70">Телефон:</p>
                    <p>{modalData.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-base-content/70">Адрес:</p>
                    <p>{modalData.address}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-base-content/70">Сумма:</p>
                    <p>{modalData.totalPrice?.toLocaleString()} UZS</p>
                  </div>
                  {Array.isArray(modalData.products) && (
                    <div className="sm:col-span-2">
                      <p className="text-sm font-medium text-base-content/70">Товары:</p>
                      <ul className="list-disc list-inside">
                        {modalData.products.map((prod, idx) => (
                          <li key={idx}>{prod?.title || "Без названия"}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-4 items-center justify-end">
                <button className="btn btn-outline btn-error" onClick={closeModal}>
                  Закрыть
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;
