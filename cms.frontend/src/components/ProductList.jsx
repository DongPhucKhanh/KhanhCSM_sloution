// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: Component hiển thị Lưới Sản Phẩm (Tích hợp Loại trừ sản phẩm đang xem)
import React, { useState, useEffect } from 'react';
import productService from '../services/productService';

const IMAGE_BASE_URL = 'https://localhost:7004';

// 🔥 BỔ SUNG 1: Thêm prop 'excludeProductId' để nhận ID cần loại trừ khỏi danh sách
const ProductList = ({ selectedCategoryId, onSelectProduct, limit, excludeProductId }) => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                let data = [];

                if (selectedCategoryId === null) {
                    data = await productService.getAllProducts();
                } else {
                    data = await productService.getProductsByCategory(selectedCategoryId);
                }

                // 🔥 BỔ SUNG 2: LOGIC LỌC BỎ SẢN PHẨM ĐANG XEM
                // Nếu Component cha có truyền excludeProductId vào, ta lọc mảng để bỏ cái ID đó đi
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
    }, [selectedCategoryId, excludeProductId]); // Thêm excludeProductId vào mảng lắng nghe

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
            {products.length === 0 ? (
                <div className="col-12 text-center py-5 text-muted card modern-card border-0">
                    <i className="fa-solid fa-triangle-exclamation text-warning fa-2xl mb-3"></i>
                    <p className="m-0 font-weight-bold">Danh mục này hiện chưa có thêm sản phẩm liên quan nào!</p>
                </div>
            ) : (
                (limit ? products.slice(0, limit) : products).map((item) => {
                    const productImgUrl = item.imageUrl
                        ? (item.imageUrl.startsWith('http') ? item.imageUrl : `${IMAGE_BASE_URL}${item.imageUrl}`)
                        : 'https://via.placeholder.com/300x200?text=No+Image';

                    return (
                        <div className="col-xl-4 col-md-6 col-sm-12 mb-4" key={item.id}>
                            <div className="card h-100 modern-card border-0 overflow-hidden shadow-sm hover-shadow-lg transition-all">

                                <div
                                    className="text-center border-bottom overflow-hidden bg-white d-flex align-items-center justify-content-center cursor-pointer position-relative"
                                    style={{ height: '180px', cursor: 'pointer' }}
                                    onClick={() => onSelectProduct(item.id)}
                                >
                                    <span className="badge badge-danger position-absolute" style={{ top: '10px', right: '10px' }}>-20%</span>
                                    <img
                                        src={productImgUrl}
                                        alt={item.name}
                                        className="img-fluid p-3"
                                        style={{ maxHeight: '100%', objectFit: 'contain' }}
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Image+Error'; }}
                                    />
                                </div>

                                <div className="card-body p-3 d-flex flex-column justify-content-between">
                                    <div>
                                        <h6
                                            className="card-title font-weight-bold text-dark mb-2 text-truncate-2 text-hover-danger cursor-pointer"
                                            title={item.name}
                                            onClick={() => onSelectProduct(item.id)}
                                            style={{ cursor: 'pointer', lineHeight: '1.4', height: '40px' }}
                                        >
                                            {item.name}
                                        </h6>

                                        <div className="d-flex align-items-end mb-2">
                                            <span className="text-danger font-weight-bold mr-2" style={{ fontSize: '1.1rem' }}>
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                            </span>
                                            <span className="text-muted small mb-1" style={{ textDecoration: 'line-through' }}>
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * 1.2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-footer bg-white border-top-0 p-3 pt-0">
                                    <div className="row no-gutters">
                                        <div className="col-3 pr-1">
                                            <button
                                                className="btn btn-outline-danger btn-block btn-sm rounded h-100"
                                                title="Thêm vào giỏ hàng"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    alert(`Đã thêm [${item.name}] vào giỏ hàng thành công!`);
                                                }}
                                            >
                                                <i className="fa-solid fa-cart-plus"></i>
                                            </button>
                                        </div>
                                        <div className="col-9 pl-1">
                                            <button
                                                className="btn btn-danger btn-block btn-sm rounded font-weight-bold text-uppercase py-2"
                                                onClick={() => onSelectProduct(item.id)}
                                            >
                                                Mua ngay
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