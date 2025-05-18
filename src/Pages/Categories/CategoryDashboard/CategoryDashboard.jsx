import React, { useEffect, useState } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import { MdCategory } from 'react-icons/md';
import { motion } from 'framer-motion';
import { Input } from 'postcss';
import { BsSearch } from 'react-icons/bs';

const CategoryDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://zaporka-backend.onrender.com/api/v1/categories');
      if (!response.ok) throw new Error('Не удалось получить категории');
      const data = await response.json();
      setCategories(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="text-center text-base-content">Загрузка...</div>;
  if (error) return <div className="text-error text-center">Ошибка: {error}</div>;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-base-content flex items-center gap-2">
          <MdCategory className="text-primary text-4xl" /> Категории
        </h2>
        <button
          onClick={fetchCategories}
          className="btn btn-outline btn-primary flex items-center gap-2"
        >
          <FiRefreshCw /> Обновить
        </button>
      </div>

      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Поиск категории..."
          className="input input-bordered w-full pr-10 text-base-content"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <BsSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content" />
      </div>

      <motion.ul
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {filteredCategories.map((category, index) => (
          <motion.li
            key={category._id}
            className="bg-base-200 rounded-xl p-4 shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="text-lg font-semibold text-base-content">{category.name}</div>
            <div className="text-sm text-base-content opacity-70">ID: {category._id}</div>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
};

export default CategoryDashboard;
// NAVRUZ MOLODES