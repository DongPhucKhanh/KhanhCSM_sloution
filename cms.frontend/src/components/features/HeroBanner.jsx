// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: HeroBanner - Slideshow tự động lấy dữ liệu từ API sản phẩm mới nhất (Tiêu chí 26)
import React, { useState, useEffect, useCallback } from 'react';
import productService from '../../services/productService';

const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL || 'https://localhost:7004';

const HeroBanner = ({ onNavigateToProduct }) => {
    const [slides, setSlides] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                setLoading(true);
                // Gọi API lấy 5 sản phẩm mới nhất làm nội dung banner
                const data = await productService.getNewestProducts(5);
                setSlides(data || []);
            } catch (err) {
                console.error('Lỗi tải banner:', err);
                setSlides([]);
            } finally {
                setLoading(false);
            }
        };
        fetchSlides();
    }, []);

    // Chuyển slide tự động mỗi 4 giây
    const nextSlide = useCallback(() => {
        setCurrentIndex(prev => (prev + 1) % slides.length);
    }, [slides.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex(prev => (prev - 1 + slides.length) % slides.length);
    }, [slides.length]);

    useEffect(() => {
        if (slides.length === 0) return;
        const timer = setInterval(nextSlide, 4000);
        return () => clearInterval(timer); // Dọn timer khi unmount
    }, [slides.length, nextSlide]);

    // Khi đang tải hoặc không có dữ liệu, hiển thị banner tĩnh dự phòng
    if (loading || slides.length === 0) {
        return (
            <div
                className="hero-banner-static position-relative text-white d-flex align-items-center justify-content-center"
                style={{
                    background: 'linear-gradient(135deg, #1a202c 0%, #b30000 100%)',
                    minHeight: '420px',
                    padding: '60px 20px'
                }}
            >
                <div className="text-center" style={{ zIndex: 2, position: 'relative' }}>
                    <span className="badge px-3 py-2 text-uppercase font-weight-bold mb-3 d-block" style={{ backgroundColor: '#b30000', fontSize: '0.9rem' }}>KHUYẾN MÃI LỚN TRONG THÁNG</span>
                    <h1 className="display-4 font-weight-bold mb-4" style={{ textShadow: '2px 2px 6px rgba(0,0,0,0.5)' }}>PHỤ TÙNG CHÍNH HÃNG GIÁ TỐT NHẤT</h1>
                    <p className="lead mb-4 text-white-50">Cam kết chính hãng 100% — Giao hàng toàn quốc</p>
                    <button
                        className="btn btn-lg font-weight-bold px-5 mr-3 text-uppercase rounded-pill shadow"
                        style={{ backgroundColor: '#b30000', color: 'white', border: '2px solid white' }}
                        onClick={() => onNavigateToProduct && onNavigateToProduct(null)}
                    >
                        Mua ngay
                    </button>
                </div>
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.2)' }}></div>
            </div>
        );
    }

    const slide = slides[currentIndex];
    const slideImg = slide.imageUrl
        ? (slide.imageUrl.startsWith('http') ? slide.imageUrl : `${IMAGE_BASE_URL}${slide.imageUrl}`)
        : null;

    return (
        <div
            className="hero-banner position-relative overflow-hidden"
            style={{ minHeight: '420px', background: '#1a202c' }}
        >
            {/* Ảnh nền với overlay */}
            {slideImg && (
                <div
                    style={{
                        position: 'absolute', inset: 0,
                        backgroundImage: `url(${slideImg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        transition: 'all 0.6s ease'
                    }}
                />
            )}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(26,32,44,0.92) 0%, rgba(179,0,0,0.75) 100%)' }} />

            {/* Nội dung slide */}
            <div
                className="container-fluid px-xl-5 d-flex align-items-center"
                style={{ position: 'relative', zIndex: 2, minHeight: '420px', padding: '60px 20px' }}
            >
                <div className="text-white col-md-8">
                    <span
                        className="badge mb-3 px-3 py-2 text-uppercase font-weight-bold"
                        style={{ backgroundColor: '#b30000', fontSize: '0.85rem', borderRadius: '20px' }}
                    >
                        {slide.categoryName || 'SẢN PHẨM MỚI'}
                    </span>
                    <h1
                        className="font-weight-bold mb-3"
                        style={{ fontSize: '2.2rem', lineHeight: '1.3', textShadow: '2px 2px 8px rgba(0,0,0,0.6)' }}
                    >
                        {slide.name}
                    </h1>
                    <p className="text-white-75 mb-4" style={{ fontSize: '1.1rem', opacity: 0.85 }}>
                        {slide.description
                            ? (slide.description.replace(/<[^>]*>/g, '').substring(0, 120) + '...')
                            : 'Sản phẩm chính hãng, chất lượng cao, giao hàng toàn quốc.'}
                    </p>
                    <div className="d-flex align-items-center mb-4">
                        <h2 className="font-weight-bold mr-3 mb-0" style={{ color: '#ff6b6b', fontSize: '2rem' }}>
                            {slide.price?.toLocaleString('vi-VN')} đ
                        </h2>
                        <span className="text-white-50" style={{ textDecoration: 'line-through' }}>
                            {(slide.price * 1.2)?.toLocaleString('vi-VN')} đ
                        </span>
                    </div>
                    <button
                        className="btn btn-lg font-weight-bold px-5 rounded-pill shadow-lg text-uppercase"
                        style={{ backgroundColor: '#b30000', color: 'white', border: 'none' }}
                        onClick={() => onNavigateToProduct && onNavigateToProduct(slide.id)}
                    >
                        Xem chi tiết
                    </button>
                </div>

                {/* Ảnh sản phẩm bên phải (nếu có) */}
                {slideImg && (
                    <div className="col-md-4 text-center d-none d-md-block">
                        <img
                            src={slideImg}
                            alt={slide.name}
                            style={{ maxHeight: '300px', objectFit: 'contain', filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))' }}
                            className="img-fluid"
                        />
                    </div>
                )}
            </div>

            {/* Nút điều hướng trái/phải */}
            <button
                onClick={prevSlide}
                style={{
                    position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)',
                    zIndex: 3, background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.5)',
                    color: 'white', width: '48px', height: '48px', borderRadius: '50%',
                    fontSize: '1.2rem', cursor: 'pointer', backdropFilter: 'blur(4px)'
                }}
                aria-label="Previous slide"
            >‹</button>
            <button
                onClick={nextSlide}
                style={{
                    position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)',
                    zIndex: 3, background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.5)',
                    color: 'white', width: '48px', height: '48px', borderRadius: '50%',
                    fontSize: '1.2rem', cursor: 'pointer', backdropFilter: 'blur(4px)'
                }}
                aria-label="Next slide"
            >›</button>

            {/* Chấm chỉ thị slide */}
            <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 3, display: 'flex', gap: '8px' }}>
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        style={{
                            width: idx === currentIndex ? '28px' : '10px',
                            height: '10px',
                            borderRadius: '5px',
                            background: idx === currentIndex ? '#b30000' : 'rgba(255,255,255,0.5)',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            padding: 0
                        }}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroBanner;
