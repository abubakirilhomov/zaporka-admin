import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { MdEdit, MdDelete, MdSave, MdClose, MdOutlinePlaylistAdd, MdImage } from "react-icons/md";
import CustomBtn from "../../../Components/CustomBtn/CustomBtn";
import axios from "axios";
import { motion } from "framer-motion";

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const EditProduct = ({ product, apiUrl, token, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState({ ...product });
  const [existingImages, setExistingImages] = useState(product.swiperImages || []);
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState(product.swiperImages || []);
  const [allProducts, setAllProducts] = useState([]);
  const imagesUrl = process.env.REACT_APP_API_URL;

  const fieldLabels = {
    title: "Название",
    stock: "Запас",
    price: "Цена",
    pressure: "Давление",
    material: "Материал",
    size: "Размер",
    sizeInInch: "Размер в дюймах",
    sizeInmm: "Размер в миллиметрах",
    DN: "Диаметр номинальный",
    type: "Тип",
    surfaceMaterial: "Материал поверхности",
    workEnv: "Рабочая среда",
    nominalPressure: "Номинальное давление",
    workingPressure: "Рабочее давление",
    minPressure: "Минимальное давление",
    maxPressure: "Максимальное давление",
    application: "Применение",
    advantages: "Преимущества",
    others: "Похожие продукты",
    images: "Картинки",
    category: "Категория",
    weight: "Вес",
    maxTemperature: "Макс. температура",
    controlType: "Тип управления",
  };

  // Fetch all products for the "others" field
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllProducts(response.data.filter((p) => p._id !== product._id));
      } catch (err) {
        toast.error("Ошибка при загрузке продуктов: " + err.message);
      }
    };
    fetchProducts();
  }, [apiUrl, token, product._id]);

  // Clean up blob URLs
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imagePreviews]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditedProduct({ ...product });
      setExistingImages(product.swiperImages || []);
      setImagePreviews(product.swiperImages || []);
      setNewImages([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const isArrayField = [
      "price",
      "sizeInInch",
      "sizeInmm",
      "DN",
      "type",
      "surfaceMaterial",
      "workEnv",
      "nominalPressure",
      "workingPressure",
      "minPressure",
      "maxPressure",
      "application",
      "advantages",
      "others",
    ].includes(name);

    setEditedProduct((prev) => ({
      ...prev,
      [name]: isArrayField
        ? value.split(",").map((item) => item.trim()).filter(Boolean)
        : value,
    }));
  };

  const handleOthersChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
    setEditedProduct((prev) => ({
      ...prev,
      others: selectedOptions,
    }));
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...existingImages];
    const updatedPreviews = [...imagePreviews];
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setExistingImages(updatedImages);
    setImagePreviews(updatedPreviews);
    setNewImages([...newImages]);
  };

  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    const oversizedFiles = files.filter((file) => file.size > MAX_FILE_SIZE);

    if (oversizedFiles.length > 0) {
      toast.error("Каждое изображение должно быть меньше 5MB");
      return;
    }

    const totalImages = existingImages.length + newImages.length;
    if (totalImages + files.length > MAX_IMAGES) {
      toast.error(`Максимум ${MAX_IMAGES} изображений`);
      return;
    }

    const limitedFiles = files.slice(0, MAX_IMAGES - totalImages);
    const newPreviews = limitedFiles.map((file) => URL.createObjectURL(file));
    setNewImages((prev) => [...prev, ...limitedFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleSave = async () => {
    if (!editedProduct || !editedProduct._id) return;

    try {
      const base64Images = await Promise.all(
        newImages.map(
          (file) =>
            new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            })
        )
      );

      const updatedImages = [...existingImages, ...base64Images];
      const updatedProduct = {
        ...editedProduct,
        images: updatedImages,
      };

      const updateUrl = `${apiUrl}/${editedProduct._id}`;
      await axios.put(updateUrl, updatedProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIsEditing(false);
      setExistingImages(updatedImages);
      setImagePreviews(updatedImages);
      setNewImages([]);
      onSave();
      toast.success("Продукт и изображения успешно обновлены");
    } catch (err) {
      toast.error("Ошибка при обновлении продукта: " + err.message);
    }
  };

  const shouldDisplayField = (key) => {
    const excludedFields = [
      "_id",
      "createdAt",
      "updatedAt",
      "__v",
      "accession",
      "availability",
      "construction",
      "currency",
      "description",
      "mainImage",
      "views",
      "ordersCount",
      "steelGrade",
      "workEnvTemperature",
      "swiperImages",
    ];
    return !excludedFields.includes(key);
  };

  const normalizeFieldValue = (value) => {
    if (value === undefined || value === null) return "Н/Д";
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "boolean") return value ? "Да" : "Нет";
    if (typeof value === "object") {
      if (value.name) return value.name;
      return JSON.stringify(value, null, 2).replace(/{|}/g, "");
    }
    return value.toString();
  };

  const getImageSrc = (image) => {
    if (image.startsWith("data:image")) {
      return image;
    }
    return `${imagesUrl}${image.startsWith("/") ? "" : "/"}${image}`;
  };

  const previewVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
  };

  return (
    <div className="space-y-6">
      <h3 className="font-bold text-lg flex items-center gap-2 mb-6">
        <MdOutlinePlaylistAdd className="text-2xl" /> Детали продукта:{" "}
        {product.title || "Без названия"}
      </h3>
      {isEditing ? (
        <div className="space-y-6">
          {Object.entries(editedProduct).map(([key, value]) => {
            if (!shouldDisplayField(key)) return null;
            return (
              <div
                key={key}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center"
              >
                <label className="font-semibold capitalize text-base-content text-sm">
                  {fieldLabels[key] || key.replace(/([A-Z])/g, " $1").trim()}:
                </label>
                {key === "others" ? (
                  <select
                    name={key}
                    multiple
                    value={Array.isArray(value) ? value : []}
                    onChange={handleOthersChange}
                    className="select select-bordered w-full max-h-40"
                  >
                    {allProducts.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                ) : typeof value === "boolean" ? (
                  <select
                    name={key}
                    value={value ? "true" : "false"}
                    onChange={handleInputChange}
                    className="select select-bordered w-full"
                  >
                    <option value="true">Да</option>
                    <option value="false">Нет</option>
                  </select>
                ) : Array.isArray(value) ? (
                  <input
                    type="text"
                    name={key}
                    value={value.join(", ")}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder={`Введите через запятую, например: ${value.join(", ")}`}
                  />
                ) : typeof value === "object" ? (
                  <input
                    type="text"
                    name={key}
                    value={value.name || JSON.stringify(value, null, 2)}
                    onChange={(e) =>
                      handleInputChange({
                        target: { name: key, value: e.target.value },
                      })
                    }
                    className="input input-bordered w-full"
                  />
                ) : (
                  <input
                    type="text"
                    name={key}
                    value={value ?? ""}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                )}
              </div>
            );
          })}
          <div>
            <label className="flex items-center gap-2 mb-2">
              <MdImage className="text-lg text-base-content" />
              <span className="label-text text-base-content font-medium">
                Галерея изображений (макс. 5)
              </span>
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleNewImageChange}
              disabled={existingImages.length + newImages.length >= MAX_IMAGES}
              className="file-input file-input-bordered w-full bg-base-100 focus:file-input-primary"
            />
            {imagePreviews.length > 0 ? (
              <motion.div
                className="mt-4 flex flex-wrap gap-4"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              >
                {imagePreviews.map((image, index) => (
                  <motion.div
                    key={index}
                    variants={previewVariants}
                    className="relative w-24 h-24"
                  >
                    <img
                      src={getImageSrc(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-lg shadow-md"
                      onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <p className="text-base-content mt-4">Нет изображений</p>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(product).map(([key, value]) => {
            if (!shouldDisplayField(key)) return null;
            if ((key === "swiperImages" || key === "images") && Array.isArray(value)) {
              return (
                <div
                  key={key}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center border-b pb-4 last:border-b-0"
                >
                  <span className="font-semibold capitalize text-base-content text-sm">
                    {fieldLabels[key] || key.replace(/([A-Z])/g, " $1").trim()}:
                  </span>
                  <motion.div
                    className="flex flex-wrap gap-4"
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                  >
                    {value.map((image, index) => (
                      <motion.div
                        key={index}
                        variants={previewVariants}
                        className="relative w-24 h-24"
                      >
                        <img
                          src={getImageSrc(image)}
                          alt={`Image ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-lg shadow-md"
                          onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              );
            }
            return (
              <div
                key={key}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center border-b pb-4 last:border-b-0"
              >
                <span className="font-semibold capitalize text-base-content text-sm">
                  {fieldLabels[key] || key.replace(/([A-Z])/g, " $1").trim()}:
                </span>
                <span className="text-base-content text-sm">{normalizeFieldValue(value)}</span>
              </div>
            );
          })}
          <div>
            <label className="flex items-center gap-2 mb-2">
              <MdImage className="text-lg text-base-content" />
              <span className="label-text text-base-content font-medium">
                Галерея изображений
              </span>
            </label>
            {(product.images || []).length > 0 ? (
              <motion.div
                className="mt-4 flex flex-wrap gap-4"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              >
                {product.images.map((image, index) => (
                  <motion.div
                    key={index}
                    variants={previewVariants}
                    className="relative w-24 h-24"
                  >
                    <img
                      src={getImageSrc(image)}
                      alt={`Product image ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-lg shadow-md"
                      onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <p className="text-base-content mt-4">Нет изображений</p>
            )}
          </div>
        </div>
      )}
      <div className="modal-action flex gap-4 mt-6">
        {isEditing ? (
          <CustomBtn
            text="Сохранить"
            method="put"
            onClick={handleSave}
            variant="success"
            className="flex items-center gap-2"
          >
            <MdSave />
          </CustomBtn>
        ) : (
          <CustomBtn
            text="Редактировать"
            method="put"
            onClick={handleEditToggle}
            className="flex items-center gap-2"
          >
            <MdEdit />
          </CustomBtn>
        )}
        <CustomBtn
          text="Удалить"
          method="delete"
          onClick={onDelete}
          className="flex items-center gap-2"
        >
          <MdDelete />
        </CustomBtn>
        <CustomBtn
          text="Закрыть"
          method="post"
          onClick={() => document.getElementById("product_modal").close()}
          variant="neutral"
          className="flex items-center gap-2"
        >
          <MdClose />
        </CustomBtn>
      </div>
    </div>
  );
};

export default EditProduct;