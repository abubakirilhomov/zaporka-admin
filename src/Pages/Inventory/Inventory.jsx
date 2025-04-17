import React, { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import { toast } from "react-toastify";
import { MdOutlineAddBox, MdClose } from "react-icons/md";
import { motion } from "framer-motion";
import Loading from "../../Components/Loading/Loading";
import CustomTable from "../../Components/CustomTable/CustomTable";
import CustomPagination from "../../Components/CustomPagination/CustomPagination";

const StockManager = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // Common headers with token
  const authHeaders = {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };

  // Fetch stock receipts
  const fetchReceiptsUrl = `${apiUrl}/api/v1/stock/history?page=${currentPage}&limit=${limit}`;
  const { data: receiptsData, loading, error, revalidate, postData } = useFetch(
    fetchReceiptsUrl,
    { headers: authHeaders },
    false
  );

  // Fetch products for dropdown
  const { data: productsData, loading: productsLoading, error: productsError } = useFetch(
    `${apiUrl}/api/v1/products`,
    { headers: authHeaders },
    true
  );

  const [selectedProductId, setSelectedProductId] = useState("");
  const [amount, setAmount] = useState("");
  const [addedBy, setAddedBy] = useState("");

  // Debug products and token
  useEffect(() => {
    console.log("Products Data:", productsData);
    console.log("Products Loading:", productsLoading);
    console.log("Products Error:", productsError);
    console.log("Token:", token);
  }, [productsData, productsLoading, productsError, token]);

  // Revalidate receipts when page changes
  useEffect(() => {
    if (token) {
      revalidate();
    }
  }, [currentPage, token]);

  // Show toast for products error
  useEffect(() => {
    if (productsError) {
      toast.error(`Failed to load products: ${productsError}`);
    }
  }, [productsError]);

  // Safely access receipts and products
  const receipts = Array.isArray(receiptsData?.data) ? receiptsData.data : [];
  const products = Array.isArray(productsData?.data) ? productsData.data : [];
  const totalReceipts = receiptsData?.total || receipts.length;

  // Handle loading and error states
  if (!token) {
    return <div className="text-error text-center">Please log in to view stock receipts.</div>;
  }
  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <div className="text-error text-center">Error: {error}</div>;
  }

  // Open modal for new receipt
  const openModal = () => {
    setSelectedProductId("");
    setAmount("");
    setAddedBy("");
    document.getElementById("stock_modal")?.showModal();
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedProductId) {
      toast.error("Please select a product");
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    try {
      await postData(
        `${apiUrl}/api/v1/stock/add`,
        {
          productId: selectedProductId,
          amount: Number(amount),
          addedBy: addedBy || "Unknown",
        },
        { headers: authHeaders }
      );
      toast.success("Receipt added successfully");
      revalidate();
      document.getElementById("stock_modal")?.close();
    } catch (err) {
      console.error("Error adding receipt:", err);
      toast.error(err.message || "Failed to add receipt");
    }
  };

  // Table columns for receipts
  const columns = [
    {
      key: "productTitle",
      label: "Product",
      render: (row) => row.product?.title || "N/A",
    },
    { key: "amount", label: "Quantity" },
    {
      key: "addedBy",
      label: "Added By",
      render: (row) => row.addedBy || "Unknown",
    },
    {
      key: "createdAt",
      label: "Date",
      render: (row) => (row.createdAt ? new Date(row.createdAt).toLocaleString() : "N/A"),
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-base-100 to-base-300 p-4 sm:p-6 lg:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="max-w-7xl mx-auto bg-base-100/50 backdrop-blur-xl rounded-3xl shadow-2xl p-6"
        variants={itemVariants}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-6 text-center">
          Stock Receipts
        </h2>

        {/* Add Receipt Button */}
        <motion.button
          className="btn btn-primary fixed top-4 right-4 sm:top-6 sm:right-6 z-10 flex items-center gap-2"
          onClick={openModal}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={productsLoading}
        >
          <MdOutlineAddBox className="text-xl" />
          New Receipt
        </motion.button>

        {/* Receipts Table */}
        <motion.div variants={itemVariants}>
          {receipts.length === 0 ? (
            <p className="text-base-content/70 text-center">No receipts found</p>
          ) : (
            <CustomTable data={receipts} columns={columns} actions={[]} />
          )}
        </motion.div>

        {/* Pagination */}
        {receipts.length > 0 && (
          <motion.div variants={itemVariants}>
            <CustomPagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalReceipts / limit)}
              onPageChange={setCurrentPage}
            />
          </motion.div>
        )}
      </motion.div>

      {/* Modal for Adding Receipt */}
      <dialog id="stock_modal" className="modal">
        <motion.div
          className="modal-box bg-base-100/90 backdrop-blur-md max-w-md"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => document.getElementById("stock_modal")?.close()}
          >
            <MdClose className="text-2xl text-base-content" />
          </button>
          <h3 className="font-bold text-lg text-primary mb-4">Add New Receipt</h3>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-base-content">
                Product
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="select select-bordered w-full bg-base-100/70"
                disabled={productsLoading}
              >
                <option value="">Select a product</option>
                {products.length === 0 && !productsLoading ? (
                  <option disabled>No products available</option>
                ) : (
                  products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.title || "Untitled"}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-base-content">
                Quantity
              </label>
              <input
                type="number"
                placeholder="Enter quantity"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input input-bordered w-full bg-base-100/70"
                min="1"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-base-content">
                Added By (optional)
              </label>
              <input
                type="text"
                placeholder="Enter name"
                value={addedBy}
                onChange={(e) => setAddedBy(e.target.value)}
                className="input input-bordered w-full bg-base-100/70"
              />
            </div>
            <motion.button
              className="btn btn-primary w-full flex items-center justify-center gap-2"
              onClick={handleSubmit}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={productsLoading || products.length === 0}
            >
              Add Receipt
            </motion.button>
          </div>
        </motion.div>
      </dialog>
    </motion.div>
  );
};

export default StockManager;