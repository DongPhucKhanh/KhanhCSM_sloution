// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: Hiển thị sản phẩm mới nhất từ API riêng (Tiêu chí 36)
import React, { useState, useEffect, useContext } from 'react';
import productService from '../../services/productService';
import { CartContext } from '../../contexts/CartContext';

const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL || 'https://localhost:7004';

const NewestProducts = ({ onSelectProduct, limit = 3 }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchNewest = async () => {
            try {
                setLoading(true);
                const data = await productService.getNewestProducts(limit);
                setProducts(data || []);
            } catch (err) {
                console.error('Lỗi tải sản phẩm mới nhất:', err);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchNewest();
    }, [limit]);

    if (loading) {
        return (
            <div className="text-center py-4">
                <div className="spinner-border spinner-border-sm text-danger" role="status"></div>
                <p className="mt-2 text-muted small">Đang tải sản phẩm mới nhất...</p>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center text-muted py-4">
                <p>Chưa có sản phẩm mới nào.</p>
            </div>
        );
    }

    return (
        <div className="row">
            {products.map(item => {
                const imgUrl = item.imageUrl
                    ? (item.imageUrl.startsWith('http') ? item.imageUrl : `${IMAGE_BASE_URL}${item.imageUrl}`)
                    : 'https://via.placeholder.com/300x200?text=No+Image';
                return (
                    <div key={item.id} className="col-xl-4 col-md-6 col-sm-12 mb-4">
                        <div className="card h-100 modern-card border-0 overflow-hidden shadow-sm hover-shadow-lg transition-all">
                            <div
                                className="text-center border-bottom overflow-hidden bg-white d-flex align-items-center justify-content-center position-relative"
                                style={{ height: '180px', cursor: 'pointer' }}
                                onClick={() => onSelectProduct && onSelectProduct(item.id)}
                            >
                                <span className="badge badge-success position-absolute" style={{ top: '10px', right: '10px' }}>MỚI</span>
                                <img src={imgUrl} alt={item.name} className="img-fluid p-3" style={{ maxHeight: '100%', objectFit: 'contain' }}
                                    onError={e => { e.target.src = 'https://via.placeholder.com/300x200?text=Image+Error'; }} />
                            </div>
                            <div className="card-body p-3 d-flex flex-column justify-content-between">
                                <h6
                                    className="card-title font-weight-bold text-dark mb-2 cursor-pointer"
                                    onClick={() => onSelectProduct && onSelectProduct(item.id)}
                                    style={{ lineHeight: '1.4', minHeight: '40px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                                >
                                    {item.name}
                                </h6>
                                <div className="d-flex flex-wrap align-items-center mb-2">
                                    <span className="text-danger font-weight-bold mr-2" style={{ fontSize: '1.1rem' }}>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                    </span>
                                </div>
                            </div>
                            <div className="card-footer bg-white border-top-0 p-3 pt-0">
                                <div className="row no-gutters">
                                    <div className="col-3 pr-1">
                                        <button className="btn btn-outline-danger btn-block btn-sm rounded h-100"
                                            onClick={e => { e.stopPropagation(); addToCart(item, 1); alert(`Đã thêm [${item.name}] vào giỏ hàng!`); }}>
                                            <i className="fa-solid fa-cart-plus"></i>
                                        </button>
                                    </div>
                                    <div className="col-9 pl-1">
                                        <button className="btn btn-danger btn-block btn-sm rounded font-weight-bold text-uppercase py-2"
                                            onClick={e => { e.stopPropagation(); addToCart(item, 1); alert(`Đã thêm [${item.name}] vào giỏ hàng!`); }}>
                                            Mua ngay
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default NewestProducts;
