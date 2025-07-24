import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { MdImage } from "react-icons/md";
import { motion } from "framer-motion";

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const EditProductImages = ({ initialImages = [], onImagesChange, readOnly = false }) => {
  const [images, setImages] = useState(initialImages); // Существующие картинки (URL)
  const [newImages, setNewImages] = useState([]);      // Новые картинки (File)

  const allPreviews = [
    ...images, // уже загруженные (URL)
    ...newImages.map((file) => URL.createObjectURL(file)), // новые (blob)
  ];

  // Удаление по индексу
  const handleRemoveImage = (index) => {
    if (readOnly) return;

    if (index < images.length) {
      // Удаляем из старых
      const updatedImages = [...images];
      updatedImages.splice(index, 1);
      setImages(updatedImages);
    } else {
      // Удаляем из новых
      const newIndex = index - images.length;
      const updatedNewImages = [...newImages];
      updatedNewImages.splice(newIndex, 1);
      setNewImages(updatedNewImages);
    }
  };

  // Загрузка новых
  const handleNewImageChange = (e) => {
    if (readOnly) return;

    const files = Array.from(e.target.files || []);
    const oversized = files.filter((f) => f.size > MAX_FILE_SIZE);
    if (oversized.length > 0) {
      toast.error("Каждое изображение должно быть меньше 5MB");
      return;
    }

    const totalCount = images.length + newImages.length;
    if (totalCount >= MAX_IMAGES) {
      toast.error(`Максимум ${MAX_IMAGES} изображений`);
      return;
    }

    const filesToAdd = files.slice(0, MAX_IMAGES - totalCount);
    setNewImages((prev) => [...prev, ...filesToAdd]);
  };

  // Уведомление родителя о изменениях
  useEffect(() => {
    onImagesChange(images, newImages);
  }, [images, newImages]);

  // Очистка blob ссылок
  useEffect(() => {
    return () => {
      newImages.forEach((file) => URL.revokeObjectURL(file));
    };
  }, [newImages]);

  const previewVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 mb-2">
        <MdImage className="text-lg" />
        <span className="font-medium">Галерея изображений (макс. 5)</span>
      </label>

      {!readOnly && (
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleNewImageChange}
          disabled={images.length + newImages.length >= MAX_IMAGES}
          className="file-input file-input-bordered w-full bg-base-100"
        />
      )}

      <motion.div
        className="flex flex-wrap gap-4 mt-4"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        {allPreviews.length > 0 ? (
          allPreviews.map((preview, index) => (
            <motion.div key={index} variants={previewVariants} className="relative w-24 h-24">
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
          ))
        ) : (
          <p className="text-base-content">Нет изображений</p>
        )}
      </motion.div>
    </div>
  );
};

export default EditProductImages;
