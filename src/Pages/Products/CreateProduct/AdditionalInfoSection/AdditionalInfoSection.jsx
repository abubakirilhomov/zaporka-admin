import React from 'react';
import { MdTexture, MdWorkOutline, MdGrade, MdThermostat, MdCompress, MdExpand, MdModelTraining, MdApps, MdConstruction, MdTimelapse, MdLink, MdThumbUp } from 'react-icons/md';

const AdditionalInfoSection = ({ register, errors }) => (
  <div className="space-y-4">
    <div>
      <label className="flex items-center gap-2">
        <MdTexture className="text-lg" />
        <span className="label-text text-base-content">Материал поверхности (разделенные запятыми)</span>
      </label>
      <input
        {...register('surfaceMaterial')}
        type="text"
        placeholder="e.g., material1, material2"
        className="input input-bordered w-full"
      />
    </div>

    <div>
      <label className="flex items-center gap-2">
        <MdWorkOutline className="text-lg" />
        <span className="label-text text-base-content">Рабочая среда (разделенные запятыми)</span>
      </label>
      <input
        {...register('workEnv')}
        type="text"
        placeholder="e.g., env1, env2"
        className="input input-bordered w-full"
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="flex items-center gap-2">
          <MdGrade className="text-lg" />
          <span className="label-text text-base-content">Марка стали</span>
        </label>
        <input
          {...register('steelGrade')}
          type="text"
          className="input input-bordered w-full"
        />
      </div>

      <div>
        <label className="flex items-center gap-2">
          <MdThermostat className="text-lg" />
          <span className="label-text text-base-content">Температура рабочей среды</span>
        </label>
        <input
          {...register('workEnvTemperature')}
          type="text"
          className="input input-bordered w-full"
        />
      </div>
    </div>

    <div>
      <label className="flex items-center gap-2">
        <MdCompress className="text-lg" />
        <span className="label-text text-base-content">Номинальное давление (разделенные запятыми)</span>
      </label>
      <input
        {...register('nominalPressure')}
        type="text"
        placeholder="e.g., 10, 20"
        className="input input-bordered w-full"
      />
    </div>

    <div>
      <label className="flex items-center gap-2">
        <MdCompress className="text-lg" />
        <span className="label-text text-base-content">Рабочее давление (разделенные запятыми)</span>
      </label>
      <input
        {...register('workingPressure')}
        type="text"
        placeholder="e.g., 5, 15"
        className="input input-bordered w-full"
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="flex items-center gap-2">
          <MdCompress className="text-lg" />
          <span className="label-text text-base-content">Мин. давление (разделенные запятыми)</span>
        </label>
        <input
          {...register('minPressure')}
        type="text"
        placeholder="e.g., 1, 2"
        className="input input-bordered w-full"
      />
    </div>

    <div>
      <label className="flex items-center gap-2">
        <MdExpand className="text-lg" />
        <span className="label-text text-base-content">Максимальное давление (разделенные запятыми)</span>
      </label>
      <input
        {...register('maxPressure')}
        type="text"
        placeholder="e.g., 20, 30"
        className="input input-bordered w-full"
      />
    </div>
  </div>

  <div>
    <label className="flex items-center gap-2">
      <MdModelTraining className="text-lg" />
      <span className="label-text text-base-content">Модель</span>
    </label>
    <input
      {...register('model')}
      type="text"
      className="input input-bordered w-full"
    />
  </div>

  <div>
    <label className="flex items-center gap-2">
      <MdApps className="text-lg" />
      <span className="label-text text-base-content">Приложение (разделенные запятыми)</span>
    </label>
    <input
      {...register('application')}
      type="text"
      placeholder="e.g., app1, app2"
      className="input input-bordered w-full"
    />
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="flex items-center gap-2">
        <MdConstruction className="text-lg" />
        <span className="label-text text-base-content">Строительство</span>
      </label>
      <input
        {...register('construction')}
        type="text"
        className="input input-bordered w-full"
      />
    </div>

    <div>
      <label className="flex items-center gap-2">
        <MdTimelapse className="text-lg" />
        <span className="label-text text-base-content">Срок службы</span>
      </label>
      <input
        {...register('serviceLife')}
        type="text"
        className="input input-bordered w-full"
      />
    </div>
  </div>

  <div>
    <label className="flex items-center gap-2">
      <MdLink className="text-lg" />
      <span className="label-text text-base-content">Присоединение</span>
    </label>
    <input
      {...register('accession')}
      type="text"
      className="input input-bordered w-full"
    />
  </div>

  <div>
    <label className="flex items-center gap-2">
      <MdThumbUp className="text-lg" />
      <span className="label-text text-base-content">Преимущества (разделенные запятыми)</span>
    </label>
    <input
      {...register('advantages')}
      type="text"
      placeholder="e.g., adv1, adv2"
      className="input input-bordered w-full"
    />
  </div>
</div>
);

export default AdditionalInfoSection;