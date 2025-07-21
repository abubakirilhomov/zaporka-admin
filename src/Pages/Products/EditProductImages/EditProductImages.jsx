import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const MAX_IMAGES = 5;

const EditProductImages = ({ initialImages = [], productId, token, onSave, readOnly = false }) => {
  const [images, setImages] = useState(initialImages);
  const [newImages, setNewImages] = useState([]);

  const handleRemoveImage = (index) => {
    if (readOnly) return;
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  const handleNewImageChange = (e) => {
    if (readOnly) return;
    const files = Array.from(e.target.files);
    const totalImages = images.length + newImages.length;

    if (totalImages + files.length > MAX_IMAGES) {
      toast.error(`Максимум ${MAX_IMAGES} изображений`);
      return;
    }

    setNewImages((prev) => [...prev, ...files]);
  };

  const handleUpload = async () => {
    if (readOnly || newImages.length === 0) return;

    try {
      // Convert new images to Base64
      const base64Images = await Promise.all(
        newImages.map((file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
        )
      );

      // Combine existing images with new Base64 images
      const updatedImages = [...images, ...base64Images];

      // Update product with new images
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/v1/products/${productId}`,
        { swiperImages: updatedImages },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setImages(updatedImages);
      setNewImages([]);
      onSave();
      toast.success("Изображения успешно обновлены");
    } catch (err) {
      toast.error("Ошибка при сохранении изображений: " + err.message);
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-base-content">Изображения продукта</h4>
      {images.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {images.map((img, idx) => (
            <div key={idx} className="relative w-24 h-24">
              <img
                src={img}
                alt={`preview-${idx}`}
                className="w-full h-full object-cover rounded"
                onError={(e) => (e.target.src = "/placeholder-image.jpg")} // Fallback image
              />
              {!readOnly && (
                <button
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-base-content">Нет изображений</p>
      )}
      {!readOnly && (
        <>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleNewImageChange}
            disabled={images.length + newImages.length >= MAX_IMAGES}
            className="file-input file-input-bordered w-full"
          />
          {newImages.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {newImages.map((img, idx) => (
                <div key={idx} className="relative w-24 h-24">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`new-preview-${idx}`}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              ))}
            </div>
          )}
          <button
            onClick={handleUpload}
            disabled={newImages.length === 0}
            className="btn btn-primary mt-4"
          >
            Сохранить изображения
          </button>
        </>
      )}
    </div>
  );
};

export default EditProductImages;   