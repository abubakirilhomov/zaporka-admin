import React, { useState, useEffect } from "react";
import { MdImage, MdSlideshow } from "react-icons/md";
import { motion } from "framer-motion";

const ImagesSection = ({ register, errors, setValue, watch, onSwiperImagesChange }) => {
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [swiperImagePreviews, setSwiperImagePreviews] = useState([]);

  const mainImage = watch("mainImage");
  const swiperImages = watch("swiperImages") || [];

  const handleMainImageChange = (e) => {
    const file = e.target.files?.[0];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (file) {
      if (file.size > maxSize) {
        alert("Главная картинка должна быть меньше 5MB");
        return;
      }
      setMainImagePreview(URL.createObjectURL(file));
      setValue("mainImage", file, { shouldValidate: true });
    } else {
      setMainImagePreview(null);
      setValue("mainImage", null, { shouldValidate: true });
    }
  };

  const handleLocalSwiperImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter((file) => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      alert("Каждое изображение для слайдера должно быть меньше 5MB");
      return;
    }

    if (files.length > 0) {
      const limitedFiles = files.slice(0, 3 - swiperImages.length);
      setSwiperImagePreviews([
        ...swiperImagePreviews,
        ...limitedFiles.map((file) => URL.createObjectURL(file)),
      ]);
      setValue("swiperImages", [...swiperImages, ...limitedFiles], { shouldValidate: true });
      if (onSwiperImagesChange) onSwiperImagesChange(e);
    }
  };

  useEffect(() => {
    return () => {
      if (mainImagePreview) URL.revokeObjectURL(mainImagePreview);
      swiperImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [mainImagePreview, swiperImagePreviews]);

  const previewVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
  };

  return (
    <div className="space-y-6">
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