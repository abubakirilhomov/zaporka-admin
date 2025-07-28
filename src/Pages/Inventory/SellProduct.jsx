// SellProduct.jsx
import React, { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import CustomTable from "../../Components/CustomTable/CustomTable";

const SellProduct = () => {
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
  const token = localStorage.getItem("token");

  const authHeaders = token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    : { "Content-Type": "application/json" };

  const {
    data: productsData,
    loading: productsLoading,
    error: productsError,
  } = useFetch(`${apiUrl}/api/v1/products`, { headers: authHeaders }, true);

  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [amount, setAmount] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [soldBy, setSoldBy] = useState("");
  const [tempItems, setTempItems] = useState([]);

  useEffect(() => {
    if (productsError) {
      toast.error("Ошибка загрузки продуктов: " + productsError);
    }
    if (productsData) {
      setProducts(Array.isArray(productsData) ? productsData : []);
    }
  }, [productsData, productsError]);

  const handleAddItem = () => {
    const parsedAmount = Number(amount);
    const parsedSellingPrice = Number(sellingPrice);

    if (!selectedProductId) return toast.error("Выберите товар");
    if (!parsedAmount || parsedAmount <= 0)
      return toast.error("Введите корректное количество");
    if (!parsedSellingPrice || parsedSellingPrice <= 0)
      return toast.error("Введите корректную цену продажи");

    const product = products.find((p) => p._id === selectedProductId);

    const newItem = {
      productId: selectedProductId,
      productTitle: product?.title || "Без названия",
      amount: parsedAmount,
      sellingPrice: parsedSellingPrice,
      soldBy: soldBy || "Продавец",
    };

    setTempItems([...tempItems, newItem]);
    setSelectedProductId("");
    setAmount("");
    setSellingPrice("");
    setSoldBy("");
  };

  const handleDeleteItem = (index) => {
    setTempItems(tempItems.filter((_, i) => i !== index));
  };

  const handleConfirm = async () => {
    if (tempItems.length === 0)
      return toast.error("Добавьте хотя бы один товар");

    try {
      const response = await fetch(`${apiUrl}/api/v1/stock/sell`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ items: tempItems }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Ошибка при продаже");

      toast.success("Продажа успешно зарегистрирована");
      setTempItems([]);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const tempColumns = [
    {
      key: "productTitle",
      label: "Продукт",
    },
    {
      key: "amount",
      label: "Кол-во",
    },
    {
      key: "sellingPrice",
      label: "Цена (UZS)",
      render: (v) => `${v.toLocaleString("RU-ru")} UZS`,
    },
    {
      key: "soldBy",
      label: "Продавец",
    },
    {
      key: "actions",
      label: "Удалить",
      render: (v, r, i) => (
        <button
          className="btn btn-error btn-sm"
          onClick={() => handleDeleteItem(i)}
        >
          <MdDelete className="text-lg" />
        </button>
      ),
    },
  ];
  const totalSum = tempItems.reduce(
    (acc, item) => acc + item.amount * item.sellingPrice,
    0
  );
  return (
    <div className="p-4">
      <div className="max-w-7xl bg-base-100/50 backdrop-blur-xl rounded-3xl shadow-2xl p-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          Продажа товаров
        </h2>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/2 space-y-4">
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="select select-bordered w-full bg-base-100/70"
              disabled={productsLoading || products.length === 0}
            >
              <option value="">Выберите товар</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.title || "Без названия"}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Количество"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input input-bordered w-full bg-base-100/70"
            />

            <input
              type="number"
              placeholder="Цена продажи (UZS)"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              className="input input-bordered w-full bg-base-100/70"
            />

            <input
              type="text"
              placeholder="Продавец (необязательно)"
              value={soldBy}
              onChange={(e) => setSoldBy(e.target.value)}
              className="input input-bordered w-full bg-base-100/70"
            />

            <button className="btn btn-primary w-full" onClick={handleAddItem}>
              Добавить в список
            </button>
          </div>

          <div className="lg:w-1/2">
            <h3 className="text-lg font-semibold mb-2">Продажа</h3>
            <div className="max-h-[400px] overflow-y-auto">
              <CustomTable
                data={tempItems}
                columns={tempColumns}
                actions={[]}
                emptyMessage="Нет выбранных товаров"
              />
            </div>
            {tempItems.length > 0 && (
              <div className="text-right text-lg font-semibold mt-4">
                Общая сумма: {totalSum.toLocaleString("RU-ru")} UZS
              </div>
            )}
            <button
              className="btn btn-success text-white w-full mt-4"
              onClick={handleConfirm}
            >
              Подтвердить продажу
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellProduct;
