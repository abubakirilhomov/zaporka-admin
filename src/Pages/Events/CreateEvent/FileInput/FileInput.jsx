import React from "react";

const FileInput = ({ label, onChange, error, preview, Icon, multiple = false }) => {
  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center text-lg gap-2">
          {Icon && <Icon className="text-primary" />}
          <label className="font-semibold">{label}</label>
        </div>
      )}
      <input
        type="file"
        className="file-input file-input-bordered w-full bg-base-100"
        onChange={onChange}
        required
        multiple={multiple}
      />
      {error && <p className="text-error text-sm">{error}</p>}
      {preview && (
        <div className="mt-2">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default FileInput;