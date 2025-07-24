import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { MdEdit, MdDelete, MdSave, MdClose, MdOutlinePlaylistAdd, MdImage } from "react-icons/md";
import CustomBtn from "../../../Components/CustomBtn/CustomBtn";
import axios from "axios";
import { motion } from "framer-motion";

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

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

const ProductField = ({ keyName, value, onChange, onOthersChange, allProducts, isEditing }) => {
  const isArrayField = [
    "price",
    "sizeInInch",
    "sizeInmm",
    "DN",
    "surfaceMaterial",
    "workEnv",
    "nominalPressure",
    "workingPressure",
    "minPressure",
    "maxPressure",
    "application",
    "advantages",
    "others",
  ].includes(keyName);

  const normalizeFieldValue = (val) => {
    if (val === undefined || val === null) return "Н/Д";
    if (Array.isArray(val)) {
      if (keyName === "others" && allProducts) {
        return val
          .map((item) => {
            // Handle both ID strings and objects with _id
            const id = typeof item === "string" ? item : item._id;
            const product = allProducts.find((p) => p._id === id);
            console.log(`Mapping others item: ${item}, ID used: ${id}, Product:`, product); // Debug log
            return product ? product.title : (typeof item === "object" ? item.title || id : id);
          })
          .join(", ") || "Нет данных";
      }
      return val.join(", ");
    }
    if (typeof val === "boolean") return val ? "Да" : "Нет";
    if (typeof val === "object") {
      if (val.name) return val.name;
      if (val._id && keyName === "category") return val.name || val._id;
      return JSON.stringify(val, null, 2).replace(/{|}/g, "");
    }
    return val.toString();
  };

  if (!isEditing) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center border-b pb-4 last:border-b-0">
        <span className="font-semibold capitalize text-base-content text-sm">
          {fieldLabels[keyName] || keyName.replace(/([A-Z])/g, " $1").trim()}:
        </span>
        <span className="text-base-content text-sm">{normalizeFieldValue(value)}</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
      <label className="font-semibold capitalize text-base-content text-sm">
        {fieldLabels[keyName] || keyName.replace(/([A-Z])/g, " $1").trim()}:
      </label>
      {keyName === "others" ? (
        <select
          name={keyName}
          multiple
          value={Array.isArray(value) ? value : []}
          onChange={onOthersChange}
          className="select select-bordered w-full max-h-40"
        >
          {allProducts.map((p) => (
            <option key={p._id} value={p._id.toString()}>
              {p.title}
            </option>
          ))}
        </select>
      ) : typeof value === "boolean" ? (
        <select
          name={keyName}
          value={value ? "true" : "false"}
          onChange={onChange}
          className="select select-bordered w-full"
        >
          <option value="true">Да</option>
          <option value="false">Нет</option>
        </select>
      ) : isArrayField ? (
        <input
          type="text"
          name={keyName}
          value={Array.isArray(value) ? value.join(", ") : ""}
          onChange={onChange}
          className="input input-bordered w-full"
          placeholder={`Введите через запятую, например: ${Array.isArray(value) ? value.join(", ") : ""}`}
        />
      ) : typeof value === "object" ? (
        <input
          type="text"
          name={keyName}
          value={value.name || value._id || JSON.stringify(value, null, 2)}
          onChange={onChange}
          className="input input-bordered w-full"
        />
      ) : (
        <input
          type="text"
          name={keyName}
          value={value ?? ""}
          onChange={onChange}
          className="input input-bordered w-full"
        />
      )}
    </div>
  );
};

