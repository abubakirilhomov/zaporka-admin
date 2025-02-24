import React, { useEffect, useState } from 'react';
import useFetch from '../../../hooks/useFetch';
import { toast } from 'react-toastify';
import { MdEdit, MdDelete, MdOutlinePlaylistAdd, MdSave } from 'react-icons/md';
import CustomTable from '../../../Components/CustomTable/CustomTable'; // Adjust path as needed
import Loading from '../../../Components/Loading/Loading';

const ProductsDashboard = () => {
  const apiUrl = `${process.env.REACT_APP_API_URL}/api/v1/`; // Убедились, что эндпоинт правильный
  const { data, loading, error, revalidate, deleteData, postData, putData } = useFetch(apiUrl, {}, false); // Добавили postData для полноты
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);

  useEffect(() => {
    revalidate();
  }, []);

  if (loading) return <Loading />;
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
    setEditedProduct({ ...product }); // Копируем продукт для редактирования
    setIsEditing(false); // По умолчанию открываем в режиме просмотра
    document.getElementById('product_modal').showModal();
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditedProduct({ ...selectedProduct }); // Инициализируем данные для редактирования
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!editedProduct || !editedProduct._id) return;
    try {
      const updateUrl = `${apiUrl}${editedProduct._id}`;
      await putData(updateUrl, editedProduct); // Используем динамический URL
      revalidate(); // Обновляем список продуктов
      setIsEditing(false);
      toast.success('Продукт успешно обновлён');
    } catch (err) {
      toast.error('Ошибка при обновлении продукта: ' + err.message);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    try {
      const deleteUrl = `${apiUrl}${selectedProduct._id}`;
      await deleteData(deleteUrl); // Используем динамический URL
      revalidate();
      setSelectedProduct(null);
      // Проверяем, существует ли модальное окно перед закрытием
      const modal = document.getElementById('product_modal');
      if (modal) {
        modal.close();
      }
      toast.success('Продукт успешно удалён');
    } catch (err) {
      toast.error('Ошибка при удалении продукта: ' + err.message);
    }
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
                {isEditing ? (
                  // Форма редактирования
                  <div className="space-y-4">
                    {Object.entries(editedProduct).map(([key, value]) => {
                      if (key === '_id' || key === 'createdAt' || key === 'updatedAt') return null; // Исключаем системные поля
                      return (
                        <div key={key} className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <label className="font-semibold capitalize text-base-content">{key.replace(/([A-Z])/g, ' $1').trim()}:</label>
                          {typeof value === 'boolean' ? (
                            <select
                              name={key}
                              value={editedProduct[key] ? 'true' : 'false'}
                              onChange={handleInputChange}
                              className="input input-bordered w-full"
                            >
                              <option value="true">Да</option>
                              <option value="false">Нет</option>
                            </select>
                          ) : Array.isArray(value) ? (
                            <input
                              type="text"
                              name={key}
                              value={value.join(', ')}
                              onChange={handleInputChange}
                              className="input input-bordered w-full"
                              placeholder={`Введите через запятую, например: ${value.join(', ')}`}
                            />
                          ) : (
                            <input
                              type="text"
                              name={key}
                              value={editedProduct[key] || ''}
                              onChange={handleInputChange}
                              className="input input-bordered w-full"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  // Режим просмотра
                  <div className="space-y-4">
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
                )}
              </div>
              <div className="modal-action flex gap-2">
                {isEditing ? (
                  <button
                    className="btn btn-success"
                    onClick={handleSave}
                  >
                    <MdSave className="mr-2" /> Сохранить
                  </button>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={handleEditToggle}
                  >
                    <MdEdit className="mr-2" /> Редактировать
                  </button>
                )}
                <button
                  className="btn btn-error"
                  onClick={handleDelete}
                >
                  <MdDelete className="mr-2" /> Удалить
                </button>
                <button
                  className="btn"
                  onClick={() => document.getElementById('product_modal').close()}
                >
                  Закрыть
                </button>
              </div>
            </>
          ) : (
            <p className="text-base-content text-center py-4">Продукт не выбран</p>
          )}
        </div>
      </dialog>
    </div>
  );
};

export default ProductsDashboard;