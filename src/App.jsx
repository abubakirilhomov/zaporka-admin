import { useState } from "react";
import ProductsDashboard from "./Pages/Products/ProductsDashboard/ProductsDashboard";

const App = () => {
  const [showProducts, setShowProducts] = useState(false);

  return (
    <div className="p-4">
      <button
        onClick={() => setShowProducts(!showProducts)}
        className="bg-blue-500 text-white p-2 rounded"
      >
        {showProducts ? "Скрыть продукты" : "Показать продукты"}
      </button>

      {showProducts && <ProductsDashboard />}
    </div>
  );
};

export default App;
