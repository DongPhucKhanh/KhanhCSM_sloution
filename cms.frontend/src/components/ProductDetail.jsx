// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: Giao diện Chi tiết Sản Phẩm (Tích hợp bộ đếm số lượng và Giỏ hàng)
import React, { useState, useEffect, useContext } from 'react';
import productService from '../services/productService';
import ProductList from './ProductList';
import { CartContext } from '../context/CartContext'; // Gọi "bộ não"

const IMAGE_BASE_URL = 'https://localhost:7004';

const ProductDetail = ({ productId, onBack, onSelectProduct }) => {

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    // Tạo state 'quantity' để lưu con số hiển thị giữa nút (+) và (-)
    // Mặc định luôn là 1 khi mới mở trang
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useContext(CartContext); // Lôi hàm lấy hàng ra

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                setLoading(true);
                const data = await productService.getProductById(productId);
                setProduct(data);

                // MỘT TRICK UX RẤT HAY: Giả sử đang ở SP cũ, bấm sang Sản phẩm liên quan (SP mới),
                // ta phải ép số lượng mua của SP mới reset về lại 1 để khỏi bị lỗi dính số cũ.
                setQuantity(1);

                // Trượt mượt mà lên trên cùng màn hình
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (error) {
                console.error("Lỗi tải chi tiết sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        if (productId) fetchProductDetail();
    }, [productId]); // Chạy lại khi mã productId thay đổi

    // Nếu đang lấy dữ liệu hoặc không tìm thấy dữ liệu thì return ngay giao diện lỗi
    if (loading) return <div className="text-center my-5 text-muted"><i className="fas fa-spinner fa-spin fa-2xl mr-2 text-danger"></i>Đang nạp thông số kỹ thuật...</div>;
    if (!product) return <div className="text-center text-danger my-4">Lỗi: Không tìm thấy sản phẩm!</div>;

    const productImgUrl = product.imageUrl ? (product.imageUrl.startsWith('http') ? product.imageUrl : `${IMAGE_BASE_URL}${product.imageUrl}`) : 'https://via.placeholder.com/600x600?text=No+Image';
    const formattedPrice = product.price ? product.price.toLocaleString('vi-VN') + ' đ' : 'Liên hệ';
    const oldPrice = product.price ? (product.price * 1.2).toLocaleString('vi-VN') + ' đ' : '';

    return (
        <div className="product-detail-wrapper bg-white">
            <button onClick={onBack} className="btn btn-light btn-sm mb-4 border shadow-sm font-weight-bold hover-shadow transition-all">
                <i className="fa-solid fa-arrow-left text-danger mr-2"></i> Trở về kho phụ tùng
            </button>

            <div className="row pb-5 border-bottom">
                {/* Khu vực ảnh */}
                <div className="col-md-5 mb-4 text-center">
                    <div className="border rounded p-3 shadow-sm bg-light position-relative">
                        <span className="badge badge-danger position-absolute" style={{ top: '15px', right: '15px', fontSize: '1rem' }}>-20%</span>
                        <img src={productImgUrl} alt={product.name} className="img-fluid rounded" style={{ maxHeight: '400px', objectFit: 'contain' }} />
                    </div>
                </div>

                {/* Khu vực thông tin mua hàng */}
                <div className="col-md-7">
                    <span className="badge badge-danger text-uppercase px-2 py-1 mb-2">{product.categoryName || "PHỤ TÙNG CHÍNH HÃNG"}</span>
                    <h3 className="font-weight-bold text-dark mb-3" style={{ lineHeight: '1.4' }}>{product.name}</h3>

                    <div className="bg-light p-3 rounded mb-4 border-left border-danger d-flex align-items-center" style={{ borderWidth: '4px !important' }}>
                        <h2 className="text-danger font-weight-bold m-0 mr-3">{formattedPrice}</h2>
                        <span className="text-muted" style={{ textDecoration: 'line-through', fontSize: '1.1rem' }}>{oldPrice}</span>
                    </div>
                    <p className="small text-muted mb-4"><i className="fa-solid fa-check text-success mr-1"></i> Tình trạng: Còn <strong className="text-dark">{product.stock || product.stockQuantity || 15}</strong> sản phẩm trong kho</p>

                    {/* KHU VỰC THAO TÁC SỐ LƯỢNG & MUA HÀNG */}
                    <div className="d-flex align-items-center mb-4 border-bottom pb-4">

                        <div className="input-group mr-3 shadow-sm" style={{ width: '130px' }}>
                            {/* Nút Giảm (-): Gọi hàm setQuantity. Cấu trúc q => q > 1 ? q - 1 : 1 giúp đảm bảo số lượng không bao giờ bị tuột xuống số 0 hoặc số âm */}
                            <div className="input-group-prepend">
                                <button className="btn btn-outline-secondary font-weight-bold" type="button" onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)}>-</button>
                            </div>

                            {/* Ô nhập liệu trung tâm hiển thị trực tiếp biến state 'quantity' */}
                            <input type="text" className="form-control text-center font-weight-bold bg-white" value={quantity} readOnly />

                            {/* Nút Tăng (+): Bấm vào thì cộng thêm 1 đơn vị */}
                            <div className="input-group-append">
                                <button className="btn btn-outline-secondary font-weight-bold" type="button" onClick={() => setQuantity(q => q + 1)}>+</button>
                            </div>
                        </div>

                        {/* NÚT THÊM GIỎ HÀNG */}
                        <button className="btn btn-danger font-weight-bold px-4 py-2 shadow-sm text-uppercase mr-2"
                            onClick={() => {
                                // Bắn nguyên cụm: Thông tin sản phẩm + Số lượng do khách tự tùy chỉnh vào thẳng "bộ não"
                                addToCart(product, quantity);
                                alert(`Đã thêm ${quantity} x [${product.name}] vào giỏ hàng!`);
                            }}>
                            <i className="fa-solid fa-cart-plus mr-2"></i> Thêm Vào Giỏ
                        </button>
                    </div>

                    <div className="product-description text-dark" style={{ lineHeight: '1.8', textAlign: 'justify' }}>
                        <h6 className="font-weight-bold text-uppercase text-danger mb-3"><i className="fa-solid fa-circle-info mr-2"></i>Đặc điểm nổi bật & Thông số:</h6>
                        <div dangerouslySetInnerHTML={{ __html: product.description || "<p>Đang cập nhật thông số chi tiết cho mã phụ tùng này...</p>" }} />
                    </div>
                </div>
            </div>

            {/* KHU VỰC SẢN PHẨM LIÊN QUAN */}
            <div className="related-products-section mt-5 pt-2">
                <h4 className="font-weight-bold text-dark text-uppercase mb-4">
                    <span className="border-bottom border-danger pb-2 d-inline-block">
                        <i className="fa-solid fa-boxes-stacked mr-2 text-danger"></i>Sản phẩm liên quan 
                    </span>
                </h4>
                {/* Lệnh gọi lại chính file ProductList.jsx ở trên, truyền ID vào tham số excludeProductId để loại trừ cái sản phẩm đang xem đi */}
                <ProductList selectedCategoryId={product.categoryId || null} onSelectProduct={onSelectProduct} limit={3} excludeProductId={product.id} />
            </div>

        </div>
    );
};

export default ProductDetail;