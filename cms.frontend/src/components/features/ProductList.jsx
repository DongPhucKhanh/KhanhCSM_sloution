// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: Component hiển thị Lưới Sản Phẩm (Đã fix lỗi UI chồng chéo Text và bóp nghẹt Card)
import React, { useState, useEffect, useContext } from 'react';
import productService from '../../services/productService';
import { CartContext } from '../../contexts/CartContext';

const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL || 'https://localhost:7004';

// 🔥 CẬP NHẬT: Thêm tham số colClass để linh hoạt số cột hiển thị
const ProductList = ({ selectedCategoryId, onSelectProduct, limit, excludeProductId, minPrice, maxPrice, colClass = "col-xl-4 col-md-6 col-sm-12" }) => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useContext(CartContext);

    const handleAddToCart = (e, item) => {
        e.stopPropagation();
        addToCart(item, 1);
        alert(`Đã thêm [${item.name}] vào giỏ hàng thành công!`);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                let data = [];

                if (selectedCategoryId === null) {
                    data = await productService.getAllProducts();
                } else {
                    data = await productService.getProductsByCategory(selectedCategoryId);
                    // BỔ SUNG LƯỢNG: Nếu danh mục này chỉ có 1 sản phẩm (chính là sản phẩm đang xem),
                    // thì fallback lấy tất cả sản phẩm để "Sản phẩm liên quan" luôn có dữ liệu hiển thị.
                    if (excludeProductId && data.length <= 1) {
                        data = await productService.getAllProducts();
                    }
                }

                if (excludeProductId) {
                    data = data.filter(item => item.id !== excludeProductId);
                }

                setProducts(data);
            } catch (error) {
                console.error("Lỗi khi tải danh sách sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [selectedCategoryId, excludeProductId]);

    let displayedProducts = products;

    if (minPrice !== null && !isNaN(minPrice) && minPrice !== undefined) {
        displayedProducts = displayedProducts.filter(p => p.price >= minPrice);
    }

    if (maxPrice !== null && !isNaN(maxPrice) && maxPrice !== undefined) {
        displayedProducts = displayedProducts.filter(p => p.price <= maxPrice);
    }

    if (loading) {
        return (
            <div className="text-center my-4 py-4">
                <div className="spinner-border text-danger spinner-border-sm" role="status"></div>
                <p className="mt-2 text-muted small">Đang nạp dữ liệu phụ tùng...</p>
            </div>
        );
    }

    return (
        <div className="row">
            {displayedProducts.length === 0 ? (
                <div className="col-12 text-center py-5 text-muted card modern-card border-0">
                    <i className="fa-solid fa-triangle-exclamation text-warning fa-2xl mb-3"></i>
                    <p className="m-0 font-weight-bold">Không tìm thấy sản phẩm nào khớp với yêu cầu!</p>
                </div>
            ) : (
                (limit ? displayedProducts.slice(0, limit) : displayedProducts).map((item) => {
                    const productImgUrl = item.imageUrl
                        ? (item.imageUrl.startsWith('http') ? item.imageUrl : `${IMAGE_BASE_URL}${item.imageUrl}`)
                        : 'https://via.placeholder.com/300x200?text=No+Image';

                    return (
                        // 🔥 Dùng colClass động ở đây
                        <div className={`${colClass} mb-4`} key={item.id}>
                            <div className="card h-100 modern-card border-0 overflow-hidden shadow-sm hover-shadow-lg transition-all">

                                <div
                                    className="text-center border-bottom overflow-hidden bg-white d-flex align-items-center justify-content-center cursor-pointer position-relative"
                                    style={{ height: '180px', cursor: 'pointer' }}
                                    onClick={() => onSelectProduct(item.id)}
                                >
                                    <span className="badge badge-danger position-absolute" style={{ top: '10px', right: '10px' }}>-20%</span>
                                    <img src={productImgUrl} alt={item.name} className="img-fluid p-3" style={{ maxHeight: '100%', objectFit: 'contain' }} onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Image+Error'; }} />
                                </div>

                                <div className="card-body p-3 d-flex flex-column justify-content-between">
                                    <div>
                                        <h6
                                            className="card-title font-weight-bold text-dark mb-2 text-hover-danger cursor-pointer product-title-clamp"
                                            title={item.name}
                                            onClick={() => onSelectProduct(item.id)}
                                            style={{ 
                                                display: '-webkit-box', 
                                                WebkitLineClamp: 2, 
                                                WebkitBoxOrient: 'vertical', 
                                                overflow: 'hidden',
                                                lineHeight: '1.4',
                                                minHeight: '2.8em',
                                                fontSize: '0.95rem'
                                            }}
                                        >
                                            {item.name}
                                        </h6>
                                        <p className="card-text text-muted small mb-3">
                                            <i className="fa-solid fa-tag mr-2 text-danger"></i>
                                            {item.categoryName || 'Sản phẩm'}
                                        </p>
                                    </div>
                                    
                                    <div className="mt-auto">
                                        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                                            <span className="font-weight-bold text-danger" style={{ fontSize: '1.1rem' }}>
                                                {item.price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price) : 'Liên hệ'}
                                            </span>
                                            <span className="small text-muted text-decoration-line-through d-none d-sm-inline">
                                                {item.price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * 1.2) : ''}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-footer bg-white border-top-0 p-3 pt-0">
                                    <div className="row no-gutters">
                                        <div className="col-3 pr-1">
                                            <button 
                                                className={`btn ${item.stockQuantity > 0 ? 'btn-outline-danger' : 'btn-outline-secondary disabled'} btn-block btn-sm rounded h-100`} 
                                                title={item.stockQuantity > 0 ? "Thêm vào giỏ hàng" : "Hết hàng"}
                                                onClick={(e) => item.stockQuantity > 0 ? handleAddToCart(e, item) : e.preventDefault()}
                                                disabled={item.stockQuantity === 0}>
                                                <i className="fa-solid fa-cart-plus"></i>
                                            </button>
                                        </div>
                                        <div className="col-9 pl-1">
                                            <button 
                                                className={`btn ${item.stockQuantity > 0 ? 'btn-danger' : 'btn-secondary disabled'} btn-block btn-sm rounded font-weight-bold text-uppercase py-2`}
                                                onClick={(e) => {
                                                    if(item.stockQuantity > 0) {
                                                        handleAddToCart(e, item);
                                                        onSelectProduct(item.id);
                                                    } else {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                disabled={item.stockQuantity === 0}>
                                                {item.stockQuantity > 0 ? 'Mua ngay' : 'Hết hàng'}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default ProductList;
