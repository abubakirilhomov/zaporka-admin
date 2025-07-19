import React, { useState } from 'react';
import { toast } from 'react-toastify';

const AddBanner = () => {
    const apiUrl = process.env.REACT_APP_API_URL 
    const token = localStorage.getItem('token');

    const [formData, setFormData] = useState({
        name: '',
        link: '', 
        image: null,
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, image: file }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const submitData = new FormData();
        submitData.append('name', formData.name);
        submitData.append('link', formData.link); 
        if (formData.image) {
            submitData.append('image', formData.image);
        }

        try {
            const response = await fetch(`${apiUrl}/api/v1/swiper`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: submitData,
            });

            if (!response.ok) {
                const errRes = await response.json();
                throw new Error(errRes.message || 'Ошибка при отправке данных');
            }

            toast.success('Баннер успешно создан!');
            setFormData({ name: '', link: '', image: null }); 
            setPreviewImage(null);
        } catch (err) {
            console.error('Ошибка при создании баннера:', err);
            setError(err.message || 'Произошла ошибка');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 bg-base-100 shadow-lg rounded-box max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-base-content">Создать новый баннер</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                    <label htmlFor="name" className="label">
                        <span className="label-text">Название баннера</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="input input-bordered input-md w-full"
                        placeholder="Введите название категории"
                    />
                </div>


                <div className="form-control">
                    <label htmlFor="image" className="label">
                        <span className="label-text">Изображение категории</span>
                    </label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="file-input file-input-bordered file-input-md w-full"
                    />
                    {previewImage && (
                        <div className="mt-3">
                            <img
                                src={previewImage}
                                alt="Предпросмотр"
                                className="w-32 h-32 object-cover rounded-box border border-base-200"
                            />
                        </div>
                    )}
                </div>

                {error && (
                    <p className="text-error text-sm mt-2 p-2 bg-error bg-opacity-10 rounded">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    className={`btn btn-primary w-full ${loading ? 'btn-disabled' : ''}`}
                >
                    {loading ? (
                        <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                        'Создать категорию'
                    )}
                </button>
            </form>
        </div>
    );
};

export default AddBanner;