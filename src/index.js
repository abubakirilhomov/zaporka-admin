import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/store";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ContextProvider } from "./Contexts/ContextProvider";
import App from "./App";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Orders from "./Pages/Orders/Orders";
import Reviews from "./Pages/Reviews/Reviews";
import CreateProduct from "./Pages/Products/CreateProduct/CreateProduct";
import EditProduct from "./Pages/Products/EditProduct/EditProduct";
import ProductsDashboard from "./Pages/Products/ProductsDashboard/ProductsDashboard";
import AllUsers from "./Pages/Users/AllUsers/AllUsers";
import Customers from "./Pages/Users/Customers/Customers";
import Workers from "./Pages/Users/Workers/Workers";
import Login from "./Pages/Login/Login";
import ProtectedRoute from "./hooks/PrivateRoute";
import Settings from "../src/Components/Settings";


// Определение маршрутов
const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute><App /></ProtectedRoute>,
    children: [
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "orders",
        element: (
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        ),
      },
      {
        path: "reviews",
        element: (
          <ProtectedRoute>
            <Reviews />
          </ProtectedRoute>
        ),
      },
      {
        path: "create-products",
        element: (
          <ProtectedRoute>
            <CreateProduct />
          </ProtectedRoute>
        ),
      },
      {
        path: "edit-products",
        element: (
          <ProtectedRoute>
            <EditProduct />
          </ProtectedRoute>
        ),
      },
      {
        path: "products-dashboard",
        element: (
          <ProtectedRoute>
            <ProductsDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "all-users",
        element: (
          <ProtectedRoute>
            <AllUsers />
          </ProtectedRoute>
        ),
      },
      {
        path: "customers",
        element: (
          <ProtectedRoute>
            <Customers />
          </ProtectedRoute>
        ),
      },
      {
        path: "workers",
        element: (
          <ProtectedRoute>
            <Workers />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "*",
    element: <h1>Page not found</h1>,
  },
]);

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ContextProvider>
        <RouterProvider router={router} />
      </ContextProvider>
    </Provider>
  </React.StrictMode>
);
