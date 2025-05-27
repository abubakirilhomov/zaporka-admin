import React from 'react';
import { MdTitle, MdInventory, MdDescription, MdPriceCheck } from 'react-icons/md';
import { MdOutlineCurrencyExchange } from "react-icons/md";
import PropTypes from 'prop-types';

const BasicInfoSection = ({ register, errors, categories, loading }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="flex items-center gap-2">
          <MdTitle className="text-lg" />
          <span className="label-text text-base-content">Загаловок *</span>
        </label>
        <input
          {...register('title', { required: 'Заголовок обязателен' })}
          type="text"
          className={`input input-bordered w-full ${errors.title ? 'input-error' : ''}`}
        />
        {errors.title && <p className="text-error text-sm">{errors.title.message}</p>}
      </div>

      <div>
        <label className="flex items-center gap-2">
          <MdInventory className="text-lg" />
          <span className="label-text text-base-content">Запас *</span>
        </label>
        <input
          {...register('stock', { required: 'Запас обязателен' })}
          type="number"
          className={`input input-bordered w-full ${errors.stock ? 'input-error' : ''}`}
        />
        {errors.stock && <p className="text-error text-sm">{errors.stock.message}</p>}
      </div>

      <div>
        <label className="flex items-center gap-2">
          <span className="label-text text-base-content">Категория *</span>
        </label>
        <select
          {...register('category', { required: 'Выберите категорию' })}
          className={`select select-bordered w-full ${errors.category ? 'select-error' : ''}`}
          defaultValue=""
          disabled={loading || !categories || categories.length === 0}
        >
          <option value="" disabled>
            {loading ? 'Загрузка...' : 'Выберите категорию'}
          </option>
          {categories && categories.length > 0 ? (
            categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))
          ) : (
            <option value="" disabled>
              Нет доступных категорий
            </option>
          )}
        </select>
        {errors.category && <p className="text-error text-sm">{errors.category.message}</p>}
      </div>
    </div>

    <div>
      <label className="flex items-center gap-2">
        <MdDescription className="text-lg" />
        <span className="label-text text-base-content">Описание</span>
      </label>
      <textarea
        {...register('description')}
        className="textarea textarea-bordered w-full"
        rows="3"
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="flex items-center gap-2">
          <MdPriceCheck className="text-lg" />
          <span className="label-text text-base-content">Цена (разделенные запятыми) *</span>
        </label>
        <input
          {...register('price', { required: 'Цена обязательна' })}
          type="text"
          placeholder="например, 1000, 2000"
          className={`input input-bordered w-full ${errors.price ? 'input-error' : ''}`}
        />
        {errors.price && <p className="text-error text-sm">{errors.price.message}</p>}
      </div>

      <div>
        <label className="flex items-center gap-2">
          <MdOutlineCurrencyExchange className="text-lg" />
          <span className="label-text text-base-content">Валюта</span>
        </label>
        <input
          {...register('currency')}
          type="text"
          defaultValue="UZS"
          className="input input-bordered w-full"
        />
      </div>
    </div>
  </div>
);

BasicInfoSection.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default BasicInfoSection;