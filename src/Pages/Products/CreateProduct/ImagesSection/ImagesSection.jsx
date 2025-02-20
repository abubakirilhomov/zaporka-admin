import React from 'react';
import { MdImage, MdSlideshow } from 'react-icons/md';

const ImagesSection = ({ register, errors }) => (
  <div className="space-y-4">
    <div>
      <label className="flex items-center gap-2">
        <MdImage className="text-lg" />
        <span className="label-text text-base-content">URL Главной Картинки *</span>
      </label>
      <input
        {...register('mainImage', { required: 'Main image is required' })}
        type="text"
        className="input input-bordered w-full"
      />
      {errors.mainImage && <p className="text-error text-sm">{errors.mainImage.message}</p>}
    </div>

    <div>
      <label className="flex items-center gap-2">
        <MdSlideshow className="text-lg" />
        <span className="label-text text-base-content">Картинки для слайдера (URL разделенные запятыми)</span>
      </label>
      <input
        {...register('swiperImages')}
        type="text"
        placeholder="e.g., url1, url2, url3"
        className="input input-bordered w-full"
      />
    </div>
  </div>
);

export default ImagesSection;