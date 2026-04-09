import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserLayout from "./Components/Layout/UserLayout";
import Home from "./Pages/Home";
import { Toaster } from "sonner";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Profile from "./Pages/Profile";
import CollectionPage from "./Pages/CollectionPage";
import ProductDetails from "./Components/Products/ProductDetails";
import CheckOut from "./Components/Cart/CheckOut";
import OrderConfirmationPage from "./Pages/OrderConfirmationPage";
import OrderDeatailsPage from "./Pages/OrderDeatailsPage";
import MyOrdersPage from "./Pages/MyOrdersPage";
import AdminLayout from "./Components/Admin/AdminLayout";
import AdminHomePage from "./Pages/AdminHomePage";
import UserManagement from "./Components/Admin/UserManagement";
import ProductManagement from "./Components/Admin/ProductManagement";
import AdminCreateProduct from "./Components/Admin/AdminCreateProductPage"
import EditProductPage from "./Components/Admin/EditProductPage";
import OrderManagement from "./Components/Admin/OrderManagement";

import { Provider } from "react-redux";
import store from "./redux/store";
import ProtectedRoutes from "./Components/Common/ProtectedRoutes";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<UserLayout />}>
            {/* user layouts */}
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="profile" element={<Profile />} />
            <Route
              path="collections/:collection"
              element={<CollectionPage />}
            />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="checkout" element={<CheckOut />} />
            <Route
              path="order-confirmation"
              element={<OrderConfirmationPage />}
            />
            <Route path="order/:id" element={<OrderDeatailsPage />} />
            <Route path="my-orders" element={<MyOrdersPage />} />
          </Route>
          {/* Admin layout */}
          <Route
            path="/admin"
            element={
              <ProtectedRoutes role="admin">
                <AdminLayout />{" "}
              </ProtectedRoutes>
            }
          >
            <Route index element={<AdminHomePage />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="products/create" element={<AdminCreateProduct />} />
            <Route path="products/:id/edit" element={<EditProductPage />} />
            <Route path="orders" element={<OrderManagement />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
