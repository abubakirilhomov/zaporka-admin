import React, { useState } from "react";
import { toast } from "react-toastify";
import { MdEdit, MdDelete, MdSave, MdClose, MdOutlinePlaylistAdd } from "react-icons/md";
import CustomBtn from "../../../Components/CustomBtn/CustomBtn";
import EditProductImages from "../EditProductImages/EditProductImages";
import axios from "axios";

const EditProduct = ({ product, apiUrl, token, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState({ ...product });

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) setEditedProduct({ ...product });
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
      "swiperImages",
    ].includes(name);

    setEditedProduct((prev) => ({
      ...prev,
      [name]: isArrayField
        ? value.split(",").map((item) => item.trim()).filter(Boolean)
        : value,
    }));
  };

  const handleSave = async () => {
    if (!editedProduct || !editedProduct._id) return;
    try {
      const updateUrl = `${apiUrl}/${editedProduct._id}`;
      await axios.put(updateUrl, editedProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSave();
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
      "swiperImages", // Exclude images from text fields, handled separately
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
                  {key.replace(/([A-Z])/g, " $1").trim()}:
                </label>
                {typeof value === "boolean" ? (
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
          <EditProductImages
            initialImages={editedProduct.swiperImages || []}
            productId={editedProduct._id}
            token={token}
            onSave={() => {
              setIsEditing(false);
              onSave();
            }}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(product).map(([key, value]) => {
            if (!shouldDisplayField(key)) return null;
            return (
              <div
                key={key}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center border-b pb-4 last:border-b-0"
              >
                <span className="font-semibold capitalize text-base-content text-sm">
                  {key.replace(/([A-Z])/g, " $1").trim()}:
                </span>
                <span className="text-base-content text-sm">
                  {normalizeFieldValue(value)}
                </span>
              </div>
            );
          })}
          <EditProductImages
            initialImages={product.swiperImages || []}
            productId={product._id}
            token={token}
            onSave={onSave}
            readOnly={true}
          />
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