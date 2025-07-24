import React from "react";

const EditableField = ({ label, value, onChange, isEditing, type = "text" }) => {
  return (
    <div className="mb-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {isEditing ? (
        <input
          type={type}
          value={value}
          onChange={onChange}
          className="w-full mt-1 p-2 border rounded text-sm"
        />
      ) : (
        <p className="mt-1 text-gray-800">{value || "-"}</p>
      )}
    </div>
  );
};

export default EditableField;
