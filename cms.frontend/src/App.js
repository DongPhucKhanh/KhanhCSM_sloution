// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: UI Giao diện trang bán hàng hoàn chỉnh tích hợp CMS & E-Commerce - Hệ thống Phụ tùng & Đồ chơi Ô tô (Buổi 8)
import React from 'react';
import CategoryProductList from './components/CategoryProductList';
import ProductList from './components/ProductList';
import PostList from './components/PostList';
import BlogCategoryList from './components/BlogCategoryList';
import './App.css';

function App() {
    return (
        <div className="ecommerce-store">
            {/* 1. THANH ĐIỀU HƯỚNG NAVBAR HIỆN ĐẠI */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm py-3">
                <div className="container">
                    <a className="navbar-brand font-weight-bold d-flex align-items-center" href="/">
                        <i className="fa-solid fa-car-wrench text-warning mr-2 fa-lg"></i>
                        <span style={{ letterSpacing: '1px' }}>Cửa Hàng Phụ Tùng & Đồ Chơi Ô Tô</span>
                    </a>
                    <button className="navbar-expand" type="button" data-toggle="collapse" data-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Thanh tìm kiếm giữa ứng dụng */}
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <form className="form-inline my-2 my-lg-0 mx-auto w-50 d-none d-md-flex">
                            <div className="input-group w-100 shadow-sm rounded-pill overflow-hidden bg-white">
                                <input className="form-control border-0 pl-4" type="search" placeholder="Tìm phụ tùng, dầu nhớt, đồ chơi ô tô cao cấp..." />
                                <div className="input-group-append">
                                    <button className="btn btn-warning px-4" type="submit">
                                        <i className="fa-solid fa-magnifying-glass text-dark"></i>
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* Cụm chức năng Giỏ hàng & Thành viên góc phải */}
                        <ul className="navbar-nav ml-auto align-items-center flex-row">
                            <li className="nav-item active mr-4 position-relative cursor-pointer">
                                <a className="nav-link p-0" href="/cart">
                                    <i className="fa-solid fa-cart-shopping fa-xl text-white text-hover-warning"></i>
                                    <span className="badge badge-warning badge-pill position-absolute" style={{ top: '-10px', right: '-12px', fontSize: '0.75rem' }}>3</span>
                                </a>
                            </li>
                            <li className="nav-item border-left pl-3 ml-2">
                                <div className="d-flex align-items-center text-white cursor-pointer">
                                    <i className="fa-solid fa-circle-user fa-xl mr-2 text-warning"></i>
                                    <span className="small font-weight-bold d-none d-sm-inline">Đồng Phúc Khánh</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* 2. BANNER QUẢNG CÁO (HERO SECTION) */}
            <div className="jumbotron jumbotron-fluid hero-banner text-white mb-5 shadow-sm position-relative">
                <div className="container position-relative z-index-2">
                    <div className="row align-items-center">
                        <div className="col-md-7 py-4">
                            <span className="badge badge-warning px-3 py-2 text-uppercase font-weight-bold mb-3">PHỤ TÙNG & ĐỒ CHƠI CHÍNH HÃNG</span>
                            <h1 className="display-4 font-weight-bold mb-3 text-shadow">Nâng Tầm Đẳng Cấp Xế Cưng</h1>
                            <p className="lead text-light mb-4">Chuyên cung cấp linh kiện cơ khí, đồ chơi công nghệ, dầu nhớt hiệu năng cao và phụ kiện chăm sóc ô tô toàn diện từ các thương hiệu hàng đầu thế giới.</p>
                            <a className="btn btn-warning btn-lg font-weight-bold px-4 py-3 shadow border-0 text-dark text-uppercase rounded-pill" href="#products-section">
                                <i className="fa-solid fa-screwdriver-wrench mr-2"></i>Khám phá kho vật tư
                            </a>
                        </div>
                    </div>
                </div>
                <div className="hero-overlay"></div>
            </div>

            {/* 3. KHU VỰC NỘI DUNG CHÍNH (MAIN CONTENT GROUP) */}
            <div className="container" id="products-section">
                <div className="row">
                    {/* CỘT SIDEBAR TRÁI (col-md-3): Các bộ lọc phân loại dữ liệu */}
                    <div className="col-lg-3 col-md-4 mb-4">
                        <div className="sticky-sidebar">
                            {/* Phân loại phục vụ Thương mại điện tử */}
                            <CategoryProductList />

                            {/* Phân loại phục vụ Quản trị nội dung bài viết */}
                            <BlogCategoryList />
                        </div>
                    </div>

                    {/* CỘT NỘI DUNG PHẢI (col-md-9): Hiển thị dữ liệu Sản phẩm & Bài viết */}
                    <div className="col-lg-9 col-md-8">
                        {/* PHÂN HỆ 1: PHỤ TÙNG & LINH KIỆN Ô TÔ */}
                        <div className="products-wrapper mb-5">
                            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                                <h4 className="text-uppercase text-dark font-weight-bold m-0" style={{ letterSpacing: '0.5px', fontSize: '1.1rem' }}>
                                    <i className="fa-solid fa-gears text-success mr-2"></i>Linh kiện & Đồ chơi mới nhất
                                </h4>
                                <span className="text-muted small font-italic">Đang hiển thị dữ liệu Real-time</span>
                            </div>
                            {/* Gọi lưới sản phẩm */}
                            <ProductList />
                        </div>

                        {/* PHÂN HỆ 2: BÀI VIẾT TIN TỨC / BLOG TƯ VẤN KỸ THUẬT */}
                        <div className="blog-wrapper">
                            {/* Gọi dòng thời gian tin tức bảo dưỡng */}
                            <PostList />
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. CHÂN TRANG CHUYÊN NGHIỆP (FOOTER SECTION) */}
            <footer className="bg-dark text-light mt-5 pt-5 pb-3 border-top border-warning">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4 mb-4">
                            <h5 className="text-warning font-weight-bold text-uppercase mb-3">⚙️ KHANHCMS AUTOPARTS</h5>
                            <p className="small text-muted" style={{ lineHeight: '1.8' }}>
                                Hệ thống phân phối linh kiện vật tư, dầu nhớt bôi trơn và đồ chơi công nghệ ô tô độc quyền hàng đầu Việt Nam. Tích hợp giải pháp công nghệ song hành ASP.NET Core API & ReactJS Portal.
                            </p>
                        </div>
                        <div className="col-md-4 mb-4">
                            <h5 className="text-warning font-weight-bold text-uppercase mb-3">📞 LIÊN HỆ THỰC HÀNH</h5>
                            <p className="small text-muted mb-1"><i className="fa-solid fa-user mr-2 text-warning"></i>Sinh viên: Đồng Phúc Khánh</p>
                            <p className="small text-muted mb-1"><i className="fa-solid fa-id-card mr-2 text-warning"></i>MSSV: 2123110051</p>
                            <p className="small text-muted"><i className="fa-solid fa-school mr-2 text-warning"></i>Chuyên đề: ASP.NET Core & ReactJS</p>
                        </div>
                        <div className="col-md-4 mb-4">
                            <h5 className="text-warning font-weight-bold text-uppercase mb-3">📬 ĐĂNG KÝ NHẬN TIN KỸ THUẬT</h5>
                            <div className="input-group input-group-sm mt-2 shadow-sm rounded overflow-hidden">
                                <input type="text" className="form-control border-0" placeholder="Nhập email của bạn..." />
                                <div className="input-group-append">
                                    <button className="btn btn-warning text-dark font-weight-bold" type="button">Gửi</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="border-top border-secondary pt-3 mt-4 text-center text-muted small">
                        <p>© 2026 KHANHCMS AutoParts Project. Đồ án thực hành chuyên sâu phân tầng Cao đẳng Công nghệ TP.HCM.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;