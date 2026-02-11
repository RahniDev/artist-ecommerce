import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./user/Signup";
import Signin from "./user/Signin";
import PrivateRoute from "./auth/PrivateRoute";
import Dashboard from "./user/UserDashboard";
import AdminRoute from "./auth/AdminRoute";
import AdminDashboard from "./user/AdminDashboard";
import AddCategory from "./admin/AddCategory";
import AddProduct from "./admin/AddProduct";
import Product from "./core/Product";
import Cart from "./core/Cart";
import Orders from './admin/Orders';
import Profile from "./user/Profile";
import ManageProducts from './admin/ManageProducts';
import UpdateProduct from './admin/UpdateProduct'
import Home from "./core/Home";
import ForgotPassword from "./user/ForgotPassword";
import Contact from "./core/Contact";
import { useDispatch } from "react-redux";
import { loadAuthFromStorage } from "./redux/slices/authSlice";
import About from "./core/About";

const AppRoutes: React.FC = () => {
    const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadAuthFromStorage());
  }, [dispatch]);
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        {/* Private Routes */}
        <Route 
          path="/user/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/profile/:userId" 
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } 
        />

        {/* Admin Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />
        <Route 
          path="/create/category" 
          element={
            <AdminRoute>
              <AddCategory />
            </AdminRoute>
          } 
        />
        <Route 
          path="/create/product" 
          element={
            <AdminRoute>
              <AddProduct />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/orders" 
          element={
            <AdminRoute>
              <Orders />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/products" 
          element={
            <AdminRoute>
              <ManageProducts />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/product/update/:productId" 
          element={
            <AdminRoute>
              <UpdateProduct />
            </AdminRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;