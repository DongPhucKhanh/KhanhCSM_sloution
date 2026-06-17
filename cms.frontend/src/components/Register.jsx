// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
import React, { useState } from 'react';
import authService from '../services/authService';

const Register = ({ onSwitchToLogin }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // 🔥 BỔ SUNG: State lưu Số điện thoại và Địa chỉ
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        try {
            // 🔥 Truyền đủ 5 tham số sang service
            const response = await authService.register(fullName, email, password, phone, address);
            setSuccess(response.message || "Đăng ký thành công!");
            setTimeout(() => onSwitchToLogin(), 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Đăng ký thất bại!");
        }
    };

    return (
        <div className="auth-form p-3">
            <h4 className="text-center font-weight-bold text-dark mb-4">ĐĂNG KÝ TÀI KHOẢN</h4>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            {success && <div className="alert alert-success py-2">{success}</div>}

            <form onSubmit={handleRegister}>
                <div className="form-group mb-3">
                    <label className="small font-weight-bold">HỌ VÀ TÊN</label>
                    <input type="text" className="form-control" required value={fullName} onChange={e => setFullName(e.target.value)} />
                </div>

                <div className="form-group mb-3">
                    <label className="small font-weight-bold">EMAIL</label>
                    <input type="email" className="form-control" required value={email} onChange={e => setEmail(e.target.value)} />
                </div>

                {/* 🔥 BỔ SUNG: Ô nhập Số điện thoại */}
                <div className="form-group mb-3">
                    <label className="small font-weight-bold">SỐ ĐIỆN THOẠI (Tùy chọn)</label>
                    <input type="text" className="form-control" placeholder="09xx..." value={phone} onChange={e => setPhone(e.target.value)} />
                </div>

                {/* 🔥 BỔ SUNG: Ô nhập Địa chỉ giao hàng */}
                <div className="form-group mb-3">
                    <label className="small font-weight-bold">ĐỊA CHỈ GIAO HÀNG (Tùy chọn)</label>
                    <input type="text" className="form-control" placeholder="Số nhà, đường, phường, quận..." value={address} onChange={e => setAddress(e.target.value)} />
                </div>

                <div className="form-group mb-4">
                    <label className="small font-weight-bold">MẬT KHẨU</label>
                    <input type="password" className="form-control" required value={password} onChange={e => setPassword(e.target.value)} />
                </div>

                <button type="submit" className="btn btn-danger btn-block font-weight-bold py-2">TẠO TÀI KHOẢN</button>
            </form>

            <div className="text-center mt-3 small">
                Đã có tài khoản? <span className="text-danger font-weight-bold cursor-pointer" onClick={onSwitchToLogin} style={{ cursor: 'pointer' }}>Đăng nhập</span>
            </div>
        </div>
    );
};

export default Register;