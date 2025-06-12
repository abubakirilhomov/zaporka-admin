import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-base-100 px-6 text-base-content">
      <div className="max-w-xl text-center space-y-6">
        <div className="text-[120px] font-black leading-none text-error">404</div>
        <h1 className="text-4xl font-bold">Страница не найдена</h1>
        <p className="text-lg text-gray-500">
          Мы не смогли найти страницу, которую вы ищете. Возможно, она была перемещена или удалена.
        </p>
        <Link to="/" className="btn btn-primary btn-lg gap-2">
          <FaArrowLeft className="text-lg" />
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
