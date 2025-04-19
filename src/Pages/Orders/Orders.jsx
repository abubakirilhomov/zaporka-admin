import React from 'react';
import useFetch from '../../hooks/useFetch';
import CustomTable from '../../Components/CustomTable/CustomTable';
import { MdOutlinePlaylistAdd } from 'react-icons/md';

const Orders = () => {
  const apiUrl = `${process.env.REACT_APP_API_URL}/api/v1/orders`;
  const token = localStorage.getItem('token');
  console.log(token);
  
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const { data } = useFetch(apiUrl, { headers }, true);
  const orders = Array.isArray(data) ? data.map((order) => ({
    ...order,
    total: order.total || 0,  
  })) : [];
  
  

  const columns = [
    { key: 'orderId', label: 'Номер заказа' },
    { key: 'customerName', label: 'Имя клиента' },
    {
      key: 'total',
      label: 'Сумма',
      render: (value) => (value ? `${value} UZS` : '0 UZS'),
    },
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

export default Orders;
