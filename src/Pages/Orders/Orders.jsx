import React, { useEffect, useState } from 'react';
import useFetch from '../../hooks/useFetch';
import CustomTable from '../../Components/CustomTable/CustomTable';
import { MdOutlinePlaylistAdd } from 'react-icons/md';
import Loading from '../../Components/Loading/Loading';
import { Dialog } from '@headlessui/react'; // используем Headless UI для модалки

const OrdersDashboard = () => {
  const apiUrl = `${process.env.REACT_APP_API_URL}/api/v1/`;
  const { data, loading, error, revalidate } = useFetch(apiUrl, {}, false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    revalidate();
  }, []);

  if (loading) return <Loading />;
  if (error) return <div className="text-error text-center py-4">Ошибка: {error}</div>;

  const orders = Array.isArray(data) ? data : [];

  const transformedOrders = orders.map((order) => {
    const total = order.products.reduce((sum, product) => sum + (product.price?.[0] || 0), 0);
    return {
      orderId: order._id,
      customerName: 'N/A', // Заменишь на order.customer.name если появится
      total,
      original: order,
    };
  });

  const columns = [
    { key: 'orderId', label: 'Номер заказа' },
    { key: 'customerName', label: 'Имя клиента' },
    { key: 'total', label: 'Сумма', render: (value) => `${value.toLocaleString()} UZS` },
  ];

  const actions = [
    {
      label: 'Просмотреть детали',
      icon: <MdOutlinePlaylistAdd />,
      onClick: (order) => {
        setSelectedOrder(order.original);
        setIsModalOpen(true);
      },
      className: 'btn-primary',
    },
  ];

  return (
    <div className="p-4">
      <CustomTable
        data={transformedOrders}
        columns={columns}
        onRowClick={(order) => {
          setSelectedOrder(order.original);
          setIsModalOpen(true);
        }}
        actions={actions}
        emptyMessage="Нет данных о заказах"
      />

      {/* Модалка */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl space-y-4">
            <Dialog.Title className="text-xl font-bold">Детали заказа</Dialog.Title>
            {selectedOrder ? (
              <div className="space-y-2 text-sm">
                <p><strong>ID заказа:</strong> {selectedOrder._id}</p>
                <p><strong>Имя клиента:</strong> N/A</p>
                <p><strong>Продукты:</strong></p>
                <ul className="list-disc list-inside pl-4">
                  {selectedOrder.products.map((p, index) => (
                    <li key={index}>
                      {p.name} - {p.price?.[0]?.toLocaleString() || 0} UZS
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>Нет данных</p>
            )}
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
              >
                Закрыть
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default OrdersDashboard;
