import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { MdImage } from "react-icons/md";
import { motion } from "framer-motion";

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const EditProductImages = ({ initialImages = [], onImagesChange, readOnly = false }) => {
  const [images, setImages] = useState(initialImages); // Existing images (URLs or Base64)
  const [newImages, setNewImages] = useState([]); // New files selected
  const [imagePreviews, setImagePreviews] = useState(initialImages); // Previews for display

  const handleRemoveImage = (index) => {
    if (readOnly) return;
    const updatedImages = [...images];
    const updatedPreviews = [...imagePreviews];
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setImages(updatedImages);
    setImagePreviews(updatedPreviews);
    onImagesChange(updatedImages, newImages); // Notify parent
  };

  const handleNewImageChange = (e) => {
    if (readOnly) return;
    const files = Array.from(e.target.files || []);
    const oversizedFiles = files.filter((file) => file.size > MAX_FILE_SIZE);

    if (oversizedFiles.length > 0) {
      toast.error("Каждое изображение должно быть меньше 5MB");
      return;
    }

    const totalImages = images.length + newImages.length;
    if (totalImages + files.length > MAX_IMAGES) {
      toast.error(`Максимум ${MAX_IMAGES} изображений`);
      return;
    }

    const limitedFiles = files.slice(0, MAX_IMAGES - totalImages);
    const newPreviews = limitedFiles.map((file) => URL.createObjectURL(file));
    setNewImages((prev) => [...prev, ...limitedFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    onImagesChange(images, [...newImages, ...limitedFiles]); // Notify parent
  };

  useEffect(() => {
    // Clean up object URLs when component unmounts or previews change
    return () => {
      imagePreviews.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imagePreviews]);

  const previewVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="flex items-center gap-2 mb-2">
          <MdImage className="text-lg text-base-content" />
          <span className="label-text text-base-content font-medium">
            Галерея изображений (макс. 5)
          </span>
        </label>
        {!readOnly && (
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleNewImageChange}
            disabled={images.length + newImages.length >= MAX_IMAGES}
            className="file-input file-input-bordered w-full bg-base-100 focus:file-input-primary"
          />
        )}
        {imagePreviews.length > 0 ? (
          <motion.div
            className="mt-4 flex flex-wrap gap-4"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {imagePreviews.map((preview, index) => (
              <motion.div
                key={index}
                variants={previewVariants}
                className="relative w-24 h-24"
              >
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-lg shadow-md"
                  onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                />
                {!readOnly && (
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    ×
                  </button>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-base-content mt-4">Нет изображений</p>
        )}
      </div>
    </div>
  );
};

export default EditProductImages;