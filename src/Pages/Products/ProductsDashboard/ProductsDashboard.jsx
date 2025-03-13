import React, { useEffect, useState } from "react";
import useFetch from "../../../hooks/useFetch";
import { toast } from "react-toastify";
import {
  MdEdit,
  MdDelete,
  MdOutlinePlaylistAdd,
  MdSave,
  MdClose,
  MdOutlineStore,
} from "react-icons/md";
import CustomTable from "../../../Components/CustomTable/CustomTable";
import Loading from "../../../Components/Loading/Loading";
import CustomPagination from "../../../Components/CustomPagination/CustomPagination";

const ProductsDashboard = () => {
  const apiUrl = `${process.env.REACT_APP_API_URL}/api/v1/products`;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Include pagination parameters in the fetch URL
  const fetchUrl = `${apiUrl}?page=${currentPage}&limit=${limit}`;
  const { data, loading, error, revalidate } = useFetch(fetchUrl, {}, false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);

  // Debug logging
  console.log("Raw API data:", data);

  useEffect(() => {
    revalidate();
  }, [currentPage]);

  useEffect(() => {
    if (data) {
      console.log("Received data:", data); // Debug the structure
      const products = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
      const total = data.total || products.length; // Adjust based on API response
      setTotalPages(Math.ceil(total / limit));
    }
  }, [data, limit]);

  if (loading) return <Loading />;
  if (error) return <div className="text-error text-center py-4">Ошибка: {error}</div>;

  // Ensure products is always an array
  const products = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
  console.log("Processed products:", products); // Debug the final array

  const importantFields = [
    { key: "title", label: "Название" },
    { key: "stock", label: "Запас" },
    { key: "price", label: "Цена" },
    { key: "manufacturer", label: "Производитель" },
    { key: "material", label: "Материал" },
    { key: "model", label: "Модель" },
  ];

  const columns = importantFields.map((field) => ({
    key: field.key,
    label: field.label,
  }));

  const actions = [
    {
      label: "Просмотреть детали",
      icon: <MdOutlinePlaylistAdd />,
      onClick: (product) => openModal(product),
      className: "btn-primary",
    },
  ];

  const openModal = (product) => {
    setSelectedProduct(product);
    setEditedProduct({ ...product });
    setIsEditing(false);
    document.getElementById("product_modal").showModal();
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) setEditedProduct({ ...selectedProduct });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!editedProduct || !editedProduct._id) return;
    try {
      const updateUrl = `${apiUrl}/${editedProduct._id}`;
      await useFetch.putData(updateUrl, editedProduct);
      revalidate();
      setIsEditing(false);
      toast.success("Продукт успешно обновлён");
      document.getElementById("product_modal").close();
    } catch (err) {
      toast.error("Ошибка при обновлении продукта: " + err.message);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    try {
      const deleteUrl = `${apiUrl}/${selectedProduct._id}`; // Fixed: Added "/"
      await useFetch.deleteData(deleteUrl);
      revalidate();
      setSelectedProduct(null);
      document.getElementById("product_modal").close();
      toast.success("Продукт успешно удалён");
    } catch (err) {
      toast.error("Ошибка при удалении продукта: " + err.message);
    }
  };

  const shouldDisplayField = (key) => {
    const excludedFields = [
      "_id", "createdAt", "updatedAt", "__v", "accession", "advantages",
      "availability", "construction", "currency", "description", "mainImage",
      "maxPressure", "minPressure", "rotationAngle", "serviceLife", "sizeInch",
      "sizeMm", "standard", "surfaceMaterial", "swipeImages", "thickness",
      "type", "views", "workEnv", "workingPressure", "workingTemperature",
    ];
    return !excludedFields.includes(key);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-base-100 p-4 rounded-lg">
      <h1 className="flex items-center justify-center pb-2 w-full text-2xl font-bold">
        <MdOutlineStore className="text-primary" /> Все товары
      </h1>
      <CustomTable
        data={products}
        columns={columns}
        onRowClick={openModal}
        actions={actions}
        emptyMessage="Нет данных о продуктах"
      />
      {totalPages > 1 && (
        <div>
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
      <dialog id="product_modal" className="modal">
        <div className="modal-box w-11/12 max-w-5xl bg-base-100 shadow-xl rounded-lg">
          {selectedProduct ? (
            <>
              <button
                className="btn btn-sm btn-circle absolute right-2 top-2"
                onClick={() => document.getElementById("product_modal").close()}
              >
                <MdClose className="text-lg" />
              </button>
              <h3 className="font-bold text-lg flex items-center gap-2 mb-6">
                <MdOutlinePlaylistAdd className="text-2xl" /> Детали продукта:{" "}
                {selectedProduct.title}
              </h3>
              <div className="py-4 space-y-6">
                {isEditing ? (
                  <div className="space-y-6">
                    {Object.entries(editedProduct).map(([key, value]) => {
                      if (!shouldDisplayField(key)) return null;
                      return (
                        <div
                          key={key}
                          className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center"
                        >
                          <label className="font-semibold capitalize text-base-content text-sm">
                            {key.replace(/([A-Z])/g, " $1").trim()}:
                          </label>
                          {typeof value === "boolean" ? (
                            <select
                              name={key}
                              value={editedProduct[key] ? "true" : "false"}
                              onChange={handleInputChange}
                              className="select select-bordered w-full"
                            >
                              <option value="true">Да</option>
                              <option value="false">Нет</option>
                            </select>
                          ) : Array.isArray(value) ? (
                            <input
                              type="text"
                              name={key}
                              value={value.join(", ")}
                              onChange={handleInputChange}
                              className="input input-bordered w-full"
                              placeholder={`Введите через запятую, например: ${value.join(", ")}`}
                            />
                          ) : (
                            <input
                              type="text"
                              name={key}
                              value={editedProduct[key] || ""}
                              onChange={handleInputChange}
                              className="input input-bordered w-full"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(selectedProduct).map(([key, value]) => {
                      if (!shouldDisplayField(key)) return null;
                      return (
                        <div
                          key={key}
                          className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center border-b pb-4 last:border-b-0"
                        >
                          <span className="font-semibold capitalize text-base-content text-sm">
                            {key.replace(/([A-Z])/g, " $1").trim()}:
                          </span>
                          <span className="text-base-content text-sm">
                            {Array.isArray(value)
                              ? value.join(", ")
                              : value === true
                              ? "Да"
                              : value === false
                              ? "Нет"
                              : value || "Н/Д"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="modal-action flex gap-4 mt-6">
                {isEditing ? (
                  <button className="btn btn-success" onClick={handleSave}>
                    <MdSave className="mr-2" /> Сохранить
                  </button>
                ) : (
                  <button className="btn btn-primary" onClick={handleEditToggle}>
                    <MdEdit className="mr-2" /> Редактировать
                  </button>
                )}
                <button className="btn btn-error" onClick={handleDelete}>
                  <MdDelete className="mr-2" /> Удалить
                </button>
                <button
                  className="btn"
                  onClick={() => document.getElementById("product_modal").close()}
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