const ImageGallery = ({ isEditing, imagePreviews, onImageChange, onRemoveImage, totalImages }) => {
  const previewVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
  };

  const imagesUrl = process.env.REACT_APP_API_URL;
  const getImageSrc = (image) => {
    return `${imagesUrl}/uploads/products/${image.replace(/^\/?(uploads\/products\/)?/, "")}`;
  };

  return (
    <div>
      <label className="flex items-center gap-2 mb-2">
        <MdImage className="text-lg text-base-content" />
        <span className="label-text text-base-content font-medium">
          Галерея изображений {isEditing ? `(макс. 5)` : ""}
        </span>
      </label>
      {isEditing && (
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={onImageChange}
          disabled={totalImages >= MAX_IMAGES}
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
          {imagePreviews.map((image, index) => (
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
              {isEditing && (
                <button
                  onClick={() => onRemoveImage(index)}
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
  );
};

const EditProduct = ({ product, apiUrl, token, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState({
    ...product,
    category: product.category?._id || product.category || "",
    others: product.others || [],
  });
  const [existingImages, setExistingImages] = useState(product.images || []);
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState(product.images || []);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    console.log("Product data:", product);
    console.log("Image previews:", imagePreviews);
    console.log("Initial others:", product.others); // Debug initial others
    const fetchProducts = async () => {
      try {
        const response = await axios.get(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllProducts(response.data.filter((p) => p._id !== product._id));
        console.log("All products:", response.data); // Debug allProducts
      } catch (err) {
        toast.error("Ошибка при загрузке продуктов: " + err.message);
      }
    };
    fetchProducts();
  }, [apiUrl, token, product._id]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditedProduct({
        ...product,
        category: product.category?._id || product.category || "",
        others: product.others || [],
      });
      setExistingImages(product.images || []);
      setImagePreviews(product.images || []);
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
    const selectedOptions = Array.from(e.target.selectedOptions)
      .map((option) => option.value)
      .filter((value) => typeof value === "string");
    console.log("Selected others IDs:", selectedOptions); // Debug log
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
    setNewImages((prev) => [...prev, ...limitedFiles]);
  };

  const handleSave = async () => {
    if (!editedProduct || !editedProduct._id) {
      toast.error("Ошибка: отсутствует ID продукта");
      return;
    }

    try {
      const formData = new FormData();
      console.log("Edited product before save:", editedProduct);
      console.log("Existing images:", existingImages);
      console.log("New images:", newImages);

      // Validate and clean others array
      const cleanedOthers = Array.isArray(editedProduct.others)
        ? editedProduct.others
            .map((item) => (typeof item === "string" ? item : item._id?.toString()))
            .filter((item) => item)
        : [];
      console.log("Cleaned others array:", cleanedOthers);

      // Append existing images
      existingImages.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });
      // Append new images
      newImages.forEach((file) => {
        formData.append(`images`, file);
      });
      // Append other fields
      Object.entries({ ...editedProduct, others: cleanedOthers }).forEach(([key, value]) => {
        if (key !== "images") {
          if (Array.isArray(value)) {
            value.forEach((item, index) => {
              formData.append(`${key}[${index}]`, item);
            });
          } else {
            formData.append(key, value);
          }
          console.log(`FormData ${key}:`, value);
        }
      });

      const updateUrl = `${apiUrl}/${editedProduct._id}`;
      console.log("Update URL:", updateUrl);
      const response = await axios.put(updateUrl, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Backend response:", response.data);

      setIsEditing(false);
      const updatedImages = response.data.images || existingImages;
      setExistingImages(updatedImages);
      setImagePreviews(updatedImages);
      setNewImages([]);
      setEditedProduct({
        ...response.data,
        category: response.data.category?._id || response.data.category || "",
        others: response.data.others || [],
      });
      onSave();
      toast.success("Продукт и изображения успешно обновлены");
    } catch (err) {
      console.error("Save error:", err.response?.data || err.message);
      toast.error(`Ошибка при обновлении продукта: ${err.response?.data?.message || err.message}`);
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
      "images",
    ];
    return !excludedFields.includes(key);
  };

  return (
    <div className="space-y-6">
      <h3 className="font-bold text-lg flex items-center gap-2 mb-6">
        <MdOutlinePlaylistAdd className="text-2xl" /> Детали продукта:{" "}
        {product.title || "Без названия"}
      </h3>
      <div className="space-y-6">
        {Object.entries(editedProduct).map(([key, value]) =>
          shouldDisplayField(key) ? (
            <ProductField
              key={key}
              keyName={key}
              value={value}
              onChange={handleInputChange}
              onOthersChange={handleOthersChange}
              allProducts={allProducts}
              isEditing={isEditing}
            />
          ) : null
        )}
        <ImageGallery
          isEditing={isEditing}
          imagePreviews={imagePreviews}
          onImageChange={handleNewImageChange}
          onRemoveImage={handleRemoveImage}
          totalImages={existingImages.length + newImages.length}
        />
      </div>
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