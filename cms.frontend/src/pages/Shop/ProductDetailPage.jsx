// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
// Chức năng: Chi tiết Sản Phẩm - Kiểm tra StockQuantity (Tiêu chí 42) + biến env (Tiêu chí 45)
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productService from '../../services/productService';
import ProductList from '../../components/features/ProductList';
import { CartContext } from '../../contexts/CartContext';

// Đọc URL từ biến môi trường .env thay vì hardcode (Tiêu chí 45)
const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL || 'https://localhost:7004';

const ProductDetailPage = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                setLoading(true);
                const data = await productService.getProductById(productId);
                setProduct(data);
                setQuantity(1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (error) {
                console.error("Lỗi tải chi tiết sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        if (productId) fetchProductDetail();
    }, [productId]);

    if (loading) return <div className="text-center my-5 text-muted"><i className="fas fa-spinner fa-spin fa-2xl mr-2 text-danger"></i>Đang nạp thông số kỹ thuật...</div>;
    if (!product) return <div className="text-center text-danger my-4">Lỗi: Không tìm thấy sản phẩm!</div>;

    const stockQty = product.stockQuantity ?? product.stock ?? 0;
    const productImgUrl = product.imageUrl
        ? (product.imageUrl.startsWith('http') ? product.imageUrl : `${IMAGE_BASE_URL}${product.imageUrl}`)
        : 'https://via.placeholder.com/600x600?text=No+Image';
    const formattedPrice = product.price ? product.price.toLocaleString('vi-VN') + ' đ' : 'Liên hệ';
    const oldPrice = product.price ? (product.price * 1.2).toLocaleString('vi-VN') + ' đ' : '';

    // === XỬ LÝ THÊM GIỎ HÀNG CÓ KIỂM TRA TỒN KHO (Tiêu chí 42) ===
    const handleAddToCart = () => {
        if (stockQty === 0) {
            alert('⚠️ Sản phẩm này hiện đã hết hàng!');
            return;
        }
        if (quantity > stockQty) {
            alert(`⚠️ Số lượng sản phẩm trong kho không đủ! Hiện chỉ còn ${stockQty} cái.`);
            return;
        }
        addToCart(product, quantity);
        alert(`Đã thêm ${quantity} x [${product.name}] vào giỏ hàng!`);
    };

    // Tăng số lượng - không vượt quá StockQuantity (Tiêu chí 42)
    const handleIncrease = () => {
        if (quantity >= stockQty) {
            alert(`⚠️ Số lượng sản phẩm trong kho không đủ! Chỉ còn ${stockQty} cái trong kho.`);
            return;
        }
        setQuantity(q => q + 1);
    };

    return (
        <div className="product-detail-wrapper bg-white">
            <button onClick={() => navigate(-1)} className="btn btn-light btn-sm mb-4 border shadow-sm font-weight-bold hover-shadow transition-all">
                <i className="fa-solid fa-arrow-left text-danger mr-2"></i> Trở về kho phụ tùng
            </button>

            <div className="row pb-5 border-bottom">
                <div className="col-md-5 mb-4 text-center">
                    <div className="border rounded p-3 shadow-sm bg-light position-relative">
                        <span className="badge badge-danger position-absolute" style={{ top: '15px', right: '15px', fontSize: '1rem' }}>-20%</span>
                        <img src={productImgUrl} alt={product.name} className="img-fluid rounded" style={{ maxHeight: '400px', objectFit: 'contain' }} />
                    </div>
                </div>

                <div className="col-md-7">
                    <span className="badge badge-danger text-uppercase px-2 py-1 mb-2">{product.categoryName || "PHỤ TÙNG CHÍNH HÃNG"}</span>
                    <h3 className="font-weight-bold text-dark mb-3" style={{ lineHeight: '1.4' }}>{product.name}</h3>

                    <div className="bg-light p-3 rounded mb-4 border-left border-danger d-flex align-items-center flex-wrap">
                        <h2 className="text-danger font-weight-bold m-0 mr-3 mb-2 mb-sm-0">{formattedPrice}</h2>
                        <span className="text-muted" style={{ textDecoration: 'line-through', fontSize: '1.1rem' }}>{oldPrice}</span>
                    </div>

                    {/* Hiển thị tồn kho thực tế (Tiêu chí 42) */}
                    <p className="small mb-4">
                        <i className={`fa-solid ${stockQty > 0 ? 'fa-check text-success' : 'fa-times text-danger'} mr-1`}></i>
                        Tình trạng:{' '}
                        {stockQty > 0
                            ? <><strong className="text-dark">{stockQty}</strong> <span className="text-muted">sản phẩm trong kho</span></>
                            : <strong className="text-danger">Tạm hết hàng</strong>
                        }
                    </p>

                    <div className="d-flex align-items-center mb-4 border-bottom pb-4">
                        <div className="input-group mr-3 shadow-sm" style={{ width: '130px' }}>
                            <div className="input-group-prepend">
                                <button
                                    className="btn btn-outline-secondary font-weight-bold"
                                    type="button"
                                    onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)}
                                >-</button>
                            </div>
                            <input type="text" className="form-control text-center font-weight-bold bg-white" value={quantity} readOnly />
                            <div className="input-group-append">
                                {/* Nút (+) bị chặn khi vượt tồn kho (Tiêu chí 42) */}
                                <button
                                    className="btn btn-outline-secondary font-weight-bold"
                                    type="button"
                                    onClick={handleIncrease}
                                    disabled={stockQty === 0 || quantity >= stockQty}
                                    title={quantity >= stockQty ? `Tối đa ${stockQty} cái` : 'Tăng số lượng'}
                                >+</button>
                            </div>
                        </div>

                        <button
                            className="btn btn-danger font-weight-bold px-4 py-2 shadow-sm text-uppercase mr-2"
                            onClick={handleAddToCart}
                            disabled={stockQty === 0}
                        >
                            <i className="fa-solid fa-cart-plus mr-2"></i>
                            {stockQty === 0 ? 'Hết hàng' : 'Thêm Vào Giỏ'}
                        </button>
                    </div>

                    <div className="product-description text-dark" style={{ lineHeight: '1.8', textAlign: 'justify' }}>
                        <h6 className="font-weight-bold text-uppercase text-danger mb-3"><i className="fa-solid fa-circle-info mr-2"></i>Đặc điểm nổi bật &amp; Thông số:</h6>
                        <div dangerouslySetInnerHTML={{ __html: product.description || '<p>Đang cập nhật thông số chi tiết cho mã phụ tùng này...</p>' }} />
                    </div>
                </div>
            </div>

            <div className="related-products-section mt-5 pt-4 border-top">
                <h4 className="font-weight-bold text-dark text-uppercase mb-4" style={{ fontSize: '1.25rem' }}>
                    <span className="border-bottom border-danger pb-2 d-inline-block">
                        <i className="fa-solid fa-boxes-stacked mr-2 text-danger"></i>Sản phẩm liên quan
                    </span>
                </h4>
                <div className="row">
                    <div className="col-12">
                        <ProductList 
                            selectedCategoryId={product.categoryProductId || null} 
                            onSelectProduct={(id) => navigate(`/product/${id}`)} 
                            limit={4} 
                            excludeProductId={product.id} 
                            colClass="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-6"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
