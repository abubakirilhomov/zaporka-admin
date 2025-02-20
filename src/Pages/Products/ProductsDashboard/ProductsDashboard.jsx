import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductsDashboard = () => {
  const navigate = useNavigate();
  const [products] = useState([
    {
      id: 1,
      name: "Smartphone X",
      price: 699.99,
      category: "Electronics",
      stock: 50,
    },
    {
      id: 2,
      name: "Laptop Pro 15",
      price: 1299.99,
      category: "Electronics",
      stock: 30,
    },
    {
      id: 3,
      name: "Wireless Headphones",
      price: 199.99,
      category: "Accessories",
      stock: 100,
    },
    {
      id: 4,
      name: "Smartwatch Z",
      price: 299.99,
      category: "Wearables",
      stock: 75,
    },
    {
      id: 5,
      name: "Gaming Console Y",
      price: 499.99,
      category: "Gaming",
      stock: 20,
    },
    {
      id: 6,
      name: "Tablet A10",
      price: 399.99,
      category: "Electronics",
      stock: 40,
    },
    {
      id: 7,
      name: "Bluetooth Speaker B12",
      price: 89.99,
      category: "Accessories",
      stock: 120,
    },
    {
      id: 8,
      name: "4K Smart TV",
      price: 899.99,
      category: "Electronics",
      stock: 15,
    },
    {
      id: 9,
      name: "Gaming Mouse X5",
      price: 59.99,
      category: "Accessories",
      stock: 200,
    },
    {
      id: 10,
      name: "Mechanical Keyboard K7",
      price: 129.99,
      category: "Accessories",
      stock: 150,
    }
  ]);

  return (
    <div className="p-5 text-center">
      <h1 className="text-2xl font-bold mb-4">Список товаров</h1>
      <table className="border-collapse border w-full mb-4">
        <thead>
          <tr className="bg-base-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Название</th>
            <th className="border p-2">Цена</th>
            <th className="border p-2">Категория</th>
            <th className="border p-2">В наличии</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="border p-2">{product.id}</td>
              <td className="border p-2">{product.name}</td>
              <td className="border p-2">${product.price}</td>
              <td className="border p-2">{product.category}</td>
              <td className="border p-2">{product.stock ? "✅" : "❌"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center gap-4">
        <button className="btn bg-blue-300 hover:bg-blue-600 text-white text-lg px-6 py-3 rounded-lg" onClick={() => navigate("/products-1")}>Страница 1</button>
        <button className="btn bg-green-300 hover:bg-green-600 text-white text-lg px-6 py-3 rounded-lg" onClick={() => navigate("/products-2")}>Страница 2</button>
        <button className="btn bg-yellow-300 hover:bg-yellow-600 text-white text-lg px-6 py-3 rounded-lg" onClick={() => navigate("/products-3")}>Страница 3</button>
        <button className="btn bg-red-300 hover:bg-red-600 text-white text-lg px-6 py-3 rounded-lg" onClick={() => navigate("/products-4")}>Страница 4</button>
      </div>
    </div>
  );
};

export default ProductsDashboard;
