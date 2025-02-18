import React from "react";

const FormInput = ({ type = "text", label, value, onChange, placeholder, required = false, error, Icon, options }) => {
  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center text-lg gap-2">
          {Icon && <Icon className="text-primary" />}
          <label className="font-semibold">{label}</label>
        </div>
      )}
      {type === "select" ? (
        <select
          className="select select-bordered w-full bg-base-100"
          value={value}
          onChange={onChange}
          required={required}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          className="textarea textarea-bordered w-full bg-base-100"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
      ) : (
        <input
          type={type}
          className="input input-bordered w-full bg-base-100"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
      )}
      {error && <p className="text-error text-sm">{error}</p>}
    </div>
  );
};

export default FormInput;