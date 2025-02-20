import React from 'react';
import { useForm } from 'react-hook-form';
import useFetch from '../../../hooks/useFetch';
import { toast } from 'react-toastify';
import BasicInfoSection from '../../../Components/BasicInfoSection/BasicInfoSection';
import ImagesSection from './ImagesSection/ImagesSection';
import TechnicalSpecsSection from './TechnicalSpecsSection/TechnicalSpecsSection';
import AdditionalInfoSection from './AdditionalInfoSection/AdditionalInfoSection';
import { MdOutlinePlaylistAdd } from 'react-icons/md';

const CreateProduct = () => {
  const { loading, error, postData } = useFetch(
    `${process.env.REACT_APP_API_URL}/api/v1/`, // Assuming this is the correct endpoint
    {},
    false
  );

  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleCreateProduct = async (data) => {
    try {
      const product = {
        title: data.title,
        description: data.description,
        stock: Number(data.stock),
        price: data.price.split(',').map(Number).filter(Boolean),
        currency: data.currency || 'UZS',
        mainImage: data.mainImage,
        swiperImages: data.swiperImages ? data.swiperImages.split(',').map(s => s.trim()) : [],
        thickness: data.thickness,
        SDR: data.SDR ? Number(data.SDR) : undefined,
        rotationAngle: data.rotationAngle,
        material: data.material,
        sizeInInch: data.sizeInInch ? data.sizeInInch.split(',').map(s => s.trim()) : [],
        sizeInmm: data.sizeInmm ? data.sizeInmm.split(',').map(Number).filter(Boolean) : [],
        DN: data.DN ? data.DN.split(',').map(Number).filter(Boolean) : [],
        type: data.type ? data.type.split(',').map(s => s.trim()) : [],
        manufacturer: data.manufacturer,
        standart: data.standart,
        surfaceMaterial: data.surfaceMaterial ? data.surfaceMaterial.split(',').map(s => s.trim()) : [],
        workEnv: data.workEnv ? data.workEnv.split(',').map(s => s.trim()) : [],
        steelGrade: data.steelGrade,
        workEnvTemperature: data.workEnvTemperature,
        nominalPressure: data.nominalPressure ? data.nominalPressure.split(',').map(s => s.trim()) : [],
        workingPressure: data.workingPressure ? data.workingPressure.split(',').map(s => s.trim()) : [],
        minPressure: data.minPressure ? data.minPressure.split(',').map(s => s.trim()) : [],
        maxPressure: data.maxPressure ? data.maxPressure.split(',').map(s => s.trim()) : [],
        model: data.model,
        application: data.application ? data.application.split(',').map(s => s.trim()) : [],
        construction: data.construction,
        serviceLife: data.serviceLife,
        accession: data.accession,
        advantages: data.advantages ? data.advantages.split(',').map(s => s.trim()) : [],
      };

      await postData(product);
      toast.success('Product created successfully');
      console.log('Product created successfully');
    } catch (err) {
      toast.error(err.message || 'An error occurred while creating the product');
      console.error('Error creating product:', err);
    }
  };

  return (
    <div className="max-w-[90%] mx-auto p-4 bg-base-100 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MdOutlinePlaylistAdd className="text-3xl text-base-content" /> Создать новый продукт
      </h2>
      <form onSubmit={handleSubmit(handleCreateProduct)} className="space-y-6">
        <BasicInfoSection register={register} errors={errors} />
        <ImagesSection register={register} errors={errors} />
        <TechnicalSpecsSection register={register} errors={errors} />
        <AdditionalInfoSection register={register} errors={errors} />

        <button
          type="submit"
          disabled={loading}
          className={`btn btn-primary w-full`}
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <>
              <MdOutlinePlaylistAdd className="mr-2" /> Создать
            </>
          )}
        </button>

        {error && <p className="text-error text-sm mt-2">Ошибка: {error}</p>}
      </form>
    </div>
  );
};

export default CreateProduct;