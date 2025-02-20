import React from 'react';
import { MdStraighten, MdSpeed, MdRotate90DegreesCcw, MdBuild, MdFormatSize, MdNumbers, MdCategory, MdFactory, MdRule } from 'react-icons/md';

const TechnicalSpecsSection = ({ register, errors }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="flex items-center gap-2">
          <MdStraighten className="text-lg" />
          <span className="label-text text-base-content">Толщина</span>
        </label>
        <input
          {...register('thickness')}
          type="text"
          className="input input-bordered w-full"
        />
      </div>

      <div>
        <label className="flex items-center gap-2">
          <MdSpeed className="text-lg" />
          <span className="label-text text-base-content">SDR</span>
        </label>
        <input
          {...register('SDR')}
          type="number"
          step="0.1"
          className="input input-bordered w-full"
        />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="flex items-center gap-2">
          <MdRotate90DegreesCcw className="text-lg" />
          <span className="label-text text-base-content">Угол поворота</span>
        </label>
        <input
          {...register('rotationAngle')}
          type="text"
          className="input input-bordered w-full"
        />
      </div>

      <div>
        <label className="flex items-center gap-2">
          <MdBuild className="text-lg" />
          <span className="label-text text-base-content">Материал</span>
        </label>
        <input
          {...register('material')}
          type="text"
          className="input input-bordered w-full"
        />
      </div>
    </div>

    <div>
      <label className="flex items-center gap-2">
        <MdFormatSize className="text-lg" />
        <span className="label-text text-base-content">Размер в дюймах (разделенные запятыми)</span>
      </label>
      <input
        {...register('sizeInInch')}
        type="text"
        placeholder="e.g., 1/2, 3/4"
        className="input input-bordered w-full"
      />
    </div>

    <div>
      <label className="flex items-center gap-2">
        <MdNumbers className="text-lg" />
        <span className="label-text text-base-content">Размер в мм (разделенные запятыми)</span>
      </label>
      <input
        {...register('sizeInmm')}
        type="text"
        placeholder="e.g., 15, 20"
        className="input input-bordered w-full"
      />
    </div>

    <div>
      <label className="flex items-center gap-2">
        <MdNumbers className="text-lg" />
        <span className="label-text text-base-content">DN (разделенные запятыми)</span>
      </label>
      <input
        {...register('DN')}
        type="text"
        placeholder="e.g., 15, 20"
        className="input input-bordered w-full"
      />
    </div>

    <div>
      <label className="flex items-center gap-2">
        <MdCategory className="text-lg" />
        <span className="label-text text-base-content">Тип (разделенные запятыми)</span>
      </label>
      <input
        {...register('type')}
        type="text"
        placeholder="e.g., type1, type2"
        className="input input-bordered w-full"
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="flex items-center gap-2">
          <MdFactory className="text-lg" />
          <span className="label-text text-base-content">Производитель</span>
        </label>
        <input
          {...register('manufacturer')}
          type="text"
          className="input input-bordered w-full"
        />
      </div>

      <div>
        <label className="flex items-center gap-2">
          <MdRule className="text-lg" />
          <span className="label-text text-base-content">Стандарт</span>
        </label>
        <input
          {...register('standart')}
          type="text"
          className="input input-bordered w-full"
        />
      </div>
    </div>
  </div>
);

export default TechnicalSpecsSection;