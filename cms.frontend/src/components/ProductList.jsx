// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: Component hiển thị Lưới Sản Phẩm (Đã tích hợp nối dây sự kiện Giỏ hàng thực tế)
// Dùng thư viện useContext để lấy dữ liệu từ các Provider bọc ngoài (như CartContext)
import React, { useState, useEffect, useContext } from 'react';
import productService from '../services/productService';
import { CartContext } from '../context/CartContext'; // Gọi "bộ não" giỏ hàng vào để xài hàm addToCart

const IMAGE_BASE_URL = 'https://localhost:7004';

// Component nhận vào 4 props (tham số):
// - selectedCategoryId: Dùng để lọc sản phẩm theo mã danh mục
// - onSelectProduct: Hàm kích hoạt khi bấm vào ảnh/tên sản phẩm để mở trang chi tiết
// - limit: Dùng để cắt số lượng sản phẩm hiển thị (VD: chỉ hiện 3 hoặc 6 sản phẩm ở trang chủ)
// - excludeProductId: ID của sản phẩm cần giấu đi (dùng cho phần "Sản phẩm liên quan" để tránh hiện trùng)
const ProductList = ({ selectedCategoryId, onSelectProduct, limit, excludeProductId }) => {

    // Khởi tạo state lưu mảng sản phẩm và trạng thái xoay vòng xoay loading
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Rút trích hàm addToCart từ trong CartContext ra. 
    // Hàm này đã được định nghĩa ở file CartContext.js, giờ mình lôi ra xài như một công cụ.
    const { addToCart } = useContext(CartContext);

    // Hàm xử lý sự kiện khi khách bấm vào nút "Mua hàng" hoặc "Icon giỏ hàng"
    const handleAddToCart = (e, item) => {
        // Lệnh e.stopPropagation() cực kỳ quan trọng:
        // Vì cái nút Mua Hàng nằm đè lên trên cái Thẻ Card, mà cái Thẻ Card lại có sự kiện click mở trang chi tiết.
        // Lệnh này giúp trình duyệt hiểu là: "Chỉ bấm nút mua thôi, đừng kích hoạt luôn sự kiện mở trang chi tiết đằng sau".
        e.stopPropagation();

        // Truyền nguyên object sản phẩm (item) và số lượng mặc định là 1 vào bộ não
        addToCart(item, 1);
        alert(`Đã thêm [${item.name}] vào giỏ hàng thành công!`); // Hiện popup báo cáo
    };

    // Hàm useEffect sẽ chạy ngầm ngay khi component này vừa xuất hiện trên màn hình
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true); // Bật icon loading
                let data = [];

                // Nếu không lọc danh mục -> Gọi API lấy tất cả. Nếu có mã danh mục -> Gọi API lấy theo nhóm
                if (selectedCategoryId === null) {
                    data = await productService.getAllProducts();
                } else {
                    data = await productService.getProductsByCategory(selectedCategoryId);
                }

                // Nếu có truyền vào ID cần loại trừ -> Lọc (filter) mảng data, chỉ giữ lại những món có ID khác với ID bị loại trừ
                if (excludeProductId) {
                    data = data.filter(item => item.id !== excludeProductId);
                }

                setProducts(data); // Đổ dữ liệu vào state để React vẽ ra màn hình
            } catch (error) {
                console.error("Lỗi khi tải danh sách sản phẩm:", error);
            } finally {
                setLoading(false); // Tắt icon loading
            }
        };
        fetchProducts();
        // Khai báo mảng phụ thuộc: Mỗi khi mã danh mục hoặc mã loại trừ bị thay đổi, hàm useEffect này sẽ chạy lại từ đầu
    }, [selectedCategoryId, excludeProductId]);

    // Nếu loading đang là true, hiển thị vòng xoay
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
            {/* Nếu mảng rỗng -> Báo lỗi chưa có sản phẩm. Ngược lại -> Render mảng */}
            {products.length === 0 ? (
                <div className="col-12 text-center py-5 text-muted card modern-card border-0">
                    <i className="fa-solid fa-triangle-exclamation text-warning fa-2xl mb-3"></i>
                    <p className="m-0 font-weight-bold">Danh mục này hiện chưa có thêm sản phẩm liên quan nào!</p>
                </div>
            ) : (
                // Lệnh cắt mảng: Nếu có limit (VD: 3) thì cắt 3 món đầu tiên (slice(0,3)), không thì lấy hết map() ra
                (limit ? products.slice(0, limit) : products).map((item) => {
                    // Xử lý thông minh link ảnh: Nếu trong DB đã là link đầy đủ (http...) thì giữ nguyên.
                    // Nếu là link tương đối (/images/...) thì ghép thêm tên miền gốc IMAGE_BASE_URL vào trước.
                    const productImgUrl = item.imageUrl
                        ? (item.imageUrl.startsWith('http') ? item.imageUrl : `${IMAGE_BASE_URL}${item.imageUrl}`)
                        : 'https://via.placeholder.com/300x200?text=No+Image';

                    return (
                        <div className="col-xl-4 col-md-6 col-sm-12 mb-4" key={item.id}>
                            <div className="card h-100 modern-card border-0 overflow-hidden shadow-sm hover-shadow-lg transition-all">

                                {/* KHU VỰC ẢNH: Kích hoạt onSelectProduct khi click */}
                                <div
                                    className="text-center border-bottom overflow-hidden bg-white d-flex align-items-center justify-content-center cursor-pointer position-relative"
                                    style={{ height: '180px', cursor: 'pointer' }}
                                    onClick={() => onSelectProduct(item.id)}
                                >
                                    <span className="badge badge-danger position-absolute" style={{ top: '10px', right: '10px' }}>-20%</span>
                                    <img src={productImgUrl} alt={item.name} className="img-fluid p-3" style={{ maxHeight: '100%', objectFit: 'contain' }} onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Image+Error'; }} />
                                </div>

                                {/* KHU VỰC THÔNG TIN SẢN PHẨM */}
                                <div className="card-body p-3 d-flex flex-column justify-content-between">
                                    <div>
                                        <h6 className="card-title font-weight-bold text-dark mb-2 text-truncate-2 text-hover-danger cursor-pointer" title={item.name} onClick={() => onSelectProduct(item.id)} style={{ cursor: 'pointer', lineHeight: '1.4', height: '40px' }}>
                                            {item.name}
                                        </h6>
                                        <div className="d-flex align-items-end mb-2">
                                            <span className="text-danger font-weight-bold mr-2" style={{ fontSize: '1.1rem' }}>
                                                {/* Dùng Intl.NumberFormat để chuyển số 10000 thành 10.000 đ */}
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                            </span>
                                            <span className="text-muted small mb-1" style={{ textDecoration: 'line-through' }}>
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * 1.2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* KHU VỰC CHÂN CARD CHỨA 2 NÚT MUA HÀNG */}
                                <div className="card-footer bg-white border-top-0 p-3 pt-0">
                                    <div className="row no-gutters">
                                        <div className="col-3 pr-1">
                                            {/* Gắn sự kiện handleAddToCart và truyền nguyên object 'item' vào */}
                                            <button className="btn btn-outline-danger btn-block btn-sm rounded h-100" title="Thêm vào giỏ hàng"
                                                onClick={(e) => handleAddToCart(e, item)}>
                                                <i className="fa-solid fa-cart-plus"></i>
                                            </button>
                                        </div>
                                        <div className="col-9 pl-1">
                                            <button className="btn btn-danger btn-block btn-sm rounded font-weight-bold text-uppercase py-2"
                                                onClick={(e) => handleAddToCart(e, item)}>
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