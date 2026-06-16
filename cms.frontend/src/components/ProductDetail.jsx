// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: Giao diện Chi tiết Sản Phẩm (Đã tích hợp phần hiển thị Sản phẩm liên quan ở cuối trang)
import React, { useState, useEffect } from 'react';
import productService from '../services/productService';
// 🔥 BỔ SUNG 1: Nhúng Component ProductList vào để tái sử dụng làm "Sản phẩm liên quan"
import ProductList from './ProductList';

const IMAGE_BASE_URL = 'https://localhost:7004';

// Nhận 3 tham số: 
// - productId: ID của sản phẩm đang xem
// - onBack: Hàm để quay lại danh sách
// - onSelectProduct: Hàm để bấm vào sản phẩm liên quan thì tự động chuyển trang
const ProductDetail = ({ productId, onBack, onSelectProduct }) => {

    // ==========================================
    // 1. KHỞI TẠO STATE
    // ==========================================
    const [product, setProduct] = useState(null); // Chứa dữ liệu chi tiết của 1 sản phẩm
    const [loading, setLoading] = useState(true); // Trạng thái chờ load dữ liệu

    // ==========================================
    // 2. GỌI API LẤY CHI TIẾT SẢN PHẨM
    // ==========================================
    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                setLoading(true);
                // Truyền ID xuống Backend để lấy thông tin chi tiết
                const data = await productService.getProductById(productId);
                setProduct(data);

                // 🔥 Xử lý UX: Khi dữ liệu load xong, ép trình duyệt cuộn mượt mà lên sát mép trên cùng 
                // (Rất hữu ích khi khách đang ở cuối trang mà bấm vào sản phẩm liên quan)
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (error) {
                console.error("Lỗi tải chi tiết sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        // Chỉ gọi API nếu có ID hợp lệ
        if (productId) fetchProductDetail();
    }, [productId]); // Hiệu ứng này sẽ chạy lại mỗi khi [productId] bị thay đổi

    // ==========================================
    // 3. XỬ LÝ GIAO DIỆN CHỜ & LỖI
    // ==========================================
    if (loading) {
        return <div className="text-center my-5 text-muted"><i className="fas fa-spinner fa-spin fa-2xl mr-2 text-danger"></i>Đang nạp thông số kỹ thuật...</div>;
    }

    if (!product) {
        return <div className="text-center text-danger my-4">Lỗi: Không tìm thấy sản phẩm!</div>;
    }

    // ==========================================
    // 4. XỬ LÝ FORMAT DỮ LIỆU HIỂN THỊ
    // ==========================================
    // Xử lý link ảnh
    const productImgUrl = product.imageUrl
        ? (product.imageUrl.startsWith('http') ? product.imageUrl : `${IMAGE_BASE_URL}${product.imageUrl}`)
        : 'https://via.placeholder.com/600x600?text=No+Image';

    // Format tiền tệ Việt Nam (VD: 1.500.000 đ)
    const formattedPrice = product.price ? product.price.toLocaleString('vi-VN') + ' đ' : 'Liên hệ';
    // Tính giá gốc ảo (đắt hơn 20%) để làm hiệu ứng gạch ngang cho đẹp
    const oldPrice = product.price ? (product.price * 1.2).toLocaleString('vi-VN') + ' đ' : '';

    // ==========================================
    // 5. RENDER GIAO DIỆN CHÍNH
    // ==========================================
    return (
        <div className="product-detail-wrapper bg-white">

            {/* NÚT QUAY LẠI */}
            <button onClick={onBack} className="btn btn-light btn-sm mb-4 border shadow-sm font-weight-bold hover-shadow transition-all">
                <i className="fa-solid fa-arrow-left text-danger mr-2"></i> Trở về kho phụ tùng
            </button>

            {/* KHỐI NỘI DUNG SẢN PHẨM (Chia 2 cột) */}
            <div className="row pb-5 border-bottom">

                {/* CỘT TRÁI: HÌNH ẢNH SẢN PHẨM (Chiếm 5 phần) */}
                <div className="col-md-5 mb-4 text-center">
                    <div className="border rounded p-3 shadow-sm bg-light position-relative">
                        <span className="badge badge-danger position-absolute" style={{ top: '15px', right: '15px', fontSize: '1rem' }}>-20%</span>
                        <img src={productImgUrl} alt={product.name} className="img-fluid rounded" style={{ maxHeight: '400px', objectFit: 'contain' }} />
                    </div>
                </div>

                {/* CỘT PHẢI: THÔNG TIN VÀ NÚT MUA HÀNG (Chiếm 7 phần) */}
                <div className="col-md-7">
                    {/* Tên và Danh mục */}
                    <span className="badge badge-danger text-uppercase px-2 py-1 mb-2">{product.categoryName || "PHỤ TÙNG CHÍNH HÃNG"}</span>
                    <h3 className="font-weight-bold text-dark mb-3" style={{ lineHeight: '1.4' }}>{product.name}</h3>

                    {/* Khung hiển thị Giá tiền */}
                    <div className="bg-light p-3 rounded mb-4 border-left border-danger d-flex align-items-center" style={{ borderWidth: '4px !important' }}>
                        <h2 className="text-danger font-weight-bold m-0 mr-3">{formattedPrice}</h2>
                        <span className="text-muted" style={{ textDecoration: 'line-through', fontSize: '1.1rem' }}>{oldPrice}</span>
                    </div>
                    <p className="small text-muted mb-4"><i className="fa-solid fa-check text-success mr-1"></i> Tình trạng: Còn <strong className="text-dark">{product.stock || product.stockQuantity || 15}</strong> sản phẩm trong kho</p>

                    {/* Khung số lượng & Nút Thêm vào giỏ */}
                    <div className="d-flex align-items-center mb-4 border-bottom pb-4">
                        {/* Bộ tăng giảm số lượng */}
                        <div className="input-group mr-3 shadow-sm" style={{ width: '130px' }}>
                            <div className="input-group-prepend"><button className="btn btn-outline-secondary font-weight-bold" type="button">-</button></div>
                            <input type="text" className="form-control text-center font-weight-bold" defaultValue="1" />
                            <div className="input-group-append"><button className="btn btn-outline-secondary font-weight-bold" type="button">+</button></div>
                        </div>
                        {/* Nút giỏ hàng */}
                        <button className="btn btn-danger font-weight-bold px-4 py-2 shadow-sm text-uppercase mr-2">
                            <i className="fa-solid fa-cart-plus mr-2"></i> Thêm Vào Giỏ
                        </button>
                    </div>

                    {/* Khung Mô tả chi tiết (Render HTML từ CSDL) */}
                    <div className="product-description text-dark" style={{ lineHeight: '1.8', textAlign: 'justify' }}>
                        <h6 className="font-weight-bold text-uppercase text-danger mb-3"><i className="fa-solid fa-circle-info mr-2"></i>Đặc điểm nổi bật & Thông số:</h6>
                        <div dangerouslySetInnerHTML={{ __html: product.description || "<p>Đang cập nhật thông số chi tiết cho mã phụ tùng này...</p>" }} />
                    </div>
                </div>
            </div>

            {/* ========================================================================= */}
            {/* 🔥 KHỐI HIỂN THỊ SẢN PHẨM LIÊN QUAN */}
            {/* ========================================================================= */}
            <div className="related-products-section mt-5 pt-2">
                <h4 className="font-weight-bold text-dark text-uppercase mb-4">
                    <span className="border-bottom border-danger pb-2 d-inline-block">
                        <i className="fa-solid fa-boxes-stacked mr-2 text-danger"></i>Sản phẩm cùng chuyên mục
                    </span>
                </h4>

                {/* ĐÃ SỬA: Truyền thêm excludeProductId={product.id} để nó giấu cái sản phẩm đang xem đi */}
                <ProductList
                    selectedCategoryId={product.categoryId || null}
                    onSelectProduct={onSelectProduct}
                    limit={3}
                    excludeProductId={product.id}
                />
            </div>

        </div>
    );
};

export default ProductDetail;