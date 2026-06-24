// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';
import HomePage from './pages/Home/HomePage';
import ShopPage from './pages/Shop/ShopPage';
import ProductDetailPage from './pages/Shop/ProductDetailPage';
import SearchPage from './pages/Shop/SearchPage';
import BlogPage from './pages/Blog/BlogPage';
import PostDetailPage from './pages/Blog/PostDetailPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import CartPage from './pages/Cart/CartPage';
import CheckoutPage from './pages/Checkout/CheckoutPage';

import './assets/css/App.css';

function App() {
    return (
        <Routes>
            {/* Sử dụng MainLayout bọc tất cả các route */}
            <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                
                {/* SẢN PHẨM & TÌM KIẾM */}
                <Route path="search" element={<SearchPage />} />
                <Route path="products" element={<ShopPage />} />
                <Route path="products/category/:categoryId" element={<ShopPage />} />
                <Route path="product/:id" element={<ProductDetailPage />} />

                {/* TIN TỨC */}
                <Route path="blog" element={<BlogPage />} />
                <Route path="blog/category/:categoryId" element={<BlogPage />} />
                <Route path="blog/:id" element={<PostDetailPage />} />

                {/* XÁC THỰC */}
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />

                {/* MUA HÀNG */}
                <Route path="cart" element={<CartPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
            </Route>
        </Routes>
    );
}

export default App;