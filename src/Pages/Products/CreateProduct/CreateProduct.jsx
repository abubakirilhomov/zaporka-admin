import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useFetch from "../../../hooks/useFetch";
import { toast } from "react-toastify";
import BasicInfoSection from "../../../Components/BasicInfoSection/BasicInfoSection";
import ImagesSection from "./ImagesSection/ImagesSection";
import TechnicalSpecsSection from "./TechnicalSpecsSection/TechnicalSpecsSection";
import AdditionalInfoSection from "./AdditionalInfoSection/AdditionalInfoSection";
import { MdOutlinePlaylistAdd } from "react-icons/md";

const CreateProduct = () => {
  const { loading, error, postData } = useFetch(
    `${process.env.REACT_APP_API_URL}/api/v1/products`,
    {},
    false
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger, // Added to manually trigger validation
  } = useForm();

  // Watch form values
  const mainImage = watch("mainImage");
  const swiperImages = watch("swiperImages") || [];
  console.log("Main Image:", mainImage);
  console.log("Swiper Images (Watch):", swiperImages);

  const handleSwiperImagesChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 3 || (swiperImages.length + files.length) > 3) {
      toast.error("Можно выбрать максимум 3 изображения для слайдера");
      return;
    }

    const newFiles = [...swiperImages, ...files].slice(0, 3);
    setValue("swiperImages", newFiles, { shouldValidate: true });
    trigger("swiperImages"); // Manually trigger validation
  };

  const handleCreateProduct = async (data) => {
    try {
      const formData = new FormData();
      console.log("Form Data being constructed:", data);

      formData.append("title", data.title || "");
      formData.append("description", data.description || "");
      formData.append("stock", Number(data.stock) || 0);
      formData.append("price", JSON.stringify(data.price?.split(",").map(Number).filter(Boolean) || []));
      formData.append("currency", data.currency || "UZS");

      if (data.mainImage && data.mainImage.length > 0) {
        formData.append("mainImage", data.mainImage[0]); // Ensure single file
      } else {
        throw new Error("Main image is required");
      }

      if (swiperImages.length > 0) {
        swiperImages.slice(0, 3).forEach((file) => {
          formData.append("swiperImages", file);
        });
      }

      formData.append("thickness", data.thickness || "");
      formData.append("SDR", data.SDR ? Number(data.SDR) : "");
      formData.append("rotationAngle", data.rotationAngle || "");
      formData.append("material", data.material || "");
      formData.append("sizeInInch", JSON.stringify(data.sizeInInch?.split(",").map(s => s.trim()) || []));
      formData.append("sizeInmm", JSON.stringify(data.sizeInmm?.split(",").map(Number).filter(Boolean) || []));
      formData.append("DN", JSON.stringify(data.DN?.split(",").map(Number).filter(Boolean) || []));
      formData.append("type", JSON.stringify(data.type?.split(",").map(s => s.trim()) || []));
      formData.append("manufacturer", data.manufacturer || "");
      formData.append("standart", data.standart || "");
      formData.append("surfaceMaterial", JSON.stringify(data.surfaceMaterial?.split(",").map(s => s.trim()) || []));
      formData.append("workEnv", JSON.stringify(data.workEnv?.split(",").map(s => s.trim()) || []));
      formData.append("steelGrade", data.steelGrade || "");
      formData.append("workEnvTemperature", data.workEnvTemperature || "");
      formData.append("nominalPressure", JSON.stringify(data.nominalPressure?.split(",").map(s => s.trim()) || []));
      formData.append("workingPressure", JSON.stringify(data.workingPressure?.split(",").map(s => s.trim()) || []));
      formData.append("minPressure", JSON.stringify(data.minPressure?.split(",").map(s => s.trim()) || []));
      formData.append("maxPressure", JSON.stringify(data.maxPressure?.split(",").map(s => s.trim()) || []));
      formData.append("model", data.model || "");
      formData.append("application", JSON.stringify(data.application?.split(",").map(s => s.trim()) || []));
      formData.append("construction", data.construction || "");
      formData.append("serviceLife", data.serviceLife || "");
      formData.append("accession", data.accession || "");
      formData.append("advantages", JSON.stringify(data.advantages?.split(",").map(s => s.trim()) || []));

      const response = await postData(
        `${process.env.REACT_APP_API_URL}/api/v1/products`,
        formData,
        { "Content-Type": "multipart/form-data" }
      );
      toast.success("Product created successfully");
      console.log("Product created successfully:", response);
    } catch (err) {
      toast.error(`Error creating product: ${err.message || "Unknown error"}`);
      console.error("Error details:", err);
    }
  };

  return (
    <div className="max-w-[90%] mx-auto p-4 bg-base-100 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MdOutlinePlaylistAdd className="text-3xl text-base-content" /> Создать новый продукт
      </h2>
      <form onSubmit={handleSubmit(handleCreateProduct)} className="space-y-6">
        <BasicInfoSection register={register} errors={errors} />
        <ImagesSection
          register={register}
          errors={errors}
          setValue={setValue}
          watch={watch}
          onSwiperImagesChange={handleSwiperImagesChange}
        />
        <TechnicalSpecsSection register={register} errors={errors} />
        <AdditionalInfoSection register={register} errors={errors} />

        <button
          type="submit"
          disabled={loading}
          className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
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