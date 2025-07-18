import React, { useEffect, useState } from 'react';
import { Edit3, XCircle, CheckCircle, RefreshCw, ArrowUpDown } from 'lucide-react';
import { toast } from 'react-toastify';
import CustomTable from '../../Components/CustomTable/CustomTable';
import 'react-toastify/dist/ReactToastify.css';
import { GoTrash } from "react-icons/go";

const AllBanners = () => {
    const apiUrl = process.env.REACT_APP_API_URL ;
    const token = localStorage.getItem('token');

    const [banners, setBanners] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('link'); 
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editLink, setEditLink] = useState('');
    const [editImage, setEditImage] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const perPage = 5;

    const fetchBanners = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/v1/swiper`, {
                headers: {
                    'accept': '*/*',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const data = await res.json();
            const validBanners = Array.isArray(data)
                ? data.map((b) => ({
                    ...b,
                    name: b.name || `Баннер ${b._id.slice(-6)}`, 
                    image: b.image.startsWith('http') ? b.image : `${apiUrl}${b.image}`, 
                }))
                : [];
            setBanners(validBanners);
            setFiltered(validBanners);
        } catch (err) {
            console.error('Ошибка при загрузке баннеров:', err);
            toast.error('Ошибка при загрузке баннеров');
            setBanners([]);
            setFiltered([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    useEffect(() => {
        const result = banners.filter((b) =>
            b.name && typeof b.name === 'string'
                ? b.name.toLowerCase().includes(search.toLowerCase())
                : false
        );
        setFiltered(result);
        setCurrentPage(1);
    }, [search, banners]);

    const handleSort = (field) => {
        const sorted = [...filtered].sort((a, b) => {
            if (field === 'link') {
                const linkA = a.link && typeof a.link === 'string' ? a.link : '';
                const linkB = b.link && typeof b.link === 'string' ? b.link : '';
                return linkA.localeCompare(linkB);
            } else {
                const dateA = a.createdAt && !isNaN(new Date(a.createdAt)) ? new Date(a.createdAt) : new Date(0);
                const dateB = b.createdAt && !isNaN(new Date(b.createdAt)) ? new Date(b.createdAt) : new Date(0);
                return dateB - dateA;
            }
        });
        setFiltered(sorted);
        setSortBy(field);
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`${apiUrl}/api/v1/swiper/${deleteId}`, {
                method: 'DELETE',
                headers: {
                    'accept': '*/*',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            toast.success('Баннер удален');
            fetchBanners();
        } catch (err) {
            console.error('Ошибка при удалении:', err);
            toast.error('Ошибка при удалении');
        } finally {
            setModalOpen(false);
            setDeleteId(null);
        }
    };

    const handleEdit = async (id) => {
        try {
            const formData = new FormData();
            formData.append('name', editName);
            formData.append('link', editLink);
            if (editImage) {
                formData.append('image', editImage);
            }

            const res = await fetch(`${apiUrl}/api/v1/swiper/${id}`, {
                method: 'PUT',
                headers: {
                    'accept': '*/*',
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            toast.success('Баннер обновлен');
            fetchBanners();
        } catch (err) {
            console.error('Ошибка при обновлении:', err);
            toast.error('Ошибка при обновлении');
        } finally {
            setEditId(null);
            setEditName('');
            setEditLink('');
            setEditImage(null);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditImage(file);
        }
    };

    const indexOfLast = currentPage * perPage;
    const indexOfFirst = indexOfLast - perPage;
    const currentItems = filtered.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filtered.length / perPage);

    const columns = [
        {
            key: 'index',
            label: '#',
            render: (_, __, i) => indexOfFirst + i + 1,
        },
        {
            key: 'name',
            label: 'Название',
            sortable: true,
            render: (_, row) =>
                editId === row._id ? (
                    <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="input input-bordered input-sm w-full"
                        placeholder="Введите название"
                    />
                ) : (
                    row.name
                ),
        },
        {
            key: 'link',
            label: 'Ссылка',
            sortable: true,
            render: (_, row) =>
                editId === row._id ? (
                    <input
                        type="url"
                        value={editLink}
                        onChange={(e) => setEditLink(e.target.value)}
                        className="input input-bordered input-sm w-full"
                        placeholder="Введите URL"
                    />
                ) : (
                    <a
                        href={row.link || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className={`text-blue-500 hover:underline ${!row.link ? 'text-gray-500 cursor-not-allowed' : ''}`}
                    >
                        {row.link || 'Нет ссылки'}
                    </a>
                ),
        },
        {
            key: 'image',
            label: 'Изображение',
            render: (_, row) =>
                editId === row._id ? (
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="file-input file-input-bordered file-input-sm w-full"
                    />
                ) : (
                    <img
                        src={row.image || 'https://via.placeholder.com/64'}
                        alt={row.name || 'Баннер'}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => (e.target.src = 'https://via.placeholder.com/64')}
                    />
                ),
        },
        {
            key: '_id',
            label: 'ID',
        },
    ];

    const actions = [
        {
            icon: <Edit3 size={16} />,
            className: 'btn btn-sm btn-neutral ml-2',
            onClick: (row) => {
                setEditId(row._id);
                setEditName(row.name || '');
                setEditLink(row.link || '');
                setEditImage(null);
            },
            showIf: (row) => editId !== row._id,
        },
        {
            icon: <CheckCircle size={16} />,
            className: 'btn btn-sm btn-success ml-2',
            onClick: (row) => handleEdit(row._id),
            showIf: (row) => editId === row._id,
        },
        {
            icon: <XCircle size={16} />,
            className: 'btn btn-sm btn-outline ml-2',
            onClick: () => {
                setEditId(null);
                setEditName('');
                setEditLink('');
                setEditImage(null);
            },
            showIf: (row) => editId === row._id,
        },
        {
            icon: <GoTrash size={16} />,
            className: 'btn btn-sm btn-error ml-2',
            onClick: (row) => {
                setModalOpen(true);
                setDeleteId(row._id);
            },
            showIf: (row) => editId !== row._id,
        },
    ];

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto bg-base-100 rounded-box shadow-lg">
            <p className="text-2xl sm:text-3xl font-bold mb-6 text-primary">Баннеры</p>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Поиск по названию..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input input-bordered w-full sm:max-w-xs"
                />
                <button className="btn btn-outline flex items-center gap-2" onClick={fetchBanners}>
                    <RefreshCw size={16} /> Обновить
                </button>
                <button
                    className="btn btn-outline flex items-center gap-2"
                    onClick={() => handleSort(sortBy === 'link' ? 'createdAt' : 'link')}
                >
                    <ArrowUpDown size={16} /> Сортировка: {sortBy === 'link' ? 'Ссылка' : 'Дата'}
                </button>
            </div>

            {loading ? (
                <div className="text-center py-6">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            ) : filtered.length === 0 ? (
                <p className="text-center text-ифыу-300 py-6">Нет баннеров для отображения</p>
            ) : (
                <>
                    <CustomTable
                        data={currentItems}
                        columns={columns}
                        actions={actions}
                        currentPage={currentPage}
                        usersPerPage={perPage}
                    />
                    <div className="flex justify-center mt-6">
                        <div className="join">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    className={`join-item btn btn-sm ${currentPage === i + 1 ? 'btn-active' : ''}`}
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-base-100 p-6 rounded-box shadow-lg space-y-4 w-full max-w-sm">
                        <h2 className="text-lg font-bold text-error-content">Удалить баннер?</h2>
                        <p className="text-sm text-base-content">Это действие нельзя отменить.</p>
                        <div className="flex justify-end gap-4">
                            <button onClick={() => setModalOpen(false)} className="btn btn-outline btn-sm">
                                Отмена
                            </button>
                            <button onClick={handleDelete} className="btn btn-error btn-sm">
                                Удалить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllBanners;