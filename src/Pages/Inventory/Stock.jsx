// SellProduct.jsx (обновлён: добавлена страница Остатка)
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Loading from "../../Components/Loading/Loading";
import CustomTable from "../../Components/CustomTable/CustomTable";

export default function StockRemainder() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/api/v1/stock/remainder", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
      } catch (err) {
        console.error(err);
        toast.error("Ошибка при загрузке остатков");
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = [
    { label: "Товар", key: "name" },
    { label: "Количество", key: "quantity" },
    { label: "Цена закупа", key: "price" },
    {
      label: "Сумма",
      key: "total",
    },
  ];

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500">Ошибка загрузки остатков</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4"
    >
      <h2 className="text-2xl font-bold mb-4">Остатки товаров</h2>
      <CustomTable
        columns={columns}
        data={data || []}
        showPagination={false}
      />
    </motion.div>
  );
}
