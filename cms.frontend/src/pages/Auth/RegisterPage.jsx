// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp!");
            return;
        }

        try {
            await authService.register({ fullName, email, password });
            setSuccess("Đăng ký thành công! Đang chuyển hướng...");
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Lỗi đăng ký! Email có thể đã tồn tại.");
        }
    };

    return (
        <div className="container my-5 py-5">
            <div className="row justify-content-center">
                <div className="col-md-5 bg-white p-4 shadow-lg border rounded">
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
                            <div className="form-group mb-3">
                                <label className="small font-weight-bold">MẬT KHẨU</label>
                                <input type="password" className="form-control" required minLength="6" value={password} onChange={e => setPassword(e.target.value)} />
                            </div>
                            <div className="form-group mb-4">
                                <label className="small font-weight-bold">XÁC NHẬN MẬT KHẨU</label>
                                <input type="password" className="form-control" required minLength="6" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                            </div>
                            <button type="submit" className="btn btn-danger btn-block font-weight-bold py-2">ĐĂNG KÝ</button>
                        </form>
                        <div className="text-center mt-3 small">
                            Đã có tài khoản? <span className="text-danger font-weight-bold cursor-pointer" onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>Đăng nhập</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default RegisterPage;
