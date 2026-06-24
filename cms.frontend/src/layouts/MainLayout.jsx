// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const MainLayout = () => {
    // Đọc thông tin user từ localStorage, dùng state cục bộ thay vì Context nếu muốn đơn giản
    const [loggedInUser, setLoggedInUser] = useState(() => {
        const savedUser = localStorage.getItem('khanhcms_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    return (
        <div className="App bg-light min-vh-100 d-flex flex-column">
            <Header loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
            
            {/* Vùng chứa nội dung các trang (Pages) được cấu hình trong Router */}
            <main className="flex-grow-1">
                <Outlet context={{ setLoggedInUser }} />
            </main>

            <Footer />
        </div>
    );
};

export default MainLayout;
