import React, { useState, useEffect } from "react";
import { MdImage, MdSlideshow } from "react-icons/md";
import { motion } from "framer-motion";

const ImagesSection = ({ register, errors, setValue, watch, onSwiperImagesChange }) => {
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [swiperImagePreviews, setSwiperImagePreviews] = useState([]);

  // Watch form values
  const mainImage = watch("mainImage");
  const swiperImages = watch("swiperImages") || [];

  // Handle main image upload
  const handleMainImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("mainImage", file, { shouldValidate: true });
      setMainImagePreview(URL.createObjectURL(file));
    } else {
      setValue("mainImage", null, { shouldValidate: true });
      setMainImagePreview(null);
    }
  };

  // Handle swiper images upload with max 3 limit
  const handleLocalSwiperImagesChange = (e) => {
    if (onSwiperImagesChange) {
      onSwiperImagesChange(e); // Delegate to parent handler
    }
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSwiperImagePreviews(files.slice(0, 3 - swiperImages.length).map((file) => URL.createObjectURL(file)));
    }
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (mainImagePreview) URL.revokeObjectURL(mainImagePreview);
      swiperImagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [mainImagePreview, swiperImagePreviews]);

  // Animation variants
  const previewVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
  };

  return (
    <div className="space-y-6">
      {/* Main Image Upload */}
      <div>
        <label className="flex items-center gap-2 mb-2">
          <MdImage className="text-lg text-base-content" />
          <span className="label-text text-base-content font-medium">Главная картинка *</span>
        </label>
        <input
          type="file"
          accept="image/*"
          {...register("mainImage", { required: "Main image is required" })}
          onChange={handleMainImageChange}
          className="file-input file-input-bordered w-full bg-base-100 focus:file-input-primary"
        />
        {errors.mainImage && (
          <p className="text-error text-sm mt-1">{errors.mainImage.message}</p>
        )}
        {mainImagePreview && (
          <motion.div
            className="mt-4"
            variants={previewVariants}
            initial="hidden"
            animate="visible"
          >
            <img
              src={mainImagePreview}
              alt="Main Image Preview"
              className="w-32 h-32 object-cover rounded-lg shadow-md"
            />
          </motion.div>
        )}
      </div>

      {/* Swiper Images Upload */}
      <div>
        <label className="flex items-center gap-2 mb-2">
          <MdSlideshow className="text-lg text-base-content" />
          <span className="label-text text-base-content font-medium">Картинки для слайдера (макс. 3)</span>
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          {...register("swiperImages", {
            validate: (files) =>
              !files || files.length <= 3 || "Максимум 3 изображения разрешено",
          })}
          onChange={handleLocalSwiperImagesChange}
          className="file-input file-input-bordered w-full bg-base-100 focus:file-input-primary"
        />
        {errors.swiperImages && (
          <p className="text-error text-sm mt-1">{errors.swiperImages.message}</p>
        )}
        {swiperImagePreviews.length > 0 && (
          <motion.div
            className="mt-4 flex flex-wrap gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {swiperImagePreviews.map((preview, index) => (
              <motion.div
                key={index}
                variants={previewVariants}
                className="relative"
              >
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