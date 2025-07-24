import React from "react";

const imagesUrl = "https://api.zaporka.uz";

const ImageGallery = ({ images = [] }) => {
  if (images.length === 0) return null;

  return (
    <div className="flex gap-2 flex-wrap mt-4">
      {images.map((img, index) => (
        <img
          key={index}
          src={`${imagesUrl}${img}`}
          alt={`Product image ${index}`}
          className="w-32 h-32 object-cover rounded shadow"
        />
      ))}
    </div>
  );
};

export default ImageGallery;
