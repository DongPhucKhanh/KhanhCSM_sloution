import React, { useState } from 'react';
import authService from '../services/authService';

const Login = ({ onSwitchToRegister, onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await authService.login(email, password);
            localStorage.setItem('currentUser', JSON.stringify(data.user)); // Lưu vào trình duyệt
            onLoginSuccess(data.user);
        } catch (err) {
            setError(err.response?.data?.message || "Sai email hoặc mật khẩu!");
        }
    };

    return (
        <div className="auth-form p-3">
            <h4 className="text-center font-weight-bold text-dark mb-4">ĐĂNG NHẬP</h4>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <form onSubmit={handleLogin}>
                <div className="form-group mb-3">
                    <label className="small font-weight-bold">EMAIL</label>
                    <input type="email" className="form-control" required value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="form-group mb-4">
                    <label className="small font-weight-bold">MẬT KHẨU</label>
                    <input type="password" className="form-control" required value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-danger btn-block font-weight-bold py-2">ĐĂNG NHẬP</button>
            </form>
            <div className="text-center mt-3 small">
                Chưa có tài khoản? <span className="text-danger font-weight-bold cursor-pointer" onClick={onSwitchToRegister} style={{ cursor: 'pointer' }}>Đăng ký ngay</span>
            </div>
        </div>
    );
};
export default Login;