// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: Component hiển thị sản phẩm dạng lưới kèm hình ảnh thực tế từ SQL Server
import React, { useState, useEffect } from 'react';
import productService from '../services/productService';

// ĐỊNH NGHĨA CỔNG PORT BACKEND THỰC TẾ ĐỂ TRUY XUẤT wwwroot/uploads
const IMAGE_BASE_URL = 'https://localhost:7004';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await productService.getAllProducts();
                setProducts(data);
            } catch (error) {
                console.error("Lỗi khi tải danh sách sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="text-center my-4 py-4">
                <div className="spinner-border text-primary spinner-border-sm" role="status"></div>
                <p className="mt-2 text-muted small">Đang nạp danh sách sản phẩm...</p>
            </div>
        );
    }

    return (
        <div className="row">
            {products.length === 0 ? (
                <div className="col-12 text-center py-4 text-muted small">Chưa có sản phẩm nào trong hệ thống.</div>
            ) : (
                products.map((item) => {
                    // Kiểm tra và xử lý ghép chuỗi đường dẫn hình ảnh linh hoạt
                    const productImgUrl = item.imageUrl
                        ? (item.imageUrl.startsWith('http') ? item.imageUrl : `${IMAGE_BASE_URL}${item.imageUrl}`)
                        : 'https://via.placeholder.com/300x200?text=No+Image';

                    return (
                        <div className="col-xl-4 col-md-6 col-sm-12 mb-4" key={item.id}>
                            <div className="card h-100 modern-card border-0 overflow-hidden">

                               
                                <div className="text-center border-bottom overflow-hidden bg-light d-flex align-items-center justify-content-center" style={{ height: '160px' }}>
                                    <img
                                        src={productImgUrl}
                                        alt={item.name}
                                        className="img-fluid h-100 w-100"
                                        style={{ objectFit: 'cover', transition: 'transform 0.3s ease' }}
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Image+Error'; }}
                                    />
                                </div>

                                <div className="card-body p-3 d-flex flex-column justify-content-between">
                                    <div>
                                        <h6 className="card-title font-weight-bold text-dark mb-2 text-truncate" title={item.name}>
                                            {item.name}
                                        </h6>
                                        <p className="card-text text-danger font-weight-bold mb-1" style={{ fontSize: '0.95rem' }}>
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                        </p>
                                    </div>
                                    <div className="mt-2 pt-2 border-top border-light">
                                        <p className="card-text text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                                            <i className="fa-solid fa-warehouse mr-1 text-secondary"></i> Kho: <span className="font-weight-bold text-dark">{item.stock || item.stockQuantity}</span> sản phẩm
                                        </p>
                                    </div>
                                </div>
                                <div className="card-footer bg-white border-top-0 p-3 pt-0">
                                    <button className="btn btn-outline-primary btn-block btn-sm font-weight-normal py-2 rounded-pill">
                                        <i className="fa-solid fa-cart-plus mr-1 small"></i> Xem chi tiết
                                    </button>
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