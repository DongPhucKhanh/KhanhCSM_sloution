// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const IMAGE_BASE_URL = 'https://localhost:7004';

const Cart = ({ onContinueShopping, onCheckout }) => {
    // Móc bộ não CartContext ra để lấy dữ liệu
    const { cart, removeFromCart, updateQuantity, cartTotal } = useContext(CartContext);

    if (cart.length === 0) {
        return (
            <div className="container py-5 mt-4 bg-white text-center shadow-sm rounded">
                <i className="fa-solid fa-cart-arrow-down fa-4x text-muted mb-3"></i>
                <h4 className="text-dark font-weight-bold">Giỏ hàng của bạn đang trống</h4>
                <p className="text-muted">Chưa có linh kiện phụ tùng nào được thêm vào giỏ.</p>
                <button onClick={onContinueShopping} className="btn btn-danger font-weight-bold mt-2 px-4 py-2">
                    <i className="fa-solid fa-arrow-left mr-2"></i> QUAY LẠI CỬA HÀNG
                </button>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h3 className="font-weight-bold text-dark text-uppercase border-bottom border-danger pb-2 mb-4">
                <i className="fa-solid fa-cart-shopping text-danger mr-2"></i> Chi tiết giỏ hàng
            </h3>

            <div className="row">
                <div className="col-lg-8 mb-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-0 table-responsive">
                            <table className="table table-hover align-middle mb-0 text-center">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="text-left pl-4">Sản phẩm</th>
                                        <th>Đơn giá</th>
                                        <th style={{ width: '130px' }}>Số lượng</th>
                                        <th>Thành tiền</th>
                                        <th>Xóa</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.map(item => {
                                        const imgUrl = item.imageUrl?.startsWith('http') ? item.imageUrl : `${IMAGE_BASE_URL}${item.imageUrl}`;
                                        return (
                                            <tr key={item.id}>
                                                <td className="text-left pl-4">
                                                    <div className="d-flex align-items-center">
                                                        <img src={imgUrl} alt={item.name} className="img-thumbnail mr-3" style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
                                                        <div>
                                                            <h6 className="m-0 font-weight-bold text-dark text-truncate" style={{ maxWidth: '200px' }} title={item.name}>{item.name}</h6>
                                                            <small className="text-muted text-uppercase">{item.categoryName || 'Phụ tùng'}</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="font-weight-bold text-dark">{item.price.toLocaleString('vi-VN')} đ</td>
                                                <td>
                                                    <div className="input-group input-group-sm">
                                                        <div className="input-group-prepend">
                                                            <button className="btn btn-outline-secondary" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                                        </div>
                                                        <input type="text" className="form-control text-center font-weight-bold" value={item.quantity} readOnly />
                                                        <div className="input-group-append">
                                                            <button className="btn btn-outline-secondary" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="font-weight-bold text-danger">{(item.price * item.quantity).toLocaleString('vi-VN')} đ</td>
                                                <td>
                                                    <button className="btn btn-sm btn-outline-danger border-0" onClick={() => removeFromCart(item.id)}>
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <button onClick={onContinueShopping} className="btn btn-light shadow-sm font-weight-bold mt-3 border">
                        <i className="fa-solid fa-arrow-left text-danger mr-2"></i> Tiếp tục mua sắm
                    </button>
                </div>

                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 bg-dark text-white">
                        <div className="card-body p-4">
                            <h5 className="font-weight-bold text-uppercase border-bottom border-secondary pb-3 mb-4">Tóm tắt đơn hàng</h5>
                            <div className="d-flex justify-content-between mb-3">
                                <span>Tạm tính:</span>
                                <span className="font-weight-bold">{cartTotal.toLocaleString('vi-VN')} đ</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3 pb-3 border-bottom border-secondary">
                                <span>Phí giao hàng:</span>
                                <span className="text-success font-weight-bold">Miễn phí</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-end mb-4">
                                <span className="font-weight-bold" style={{ fontSize: '1.2rem' }}>TỔNG CỘNG:</span>
                                <span className="font-weight-bold text-danger" style={{ fontSize: '1.5rem' }}>{cartTotal.toLocaleString('vi-VN')} đ</span>
                            </div>
                            <button onClick={onCheckout} className="btn btn-danger btn-block btn-lg font-weight-bold text-uppercase rounded-pill shadow">
                                <i className="fa-solid fa-credit-card mr-2"></i> Tiến hành thanh toán
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;