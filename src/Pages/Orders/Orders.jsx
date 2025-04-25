import React, { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import CustomTable from '../../Components/CustomTable/CustomTable';
import { MdOutlinePlaylistAdd } from 'react-icons/md';
import Loading from '../../Components/Loading/Loading';
import CustomPagination from '../../Components/CustomPagination/CustomPagination';
import { AnimatePresence, motion } from "framer-motion";
import { MdClose } from "react-icons/md";

const Orders = () => {
  const apiUrl = `${process.env.REACT_APP_API_URL}/api/v1/orders`;
  const token = localStorage.getItem('token');


  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const { data } = useFetch(apiUrl, { headers }, true);

  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  const orders = Array.isArray(data)
    ? data.map((order) => ({
      ...order,
      firstName: order.firstName || '',
      lastName: order.lastName || '',   
      phoneNumber: order.phoneNumber || '',
      address: order.address || '',
      totalPrice: order.totalPrice || 0,
    }))
    : [];
  const totalPages = Math.ceil(orders.length / itemsPerPage);


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);

  const columns = [
    {
      key: 'firstName',
      label: 'Имя',
      render: (value) => value?.toString(),
    },
    {
      key: 'lastName',
      label: 'Фамилия',
      render: (value) => value?.toString(),
    },
    {
      key: 'phoneNumber',
      label: 'Номер телефона',
      render: (value) => value?.toString(),
    },
    {
      key: 'address',
      label: 'Адрес',
      render: (value) => value?.toString(),
    },
    {
      key: 'totalPrice',
      label: 'Общая сумма',
      render: (value) => value?.toString(),
    },
  ];

  const openModal = (order) => {
    setModalData(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  const renderValue = (value) => {
    if (Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] === 'object') {
        return (
          <ul className="list-disc pl-5">
            {value.map((item, idx) => (
              <li key={idx}>{item.title || 'No title'}</li>
            ))}
          </ul>
        );
      }

      return (
        <ul className="list-disc pl-5">
          {value.map((item, idx) => (
            <li key={idx}>{item?.toString()}</li>
          ))}
        </ul>
      );
    } else if (typeof value === 'object' && value !== null) {
      return (
        <div className="pl-4 space-y-1">
          {Object.entries(value).map(([k, v]) => (
            <p key={k}>
              <span className="font-semibold">{k}:</span> {v?.toString()}
            </p>
          ))}
        </div>
      );
    } else {
      return value?.toString();
    }
  };


  const actions = [
    {
      label: 'Посмотреть детали',
      icon: <MdOutlinePlaylistAdd />,
      onClick: (order) => openModal(order),
      className: 'btn-primary',
    },
  ];

  const modalVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
  };

  return (
    <div className="p-4">
      <p className='text-3xl pb-5 text-start text-primary font-bold'>Заказы:</p>

      {!data ? (
        <Loading />
      ) : (
        <>
          <CustomTable
            data={currentOrders}
            columns={columns}
            onRowClick={(order) => openModal(order)}
            actions={actions}
          />

          <CustomPagination
            totalItems={orders.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            totalPages={totalPages}
          />


        </>
      )}

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
              {/* Modal content */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-primary">Детали заказа</h3>
                <button className="btn btn-sm btn-circle btn-ghost" onClick={closeModal}>
                  <MdClose className="text-xl" />
                </button>
              </div>

              <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg shadow-inner space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {modalData.firstName && (
                    <div>
                      <p className="text-sm font-medium text-base-content/70">Имя:</p>
                      <p className="text-base-content">{modalData.firstName}</p>
                    </div>
                  )}
                  {modalData.lastName && (
                    <div>
                      <p className="text-sm font-medium text-base-content/70">Фамилия:</p>
                      <p className="text-base-content">{modalData.lastName}</p>
                    </div>
                  )}
                  {modalData.phoneNumber && (
                    <div>
                      <p className="text-sm font-medium text-base-content/70">Номер телефона:</p>
                      <p className="text-base-content">{modalData.phoneNumber}</p>
                    </div>
                  )}
                  {modalData.address && (
                    <div>
                      <p className="text-sm font-medium text-base-content/70">Адрес:</p>
                      <p className="text-base-content">{modalData.address}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-base-content/70">Общая сумма:</p>
                    <p className="text-base-content">{modalData.totalPrice?.toLocaleString()} UZS</p>
                  </div>
                  {Array.isArray(modalData.products) && (
                    <div className="sm:col-span-2">
                      <p className="text-sm font-medium text-base-content/70">Товары:</p>
                      <ul className="list-disc list-inside text-base-content">
                        {modalData.products.map((product, idx) => (
                          <li key={idx}>{product?.title || "Без названия"}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="btn btn-error px-4 py-2 rounded"
                >
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
