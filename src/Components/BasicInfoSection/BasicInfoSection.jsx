import React from 'react';
import { MdTitle, MdInventory, MdDescription, MdPriceCheck } from 'react-icons/md';
import { MdOutlineCurrencyExchange } from "react-icons/md";

const BasicInfoSection = ({ register, errors }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="flex items-center gap-2">
          <MdTitle className="text-lg" />
          <span className="label-text text-base-content">Загаловок *</span>
        </label>
        <input
          {...register('title', { required: 'Title is required' })}
          type="text"
          className="input input-bordered w-full"
        />
        {errors.title && <p className="text-error text-sm">{errors.title.message}</p>}
      </div>

      <div>
        <label className="flex items-center gap-2">
          <MdInventory className="text-lg" />
          <span className="label-text text-base-content">Запас *</span>
        </label>
        <input
          {...register('stock', { required: 'Stock is required' })}
          type="number"
          className="input input-bordered w-full"
        />
        {errors.stock && <p className="text-error text-sm">{errors.stock.message}</p>}
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
          {...register('price', { required: 'Price is required' })}
          type="text"
          placeholder="e.g., 1000, 2000"
          className="input input-bordered w-full"
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

export default BasicInfoSection;