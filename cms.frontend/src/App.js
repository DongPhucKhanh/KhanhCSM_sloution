import React from 'react';
import CategoryProductList from './components/CategoryProductList';
import './App.css'; // File chứa các style tùy biến riêng của dự án

function App() {
    return (
        <div className="container mt-5">
            {/* Phần Header của Website */}
            <header className="pb-3 mb-4 border-bottom">
                <span className="fs-4 font-weight-bold text-dark text-uppercase">
                    🛒 HỆ THỐNG CỬA HÀNG TRỰC TUYẾN - THAICMS RETAIL
                </span>
            </header>

            <div className="row">
                {/* Cột bên trái (Chức năng Sidebar): Hiển thị bộ lọc danh mục sản phẩm */}
                <div className="col-md-3">
                    <CategoryProductList />
                </div>

                {/* Cột bên phải (Chức năng Content): Dùng để hiển thị danh sách sản phẩm ở các bài học tiếp theo */}
                <div className="col-md-9">
                    <div className="jumbotron bg-light border p-5 rounded-lg">
                        <h1 className="display-4 font-weight-bold text-primary">Chào mừng quay trở lại!</h1>
                        <p className="lead text-muted">Khu vực hiển thị danh sách sản phẩm thời trang sẽ được kết nối ở Buổi 8.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;