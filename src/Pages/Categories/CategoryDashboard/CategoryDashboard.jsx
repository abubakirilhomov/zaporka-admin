import React, { useEffect, useState } from 'react';
import { Edit3, XCircle, CheckCircle, RefreshCw, ArrowUpDown } from 'lucide-react';
import CustomTable from '../../../Components/CustomTable/CustomTable';
import CustomPagination from '../../../Components/CustomPagination/CustomPagination';

const CategoryDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;
  const token = localStorage.getItem('token');

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/categories`);
      const data = await response.json();
      setCategories(data);
      setFiltered(data);
    } catch (error) {
      console.error('Ошибка при получении категорий:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const results = categories.filter(cat =>
      cat.name.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(results);
    setCurrentPage(1);
  }, [search, categories]);

  const handleSort = (field) => {
    const sorted = [...filtered].sort((a, b) => {
      if (field === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
    setFiltered(sorted);
    setSortBy(field);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/categories/${deleteId}`, {
        method: 'DELETE',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        fetchCategories();
      } else {
        console.error('Ошибка при удалении категории:', await response.text());
      }
    } catch (error) {
      console.error('Ошибка сети при удалении:', error);
    } finally {
      setModalOpen(false);
      setDeleteId(null);
    }
  };

  const handleEdit = async (id) => {
    try {
      const formData = new FormData();
      formData.append('name', editName);
      formData.append('slug', editName);
      const fileInput = document.querySelector('#imageInput');
      if (fileInput?.files[0]) formData.append('image', fileInput.files[0]);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/categories/${id}`, {
        method: 'PUT',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        fetchCategories();
      } else {
        console.error('Ошибка при изменении категории:', await response.text());
      }
    } catch (error) {
      console.error('Ошибка сети при изменении:', error);
    } finally {
      setEditId(null);
      setEditName('');
    }
  };

  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentItems = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / perPage);

  const columns = [
    { key: 'index', label: '#', render: (value, row, i) => indexOfFirst + i + 1 },
    {
      key: 'name',
      label: 'Название',
      sortable: true,
      render: (value, row) =>
        editId === row._id ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="input input-sm input-bordered w-full"
          />
        ) : (
          value
        ),
    },
    { key: '_id', label: 'ID' },
  ];

  const actions = [
    {
      label: '',
      icon: <Edit3 className="w-4 h-4" />,
      className: 'btn btn-sm btn-neutral ',
      onClick: (row) => {
        setEditId(row._id);
        setEditName(row.name);
      },
      showIf: (row) => editId !== row._id,
    },
    {
      label: '',
      icon: <CheckCircle className="w-4 h-4" />,
      className: 'btn btn-sm btn-success',
      onClick: (row) => handleEdit(row._id),
      showIf: (row) => editId === row._id,
    },
    {
      label: '',
      icon: <XCircle className="w-4 h-4 " />,
      className: 'btn btn-sm btn-outline',
      onClick: () => setEditId(null),
      showIf: (row) => editId === row._id,
    },
    {
      label: '',
      icon: <XCircle className="w-4 h-4 " />,
      className: 'btn btn-sm btn-error ml-2',
      onClick: (row) => {
        setModalOpen(true);
        setDeleteId(row._id);
      },
      showIf: (row) => editId !== row._id,
    },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">Категории</h1>

      <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Поиск..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered w-full sm:max-w-xs"
        />
        <button onClick={fetchCategories} className="btn btn-outline flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Обновить
        </button>
        <button
          onClick={() => handleSort(sortBy === 'name' ? 'createdAt' : 'name')}
          className="btn btn-outline flex items-center gap-2"
        >
          <ArrowUpDown className="w-4 h-4" /> Сортировка: {sortBy === 'name' ? 'Имя' : 'Дата'}
        </button>
      </div>

      <CustomTable
        data={currentItems}
        columns={columns}
        actions={actions.filter((a) => !a.showIf || currentItems.some((row) => a.showIf(row)))}
        currentPage={currentPage}
        usersPerPage={perPage}
      />

      <CustomPagination
        totalItems={filtered.length}
        itemsPerPage={perPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalPages={totalPages}
      />


      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded shadow-lg space-y-4 w-full max-w-sm">
            <h2 className="text-lg font-bold text-error-content">Удалить категорию?</h2>
            <p className="text-sm">Это действие нельзя отменить.</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setModalOpen(false)} className="btn btn-outline">Отмена</button>
              <button onClick={handleDelete} className="btn btn-error">Удалить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDashboard;
