// Họ và tên: Đồng Phúc Khánh - MSSV: 2123110051
import React, { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext';

const Header = ({ loggedInUser, setLoggedInUser }) => {
    const navigate = useNavigate();
    const searchInputRef = useRef(null);
    const { cartCount, cartTotal } = useContext(CartContext);

    const handleSearch = (e) => {
        e.preventDefault();
        const kw = searchInputRef.current?.value.trim();
        if (kw) navigate(`/search?keyword=${encodeURIComponent(kw)}`);
    };

    const handleLogout = () => {
        localStorage.removeItem('khanhcms_user');
        setLoggedInUser(null);
        navigate('/');
    };

    return (
        <div className="sticky-top" style={{ zIndex: 1020, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            {/* TOP BAR ĐEN */}
            <div className="bg-dark text-white py-1">
                <div className="container-fluid px-xl-5 d-flex justify-content-between align-items-center" style={{ fontSize: '0.85rem' }}>
                    <div className="d-none d-md-block">
                        <i className="fa-solid fa-phone mr-2 text-danger"></i> <span className="font-weight-bold">Hotline: 0988.123.456</span>
                        <span className="mx-3 opacity-50">|</span>
                        <i className="fa-solid fa-envelope mr-2 text-danger"></i> contact@khanhcms.com
                    </div>
                    <div>
                        {loggedInUser ? (
                            <div className="d-flex align-items-center">
                                <span className="mr-3 font-weight-bold text-warning"><i className="fa-solid fa-user mr-1"></i> Xin chào, {loggedInUser.fullName}</span>
                                <span className="cursor-pointer text-white-50 hover-text-white transition-all" onClick={handleLogout}>
                                    <i className="fa-solid fa-right-from-bracket mr-1"></i> Đăng xuất
                                </span>
                            </div>
                        ) : (
                            <div>
                                <span className="cursor-pointer hover-text-danger transition-all font-weight-bold" onClick={() => navigate('/login')}><i className="fa-solid fa-user mr-1"></i> Đăng nhập</span>
                                <span className="mx-2 opacity-50">|</span>
                                <span className="cursor-pointer hover-text-danger transition-all font-weight-bold" onClick={() => navigate('/register')}><i className="fa-solid fa-user-plus mr-1"></i> Đăng ký</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* HEADER TRẮNG */}
            <header className="bg-white py-2 d-none d-lg-block">
                <div className="container-fluid px-xl-5 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center cursor-pointer" onClick={() => navigate('/')}>
                        <h1 className="text-danger font-weight-bold m-0" style={{ fontSize: '2rem', textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>KHANHCMS</h1>
                        <i className="fa-solid fa-tire text-dark fa-spin-slow ml-2" style={{ fontSize: '1.6rem' }}></i>
                    </div>
                    {/* FORM TÌM KIẾM */}
                    <form className="w-50 mx-4" onSubmit={handleSearch}>
                        <div className="input-group border border-danger rounded overflow-hidden">
                            <input
                                type="text"
                                className="form-control border-0"
                                placeholder="Tìm kiếm tên phụ tùng, thương hiệu..."
                                ref={searchInputRef}
                            />
                            <div className="input-group-append">
                                <button className="btn btn-danger px-4" type="submit">
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* GIỎ HÀNG */}
                    <div className="d-flex align-items-center cursor-pointer px-3 py-1 border rounded bg-light hover-shadow transition-all"
                        onClick={() => navigate('/cart')} style={{ height: '38px' }}>
                        <div className="position-relative mr-2">
                            <i className="fa-solid fa-cart-shopping fa-lg text-danger"></i>
                            {cartCount > 0 && (
                                <span
                                    className="position-absolute badge badge-pill border border-white"
                                    style={{
                                        top: '-8px', right: '-12px',
                                        fontSize: '0.65rem', padding: '0.25em 0.4em',
                                        backgroundColor: '#b30000',
                                        color: 'white'
                                    }}
                                >
                                    {cartCount}
                                </span>
                            )}
                        </div>
                        <div className="d-flex flex-column justify-content-center" style={{ lineHeight: '1.2' }}>
                            <span className="text-muted font-weight-bold" style={{ fontSize: '0.65rem' }}>GIỎ HÀNG</span>
                            <span className="font-weight-bold text-dark" style={{ fontSize: '0.85rem' }}>{cartTotal.toLocaleString('vi-VN')} đ</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* NAVBAR ĐỎ */}
            <nav className="navbar navbar-expand-lg navbar-dark custom-red-navbar py-0 shadow-sm">
                <div className="container-fluid px-xl-5">
                    <button className="navbar-toggler my-1 border-0" type="button" data-toggle="collapse" data-target="#mainNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="mainNav">
                        <ul className="navbar-nav mr-auto font-weight-bold text-uppercase" style={{ fontSize: '0.9rem' }}>
                            <li className="nav-item border-right border-danger-light">
                                <span className="nav-link text-white px-4 py-2 cursor-pointer hover-nav" onClick={() => navigate('/')}>Trang Chủ</span>
                            </li>
                            <li className="nav-item border-right border-danger-light">
                                <span className="nav-link text-white px-4 py-2 cursor-pointer hover-nav" onClick={() => navigate('/products')}>Sản Phẩm</span>
                            </li>
                            <li className="nav-item border-right border-danger-light">
                                <span className="nav-link text-white px-4 py-2 cursor-pointer hover-nav" onClick={() => navigate('/blog')}>Tin Tức / Bài Viết</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Header;
