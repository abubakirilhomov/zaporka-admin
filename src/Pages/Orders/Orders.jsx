import React, { useEffect } from 'react';
import useFetch from '../../hooks/useFetch';
import CustomTable from '../../Components/CustomTable/CustomTable';
import { MdOutlinePlaylistAdd } from 'react-icons/md';
import Loading from '../../Components/Loading/Loading';

const OrdersDashboard = () => {
  const apiUrl = `${process.env.REACT_APP_API_URL}/api/v1/`;
  const { data, loading, error, revalidate } = useFetch(apiUrl, {}, false);

  useEffect(() => {
    revalidate();
  }, []);

  if (loading) return <Loading/>;
  if (error) return <div className="text-error text-center py-4">Ошибка: {error}</div>;

  const orders = Array.isArray(data) ? data : [];

  const columns = [
    { key: 'orderId', label: 'Номер заказа' },
    { key: 'customerName', label: 'Имя клиента' },
    { key: 'total', label: 'Сумма', render: (value) => `${value} UZS` },
  ];

  const actions = [
    {
      label: 'Просмотреть детали',
      icon: <MdOutlinePlaylistAdd />,
      onClick: (order) => console.log('View order:', order),
      className: 'btn-primary',
    },
  ];

  return (
    <div className="p-4">
      <CustomTable
        data={orders}
        columns={columns}
        onRowClick={(order) => console.log('Row clicked:', order)}
        actions={actions}
        emptyMessage="Нет данных о заказах"
      />
    </div>
  );
};

export default OrdersDashboard;