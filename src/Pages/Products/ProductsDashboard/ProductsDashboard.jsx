import React, { useEffect, useState } from 'react';
import useFetch from '../../../hooks/useFetch';
import { toast } from 'react-toastify';
import { MdEdit, MdDelete, MdOutlinePlaylistAdd } from 'react-icons/md';
import CustomTable from '../../../Components/CustomTable/CustomTable'; // Adjust path as needed
import Loading from '../../../Components/Loading/Loading';

const ProductsDashboard = () => {
  const apiUrl = `${process.env.REACT_APP_API_URL}/api/v1/`;
  const { data, loading, error, revalidate, deleteData } = useFetch(apiUrl, {}, false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    revalidate();
  }, []);

  if (loading) return <Loading/>;
  if (error) return <div className="text-error text-center py-4">Ошибка: {error}</div>;

  const products = Array.isArray(data) ? data : [];

  const importantFields = [
    'title',
    'stock',
    'price',
    'manufacturer',
    'material',
    'model',
  ];

  const columns = importantFields.map((field) => ({
    key: field,
    label: field.replace(/([A-Z])/g, ' $1').trim(),
  }));

  const actions = [
    {
      label: 'Просмотреть детали',
      icon: <MdOutlinePlaylistAdd />,
      onClick: (product) => openModal(product),
      className: 'btn-primary',
    },
  ];

  const openModal = (product) => {
    setSelectedProduct(product);
    document.getElementById('product_modal').showModal();
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    try {
      const deleteUrl = `${apiUrl}${selectedProduct._id}`;
      await deleteData();
      revalidate();
      setSelectedProduct(null);
      document.getElementById('product_modal').close();
      toast.success('Продукт успешно удалён');
    } catch (err) {
      toast.error('Ошибка при удалении продукта: ' + err.message);
    }
  };

  const handleEdit = () => {
    if (!selectedProduct) return;
    console.log('Редактировать продукт:', selectedProduct);
    toast.info('Функциональность редактирования будет реализована');
  };

  return (
    <div className="p-4">
      <CustomTable
        data={products}
        columns={columns}
        onRowClick={openModal}
        actions={actions}
        emptyMessage="Нет данных о продуктах"
      />

      <dialog id="product_modal" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          {selectedProduct ? (
            <>
              <h3 className="font-bold text-lg flex items-center gap-2">
                <MdOutlinePlaylistAdd className="text-2xl" /> Детали продукта: {selectedProduct.title}
              </h3>
              <div className="py-4 space-y-4">
                {Object.entries(selectedProduct).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <span className="font-semibold capitalize text-base-content">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className="text-base-content">
                      {Array.isArray(value)
                        ? value.join(', ')
                        : value === true
                        ? 'Да'
                        : value === false
                        ? 'Нет'
                        : value || 'Н/Д'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="modal-action">
                <form method="dialog" className="flex gap-2">
                  <button className="btn btn-primary" onClick={handleEdit}>
                    <MdEdit className="mr-2" /> Редактировать
                  </button>
                  <button className="btn btn-error" onClick={handleDelete}>
                    <MdDelete className="mr-2" /> Удалить
                  </button>
                  <button className="btn">Закрыть</button>
                </form>
              </div>
            </>
          ) : (
            <p>Продукт не выбран</p>
          )}
        </div>
      </dialog>
    </div>
  );
};

export default ProductsDashboard;