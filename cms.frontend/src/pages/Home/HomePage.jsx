// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroBanner from '../../components/features/HeroBanner';
import ProductList from '../../components/features/ProductList';
import BestsellerProducts from '../../components/features/BestsellerProducts';
import NewestProducts from '../../components/features/NewestProducts';
import PostList from '../../components/features/PostList';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div>
            {/* HERO BANNER SLIDESHOW TỰ ĐỘNG */}
            <HeroBanner onNavigateToProduct={(id) => {
                if (id) navigate(`/product/${id}`);
                else navigate('/products');
            }} />

            <div className="container-fluid px-xl-5 mt-5">
                {/* 1. GIÁ TRỊ CỐT LÕI */}
                <div className="row mb-5 text-center">
                    <div className="col-md-3 col-sm-6 mb-4">
                        <div className="p-4 bg-white rounded h-100 d-flex flex-column justify-content-center align-items-center value-box">
                            <div className="rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: '70px', height: '70px', background: 'linear-gradient(135deg, #f8d7da 0%, #f1aeb5 100%)' }}>
                                <i className="fa-solid fa-shield-halved text-danger fa-2x"></i>
                            </div>
                            <h6 className="font-weight-bold text-uppercase mt-2 text-dark">100% Chính hãng</h6>
                            <small className="text-muted">Đền bù 200% nếu phát hiện hàng giả</small>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 mb-4">
                        <div className="p-4 bg-white rounded h-100 d-flex flex-column justify-content-center align-items-center value-box">
                            <div className="rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: '70px', height: '70px', background: 'linear-gradient(135deg, #d1e7dd 0%, #a3cfbb 100%)' }}>
                                <i className="fa-solid fa-truck-fast text-success fa-2x"></i>
                            </div>
                            <h6 className="font-weight-bold text-uppercase mt-2 text-dark">Giao hàng Hỏa tốc</h6>
                            <small className="text-muted">Miễn phí vận chuyển đơn từ 1.500k</small>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 mb-4">
                        <div className="p-4 bg-white rounded h-100 d-flex flex-column justify-content-center align-items-center value-box">
                            <div className="rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: '70px', height: '70px', background: 'linear-gradient(135deg, #cff4fc 0%, #9eeaf9 100%)' }}>
                                <i className="fa-solid fa-arrow-right-arrow-left text-info fa-2x"></i>
                            </div>
                            <h6 className="font-weight-bold text-uppercase mt-2 text-dark">Đổi trả 7 ngày</h6>
                            <small className="text-muted">Lỗi 1 đổi 1 nhanh chóng, thủ tục gọn</small>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 mb-4">
                        <div className="p-4 bg-white rounded h-100 d-flex flex-column justify-content-center align-items-center value-box">
                            <div className="rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: '70px', height: '70px', background: 'linear-gradient(135deg, #fff3cd 0%, #ffe69c 100%)' }}>
                                <i className="fa-solid fa-headset text-warning fa-2x"></i>
                            </div>
                            <h6 className="font-weight-bold text-uppercase mt-2 text-dark">Hỗ trợ kỹ thuật</h6>
                            <small className="text-muted">Tư vấn lắp đặt &amp; bảo dưỡng 24/7</small>
                        </div>
                    </div>
                </div>

                {/* SẢN PHẨM NỔI BẬT */}
                <div className="mb-5">
                    <div className="d-flex justify-content-between align-items-end mb-4 border-bottom pb-2">
                        <h3 className="font-weight-bold text-uppercase m-0 premium-section-title">SẢN PHẨM NỔI BẬT</h3>
                        <span className="view-all-btn cursor-pointer" onClick={() => navigate('/products')}>Xem tất cả <i className="fa-solid fa-arrow-right ml-1"></i></span>
                    </div>
                    <ProductList selectedCategoryId={null} onSelectProduct={(id) => navigate(`/product/${id}`)} limit={6} />
                </div>

                {/* BANNER KHUYẾN MÃI MỚI */}
                <div className="mb-5 rounded cursor-pointer promo-banner-cta d-flex align-items-center justify-content-between p-4 px-md-5"
                    onClick={() => navigate('/products')}>
                    <div>
                        <span className="badge badge-danger mb-2 px-3 py-1" style={{ fontSize: '0.9rem', letterSpacing: '2px' }}>FLASH SALE</span>
                        <h2 className="font-weight-bold text-uppercase m-0 text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                            Giảm giá 20% Phụ tùng Gầm Máy
                        </h2>
                        <p className="text-white-50 mt-2 mb-0" style={{ fontSize: '1.1rem' }}>Freeship Toàn Quốc cho đơn hàng từ 1.500.000đ</p>
                    </div>
                    <button className="btn btn-outline-light font-weight-bold text-uppercase rounded-pill px-4 py-2 d-none d-md-block shadow-sm" style={{ borderWidth: '2px' }}>
                        MUA NGAY <i className="fa-solid fa-cart-shopping ml-2"></i>
                    </button>
                </div>

                {/* BÁN CHẠY NHẤT */}
                <div className="p-4 rounded mb-5" style={{ backgroundColor: '#f8f9fa', border: '1px solid #eaeaea' }}>
                    <div className="d-flex justify-content-between align-items-end mb-4 border-bottom pb-2">
                        <h3 className="font-weight-bold text-uppercase m-0 premium-section-title">BÁN CHẠY NHẤT</h3>
                        <span className="view-all-btn cursor-pointer" onClick={() => navigate('/products')}>Xem tất cả <i className="fa-solid fa-arrow-right ml-1"></i></span>
                    </div>
                    <BestsellerProducts onSelectProduct={(id) => navigate(`/product/${id}`)} limit={4} />
                </div>

                {/* HÀNG MỚI VỀ */}
                <div className="mb-5">
                    <div className="d-flex justify-content-between align-items-end mb-4 border-bottom pb-2">
                        <h3 className="font-weight-bold text-uppercase m-0 premium-section-title">HÀNG MỚI VỀ</h3>
                        <span className="view-all-btn cursor-pointer" onClick={() => navigate('/products')}>Xem tất cả <i className="fa-solid fa-arrow-right ml-1"></i></span>
                    </div>
                    <NewestProducts onSelectProduct={(id) => navigate(`/product/${id}`)} limit={4} />
                </div>

                {/* THƯƠNG HIỆU */}
                <div className="mb-5 bg-white p-4 rounded border shadow-sm text-center">
                    <h5 className="font-weight-bold text-uppercase mb-4" style={{ color: '#6c757d', letterSpacing: '1px' }}>THƯƠNG HIỆU ĐỐI TÁC CHÍNH HÃNG</h5>
                    <div className="d-flex justify-content-around flex-wrap align-items-center">
                        <h3 className="m-3 font-weight-bold brand-badge" style={{ color: '#E3000F' }}><i className="fa-brands fa-bilibili mr-2"></i>BREMBO</h3>
                        <h3 className="m-3 font-weight-bold brand-badge text-dark"><i className="fa-solid fa-car-side mr-2"></i>MICHELIN</h3>
                        <h3 className="m-3 font-weight-bold brand-badge text-primary"><i className="fa-solid fa-plug mr-2"></i>BOSCH</h3>
                        <h3 className="m-3 font-weight-bold brand-badge" style={{ color: '#00853f' }}><i className="fa-solid fa-oil-can mr-2"></i>CASTROL</h3>
                        <h3 className="m-3 font-weight-bold brand-badge text-danger"><i className="fa-solid fa-bolt mr-2"></i>NGK</h3>
                    </div>
                </div>

                {/* TIN TỨC KỸ THUẬT */}
                <div className="mb-5 p-4 rounded" style={{ backgroundColor: '#fdfdfd', border: '1px solid #f1f1f1' }}>
                    <div className="d-flex justify-content-between align-items-end mb-4 border-bottom pb-2">
                        <h3 className="font-weight-bold text-uppercase m-0 premium-section-title">TIN TỨC KỸ THUẬT</h3>
                        <span className="view-all-btn cursor-pointer" onClick={() => navigate('/blog')}>Xem tất cả bài viết <i className="fa-solid fa-arrow-right ml-1"></i></span>
                    </div>
                    <PostList selectedBlogCategoryId={null} onSelectPost={(id) => navigate(`/blog/${id}`)} limit={3} />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
