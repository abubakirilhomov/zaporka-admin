import React, { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import CustomTable from '../../Components/CustomTable/CustomTable';
import { MdOutlinePlaylistAdd } from 'react-icons/md';
import Loading from '../../Components/Loading/Loading';

const Orders = () => {
  const apiUrl = `${process.env.REACT_APP_API_URL}/api/v1/orders`; 
  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const { data } = useFetch(apiUrl, { headers }, true);

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

  const columns = [
    {
      key: 'firstName',
      label: 'First Name',
      render: (value) => value?.toString(),
    },
    {
      key: 'lastName',
      label: 'Last Name',
      render: (value) => value?.toString(),
    },
    {
      key: 'phoneNumber',
      label: 'Phone Number',
      render: (value) => value?.toString(),
    },
    {
      key: 'address',
      label: 'Address',
      render: (value) => value?.toString(),
    },
    {
      key: 'totalPrice',
      label: 'Total Price',
      render: (value) => value?.toString(),
    },
  ];

  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (order) => {
    setModalData(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  const actions = [
    {
      label: 'Просмотреть детали',
      icon: <MdOutlinePlaylistAdd />,
      onClick: (order) => openModal(order),
      className: 'btn-primary',
    },
  ];

  return (
    <div className="p-4">
      <CustomTable
        data={orders}
        columns={columns}
        onRowClick={(order) => openModal(order)}
        actions={actions}
        emptyMessage={<Loading />}
      />

      {isModalOpen && modalData && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-300 rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-semibold">Детали заказа</h2>
              <button
                onClick={closeModal}
                className="text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <div className="mt-4 space-y-2 text-sm text-primary">
              {Object.entries(modalData)
                .filter(([key]) => key !== '_id') 
                .map(([key, value]) => (
                  <p key={key}>
                    <span className="font-medium">{key}:</span> {value?.toString()}
                  </p>
                ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="btn btn-error px-4 py-2 rounded"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
