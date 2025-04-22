import React, { useState, useEffect } from "react";
import { MdImage, MdSlideshow } from "react-icons/md";
import { motion } from "framer-motion";

const ImagesSection = ({ register, errors, setValue, watch, onSwiperImagesChange }) => {
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [swiperImagePreviews, setSwiperImagePreviews] = useState([]);

  const mainImage = watch("mainImage");
  const swiperImages = watch("swiperImages") || [];

  // Обработка главной картинки
  const handleMainImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainImagePreview(URL.createObjectURL(file));
      setValue("mainImage", file, { shouldValidate: true });
    } else {
      setMainImagePreview(null);
      setValue("mainImage", null, { shouldValidate: true });
    }
  };

  // Обработка картинок для слайдера
  const handleLocalSwiperImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const limitedFiles = files.slice(0, 3 - swiperImages.length);
      setSwiperImagePreviews([...swiperImagePreviews, ...limitedFiles.map((file) => URL.createObjectURL(file))]);
      setValue("swiperImages", [...swiperImages, ...limitedFiles], { shouldValidate: true });
      if (onSwiperImagesChange) onSwiperImagesChange(e);
    }
  };

  useEffect(() => {
    return () => {
      if (mainImagePreview) URL.revokeObjectURL(mainImagePreview);
      swiperImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const previewVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
  };

  return (
    <div className="space-y-6">
      {/* Главная картинка */}
      <div>
        <label className="flex items-center gap-2 mb-2">
          <MdImage className="text-lg text-base-content" />
          <span className="label-text text-base-content font-medium">Главная картинка</span>
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleMainImageChange}
          className="file-input file-input-bordered w-full bg-base-100 focus:file-input-primary"
        />
        {/* Ручная регистрация поля */}
        <input
          type="hidden"
          {...register("mainImage", {
            required: "Главная картинка обязательна",
          })}
        />
        {errors.mainImage && (
          <p className="text-error text-sm mt-1">{errors.mainImage.message}</p>
        )}
        {mainImagePreview && (
          <motion.div className="mt-4" variants={previewVariants} initial="hidden" animate="visible">
            <img
              src={mainImagePreview}
              alt="Main Preview"
              className="w-32 h-32 object-cover rounded-lg shadow-md"
            />
          </motion.div>
        )}
      </div>

      {/* Картинки для слайдера */}
      <div>
        <label className="flex items-center gap-2 mb-2">
          <MdSlideshow className="text-lg text-base-content" />
          <span className="label-text text-base-content font-medium">
            Картинки для слайдера (макс. 3)
          </span>
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleLocalSwiperImagesChange}
          className="file-input file-input-bordered w-full bg-base-100 focus:file-input-primary"
        />
        {/* Ручная регистрация поля */}
        <input
          type="hidden"
          {...register("swiperImages", {
            validate: (value) =>
              !value || value.length <= 3 || "Максимум 3 изображения разрешено",
          })}
        />
        {errors.swiperImages && (
          <p className="text-error text-sm mt-1">{errors.swiperImages.message}</p>
        )}
        {swiperImagePreviews.length > 0 && (
          <motion.div
            className="mt-4 flex flex-wrap gap-4"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {swiperImagePreviews.map((preview, index) => (
              <motion.div key={index} variants={previewVariants} className="relative">
                <img
                  src={preview}
                  alt={`Swiper Preview ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-lg shadow-md"
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ImagesSection;
