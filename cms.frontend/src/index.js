import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// 🔥 BỔ SUNG 1: Import CartProvider từ thư mục contexts và BrowserRouter từ react-router-dom
import { CartProvider } from './contexts/CartContext';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        {/* 🔥 BỔ SUNG 2: Bọc BrowserRouter ngoài cùng để kích hoạt định tuyến URL cho toàn bộ hệ thống */}
        <BrowserRouter>
            <CartProvider>
                <App />
            </CartProvider>
        </BrowserRouter>
    </React.StrictMode>
);

reportWebVitals();