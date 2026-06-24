// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext';
import axiosClient from '../../services/api';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cart, cartTotal, clearCart } = useContext(CartContext);

    // Form states
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [notes, setNotes] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Khôi phục thông tin từ user đã đăng nhập
    useEffect(() => {
        const savedUser = localStorage.getItem('khanhcms_user');
        if (savedUser) {
            try {
                const userObj = JSON.parse(savedUser);
                if (userObj.fullName) setFullName(userObj.fullName);
                if (userObj.phone) setPhone(userObj.phone);
                if (userObj.address) setAddress(userObj.address);
            } catch (e) {
                console.error('Lỗi parse user:', e);
            }
        }
    }, []);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (cart.length === 0) {
            setError("Giỏ hàng của bạn đang trống!");
            return;
        }

        if (!fullName.trim() || !phone.trim() || !address.trim()) {
            setError("Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ giao hàng!");
            return;
        }

        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(phone.trim())) {
            setError("Số điện thoại không hợp lệ (Phải từ 10-11 số)!");
            return;
        }

        setIsSubmitting(true);

        const savedUser = localStorage.getItem('khanhcms_user');
        let customerId = null;
        if (savedUser) {
            try {
                customerId = JSON.parse(savedUser).id;
            } catch (err) {}
        }

        const orderData = {
            customerId: customerId,
            totalAmount: cartTotal,
            notes: notes,
            fullName: fullName,
            phone: phone,
            address: address,
            items: cart.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price
            }))
        };

        try {
            const response = await axiosClient.post('/CheckoutAPI', orderData);
            if (response.data?.success) {
                setSuccess("Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại KHANHCMS.");
                clearCart();
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setError(response.data?.message || "Có lỗi xảy ra khi đặt hàng.");
                setIsSubmitting(false);
            }
        } catch (err) {
            console.error('Lỗi khi thanh toán:', err);
            setError(err.response?.data?.message || "Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
            setIsSubmitting(false);
        }
    };

    if (cart.length === 0 && !success) {
        return (
            <div className="container py-5 mt-4 bg-white text-center shadow-sm rounded">
                <i className="fa-solid fa-box-open fa-4x text-muted mb-3"></i>
                <h4 className="text-dark font-weight-bold">Không có gì để thanh toán</h4>
                <p className="text-muted">Giỏ hàng của bạn đang trống.</p>
                <button onClick={() => navigate('/products')} className="btn btn-danger font-weight-bold mt-2 px-4 py-2">
                    <i className="fa-solid fa-arrow-left mr-2"></i> QUAY LẠI CỬA HÀNG
                </button>
            </div>
        );
    }

    return (
        <div className="container mt-4 mb-5">
            <h3 className="font-weight-bold text-dark text-uppercase border-bottom border-danger pb-2 mb-4">
                <i className="fa-solid fa-money-check-dollar text-danger mr-2"></i> Thanh toán đơn hàng
            </h3>

            {success ? (
                <div className="alert alert-success text-center py-5 shadow-sm">
                    <i className="fa-solid fa-circle-check fa-4x mb-3 text-success"></i>
                    <h3 className="font-weight-bold">{success}</h3>
                    <p className="text-muted">Hệ thống đang tự động quay về trang chủ...</p>
                </div>
            ) : (
                <div className="row">
                    <div className="col-lg-7 mb-4">
                        <div className="card shadow-sm border-0">
                            <div className="card-header bg-dark text-white font-weight-bold text-uppercase p-3">
                                <i className="fa-solid fa-address-book mr-2 text-danger"></i> Thông tin giao hàng
                            </div>
                            <div className="card-body p-4 bg-light">
                                {error && <div className="alert alert-danger py-2 px-3 font-weight-bold"><i className="fa-solid fa-triangle-exclamation mr-2"></i>{error}</div>}
                                <form onSubmit={handlePlaceOrder}>
                                    <div className="form-group mb-3">
                                        <label className="font-weight-bold small text-muted">HỌ VÀ TÊN NGƯỜI NHẬN <span className="text-danger">*</span></label>
                                        <input type="text" className="form-control border-secondary" placeholder="Nhập đầy đủ họ tên..." required value={fullName} onChange={(e) => setFullName(e.target.value)} />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="font-weight-bold small text-muted">SỐ ĐIỆN THOẠI LIÊN HỆ <span className="text-danger">*</span></label>
                                        <input type="tel" className="form-control border-secondary" placeholder="Ví dụ: 0988123456" required value={phone} onChange={(e) => setPhone(e.target.value)} />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="font-weight-bold small text-muted">ĐỊA CHỈ GIAO HÀNG (SỐ NHÀ, TÊN ĐƯỜNG, XÃ/PHƯỜNG, QUẬN/HUYỆN, TỈNH/THÀNH) <span className="text-danger">*</span></label>
                                        <textarea className="form-control border-secondary" rows="3" placeholder="Nhập địa chỉ chi tiết để shipper giao tận nơi..." required value={address} onChange={(e) => setAddress(e.target.value)}></textarea>
                                    </div>
                                    <div className="form-group mb-4">
                                        <label className="font-weight-bold small text-muted">GHI CHÚ ĐƠN HÀNG (TÙY CHỌN)</label>
                                        <textarea className="form-control border-secondary" rows="2" placeholder="Ghi chú về thời gian giao hàng, chỉ đường..." value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-danger btn-block btn-lg font-weight-bold text-uppercase shadow rounded-pill" disabled={isSubmitting}>
                                        {isSubmitting ? <><i className="fa-solid fa-spinner fa-spin mr-2"></i> ĐANG XỬ LÝ...</> : <><i className="fa-solid fa-check mr-2"></i> XÁC NHẬN ĐẶT HÀNG MUA NGAY</>}
                                    </button>
                                    <button type="button" onClick={() => navigate('/cart')} className="btn btn-outline-secondary btn-block mt-3 font-weight-bold text-uppercase rounded-pill" disabled={isSubmitting}>
                                        <i className="fa-solid fa-arrow-left mr-2"></i> QUAY LẠI GIỎ HÀNG
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-5">
                        <div className="card shadow-sm border-0 border-top border-danger" style={{ borderWidth: '4px !important' }}>
                            <div className="card-header bg-white font-weight-bold text-uppercase p-3 border-bottom text-dark">
                                <i className="fa-solid fa-receipt mr-2 text-danger"></i> Đơn hàng của bạn ({cart.length} sản phẩm)
                            </div>
                            <div className="card-body p-0">
                                <ul className="list-group list-group-flush custom-scrollbar" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                    {cart.map(item => (
                                        <li key={item.id} className="list-group-item d-flex justify-content-between lh-condensed align-items-center p-3">
                                            <div style={{ maxWidth: '65%' }}>
                                                <h6 className="my-0 font-weight-bold text-dark text-truncate" title={item.name}>{item.name}</h6>
                                                <small className="text-muted">SL: {item.quantity} x {item.price.toLocaleString('vi-VN')} đ</small>
                                            </div>
                                            <span className="text-danger font-weight-bold text-right" style={{ maxWidth: '35%' }}>
                                                {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="card-footer bg-light p-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="text-muted font-weight-bold">Tạm tính:</span>
                                    <span className="font-weight-bold">{cartTotal.toLocaleString('vi-VN')} đ</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="text-muted font-weight-bold">Phí vận chuyển:</span>
                                    <span className="text-success font-weight-bold">0 đ (Freeship)</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center border-top border-danger-light pt-3">
                                    <span className="text-dark font-weight-bold text-uppercase" style={{ fontSize: '1.2rem' }}>TỔNG THANH TOÁN:</span>
                                    <strong className="text-danger" style={{ fontSize: '1.5rem' }}>{cartTotal.toLocaleString('vi-VN')} đ</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutPage;
