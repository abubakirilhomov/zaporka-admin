import React, { useEffect, useState, useRef, useMemo } from "react";
import { toast } from "react-toastify";
import {
  MdClose,
  MdOutlinePlaylistAdd,
  MdOutlineStore,
} from "react-icons/md";
import CustomTable from "../../../Components/CustomTable/CustomTable";
import Loading from "../../../Components/Loading/Loading";
import CustomPagination from "../../../Components/CustomPagination/CustomPagination";
import EditProduct from "../EditProduct/EditProduct";
import useFetch from "../../../hooks/useFetch";

const ProductsDashboard = () => {
  const modalRef = useRef(null);
  const apiUrl = `${process.env.REACT_APP_API_URL}/api/v1/products`;
  const token = localStorage.getItem("token");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const limit = 10;

  const fetchUrl = `${apiUrl}?page=${currentPage}&limit=${limit}`;
  const {
    data,
    loading,
    error,
    revalidate,
    putData,
    deleteData,
  } = useFetch(fetchUrl, {
    headers: { Authorization: `Bearer ${token}` },
  }, false);

  useEffect(() => {
    revalidate();
  }, [currentPage]);

  useEffect(() => {
    if (data) {
      const products = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : [];
      const total = data?.total || products.length || 0;
      setTotalPages(Math.ceil(total / limit));
    }
  }, [data, limit]);

  const products = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
    ? data
    : [];

  const importantFields = [
    { key: "title", label: "Название" },
    { key: "stock", label: "Запас" },
    { key: "price", label: "Цена" },
    { key: "pressure", label: "Давление" },
    { key: "material", label: "Материал" },
    { key: "size", label: "Размер" },
  ];

  const normalizeFieldValue = (value) => {
    if (value === undefined || value === null) return "Н/Д";
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "boolean") return value ? "Да" : "Нет";
    if (typeof value === "object")
      return value?.name ?? JSON.stringify(value, null, 2).replace(/{|}/g, "");
    return value.toString();
  };

  const columns = useMemo(
    () =>
      importantFields.map((field) => ({
        key: field.key,
        label: field.label,
        render: (value) => normalizeFieldValue(value),
      })),
    []
  );

  const openModal = (product) => {
    setSelectedProduct(product);
    if (modalRef.current) modalRef.current.showModal();
  };

  const closeModal = () => {
    if (modalRef.current) modalRef.current.close();
    setSelectedProduct(null);
  };

  const actions = useMemo(
    () => [
      {
        label: "Просмотреть детали",
        icon: <MdOutlinePlaylistAdd />,
        onClick: openModal,
        className: "btn-primary",
      },
    ],
    []
  );

  const handleDelete = async () => {
    if (!selectedProduct) return;
    try {
      const deleteUrl = `${apiUrl}/${selectedProduct._id}`;
      await deleteData(deleteUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      revalidate();
      closeModal();
      toast.success("Продукт успешно удалён");
    } catch (err) {
      toast.error("Ошибка при удалении продукта: " + err.message);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) return <Loading />;
  if (error)
    return (
      <div className="text-error text-center py-4">Ошибка: {error}</div>
    );

  return (
    <div className="p-5">
      <div className="bg-base-100 p-4 rounded-lg">
        <h1 className="flex items-center justify-center pb-2 w-full text-2xl font-bold">
          <MdOutlineStore className="text-primary mr-2" /> Все товары
        </h1>

        <CustomTable
          data={products}
          columns={columns}
          onRowClick={openModal}
          actions={actions}
          emptyMessage="Нет данных о продуктах"
        />

        {totalPages >= 1 && (
          <div>
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        <dialog ref={modalRef} id="product_modal" className="modal">
          <div className="modal-box w-11/12 max-w-5xl bg-base-100 shadow-xl rounded-lg">
            {selectedProduct ? (
              <>
                <button
                  className="btn btn-sm btn-circle absolute right-2 top-2"
                  onClick={closeModal}
                >
                  <MdClose className="text-lg" />
                </button>
                <EditProduct
                  product={selectedProduct}
                  apiUrl={apiUrl}
                  token={token}
                  onSave={() => {
                    revalidate();
                    closeModal();
                    toast.success("Продукт успешно обновлён");
                  }}
                  onDelete={async () => {
                    await handleDelete();
                    closeModal();
                  }}
                />
              </>
            ) : (
              <p className="text-base-content text-center py-4">
                Продукт не выбран
              </p>
            )}
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default ProductsDashboard;
