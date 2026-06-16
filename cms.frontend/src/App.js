// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: Giao diện chuẩn Classic E-Commerce Ô tô (Tích hợp Layout Switching và Full Sticky Header)
import React, { useState } from 'react';
import CategoryProductList from './components/CategoryProductList';
import ProductList from './components/ProductList';
import PostList from './components/PostList';
import BlogCategoryList from './components/BlogCategoryList';
import PostDetail from './components/PostDetail';
import ProductDetail from './components/ProductDetail';
import './App.css';

function App() {
    const [currentView, setCurrentView] = useState('home');
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [selectedBlogCategoryId, setSelectedBlogCategoryId] = useState(null);
    const [viewingPostId, setViewingPostId] = useState(null);
    const [viewingProductId, setViewingProductId] = useState(null);

    const goToHome = () => {
        setCurrentView('home');
        setViewingProductId(null);
        setViewingPostId(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const goToProducts = () => {
        setCurrentView('products');
        setViewingProductId(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const goToBlog = () => {
        setCurrentView('blog');
        setViewingPostId(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleOpenProductDetail = (id) => {
        setViewingProductId(id);
        setCurrentView('products');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleOpenPostDetail = (id) => {
        setViewingPostId(id);
        setCurrentView('blog');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="ecommerce-store bg-light" style={{ minHeight: '100vh' }}>

            {/* 🔥 BỔ SUNG: KHU VỰC GOM NHÓM HEADER STICKY (Giữ cố định toàn bộ 3 thanh khi cuộn) */}
            <div className="sticky-top shadow-sm" style={{ zIndex: 1050 }}>

                {/* ================= 1. TOP BAR ================= */}
                <div className="bg-dark text-white py-1 d-none d-md-block">
                    <div className="container-fluid px-xl-5 d-flex justify-content-between align-items-center" style={{ fontSize: '0.85rem' }}>
                        <div>
                            <i className="fa-solid fa-phone mr-2 text-danger"></i> Hotline: <strong className="text-danger">0376.136.271</strong>
                            <span className="mx-3">|</span>
                            <i className="fa-solid fa-envelope mr-2"></i> Email: hotro@khanhcms.com
                        </div>
                        <div>
                            <span className="cursor-pointer hover-text-danger">Đăng nhập</span>
                            <span className="mx-2">/</span>
                            <span className="cursor-pointer hover-text-danger">Đăng ký</span>
                            <span className="mx-2">|</span>
                            <span className="cursor-pointer text-danger font-weight-bold"><i className="fa-solid fa-cart-shopping mr-1"></i> Giỏ hàng (3)</span>
                        </div>
                    </div>
                </div>

                {/* ================= 2. HEADER ================= */}
                <header className="bg-white py-3 d-none d-lg-block">
                    <div className="container-fluid px-xl-5 d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center cursor-pointer" onClick={goToHome}>
                            <h1 className="text-danger font-weight-bold m-0" style={{ fontSize: '2.5rem', textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>KHANHCMS</h1>
                            <i className="fa-solid fa-tire text-dark fa-spin-slow ml-2" style={{ fontSize: '2rem' }}></i>
                        </div>

                        <div className="w-50 mx-4">
                            <div className="input-group input-group-lg border border-danger rounded overflow-hidden">
                                <input type="text" className="form-control border-0" placeholder="Tìm kiếm tên phụ tùng, thương hiệu..." />
                                <div className="input-group-append">
                                    <button className="btn btn-danger px-4" type="button"><i className="fa-solid fa-magnifying-glass"></i></button>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex align-items-center cursor-pointer p-2 border rounded bg-light hover-shadow">
                            <i className="fa-solid fa-cart-shopping fa-2xl text-danger mr-3"></i>
                            <div>
                                <span className="d-block small text-muted font-weight-bold">Giỏ hàng của bạn</span>
                                <span className="font-weight-bold text-dark">0 VNĐ</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* ================= 3. NAVBAR ĐỎ ================= */}
                
                <nav className="navbar navbar-expand-lg navbar-dark custom-red-navbar py-0">
                    <div className="container-fluid px-xl-5">
                        <button className="navbar-toggler my-2 border-0" type="button" data-toggle="collapse" data-target="#mainNav">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="mainNav">
                            <ul className="navbar-nav mr-auto font-weight-bold text-uppercase" style={{ fontSize: '0.95rem' }}>
                                <li className="nav-item border-right border-danger-light">
                                    <span className={`nav-link text-white px-4 py-3 cursor-pointer ${currentView === 'home' ? 'active-nav' : 'hover-nav'}`} onClick={goToHome}>Trang Chủ</span>
                                </li>
                                <li className="nav-item border-right border-danger-light">
                                    <span className={`nav-link text-white px-4 py-3 cursor-pointer ${currentView === 'products' ? 'active-nav' : 'hover-nav'}`} onClick={goToProducts}>Sản Phẩm</span>
                                </li>
                                <li className="nav-item border-right border-danger-light">
                                    <span className={`nav-link text-white px-4 py-3 cursor-pointer ${currentView === 'blog' ? 'active-nav' : 'hover-nav'}`} onClick={goToBlog}>Tin Tức / Bài Viết</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
            {/* Kết thúc khu vực Header Sticky */}

            {/* ================= 4. KHU VỰC THAY ĐỔI LAYOUT ĐỘNG ================= */}

            {/* LƯỚNG 1: TRANG CHỦ FULL-WIDTH (KHÔNG CÓ SIDEBAR) */}
            {currentView === 'home' && (
                <div className="container-fluid px-xl-5 mt-4">
                    {/* Main Banner */}
                    <div className="jumbotron jumbotron-fluid text-white mb-5 shadow rounded position-relative overflow-hidden" style={{ background: 'url(https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1200&auto=format&fit=crop) center center/cover', padding: '100px 0' }}>
                        <div className="container-fluid position-relative z-index-2 py-4 px-5 text-center">
                            <span className="badge badge-danger px-3 py-2 text-uppercase font-weight-bold mb-3" style={{ fontSize: '1rem' }}>KHUYẾN MÃI LỚN TRONG THÁNG</span>
                            <h1 className="display-4 font-weight-bold mb-4 text-shadow">PHỤ TÙNG CHÍNH HÃNG GIÁ TỐT NHẤT</h1>
                            <button className="btn btn-danger btn-lg font-weight-bold px-5 mr-3 text-uppercase rounded-pill shadow" onClick={goToProducts}>Mua ngay</button>
                            <button className="btn btn-outline-light btn-lg font-weight-bold px-5 text-uppercase rounded-pill shadow">Xem khuyến mãi</button>
                        </div>
                        <div className="hero-overlay" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}></div>
                    </div>

                    {/* KHỐI 1: SẢN PHẨM NỔI BẬT */}
                    <div className="mb-5">
                        <h3 className="text-center font-weight-bold text-uppercase mb-2">
                            <span className="border-bottom border-danger pb-2 d-inline-block">SẢN PHẨM NỔI BẬT</span>
                        </h3>
                        <p className="text-center text-muted mb-4 small">Linh kiện phụ tùng được đánh giá cao nhất trong tháng.</p>
                        <ProductList selectedCategoryId={null} onSelectProduct={handleOpenProductDetail} limit={6} />
                    </div>

                    {/* Banner Khuyến Mãi Ngang */}
                    <div className="mb-5 text-center rounded overflow-hidden shadow-sm border" style={{ background: 'linear-gradient(90deg, #b30000 0%, #1a202c 100%)', color: 'white', padding: '40px 20px' }}>
                        <h2 className="font-weight-bold text-uppercase m-0"><i className="fa-solid fa-gift mr-3"></i> Giảm giá 20% cho Đơn hàng Gầm Máy - Freeship Toàn Quốc</h2>
                    </div>

                    {/* KHỐI 2: SẢN PHẨM MỚI NHẤT */}
                    <div className="mb-5">
                        <h3 className="text-center font-weight-bold text-uppercase mb-2">
                            <span className="border-bottom border-danger pb-2 d-inline-block">Sản phẩm mới</span>
                        </h3>
                        <p className="text-center text-muted mb-4 small">Các sản phẩm vừa được thêm vào hệ thống.</p>
                        <ProductList selectedCategoryId={null} onSelectProduct={handleOpenProductDetail} limit={3} />
                    </div>

                    {/* KHỐI 3: SẢN PHẨM BÁN CHẠY */}
                    <div className="mb-5">
                        <h3 className="text-center font-weight-bold text-uppercase mb-2">
                            <span className="border-bottom border-danger pb-2 d-inline-block">Sản phẩm bán chạy</span>
                        </h3>
                        <p className="text-center text-muted mb-4 small">Top sản phẩm được mua nhiều nhất.</p>
                        <ProductList selectedCategoryId={null} onSelectProduct={handleOpenProductDetail} limit={3} />
                    </div>

                    {/* KHỐI 4: TIN TỨC / BÀI VIẾT */}
                    <div className="mb-5">
                        <h3 className="text-center font-weight-bold text-uppercase mb-4">
                            <span className="border-bottom border-danger pb-2 d-inline-block">TIN TỨC CẬP NHẬT</span>
                        </h3>
                        <PostList selectedBlogCategoryId={null} onSelectPost={handleOpenPostDetail} limit={3} />
                    </div>
                </div>
            )}


            {/* LUỒNG 2 & 3: TRANG SẢN PHẨM HOẶC TRANG TIN TỨC (CÓ SIDEBAR BÊN TRÁI) */}
            {(currentView === 'products' || currentView === 'blog') && (
                <div className="container-fluid px-xl-5 mt-4">
                    <div className="row">
                        {/* SIDEBAR DÙNG CHUNG */}
                        <div className="col-xl-3 col-lg-4 mb-4">
                            <div className="sticky-sidebar">
                                {currentView === 'products' ? (
                                    <div className="classic-sidebar bg-white mb-4 shadow-sm border border-top-0">
                                        <div className="sidebar-header text-white p-3 font-weight-bold text-uppercase d-flex align-items-center" style={{ backgroundColor: '#1a202c' }}>
                                            <i className="fa-solid fa-bars mr-3 fa-lg"></i> DANH MỤC SẢN PHẨM
                                        </div>
                                        <div className="sidebar-content">
                                            <CategoryProductList
                                                selectedCategoryId={selectedCategoryId}
                                                onSelectCategory={(id) => {
                                                    setSelectedCategoryId(id);
                                                    setViewingProductId(null);
                                                }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="classic-sidebar bg-white mb-4 shadow-sm border border-top-0">
                                        <div className="sidebar-header text-white p-3 font-weight-bold text-uppercase d-flex align-items-center" style={{ backgroundColor: '#1a202c' }}>
                                            <i className="fa-solid fa-newspaper mr-3 fa-lg"></i> CHỦ ĐỀ BÀI VIẾT
                                        </div>
                                        <div className="sidebar-content">
                                            <BlogCategoryList
                                                selectedBlogCategoryId={selectedBlogCategoryId}
                                                onSelectBlogCategory={(id) => {
                                                    setSelectedBlogCategoryId(id);
                                                    setViewingPostId(null);
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* KHU VỰC NỘI DUNG CHÍNH */}
                        <div className="col-xl-9 col-lg-8">
                            {currentView === 'products' && (
                                <div className="products-wrapper bg-white p-4 shadow-sm border mb-4">
                                    {viewingProductId ? (
                                        <ProductDetail productId={viewingProductId} onBack={() => setViewingProductId(null)} onSelectProduct={setViewingProductId} />
                                    ) : (
                                        <>
                                            <h4 className="text-danger font-weight-bold border-bottom border-danger pb-2 mb-4 text-uppercase">KHO PHỤ TÙNG CHÍNH HÃNG</h4>
                                            <ProductList selectedCategoryId={selectedCategoryId} onSelectProduct={setViewingProductId} />
                                        </>
                                    )}
                                </div>
                            )}

                            {currentView === 'blog' && (
                                <div className="blog-wrapper bg-white p-4 shadow-sm border mb-4">
                                    {viewingPostId ? (
                                        <PostDetail postId={viewingPostId} onBack={() => setViewingPostId(null)} />
                                    ) : (
                                        <>
                                            <h4 className="text-danger font-weight-bold border-bottom border-danger pb-2 mb-4 text-uppercase">TIN TỨC KỸ THUẬT XE</h4>
                                            <PostList selectedBlogCategoryId={selectedBlogCategoryId} onSelectPost={setViewingPostId} />
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ================= 5. FOOTER ================= */}
            <footer className="bg-dark text-light mt-5 pt-5 pb-3 border-top border-danger">
                <div className="container-fluid px-xl-5">
                    <div className="row">
                        <div className="col-md-4 mb-4">
                            <h5 className="text-danger font-weight-bold text-uppercase mb-3" style={{ fontSize: '1.1rem', letterSpacing: '1px' }}>
                                <i className="fa-solid fa-car-wrench mr-2"></i> KHANHCMS AUTOPARTS
                            </h5>
                            <p className="small text-white-50" style={{ lineHeight: '1.8' }}>
                                Chuỗi hệ thống cung ứng linh kiện phụ tùng thay thế nhanh và đồ chơi công nghệ ô tô thông minh đạt chuẩn ISO. Vận hành giải pháp kiến trúc lai ASP.NET Core Web API phối hợp ReactJS Portal Client-side.
                            </p>
                        </div>
                        <div className="col-md-4 mb-4 border-left-md pl-md-4 border-secondary">
                            <h5 className="text-danger font-weight-bold text-uppercase mb-3" style={{ fontSize: '1.1rem', letterSpacing: '1px' }}>
                                <i className="fa-solid fa-address-card mr-2"></i> THÔNG TIN THỰC HÀNH
                            </h5>
                            <p className="small text-white-50 mb-2"><i className="fa-solid fa-user mr-2 text-danger"></i>Sinh viên: <strong className="text-white">Đồng Phúc Khánh</strong></p>
                            <p className="small text-white-50 mb-2"><i className="fa-solid fa-id-badge mr-2 text-danger"></i>Mã số sinh viên: <strong className="text-white">2123110051</strong></p>
                            <p className="small text-white-50"><i className="fa-solid fa-graduation-cap mr-2 text-danger"></i>Chuyên đề: ASP.NET Core & ReactJS</p>
                        </div>
                        <div className="col-md-4 mb-4">
                            <h5 className="text-danger font-weight-bold text-uppercase mb-3" style={{ fontSize: '1.1rem', letterSpacing: '1px' }}>
                                <i className="fa-solid fa-envelope-open-text mr-2"></i> ĐĂNG KÝ NHẬN TIN
                            </h5>
                            <p className="small text-white-50 mb-2">Nhận thông báo khuyến mãi và lịch bảo dưỡng xe định kỳ mới nhất.</p>
                            <div className="input-group input-group-sm mt-3 shadow-sm rounded overflow-hidden">
                                <input type="text" className="form-control border-0 pl-3 py-4" placeholder="Nhập địa chỉ email của bạn..." />
                                <div className="input-group-append">
                                    <button className="btn btn-danger font-weight-bold px-4" type="button">GỬI</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="border-top border-secondary pt-4 mt-2 text-center text-white-50 small">
                        <p className="mb-0 text-uppercase font-weight-bold text-light">© 2026 HỆ THỐNG PHỤ TÙNG KHANHCMS - ĐỒ ÁN THỰC HÀNH CHUYÊN SÂU</p>
                        <p className="mb-0 mt-1">Bản quyền thuộc về Cao đẳng Công nghệ Thành phố Hồ Chí Minh.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;