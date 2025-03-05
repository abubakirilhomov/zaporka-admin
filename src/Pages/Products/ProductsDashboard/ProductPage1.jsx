const ProductPage1 = () => {
    return (
      <div className="p-5 text-center">
        <h2 className="text-xl font-bold mb-4">Товары - Страница 1</h2>
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
            <tr>
              <td className="border p-2">1</td>
              <td className="border p-2">Smartphone X</td>
              <td className="border p-2">$699.99</td>
              <td className="border p-2">Electronics</td>
              <td className="border p-2">✅</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };
  
  export default ProductPage1;
  