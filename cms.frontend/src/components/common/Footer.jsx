// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();
    
    return (
        <footer className="bg-dark text-light mt-5 pt-5 pb-3 border-top border-danger">
            <div className="container-fluid px-xl-5">
                <div className="row">
                    <div className="col-md-4 mb-4">
                        <h5 className="text-danger font-weight-bold text-uppercase mb-3" style={{ fontSize: '1.1rem', letterSpacing: '1px' }}><i className="fa-solid fa-car-wrench mr-2"></i> KHANHCMS AUTOPARTS</h5>
                        <p className="small text-white-50" style={{ lineHeight: '1.8' }}>Chuỗi hệ thống cung ứng linh kiện phụ tùng thay thế nhanh và đồ chơi công nghệ ô tô thông minh đạt chuẩn ISO.</p>
                    </div>

                    <div className="col-md-4 mb-4 border-left-md pl-md-4 border-secondary">
                        <h5 className="text-danger font-weight-bold text-uppercase mb-3" style={{ fontSize: '1.1rem', letterSpacing: '1px' }}><i className="fa-solid fa-link mr-2"></i> LIÊN KẾT NHANH</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2"><span className="text-white-50 cursor-pointer hover-text-danger" onClick={() => navigate('/')}><i className="fa-solid fa-angle-right mr-2 text-danger"></i>Trang chủ</span></li>
                            <li className="mb-2"><span className="text-white-50 cursor-pointer hover-text-danger" onClick={() => navigate('/products')}><i className="fa-solid fa-angle-right mr-2 text-danger"></i>Sản phẩm</span></li>
                            <li className="mb-2"><span className="text-white-50 cursor-pointer hover-text-danger" onClick={() => navigate('/blog')}><i className="fa-solid fa-angle-right mr-2 text-danger"></i>Tin tức / Bài viết</span></li>
                        </ul>
                    </div>

                    <div className="col-md-4 mb-4 border-left-md pl-md-4 border-secondary">
                        <h5 className="text-danger font-weight-bold text-uppercase mb-3" style={{ fontSize: '1.1rem', letterSpacing: '1px' }}><i className="fa-solid fa-address-card mr-2"></i> THÔNG TIN THỰC HÀNH</h5>
                        <p className="small text-white-50 mb-2"><i className="fa-solid fa-user mr-2 text-danger"></i>Sinh viên: <strong className="text-white">Đồng Phúc Khánh</strong></p>
                        <p className="small text-white-50 mb-2"><i className="fa-solid fa-id-badge mr-2 text-danger"></i>Mã số sinh viên: <strong className="text-white">2123110051</strong></p>
                        <p className="small text-white-50"><i className="fa-solid fa-graduation-cap mr-2 text-danger"></i>Chuyên đề: ASP.NET Core &amp; ReactJS</p>
                    </div>
                </div>
                <div className="border-top border-secondary pt-4 mt-2 text-center text-white-50 small">
                    <p className="mb-0 text-uppercase font-weight-bold text-light">© 2026 HỆ THỐNG PHỤ TÙNG KHANHCMS - ĐỒ ÁN THỰC HÀNH CHUYÊN SÂU</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
